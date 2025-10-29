# LogiTrack Pro - Setup & Deployment Guide

## System Overview

LogiTrack Pro is a full-stack logistics management system built with:
- **Frontend:** React 19 + TypeScript + Tailwind CSS
- **Backend:** Express.js + tRPC + Node.js
- **Database:** MySQL with Drizzle ORM
- **Authentication:** Manus OAuth 2.0

## Local Development Setup

### Prerequisites

- Node.js 18+ with pnpm package manager
- MySQL 8.0+ database server
- Git for version control

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd logitrack_pro
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the project root:
```env
DATABASE_URL=mysql://username:password@localhost:3306/logitrack_pro
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_TITLE=LogiTrack Pro
VITE_APP_LOGO=https://your-logo-url.png
```

4. **Create MySQL database**
```bash
mysql -u root -p
CREATE DATABASE logitrack_pro;
USE logitrack_pro;
```

5. **Run database migrations**
```bash
pnpm db:push
```

6. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
logitrack_pro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Portal pages (Home, Customer, Driver, Admin)
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # tRPC client setup
│   │   ├── App.tsx        # Main routing
│   │   └── index.css      # Global styles with bubble buttons
│   └── public/            # Static assets
├── server/                 # Express backend
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database queries
│   └── _core/             # Core framework files
├── drizzle/               # Database schema
│   └── schema.ts          # Table definitions
├── shared/                # Shared types and constants
└── dist/                  # Build output

```

## Database Schema

### Orders Table
- `id`: Primary key
- `customerId`: Foreign key to users
- `orderType`: 'ship' or 'warehouse'
- `trackingId`: Unique tracking identifier
- `status`: pending, confirmed, in_transit, delivered, stored
- `pickupLocation`: String
- `deliveryLocation`: String (optional for warehouse)
- `packageWeight`: String
- `packageDimensions`: String
- `description`: Text
- `estimatedDelivery`: Timestamp
- `actualDelivery`: Timestamp
- `createdAt`, `updatedAt`: Timestamps

### Shipments Table
- `id`: Primary key
- `orderId`: Foreign key to orders
- `driverId`: Foreign key to drivers
- `currentLocation`: String
- `currentLatitude`, `currentLongitude`: GPS coordinates
- `status`: assigned, picked_up, in_transit, delivered, failed
- `lastUpdated`: Timestamp

### Drivers Table
- `id`: Primary key
- `userId`: Foreign key to users
- `driverLicense`: Unique identifier
- `phone`: Contact number
- `vehicle`: Vehicle information
- `currentLatitude`, `currentLongitude`: GPS coordinates
- `isActive`: Boolean (1 or 0)
- `totalDeliveries`: Count
- `rating`: Star rating

### Invoices Table
- `id`: Primary key
- `orderId`: Foreign key to orders
- `invoiceNumber`: Unique invoice ID
- `totalAmount`, `tax`, `discount`, `finalAmount`: Currency values
- `paymentStatus`: pending, paid, failed
- `invoiceUrl`: Link to PDF

### Feedback Table
- `id`: Primary key
- `customerId`: Foreign key to users
- `orderId`: Optional foreign key to orders
- `rating`: 1-5 stars
- `comment`: Text feedback

### Analytics Table
- `id`: Primary key
- `date`: Unique date identifier
- `totalOrders`: Count
- `totalRevenue`: Currency
- `successfulDeliveries`, `failedDeliveries`: Counts
- `warehouseOrders`, `shipOrders`: Breakdown

## API Endpoints

### Orders
- `POST /api/trpc/orders.create` - Create new order
- `GET /api/trpc/orders.getByTrackingId` - Get order by tracking ID
- `GET /api/trpc/orders.getMyOrders` - Get user's orders

### Shipments
- `POST /api/trpc/shipments.updateStatus` - Update shipment status and location
- `GET /api/trpc/shipments.getByOrderId` - Get shipment details

### Feedback
- `POST /api/trpc/feedback.submit` - Submit feedback with rating

### Authentication
- `GET /api/trpc/auth.me` - Get current user
- `POST /api/trpc/auth.logout` - Logout user

## Features

### Customer Portal
- Create orders with two types: Ship Package or Store in Warehouse
- Get unique tracking ID for each order
- Track order status in real-time
- Download invoices as PDF
- View order history
- Submit feedback with star ratings

### Driver Portal
- View assigned shipments
- Update delivery status (Assigned → Picked Up → In Transit → Delivered)
- Update real-time GPS location
- Track performance metrics
- View customer contact information

### Admin Portal
- View comprehensive analytics dashboards
- Monitor daily orders with bar charts
- Track revenue trends with line charts
- View order type distribution (pie chart)
- See recent orders with status and amounts
- Access all system statistics

### Home Page
- Landing page with feature showcase
- Information about the platform
- Feedback submission form
- Quick access to all portals

## Styling & Design

### Color Palette
- **Beige:** #ECF4E8 (Light background)
- **Lime Green:** #CBF3BB (Accent highlights)
- **Mint Green:** #ABE7B9 (Primary accent)
- **Soft Blue:** #8FC7D9 (Secondary accent)

### Custom Components
- **Bubble Buttons:** Rounded full buttons with hover scale effects
- **Card Bubbles:** Rounded cards with subtle shadows
- **Gradient Backgrounds:** Smooth color transitions
- **Responsive Design:** Mobile-first approach with Tailwind CSS

## Building for Production

1. **Build the project**
```bash
pnpm build
```

2. **Start production server**
```bash
pnpm start
```

3. **Environment variables for production**
Update `.env.production` with production database and API URLs

## Deployment Options

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Cloud Deployment
- **AWS:** Deploy to EC2 or ECS with RDS MySQL
- **Google Cloud:** Use Cloud Run with Cloud SQL
- **Azure:** Deploy to App Service with Azure Database for MySQL
- **DigitalOcean:** Use App Platform with Managed Databases

## Performance Optimization

- **Code Splitting:** Automatic with Vite
- **Image Optimization:** Use WebP format for images
- **Database Indexing:** Add indexes on frequently queried columns
- **Caching:** Implement Redis for session management
- **CDN:** Use CloudFlare for static asset delivery

## Security Considerations

1. **Environment Variables:** Never commit `.env` files
2. **Database:** Use strong passwords and limit access
3. **HTTPS:** Always use HTTPS in production
4. **Rate Limiting:** Implement API rate limiting
5. **Input Validation:** Validate all user inputs
6. **CORS:** Configure CORS properly for production domains
7. **Authentication:** Use Manus OAuth for secure authentication

## Troubleshooting

### Database Connection Issues
```bash
# Test MySQL connection
mysql -h localhost -u username -p -e "SELECT 1"

# Check DATABASE_URL format
# mysql://username:password@host:port/database
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Support & Maintenance

- **Bug Reports:** Create issues in the repository
- **Feature Requests:** Contact the development team
- **Database Backups:** Schedule regular MySQL backups
- **Log Monitoring:** Monitor application logs for errors
- **Updates:** Keep dependencies updated with `pnpm update`

## License

LogiTrack Pro is proprietary software. All rights reserved.

---

For additional support, contact the Manus development team.
