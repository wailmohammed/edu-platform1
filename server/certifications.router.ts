import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const certifications = [
  {
    id: 1,
    title: "Python Certification",
    description: "Validate Python programming proficiency",
    duration: 90,
    questions: 4,
    skills: ["Syntax", "OOP", "Data Structures"],
    attempts: 120000,
  },
  {
    id: 2,
    title: "JavaScript Certification",
    description: "Validate JavaScript and ES6+ skills",
    duration: 90,
    questions: 4,
    skills: ["DOM", "Async", "Functions"],
    attempts: 95000,
  },
  {
    id: 3,
    title: "Software Engineer Certification",
    description: "Role-based assessment for full-stack positions",
    duration: 120,
    questions: 4,
    skills: ["Problem-solving", "SQL", "REST API"],
    attempts: 45000,
  },
  {
    id: 4,
    title: "AI Engineer Certification",
    description: "Build expertise in AI-powered applications",
    duration: 150,
    questions: 4,
    skills: ["LLM", "Prompting", "Agents", "RAG"],
    attempts: 15000,
  },
];

export const certificationsRouter = router({
  list: publicProcedure.query(async () => {
    return certifications;
  }),

  startAttempt: protectedProcedure
    .input(z.object({ certificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const cert = certifications.find((c) => c.id === input.certificationId);
      if (!cert) throw new Error("Certification not found");

      return {
        success: true,
        attemptId: Date.now(),
        timeLimit: cert.duration * 60,
      };
    }),

  submit: protectedProcedure
    .input(
      z.object({
        attemptId: z.number(),
        answers: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        score: 85,
        passed: true,
        certificateUrl: `/certificates/${ctx.user.id}/${input.attemptId}`,
      };
    }),

  getUserCertificates: protectedProcedure.query(async ({ ctx }) => {
    return [
      { id: 1, title: "Python", issued: new Date(), score: 92 },
    ];
  }),
});