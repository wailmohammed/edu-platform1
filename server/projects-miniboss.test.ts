import { describe, it, expect } from "vitest";
import { projectsRouter } from "./projects.router";
import { minibossRouter } from "./miniboss.router";

const mockUser = { id: 1, name: "Test User", email: "test@test.com", role: "user" as const, subscriptionTier: "free" as const };

describe("Projects Router", () => {
  describe("listAll", () => {
    it("should return all projects", async () => {
      const caller = projectsRouter.createCaller({} as any);
      const result = await caller.listAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getById", () => {
    it("should return project by ID", async () => {
      const caller = projectsRouter.createCaller({} as any);
      const result = await caller.getById({ projectId: 1 });
      expect(result).not.toBeNull();
      expect(result?.title).toBe("Tribute Page");
    });
  });

  describe("submit", () => {
    it("should submit project", async () => {
      const caller = projectsRouter.createCaller({ user: mockUser } as any);
      const result = await caller.submit({ projectId: 1, code: "<html></html>" });
      expect(result.success).toBe(true);
    });
  });
});

describe("Miniboss Router", () => {
  describe("listAll", () => {
    it("should return all miniboss challenges", async () => {
      const caller = minibossRouter.createCaller({} as any);
      const result = await caller.listAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getByCourse", () => {
    it("should return challenges for course", async () => {
      const caller = minibossRouter.createCaller({} as any);
      const result = await caller.getByCourse({ courseId: 1 });
      expect(Array.isArray(result)).toBe(true);
    });
  });
});