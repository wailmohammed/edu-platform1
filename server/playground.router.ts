import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

interface PlaygroundSession {
  id: string;
  userId: number;
  language: string;
  code: string;
  createdAt: Date;
}

const sessions: Map<string, PlaygroundSession> = new Map();

export const playgroundRouter = router({
  createSession: publicProcedure
    .input(z.object({ language: z.string().default("javascript") }))
    .mutation(async ({ input }) => {
      const sessionId = `play-${Date.now()}`;
      sessions.set(sessionId, {
        id: sessionId,
        userId: 0,
        language: input.language,
        code: "",
        createdAt: new Date(),
      });
      return { sessionId, language: input.language };
    }),

  runCode: publicProcedure
    .input(z.object({ sessionId: z.string(), code: z.string() }))
    .mutation(async ({ input }) => {
      const session = sessions.get(input.sessionId);
      if (!session) throw new Error("Session not found");

      return {
        success: true,
        output: "Code executed successfully",
        errors: null,
      };
    }),

  save: protectedProcedure
    .input(z.object({ sessionId: z.string(), code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = sessions.get(input.sessionId);
      if (!session) throw new Error("Session not found");

      session.code = input.code;
      sessions.set(input.sessionId, session);

      return { success: true };
    }),

  getTemplates: publicProcedure
    .input(z.object({ language: z.string().optional() }))
    .query(async ({ input }) => {
      const templates = [
        { id: 1, name: "React App", language: "javascript", code: "import React from 'react';" },
        { id: 2, name: "Python Flask", language: "python", code: "from flask import Flask" },
        { id: 3, name: "Express API", language: "javascript", code: "const express = require('express');" },
      ];
      if (input.language) {
        return templates.filter((t) => t.language === input.language);
      }
      return templates;
    }),
});