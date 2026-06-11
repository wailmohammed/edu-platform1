import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getUserCourseProgressByIds } from "./db";

const learningPaths = [
  {
    id: 1,
    slug: "javascript-fundamentals",
    title: "JavaScript Fundamentals Path",
    description: "Master JavaScript from basics to advanced concepts including ES6+.",
    courses: [1, 2, 3],
    type: "domain" as const,
    domain: "programming",
    difficulty: "beginner" as const,
    estimatedHours: 40,
    tags: ["JavaScript", "Programming", "Web"],
  },
  {
    id: 3,
    slug: "system-administrator",
    title: "System Administrator Path",
    description: "Build foundational Linux, networking, and system administration skills.",
    courses: [4, 5, 6],
    type: "role" as const,
    domain: "devops",
    difficulty: "beginner" as const,
    estimatedHours: 341,
    tags: ["DevOps", "Linux", "Cloud"],
  },
  {
    id: 4,
    slug: "kubernetes-administrator",
    title: "Kubernetes Administrator Path",
    description: "Learn Kubernetes operations, cluster management, and certification prep.",
    courses: [7, 8, 9],
    type: "role" as const,
    domain: "devops",
    difficulty: "intermediate" as const,
    estimatedHours: 250,
    tags: ["Kubernetes", "Cloud", "Containers"],
  },
  {
    id: 5,
    slug: "ai-data-science",
    title: "AI & Data Science Path",
    description: "Master Python, data analysis, and machine learning fundamentals.",
    courses: [10, 11, 12],
    type: "domain" as const,
    domain: "ai-ml",
    difficulty: "intermediate" as const,
    estimatedHours: 140,
    tags: ["AI", "Machine Learning", "Data"],
  },
  {
    id: 6,
    slug: "devops-engineer",
    title: "DevOps Engineer Path",
    description: "Combine infrastructure, CI/CD, and monitoring to launch reliable systems.",
    courses: [13, 14, 15],
    type: "role" as const,
    domain: "devops",
    difficulty: "advanced" as const,
    estimatedHours: 350,
    tags: ["DevOps", "CI/CD", "Infrastructure"],
  },
];

type LearningPath = (typeof learningPaths)[number];

type ProgressSummary = {
  pathId: number;
  completedCourses: number;
  totalCourses: number;
  progress: number;
  estimatedHours: number;
  remainingHours: number;
};

const computeProgress = (
  path: LearningPath,
  progressRows: Array<{ courseId: number; progressPercentage: string; status: string }>
): ProgressSummary => {
  const totalCourses = path.courses.length;
  const completedCourses = path.courses.filter((courseId) => {
    const row = progressRows.find((progress) => progress.courseId === courseId);
    if (!row) return false;
    const percentage = Number(row.progressPercentage);
    return percentage >= 100 || row.status === "completed";
  }).length;

  const progress = totalCourses === 0 ? 0 : Math.round((completedCourses / totalCourses) * 100);
  const remainingHours = Math.max(0, Math.round((path.estimatedHours || 0) * (1 - progress / 100)));

  return {
    pathId: path.id,
    completedCourses,
    totalCourses,
    progress,
    estimatedHours: path.estimatedHours,
    remainingHours,
  };
};

export const learningPathsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          type: z.string().optional(),
          difficulty: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let results: LearningPath[] = learningPaths;
      if (input?.type) {
        results = results.filter((path) => path.type === input.type);
      }
      if (input?.difficulty) {
        results = results.filter((path) => path.difficulty === input.difficulty);
      }
      if (input?.search) {
        const query = input.search.toLowerCase();
        results = results.filter(
          (path) =>
            path.title.toLowerCase().includes(query) ||
            path.description.toLowerCase().includes(query) ||
            path.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return results;
    }),

  listWithProgress: protectedProcedure.query(async ({ ctx }) => {
    const paths = learningPaths;
    const courseIds = Array.from(new Set(paths.flatMap((path) => path.courses)));
    const progressRows = await getUserCourseProgressByIds(ctx.user.id, courseIds);

    return paths.map((path) => ({
      ...path,
      progress: computeProgress(path, progressRows),
    }));
  }),

  recommendations: protectedProcedure.query(async ({ ctx }) => {
    const preferredGoal = ctx.user.learningGoal?.toLowerCase() || "";
    const scores = learningPaths.map((path) => {
      const nameScore = preferredGoal && path.title.toLowerCase().includes(preferredGoal) ? 2 : 0;
      const tagScore = path.tags.reduce(
        (score, tag) => score + (preferredGoal && tag.toLowerCase().includes(preferredGoal) ? 1 : 0),
        0
      );
      return {
        path,
        score: nameScore + tagScore,
      };
    });

    return scores
      .sort((a, b) => b.score - a.score)
      .map((item) => item.path)
      .slice(0, 3);
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return learningPaths.find((p) => p.slug === input.slug) || null;
    }),

  getUserProgress: protectedProcedure
    .input(z.object({ pathId: z.number() }))
    .query(async ({ ctx, input }) => {
      const path = learningPaths.find((p) => p.id === input.pathId);
      if (!path) {
        return null;
      }
      const progressRows = await getUserCourseProgressByIds(ctx.user.id, path.courses);
      return computeProgress(path, progressRows);
    }),
});