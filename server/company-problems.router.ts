import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

const companyProblems = {
  google: [
    { id: 1, title: "Median of Two Sorted Arrays", difficulty: "hard" },
    { id: 2, title: "Regular Expression Matching", difficulty: "hard" },
    { id: 3, title: "Longest Valid Parentheses", difficulty: "hard" },
  ],
  amazon: [
    { id: 4, title: "Two Sum", difficulty: "easy" },
    { id: 5, title: "LRU Cache", difficulty: "medium" },
    { id: 6, title: "Word Ladder", difficulty: "medium" },
  ],
  microsoft: [
    { id: 7, title: "Clone Graph", difficulty: "medium" },
    { id: 8, title: "Binary Tree Maximum Path Sum", difficulty: "hard" },
    { id: 9, title: "Sliding Window Maximum", difficulty: "hard" },
  ],
};

export const companyProblemsRouter = router({
  getByCompany: publicProcedure
    .input(z.object({ company: z.string() }))
    .query(async ({ input }) => {
      return companyProblems[input.company.toLowerCase() as keyof typeof companyProblems] || [];
    }),

  getCompanies: publicProcedure.query(async () => {
    return Object.keys(companyProblems);
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    return {
      problemsAttempted: 42,
      problemsSolved: 35,
      acceptanceRate: 83,
      companies: ["Google", "Amazon", "Microsoft"],
    };
  }),
});