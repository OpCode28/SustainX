CREATE TABLE "activity_data" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"reporting_period_id" text NOT NULL,
	"attribute_number" integer NOT NULL,
	"scope_type" text NOT NULL,
	"sub_item" text NOT NULL,
	"quantity" numeric(16, 4) NOT NULL,
	"unit" text NOT NULL,
	"evidence_file_id" text,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"entered_by" text NOT NULL,
	"approved_by" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"record_id" text NOT NULL,
	"action" text NOT NULL,
	"old_value" jsonb,
	"new_value" jsonb,
	"changed_by" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calculation_results" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"reporting_period_id" text NOT NULL,
	"scope1_tco2e" numeric(16, 4) DEFAULT '0.0000' NOT NULL,
	"scope2_tco2e" numeric(16, 4) DEFAULT '0.0000' NOT NULL,
	"scope3_tco2e" numeric(16, 4) DEFAULT '0.0000' NOT NULL,
	"total_ghg_tco2e" numeric(16, 4) DEFAULT '0.0000' NOT NULL,
	"turnover_inr_crores" numeric(16, 4) DEFAULT '0.0000' NOT NULL,
	"ghg_intensity_per_crore" numeric(14, 6) DEFAULT '0.000000' NOT NULL,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emission_factors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"fuel_or_activity" text NOT NULL,
	"factor_value" numeric(12, 6) NOT NULL,
	"unit" text NOT NULL,
	"source" text NOT NULL,
	"version_year" integer DEFAULT 2024 NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" text PRIMARY KEY NOT NULL,
	"activity_data_id" text,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_hash" text NOT NULL,
	"document_type" text NOT NULL,
	"uploaded_by" text NOT NULL,
	"uploaded_by_name" text NOT NULL,
	"verification_status" text DEFAULT 'VERIFIED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organisations" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"parent_id" text,
	"business_vertical" text,
	"country" text DEFAULT 'India',
	"state" text,
	"city" text,
	"completion_rate" integer DEFAULT 0,
	"status" text DEFAULT 'HEALTHY',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reporting_periods" (
	"id" text PRIMARY KEY NOT NULL,
	"financial_year" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"role_id" text NOT NULL,
	"organisation_id" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activity_data" ADD CONSTRAINT "activity_data_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_data" ADD CONSTRAINT "activity_data_reporting_period_id_reporting_periods_id_fk" FOREIGN KEY ("reporting_period_id") REFERENCES "public"."reporting_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_results" ADD CONSTRAINT "calculation_results_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_results" ADD CONSTRAINT "calculation_results_reporting_period_id_reporting_periods_id_fk" FOREIGN KEY ("reporting_period_id") REFERENCES "public"."reporting_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;