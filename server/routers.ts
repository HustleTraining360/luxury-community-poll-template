import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createPollSubmission,
  getAllPollSubmissions,
  getPollSubmissionCount,
  deleteAllPollSubmissions,
} from "./db";

const submitSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  // Original 7 questions
  q0: z.string().optional(),
  q1: z.string().optional(),
  q2: z.string().optional(),
  q3: z.string().optional(),
  q4: z.string().optional(),
  q5: z.string().optional(),
  q6: z.string().optional(),
  // Household & Life Stage
  q7: z.string().optional(),
  q8: z.string().optional(),
  q9: z.string().optional(),
  q9Ages: z.string().optional(),
  // Age & Work Stage
  q10: z.string().optional(),
  q11: z.string().optional(),
  // Availability
  q12: z.string().optional(),
  q13: z.string().optional(),
  // Wellness (multi-select comma-separated)
  q14: z.string().optional(),
  q15: z.string().optional(),
  // Lifestyle (multi-select comma-separated)
  q16: z.string().optional(),
  q17: z.string().optional(),
  // Pets & Hobbies
  q18: z.string().optional(),
  q18Other: z.string().optional(),
  q19: z.string().optional(),
  // Communication
  q20: z.string().optional(),
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
        q7: input.q7 ?? null,
        q8: input.q8 ?? null,
        q9: input.q9 ?? null,
        q9Ages: input.q9Ages ?? null,
        q10: input.q10 ?? null,
        q11: input.q11 ?? null,
        q12: input.q12 ?? null,
        q13: input.q13 ?? null,
        q14: input.q14 ?? null,
        q15: input.q15 ?? null,
        q16: input.q16 ?? null,
        q17: input.q17 ?? null,
        q18: input.q18 ?? null,
        q18Other: input.q18Other ?? null,
        q19: input.q19 ?? null,
        q20: input.q20 ?? null,
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

    /** Public: clear all submissions */
    clearAll: publicProcedure.mutation(async () => {
      await deleteAllPollSubmissions();
      return { success: true };
    }),

    /** Public: export CSV string */
    exportCsv: publicProcedure.query(async () => {
      const rows = await getAllPollSubmissions();
      const headers = [
        "ID",
        "Timestamp",
        "Email",
        // Original
        "How would friends describe you",
        "When you attend events you",
        "What makes you proud to live here",
        "What would WOW you",
        "What would make you invite a friend",
        "What format do you prefer",
        "Interested in VIP early access",
        // Household
        "Household type",
        "Household size",
        "Children at home",
        "Children ages",
        // Age
        "Age range",
        "Work status",
        // Availability
        "Most available",
        "Attendance frequency",
        // Wellness
        "Wellness interests",
        "Fitness level",
        // Lifestyle
        "Lifestyle interests",
        "Event energy",
        // Pets & Hobbies
        "Pets",
        "Pets other",
        "Hobbies",
        // Communication
        "Notification preference",
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
          r.q7 ?? "",
          r.q8 ?? "",
          r.q9 ?? "",
          r.q9Ages ?? "",
          r.q10 ?? "",
          r.q11 ?? "",
          r.q12 ?? "",
          r.q13 ?? "",
          r.q14 ?? "",
          r.q15 ?? "",
          r.q16 ?? "",
          r.q17 ?? "",
          r.q18 ?? "",
          r.q18Other ?? "",
          r.q19 ?? "",
          r.q20 ?? "",
        ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
        csvRows.push(vals.join(","));
      }
      return csvRows.join("\n");
    }),
  }),
});

export type AppRouter = typeof appRouter;
