import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.local", override: true });
} else {
  dotenv.config({ path: ".env", override: true });
}

function configDb() {
  const dbConfig: PoolConfig = {
    connectionString: process.env.POSTGRES_URL,
    ssl: false,
  };
  return dbConfig;
}

export const pool = new Pool(configDb());
