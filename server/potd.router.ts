import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

const potdProblems = [
  {
    id: 1,
    date: "2026-06-10",
    title: "Two Sum",
    difficulty: "easy",
    topic: "Arrays",
    acceptance: 45,
  },
  {
    id: 2,
    date: "2026-06-09",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topic: "Sliding Window",
    acceptance: 34,
  },
  {
    id: 3,
    date: "2026-06-08",
    title: "Trapping Rain Water",
    difficulty: "hard",
    topic: "Dynamic Programming",
    acceptance: 62,
  },
];

export const potdRouter = router({
  getToday: publicProcedure.query(async () => {
    const today = new Date().toISOString().split("T")[0];
    return potdProblems.find((p) => p.date === today) || potdProblems[0];
  }),

  getStreak: protectedProcedure.query(async ({ ctx }) => {
    return {
      currentStreak: 7,
      longestStreak: 30,
      streakFreezeUsed: 1,
      streakFreezeRemaining: 1,
    };
  }),

  submit: protectedProcedure
    .input(z.object({ problemId: z.number(), code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        passed: true,
        xp: 10,
        streakExtended: true,
      };
    }),
});