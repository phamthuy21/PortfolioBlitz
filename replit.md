# Thuy Pham Portfolio Website

## Overview

Modern, full-stack personal portfolio website for Thuy Pham with dark/light mode, animations, contact form, blog system, admin dashboard with comprehensive CRUD management, analytics tracking, and resume download functionality.

## Recent Updates (Phase 2 - Completed)

### Admin Content Management System
Added comprehensive admin dashboard for managing all dynamic portfolio content:
- **Home Content**: Edit hero section heading, subheading, and CTA text
- **About Content**: Edit about section title and description
- **Skills Management**: Create, read, update, delete technical skills with proficiency levels
- **Projects Management**: Create, read, update, delete portfolio projects with categories
- **Certificates Management**: Create, read, update, delete professional certificates

### Database Schema Additions
New PostgreSQL tables added via Drizzle ORM:
- `home_content`: Hero section content management
- `about_content`: About section content management
- `skills`: Technical skills with proficiency ratings
- `projects`: Portfolio projects (migrated from static data)
- `certificates`: Professional certifications and achievements

### API Endpoints Added
All CRUD endpoints protected with admin authentication:
- `GET/PUT /api/admin/home` - Home content management
- `GET/PUT /api/admin/about` - About content management
- `GET/POST/PATCH/DELETE /api/admin/skills/:id` - Skills management
- `GET/POST/PATCH/DELETE /api/admin/projects/:id` - Projects management
- `GET/POST/PATCH/DELETE /api/admin/certificates/:id` - Certificates management

### Admin UI Components
- Tabbed interface for managing 5 content sections
- Form components for creating/editing content
- List views with delete functionality
- Loading states and toast notifications for user feedback
- Fully responsive design

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with **Vite** as the build tool and development server
- TypeScript for type safety across the application
- Single-page application (SPA) using `wouter` for lightweight client-side routing

**UI Component System**
- **shadcn/ui** component library built on **Radix UI** primitives
- Customized "new-york" style variant with neutral color palette
- Component aliases configured via path mapping (`@/components`, `@/lib`, etc.)

**Styling & Animation**
- **TailwindCSS** for utility-first styling with custom design tokens
- **Framer Motion** for declarative animations
- Dark/light mode support via CSS class strategy
- Custom color system with HSL variables

**State Management**
- **React Query** for server state management
- React hooks for local component state
- Theme state via Context API
- Form state with React Hook Form + Zod validation

**Key Pages**
- Home page with hero, about, projects, contact, footer sections
- Blog system with list and detail pages
- Admin dashboard for contacts and blog management
- Admin content dashboard for CRUD operations on portfolio content
- Resume/CV page with print-to-PDF functionality

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js with Vite middleware in dev mode
- RESTful API under `/api` prefix
- Admin endpoints protected with Bearer token authentication

**Database Layer**
- **PostgreSQL** via Neon serverless (using `@neondatabase/serverless`)
- **Drizzle ORM** for type-safe database interactions
- Automatic migrations via `npm run db:push`

**API Routes**
- Contact form submission and management
- Blog post CRUD operations
- Admin content management (home, about, skills, projects, certificates)
- Analytics event tracking
- Admin authentication

### Current Tables
- `users` - Admin accounts (prepared for future use)
- `contact_messages` - Visitor contact form submissions
- `blog_posts` - Blog post content with markdown support
- `analytics_events` - Page view and section engagement tracking
- `home_content` - Hero section content
- `about_content` - About section content
- `skills` - Technical skills inventory
- `projects` - Portfolio projects
- `certificates` - Professional certifications

### Storage & Validation
- **Zod** schemas for runtime validation
- Type-safe database operations with Drizzle ORM
- Centralized validation layer at API routes

## Feature Checklist

✅ Dark/light mode theming
✅ Framer Motion animations
✅ Responsive design
✅ Contact form with validation
✅ PostgreSQL database integration
✅ Project filtering by category and tech stack
✅ Admin dashboard for contact messages
✅ Blog system with markdown support
✅ Analytics tracking (page views, section visibility)
✅ Resume/CV download
✅ Admin CRUD for home, about, skills, projects, certificates content

## Running the Application

Development:
```bash
npm run dev
```

Database migrations:
```bash
npm run db:push
```

Build for production:
```bash
npm run build
```

## Known Issues

- Database endpoint may require re-enabling in Neon console if disabled
- Admin password uses environment variable `ADMIN_PASSWORD` (defaults to "admin123")

## Next Steps (Future Work)

- User authentication system using Passport.js
- Image upload functionality for projects and certificates
- Email notifications for contact form submissions
- Advanced analytics dashboard with charts
- SEO optimization for blog posts
- Social media integration
