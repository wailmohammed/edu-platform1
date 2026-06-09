import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const mockRating = 1200;

export const ratingRouter = router({
  getRating: protectedProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.user.id,
      rating: mockRating,
      division: mockRating >= 2000 ? 1 : mockRating >= 1600 ? 2 : mockRating >= 1400 ? 3 : 4,
    };
  }),

  getLeaderboard: publicProcedure
    .input(
      z.object({
        division: z.number().optional(),
        limit: z.number().default(100),
      })
    )
    .query(async ({ input }) => {
      const mockLeaderboard = [
        { rank: 1, username: "grandmaster", rating: 2850, division: 1 },
        { rank: 2, username: "icpc_pro", rating: 2720, division: 1 },
        { rank: 3, username: "algorithm_king", rating: 2650, division: 1 },
        { rank: 4, username: "coding_wizard", rating: 1850, division: 2 },
        { rank: 5, username: "code_master", rating: 1720, division: 2 },
      ];

      let result = mockLeaderboard;
      if (input.division) {
        result = result.filter((u) => u.division === input.division);
      }
      return result.slice(0, input.limit);
    }),

  getDivisionInfo: publicProcedure.query(async () => {
    return [
      { division: 1, minRating: 2000, name: "Grandmaster" },
      { division: 2, minRating: 1600, maxRating: 1999, name: "Master" },
      { division: 3, minRating: 1400, maxRating: 1599, name: "Expert" },
      { division: 4, maxRating: 1399, name: "Beginner" },
    ];
  }),
});