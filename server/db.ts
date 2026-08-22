import { and, desc, eq, inArray, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, notifications, rides, routes, smartPoolMembers, smartPools, users } from "../drizzle/schema";
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
  for (const field of ["name", "email", "loginMethod", "dateOfBirth", "college", "course", "city", "routeId", "pickupPoint", "bio", "profileImage", "interests", "preferences"] as const) {
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

export async function getImpact() {
  const db = await getDb(); if (!db) return { pools: 0, students: 0, tripsReduced: 0, co2Saved: 0, averagePoolSize: 0, popularRoute: "—" };
  const pools = await db.select().from(smartPools);
  const members = await db.select().from(smartPoolMembers);
  const routeCounts = await db.select({ routeId: smartPools.routeId, count: sql<number>`count(*)` }).from(smartPools).groupBy(smartPools.routeId).orderBy(desc(sql`count(*)`)).limit(1);
  const popular = routeCounts[0] ? await getRoute(routeCounts[0].routeId) : undefined;
  const tripsReduced = Math.max(0, members.length - pools.length);
  return { pools: pools.length, students: members.length, tripsReduced, co2Saved: tripsReduced * 2.4, averagePoolSize: pools.length ? Math.round((members.length / pools.length) * 10) / 10 : 0, popularRoute: popular?.routeNumber ?? "—" };
}

export { notifications, rides, routes, smartPoolMembers, smartPools, users };
