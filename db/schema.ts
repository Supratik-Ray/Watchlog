import { sql } from "drizzle-orm"
import {
  boolean,
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"

// TODO: catch db lvl errrors

export const MediaTypeEnum = pgEnum("MediaType", ["movie", "tv"])

export const StatusEnum = pgEnum("Status", [
  "plan_to_watch",
  "watching",
  "watched",
])

export const watchlistTable = pgTable(
  "watchlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mediaId: text("media_id").notNull(),
    mediaType: MediaTypeEnum("media_type").notNull(),
    mediaTitle: text("media_title").notNull(),
    mediaPoster: text("media_poster"),
    status: StatusEnum("status").default("plan_to_watch").notNull(),
    rating: integer("rating"),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "rating_range",
      sql`${table.rating} IS NULL OR (${table.rating} >= 1 AND ${table.rating} <= 10)`
    ),
  ]
)

export const friendshipStatusEnum = pgEnum("friendshipStatus", [
  "pending",
  "accepted",
  "rejected",
])

export const friendshipsTable = pgTable(
  "friendships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: text("sender_id").notNull(),
    receiverId: text("receiver_id").notNull(),
    status: friendshipStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.senderId, table.receiverId)]
)

export const recommendationsTable = pgTable(
  "recommendations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: text("sender_id").notNull(),
    receiverId: text("receiver_id").notNull(),
    mediaId: text("media_id").notNull(),
    mediaType: MediaTypeEnum("media_type").notNull(),
    mediaTitle: text("media_title").notNull(),
    mediaPoster: text("media_poster"),
    message: text("message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.senderId, table.receiverId, table.mediaId)]
)

export const NotifcationTypeEnum = pgEnum("NotificationType", [
  "friend_request",
  "recommendation",
])

//MIGHT NEED TO SPLIT REFERENCEID LATER
export const notificationsTable = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  notificationType: NotifcationTypeEnum("notification_type").notNull(),
  referenceId: uuid("reference_id").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
