import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

interface MashupContest {
  id: string;
  title: string;
  creatorId: number;
  problems: number[];
  participants: number[];
  startTime: Date | null;
  endTime: Date | null;
  status: "draft" | "active" | "completed";
  maxDuration: number;
}

const mashups: Map<string, MashupContest> = new Map();

export const mashupRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        problemIds: z.array(z.number()),
        duration: z.number().min(30).max(43200),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = `mash-${Date.now()}`;
      mashups.set(id, {
        id,
        title: input.title,
        creatorId: ctx.user.id,
        problems: input.problemIds,
        participants: [ctx.user.id],
        startTime: null,
        endTime: null,
        status: "draft",
        maxDuration: input.duration,
      });
      return { success: true, mashupId: id };
    }),

  addProblem: protectedProcedure
    .input(z.object({ mashupId: z.string(), problemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const mashup = mashups.get(input.mashupId);
      if (!mashup) throw new Error("Mashup not found");
      if (mashup.creatorId !== ctx.user.id) throw new Error("Unauthorized");

      mashup.problems.push(input.problemId);
      mashups.set(input.mashupId, mashup);
      return { success: true };
    }),

  addParticipant: protectedProcedure
    .input(z.object({ mashupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const mashup = mashups.get(input.mashupId);
      if (!mashup) throw new Error("Mashup not found");

      if (!mashup.participants.includes(ctx.user.id)) {
        mashup.participants.push(ctx.user.id);
        mashups.set(input.mashupId, mashup);
      }
      return { success: true };
    }),

  start: protectedProcedure
    .input(z.object({ mashupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const mashup = mashups.get(input.mashupId);
      if (!mashup) throw new Error("Mashup not found");
      if (mashup.creatorId !== ctx.user.id) throw new Error("Unauthorized");

      mashup.startTime = new Date();
      mashup.endTime = new Date(Date.now() + mashup.maxDuration * 1000);
      mashup.status = "active";
      mashups.set(input.mashupId, mashup);
      return { success: true };
    }),

  getById: publicProcedure
    .input(z.object({ mashupId: z.string() }))
    .query(async ({ input }) => {
      return mashups.get(input.mashupId) || null;
    }),

  listUserMashups: protectedProcedure.query(async ({ ctx }) => {
    return Array.from(mashups.values()).filter((m) => m.creatorId === ctx.user.id);
  }),
});