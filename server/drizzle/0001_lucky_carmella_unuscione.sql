ALTER TABLE "snippets" ADD COLUMN "share_id" uuid;--> statement-breakpoint
CREATE INDEX "snippets_share_id_idx" ON "snippets" USING btree ("share_id");--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_share_id_unique" UNIQUE("share_id");