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
  updateUserPreferences,
  createChallenge,
  updateChallengeStatus,
} from "./db";
import { z } from "zod";
import { gamificationRouter } from "./gamification.router";
import { tierRouter } from "./tier.router";
import { enrollmentService } from "./enrollment";
import { problemBuilderRouter } from "./problem-builder.router";
import { portfolioRouter } from "./portfolio.router";
import { adminRouter } from "./admin.router";
import { battleRouter } from "./battle.router";
import { teamsRouter } from "./teams.router";
import { learningPathsRouter } from "./learning-paths.router";
import { interviewPrepRouter } from "./interview-prep.router";
import { websocketRouter } from "./websocket.router";
import { badgesRouter } from "./badges.router";
import { emailServiceRouter } from "./email-service.router";
import { ratingRouter } from "./rating.router";
import { contestsRouter } from "./contests.router";
import { weeklyChallengesRouter } from "./weekly-challenges.router";
import { certificationsRouter } from "./certifications.router";
import { projectsRouter } from "./projects.router";
import { minibossRouter } from "./miniboss.router";
import { potdRouter } from "./potd.router";
import { companyProblemsRouter } from "./company-problems.router";
import { premiumRouter } from "./premium.router";
import { playgroundRouter } from "./playground.router";
import { mashupRouter } from "./mashup.router";

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

    updatePreferences: protectedProcedure
      .input(
        z.object({
          learningGoal: z.string().optional(),
          recommendedPath: z.string().optional(),
          onboardingCompleted: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await updateUserPreferences(
          ctx.user.id,
          input.learningGoal,
          input.recommendedPath,
          input.onboardingCompleted
        );
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

    sendChallenge: protectedProcedure
      .input(
        z.object({
          challengedId: z.number(),
          exerciseId: z.number().optional(),
          courseId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createChallenge(
          ctx.user.id,
          input.challengedId,
          input.exerciseId,
          input.courseId
        );
      }),

    respondToChallenge: protectedProcedure
      .input(
        z.object({
          challengeId: z.number(),
          accept: z.boolean(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const status = input.accept ? "accepted" : "declined";
        return await updateChallengeStatus(input.challengeId, ctx.user.id, status);
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

/**
     * Problem Builder - Interactive Problem Solving
     */
    problemBuilder: problemBuilderRouter,

    /**
     * Portfolio - User project showcase
     */
    portfolio: portfolioRouter,

    /**
     * Admin Dashboard - Platform management
     */
    admin: adminRouter,

    /**
     * Battle - Realtime coding battles
     */
    battle: battleRouter,

    /**
     * Teams - Team challenges and collaboration
     */
    teams: teamsRouter,

    /**
     * Learning Paths - Guided course sequences
     */
    learningPaths: learningPathsRouter,

    /**
     * Interview Prep - Technical interview questions
     */
    interviewPrep: interviewPrepRouter,

    /**
     * WebSocket - Real-time notifications
     */
    websocket: websocketRouter,

    /**
     * Badges - Achievement system
     */
    badges: badgesRouter,

    /**
     * Email - Notification service
     */
    emailService: emailServiceRouter,

    /**
     * Rating - Competitive programming rating system
     */
    rating: ratingRouter,

    /**
     * Contests - Coding competitions
     */
    contests: contestsRouter,

    /**
     * Weekly Challenges - Time-limited coding challenges
     */
    weeklyChallenges: weeklyChallengesRouter,

    /**
     * Certifications - Skill and role-based certifications
     */
    certifications: certificationsRouter,

    /**
     * Projects - Certification projects
     */
    projects: projectsRouter,

    /**
     * Miniboss - Challenging projects with user stories
     */
    miniboss: minibossRouter,

    /**
     * POTD - Problem of the Day
     */
    potd: potdRouter,

    /**
     * Company Problems - Interview prep by company
     */
    companyProblems: companyProblemsRouter,

    /**
     * Premium - Premium features (AI, notes, summarization)
     */
    premium: premiumRouter,

    /**
     * Playground - Code experimentation environment
     */
    playground: playgroundRouter,

    /**
     * Mashup - Custom contest creation for teams/friends
     */
    mashup: mashupRouter,
});

export type AppRouter = typeof appRouter;
