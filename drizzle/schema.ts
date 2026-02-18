import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Poll submissions — stores every completed poll response.
 * Each answer column stores the selected option label for that question index.
 */
export const pollSubmissions = mysqlTable("poll_submissions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }),
  q0: varchar("q0", { length: 255 }),
  q1: varchar("q1", { length: 255 }),
  q2: varchar("q2", { length: 255 }),
  q3: varchar("q3", { length: 255 }),
  q4: varchar("q4", { length: 255 }),
  q5: varchar("q5", { length: 255 }),
  q6: varchar("q6", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PollSubmission = typeof pollSubmissions.$inferSelect;
export type InsertPollSubmission = typeof pollSubmissions.$inferInsert;