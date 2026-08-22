CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(64) NOT NULL,
	`message` text NOT NULL,
	`read` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`routeId` int NOT NULL,
	`pickupPoint` varchar(255) NOT NULL,
	`destination` varchar(255) NOT NULL,
	`date` varchar(16) NOT NULL,
	`time` varchar(16) NOT NULL,
	`availableSeats` int NOT NULL,
	`notes` text,
	`status` enum('upcoming','completed','cancelled') NOT NULL DEFAULT 'upcoming',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`routeNumber` varchar(32) NOT NULL,
	`routeName` varchar(255) NOT NULL,
	`origin` varchar(255) NOT NULL,
	`destination` varchar(255) NOT NULL,
	`stops` text NOT NULL,
	`routeType` enum('campus','local') NOT NULL DEFAULT 'campus',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `routes_id` PRIMARY KEY(`id`),
	CONSTRAINT `routes_routeNumber_unique` UNIQUE(`routeNumber`)
);
--> statement-breakpoint
CREATE TABLE `smartPoolMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`smartPoolId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `smartPoolMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `smartPools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`routeId` int NOT NULL,
	`pickupPoint` varchar(255) NOT NULL,
	`departureTime` varchar(32) NOT NULL,
	`capacity` int NOT NULL,
	`status` enum('open','full','cancelled','completed') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `smartPools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `dateOfBirth` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `college` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `course` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `routeId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `pickupPoint` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `profileImage` text;--> statement-breakpoint
ALTER TABLE `users` ADD `interests` text;--> statement-breakpoint
ALTER TABLE `users` ADD `preferences` text;