// Add these methods to your checkins.service.ts

import { Checkins, NewCheckin, Checkin } from "./checkins.schema";
import { Users } from "../users/users.schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { db } from "../../config/db";

export const checkinsService = {
  // Atomic checkin creation with user points update
  createCheckinWithPointsUpdate: async (userId: string) => {
    return await db.transaction(async (tx) => {
      // 1. Check if user already checked in today (within transaction)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfDay = new Date(today);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const [existingCheckin] = await tx
        .select()
        .from(Checkins)
        .where(
          and(
            eq(Checkins.userId, userId),
            gte(Checkins.checkinDate, startOfDay),
            lt(Checkins.checkinDate, endOfDay)
          )
        )
        .limit(1);

      if (existingCheckin) {
        return {
          success: false,
          message: "Already checked in today",
          data: existingCheckin,
        };
      }

      // 2. Get current user data (within transaction for consistency)
      const [user] = await tx
        .select()
        .from(Users)
        .where(eq(Users.id, userId))
        .limit(1);

      if (!user) {
        return {
          success: false,
          message: "User not found",
          data: null,
        };
      }

      // 3. Calculate streak and points
      const streakData = calculateStreak(user.lastCheckin, user.currentStreak);
      const pointsEarned = calculatePoints(streakData.newStreak);
      const bonusMultiplier = calculateBonusMultiplier(streakData.newStreak);

      // 4. Create checkin record (within transaction)
      const checkinData = {
        id: crypto.randomUUID(),
        userId,
        checkinDate: new Date(),
        pointsEarned,
        streakDay: streakData.newStreak,
        bonusMultiplier,
      };

      const [newCheckin] = await tx
        .insert(Checkins)
        .values(checkinData)
        .returning();

      // 5. Update user's profile (within same transaction)
      const [updatedUser] = await tx
        .update(Users)
        .set({
          totalPoints: user.totalPoints + pointsEarned,
          currentStreak: streakData.newStreak,
          longestStreak: Math.max(user.longestStreak, streakData.newStreak),
          lastCheckin: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(Users.id, userId))
        .returning();

      // 6. Return success with both checkin and user data
      return {
        success: true,
        message: "Check-in successful!",
        data: {
          checkin: newCheckin,
          user: {
            totalPoints: updatedUser.totalPoints,
            currentStreak: updatedUser.currentStreak,
            longestStreak: updatedUser.longestStreak,
            pointsEarned,
          },
          streakInfo: {
            isNewStreak: streakData.newStreak === 1,
            streakBroken: streakData.streakBroken,
            bonusMultiplier,
          },
        },
      };
    });
  },
  // Existing methods...

  findByUserAndDate: async (
    userId: string,
    date: Date
  ): Promise<Checkin | null> => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [checkin] = await db
      .select()
      .from(Checkins)
      .where(
        and(
          eq(Checkins.userId, userId),
          gte(Checkins.checkinDate, startOfDay),
          lt(Checkins.checkinDate, endOfDay)
        )
      )
      .limit(1);

    return checkin || null;
  },

  findByUser: async (userId: string): Promise<Checkin[]> => {
    return await db
      .select()
      .from(Checkins)
      .where(eq(Checkins.userId, userId))
      .orderBy(Checkins.checkinDate);
  },

  findAll: async (): Promise<Checkin[]> => {
    return await db.select().from(Checkins).orderBy(Checkins.createdAt);
  },

  findById: async (id: string): Promise<Checkin | null> => {
    const [checkin] = await db
      .select()
      .from(Checkins)
      .where(eq(Checkins.id, id))
      .limit(1);

    return checkin || null;
  },

  create: async (checkinData: NewCheckin): Promise<Checkin> => {
    const [newCheckin] = await db
      .insert(Checkins)
      .values({
        ...checkinData,
        id: crypto.randomUUID(), // Generate UUID
      })
      .returning();

    return newCheckin;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await db.delete(Checkins).where(eq(Checkins.id, id));

    return (result.rowCount ?? 0) > 0;
  },

  // Get user's checkin history with pagination
  findByUserPaginated: async (
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Checkin[]> => {
    return await db
      .select()
      .from(Checkins)
      .where(eq(Checkins.userId, userId))
      .orderBy(Checkins.checkinDate)
      .limit(limit)
      .offset(offset);
  },

  // Get recent checkins for a user (last N days)
  findRecentByUser: async (
    userId: string,
    days: number = 30
  ): Promise<Checkin[]> => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await db
      .select()
      .from(Checkins)
      .where(
        and(eq(Checkins.userId, userId), gte(Checkins.checkinDate, cutoffDate))
      )
      .orderBy(Checkins.checkinDate);
  },
};

const calculateStreak = (lastCheckin: Date | null, currentStreak: number) => {
  if (!lastCheckin) {
    return { newStreak: 1, streakBroken: false };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const lastCheckinDate = new Date(lastCheckin);
  lastCheckinDate.setHours(0, 0, 0, 0);

  // If last checkin was yesterday, continue streak
  if (lastCheckinDate.getTime() === yesterday.getTime()) {
    return { newStreak: currentStreak + 1, streakBroken: false };
  }

  // If last checkin was not yesterday, streak is broken
  return { newStreak: 1, streakBroken: true };
};

const calculatePoints = (streakDay: number): number => {
  const basePoints = 10;

  // Streak bonuses
  if (streakDay >= 30) return basePoints * 3; // 3x bonus
  if (streakDay >= 14) return basePoints * 2; // 2x bonus
  if (streakDay >= 7) return Math.floor(basePoints * 1.5); // 1.5x bonus

  return basePoints;
};

const calculateBonusMultiplier = (streakDay: number): number => {
  if (streakDay >= 30) return 3;
  if (streakDay >= 14) return 2;
  if (streakDay >= 7) return 1.5;
  return 1;
};
