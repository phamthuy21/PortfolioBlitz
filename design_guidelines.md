# Design Guidelines for Thuy Pham Portfolio Website

## Design Approach
**Reference-Based Approach**: Modern developer portfolio aesthetic - drawing inspiration from contemporary portfolio sites with emphasis on smooth animations, professional polish, and dark mode excellence.

## Color System

### Dark Mode Palette
- Background: `#0f0f0f`
- Text: `#e5e5e5`
- Card/Surface: `#1a1a1a`

### Light Mode Palette
- Background: `#ffffff`
- Text: `#222222`
- Card/Surface: `#f3f3f3`

### Accent Colors
- Gradient backgrounds in hero section
- Subtle glow effects on hover states

## Typography
- Clean, modern sans-serif font family from Google Fonts
- Hierarchy:
  - Hero Name: Large, bold display text
  - Hero Title: Medium weight, professional
  - Section Headers: Bold, clear hierarchy
  - Body Text: Regular weight, optimized readability
  - Typewriter animation for hero subtitle

## Layout System

### Spacing
Use Tailwind spacing units consistently: 4, 8, 12, 16, 20, 24 (p-4, p-8, m-12, etc.)

### Grid Structure
- Hero: Full viewport height, centered content
- About: Two-column layout (image left, text right) - reverse on mobile
- Projects: Grid layout for 6 project cards (3 columns desktop, 2 tablet, 1 mobile)
- Skills: Grid layout with multiple skill cards
- Contact: Centered form with full-width inputs

### Responsive Breakpoints
- Mobile-first approach
- Sidebar navigation for mobile
- Sticky desktop navbar
- Flexible card grids that adapt to viewport

## Component Library

### Navigation
- Sticky top navbar with dark mode compatibility
- Mobile: Hamburger menu with sidebar
- Smooth scroll to sections
- Dark mode toggle button (floating, top-right)

### Hero Section
- Full viewport height
- Animated gradient background
- Floating animated elements (subtle parallax)
- Profile image/avatar with scale animation
- Two CTA buttons: "Download CV" and "Contact Me"
- Typewriter animation for subtitle using Framer Motion

### Cards
- Project Cards: Image thumbnail, title, description, tech stack tags, GitHub link
- Skill Cards: Icon + skill name with fade-in animations
- Hover effects: Lift (translateY), shadow glow, subtle rotate (1-2 degrees)

### Forms
- Contact form with: Name, Email, Message fields
- Full-width inputs with proper spacing
- Submit button with loading states
- Toast notifications for success/error feedback

### Footer
- Social media icons (GitHub, LinkedIn)
- Dark mode compatible styling
- Fade-in on scroll

## Animations

### Framer Motion Requirements
- **Hero**: Parallax floating elements, scale animation on avatar
- **Typewriter Effect**: Animated subtitle text in hero
- **Fade In**: All sections fade in on scroll
- **Stagger Children**: Project cards and skill cards animate in sequence
- **Hover Effects**: Scale transforms on cards, buttons
- **Smooth Transitions**: 0.4s-1s duration for all state changes
- **Theme Toggle**: Smooth transition when switching light/dark mode

### Animation Principles
- Subtle, professional movements
- No jarring or excessive motion
- Enhance UX without distraction
- Respect reduced motion preferences

## Images

### Hero Image
Large profile photo or professional avatar positioned prominently in hero section with subtle scale/breathing animation on hover.

### Project Images
6 project thumbnail images showcasing work - use placeholder images that represent web/app projects with modern UI screenshots.

### About Section Image
Professional photo or illustration on the left side (mobile: above text).

## Interactions
- Smooth scrolling between sections
- Card hover states with elevation and glow
- Button hover states with color transitions
- Form input focus states with border highlights
- Mobile sidebar slide-in animation
- Dark mode toggle with icon rotation

## Accessibility
- Proper heading hierarchy (h1, h2, h3)
- Form labels and ARIA attributes
- Keyboard navigation support
- Focus indicators on interactive elements
- Sufficient color contrast in both themes