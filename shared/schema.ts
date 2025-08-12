import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default('free'), // free, premium_monthly, premium_annual
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  currentStreak: integer("current_streak").default(0),
  totalMinutes: integer("total_minutes").default(0),
  sessionsCompleted: integer("sessions_completed").default(0),
  badgesEarned: integer("badges_earned").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories for organizing sessions
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"), // FontAwesome icon class
  color: varchar("color"), // Tailwind color class
  sessionCount: integer("session_count").default(0),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audio sessions/meditations
export const sessions_table = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  categoryId: varchar("category_id").references(() => categories.id),
  guideName: varchar("guide_name").notNull(),
  duration: integer("duration").notNull(), // in minutes
  audioUrl: varchar("audio_url"),
  imageUrl: varchar("image_url"),
  isPremium: boolean("is_premium").default(false),
  likes: integer("likes").default(0),
  plays: integer("plays").default(0),
  isFeatured: boolean("is_featured").default(false),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User session progress
export const userSessionProgress = pgTable("user_session_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionId: varchar("session_id").references(() => sessions_table.id).notNull(),
  progressMinutes: integer("progress_minutes").default(0),
  isCompleted: boolean("is_completed").default(false),
  lastPlayedAt: timestamp("last_played_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User favorites
export const userFavorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionId: varchar("session_id").references(() => sessions_table.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily progress tracking
export const dailyProgress = pgTable("daily_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  minutesMeditated: integer("minutes_meditated").default(0),
  sessionsCompleted: integer("sessions_completed").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User journal entries
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionId: varchar("session_id").references(() => sessions_table.id),
  content: text("content").notNull(),
  mood: varchar("mood"), // calm, peaceful, energized, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Session = typeof sessions_table.$inferSelect;
export type UserSessionProgress = typeof userSessionProgress.$inferSelect;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type DailyProgress = typeof dailyProgress.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories);
export const insertSessionSchema = createInsertSchema(sessions_table);
export const insertUserSessionProgressSchema = createInsertSchema(userSessionProgress);
export const insertUserFavoriteSchema = createInsertSchema(userFavorites);
export const insertDailyProgressSchema = createInsertSchema(dailyProgress);
export const insertJournalEntrySchema = createInsertSchema(journalEntries);

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertUserSessionProgress = z.infer<typeof insertUserSessionProgressSchema>;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type InsertDailyProgress = z.infer<typeof insertDailyProgressSchema>;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
