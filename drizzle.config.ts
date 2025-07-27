import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL;
export default defineConfig({
  out: "./drizzle",
  schema: [
    "./src/modules/**/**/*.schema.ts", // Include schemas from modular folders
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
