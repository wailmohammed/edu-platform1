import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getProblemById,
  getProblemsByLesson,
  createProblem,
  submitSolution,
  getHintForProblem,
  getProblemStats,
} from "./db";

export const problemBuilderRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getProblemById(input.id);
    }),

  getByLesson: publicProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      return await getProblemsByLesson(input.lessonId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        lessonId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        problemType: z.enum(["multiple-choice", "code", "proof", "interactive"]),
        difficulty: z.enum(["easy", "medium", "hard"]),
        starterCode: z.string().optional(),
        solution: z.string().optional(),
        testCases: z.any().optional(),
        hints: z.array(z.string()).optional(),
        visualConfig: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createProblem(
        ctx.user.id,
        input.lessonId,
        input.title,
        input.description,
        input.problemType,
        input.difficulty,
        input.starterCode,
        input.solution,
        input.testCases,
        input.hints,
        input.visualConfig
      );
    }),

  submit: protectedProcedure
    .input(
      z.object({
        problemId: z.number(),
        code: z.string().optional(),
        answer: z.any().optional(),
        timeSpent: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await submitSolution(
        ctx.user.id,
        input.problemId,
        input.code,
        input.answer,
        input.timeSpent
      );
    }),

  getHint: protectedProcedure
    .input(z.object({ problemId: z.number(), hintIndex: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      return await getHintForProblem(
        ctx.user.id,
        input.problemId,
        input.hintIndex
      );
    }),

  getStats: protectedProcedure
    .input(z.object({ problemId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await getProblemStats(ctx.user.id, input.problemId);
    }),
});

export type ProblemBuilderRouter = typeof problemBuilderRouter;