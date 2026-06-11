import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

interface BattleRoom {
  id: number;
  roomId: string;
  player1Id: number;
  player2Id: number | null;
  problemId: number;
  status: "waiting" | "active" | "completed";
  startTime: Date | null;
  endTime: Date | null;
  winnerId: number | null;
}

const battleRooms: Map<string, BattleRoom> = new Map();
let battleIdCounter = 1;

export const battleRouter = router({
  createRoom: protectedProcedure
    .input(z.object({ problemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const roomId = `battle-${battleIdCounter++}-${Math.random().toString(36).slice(2)}`;
      const room: BattleRoom = {
        id: battleIdCounter,
        roomId,
        player1Id: ctx.user.id,
        player2Id: null,
        problemId: input.problemId,
        status: "waiting",
        startTime: null,
        endTime: null,
        winnerId: null,
      };
      battleRooms.set(roomId, room);
      return { roomId, status: room.status };
    }),

  joinRoom: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const room = battleRooms.get(input.roomId);
      if (!room) throw new Error("Room not found");
      if (room.player2Id) throw new Error("Room full");

      room.player2Id = ctx.user.id;
      room.status = "active";
      room.startTime = new Date();
      battleRooms.set(input.roomId, room);
      return { roomId: room.roomId, status: room.status };
    }),

  submitSolution: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        code: z.string(),
        timeElapsed: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = battleRooms.get(input.roomId);
      if (!room) throw new Error("Room not found");

      room.status = "completed";
      room.endTime = new Date();
      room.winnerId = ctx.user.id;
      battleRooms.set(input.roomId, room);

      return { success: true, winnerId: ctx.user.id };
    }),

  getRoomInfo: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ input }) => {
      return battleRooms.get(input.roomId) || null;
    }),
});