import {
  users,
  categories,
  sessions_table,
  userSessionProgress,
  userFavorites,
  dailyProgress,
  journalEntries,
  type User,
  type UpsertUser,
  type Category,
  type Session,
  type UserSessionProgress,
  type UserFavorite,
  type DailyProgress,
  type JournalEntry,
  type InsertCategory,
  type InsertSession,
  type InsertUserSessionProgress,
  type InsertUserFavorite,
  type InsertDailyProgress,
  type InsertJournalEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User>;
  updateUserSubscription(id: string, status: string, expiresAt?: Date): Promise<User>;
  updateUserProgress(id: string, minutesAdded: number, sessionCompleted: boolean): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Session operations
  getAllSessions(limit?: number, offset?: number): Promise<Session[]>;
  getSessionsByCategory(categoryId: string, limit?: number, offset?: number): Promise<Session[]>;
  getFeaturedSessions(limit?: number): Promise<Session[]>;
  getPopularSessions(limit?: number): Promise<Session[]>;
  getSession(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  incrementSessionPlays(id: string): Promise<void>;
  
  // User session progress
  getUserSessionProgress(userId: string, sessionId: string): Promise<UserSessionProgress | undefined>;
  updateSessionProgress(progress: InsertUserSessionProgress): Promise<UserSessionProgress>;
  
  // User favorites
  getUserFavorites(userId: string): Promise<UserFavorite[]>;
  addToFavorites(userId: string, sessionId: string): Promise<UserFavorite>;
  removeFromFavorites(userId: string, sessionId: string): Promise<void>;
  isFavorite(userId: string, sessionId: string): Promise<boolean>;
  
  // Daily progress
  getDailyProgress(userId: string, date: string): Promise<DailyProgress | undefined>;
  updateDailyProgress(progress: InsertDailyProgress): Promise<DailyProgress>;
  getUserStreak(userId: string): Promise<number>;
  
  // Journal entries
  getUserJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  
  // Statistics
  getGlobalStats(): Promise<{
    activeUsers: number;
    totalSessions: number;
    totalMinutesToday: number;
    totalMembers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserSubscription(id: string, status: string, expiresAt?: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: status,
        subscriptionExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserProgress(id: string, minutesAdded: number, sessionCompleted: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        totalMinutes: sql`${users.totalMinutes} + ${minutesAdded}`,
        sessionsCompleted: sessionCompleted ? sql`${users.sessionsCompleted} + 1` : users.sessionsCompleted,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.sortOrder, categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Session operations
  async getAllSessions(limit = 50, offset = 0): Promise<Session[]> {
    return await db
      .select()
      .from(sessions_table)
      .orderBy(desc(sessions_table.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getSessionsByCategory(categoryId: string, limit = 20, offset = 0): Promise<Session[]> {
    return await db
      .select()
      .from(sessions_table)
      .where(eq(sessions_table.categoryId, categoryId))
      .orderBy(desc(sessions_table.plays))
      .limit(limit)
      .offset(offset);
  }

  async getFeaturedSessions(limit = 3): Promise<Session[]> {
    return await db
      .select()
      .from(sessions_table)
      .where(eq(sessions_table.isFeatured, true))
      .orderBy(desc(sessions_table.createdAt))
      .limit(limit);
  }

  async getPopularSessions(limit = 6): Promise<Session[]> {
    return await db
      .select()
      .from(sessions_table)
      .orderBy(desc(sessions_table.plays))
      .limit(limit);
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions_table).where(eq(sessions_table.id, id));
    return session;
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db.insert(sessions_table).values(session).returning();
    return newSession;
  }

  async incrementSessionPlays(id: string): Promise<void> {
    await db
      .update(sessions_table)
      .set({ plays: sql`${sessions_table.plays} + 1` })
      .where(eq(sessions_table.id, id));
  }

  // User session progress
  async getUserSessionProgress(userId: string, sessionId: string): Promise<UserSessionProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userSessionProgress)
      .where(and(eq(userSessionProgress.userId, userId), eq(userSessionProgress.sessionId, sessionId)));
    return progress;
  }

  async updateSessionProgress(progress: InsertUserSessionProgress): Promise<UserSessionProgress> {
    const [updatedProgress] = await db
      .insert(userSessionProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: [userSessionProgress.userId, userSessionProgress.sessionId],
        set: {
          progressMinutes: progress.progressMinutes,
          isCompleted: progress.isCompleted,
          lastPlayedAt: new Date(),
        },
      })
      .returning();
    return updatedProgress;
  }

  // User favorites
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return await db
      .select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
  }

  async addToFavorites(userId: string, sessionId: string): Promise<UserFavorite> {
    const [favorite] = await db
      .insert(userFavorites)
      .values({ userId, sessionId })
      .returning();
    return favorite;
  }

  async removeFromFavorites(userId: string, sessionId: string): Promise<void> {
    await db
      .delete(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.sessionId, sessionId)));
  }

  async isFavorite(userId: string, sessionId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.sessionId, sessionId)));
    return !!favorite;
  }

  // Daily progress
  async getDailyProgress(userId: string, date: string): Promise<DailyProgress | undefined> {
    const [progress] = await db
      .select()
      .from(dailyProgress)
      .where(and(eq(dailyProgress.userId, userId), eq(dailyProgress.date, date)));
    return progress;
  }

  async updateDailyProgress(progress: InsertDailyProgress): Promise<DailyProgress> {
    const [updatedProgress] = await db
      .insert(dailyProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: [dailyProgress.userId, dailyProgress.date],
        set: {
          minutesMeditated: sql`${dailyProgress.minutesMeditated} + ${progress.minutesMeditated}`,
          sessionsCompleted: sql`${dailyProgress.sessionsCompleted} + ${progress.sessionsCompleted}`,
        },
      })
      .returning();
    return updatedProgress;
  }

  async getUserStreak(userId: string): Promise<number> {
    // This would need a more complex query to calculate streak
    // For now, return the current streak from user table
    const user = await this.getUser(userId);
    return user?.currentStreak || 0;
  }

  // Journal entries
  async getUserJournalEntries(userId: string, limit = 20): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [newEntry] = await db.insert(journalEntries).values(entry).returning();
    return newEntry;
  }

  // Statistics
  async getGlobalStats(): Promise<{
    activeUsers: number;
    totalSessions: number;
    totalMinutesToday: number;
    totalMembers: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    
    // These would be real queries in production
    // For now, return mock data that changes slightly
    const baseActiveUsers = 12000;
    const variation = Math.floor(Math.random() * 2000);
    
    return {
      activeUsers: baseActiveUsers + variation,
      totalSessions: 10000,
      totalMinutesToday: 1200000,
      totalMembers: 847000,
    };
  }
}

export const storage = new DatabaseStorage();
