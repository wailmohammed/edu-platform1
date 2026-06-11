import { describe, it, expect, vi, beforeEach } from "vitest";
import { problemBuilderRouter } from "./problem-builder.router";

// Mock context
const mockCtx = {
  user: { id: 1, name: "Test User", email: "test@test.com", role: "user" as const, subscriptionTier: "free" as const },
  req: {} as any,
  res: {} as any,
};

describe("Problem Builder Router", () => {
  describe("getById", () => {
    it("should return undefined when database unavailable", async () => {
      const caller = problemBuilderRouter.createCaller({} as any);
      const result = await caller.getById({ id: 1 });
      expect(result).toBeUndefined();
    });
  });

  describe("getByLesson", () => {
    it("should return empty array when database unavailable", async () => {
      const caller = problemBuilderRouter.createCaller({} as any);
      const result = await caller.getByLesson({ lessonId: 1 });
      expect(result).toEqual([]);
    });
  });

  describe("submit", () => {
    it("should return success when database unavailable", async () => {
      const caller = problemBuilderRouter.createCaller(mockCtx as any);
      const result = await caller.submit({
        problemId: 1,
        answer: "test answer",
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("getHint", () => {
    it("should return hint when database unavailable", async () => {
      const caller = problemBuilderRouter.createCaller(mockCtx as any);
      const result = await caller.getHint({ problemId: 1, hintIndex: 0 });
      expect(result).toHaveProperty("hint");
    });
  });

  describe("getStats", () => {
    it("should return default stats when database unavailable", async () => {
      const caller = problemBuilderRouter.createCaller(mockCtx as any);
      const result = await caller.getStats({ problemId: 1 });
      expect(result).toEqual({ attempts: 0, solved: false, avgTime: 0 });
    });
  });

  describe("create", () => {
    it("should return success with id when database unavailable", async () => {
      const caller = problemBuilderRouter.createCaller(mockCtx as any);
      const result = await caller.create({
        lessonId: 1,
        title: "Test Problem",
        problemType: "multiple-choice",
        difficulty: "easy",
      });
      expect(result).toEqual({ success: true, id: 0 });
    });
  });
});