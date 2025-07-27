import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { Users } from "../users/users.schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const PointsTransactions = pgTable("points_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),

  pointsChange: integer("points_change").notNull(), // Rename to reflect actual delta
  transactionType: varchar("transaction_type", { length: 32 }).notNull(), // Keep it shorter if possible
  description: varchar("description", { length: 255 }),

  // Optional for linking checkins, bonuses, rewards etc.
  referenceId: uuid("reference_id"),

  source: varchar("source", { length: 50 }).default("manual"), // optional: track where it came from (e.g. checkin, admin, streak-bonus)

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type PointsTransactions = InferSelectModel<typeof PointsTransactions>;
export type NewPointsTransaction = InferInsertModel<typeof PointsTransactions>;
