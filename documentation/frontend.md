# Frontend Documentation

## Frontend Architecture

Our application is built using Next.js with React and TypeScript. This framework helps us to create a fast, modern, and scalable web application. We also use Windsurf components for a consistent UI design.

### Key Technologies
- Next.js for routing and server-side rendering
- React for component-based UI
- TypeScript for type safety
- Windsurf for UI components
- Tailwind CSS for styling

## Design Principles

### Usability
- Clean and straightforward interface
- Clear labels on buttons
- Well-organized layout
- Consistent interaction patterns

### Accessibility
- Support for all users, including those with accessibility needs

### Responsiveness
- Optimized for desktop design
- Scalable across different screens
- Graceful element scaling

## Styling and Theming

### Color Palette
- Primary: #1E90FF (bright blue) for key interactive elements
- Secondary: #FF7F50 (soft coral) for accents
- Background: #F5F5F5 (light grey)
- Text: #333333 (dark grey)

### Dark Theme
- Overall Background: Dark gray/near-black (`bg-gray-900`)
- Header/Outer Containers: Dark gray/near-black (`bg-gray-900`)
- Header Text: Light gray/white (`text-gray-100` or `text-white`)
- Main Content Area: White (`bg-white`)
- Content Area Text: Dark gray/black (`text-gray-800`, `text-gray-700`, `text-gray-600`)
- Accent/Buttons: Indigo (`bg-indigo-600`, `hover:bg-indigo-700`, `text-white`)
- Sidebar Background: Dark gray (`bg-gray-800`)
- Sidebar Text: White/Light Gray (`text-white`, `text-gray-300`, `hover:text-gray-100`)

### Layout Principles
- Full height pages
- Optional sidebar (fixed-width, `w-64`)
- Main content area with rounded corners (`rounded-lg`)
- Subtle shadows (`shadow-lg`)
- Consistent padding (`p-6` or `p-8`)

## Component Structure

### Key Features
- Component-based architecture
- Reusable UI components
- Clear separation of presentation and logic
- Well-organized component hierarchy

## State Management

### Implementation
- React's built-in state management
- Context API for shared state
- Easy sharing of authentication states and conversation histories

## Routing and Navigation

### Structure
- Vertical sidebar for prototype features
- Persistent sidebar showing active view
- Clear labels and interactive elements
- Intuitive page transitions using Next.js

## Performance Optimization

### Techniques
- Lazy loading
- Code splitting
- Asset optimization
- Server-side rendering
- Code-splitting

## Linting Guide

### Common ESLint Errors

#### 1. Unused Variables (`@typescript-eslint/no-unused-vars`)
- Remove unused variables
- Use underscore prefix for intentionally unused variables
- Use empty destructuring for unused state setters
- Add comments explaining unused variables

#### 2. Missing Dependencies in useEffect (`react-hooks/exhaustive-deps`)
- Add missing variables to dependency array

#### 3. Missing Key Prop in Lists (`react/jsx-key`)
- Add unique key to each element in lists

### Automatic Fixes
- Use `eslint --fix` for automatic fixes
- Configure VS Code for automatic linting
- Set up pre-commit hooks for linting checks
