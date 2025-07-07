ALTER TABLE "snippets" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "snippets" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "snippets" ADD COLUMN "seo_keywords" text;--> statement-breakpoint
ALTER TABLE "snippets" ADD COLUMN "seo_image_url" text;--> statement-breakpoint
ALTER TABLE "snippets" ADD COLUMN "custom_slug" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "seo_keywords" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "seo_image_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "custom_header_title" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "custom_header_description" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "custom_branding_color" text DEFAULT '#3b82f6';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "custom_branding_logo" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ui_theme" text DEFAULT 'system';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "code_theme" text DEFAULT 'auto';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_banner_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "social_links" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "custom_domain" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_profile_public" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "show_github_stats" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "show_activity_feed" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_notifications" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "enable_analytics" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor_secret" text;--> statement-breakpoint
CREATE INDEX "snippets_custom_slug_idx" ON "snippets" USING btree ("custom_slug");--> statement-breakpoint
CREATE INDEX "users_custom_domain_idx" ON "users" USING btree ("custom_domain");