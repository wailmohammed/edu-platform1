import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const learningPaths = [
  {
    id: 1,
    slug: "javascript-fundamentals",
    title: "JavaScript Journey",
    description: "From basics to advanced JS",
    courses: [1, 2, 3],
    difficulty: "beginner" as const,
    estimatedHours: 40,
  },
  {
    id: 2,
    slug: "python-data-science",
    title: "Python for Data Science",
    description: "Python programming and data analysis",
    courses: [4, 5, 6],
    difficulty: "intermediate" as const,
    estimatedHours: 60,
  },
  {
    id: 3,
    slug: "interview-prep",
    title: "Interview Preparation",
    description: "Ace technical interviews",
    courses: [7, 8, 9],
    difficulty: "advanced" as const,
    estimatedHours: 80,
  },
];

export const learningPathsRouter = router({
  list: publicProcedure.query(async () => {
    return learningPaths;
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return learningPaths.find((p) => p.slug === input.slug) || null;
    }),

  getUserProgress: protectedProcedure
    .input(z.object({ pathId: z.number() }))
    .query(async ({ ctx, input }) => {
      return {
        pathId: input.pathId,
        completedCourses: 0,
        totalCourses: 3,
        progress: 0,
      };
    }),
});