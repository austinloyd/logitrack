CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(20) NOT NULL,
	`totalOrders` int NOT NULL DEFAULT 0,
	`totalRevenue` varchar(20) DEFAULT '0',
	`successfulDeliveries` int NOT NULL DEFAULT 0,
	`failedDeliveries` int NOT NULL DEFAULT 0,
	`warehouseOrders` int NOT NULL DEFAULT 0,
	`shipOrders` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`),
	CONSTRAINT `analytics_date_unique` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE TABLE `drivers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`driverLicense` varchar(50) NOT NULL,
	`phone` varchar(20),
	`vehicle` varchar(100),
	`currentLatitude` varchar(50),
	`currentLongitude` varchar(50),
	`isActive` int NOT NULL DEFAULT 1,
	`totalDeliveries` int NOT NULL DEFAULT 0,
	`rating` varchar(5) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `drivers_id` PRIMARY KEY(`id`),
	CONSTRAINT `drivers_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `drivers_driverLicense_unique` UNIQUE(`driverLicense`)
);
--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`orderId` int,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`invoiceNumber` varchar(50) NOT NULL,
	`totalAmount` varchar(20),
	`tax` varchar(20),
	`discount` varchar(20) DEFAULT '0',
	`finalAmount` varchar(20),
	`paymentStatus` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
	`invoiceUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_orderId_unique` UNIQUE(`orderId`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`orderType` enum('ship','warehouse') NOT NULL,
	`trackingId` varchar(32) NOT NULL,
	`status` enum('pending','confirmed','in_transit','delivered','stored') NOT NULL DEFAULT 'pending',
	`pickupLocation` text,
	`deliveryLocation` text,
	`packageWeight` varchar(50),
	`packageDimensions` varchar(100),
	`description` text,
	`estimatedDelivery` timestamp,
	`actualDelivery` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_trackingId_unique` UNIQUE(`trackingId`)
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`driverId` int,
	`currentLocation` text,
	`currentLatitude` varchar(50),
	`currentLongitude` varchar(50),
	`status` enum('assigned','picked_up','in_transit','delivered','failed') NOT NULL DEFAULT 'assigned',
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shipments_id` PRIMARY KEY(`id`)
);
