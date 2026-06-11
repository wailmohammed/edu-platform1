import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createCourse, updateCourse, deleteCourse, getAllCourses } from "./db";

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
    return await getAllCourses();
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

  createCourse: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
        category: z.string(),
        difficulty: z.string(),
        language: z.string().optional(),
        isPremium: z.boolean().optional(),
        estimatedHours: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");
      const created = await createCourse({
        slug: input.slug,
        title: input.title,
        description: input.description,
        category: input.category as any,
        difficulty: input.difficulty as any,
        language: input.language,
        isPremium: input.isPremium ?? false,
        estimatedHours: input.estimatedHours as any,
      });
      return created;
    }),

  updateCourse: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        difficulty: z.string().optional(),
        language: z.string().optional(),
        isPremium: z.boolean().optional(),
        estimatedHours: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");
      const updated = await updateCourse(input.id, {
        title: input.title,
        description: input.description,
        category: input.category as any,
        difficulty: input.difficulty as any,
        language: input.language,
        isPremium: input.isPremium,
        estimatedHours: input.estimatedHours as any,
      });
      return updated;
    }),

  deleteCourse: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");
      return await deleteCourse(input.id);
    }),

  getApiKeys: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new Error("Unauthorized");
    return {
      benefitpay: { configured: true, key: "***" },
      stripe: { configured: false, key: null },
      email: { configured: true, provider: "smtp" },
    };
  }),

  updateApiKey: protectedProcedure
    .input(
      z.object({
        service: z.enum(["benefitpay", "stripe", "email", "oauth"]),
        key: z.string(),
        secret: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");
      return { success: true, service: input.service };
    }),
});