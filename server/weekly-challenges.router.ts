import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const weeklyChallenges = [
  {
    id: 1,
    title: "Weekly Challenge #23",
    topic: "Prompt Engineering",
    description: "Optimize LLM prompts for accuracy and efficiency",
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    participants: 5400,
  },
  {
    id: 2,
    title: "Weekly Challenge #22",
    topic: "Dynamic Programming",
    description: "Solve DP problems with optimal substructure",
    endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    participants: 8200,
    winner: "dp_master",
  },
];

export const weeklyChallengesRouter = router({
  getCurrent: publicProcedure.query(async () => {
    return weeklyChallenges.find((c) => c.endDate > new Date());
  }),

  getPast: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return weeklyChallenges.filter((c) => c.endDate <= new Date()).slice(0, input.limit);
    }),

  submit: protectedProcedure
    .input(
      z.object({
        challengeId: z.number(),
        prompt: z.string(),
        generatedCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        score: Math.floor(Math.random() * 100),
        feedback: "Good prompt structure! Try to be more specific about edge cases.",
      };
    }),

  getLeaderboard: publicProcedure.query(async () => {
    return [
      { rank: 1, username: "prompt_guru", score: 98 },
      { rank: 2, username: "llm_expert", score: 95 },
      { rank: 3, username: "prompt_master", score: 92 },
    ];
  }),
});