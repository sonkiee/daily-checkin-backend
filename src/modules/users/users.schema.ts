import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core"; // ✅ Correct import

const Users = pgTable("users", {
  id: uuid("id").primaryKey(),
  deviceId: varchar("device_id", { length: 64 }).notNull(),
  totalPoints: varchar("total_points", { length: 10 }).notNull().default("0"),
  currentStreak: varchar("current_streak", { length: 10 })
    .notNull()
    .default("0"),
  longestStreak: varchar("longest_streak", { length: 10 })
    .notNull()
    .default("0"),
  lastCheckin: timestamp("last_checkin").notNull(),
  isActive: varchar("is_active", { length: 10 }).notNull().default("true"),
  pushToken: varchar("push_token", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Users = InferSelectModel<typeof Users>;
export type NewUser = InferInsertModel<typeof Users>;
