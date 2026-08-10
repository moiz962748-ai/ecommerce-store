import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// .env file se DATABASE_URL read karne ke liye
dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts', // Database tables yahan define hongi
  out: './drizzle',             // Migrations yahan generate hongi
  dialect: 'postgresql',        // Supabase Postgres use karta hai
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});