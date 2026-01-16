CREATE TABLE "ai_agent" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"model" text NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"project_id" varchar(32)
);
--> statement-breakpoint
CREATE TABLE "git_repository_integration" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"provider_id" text NOT NULL,
	"credential_id" varchar(32) NOT NULL,
	"git_repository_id" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "git_repository" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"contributor_email" varchar(256) NOT NULL,
	"contributor_name" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"url" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integration_api_key_credential" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"api_key" varchar(256) NOT NULL,
	"expired_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integration_basic_credential" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"username" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"expired_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issue_field_definition_integration" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"external_id" varchar(32) NOT NULL,
	"provider_id" text NOT NULL,
	"issue_field_definition_id" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issue_field_definition" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"field_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issue_field_instance_integration" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"external_id" varchar(32) NOT NULL,
	"provider_id" text NOT NULL,
	"issue_field_instance_id" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issue_field_instance" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"value" text,
	"issue_id" varchar(32) NOT NULL,
	"issue_field_definition_id" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issue_integration" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"external_id" varchar(32) NOT NULL,
	"external_key" varchar(32) NOT NULL,
	"provider_id" text NOT NULL,
	"issue_id" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issue" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"project_id" varchar(32)
);
--> statement-breakpoint
CREATE TABLE "project_integration" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"external_id" varchar(32) NOT NULL,
	"external_key" varchar(32) NOT NULL,
	"provider_id" text NOT NULL,
	"webhook_secret" varchar(32) NOT NULL,
	"credential_id" varchar(32) NOT NULL,
	"project_id" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" varchar(32) PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar(32) NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ai_agent_organization_id_idx" ON "ai_agent" ("organization_id");--> statement-breakpoint
CREATE INDEX "document_organization_id_idx" ON "document" ("organization_id");--> statement-breakpoint
CREATE INDEX "document_project_id_idx" ON "document" ("project_id");--> statement-breakpoint
CREATE INDEX "git_repository_integration_organization_id_idx" ON "git_repository_integration" ("organization_id");--> statement-breakpoint
CREATE INDEX "git_repository_integration_credential_id_idx" ON "git_repository_integration" ("credential_id");--> statement-breakpoint
CREATE INDEX "git_repository_integration_gitRepository_id_idx" ON "git_repository_integration" ("git_repository_id");--> statement-breakpoint
CREATE INDEX "git_repository_organization_id_idx" ON "git_repository" ("organization_id");--> statement-breakpoint
CREATE INDEX "integration_api_key_credential_organization_id_idx" ON "integration_api_key_credential" ("organization_id");--> statement-breakpoint
CREATE INDEX "integration_basic_credential_organization_id_idx" ON "integration_basic_credential" ("organization_id");--> statement-breakpoint
CREATE INDEX "issue_field_definition_integration_organization_id_idx" ON "issue_field_definition_integration" ("organization_id");--> statement-breakpoint
CREATE INDEX "issue_field_definition_integration_issue_field_definition_id_idx" ON "issue_field_definition_integration" ("issue_field_definition_id");--> statement-breakpoint
CREATE INDEX "issue_field_definition_integration_provider_id_external_id_idx" ON "issue_field_definition_integration" ("provider_id","external_id");--> statement-breakpoint
CREATE INDEX "issue_field_definition_organization_id_idx" ON "issue_field_definition" ("organization_id");--> statement-breakpoint
CREATE INDEX "issue_field_instance_integration_organization_id_idx" ON "issue_field_instance_integration" ("organization_id");--> statement-breakpoint
CREATE INDEX "issue_field_instance_integration_issue_field_instance_id_idx" ON "issue_field_instance_integration" ("issue_field_instance_id");--> statement-breakpoint
CREATE INDEX "issue_field_instance_integration_provider_id_external_id_idx" ON "issue_field_instance_integration" ("provider_id","external_id");--> statement-breakpoint
CREATE INDEX "issue_field_instance_organization_id_idx" ON "issue_field_instance" ("organization_id");--> statement-breakpoint
CREATE INDEX "issue_field_instance_issue_id_idx" ON "issue_field_instance" ("issue_id");--> statement-breakpoint
CREATE INDEX "issue_field_instance_issue_field_definition_id_idx" ON "issue_field_instance" ("issue_field_definition_id");--> statement-breakpoint
CREATE INDEX "issue_integration_organization_id_idx" ON "issue_integration" ("organization_id");--> statement-breakpoint
CREATE INDEX "issue_integration_issue_id_idx" ON "issue_integration" ("issue_id");--> statement-breakpoint
CREATE INDEX "issue_integration_provider_id_external_id_idx" ON "issue_integration" ("provider_id","external_id");--> statement-breakpoint
CREATE INDEX "issue_organization_id_idx" ON "issue" ("organization_id");--> statement-breakpoint
CREATE INDEX "issue_project_id_idx" ON "issue" ("project_id");--> statement-breakpoint
CREATE INDEX "project_integration_organization_id_idx" ON "project_integration" ("organization_id");--> statement-breakpoint
CREATE INDEX "project_integration_credential_id_idx" ON "project_integration" ("credential_id");--> statement-breakpoint
CREATE INDEX "project_integration_project_id_idx" ON "project_integration" ("project_id");--> statement-breakpoint
CREATE INDEX "project_integration_provider_id_external_id_idx" ON "project_integration" ("provider_id","external_id");--> statement-breakpoint
CREATE INDEX "project_organization_id_idx" ON "project" ("organization_id");--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "git_repository_integration" ADD CONSTRAINT "git_repository_integration_hZnUgotqxJTK_fkey" FOREIGN KEY ("credential_id") REFERENCES "integration_basic_credential"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "git_repository_integration" ADD CONSTRAINT "git_repository_integration_bUwAL1yULsms_fkey" FOREIGN KEY ("git_repository_id") REFERENCES "git_repository"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issue_field_definition_integration" ADD CONSTRAINT "issue_field_definition_integration_qFUMAirFZkP1_fkey" FOREIGN KEY ("issue_field_definition_id") REFERENCES "issue_field_definition"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issue_field_instance_integration" ADD CONSTRAINT "issue_field_instance_integration_rpfW74E3TaJd_fkey" FOREIGN KEY ("issue_field_instance_id") REFERENCES "issue_field_instance"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issue_field_instance" ADD CONSTRAINT "issue_field_instance_issue_id_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issue"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issue_field_instance" ADD CONSTRAINT "issue_field_instance_0rpf340IoDi0_fkey" FOREIGN KEY ("issue_field_definition_id") REFERENCES "issue_field_definition"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "issue_integration" ADD CONSTRAINT "issue_integration_issue_id_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issue"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issue" ADD CONSTRAINT "issue_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "project_integration" ADD CONSTRAINT "project_integration_tAMytge1879y_fkey" FOREIGN KEY ("credential_id") REFERENCES "integration_api_key_credential"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "project_integration" ADD CONSTRAINT "project_integration_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE;