CREATE TABLE "workflow" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"definition" jsonb NOT NULL
);
--> statement-breakpoint
CREATE INDEX "workflow_organization_id_idx" ON "workflow" ("organization_id");--> statement-breakpoint
CREATE INDEX "workflow_status_idx" ON "workflow" ("status");