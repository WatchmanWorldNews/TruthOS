# Overview

Mindful is a comprehensive meditation and mindfulness web application that provides users with guided meditation sessions, progress tracking, and subscription-based premium content. The platform offers a curated library of meditation sessions organized by categories, user progress analytics, journaling capabilities, and integration with payment processing for premium subscriptions.

The application serves as a digital wellness platform where users can discover meditation content, track their mindfulness journey, and access both free and premium meditation sessions from various guides.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built as a Single Page Application (SPA) using React with TypeScript. Key architectural decisions include:

- **React with Vite**: Chosen for fast development experience and optimized production builds
- **Wouter for Routing**: Lightweight client-side routing solution instead of React Router
- **TanStack Query**: Provides robust data fetching, caching, and synchronization with the backend
- **Tailwind CSS + Shadcn/ui**: Utility-first CSS framework combined with accessible component library for consistent design
- **Form Management**: React Hook Form with Zod validation for type-safe form handling

The frontend follows a component-based architecture with clear separation between UI components, business logic hooks, and data fetching utilities.

## Backend Architecture

The backend uses a Node.js Express server with TypeScript, following RESTful API principles:

- **Express.js**: Web framework for handling HTTP requests and middleware
- **TypeScript**: Provides type safety and better development experience
- **Session-based Authentication**: Uses express-session with PostgreSQL storage for user sessions
- **Replit Auth Integration**: Leverages Replit's OAuth2 system for user authentication
- **File Storage**: Google Cloud Storage integration for handling media uploads
- **API Design**: RESTful endpoints with consistent error handling and response formats

## Data Storage Solutions

The application uses PostgreSQL as the primary database with Drizzle ORM:

- **PostgreSQL**: Relational database for structured data storage
- **Drizzle ORM**: Type-safe database operations with automatic TypeScript inference
- **Neon Database**: Serverless PostgreSQL provider for cloud deployment
- **Database Schema**: Well-structured tables for users, sessions, categories, progress tracking, and journaling
- **Session Storage**: Database-backed session storage using connect-pg-simple

## Authentication and Authorization

Authentication is handled through Replit's OAuth2 system:

- **Replit OpenID Connect**: Secure authentication flow using industry standards
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Middleware Protection**: Route-level authentication middleware for protected endpoints
- **User Profile Management**: Automatic user creation and profile updates from OAuth provider

## Payment Processing

Stripe integration for subscription management:

- **Stripe Elements**: Secure payment form handling on the frontend
- **Subscription Management**: Handles monthly and annual premium subscriptions
- **Webhook Processing**: Processes Stripe events for subscription updates
- **Customer Management**: Links Stripe customers to application users

# External Dependencies

## Authentication Services
- **Replit OAuth2**: Primary authentication provider using OpenID Connect standards
- **Passport.js**: Authentication middleware with OpenID Connect strategy

## Payment Processing
- **Stripe**: Complete payment processing platform for subscription billing
- **Stripe Elements**: Frontend payment form components

## Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Google Cloud Storage**: Media file storage and serving
- **Drizzle Kit**: Database migrations and schema management

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Accessible React component library built on Radix UI
- **Radix UI**: Low-level UI primitives for building design systems

## Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds

## File Upload and Management
- **Uppy**: File upload library with multiple provider support
- **Uppy AWS S3**: Direct-to-S3 upload capabilities for efficient file handling

## Data Fetching and State Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for type-safe data handling