import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const mockPortfolios: Record<number, any> = {};

export const portfolioRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    return mockPortfolios[ctx.user.id] || {
      id: ctx.user.id,
      userId: ctx.user.id,
      title: "My Portfolio",
      bio: ctx.user.name ? `Hi, I'm ${ctx.user.name}!` : "Learning to code!",
      skills: [],
      projects: [],
      certifications: [],
      githubUrl: null,
      linkedinUrl: null,
      portfolioUrl: null,
    };
  }),

  update: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        bio: z.string().optional(),
        githubUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        portfolioUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!mockPortfolios[ctx.user.id]) {
        mockPortfolios[ctx.user.id] = {
          id: ctx.user.id,
          userId: ctx.user.id,
          skills: [],
          projects: [],
          certifications: [],
        };
      }
      mockPortfolios[ctx.user.id] = { ...mockPortfolios[ctx.user.id], ...input };
      return { success: true };
    }),

  addProject: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        imageUrl: z.string().optional(),
        liveUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        technologies: z.array(z.string()),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!mockPortfolios[ctx.user.id]) {
        mockPortfolios[ctx.user.id] = {
          id: ctx.user.id,
          userId: ctx.user.id,
          skills: [],
          projects: [],
          certifications: [],
        };
      }
      const project = { ...input, id: Date.now(), createdAt: new Date() };
      mockPortfolios[ctx.user.id].projects.push(project);
      return { success: true, project };
    }),

  getPublic: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return mockPortfolios[input.userId] || null;
    }),
});