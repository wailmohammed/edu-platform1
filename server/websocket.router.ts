import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

const connections: Map<number, { userId: number; socketId: string }> = new Map();
let socketIdCounter = 1;

export const websocketRouter = router({
  connect: publicProcedure
    .input(z.object({ userId: z.number().optional() }))
    .mutation(async ({ input }) => {
      const socketId = `socket-${socketIdCounter++}`;
      if (input.userId) {
        connections.set(input.userId, { userId: input.userId, socketId });
      }
      return { socketId, status: "connected" };
    }),

  disconnect: protectedProcedure
    .input(z.object({ socketId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      for (const [userId, conn] of Array.from(connections)) {
        if (conn.socketId === input.socketId) {
          connections.delete(userId);
          break;
        }
      }
      return { success: true };
    }),

  sendNotification: protectedProcedure
    .input(
      z.object({
        targetUserId: z.number(),
        type: z.enum(["streak", "referral", "challenge", "team"]),
        data: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const connection = connections.get(input.targetUserId);
      return {
        success: true,
        delivered: !!connection,
        notification: { type: input.type, data: input.data },
      };
    }),

  getPresence: publicProcedure.query(async () => {
    return Array.from(connections.values());
  }),
});