// users.service.ts

import { db } from "../../config/db";
import { Users, NewUser, User } from "./users.schema";
import { eq } from "drizzle-orm";

export const usersService = {
  findById: async (id: string): Promise<User | null> => {
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.id, id))
      .limit(1);

    return user ?? null;
  },

  findByDeviceId: async (deviceId: string): Promise<User | null> => {
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.deviceId, deviceId))
      .limit(1);

    return user ?? null;
  },

  create: async (userData: NewUser): Promise<User> => {
    const [newUser] = await db
      .insert(Users)
      .values({
        ...userData,
        id: crypto.randomUUID(), // Generate UUID
      })
      .returning();

    return newUser;
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const [updatedUser] = await db
      .update(Users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(Users.id, id))
      .returning();

    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  },

  updatePoints: async (id: string, pointsToAdd: number): Promise<User> => {
    const currentUser = await usersService.findById(id);
    if (!currentUser) {
      throw new Error("User not found");
    }

    // Update with new total
    const [updatedUser] = await db
      .update(Users)
      .set({
        totalPoints: currentUser.totalPoints + pointsToAdd,
        updatedAt: new Date(),
      })
      .where(eq(Users.id, id))
      .returning();

    return updatedUser;
  },

  updateStreak: async (
    id: string,
    currentStreak: number,
    longestStreak?: number
  ): Promise<User> => {
    const updateData: Partial<User> = {
      currentStreak,
      lastCheckin: new Date(),
      updatedAt: new Date(),
    };

    if (longestStreak !== undefined) {
      updateData.longestStreak = longestStreak;
    }

    const [updatedUser] = await db
      .update(Users)
      .set(updateData)
      .where(eq(Users.id, id))
      .returning();

    if (!updatedUser) throw new Error("User not found");

    return updatedUser;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await db.delete(Users).where(eq(Users.id, id));

    return (result.rowCount ?? 0) > 0;
  },

  findAll: async (): Promise<User[]> => {
    return await db.select().from(Users).orderBy(Users.createdAt);
  },

  // Get users with high streaks for leaderboard
  getTopStreaks: async (limit: number = 10): Promise<User[]> => {
    return await db
      .select()
      .from(Users)
      .where(eq(Users.isActive, true))
      .orderBy(Users.currentStreak)
      .limit(limit);
  },
};
