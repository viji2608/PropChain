# PropChain Lite

## Overview

PropChain Lite is a real estate tokenization platform that enables property owners to tokenize their assets and implement decentralized governance through DAO voting. The application combines modern web development with blockchain concepts, offering features for property management, valuation reporting, and community-driven decision making.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, utilizing a modern component-based architecture:
- **Framework**: React with TypeScript for type safety
- **UI Library**: Radix UI components with shadcn/ui for consistent design
- **Styling**: Tailwind CSS for utility-first styling with custom CSS variables for theming
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

The application follows a modular structure with reusable components, custom hooks, and centralized API handling. The UI design implements a clean, modern interface with support for both light and dark themes.

### Backend Architecture
The backend uses a Node.js Express server with TypeScript:
- **Framework**: Express.js for REST API endpoints
- **Runtime**: Node.js with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for efficient bundling

The server implements middleware for request logging, JSON parsing, and error handling. API routes are organized by feature domains (properties, voting, reports) with proper validation and error responses.

### Data Storage Solutions
The application uses a hybrid storage approach:
- **Production Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Development Storage**: In-memory storage implementation for rapid development
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management

The storage layer is abstracted through an interface pattern, allowing easy switching between implementations. The schema includes tables for properties, voting proposals, valuation reports, and user votes with proper relationships and constraints.

### Authentication and Authorization
The current implementation uses a simplified authentication system:
- **Session Management**: Express sessions with PostgreSQL storage (connect-pg-simple)
- **User Context**: Simplified user identification for demo purposes
- **Access Control**: Basic route-level access control

### API Design
RESTful API design with consistent patterns:
- **CRUD Operations**: Standard HTTP methods for resource management
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Response Format**: Consistent JSON response structure

Key API endpoints include:
- Properties management (GET, POST)
- Voting proposals (GET, POST, PUT)
- Valuation reports (GET, POST)
- User voting (GET, POST)
- Dashboard statistics

## External Dependencies

### Database and ORM
- **PostgreSQL**: Primary database for production data persistence
- **Drizzle ORM**: Type-safe database operations and query building
- **Neon Database**: Serverless PostgreSQL hosting
- **connect-pg-simple**: PostgreSQL session store for Express

### UI and Styling
- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Chart.js**: Data visualization for income charts and analytics

### Development and Build Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type safety across the full stack
- **esbuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution for development

### State Management and Data Fetching
- **React Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for type-safe data handling

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class management
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing solution

The application is designed to be deployed on platforms like Replit with integrated development tools and runtime error handling for a smooth development experience.