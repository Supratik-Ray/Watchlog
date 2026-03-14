import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core"

export const MediaTypeEnum = pgEnum("MediaType", ["movie", "tv"])
export const StatusEnum = pgEnum("Status", [
  "plan-to-watch",
  "watching",
  "watched",
])

export const watchlistTable = pgTable("watchlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  mediaId: text("mediaId").notNull(),
  mediaType: MediaTypeEnum("mediaType").notNull(),
  mediaTitle: text("mediaTitle").notNull(),
  mediaPoster: text("mediaPoster"),
  status: StatusEnum("status").default("plan-to-watch").notNull(),
  userId: text("userId").notNull(),
})
