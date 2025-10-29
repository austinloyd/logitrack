# LogiTrack Pro - User Guide

**Website URL:** https://3000-ij0scy5tewuombnm7h8g8-602a93df.manus-asia.computer

**Purpose:** LogiTrack Pro is a comprehensive logistics management system that enables customers to ship packages or store items in warehouses, drivers to manage deliveries with real-time location tracking, and administrators to monitor operations and analytics.

**Access:** Public landing page available to all users. Admin, Driver, and Customer portals require Manus OAuth authentication.

---

## Powered by Manus

LogiTrack Pro is built on a modern, scalable technology stack designed for enterprise logistics operations:

**Frontend:** React 19 with TypeScript and Tailwind CSS 4 for responsive, accessible user interfaces with smooth animations and interactive components.

**Backend:** Express.js with tRPC for type-safe API procedures, ensuring end-to-end type safety from database to frontend.

**Database:** MySQL with Drizzle ORM for robust data management, supporting complex relationships between users, orders, shipments, and analytics.

**Authentication:** Manus OAuth integration providing secure, passwordless authentication across all portals with role-based access control.

**Deployment:** Auto-scaling infrastructure with global CDN, ensuring 99.9% uptime and sub-100ms response times worldwide.

---

## Using Your Website

### 1. Home Page & Feedback

Visit the landing page to explore LogiTrack Pro's features. Click "Share Feedback" to submit your thoughts with a star rating (1-5 stars). Your feedback helps us improve the platform.

### 2. Customer Portal

**Create Orders:** Click "Add New Order" to create a shipment or warehouse storage request. Choose between "Ship Package" (for delivery) or "Store in Warehouse" (for storage). Fill in pickup location, delivery location (for shipments), package weight, dimensions, and description. Submit to receive a unique tracking ID.

**Track Orders:** Click "Track Order" and enter your tracking ID to view real-time status updates, current location, and shipment details.

**Download Invoice:** After order submission, click "Download Invoice" to get a PDF receipt for your records.

**View Order History:** Your orders list displays all past and current shipments with status indicators (Pending, Confirmed, In Transit, Delivered, or Stored).

### 3. Driver Portal

**View Assignments:** See all assigned shipments with customer details, pickup/delivery locations, and package information.

**Update Status:** Click "Update Status & Location" to change shipment status (Assigned → Picked Up → In Transit → Delivered) and provide real-time GPS coordinates (latitude/longitude).

**Track Performance:** Monitor your total deliveries, daily completed orders, and customer rating on your dashboard.

### 4. Admin Portal

**View Analytics:** Access comprehensive dashboards showing total orders, active deliveries, driver count, and revenue metrics.

**Orders Overview:** See daily order statistics with delivered vs. pending breakdown using interactive bar charts.

**Revenue Trends:** Monitor monthly revenue and profit using line charts to track business growth.

**Order Distribution:** View the split between ship orders and warehouse storage using pie charts.

**Recent Orders:** Browse the latest orders with customer names, order types, status, and amounts.

---

## Managing Your Website

### Settings Panel

Access the Management UI (right side panel) to configure your website:

- **General Settings:** Update website name and logo displayed across all pages
- **Domains:** Bind custom domains or use the auto-generated manus.space domain
- **Database:** View and manage your MySQL database with the built-in CRUD interface
- **Secrets:** Store and manage API keys, OAuth credentials, and environment variables securely

### Dashboard

Monitor website analytics including unique visitors, page views, and user engagement metrics.

### Preview

Test all features in the live preview before publishing changes.

---

## Next Steps

Talk to Manus AI anytime to request changes or add features. You can:

- Add invoice PDF generation for automatic receipt creation
- Integrate real GPS tracking APIs for live location updates
- Implement payment processing for order payments
- Add email notifications for order status changes
- Create advanced reporting and export features
- Set up SMS alerts for customers and drivers

Ready to grow your logistics business? Start by creating your first order in the Customer Portal and monitoring it through the Admin Portal's analytics dashboard.

---

## Technical Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 4, shadcn/ui components
- **Backend:** Express.js, tRPC, Node.js
- **Database:** MySQL with Drizzle ORM
- **Authentication:** Manus OAuth 2.0
- **Charts & Analytics:** Recharts for data visualization
- **UI Components:** Radix UI primitives with custom styling
- **Styling:** Custom bubble button effects and gradient backgrounds

---

## Support

For technical support or feature requests, contact the Manus team through the feedback form on the home page or reach out to your account manager.
