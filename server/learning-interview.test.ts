import { describe, it, expect } from "vitest";
import { learningPathsRouter } from "./learning-paths.router";
import { interviewPrepRouter } from "./interview-prep.router";

describe("Learning Paths Router", () => {
  describe("list", () => {
    it("should return all learning paths", async () => {
      const caller = learningPathsRouter.createCaller({} as any);
      const result = await caller.list();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getBySlug", () => {
    it("should return path by slug", async () => {
      const caller = learningPathsRouter.createCaller({} as any);
      const result = await caller.getBySlug({ slug: "javascript-fundamentals" });
      expect(result).not.toBeNull();
      expect(result?.slug).toBe("javascript-fundamentals");
    });

    it("should return null for invalid slug", async () => {
      const caller = learningPathsRouter.createCaller({} as any);
      const result = await caller.getBySlug({ slug: "invalid" });
      expect(result).toBeNull();
    });
  });
});

describe("Interview Prep Router", () => {
  describe("getQuestions", () => {
    it("should return questions", async () => {
      const caller = interviewPrepRouter.createCaller({} as any);
      const result = await caller.getQuestions({});
      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter by company", async () => {
      const caller = interviewPrepRouter.createCaller({} as any);
      const result = await caller.getQuestions({ company: "Google" });
      expect(result.every((q: any) => q.company === "Google")).toBe(true);
    });
  });

  describe("getCompanies", () => {
    it("should return unique companies", async () => {
      const caller = interviewPrepRouter.createCaller({} as any);
      const result = await caller.getCompanies();
      expect(Array.isArray(result)).toBe(true);
      expect(result.includes("Google")).toBe(true);
    });
  });

  describe("submitSolution", () => {
    it("should submit solution and return feedback", async () => {
      const caller = interviewPrepRouter.createCaller({ user: { id: 1, role: "user" } } as any);
      const result = await caller.submitSolution({
        questionId: 1,
        code: "function test() {}",
        language: "javascript",
      });
      expect(result.success).toBe(true);
      expect(result.feedback).toBeDefined();
      expect(result.score).toBeGreaterThan(0);
    });
  });
});