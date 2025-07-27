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
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  points: integer("points").notNull(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type PointsTransactions = InferSelectModel<typeof PointsTransactions>;
export type NewPointsTransaction = InferInsertModel<typeof PointsTransactions>;
