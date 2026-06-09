import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

interface MinibossChallenge {
  id: number;
  title: string;
  courseId: number;
  description: string;
  difficulty: "hard" | "expert";
  userStories: string[];
  tests: number;
  estimatedHours: number;
}

const minibossChallenges: MinibossChallenge[] = [
  {
    id: 1,
    title: "Build a Markdown Previewer",
    courseId: 1,
    description: "Create a live markdown previewer with React",
    difficulty: "hard",
    userStories: [
      "I can type markdown in the editor",
      "I can see the HTML output",
      "Default text loads on start",
    ],
    tests: 8,
    estimatedHours: 15,
  },
  {
    id: 2,
    title: "Build a Drum Machine",
    courseId: 1,
    description: "Create a drum machine with React",
    difficulty: "hard",
    userStories: [
      "I can play sounds by pressing keys",
      "I can see what key I pressed",
      "I can use the keyboard",
    ],
    tests: 10,
    estimatedHours: 20,
  },
  {
    id: 3,
    title: "Build a Data Visualization Dashboard",
    courseId: 15,
    description: "Create D3.js visualizations with real data",
    difficulty: "expert",
    userStories: [
      "I can see a bar chart",
      "I can see a scatterplot",
      "I can see heat map",
    ],
    tests: 12,
    estimatedHours: 30,
  },
];

export const minibossRouter = router({
  getByCourse: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return minibossChallenges.filter((m) => m.courseId === input.courseId);
    }),

  getById: publicProcedure
    .input(z.object({ challengeId: z.number() }))
    .query(async ({ input }) => {
      return minibossChallenges.find((m) => m.id === input.challengeId) || null;
    }),

  submit: protectedProcedure
    .input(
      z.object({
        challengeId: z.number(),
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const challenge = minibossChallenges.find((m) => m.id === input.challengeId);
      return {
        success: true,
        passed: true,
        score: 100,
        badge: challenge ? `${challenge.title} Master` : "Miniboss Champion",
      };
    }),

  listAll: publicProcedure.query(async () => {
    return minibossChallenges;
  }),
});