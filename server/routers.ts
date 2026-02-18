import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createPollSubmission,
  getAllPollSubmissions,
  getPollSubmissionCount,
} from "./db";

const submitSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  q0: z.string().optional(),
  q1: z.string().optional(),
  q2: z.string().optional(),
  q3: z.string().optional(),
  q4: z.string().optional(),
  q5: z.string().optional(),
  q6: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  poll: router({
    /** Public: anyone can submit a poll response */
    submit: publicProcedure.input(submitSchema).mutation(async ({ input }) => {
      await createPollSubmission({
        email: input.email || null,
        q0: input.q0 ?? null,
        q1: input.q1 ?? null,
        q2: input.q2 ?? null,
        q3: input.q3 ?? null,
        q4: input.q4 ?? null,
        q5: input.q5 ?? null,
        q6: input.q6 ?? null,
      });
      return { success: true };
    }),
  }),

  admin: router({
    /** Public: get all submissions (analytics dashboard) */
    submissions: publicProcedure.query(async () => {
      return getAllPollSubmissions();
    }),

    /** Public: get submission count */
    submissionCount: publicProcedure.query(async () => {
      return getPollSubmissionCount();
    }),

    /** Public: export CSV string */
    exportCsv: publicProcedure.query(async () => {
      const rows = await getAllPollSubmissions();
      const headers = [
        "ID",
        "Timestamp",
        "Email",
        "How would friends describe you",
        "When you attend events you",
        "What makes you proud to live here",
        "What would WOW you",
        "What would make you invite a friend",
        "What format do you prefer",
        "Interested in VIP early access",
      ];
      const csvRows = [headers.join(",")];
      for (const r of rows) {
        const vals = [
          r.id,
          r.createdAt ? new Date(r.createdAt).toISOString() : "",
          r.email ?? "",
          r.q0 ?? "",
          r.q1 ?? "",
          r.q2 ?? "",
          r.q3 ?? "",
          r.q4 ?? "",
          r.q5 ?? "",
          r.q6 ?? "",
        ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
        csvRows.push(vals.join(","));
      }
      return csvRows.join("\n");
    }),
  }),
});

export type AppRouter = typeof appRouter;
