# ValleyPreview Perfume E-commerce Platform

Welcome to ValleyPreview, a luxury perfume e-commerce platform built with modern web technologies.

## Features

- Beautiful hero carousel with brand-specific imagery
- Product catalog with detailed fragrance information
- Brand showcase with auto-scrolling functionality
- Responsive design for all device sizes
- High-performance image optimization

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Railway-ready with Docker support
- **Image Optimization**: WebP format conversion

## Quick Start

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:5000` in your browser

### Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Deployment

### Railway Deployment

This project is configured for easy deployment to Railway:

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize and deploy:
   ```bash
   railway init
   railway up
   ```

For detailed deployment instructions, see [RAILWAY_DEPLOYMENT_GUIDE.md](file:///c:/Games/ValleyPreview/RAILWAY_DEPLOYMENT_GUIDE.md).

## Image Optimization

The platform includes automatic image optimization:

- Images are converted to WebP format for better performance
- Responsive images for different screen sizes
- Lazy loading for improved initial page load

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and utilities
├── assets/          # Static assets
└── perfumes/        # Perfume brand folders
```

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string

## Health Check

The application includes a health check endpoint at `/health` for monitoring.

## Support

For issues or questions, please refer to the documentation files in the repository.