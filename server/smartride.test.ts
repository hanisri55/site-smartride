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
