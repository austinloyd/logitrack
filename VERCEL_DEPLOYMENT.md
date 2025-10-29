# Deploying LogiTrack to Vercel

This guide will walk you through deploying your LogiTrack application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
2. Git repository with your LogiTrack code (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Set Up Environment Variables

Before deploying, you'll need to set up your environment variables in Vercel. Use the values from your `.env` file as a reference.

Required environment variables:

- `DATABASE_URL`: Your MySQL database connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to `production`
- `VITE_FIREBASE_API_KEY`: Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Your Firebase app ID
- `VITE_APP_TITLE`: Your application title
- `VITE_APP_ID`: Your application ID

### 2. Deploy to Vercel

#### Option 1: Deploy via Vercel Dashboard

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure the project:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add your environment variables in the "Environment Variables" section
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to your project directory and run:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project

### 3. Database Setup

For the database, you have several options:

1. **Vercel Postgres**: Available directly from Vercel
2. **PlanetScale**: MySQL-compatible serverless database
3. **Railway**: Managed MySQL database
4. **AWS RDS**: Amazon's Relational Database Service

After setting up your database, update the `DATABASE_URL` environment variable in your Vercel project settings.

### 4. Verify Deployment

1. Once deployed, Vercel will provide you with a URL to access your application
2. Test all functionality to ensure everything works as expected
3. Check the Vercel logs if you encounter any issues

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check your build logs in the Vercel dashboard
   - Ensure all dependencies are correctly installed

2. **Database Connection Issues**:
   - Verify your `DATABASE_URL` is correct
   - Ensure your database allows connections from Vercel's IP addresses

3. **Environment Variables**:
   - Double-check that all required environment variables are set
   - Remember that environment variables starting with `VITE_` are exposed to the client

4. **API Routes Not Working**:
   - Verify the routes configuration in `vercel.json`

## Custom Domain Setup

To use a custom domain with your Vercel deployment:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your domain and follow the instructions to configure DNS settings

## Continuous Deployment

Vercel automatically sets up continuous deployment from your Git repository. When you push changes to your main branch, Vercel will automatically rebuild and redeploy your application.

For more control over deployments, you can configure branch deployments and preview environments in the Vercel dashboard.