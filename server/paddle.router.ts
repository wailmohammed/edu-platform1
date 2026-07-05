import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";

/**
 * Paddle Payment Router
 * Handles checkout sessions, subscriptions, and payment webhooks
 */
export const paddleRouter = router({
  // Create checkout session for premium subscription
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["monthly", "annual"]),
        origin: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const prices = {
        monthly: 999, // $9.99 in cents
        annual: 9999, // $99.99 in cents
      };

      // In production, integrate with Paddle API
      // For now, return mock checkout URL
      const checkoutUrl = `${input.origin}/checkout/paddle/${input.plan}`;

      return {
        success: true,
        checkoutUrl,
        priceId: `pri_${input.plan}_${Date.now()}`,
        price: prices[input.plan] / 100,
      };
    }),

  // Create checkout for course purchase
  createCourseCheckout: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        courseName: z.string(),
        price: z.number(),
        origin: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const checkoutUrl = `${input.origin}/checkout/course/${input.courseId}`;

      return {
        success: true,
        checkoutUrl,
        priceId: `pri_course_${input.courseId}`,
        price: input.price,
      };
    }),

  // Get subscription status
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return {
        hasActiveSubscription: false,
        plan: null,
        status: null,
      };
    }

    return {
      hasActiveSubscription: ctx.user.subscriptionTier === "premium",
      plan: ctx.user.subscriptionTier === "premium" ? "Pro" : null,
      status: "active",
      renewalDate: new Date(Date.now() + 30 * 86400000),
      price: 9.99,
    };
  }),

  // Handle webhook from Paddle
  handleWebhook: publicProcedure
    .input(
      z.object({
        alertName: z.string(),
        subscriptionId: z.number().optional(),
        productId: z.number().optional(),
        orderId: z.string().optional(),
        amount: z.string().optional(),
        currency: z.string().optional(),
        email: z.string().optional(),
        userId: z.string().optional(),
        status: z.string().optional(),
        signature: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // In production, verify signature and update database
      console.log(`[Paddle] Webhook received: ${input.alertName}`);

      switch (input.alertName) {
        case "subscription_created":
          console.log(`[Paddle] Subscription created: ${input.subscriptionId}`);
          break;
        case "subscription_updated":
          console.log(`[Paddle] Subscription updated: ${input.subscriptionId}`);
          break;
        case "subscription_cancelled":
          console.log(`[Paddle] Subscription cancelled: ${input.subscriptionId}`);
          break;
        case "payment_succeeded":
          console.log(`[Paddle] Payment succeeded: ${input.orderId}`);
          break;
      }

      return { received: true };
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    // In production, call Paddle API to cancel
    return {
      success: true,
      message: "Subscription will be cancelled at the end of the billing period",
      effectiveDate: new Date(Date.now() + 30 * 86400000),
    };
  }),

  // Get payment history
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    return {
      payments: [
        {
          id: 1,
          date: new Date(),
          amount: 9.99,
          description: "Pro Membership - Monthly",
          status: "completed",
        },
      ],
    };
  }),

  // Generate license key (for premium access)
  generateLicenseKey: protectedProcedure.mutation(async ({ ctx }) => {
    const key = `CL-${ctx.user.id}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      success: true,
      licenseKey: key,
    };
  }),

  // Validate license key
  validateLicense: publicProcedure
    .input(z.object({ licenseKey: z.string() }))
    .query(async ({ input }) => {
      // In production, validate against database
      const isValid = input.licenseKey.startsWith("CL-");
      return {
        valid: isValid,
        user: isValid ? { id: 1, name: "Premium User" } : null,
      };
    }),
});