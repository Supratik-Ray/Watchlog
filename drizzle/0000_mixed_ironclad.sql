CREATE TYPE "public"."MediaType" AS ENUM('movie', 'tv');--> statement-breakpoint
CREATE TYPE "public"."NotificationType" AS ENUM('friend_request', 'recommendation');--> statement-breakpoint
CREATE TYPE "public"."Status" AS ENUM('plan_to_watch', 'watching', 'watched');--> statement-breakpoint
CREATE TYPE "public"."friendshipStatus" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "friendships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"status" "friendshipStatus" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "friendships_sender_id_receiver_id_unique" UNIQUE("sender_id","receiver_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"notification_type" "NotificationType" NOT NULL,
	"reference_id" uuid NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"media_id" text NOT NULL,
	"media_type" "MediaType" NOT NULL,
	"media_title" text NOT NULL,
	"media_poster" text,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recommendations_sender_id_receiver_id_media_id_unique" UNIQUE("sender_id","receiver_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_id" text NOT NULL,
	"media_type" "MediaType" NOT NULL,
	"media_title" text NOT NULL,
	"media_poster" text,
	"status" "Status" DEFAULT 'plan_to_watch' NOT NULL,
	"rating" integer,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rating_range" CHECK ("watchlist"."rating" >= 1 AND "watchlist"."rating" <= 10)
);
