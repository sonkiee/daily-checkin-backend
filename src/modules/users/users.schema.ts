import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core"; // ✅ Correct import

const Users = pgTable("users", {
  id: uuid("id").primaryKey(),
  deviceId: varchar("device_id", { length: 64 }).notNull(),
  pushToken: varchar("push_token", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Users = InferSelectModel<typeof Users>;
export type NewUser = InferInsertModel<typeof Users>;
