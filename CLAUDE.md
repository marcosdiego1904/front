# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Bible memory application called "Lamp to My Feet" that helps users memorize Bible verses through interactive learning techniques. The application consists of a React frontend and Node.js/Express backend with MySQL database.

## Development Commands

### Frontend (React + Vite + TypeScript)
Navigate to `front/` directory:
- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run build:seo` - Build with production mode SEO optimizations

### Backend (Node.js + Express)
Navigate to `back/` directory:
- `npm run dev` - Start development server with nodemon (runs on port 3001 or configured PORT)
- `npm run start` - Start production server
- `node test-db-connection.js` - Test database connection
- `node test-validation.js` - Test input validation utilities
- `node test-ssl-levels.js` - Test SSL configuration levels

## Architecture

### Frontend Structure (`front/`)
- **Main App**: `src/App.tsx` with routing via React Router
- **Authentication**: `src/auth/` - JWT-based auth system with context provider
  - `AuthContext.tsx` - Authentication state management
  - `components/` - Login, Register, Dashboard, ProtectedRoute components
- **Pages**: `pages/learnsection/` - Learning modules (BibleSearch, FillBlanks, ReadLoud, WriteSection, etc.)
- **Components**: `src/components/` - Reusable UI components (ProgressTracker, RankCard, etc.)
- **Services**: `src/services/` - API communication layer
- **Config**: Uses Vite with TypeScript, Bootstrap for styling, Framer Motion for animations

### Backend Structure (`back/`)
- **Entry Point**: `server.js` - Express app with CORS, authentication middleware
- **Database**: Multiple connection configurations:
  - `db.js` - Main database connection with SSL configuration
  - `db-railway.js` - Railway-specific connection
  - `db-secure-ssl.js` - Secure SSL connection variant
- **Security**: 
  - Input validation utilities in `src/utils/validation.js`
  - Configurable SSL levels (strict/legacy) for Railway compatibility
  - JWT authentication with bcrypt password hashing
- **API Endpoints**:
  - `/api/auth/*` - User registration/login
  - `/api/user/*` - User profile and progress
  - `/api/memorized-verses` - Verse management
  - `/api/ranking` - User rankings

### Database Configuration
- **Primary**: MySQL with Railway hosting
- **SSL Security**: Configurable strict/legacy modes due to Railway's self-signed certificates
- **Environment Variables**: 
  - `MYSQL_URL` - Database connection string
  - `JWT_SECRET` - JWT signing secret
  - `SSL_STRICT` - SSL validation level (false for Railway compatibility)

## Key Technologies

### Frontend Stack
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- TanStack React Query for data fetching
- Axios for HTTP requests
- Bootstrap + custom CSS for styling
- Framer Motion for animations

### Backend Stack  
- Node.js with Express
- MySQL2 for database connectivity
- JWT for authentication
- bcrypt for password hashing
- CORS middleware with origin whitelist

## Testing

The backend includes several test utilities:
- `test-db-connection.js` - Verify database connectivity
- `test-validation.js` - Test input validation functions
- `test-validation-api.js` - Test API validation endpoints
- `test-ssl-levels.js` - Test SSL configuration modes

No formal test framework is configured - testing is done via standalone Node.js scripts.

## Deployment

- **Frontend**: Deployed on Vercel (see `front/vercel.json`)
- **Backend**: Deployed on Railway (see `back/RAILWAY_CONFIG.md`)
- **Database**: Railway-hosted MySQL with SSL configuration notes

## Security Considerations

- Input validation middleware implemented for all user inputs
- SSL configuration documentation for Railway's self-signed certificates
- CORS configured with specific origin whitelist
- JWT tokens for stateless authentication
- Password hashing with bcrypt
- Comprehensive security documentation in `back/INPUT_VALIDATION_SECURITY.md`