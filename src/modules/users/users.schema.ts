import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { timestamp } from "drizzle-orm/gel-core";

import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

const Users = pgTable("users", {
  id: uuid("id").primaryKey(),
  deviceId: varchar("device_id", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Users = InferSelectModel<typeof Users>;
export type NewUser = InferInsertModel<typeof Users>;
