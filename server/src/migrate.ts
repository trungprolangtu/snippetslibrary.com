import 'dotenv/config';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig } from '@neondatabase/serverless';

const runMigrations = async () => {
  // Configure Neon for serverless
  neonConfig.fetchConnectionCache = true;
  
  const db = drizzle(process.env.DATABASE_URL!);
  
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
