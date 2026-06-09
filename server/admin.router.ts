import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const adminRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return {
      totalUsers: 1247,
      totalCourses: 42,
      totalLessons: 312,
      totalExercises: 856,
      activeUsers: 892,
      monthlyRevenue: 42500,
      avgCompletionRate: 68,
    };
  }),

  getUsers: protectedProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return {
        users: [
          { id: 1, name: "Test User", email: "test@test.com", role: "user", subscriptionTier: "free" },
        ],
        total: 1247,
      };
    }),

  getCourses: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return [
      { id: 1, title: "JavaScript Fundamentals", students: 234, rating: 4.8 },
      { id: 2, title: "Python Mastery", students: 189, rating: 4.9 },
    ];
  }),

  getRecentActivity: protectedProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return [
        { id: 1, action: "lesson_completed", user: "Alice", target: "Intro to JS", timestamp: new Date() },
        { id: 2, action: "course_enrolled", user: "Bob", target: "Python Mastery", timestamp: new Date() },
      ];
    }),
});