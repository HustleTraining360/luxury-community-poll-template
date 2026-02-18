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

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "owner-123",
      email: "admin@example.com",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "user-456",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("poll.submit", () => {
  it("accepts valid submission with all fields", async () => {
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

  it("accepts submission without email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.poll.submit({
      q0: "Luxury Lover",
    });
    expect(result).toEqual({ success: true });
  });

  it("accepts submission with empty email string", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.poll.submit({
      email: "",
      q0: "Wellness Focused",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("admin routes", () => {
  it("admin.submissions returns array", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.submissions();
    expect(Array.isArray(result)).toBe(true);
  });

  it("admin.submissionCount returns a number", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.submissionCount();
    expect(typeof result).toBe("number");
  });

  it("admin.exportCsv returns CSV string with headers", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const csv = await caller.admin.exportCsv();
    expect(typeof csv).toBe("string");
    expect(csv).toContain("ID");
    expect(csv).toContain("Email");
    expect(csv).toContain("How would friends describe you");
  });

  it("rejects non-admin users from admin.submissions", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.submissions()).rejects.toThrow();
  });

  it("rejects unauthenticated users from admin.submissions", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.submissions()).rejects.toThrow();
  });
});
