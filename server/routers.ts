import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { ONE_YEAR_MS } from "@shared/const";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { countRegisteredUsers, createLocalUser, createNotification, ensureRoutes, getDb, getImpact, getRoute, getUserByEmail, getUserByOpenId, listDiscoverableRides, listJoinedPools, listPools, listRides, listRoutes, notifications, rides, smartPoolMembers, smartPools, upsertUser, users } from "./db";

const poolInput = z.object({ routeId: z.number().int().positive(), pickupPoint: z.string().min(2), departureTime: z.string().min(3), capacity: z.number().int().min(2).max(8) });
const rideInput = z.object({ routeId: z.number().int().positive(), pickupPoint: z.string().min(2), destination: z.string().min(2), date: z.string().min(8), time: z.string().min(3), availableSeats: z.number().int().min(1).max(8), notes: z.string().max(500).optional() });
const profileInput = z.object({ name: z.string().min(2).max(120), college: z.string().max(255).optional(), course: z.string().max(255).optional(), city: z.string().max(255).optional(), routeId: z.number().int().positive().nullable().optional(), pickupPoint: z.string().max(255).optional(), bio: z.string().max(500).optional(), interests: z.string().max(500).optional(), preferences: z.string().max(500).optional(), profileImage: z.string().url().optional().or(z.literal("")) });

const publicUser = (user: any) => { if (!user) return user; const { passwordHash, ...safe } = user; return safe; };
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const hashPassword = (password: string) => { const salt = randomBytes(16).toString("hex"); const hash = scryptSync(password, salt, 64).toString("hex"); return `${salt}:${hash}`; };
const verifyPassword = (password: string, stored: string) => { const [salt, expected] = stored.split(":"); if (!salt || !expected) return false; const actual = scryptSync(password, salt, 64); const expectedBuffer = Buffer.from(expected, "hex"); return expectedBuffer.length === actual.length && timingSafeEqual(actual, expectedBuffer); };
async function currentUser(openId: string) { return publicUser(await getUserByOpenId(openId)); }

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => publicUser(ctx.user)),
    registeredCount: publicProcedure.query(() => countRegisteredUsers()),
    signup: publicProcedure.input(z.object({ name: z.string().min(2).max(120), email: z.string().email().max(320), password: z.string().min(8).max(200), college: z.string().max(255).optional(), course: z.string().max(255).optional(), city: z.string().max(255).optional(), routeId: z.number().int().positive().nullable().optional(), pickupPoint: z.string().max(255).optional() })).mutation(async ({ ctx, input }) => { const email = normalizeEmail(input.email); if (await getUserByEmail(email)) throw new Error("An account with this email already exists"); const user = await createLocalUser({ openId: `local_${randomUUID()}`, email, name: input.name.trim(), passwordHash: hashPassword(input.password), loginMethod: "password", college: input.college, course: input.course, city: input.city, routeId: input.routeId, pickupPoint: input.pickupPoint }); if (!user) throw new Error("Could not create account"); const token = await sdk.signSession({ openId: user.openId, appId: ENV.appId, name: user.name ?? input.name }); ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS }); return publicUser(user); }),
    login: publicProcedure.input(z.object({ email: z.string().email().max(320), password: z.string().min(1).max(200) })).mutation(async ({ ctx, input }) => { const user = await getUserByEmail(normalizeEmail(input.email)); if (!user?.passwordHash || !verifyPassword(input.password, user.passwordHash)) throw new Error("Invalid email or password"); await upsertUser({ openId: user.openId, lastSignedIn: new Date() }); const fresh = await getUserByOpenId(user.openId); if (!fresh) throw new Error("Account not found"); const token = await sdk.signSession({ openId: fresh.openId, appId: ENV.appId, name: fresh.name ?? "SmartRide user" }); ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS }); return publicUser(fresh); }),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  routes: router({
    list: publicProcedure.input(z.object({ query: z.string().optional(), routeType: z.enum(["campus", "local"]).optional() }).optional()).query(({ input }) => listRoutes(input?.query, input?.routeType)),
    byId: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getRoute(input.id)),
    seed: publicProcedure.mutation(() => ensureRoutes()),
  }),
  pools: router({
    mine: protectedProcedure.query(({ ctx }) => listJoinedPools(ctx.user.id)),
    list: publicProcedure.input(z.object({ routeId: z.number().int().positive().optional() }).optional()).query(({ input }) => listPools(input?.routeId)),
    create: protectedProcedure.input(poolInput).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const route = await getRoute(input.routeId); if (!route) throw new Error("Route not found"); const result = await db.insert(smartPools).values({ ...input, creatorId: ctx.user.id }); const poolId = Number(result[0].insertId); await db.insert(smartPoolMembers).values({ smartPoolId: poolId, userId: ctx.user.id }); return { id: poolId, success: true }; }),
    join: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const poolRows = await db.select().from(smartPools).where(eq(smartPools.id, input.id)).limit(1); const pool = poolRows[0]; if (!pool || pool.status !== "open") throw new Error("This Smart Pool is not available"); const existing = await db.select().from(smartPoolMembers).where(and(eq(smartPoolMembers.smartPoolId, input.id), eq(smartPoolMembers.userId, ctx.user.id))).limit(1); if (existing.length) throw new Error("You are already in this Smart Pool"); const members = await db.select().from(smartPoolMembers).where(eq(smartPoolMembers.smartPoolId, input.id)); if (members.length >= pool.capacity) throw new Error("This Smart Pool is full"); await db.insert(smartPoolMembers).values({ smartPoolId: input.id, userId: ctx.user.id }); if (pool.creatorId !== ctx.user.id) await createNotification(pool.creatorId, "pool_joined", `${ctx.user.name ?? "A student"} joined your ${pool.pickupPoint} Smart Pool.`); if (members.length + 1 >= pool.capacity) await db.update(smartPools).set({ status: "full" }).where(eq(smartPools.id, input.id)); return { success: true }; }),
    leave: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.delete(smartPoolMembers).where(and(eq(smartPoolMembers.smartPoolId, input.id), eq(smartPoolMembers.userId, ctx.user.id))); await db.update(smartPools).set({ status: "open" }).where(eq(smartPools.id, input.id)); return { success: true }; }),
    cancel: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const pool = (await db.select().from(smartPools).where(eq(smartPools.id, input.id)).limit(1))[0]; if (!pool || pool.creatorId !== ctx.user.id) throw new Error("Only the creator can cancel this pool"); await db.update(smartPools).set({ status: "cancelled" }).where(eq(smartPools.id, input.id)); return { success: true }; }),
  }),
  rides: router({
    list: protectedProcedure.query(({ ctx }) => listRides(ctx.user.id)),
    discover: protectedProcedure.input(z.object({ query: z.string().max(120).optional(), routeType: z.enum(["campus", "local"]).optional(), date: z.string().max(16).optional() }).optional()).query(({ input }) => listDiscoverableRides(input)),
    create: protectedProcedure.input(rideInput).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); if (!(await getRoute(input.routeId))) throw new Error("Route not found"); const result = await db.insert(rides).values({ ...input, creatorId: ctx.user.id }); return { id: Number(result[0].insertId), success: true }; }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive() }).and(rideInput)).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const ride = (await db.select().from(rides).where(eq(rides.id, input.id)).limit(1))[0]; if (!ride || ride.creatorId !== ctx.user.id) throw new Error("Only the creator can edit this ride"); const { id, ...changes } = input; await db.update(rides).set(changes).where(eq(rides.id, id)); return { success: true }; }),
    cancel: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const ride = (await db.select().from(rides).where(eq(rides.id, input.id)).limit(1))[0]; if (!ride || ride.creatorId !== ctx.user.id) throw new Error("Only the creator can cancel this ride"); await db.update(rides).set({ status: "cancelled" }).where(eq(rides.id, input.id)); return { success: true }; }),
  }),
  profile: router({
    me: protectedProcedure.query(({ ctx }) => currentUser(ctx.user.openId)),
    update: protectedProcedure.input(profileInput).mutation(async ({ ctx, input }) => { await upsertUser({ openId: ctx.user.openId, ...input }); return currentUser(ctx.user.openId); }),
  }),
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => { const db = await getDb(); if (!db) return []; return db.select().from(notifications).where(eq(notifications.userId, ctx.user.id)).orderBy(notifications.createdAt); }),
    markRead: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.update(notifications).set({ read: 1 }).where(and(eq(notifications.id, input.id), eq(notifications.userId, ctx.user.id))); return { success: true }; }),
  }),
  impact: router({ summary: publicProcedure.query(() => getImpact()) }),
  commandCenter: router({ summary: publicProcedure.query(async () => { const routes = await listRoutes(); const pools = await listPools(); const impact = await getImpact(); return { activeRoutes: routes.length, activePools: pools.length, availableSeats: pools.reduce((sum, p) => sum + Math.max(0, p.pool.capacity - p.members.length), 0), studentsSearching: pools.reduce((sum, p) => sum + p.members.length, 0), impact }; }) }),
});

export type AppRouter = typeof appRouter;
