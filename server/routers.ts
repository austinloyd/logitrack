import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // LogiTrack Pro feature routers
  orders: router({
    create: protectedProcedure
      .input(z.object({
        orderType: z.enum(["ship", "warehouse"]),
        pickupLocation: z.string(),
        deliveryLocation: z.string().optional(),
        packageWeight: z.string(),
        packageDimensions: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const trackingId = `LTP${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        return await db.createOrder({
          customerId: ctx.user.id,
          orderType: input.orderType as "ship" | "warehouse",
          trackingId,
          status: "pending",
          pickupLocation: input.pickupLocation,
          deliveryLocation: input.deliveryLocation || null,
          packageWeight: input.packageWeight,
          packageDimensions: input.packageDimensions,
          description: input.description,
        });
      }),
    getByTrackingId: publicProcedure
      .input(z.object({ trackingId: z.string() }))
      .query(async ({ input }) => {
        return await db.getOrderByTrackingId(input.trackingId);
      }),
    getMyOrders: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getOrdersByCustomerId(ctx.user.id);
      }),
  }),

  shipments: router({
    updateStatus: protectedProcedure
      .input(z.object({
        shipmentId: z.number(),
        status: z.string(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateShipmentStatus(input.shipmentId, input.status, input.latitude, input.longitude);
      }),
    getByOrderId: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        return await db.getShipmentByOrderId(input.orderId);
      }),
    getDriverShipments: protectedProcedure
      .query(async ({ ctx }) => {
        // Get all shipments for driver
        const driver = await db.getDriverByUserId(ctx.user.id);
        if (!driver) return [];
        // For now, return mock data until we have proper driver-shipment relationship
        return [];
      }),
  }),

  feedback: router({
    submit: publicProcedure
      .input(z.object({
        customerId: z.number().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.createFeedback({
          customerId: input.customerId || 0,
          rating: input.rating,
          comment: input.comment,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
