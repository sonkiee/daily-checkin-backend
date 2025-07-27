import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { Checkin, Checkins, NewCheckin } from "./checkins.schema";

class CheckinsService {
  async findAll(): Promise<Checkin[]> {
    return db.select().from(Checkins);
  }

  async findById(id: string): Promise<Checkin | null> {
    const result = await db.select().from(Checkins).where(eq(Checkins.id, id));
    return result[0] ?? null;
  }

  async findByUser(userId: string): Promise<Checkin[]> {
    return db.select().from(Checkins).where(eq(Checkins.userId, userId));
  }

  async create(data: NewCheckin): Promise<Checkin> {
    const result = await db.insert(Checkins).values(data).returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(Checkins).where(eq(Checkins.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const checkinsService = new CheckinsService();
