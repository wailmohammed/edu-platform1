import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllCourses,
  getCourseBySlug,
  getCourseById,
  getCoursesByCategory,
  getCoursesByDifficulty,
  getLessonsByCourseId,
  getLessonById,
  getExercisesByLessonId,
  getExerciseById,
  getUserProgress,
  getUserCourseProgress,
  getLessonCompletion,
  getUserCompletedLessons,
  getExerciseSubmission,
  getUserExerciseSubmissions,
  getUserStreak,
  getUserBadges,
  getUserCertificates,
  getLeaderboard,
  getUserFriends,
  getUserChallenges,
  getUserSubscription,
  getUserById,
} from "./db";
import { z } from "zod";
import { gamificationRouter } from "./gamification.router";
import { tierRouter } from "./tier.router";
import { enrollmentService } from "./enrollment";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Courses
   */
  courses: router({
    list: publicProcedure.query(async () => {
      return await getAllCourses();
    }),

    listWithEnrollment: publicProcedure.query(async ({ ctx }) => {
      const userId = ctx.user?.id ?? null;
      return await enrollmentService.getCoursesWithEnrollment(userId);
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getCourseBySlug(input.slug);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getCourseById(input.id);
      }),

    listByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await getCoursesByCategory(input.category);
      }),

    listByDifficulty: publicProcedure
      .input(z.object({ difficulty: z.string() }))
      .query(async ({ input }) => {
        return await getCoursesByDifficulty(input.difficulty);
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await enrollmentService.searchCourses(input.query);
      }),
  }),

  /**
   * Enrollment
   */
  enrollment: router({
    enroll: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await enrollmentService.enrollCourse(ctx.user.id, input.courseId);
      }),

    getCourseProgress: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getUserProgress(ctx.user.id, input.courseId);
      }),

    listEnrolled: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCourseProgress(ctx.user.id);
    }),

    completeLesson: protectedProcedure
      .input(
        z.object({
          lessonId: z.number(),
          courseId: z.number(),
          xpEarned: z.number().default(10),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await enrollmentService.completeLesson(
          ctx.user.id,
          input.lessonId,
          input.courseId,
          input.xpEarned
        );
      }),

    getCertificates: protectedProcedure.query(async ({ ctx }) => {
      return await enrollmentService.getUserCertificatesWithCourses(ctx.user.id);
    }),
  }),

  /**
   * Lessons
   */
  lessons: router({
    listByCourse: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await getLessonsByCourseId(input.courseId);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getLessonById(input.id);
      }),
  }),

  /**
   * Exercises
   */
  exercises: router({
    listByLesson: publicProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input }) => {
        return await getExercisesByLessonId(input.lessonId);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getExerciseById(input.id);
      }),
  }),

  /**
   * User Progress
   */
  progress: router({
    getCourseProgress: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getUserProgress(ctx.user.id, input.courseId);
      }),

    listCourseProgress: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCourseProgress(ctx.user.id);
    }),

    getLessonCompletion: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getLessonCompletion(ctx.user.id, input.lessonId);
      }),

    getCompletedLessons: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCompletedLessons(ctx.user.id);
    }),
  }),

  /**
   * Exercise Submissions
   */
  submissions: router({
    getLatest: protectedProcedure
      .input(z.object({ exerciseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getExerciseSubmission(ctx.user.id, input.exerciseId);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserExerciseSubmissions(ctx.user.id);
    }),

    submit: protectedProcedure
      .input(
        z.object({
          exerciseId: z.number(),
          code: z.string(),
          passed: z.boolean(),
          testResults: z.any().optional(),
          xpEarned: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement submission logic with code execution
        return { success: true };
      }),
  }),

  /**
   * Gamification (Legacy - kept for reference)
   */
  gamificationLegacy: router({
    getStreak: protectedProcedure.query(async ({ ctx }) => {
      return await getUserStreak(ctx.user.id);
    }),

    getBadges: protectedProcedure.query(async ({ ctx }) => {
      return await getUserBadges(ctx.user.id);
    }),

    getCertificates: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCertificates(ctx.user.id);
    }),
  }),

  /**
   * Leaderboard
   */
  leaderboard: router({
    getWeekly: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await getLeaderboard("weekly", input.limit);
      }),

    getMonthly: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await getLeaderboard("monthly", input.limit);
      }),

    getAllTime: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await getLeaderboard("all-time", input.limit);
      }),
  }),

  /**
   * Social
   */
  social: router({
    getFriends: protectedProcedure.query(async ({ ctx }) => {
      return await getUserFriends(ctx.user.id);
    }),

    getChallenges: protectedProcedure.query(async ({ ctx }) => {
      return await getUserChallenges(ctx.user.id);
    }),
  }),

  /**
   * Subscription
   */
  subscription: router({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSubscription(ctx.user.id);
    }),

    upgrade: protectedProcedure
      .input(z.object({ plan: z.enum(["free", "premium"]) }))
      .mutation(async ({ ctx, input }) => {
        if (input.plan === "premium") {
          return await enrollmentService.upgradeToPremium(ctx.user.id);
        }
        return { success: true };
      }),
  }),

  /**
   * Gamification (New Service)
   */
  gamification: gamificationRouter,

  /**
   * Tier Management
   */
  tier: tierRouter,
});

export type AppRouter = typeof appRouter;
