import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const sessions = sqliteTable('sessions', {
    sessionId: text('session_id').primaryKey(),
    websiteId: text('website_id'),
    hostname: text('hostname'),
    browser: text('browser'),
    os: text('os'),
    device: text('device'),
    screen: text('screen'),
    language: text('language'),
    country: text("country"),
    subdivision1: text("subdivision1"),
    subdivision2: text("subdivision2"),
    city: text('city'),
    createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  }
);

export const websites = sqliteTable('websites', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  domain: text('domain'),
  createdAt: integer('created_at', { mode: 'timestamp' })
  .notNull()
  .default(sql`(unixepoch())`),
})