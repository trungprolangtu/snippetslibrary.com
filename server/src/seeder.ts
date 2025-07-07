import { db } from './db';
import { users, snippets } from './db/schema';
import { eq, isNotNull, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

/**
 * Utility functions for database seeding
 */
export class DatabaseSeeder {
  /**
   * Clear all data from the database
   */
  static async clearDatabase() {
    console.log('🧹 Clearing database...');
    await db.delete(snippets);
    await db.delete(users);
    console.log('✅ Database cleared');
  }

  /**
   * Get the first user from the database
   */
  static async getFirstUser() {
    const firstUser = await db.select().from(users).limit(1);
    return firstUser[0] || null;
  }

  /**
   * Get all users from the database
   */
  static async getAllUsers() {
    return await db.select().from(users);
  }

  /**
   * Get all snippets from the database
   */
  static async getAllSnippets() {
    return await db.select().from(snippets);
  }

  /**
   * Get public snippets with SEO configured
   */
  static async getPublicSnippetsWithSEO() {
    return await db
      .select()
      .from(snippets)
      .where(
        and(
          eq(snippets.isPublic, true),
          isNotNull(snippets.seoTitle)
        )
      );
  }

  /**
   * Get users with custom domains
   */
  static async getUsersWithCustomDomains() {
    return await db
      .select()
      .from(users)
      .where(isNotNull(users.customDomain));
  }

  /**
   * Display database statistics
   */
  static async displayStats() {
    const allUsers = await this.getAllUsers();
    const allSnippets = await this.getAllSnippets();
    const publicSnippets = await this.getPublicSnippetsWithSEO();
    const usersWithDomains = await this.getUsersWithCustomDomains();

    console.log('\n📊 Database Statistics:');
    console.log(`Total Users: ${allUsers.length}`);
    console.log(`Total Snippets: ${allSnippets.length}`);
    console.log(`Public Snippets with SEO: ${publicSnippets.length}`);
    console.log(`Users with Custom Domains: ${usersWithDomains.length}`);

    if (allUsers.length > 0) {
      console.log('\n👥 Users:');
      allUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name} (@${user.username})`);
        console.log(`     Email: ${user.email}`);
        console.log(`     SEO Title: ${user.seoTitle || 'Not configured'}`);
        console.log(`     Custom Domain: ${user.customDomain || 'None'}`);
        console.log(`     Public Profile: ${user.isProfilePublic ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    if (publicSnippets.length > 0) {
      console.log('🌍 Public Snippets with SEO:');
      publicSnippets.forEach((snippet, index) => {
        console.log(`  ${index + 1}. ${snippet.title} (${snippet.language})`);
        console.log(`     SEO Title: ${snippet.seoTitle}`);
        console.log(`     Custom Slug: ${snippet.customSlug || 'Auto-generated'}`);
        console.log(`     Share ID: ${snippet.shareId}`);
        console.log('');
      });
    }
  }

  /**
   * Create a quick test user
   */
  static async createTestUser() {
    const testUser = {
      githubId: Math.floor(Math.random() * 1000000),
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      name: 'Test User',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      bio: 'Test user for development',
      seoTitle: 'Test User - Developer',
      seoDescription: 'Test user profile for development and testing purposes',
      seoKeywords: 'test, development, snippets',
      customHeaderTitle: 'Test User Portfolio',
      customHeaderDescription: 'Development and testing snippets',
      customBrandingColor: '#3b82f6',
      isProfilePublic: true,
      showGithubStats: true,
      showActivityFeed: true,
      emailNotifications: true,
      enableAnalytics: false,
      twoFactorEnabled: false
    };

    const [insertedUser] = await db.insert(users).values(testUser).returning();
    if (!insertedUser) {
      throw new Error('Failed to create test user');
    }
    console.log(`✅ Created test user: ${insertedUser.name} (@${insertedUser.username})`);
    return insertedUser;
  }

  /**
   * Create a sample snippet for a user
   */
  static async createSampleSnippet(userId: string) {
    const sampleSnippet = {
      title: 'Hello World Function',
      description: 'A simple Hello World function in TypeScript',
      code: `function helloWorld(name: string): string {
  return \`Hello, \${name}! Welcome to the snippet library.\`;
}

// Usage example
const greeting = helloWorld('World');
console.log(greeting);

export default helloWorld;`,
      language: 'typescript',
      tags: ['typescript', 'function', 'hello-world', 'beginner'],
      isPublic: true,
      shareId: randomUUID(),
      userId: userId,
      seoTitle: 'Hello World Function - TypeScript Example',
      seoDescription: 'Simple Hello World function in TypeScript with type safety and modern syntax. Perfect for beginners learning TypeScript.',
      seoKeywords: 'typescript, hello world, function, beginner, example',
      customSlug: 'typescript-hello-world-function'
    };

    const [insertedSnippet] = await db.insert(snippets).values(sampleSnippet).returning();
    if (!insertedSnippet) {
      throw new Error('Failed to create sample snippet');
    }
    console.log(`✅ Created sample snippet: ${insertedSnippet.title}`);
    return insertedSnippet;
  }

  /**
   * Quick setup for development
   */
  static async quickSetup() {
    console.log('🚀 Setting up quick development environment...');
    
    const testUser = await this.createTestUser();
    await this.createSampleSnippet(testUser.id);
    
    console.log('✅ Quick setup completed!');
    await this.displayStats();
  }
}

// CLI interface
if (import.meta.main) {
  const command = process.argv[2];

  switch (command) {
    case 'clear':
      DatabaseSeeder.clearDatabase()
        .then(() => {
          console.log('Database cleared successfully!');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Error clearing database:', error);
          process.exit(1);
        });
      break;
    
    case 'stats':
      DatabaseSeeder.displayStats()
        .then(() => {
          process.exit(0);
        })
        .catch((error) => {
          console.error('Error displaying stats:', error);
          process.exit(1);
        });
      break;
    
    case 'quick':
      DatabaseSeeder.quickSetup()
        .then(() => {
          process.exit(0);
        })
        .catch((error) => {
          console.error('Error in quick setup:', error);
          process.exit(1);
        });
      break;
    
    case 'first-user':
      DatabaseSeeder.getFirstUser()
        .then((user) => {
          if (user) {
            console.log('👤 First user found:');
            console.log(`Name: ${user.name}`);
            console.log(`Username: @${user.username}`);
            console.log(`Email: ${user.email}`);
            console.log(`SEO Title: ${user.seoTitle || 'Not configured'}`);
            console.log(`Custom Domain: ${user.customDomain || 'None'}`);
            console.log(`Public Profile: ${user.isProfilePublic ? 'Yes' : 'No'}`);
          } else {
            console.log('❌ No users found in database');
          }
          process.exit(0);
        })
        .catch((error) => {
          console.error('Error getting first user:', error);
          process.exit(1);
        });
      break;
    
    default:
      console.log('🛠️  Database Seeder Utility');
      console.log('');
      console.log('Available commands:');
      console.log('  clear      - Clear all data from database');
      console.log('  stats      - Display database statistics');
      console.log('  quick      - Quick setup for development');
      console.log('  first-user - Get first user information');
      console.log('');
      console.log('Usage: bun run src/seeder.ts [command]');
      process.exit(0);
  }
}
