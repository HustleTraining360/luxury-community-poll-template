import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("poll.submit", () => {
  it("accepts valid submission with all original fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.poll.submit({
      email: "test@example.com",
      q0: "Social Connector",
      q1: "Bring Guests",
      q2: "The People",
      q3: "Private Chef Night",
      q4: "Elegant & Upscale",
      q5: "Small & Curated",
      q6: "Yes, Absolutely",
    });
    expect(result).toEqual({ success: true });
  });

  it("accepts submission with all new section fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.poll.submit({
      email: "full@example.com",
      q0: "Luxury Lover",
      q1: "Bring Guests",
      q2: "The People",
      q3: "Sunset Party",
      q4: "Elegant & Upscale",
      q5: "Small & Curated",
      q6: "Yes, Absolutely",
      // Household
      q7: "Couple",
      q8: "2",
      q9: "No",
      // Age
      q10: "40–49",
      q11: "Full-Time",
      // Availability
      q12: "Weekend Evenings",
      q13: "2–3x / Month",
      // Wellness (multi-select)
      q14: "Yoga / Pilates,Walking Club,Meditation",
      q15: "Intermediate",
      // Lifestyle (multi-select)
      q16: "Social Mixers,Live Music,Cooking / Cocktails",
      q17: "A Mix",
      // Pets
      q18: "Dog(s)",
      // Hobbies (multi-select)
      q19: "Travel,Food & Wine,Reading",
      // Communication
      q20: "Email",
    });
    expect(result).toEqual({ success: true });
  });

  it("accepts submission with conditional fields (children ages, pets other)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.poll.submit({
      q7: "Young Family",
      q8: "4",
      q9: "Yes",
      q9Ages: "3, 7",
      q18: "Other",
      q18Other: "Parrot",
    });
    expect(result).toEqual({ success: true });
  });

  it("accepts submission without email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.poll.submit({
      q0: "Luxury Lover",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("analytics routes (public)", () => {
  it("admin.submissions returns array without auth", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.admin.submissions();
    expect(Array.isArray(result)).toBe(true);
  });

  it("admin.submissionCount returns a number without auth", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.admin.submissionCount();
    expect(typeof result).toBe("number");
  });

  it("admin.exportCsv returns CSV string with all headers", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const csv = await caller.admin.exportCsv();
    expect(typeof csv).toBe("string");
    expect(csv).toContain("ID");
    expect(csv).toContain("Email");
    expect(csv).toContain("How would friends describe you");
    // New section headers
    expect(csv).toContain("Household type");
    expect(csv).toContain("Age range");
    expect(csv).toContain("Most available");
    expect(csv).toContain("Wellness interests");
    expect(csv).toContain("Lifestyle interests");
    expect(csv).toContain("Hobbies");
    expect(csv).toContain("Notification preference");
  });
});
