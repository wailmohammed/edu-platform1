import { describe, it, expect } from "vitest";
import { weeklyChallengesRouter } from "./weekly-challenges.router";
import { certificationsRouter } from "./certifications.router";

const mockUser = { id: 1, name: "Test User", email: "test@test.com", role: "user" as const, subscriptionTier: "free" as const };

describe("Weekly Challenges Router", () => {
  describe("getCurrent", () => {
    it("should return current challenge", async () => {
      const caller = weeklyChallengesRouter.createCaller({} as any);
      const result = await caller.getCurrent();
      expect(result).toHaveProperty("title");
    });
  });

  describe("getLeaderboard", () => {
    it("should return leaderboard", async () => {
      const caller = weeklyChallengesRouter.createCaller({} as any);
      const result = await caller.getLeaderboard();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe("Certifications Router", () => {
  describe("list", () => {
    it("should return certifications", async () => {
      const caller = certificationsRouter.createCaller({} as any);
      const result = await caller.list();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("startAttempt", () => {
    it("should start certification attempt", async () => {
      const caller = certificationsRouter.createCaller({ user: mockUser } as any);
      const result = await caller.startAttempt({ certificationId: 1 });
      expect(result.success).toBe(true);
      expect(result.attemptId).toBeGreaterThan(0);
    });
  });

  describe("getUserCertificates", () => {
    it("should return user certificates", async () => {
      const caller = certificationsRouter.createCaller({ user: mockUser } as any);
      const result = await caller.getUserCertificates();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});