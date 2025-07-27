import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const Checkins = pgTable("checkins", {});

export type Checkins = InferSelectModel<typeof Checkins>;
export type NewCheckin = InferInsertModel<typeof Checkins>;
