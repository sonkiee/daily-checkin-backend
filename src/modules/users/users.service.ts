// users.service.ts

import { db } from "../../config/db";
import { Users, NewUser, User } from "./users.schema";
import { eq } from "drizzle-orm";

export const usersService = {
  findById: async (id: string): Promise<User | null> => {
    try {
      const [user] = await db
        .select()
        .from(Users)
        .where(eq(Users.id, id))
        .limit(1);

      return user || null;
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  },

  findByDeviceId: async (deviceId: string): Promise<User | null> => {
    try {
      const [user] = await db
        .select()
        .from(Users)
        .where(eq(Users.deviceId, deviceId))
        .limit(1);

      return user || null;
    } catch (error) {
      console.error("Error finding user by device id:", error);
      throw error;
    }
  },

  create: async (userData: NewUser): Promise<User> => {
    try {
      const [newUser] = await db
        .insert(Users)
        .values({
          ...userData,
          id: crypto.randomUUID(), // Generate UUID
        })
        .returning();

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const [updatedUser] = await db
        .update(Users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(Users.id, id))
        .returning();

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  updatePoints: async (id: string, pointsToAdd: number): Promise<User> => {
    try {
      // First get the current user
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
    } catch (error) {
      console.error("Error updating user points:", error);
      throw error;
    }
  },

  updateStreak: async (
    id: string,
    currentStreak: number,
    longestStreak?: number
  ): Promise<User> => {
    try {
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

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user streak:", error);
      throw error;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const result = await db.delete(Users).where(eq(Users.id, id));

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  findAll: async (): Promise<User[]> => {
    try {
      return await db.select().from(Users).orderBy(Users.createdAt);
    } catch (error) {
      console.error("Error finding all users:", error);
      throw error;
    }
  },

  // Get users with high streaks for leaderboard
  getTopStreaks: async (limit: number = 10): Promise<User[]> => {
    try {
      return await db
        .select()
        .from(Users)
        .where(eq(Users.isActive, true))
        .orderBy(Users.currentStreak)
        .limit(limit);
    } catch (error) {
      console.error("Error getting top streaks:", error);
      throw error;
    }
  },
};
