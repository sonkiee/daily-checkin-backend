import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { NewUser, User, Users } from "./users.schema";

class UserService {
  async findAll(): Promise<User[]> {
    return db.select().from(Users);
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(Users).where(eq(Users.id, id));
    return user ?? null;
  }

  async findByDeviceId(deviceId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.deviceId, deviceId));
    return user ?? null;
  }

  async create(user: NewUser): Promise<User> {
    const [newUser] = await db.insert(Users).values(user).returning();
    return newUser;
  }

  async update(id: string, userData: Partial<NewUser>): Promise<User | null> {
    const [updatedUser] = await db
      .update(Users)
      .set(userData)
      .where(eq(Users.id, id))
      .returning();
    return updatedUser ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(Users).where(eq(Users.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const userService = new UserService();
