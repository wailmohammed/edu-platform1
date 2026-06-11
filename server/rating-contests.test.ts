import { describe, it, expect } from "vitest";
import { ratingRouter } from "./rating.router";
import { contestsRouter } from "./contests.router";

const mockUser = { id: 1, name: "Test User", email: "test@test.com", role: "user" as const, subscriptionTier: "free" as const };

describe("Rating Router", () => {
  describe("getRating", () => {
    it("should return user rating and division", async () => {
      const caller = ratingRouter.createCaller({ user: mockUser } as any);
      const result = await caller.getRating();
      expect(result).toHaveProperty("rating");
      expect(result).toHaveProperty("division");
    });
  });

  describe("getDivisionInfo", () => {
    it("should return division information", async () => {
      const caller = ratingRouter.createCaller({} as any);
      const result = await caller.getDivisionInfo();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
    });
  });
});

describe("Contests Router", () => {
  describe("getUpcoming", () => {
    it("should return upcoming contests", async () => {
      const caller = contestsRouter.createCaller({} as any);
      const result = await caller.getUpcoming();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("register", () => {
    it("should register for contest", async () => {
      const caller = contestsRouter.createCaller({ user: mockUser } as any);
      const result = await caller.register({ contestId: 1 });
      expect(result.success).toBe(true);
    });
  });
});