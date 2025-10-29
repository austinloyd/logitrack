import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, orders, drivers, shipments, invoices, feedback, analytics, InsertOrder, InsertDriver, InsertShipment, InsertInvoice, InsertFeedback, InsertAnalytics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// LogiTrack Pro database helpers
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return result;
}

export async function getOrderByTrackingId(trackingId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.trackingId, trackingId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrdersByCustomerId(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.customerId, customerId));
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));
}

export async function createDriver(driver: InsertDriver) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(drivers).values(driver);
}

export async function getDriverById(driverId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(drivers).where(eq(drivers.id, driverId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDriverByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(drivers).where(eq(drivers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveDrivers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(drivers).where(eq(drivers.isActive, 1));
}

export async function createShipment(shipment: InsertShipment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(shipments).values(shipment);
}

export async function getShipmentByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shipments).where(eq(shipments.orderId, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateShipmentStatus(shipmentId: number, status: string, latitude?: string, longitude?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: any = { status };
  if (latitude) updateData.currentLatitude = latitude;
  if (longitude) updateData.currentLongitude = longitude;
  return await db.update(shipments).set(updateData).where(eq(shipments.id, shipmentId));
}

export async function createInvoice(invoice: InsertInvoice) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(invoices).values(invoice);
}

export async function getInvoiceByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(invoices).where(eq(invoices.orderId, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createFeedback(feedbackData: InsertFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(feedback).values(feedbackData);
}

export async function getAnalytics(date: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(analytics).where(eq(analytics.date, date)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAnalytics(date: string, data: Partial<InsertAnalytics>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getAnalytics(date);
  if (existing) {
    return await db.update(analytics).set(data).where(eq(analytics.date, date));
  } else {
    return await db.insert(analytics).values({ date, ...data } as InsertAnalytics);
  }
}
