import { and, desc, eq, inArray, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, emailVerifications, notifications, passwordResets, rideRequests, rides, routes, smartPoolMembers, smartPools, users } from "../drizzle/schema";
import { allRouteSeeds } from "../shared/routes";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod", "dateOfBirth", "college", "course", "city", "routeId", "pickupPoint", "bio", "profileImage", "phoneNumber", "studyYear", "gender", "genderPreference", "verificationStatus", "interests", "preferences"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] as never; updateSet[field] = user[field] ?? null; }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date(); updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0];
}

export async function countRegisteredUsers() {
  const db = await getDb(); if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(users);
  return Number(result[0]?.count ?? 0);
}

export async function getUserByEmail(email: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1); return result[0];
}

export async function createLocalUser(input: InsertUser) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const result = await db.insert(users).values(input);
  return getUserByOpenId(input.openId);
}

export async function ensureRoutes() {
  const db = await getDb(); if (!db) return [];
  const existing = await db.select().from(routes);
  if (existing.length === 0) {
    await db.insert(routes).values(allRouteSeeds.map((route) => ({ ...route, stops: JSON.stringify(route.stops) })));
    return await db.select().from(routes);
  }
  return existing;
}

export async function listRoutes(query?: string, routeType?: "campus" | "local") {
  const db = await getDb(); if (!db) return [];
  await ensureRoutes();
  const conditions = [];
  if (query) conditions.push(or(like(routes.routeNumber, `%${query}%`), like(routes.routeName, `%${query}%`), like(routes.origin, `%${query}%`), like(routes.destination, `%${query}%`), like(routes.stops, `%${query}%`)));
  if (routeType) conditions.push(eq(routes.routeType, routeType));
  return conditions.length ? db.select().from(routes).where(and(...conditions)).orderBy(routes.routeNumber) : db.select().from(routes).orderBy(routes.routeNumber);
}

export async function getRoute(id: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(routes).where(eq(routes.id, id)).limit(1); return result[0];
}

export async function listRides(userId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({ ride: rides, route: routes }).from(rides).leftJoin(routes, eq(rides.routeId, routes.id)).where(eq(rides.creatorId, userId)).orderBy(desc(rides.createdAt));
}

export async function listDiscoverableRides(filters?: { query?: string; routeType?: "campus" | "local"; date?: string; viewerId?: number }) {
  const db = await getDb(); if (!db) return [];
  const conditions = [eq(rides.status, "upcoming")];
  if (filters?.query) {
    const q = `%${filters.query}%`;
    conditions.push(or(like(routes.routeNumber, q), like(routes.routeName, q), like(routes.origin, q), like(routes.destination, q), like(rides.pickupPoint, q), like(rides.destination, q), like(rides.notes, q)) as any);
  }
  if (filters?.routeType) conditions.push(eq(routes.routeType, filters.routeType) as any);
  if (filters?.date) conditions.push(eq(rides.date, filters.date) as any);
  const rows = await db.select({ ride: rides, route: routes, creator: users }).from(rides).leftJoin(routes, eq(rides.routeId, routes.id)).leftJoin(users, eq(rides.creatorId, users.id)).where(and(...conditions)).orderBy(rides.date, rides.time, desc(rides.createdAt));
  const viewer = filters?.viewerId ? (await db.select().from(users).where(eq(users.id, filters.viewerId)).limit(1))[0] : undefined;
  return rows.map((row) => {
    let score = 40;
    const reasons: string[] = [];
    if (viewer?.routeId && viewer.routeId === row.ride.routeId) { score += 25; reasons.push("Same route"); }
    if (viewer?.pickupPoint && viewer.pickupPoint.trim().toLowerCase() === row.ride.pickupPoint.trim().toLowerCase()) { score += 20; reasons.push("Same pickup point"); }
    if (viewer?.city && row.route?.origin && viewer.city.trim().toLowerCase() === row.route.origin.trim().toLowerCase()) { score += 10; reasons.push("Same town"); }
    if (viewer?.genderPreference && row.ride.genderPreference && (viewer.genderPreference === "any" || viewer.genderPreference === row.ride.genderPreference)) { score += 5; reasons.push("Preference compatible"); }
    if (row.ride.availableSeats > 0) { score += 5; reasons.push("Seats available"); }
    return { ...row, matchScore: Math.min(99, score), matchReasons: reasons.length ? reasons : ["Route and date match"] };
  });
}

export async function listJoinedPools(userId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({ pool: smartPools, route: routes }).from(smartPoolMembers).innerJoin(smartPools, eq(smartPoolMembers.smartPoolId, smartPools.id)).leftJoin(routes, eq(smartPools.routeId, routes.id)).where(eq(smartPoolMembers.userId, userId)).orderBy(desc(smartPools.createdAt));
}

export async function listPools(routeId?: number) {
  const db = await getDb(); if (!db) return [];
  const rows = routeId ? await db.select({ pool: smartPools, route: routes }).from(smartPools).leftJoin(routes, eq(smartPools.routeId, routes.id)).where(and(eq(smartPools.routeId, routeId), eq(smartPools.status, "open"))).orderBy(desc(smartPools.createdAt)) : await db.select({ pool: smartPools, route: routes }).from(smartPools).leftJoin(routes, eq(smartPools.routeId, routes.id)).where(eq(smartPools.status, "open")).orderBy(desc(smartPools.createdAt));
  const ids = rows.map((r) => r.pool.id);
  const members = ids.length ? await db.select().from(smartPoolMembers).where(inArray(smartPoolMembers.smartPoolId, ids)) : [];
  return rows.map((row) => ({ ...row, members: members.filter((m) => m.smartPoolId === row.pool.id) }));
}

export async function createNotification(userId: number, type: string, message: string) {
  const db = await getDb(); if (!db) return;
  await db.insert(notifications).values({ userId, type, message });
}

export async function createRideRequest(input: { rideId: number; requesterId: number; message?: string }) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(rideRequests).where(and(eq(rideRequests.rideId, input.rideId), eq(rideRequests.requesterId, input.requesterId))).limit(1);
  if (existing.length) throw new Error("You already requested this ride");
  const result = await db.insert(rideRequests).values(input);
  return Number(result[0].insertId);
}

export async function listRideRequestsForRequester(userId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({ request: rideRequests, ride: rides, route: routes }).from(rideRequests).innerJoin(rides, eq(rideRequests.rideId, rides.id)).leftJoin(routes, eq(rides.routeId, routes.id)).where(eq(rideRequests.requesterId, userId)).orderBy(desc(rideRequests.createdAt));
}

export async function listRideRequestsForCreator(userId: number) {
  const db = await getDb(); if (!db) return [];
  const rows = await db.select({ request: rideRequests, ride: rides, route: routes }).from(rideRequests).innerJoin(rides, eq(rideRequests.rideId, rides.id)).leftJoin(routes, eq(rides.routeId, routes.id)).where(eq(rides.creatorId, userId)).orderBy(desc(rideRequests.createdAt));
  return Promise.all(rows.map(async (item) => ({ ...item, requester: (await db.select().from(users).where(eq(users.id, item.request.requesterId)).limit(1))[0] })));

}

export async function getRideRequest(id: number) {
  const db = await getDb(); if (!db) return undefined;
  return (await db.select({ request: rideRequests, ride: rides }).from(rideRequests).innerJoin(rides, eq(rideRequests.rideId, rides.id)).where(eq(rideRequests.id, id)).limit(1))[0];
}

export async function createPasswordReset(userId: number, tokenHash: string, expiresAt: Date) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.update(passwordResets).set({ usedAt: new Date() }).where(and(eq(passwordResets.userId, userId), eq(passwordResets.usedAt, null as any)));
  await db.insert(passwordResets).values({ userId, tokenHash, expiresAt });
}

export async function getPasswordReset(tokenHash: string) {
  const db = await getDb(); if (!db) return undefined;
  return (await db.select().from(passwordResets).where(eq(passwordResets.tokenHash, tokenHash)).limit(1))[0];
}

export async function consumePasswordReset(id: number) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.update(passwordResets).set({ usedAt: new Date() }).where(eq(passwordResets.id, id));
}

export async function createEmailVerification(userId: number, tokenHash: string, expiresAt: Date) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.insert(emailVerifications).values({ userId, tokenHash, expiresAt });
}

export async function getEmailVerification(tokenHash: string) {
  const db = await getDb(); if (!db) return undefined;
  return (await db.select().from(emailVerifications).where(eq(emailVerifications.tokenHash, tokenHash)).limit(1))[0];
}

export async function getImpact() {
  const db = await getDb(); if (!db) return { pools: 0, students: 0, tripsReduced: 0, co2Saved: 0, averagePoolSize: 0, popularRoute: "—" };
  const pools = await db.select().from(smartPools);
  const members = await db.select().from(smartPoolMembers);
  const routeCounts = await db.select({ routeId: smartPools.routeId, count: sql<number>`count(*)` }).from(smartPools).groupBy(smartPools.routeId).orderBy(desc(sql`count(*)`)).limit(1);
  const popular = routeCounts[0] ? await getRoute(routeCounts[0].routeId) : undefined;
  const tripsReduced = Math.max(0, members.length - pools.length);
  return { pools: pools.length, students: members.length, tripsReduced, co2Saved: tripsReduced * 2.4, averagePoolSize: pools.length ? Math.round((members.length / pools.length) * 10) / 10 : 0, popularRoute: popular?.routeNumber ?? "—" };
}

export { emailVerifications, notifications, passwordResets, rideRequests, rides, routes, smartPoolMembers, smartPools, users };
