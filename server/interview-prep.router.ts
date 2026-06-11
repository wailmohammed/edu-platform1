import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const interviewQuestions = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer",
    question: "Reverse a linked list",
    difficulty: "medium",
    category: "Data Structures",
    solution: "function reverseList(head) { ... }",
  },
  {
    id: 2,
    company: "Meta",
    role: "Frontend Engineer",
    question: "Implement debounce",
    difficulty: "easy",
    category: "JavaScript",
    solution: "function debounce(fn, delay) { ... }",
  },
  {
    id: 3,
    company: "Amazon",
    role: "Software Engineer",
    question: "Binary tree traversal",
    difficulty: "medium",
    category: "Algorithms",
    solution: "function traverse(root) { ... }",
  },
];

export const interviewPrepRouter = router({
  getQuestions: publicProcedure
    .input(
      z.object({
        company: z.string().optional(),
        role: z.string().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      let result = interviewQuestions;
      if (input.company) {
        result = result.filter((q) => q.company === input.company);
      }
      if (input.difficulty) {
        result = result.filter((q) => q.difficulty === input.difficulty);
      }
      return result.slice(0, input.limit);
    }),

  getCompanies: publicProcedure.query(async () => {
    return Array.from(new Set(interviewQuestions.map((q) => q.company)));
  }),

  getRoles: publicProcedure.query(async () => {
    return Array.from(new Set(interviewQuestions.map((q) => q.role)));
  }),

  submitSolution: protectedProcedure
    .input(
      z.object({
        questionId: z.number(),
        code: z.string(),
        language: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        feedback: "Good approach! Consider edge cases for empty input.",
        score: 85,
      };
    }),
});