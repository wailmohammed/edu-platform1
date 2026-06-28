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

  getAdConfig: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new Error("Unauthorized");
    return {
      googleAdSense: { enabled: true, publisherId: "***" },
      adsterra: { enabled: false },
      monetag: { enabled: false },
      amazonAssociates: { enabled: true, tag: "***" },
    };
  }),

  updateAdConfig: protectedProcedure
    .input(
      z.object({
        provider: z.enum(["googleAdSense", "adsterra", "monetag", "amazonAssociates"]),
        enabled: z.boolean(),
        config: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");
      return { success: true, provider: input.provider, enabled: input.enabled };
    }),

  getSeoConfig: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new Error("Unauthorized");
    return {
      metaTags: {
        title: "LearnCode - Interactive Learning Platform",
        description: "Master programming, data science, and web development with interactive courses, coding challenges, and real-time battles.",
        keywords: "programming, coding, javascript, python, data science, web development, online learning",
      },
      googleAnalytics: { enabled: false, measurementId: null },
      googleSearchConsole: { enabled: false, verificationId: null },
      sitemap: { enabled: true, lastGenerated: new Date() },
    };
  }),

  updateSeoConfig: protectedProcedure
    .input(
      z.object({
        metaTags: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          keywords: z.string().optional(),
        }).optional(),
        analytics: z.object({
          googleAnalytics: z.object({
            enabled: z.boolean(),
            measurementId: z.string().optional(),
          }).optional(),
          googleSearchConsole: z.object({
            enabled: z.boolean(),
            verificationId: z.string().optional(),
          }).optional(),
        }).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");
      return { success: true, config: input };
    }),
});