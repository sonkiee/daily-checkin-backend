import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { Users } from "../users/users.schema";

export const Checkins = pgTable("checkins", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => Users.id, {
      onDelete: "cascade",
    }),
  checkinDate: timestamp("checkin_date").notNull(),
  pointsEarned: integer("points_earned").notNull().default(0),
  streakDay: integer("streak_day").notNull().default(0),
  bonusMultiplier: integer("bonus_multiplier").notNull().default(1),
  adWatched: boolean("ad_watched").notNull().default(false),
  adRewardClaimed: boolean("ad_reward_claimed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Checkin = InferSelectModel<typeof Checkins>;
export type NewCheckin = InferInsertModel<typeof Checkins>;
