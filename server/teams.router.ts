import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

interface Team {
  id: number;
  name: string;
  description: string;
  members: number[];
  createdAt: Date;
}

const teams: Map<number, Team> = new Map();
let teamIdCounter = 1;

export const teamsRouter = router({
  createTeam: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const team: Team = {
        id: teamIdCounter++,
        name: input.name,
        description: input.description || "",
        members: [ctx.user.id],
        createdAt: new Date(),
      };
      teams.set(team.id, team);
      return { success: true, teamId: team.id };
    }),

  getTeam: publicProcedure
    .input(z.object({ teamId: z.number() }))
    .query(async ({ input }) => {
      return teams.get(input.teamId) || null;
    }),

  listUserTeams: protectedProcedure.query(async ({ ctx }) => {
    return Array.from(teams.values()).filter((t) => t.members.includes(ctx.user.id));
  }),

  joinTeam: protectedProcedure
    .input(z.object({ teamId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const team = teams.get(input.teamId);
      if (!team) throw new Error("Team not found");
      if (!team.members.includes(ctx.user.id)) {
        team.members.push(ctx.user.id);
        teams.set(input.teamId, team);
      }
      return { success: true };
    }),
});