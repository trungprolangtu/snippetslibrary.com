import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

// Configure Neon for Cloudflare Workers
neonConfig.fetchConnectionCache = true;

// Create database connection function that creates a fresh connection each time
export function createDb() {
  return drizzle(process.env.DATABASE_URL!, { schema });
}

// For compatibility, also export db but recommend using createDb() in handlers
export const db = createDb();

export type DbType = typeof db;
