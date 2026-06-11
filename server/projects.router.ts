import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const projects = [
  {
    id: 1,
    slug: "tribute-page",
    title: "Tribute Page",
    certification: "Responsive Web Design",
    difficulty: "beginner",
    description: "Build a tribute page for someone you admire",
    userStories: [
      "I can see an image with a caption",
      "I can see a title",
      "I can see a list",
      "I can see a link",
    ],
    tests: 10,
    estimatedHours: 15,
  },
  {
    id: 2,
    slug: "survey-form",
    title: "Survey Form",
    certification: "Responsive Web Design",
    difficulty: "beginner",
    description: "Build a responsive survey form",
    userStories: [
      "I can see form fields",
      "Form validates input",
      "Form submits correctly",
    ],
    tests: 12,
    estimatedHours: 20,
  },
  {
    id: 3,
    slug: "javascript-calculator",
    title: "JavaScript Calculator",
    certification: "JavaScript Algorithms",
    difficulty: "intermediate",
    description: "Build a working calculator with JavaScript",
    userStories: [
      "I can add, subtract, multiply, divide",
      "I can chain operations",
      "Decimal points work correctly",
      "Clear button resets",
    ],
    tests: 15,
    estimatedHours: 25,
  },
  {
    id: 4,
    slug: "pomodoro-clock",
    title: "Pomodoro Clock",
    certification: "JavaScript Algorithms",
    difficulty: "intermediate",
    description: "Build a productivity timer",
    userStories: [
      "Start/stop timer",
      "Reset timer",
      "Adjust session/break length",
      "Play audio on end",
    ],
    tests: 16,
    estimatedHours: 30,
  },
];

export const projectsRouter = router({
  getByCertification: publicProcedure
    .input(z.object({ certificationId: z.string() }))
    .query(async ({ input }) => {
      return projects.filter((p) => p.certification === input.certificationId);
    }),

  getById: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return projects.find((p) => p.id === input.projectId) || null;
    }),

  submit: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = projects.find((p) => p.id === input.projectId);
      return {
        success: true,
        passed: true,
        score: 100,
        certificate: project ? `${project.certification} Certification` : null,
      };
    }),

  listAll: publicProcedure.query(async () => {
    return projects;
  }),
});