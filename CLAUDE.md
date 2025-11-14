# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lamp to My Feet** is a modern, interactive web application designed to help Christians memorize Bible verses through engaging, gamified learning techniques. The name comes from Psalm 119:105: "Your word is a lamp for my feet, a light on my path."

### Core Mission
Transform Bible study from passive reading into an active, rewarding, and spiritually enriching journey using proven memorization techniques and motivational design patterns.

### Key Highlights
- **Frontend Repository**: This is a frontend-only React application that connects to a separate backend API
- **Live Application**: https://lamptomyfeet.co
- **Backend API**: https://api.lamptomyfeet.co (separate repository)
- **Deployment**: Vercel (see `vercel.json`)

---

## Development Commands

### Essential Commands
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Production build (TypeScript + Vite)
npm run build:seo    # Production build with SEO optimizations
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm start            # Start preview server (for deployment environments)
```

### Development Workflow
1. **Start Development**: Run `npm run dev` to start the Vite dev server
2. **Code Quality**: Run `npm run lint` before committing
3. **Production Build**: Test with `npm run build` followed by `npm run preview`

---

## Technology Stack

### Core Framework & Build Tools
- **React 18.3** - UI library with hooks and modern patterns
- **TypeScript 5.6** - Type-safe JavaScript
- **Vite 6.0** - Fast build tool with HMR (Hot Module Replacement)
- **React Router 7.1** - Client-side routing with modern API

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Comprehensive set of unstyled, accessible components
- **Shadcn UI Components** - Pre-built Radix UI component library
- **Framer Motion 12.0** - Animation library for smooth transitions
- **Lucide React** - Icon library
- **Bootstrap 5.3** (Legacy) - Some components still use Bootstrap classes

### Data Management
- **TanStack React Query 5.66** - Server state management, caching, and data fetching
- **Axios 1.7** - HTTP client for API requests
- **React Hook Form 7.66** - Form state management and validation

### Additional Libraries
- **date-fns** - Date manipulation
- **Recharts** - Charts and data visualization
- **React Toastify & Sonner** - Toast notifications
- **class-variance-authority & clsx** - Conditional classNames utilities
- **tailwind-merge** - Merge Tailwind classes intelligently

---

## Project Structure

### Root Directory Layout
```
/home/user/front/
├── src/                    # Main source code
├── pages/                  # Page components (outside src)
├── public/                 # Static assets
├── method/                 # Archived Next.js prototype
├── new-steps-extracted/    # Archived Next.js prototype
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── Documentation files (see below)
```

### Source Code Structure (`src/`)

#### Main Application
```
src/
├── main.tsx                # Application entry point
├── App.tsx                 # Root component with routing
├── App.css                 # Global styles
└── styles/
    └── global-design-system.css  # Design system CSS variables
```

#### Authentication System (`src/auth/`)
```
src/auth/
├── context/
│   ├── AuthContext.tsx         # JWT auth state management
│   └── RankingContext.tsx      # User ranking state
├── components/
│   ├── registratrion/
│   │   ├── Login.tsx           # Login form
│   │   └── Register.tsx        # Registration form
│   ├── Dashboard.tsx           # User dashboard
│   ├── UserProfile.tsx         # Profile page
│   ├── ForgotPassword.tsx      # Password recovery
│   └── ProtectedRoute.tsx      # Route guard HOC
├── api/
│   └── authApi.ts              # Authentication API calls
├── config/
│   └── config.ts               # Auth configuration
└── types/
    └── types.ts                # TypeScript definitions
```

#### Pages (`pages/learnsection/`)
Learning experience pages organized by functionality:
```
pages/learnsection/
├── Learn/                  # Main learning container/router
├── BibleSearch/            # Bible verse search interface
├── categories/             # Verse category browser
├── IntroSection/           # Verse introduction/context
├── ReadLoud/               # Read-aloud exercise
├── BreakDown/              # Verse breakdown into phrases
├── FillBlanks/             # Fill-in-the-blank exercise
├── WriteSection/           # Write from memory exercise
├── FinalScreen/            # Completion celebration
├── memorizedVerses/        # User's memorized verse collection
├── RankingPage/            # User rankings and leaderboard
├── about/                  # About page
└── support/                # Support and legal pages
    ├── TermsOfService.tsx
    └── PrivacyPolicy.tsx
```

#### Components (`src/components/`)

**UI Components** (`src/components/ui/`)
- Comprehensive Shadcn UI component library
- Built on Radix UI primitives
- Fully accessible and customizable
- Examples: `button.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `select.tsx`, `toast.tsx`, etc.

**Feature Components** (`src/components/`)
```
src/components/
├── navigation.tsx              # Main navigation bar
├── homepage-navigation.tsx     # Homepage-specific nav
├── hero-section.tsx            # Landing hero section
├── turning-point-section.tsx   # Marketing section
├── daily-battles-section.tsx   # Marketing section
├── method-section.tsx          # Learning method showcase
├── transformation-section.tsx  # Testimonials/transformation
├── social-proof-section.tsx    # Social proof elements
├── getting-started-section.tsx # CTA section
├── ProgressTracker.tsx         # User progress display
└── RankCard.tsx                # Ranking card component
```

#### Services & Configuration
```
src/
├── services/
│   ├── api.ts              # Main API client configuration
│   └── bibleApi.ts         # Bible API integration
├── config/
│   └── api.ts              # API endpoint configuration
├── lib/
│   └── utils.ts            # Utility functions
├── hooks/
│   ├── use-toast.ts        # Toast notification hook
│   └── use-mobile.ts       # Mobile detection hook
└── utils/
    └── RankingSystem.tsx   # User ranking logic
```

---

## Architecture & Key Concepts

### Routing Architecture
The app uses React Router v7 with a centralized route configuration in `App.tsx`:

**Route Types:**
1. **Public Routes** - Accessible to all users:
   - `/` - Homepage with marketing sections
   - `/bible-search` - Bible verse search
   - `/about` - About page
   - `/support` - Support page
   - `/terms` - Terms of Service
   - `/privacy` - Privacy Policy
   - `/login` - Login page
   - `/register` - Registration page
   - `/forgot-password` - Password recovery

2. **Protected Routes** - Require authentication:
   - `/dashboard` - User dashboard
   - `/profile` - User profile
   - `/learn` - Learning experience (entry point)

**Navigation Variants:**
- `HomepageNavigation` - Used on homepage and marketing pages
- `Navbar` - Used on authenticated/app pages
- No navbar - Learning flow pages for distraction-free experience

### Authentication Flow
1. **AuthContext** (`src/auth/context/AuthContext.tsx`) - Manages authentication state globally
2. **JWT Tokens** - Stored in localStorage, validated on mount
3. **ProtectedRoute** - HOC that redirects unauthenticated users to `/login`
4. **API Integration** - Axios interceptors add auth headers automatically

### Learning Funnel (Multi-Step Memorization Process)
The core learning experience follows a proven pedagogical sequence:

1. **Introduction** - Full verse with context and meaning
2. **Read Aloud** - Auditory learning engagement
3. **Verse Breakdown** - Segmented phrases to reduce cognitive load
4. **Fill in the Blanks** - Active recall with cloze deletion
5. **Write from Memory** - Complete recall challenge
6. **Completion** - Celebration and verse added to collection

### Gamification System
**Ranking System** (`src/utils/RankingSystem.tsx`):
- Tracks verses memorized
- Assigns ranks/titles (e.g., "Seeker", "Disciple", "Warrior", "Lion")
- Visual icons and progress indicators
- Level-up notifications

**User Progress:**
- Dashboard displays current rank and progress
- Memorized verse collection serves as "treasure box"
- Progress tracker shows path to next level

### API Integration
**Backend API** (`src/config/api.ts`):
- Production: `https://api.lamptomyfeet.co/api`
- Development: `http://localhost:3001/api`
- Automatically switches based on `import.meta.env.PROD`

**Key API Endpoints** (consumed by this frontend):
```
Authentication:
POST /auth/register        - User registration
POST /auth/login          - User login
POST /auth/forgot-password - Password recovery

User Data (Protected):
GET  /user/profile        - Get user profile
GET  /user/progress       - Get learning progress
POST /user/progress       - Update progress

Verses:
GET  /memorized-verses              - Get user's memorized verses
POST /memorized-verses              - Add memorized verse
DELETE /memorized-verses/:verseId   - Remove verse

Rankings:
GET  /ranking             - Get user rankings/leaderboard
```

---

## Design System

### Color Palette
The app uses a warm, inviting color scheme designed to create an emotional connection:

**Primary Colors:**
- Slate Dark: `#2C3E50` - Primary text, headlines
- Slate 800: `rgb(30, 41, 59)` - Buttons, navigation

**Accent Colors:**
- Golden Yellow: `#FFD700` - Primary accent, CTAs
- Warm Amber: `#E8B86D` - Secondary accent
- Orange: `#F59E0B` - Tertiary accent

**Backgrounds:**
- Warm White: `#FEFCF8` - Hero section
- Pure White: `#FFFFFF` - Card backgrounds
- Light Gray: `#F8F8F8` - Neutral backgrounds

### Typography
**Font Families:**
- **Lora (Serif)** - Headlines, quotes, emotional content
- **Nunito Sans** - Body text, UI elements
- **Inter** - Modern sections, clean UI

**See `DESIGN_SYSTEM.md` for comprehensive typography scale, button styles, animation patterns, and component patterns.**

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Touch-friendly targets (minimum 48px height)
- Custom breakpoint for iPhone 12+: `390px`

---

## Key Files & Configuration

### Build Configuration
- **`vite.config.ts`** - Vite configuration with:
  - Path alias: `@` → `./src`
  - React SWC plugin for fast refresh
  - HTML plugin for meta injection
  - Manual code splitting (vendor, router, ui chunks)
  - Production optimizations

### TypeScript Configuration
- **`tsconfig.json`** - Base config
- **`tsconfig.app.json`** - App-specific config
- **`tsconfig.node.json`** - Node/build tool config

### Styling Configuration
- **`tailwind.config.js`** - Extended Tailwind configuration
- **`postcss.config.js`** - PostCSS with Tailwind and Autoprefixer
- **`components.json`** - Shadcn UI configuration

### ESLint Configuration
- **`eslint.config.js`** - ESLint 9.x flat config format
- Includes React hooks and React refresh plugins

---

## Documentation Files

The repository includes comprehensive documentation:

- **`CLAUDE.md`** (this file) - AI assistant guidance
- **`README.md`** - General project overview
- **`DESIGN_SYSTEM.md`** - Complete design system reference (colors, typography, animations)
- **`CONCEPTUAL_DESCRIPTION.md`** - Product vision and user journey
- **`COMPONENTS_TO_PRESERVE.md`** - Component preservation notes
- **`DEPENDENCIES_AND_INTEGRATION.md`** - Dependency documentation
- **`HOMEPAGE_MIGRATION_REFERENCE.md`** - Homepage redesign notes

---

## Development Guidelines

### Code Style & Conventions

1. **TypeScript First**
   - Always use TypeScript for new files
   - Define interfaces/types for props and API responses
   - Avoid `any` - use `unknown` or proper types

2. **Component Organization**
   - Functional components with hooks
   - Keep components focused and single-responsibility
   - Extract reusable logic into custom hooks (`src/hooks/`)
   - Use Shadcn UI components from `src/components/ui/` when possible

3. **Styling Approach**
   - Tailwind utility classes are primary styling method
   - Use `clsx()` or `cn()` for conditional classes
   - Follow design system in `DESIGN_SYSTEM.md`
   - Maintain mobile-first responsive design

4. **State Management**
   - React Context for global state (Auth, Ranking)
   - TanStack Query for server state
   - `useState` for local component state
   - React Hook Form for form state

5. **API Integration**
   - Use Axios via `src/services/api.ts`
   - Wrap API calls in TanStack Query hooks
   - Handle loading, error, and success states
   - Use TypeScript types for request/response

### File Naming Conventions
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `api.ts`)
- Styles: `kebab-case.css` (e.g., `global-design-system.css`)
- Pages: `PascalCase/` directories with `index.tsx`

### Import Aliases
- Use `@/` prefix for imports from `src/`
- Example: `import Button from "@/components/ui/button"`

### Performance Considerations
1. **Code Splitting**
   - Automatic route-based splitting via React Router
   - Manual chunks configured in `vite.config.ts`
   - Lazy load heavy components when appropriate

2. **Image Optimization**
   - Use modern formats (WebP)
   - Implement lazy loading
   - Optimize before committing

3. **Bundle Size**
   - Review imports - import only what you need
   - Avoid importing entire libraries
   - Monitor bundle size on builds

---

## Deployment

### Production Deployment
- **Platform**: Vercel
- **Configuration**: `vercel.json`
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Environment**: Production env uses `https://api.lamptomyfeet.co`

### Environment Variables
The app automatically detects environment via `import.meta.env.PROD`:
- **Production**: Uses live API at `api.lamptomyfeet.co`
- **Development**: Uses local API at `localhost:3001`

No `.env` files are currently used in this repository - configuration is code-based.

---

## Working with This Codebase

### Common Tasks

**Adding a New Page:**
1. Create component in `pages/` or `src/`
2. Add route to `App.tsx` route configuration
3. Update navigation if needed (`navigation.tsx` or `homepage-navigation.tsx`)
4. Consider if page needs authentication (wrap in `<ProtectedRoute>`)

**Adding a New UI Component:**
1. Check if Shadcn UI has the component: `src/components/ui/`
2. If not, create in `src/components/`
3. Follow Tailwind + Radix UI patterns
4. Ensure accessibility (ARIA labels, keyboard navigation)
5. Make responsive (mobile-first)

**Working with APIs:**
1. Define TypeScript types for API responses
2. Create service function in `src/services/` or `src/auth/api/`
3. Wrap in TanStack Query hook for caching
4. Handle loading and error states in UI

**Updating Styles:**
1. Use Tailwind utilities first
2. Reference `DESIGN_SYSTEM.md` for approved patterns
3. For global styles, update `src/styles/global-design-system.css`
4. Maintain design consistency (colors, spacing, animations)

### Testing Locally
1. Ensure backend is running at `localhost:3001` OR API is accessible
2. Run `npm run dev`
3. Navigate to `http://localhost:5173`
4. Test authentication flow first
5. Test responsive design with browser DevTools

### Before Committing
- Run `npm run lint` and fix issues
- Test build with `npm run build`
- Check for console errors
- Test on mobile viewport
- Review changes for consistency with design system

---

## Archived/Backup Content

The repository contains archived prototypes and backups:
- **`method/`** - Next.js prototype (not active)
- **`new-steps-extracted/`** - Next.js prototype (not active)
- **`src/Home-OLD-BACKUP/`** - Previous homepage implementation

**These directories should not be modified or deleted** - they serve as reference for previous implementations.

---

## Troubleshooting

### Common Issues

**Build Errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all imports use correct paths/aliases

**API Connection Issues:**
- Verify API is running (production: check api.lamptomyfeet.co status)
- Check CORS configuration on backend
- Verify API endpoint in `src/config/api.ts`
- Check browser console for network errors

**Styling Issues:**
- Ensure Tailwind is compiling: check terminal for Tailwind errors
- Verify class names are correct (Tailwind IntelliSense helps)
- Check if custom CSS is conflicting with Tailwind
- Clear browser cache

**Authentication Issues:**
- Check localStorage for `token` key
- Verify JWT is not expired
- Test login flow from scratch
- Check AuthContext initialization

---

## Additional Resources

### External Dependencies Documentation
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com/docs
- Radix UI: https://www.radix-ui.com
- Shadcn UI: https://ui.shadcn.com
- TanStack Query: https://tanstack.com/query/latest
- React Router: https://reactrouter.com
- Framer Motion: https://www.framer.com/motion

### Project-Specific Resources
- Live Site: https://lamptomyfeet.co
- API Documentation: Contact backend team
- Design System: See `DESIGN_SYSTEM.md` in this repository
- Product Vision: See `CONCEPTUAL_DESCRIPTION.md` in this repository

---

## Notes for AI Assistants

### Context & Constraints
1. **Frontend Only** - This repository contains NO backend code. Backend is separate.
2. **API is External** - All API endpoints are consumed from `api.lamptomyfeet.co`
3. **No Database Access** - Cannot modify or query database directly
4. **Deployment** - Changes here affect frontend only; backend changes require separate repo

### Best Practices When Assisting
1. **Understand Architecture** - Review this file thoroughly before making changes
2. **Follow Design System** - Reference `DESIGN_SYSTEM.md` for styling decisions
3. **Type Safety** - Maintain TypeScript strict typing
4. **Test Thoroughly** - Verify changes work locally before committing
5. **Documentation** - Update relevant docs if making architectural changes
6. **Mobile-First** - Always consider mobile experience
7. **Accessibility** - Maintain WCAG compliance with Radix UI patterns

### Suggested Workflow
1. Read relevant documentation files
2. Explore codebase structure
3. Understand existing patterns before proposing changes
4. Follow established conventions
5. Test changes locally
6. Update documentation if needed

---

**Last Updated**: 2025-11-14
**Repository**: marcosdiego1904/front
**Branch Structure**: Feature branches with `claude/` prefix
