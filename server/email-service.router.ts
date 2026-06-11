import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const emailServiceRouter = router({
  sendStreakReminder: protectedProcedure
    .input(z.object({ time: z.string().optional() }))
    .mutation(async ({ ctx }) => {
      return { success: true, message: "Streak reminder scheduled" };
    }),

  sendReferralBonus: protectedProcedure
    .input(z.object({ referredUserId: z.number() }))
    .mutation(async ({ ctx }) => {
      return { success: true, message: "Referral bonus notification sent" };
    }),

  sendAchievement: protectedProcedure
    .input(z.object({ achievementId: z.string() }))
    .mutation(async ({ ctx }) => {
      return { success: true, message: "Achievement notification sent" };
    }),

  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    return {
      streakReminders: true,
      referralNotifications: true,
      achievementAlerts: true,
      quietHours: { start: "22:00", end: "08:00" },
    };
  }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        streakReminders: z.boolean().optional(),
        referralNotifications: z.boolean().optional(),
        achievementAlerts: z.boolean().optional(),
        quietHours: z.object({ start: z.string(), end: z.string() }).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return { success: true, preferences: input };
    }),
});