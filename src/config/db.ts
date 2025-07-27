import { Pool } from "pg";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = drizzle(pool!);

const initDB = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Error initializing the database:", error);
    process.exit(1);
  }
};

export { db, initDB };
