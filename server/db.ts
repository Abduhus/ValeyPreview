import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

let db: ReturnType<typeof drizzle> | null = null;

export function getDatabase() {
  if (db) {
    return db;
  }

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.warn("⚠️  DATABASE_URL not provided, using in-memory storage");
    return null;
  }

  try {
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema });
    console.log("✅ Database connection established");
    return db;
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    console.warn("⚠️  Falling back to in-memory storage");
    return null;
  }
}

export type Database = NonNullable<ReturnType<typeof getDatabase>>;