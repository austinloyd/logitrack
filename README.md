# LogiTrack Pro - Logistics Management System

A comprehensive, modern logistics platform enabling seamless order management, real-time shipment tracking, and advanced analytics for customers, drivers, and administrators.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Create MySQL database
mysql -u root -p < database.sql

# Run migrations
pnpm db:push

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to access the application.

## 🚀 Deployment

### Vercel Deployment

This project is configured for easy deployment to Vercel. Follow these steps:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the repository in your Vercel dashboard
3. Configure environment variables in Vercel
4. Deploy!

For detailed instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 📋 Features

### 🏠 Home Page
- Beautiful landing page with feature showcase
- Customer feedback form with star ratings
- Quick access to all portals
- Responsive design with gradient backgrounds

### 👥 Customer Portal
- **Create Orders:** Ship packages or store in warehouse
- **Track Shipments:** Real-time tracking with unique ID
- **Download Invoices:** PDF receipts for all orders
- **Order History:** View all past and current orders

### 🚗 Driver Portal
- **Manage Deliveries:** View assigned shipments
- **Update Status:** Track delivery progress
- **GPS Tracking:** Submit real-time location coordinates
- **Performance Metrics:** Monitor deliveries and ratings

### 📊 Admin Portal
- **Analytics Dashboard:** Comprehensive business metrics
- **Order Charts:** Daily statistics and trends
- **Revenue Tracking:** Monthly profit and revenue analysis
- **Order Distribution:** Ship vs warehouse breakdown
- **Recent Orders:** Latest transactions with status

## 🎨 Design

### Color Palette
- **Mint Green:** #ABE7B9 (Primary accent)
- **Soft Blue:** #8FC7D9 (Secondary accent)
- **Lime Green:** #CBF3BB (Highlights)
- **Beige:** #ECF4E8 (Light backgrounds)

### UI Components
- Custom bubble buttons with hover effects
- Rounded cards with subtle shadows
- Smooth gradient backgrounds
- Responsive mobile-first design

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **shadcn/ui** components
- **tRPC** for type-safe API calls
- **Recharts** for analytics visualizations

### Backend
- **Express.js** server
- **tRPC** for API procedures
- **Drizzle ORM** for database access
- **Manus OAuth** for authentication

### Database
- **MySQL** with 7 tables
- **Drizzle** migrations
- Relational schema for orders, shipments, drivers, invoices, feedback, and analytics

## 📁 Project Structure

```
logitrack_pro/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Portal pages
│   │   ├── components/ # UI components
│   │   └── lib/        # Utilities
│   └── public/         # Static assets
├── server/             # Express backend
│   ├── routers.ts      # API endpoints
│   ├── db.ts           # Database queries
│   └── _core/          # Framework
├── drizzle/            # Database schema
└── shared/             # Shared types
```

## 🔐 Authentication

LogiTrack Pro uses **Manus OAuth 2.0** for secure authentication:
- Passwordless login
- Role-based access control (Admin, Driver, Customer)
- Session management with JWT
- Automatic user creation on first login

## 🛠️ Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run database migrations
pnpm db:push

# Type checking
pnpm check

# Format code
pnpm format
```

### Database Operations

```bash
# Generate migrations
drizzle-kit generate

# Run migrations
drizzle-kit migrate

# Push schema changes
pnpm db:push
```

## 📊 API Endpoints

### Orders
- `POST /api/trpc/orders.create` - Create new order
- `GET /api/trpc/orders.getByTrackingId` - Get order by tracking ID
- `GET /api/trpc/orders.getMyOrders` - Get user's orders

### Shipments
- `POST /api/trpc/shipments.updateStatus` - Update shipment status
- `GET /api/trpc/shipments.getByOrderId` - Get shipment details

### Feedback
- `POST /api/trpc/feedback.submit` - Submit feedback

### Authentication
- `GET /api/trpc/auth.me` - Get current user
- `POST /api/trpc/auth.logout` - Logout user

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile:** 320px and up
- **Tablet:** 768px and up
- **Desktop:** 1024px and up

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Docker
```bash
docker build -t logitrack-pro .
docker run -p 3000:3000 logitrack-pro
```

### Cloud Platforms
- AWS EC2 / ECS
- Google Cloud Run
- Azure App Service
- DigitalOcean App Platform

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 📚 Documentation

- [User Guide](./userGuide.md) - How to use LogiTrack Pro
- [Setup Guide](./SETUP.md) - Installation and deployment
- [Database Schema](./drizzle/schema.ts) - Data model

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
Check `DATABASE_URL` format: `mysql://user:password@host:port/database`

### Dependencies Issues
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📝 License

LogiTrack Pro is proprietary software. All rights reserved.

## 🤝 Support

For support or feature requests, contact the Manus development team.

---

**Built with ❤️ using Manus Platform**
