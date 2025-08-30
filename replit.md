# Valley Breezes Perfumes - E-commerce Platform

## Overview

Valley Breezes is a luxury perfume e-commerce platform built with a full-stack TypeScript architecture. The application features a sophisticated product catalog, shopping cart functionality, and elegant UI design focused on premium fragrance retail. The platform showcases perfumes across different categories (women's, men's, and unisex) with detailed product information, ratings, and atmospheric imagery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Typography**: Multiple Google Fonts (Cormorant Garamond, EB Garamond, Noto Sans Arabic)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for products and cart management
- **Data Layer**: In-memory storage implementation with interface-based abstraction
- **Session Management**: Browser localStorage for cart session tracking
- **Development**: Vite middleware integration for hot module replacement

### Data Storage
- **Current Implementation**: In-memory storage with Map-based collections
- **Schema Definition**: Drizzle ORM schema definitions ready for PostgreSQL migration
- **Database Preparation**: Configured for Neon Database (PostgreSQL) with connection pooling
- **Data Models**: Users, Products, and Cart Items with proper foreign key relationships

### UI/UX Design Patterns
- **Design System**: Dark theme with gold accent colors (luxury aesthetic)
- **Layout**: Responsive grid system with mobile-first approach
- **Components**: Modular component architecture with proper separation of concerns
- **Accessibility**: ARIA labels and semantic HTML structure
- **Visual Effects**: Backdrop blur effects, smooth animations, and gradient overlays

## External Dependencies

### Database & ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL for production deployment
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Radix UI**: Headless UI primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Class Variance Authority**: Component variant management
- **Lucide React**: Icon library for consistent iconography

### Data Fetching & Forms
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with validation
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

### Third-party Services
- **Google Fonts**: Web font delivery for typography
- **Unsplash**: High-quality product and mood imagery
- **Replit Integration**: Development environment plugins and error handling