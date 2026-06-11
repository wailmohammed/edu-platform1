import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const badgeTiers = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

const mockBadges = [
  { id: 1, name: "First Course", tier: "Bronze", icon: "🎯", description: "Complete your first course" },
  { id: 2, name: "Streak Master", tier: "Silver", icon: "🔥", description: "7-day learning streak" },
  { id: 3, name: "Code Warrior", tier: "Gold", icon: "⚔️", description: "Complete 50 exercises" },
];

export const badgesRouter = router({
  list: publicProcedure.query(async () => {
    return mockBadges;
  }),

  getUserBadges: protectedProcedure.query(async ({ ctx }) => {
    return mockBadges.filter((b) => b.tier !== "Diamond");
  }),

  getLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return [
        { rank: 1, username: "codingpro", badgeCount: 25 },
        { rank: 2, username: "algorithmqueen", badgeCount: 22 },
        { rank: 3, username: "debugmaster", badgeCount: 18 },
      ].slice(0, input.limit);
    }),

  unlockBadge: protectedProcedure
    .input(z.object({ badgeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return { success: true, badge: mockBadges.find((b) => b.id === input.badgeId) };
    }),
});