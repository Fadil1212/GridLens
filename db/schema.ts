import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const snapshots=sqliteTable('data_snapshots',{key:text('key').primaryKey(),payload:text('payload').notNull(),fetchedAt:integer('fetched_at').notNull()});
