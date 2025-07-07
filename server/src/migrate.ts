import 'dotenv/config';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const runMigrations = async () => {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
  });
  
  const db = drizzle(pool);
  
  console.log('⏳ Running migrations...');
  
  const start = Date.now();
  
  await migrate(db, { migrationsFolder: './drizzle' });
  
  const end = Date.now();
  
  console.log(`✅ Migrations completed in ${end - start}ms`);
  
  process.exit(0);
};

runMigrations().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
