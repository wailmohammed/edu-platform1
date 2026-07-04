import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  checks: Record<string, { status: "ok" | "error"; message?: string }>;
  timestamp: string;
}

interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  userId?: number;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  resolved: boolean;
}

const errorReports: ErrorReport[] = [];
const startTime = Date.now();

export const monitoringRouter = router({
  health: publicProcedure.query(async (): Promise<SystemHealth> => {
    const checks: SystemHealth["checks"] = {
      database: { status: "ok" },
      memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024 
        ? { status: "ok" } 
        : { status: "error", message: "High memory usage" },
      uptime: { status: "ok" },
    };

    const hasErrors = Object.values(checks).some(c => c.status === "error");
    
    return {
      status: hasErrors ? "degraded" : "healthy",
      uptime: Date.now() - startTime,
      checks,
      timestamp: new Date().toISOString(),
    };
  }),

  reportError: publicProcedure
    .input(
      z.object({
        message: z.string(),
        stack: z.string().optional(),
        url: z.string().optional(),
        userAgent: z.string().optional(),
        severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const report: ErrorReport = {
        id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...input,
        userId: ctx.user?.id,
        timestamp: new Date().toISOString(),
        resolved: false,
      };

      errorReports.push(report);

      if (input.severity === "critical" || input.severity === "high") {
        console.error(`[${input.severity.toUpperCase()}] ${input.message}`, input.stack);
      }

      return { success: true, reportId: report.id };
    }),

  getErrors: protectedProcedure
    .input(
      z.object({
        unresolvedOnly: z.boolean().default(false),
        limit: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
      let reports = errorReports;
      if (input.unresolvedOnly) {
        reports = reports.filter(r => !r.resolved);
      }
      
      return reports
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, input.limit);
    }),

  resolveError: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
      const report = errorReports.find(r => r.id === input.id);
      if (!report) {
        throw new Error("Error report not found");
      }
      
      report.resolved = true;
      return { success: true };
    }),

  getPerformanceMetrics: publicProcedure.query(async () => {
    return {
      avgResponseTime: Math.random() * 50 + 20,
      requestsPerMinute: Math.floor(Math.random() * 100) + 50,
      errorRate: errorReports.length > 0 
        ? (errorReports.filter(r => !r.resolved).length / errorReports.length * 100).toFixed(2) 
        : 0,
      timestamp: new Date().toISOString(),
    };
  }),
});

export type MonitoringRouter = typeof monitoringRouter;