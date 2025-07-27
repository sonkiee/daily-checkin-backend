import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

const Users = pgTable("users", {});

export type Users = InferSelectModel<typeof Users>;
export type NewUser = InferInsertModel<typeof Users>;
