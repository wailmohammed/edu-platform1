import { describe, it, expect } from "vitest";
import { monitoringRouter } from "./monitoring.router";

describe("Monitoring Router", () => {
  describe("health", () => {
    it("should return healthy status", async () => {
      const caller = monitoringRouter.createCaller({} as any);
      const result = await caller.health();
      expect(result.status).toBe("healthy");
      expect(result.checks).toBeDefined();
    });
  });

  describe("reportError", () => {
    it("should report error and return success", async () => {
      const caller = monitoringRouter.createCaller({ user: { id: 1, role: "user" } } as any);
      const result = await caller.reportError({
        message: "Test error",
        severity: "medium",
      });
      expect(result.success).toBe(true);
      expect(result.reportId).toBeDefined();
    });
  });

  describe("getErrors", () => {
    it("should require admin role", async () => {
      const caller = monitoringRouter.createCaller({ user: { id: 1, role: "user" } } as any);
      await expect(caller.getErrors({})).rejects.toThrow("Unauthorized");
    });
  });

  describe("getPerformanceMetrics", () => {
    it("should return metrics", async () => {
      const caller = monitoringRouter.createCaller({} as any);
      const result = await caller.getPerformanceMetrics();
      expect(result.errorRate).toBeDefined();
      expect(result.requestsPerMinute).toBeGreaterThan(0);
    });
  });
});