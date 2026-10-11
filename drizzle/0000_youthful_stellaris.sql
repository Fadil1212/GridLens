CREATE TABLE `data_snapshots` (
	`key` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`fetched_at` integer NOT NULL
);
