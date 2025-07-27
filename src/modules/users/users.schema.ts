import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: uuid("id").primaryKey(),
  deviceId: varchar("device_id", { length: 64 }).notNull().unique(),
  totalPoints: integer("total_points").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastCheckin: timestamp("last_checkin").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  pushToken: varchar("push_token", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const UserSettings = pgTable("user_settings", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),
  checkinReminder: boolean("checkin_reminder").default(true),
  darkMode: boolean("dark_mode").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Users = InferSelectModel<typeof Users>;
export type NewUser = InferInsertModel<typeof Users>;
