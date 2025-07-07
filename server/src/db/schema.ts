import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  githubId: integer('github_id').unique().notNull(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  location: text('location'),
  blog: text('blog'),
  company: text('company'),
  publicRepos: integer('public_repos').default(0).notNull(),
  followers: integer('followers').default(0).notNull(),
  following: integer('following').default(0).notNull(),

  // SEO and customization fields
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  seoImageUrl: text('seo_image_url'),
  customHeaderTitle: text('custom_header_title'),
  customHeaderDescription: text('custom_header_description'),
  customBrandingColor: text('custom_branding_color').notNull().default('#3b82f6'),
  customBrandingLogo: text('custom_branding_logo'),
  uiTheme: text('ui_theme').notNull().default('system'),
  codeTheme: text('code_theme').notNull().default('auto'),
  profileBannerUrl: text('profile_banner_url'),
  socialLinks: jsonb('social_links').$type<Record<string, string>>().default({}),
  customDomain: text('custom_domain'),
  isProfilePublic: boolean('is_profile_public').default(true),
  showGithubStats: boolean('show_github_stats').default(true),
  showActivityFeed: boolean('show_activity_feed').default(true),
  emailNotifications: boolean('email_notifications').default(true),
  enableAnalytics: boolean('enable_analytics').default(false),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: text('two_factor_secret'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  githubIdIdx: uniqueIndex('users_github_id_idx').on(table.githubId),
  usernameIdx: index('users_username_idx').on(table.username),
  customDomainIdx: index('users_custom_domain_idx').on(table.customDomain),
}));

// Snippets table
export const snippets = pgTable('snippets', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  code: text('code').notNull(),
  language: text('language').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  isPublic: boolean('is_public').default(false),
  shareId: uuid('share_id').unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

  // SEO fields for public snippets
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  seoImageUrl: text('seo_image_url'),
  customSlug: text('custom_slug'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('snippets_user_id_idx').on(table.userId),
  languageIdx: index('snippets_language_idx').on(table.language),
  isPublicIdx: index('snippets_is_public_idx').on(table.isPublic),
  createdAtIdx: index('snippets_created_at_idx').on(table.createdAt),
  titleIdx: index('snippets_title_idx').on(table.title),
  shareIdIdx: index('snippets_share_id_idx').on(table.shareId),
  customSlugIdx: index('snippets_custom_slug_idx').on(table.customSlug),
}));

// Sessions table for authentication
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  accessToken: text('access_token').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
  expiresAtIdx: index('sessions_expires_at_idx').on(table.expiresAt),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  snippets: many(snippets),
  sessions: many(sessions),
}));

export const snippetsRelations = relations(snippets, ({ one }) => ({
  user: one(users, {
    fields: [snippets.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
