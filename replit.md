# Thuy Pham Portfolio Website

## Overview

This is a modern, full-stack personal portfolio website for Thuy Pham, a Full Stack Developer. The application features a single-page design with smooth animations, dark/light mode theming, and a contact form for visitor engagement. Built with React and Express, it showcases professional projects, technical skills, and provides multiple ways to connect.

## User Preferences

Preferred communication style: Simple, everyday language.

## Latest Updates (Current Session)

Added comprehensive admin CRUD system for managing portfolio content:

### New Database Tables (via Drizzle ORM)
- **home_content**: Hero section configuration (title, subtitle, CTA text)
- **about_content**: About section data (title, description, bio)
- **skills**: Skill items with proficiency levels
- **projects**: Portfolio projects with tech stack
- **certificates**: Professional certifications

### New API Routes
- `GET/POST /api/home` - Home content management
- `GET/POST /api/about` - About content management
- `GET/POST/PATCH/DELETE /api/skills` - Skills CRUD
- `GET/POST/PATCH/DELETE /api/projects` - Projects CRUD
- `GET/POST/PATCH/DELETE /api/certificates` - Certificates CRUD

### New Admin Pages
- `/admin/content` - Comprehensive content management dashboard with tabs for:
  - Home section editor
  - About section editor
  - Skills manager with add/delete
  - Projects manager with add/delete
  - Certificates manager with add/delete

### Storage Layer Updates
- Extended `IStorage` interface with CRUD methods for all new content types
- Implemented `DatabaseStorage` methods for all operations
- All data persisted to PostgreSQL via Drizzle ORM

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with **Vite** as the build tool and development server
- TypeScript for type safety across the application
- Single-page application (SPA) using `wouter` for lightweight client-side routing

**UI Component System**
- **shadcn/ui** component library built on **Radix UI** primitives
- Customized "new-york" style variant with neutral color palette
- All UI components are TypeScript-based and located in `client/src/components/ui/`
- Component aliases configured via path mapping for clean imports (`@/components`, `@/lib`, etc.)

**Styling Approach**
- **TailwindCSS** for utility-first styling with custom design tokens
- CSS variables for theme values (HSL color format)
- Dark/light mode support via CSS class strategy (`.dark` class on root element)
- Custom color system defined in `client/src/index.css` with semantic color naming
- Responsive design with mobile-first approach

**Animation System**
- **Framer Motion** for declarative animations and transitions
- Scroll-triggered animations using `useInView` hook
- Typewriter effect for hero subtitle rotation
- Staggered animations for project cards and skill items
- Hover and active state animations throughout

**State Management**
- **React Query (@tanstack/react-query)** for server state management
- Local component state with React hooks
- Theme state managed via Context API (`ThemeProvider`)
- Form state handled by **React Hook Form** with **Zod** validation

**Page Structure**
The application consists of a single home page with distinct sections:
- **Hero Section**: Animated introduction with typewriter effect and CTAs
- **About Section**: Two-column layout featuring skills grid with icon-based cards
- **Projects Section**: Grid of 6 project cards with hover effects and tech stack badges
- **Contact Section**: Form with validation for visitor messages
- **Footer**: Social links and copyright information
- **Navbar**: Sticky navigation with mobile sidebar, smooth scrolling to sections

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js
- Custom HTTP server using Node's `http.createServer()`
- Development mode uses Vite middleware for HMR (Hot Module Replacement)
- Production mode serves pre-built static files

**API Design**
- RESTful API endpoints under `/api` prefix
- **POST /api/contact**: Accepts contact form submissions with validation
- **GET /api/messages**: Retrieves all stored contact messages
- JSON-based request/response format
- Centralized error handling with proper HTTP status codes

**Request Processing**
- Body parsing via `express.json()` with raw body preservation
- URL-encoded data support for form submissions
- Request logging middleware tracking method, path, status, and duration

**Validation Layer**
- **Zod** schemas for runtime type validation
- Validation happens at the API route level before storage
- User-friendly error messages using `zod-validation-error`
- Schema defined in shared directory for client/server consistency

**Development Tooling**
- Custom Vite integration for seamless development experience
- Hot module reloading for both frontend and backend changes
- Replit-specific plugins for error overlays and development banners
- Build script uses esbuild for server bundling

### Data Storage Solutions

**Current Implementation: File-Based Storage**
- Contact messages stored in `messages.json` at project root
- In-memory storage class (`MemStorage`) with file persistence
- Synchronous file I/O operations using Node's `fs` module
- Each message includes: id (UUID), name, email, message, createdAt timestamp

**Database Schema (Prepared for Migration)**
- **Drizzle ORM** configured for PostgreSQL with schema definitions in `shared/schema.ts`
- **Schema Tables**:
  - `users`: User accounts with username/password authentication (prepared but not actively used)
  - `contact_messages`: Stores visitor contact form submissions
- Schema uses `gen_random_uuid()` for primary keys
- Prepared for Neon serverless PostgreSQL integration (`@neondatabase/serverless`)

**Migration Strategy**
- Drizzle Kit configured with `drizzle.config.ts` pointing to PostgreSQL dialect
- Migration files output to `./migrations` directory
- Current storage abstraction (`IStorage` interface) allows easy swapping to database implementation

### External Dependencies

**UI & Animation Libraries**
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, accordions, etc.)
- **Framer Motion**: Animation and gesture library
- **React Icons**: Icon library for tech stack and social media icons
- **Lucide React**: Additional icon set for UI elements
- **cmdk**: Command palette component
- **Embla Carousel**: Carousel/slider component
- **Vaul**: Drawer component for mobile interfaces

**Form & Data Management**
- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Schema validation for both client and server
- **@tanstack/react-query**: Server state management and caching
- **date-fns**: Date formatting and manipulation

**Development & Build Tools**
- **TypeScript**: Type checking across the entire codebase
- **Vite**: Fast build tool and development server
- **esbuild**: JavaScript bundler for production server build
- **PostCSS & Autoprefixer**: CSS processing
- **Drizzle Kit**: Database migration tool

**Utility Libraries**
- **clsx & tailwind-merge**: Conditional className composition
- **class-variance-authority**: Type-safe component variants
- **nanoid**: Unique ID generation
- **uuid**: UUID generation for storage layer

**Potential Future Integrations** (dependencies installed but not currently active)
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Passport.js**: Authentication middleware (user system prepared in schema)
- Session management via `express-session` and `connect-pg-simple`

**Font Resources**
- Google Fonts: DM Sans, Fira Code, Geist Mono, Architects Daughter
- Fonts loaded via CDN in `client/index.html`