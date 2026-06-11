import { describe, it, expect, vi, beforeEach } from "vitest";
import { portfolioRouter } from "./portfolio.router";
import { adminRouter } from "./admin.router";

const mockUser = { id: 1, name: "Test User", email: "test@test.com", role: "user" as const, subscriptionTier: "free" as const };
const mockAdmin = { id: 2, name: "Admin User", email: "admin@test.com", role: "admin" as const, subscriptionTier: "premium" as const };

describe("Portfolio Router", () => {
  describe("get", () => {
    it("should return user portfolio", async () => {
      const caller = portfolioRouter.createCaller({ user: mockUser } as any);
      const result = await caller.get();
      expect(result).toHaveProperty("id", mockUser.id);
    });
  });

  describe("update", () => {
    it("should update portfolio", async () => {
      const caller = portfolioRouter.createCaller({ user: mockUser } as any);
      const result = await caller.update({ bio: "New bio" });
      expect(result.success).toBe(true);
    });
  });

  describe("addProject", () => {
    it("should add project to portfolio", async () => {
      const caller = portfolioRouter.createCaller({ user: mockUser } as any);
      const result = await caller.addProject({
        title: "Test Project",
        description: "A test project",
        technologies: ["React"],
      });
      expect(result.success).toBe(true);
      expect(result.project).toHaveProperty("title", "Test Project");
    });
  });

  describe("getPublic", () => {
    it("should return public portfolio", async () => {
      const caller = portfolioRouter.createCaller({} as any);
      const result = await caller.getPublic({ userId: mockUser.id });
      expect(result).toBeDefined();
    });
  });
});

describe("Admin Router", () => {
  describe("getStats", () => {
    it("should return stats for admin", async () => {
      const caller = adminRouter.createCaller({ user: mockAdmin } as any);
      const result = await caller.getStats();
      expect(result).toHaveProperty("totalUsers");
    });

    it("should throw for non-admin", async () => {
      const caller = adminRouter.createCaller({ user: mockUser } as any);
      await expect(caller.getStats()).rejects.toThrow("Unauthorized");
    });
  });

  describe("getCourses", () => {
    it("should return courses for admin", async () => {
      const caller = adminRouter.createCaller({ user: mockAdmin } as any);
      const result = await caller.getCourses();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getUsers", () => {
    it("should return users for admin", async () => {
      const caller = adminRouter.createCaller({ user: mockAdmin } as any);
      const result = await caller.getUsers({ limit: 10 });
      expect(result).toHaveProperty("users");
      expect(result).toHaveProperty("total");
    });
  });
});