CREATE TYPE "public"."MediaType" AS ENUM('movie', 'tv');--> statement-breakpoint
CREATE TYPE "public"."Status" AS ENUM('plan-to-watch', 'watching', 'watched');--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mediaId" text NOT NULL,
	"mediaType" "MediaType" NOT NULL,
	"mediaTitle" text NOT NULL,
	"mediaPoster" text,
	"status" "Status" DEFAULT 'plan-to-watch' NOT NULL,
	"userId" text NOT NULL
);
