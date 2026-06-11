import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

interface Contest {
  id: number;
  title: string;
  type: "weekly" | "monthly" | "mashup";
  startTime: Date;
  duration: number;
  problems: string[];
  participants: number;
  prize?: string;
}

const contests: Contest[] = [
  {
    id: 1,
    title: "Weekly Contest #127",
    type: "weekly",
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    duration: 120,
    problems: ["Two Sum", "Binary Tree", "Graph Algorithms"],
    participants: 12500,
    prize: "$1000",
  },
  {
    id: 2,
    title: "Monthly Challenge May",
    type: "monthly",
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    duration: 180,
    problems: ["DP Challenge", "String Algorithms", "Geometry", "Math"],
    participants: 8500,
  },
];

export const contestsRouter = router({
  getUpcoming: publicProcedure.query(async () => {
    return contests.filter((c) => c.startTime > new Date());
  }),

  getPastContests: publicProcedure.query(async () => {
    return contests.filter((c) => c.startTime <= new Date()).slice(0, 20);
  }),

  register: protectedProcedure
    .input(z.object({ contestId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const contest = contests.find((c) => c.id === input.contestId);
      if (!contest) throw new Error("Contest not found");
      return { success: true, contestId: input.contestId };
    }),

  getCalendar: publicProcedure.query(async () => {
    return contests.map((c) => ({
      id: c.id,
      title: c.title,
      date: c.startTime.toISOString(),
      duration: c.duration,
    }));
  }),
});