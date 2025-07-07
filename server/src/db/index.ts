import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// Database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type DbType = typeof db;
