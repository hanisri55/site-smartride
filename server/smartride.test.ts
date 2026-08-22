import { describe, expect, it } from "vitest";
import { allRouteSeeds, routeSeeds } from "../shared/routes";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("SASI SmartRide route catalog", () => {
  it("contains the complete campus catalog plus local variants", () => {
    expect(routeSeeds).toHaveLength(42);
    expect(allRouteSeeds.length).toBeGreaterThan(42);
    expect(allRouteSeeds.every((route) => route.stops.length >= 3)).toBe(true);
    expect(allRouteSeeds.some((route) => route.routeNumber === "TPG-L1")).toBe(true);
  });
});

describe("public impact summary", () => {
  it("returns a safe shaped response when persistence is unavailable", async () => {
    const ctx: TrpcContext = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
    const result = await appRouter.createCaller(ctx).impact.summary();
    expect(result).toMatchObject({ pools: expect.any(Number), students: expect.any(Number), co2Saved: expect.any(Number) });
  });
});

describe("protected SmartRide procedures", () => {
  it("reject unauthenticated pool creation", async () => {
    const ctx: TrpcContext = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
    await expect(appRouter.createCaller(ctx).pools.create({ routeId: 1, pickupPoint: "Railway Station", departureTime: "08:00", capacity: 4 })).rejects.toThrow();
  });
});


describe("multi-account auth contract", () => {
  it("keeps two account identities separate and strips password hashes", async () => {
    const makeContext = (id: number, openId: string, name: string, email: string): TrpcContext => ({
      user: { id, openId, name, email, passwordHash: "never-return-this", role: "user", loginMethod: "password", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } as any,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });
    const accountA = await appRouter.createCaller(makeContext(101, "local-a", "Student A", "a@example.com")).auth.me();
    const accountB = await appRouter.createCaller(makeContext(102, "local-b", "Student B", "b@example.com")).auth.me();
    expect(accountA).toMatchObject({ id: 101, openId: "local-a", name: "Student A", email: "a@example.com" });
    expect(accountB).toMatchObject({ id: 102, openId: "local-b", name: "Student B", email: "b@example.com" });
    expect(accountA).not.toEqual(accountB);
    expect(accountA).not.toHaveProperty("passwordHash");
    expect(accountB).not.toHaveProperty("passwordHash");
  });
});
