import { describe, it, expect } from "vitest";
import { websocketRouter } from "./websocket.router";
import { badgesRouter } from "./badges.router";
import { emailServiceRouter } from "./email-service.router";

const mockUser = { id: 1, name: "Test User", email: "test@test.com", role: "user" as const, subscriptionTier: "free" as const };

describe("WebSocket Router", () => {
  describe("connect", () => {
    it("should create socket connection", async () => {
      const caller = websocketRouter.createCaller({} as any);
      const result = await caller.connect({ userId: 1 });
      expect(result.socketId).toMatch(/^socket-/);
      expect(result.status).toBe("connected");
    });
  });

  describe("getPresence", () => {
    it("should return connection presence", async () => {
      const caller = websocketRouter.createCaller({} as any);
      const result = await caller.getPresence();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe("Badges Router", () => {
  describe("list", () => {
    it("should return all badges", async () => {
      const caller = badgesRouter.createCaller({} as any);
      const result = await caller.list();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getLeaderboard", () => {
    it("should return badge leaderboard", async () => {
      const caller = badgesRouter.createCaller({} as any);
      const result = await caller.getLeaderboard({ limit: 10 });
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe("Email Service Router", () => {
  describe("getPreferences", () => {
    it("should return email preferences", async () => {
      const caller = emailServiceRouter.createCaller({ user: mockUser } as any);
      const result = await caller.getPreferences();
      expect(result).toHaveProperty("streakReminders");
    });
  });

  describe("updatePreferences", () => {
    it("should update preferences", async () => {
      const caller = emailServiceRouter.createCaller({ user: mockUser } as any);
      const result = await caller.updatePreferences({ streakReminders: false });
      expect(result.success).toBe(true);
    });
  });
});