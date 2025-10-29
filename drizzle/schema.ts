import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// LogiTrack Pro specific tables
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  orderType: mysqlEnum("orderType", ["ship", "warehouse"]).notNull(),
  trackingId: varchar("trackingId", { length: 32 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "confirmed", "in_transit", "delivered", "stored"]).default("pending").notNull(),
  pickupLocation: text("pickupLocation"),
  deliveryLocation: text("deliveryLocation"),
  packageWeight: varchar("packageWeight", { length: 50 }),
  packageDimensions: varchar("packageDimensions", { length: 100 }),
  description: text("description"),
  estimatedDelivery: timestamp("estimatedDelivery"),
  actualDelivery: timestamp("actualDelivery"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const shipments = mysqlTable("shipments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  driverId: int("driverId"),
  currentLocation: text("currentLocation"),
  currentLatitude: varchar("currentLatitude", { length: 50 }),
  currentLongitude: varchar("currentLongitude", { length: 50 }),
  status: mysqlEnum("status", ["assigned", "picked_up", "in_transit", "delivered", "failed"]).default("assigned").notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const drivers = mysqlTable("drivers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  driverLicense: varchar("driverLicense", { length: 50 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  vehicle: varchar("vehicle", { length: 100 }),
  currentLatitude: varchar("currentLatitude", { length: 50 }),
  currentLongitude: varchar("currentLongitude", { length: 50 }),
  isActive: int("isActive").default(1).notNull(),
  totalDeliveries: int("totalDeliveries").default(0).notNull(),
  rating: varchar("rating", { length: 5 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().unique(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
  totalAmount: varchar("totalAmount", { length: 20 }),
  tax: varchar("tax", { length: 20 }),
  discount: varchar("discount", { length: 20 }).default("0"),
  finalAmount: varchar("finalAmount", { length: 20 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  invoiceUrl: text("invoiceUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const feedback = mysqlTable("feedback", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  orderId: int("orderId"),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 20 }).notNull().unique(),
  totalOrders: int("totalOrders").default(0).notNull(),
  totalRevenue: varchar("totalRevenue", { length: 20 }).default("0"),
  successfulDeliveries: int("successfulDeliveries").default(0).notNull(),
  failedDeliveries: int("failedDeliveries").default(0).notNull(),
  warehouseOrders: int("warehouseOrders").default(0).notNull(),
  shipOrders: int("shipOrders").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;
export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = typeof drivers.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;