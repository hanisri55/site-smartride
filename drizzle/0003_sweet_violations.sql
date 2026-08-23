CREATE TABLE `emailVerifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tokenHash` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailVerifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailVerifications_tokenHash_unique` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `passwordResets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tokenHash` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passwordResets_id` PRIMARY KEY(`id`),
	CONSTRAINT `passwordResets_tokenHash_unique` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `rideRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rideId` int NOT NULL,
	`requesterId` int NOT NULL,
	`status` enum('pending','accepted','rejected','cancelled') NOT NULL DEFAULT 'pending',
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rideRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `rides` ADD `vehicleType` varchar(64);--> statement-breakpoint
ALTER TABLE `rides` ADD `genderPreference` varchar(64);--> statement-breakpoint
ALTER TABLE `rides` ADD `contactPreference` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `phoneNumber` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `studyYear` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `gender` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `genderPreference` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `verificationStatus` enum('unverified','pending','verified') DEFAULT 'unverified' NOT NULL;