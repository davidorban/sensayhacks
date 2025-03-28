---

# .windsurfrules

## Project Overview
- **Type:** Web Application Prototype
- **Description:** A web application UI to showcase seven prototype features developed using the Sensay API during a hackathon. The application emphasizes clean navigation with a persistent vertical sidebar and incorporates mock implementations for complex external integrations like Web3 and Telephony.
- **Primary Goal:** Demonstrate core functionalities of each prototype, including user authentication, interactive demos for various features, and integrated API calls using Next.js and Supabase.

## Project Structure
### Framework-Specific Routing
- **Directory Rules:**
  - Next.js 14 (App Router): Enforce an `app/` directory structure with nested route folders. Each prototype and functionality (e.g., authentication, demos) has its own dedicated route such as `app/replica-task-memory/page.tsx` for the Replica Task Memory demo.
  - Example 1: "Next.js 14 (App Router)" → `app/[route]/page.tsx` conventions
  - Example 2: "Next.js (Pages Router)" → `pages/[route].tsx` pattern (Not applicable)
  - Example 3: "React Router 6" → `src/routes/` with `createBrowserRouter` (Not applicable)

### Core Directories
- **Versioned Structure:**
  - `app/api`: Next.js 14 API routes with Route Handlers for backend operations integrating Supabase and Sensay API.
  - `app/auth`: Authentication routes/pages implementing Supabase Auth (e.g., `app/auth/login/page.tsx`).
  - `app/[prototype]`: Dedicated folders for each of the seven prototype demos, such as `app/replica-task-memory`, `app/pure-voice`, `app/mcp-client`, `app/token-gated-memories`, `app/token-guided-evolution`, `app/bonding-replicas`, and `app/chatroom`.

### Key Files
- **Stack-Versioned Patterns:**
  - `app/dashboard/layout.tsx`: Root layout that includes the persistent vertical sidebar used for navigation between prototypes.
  - `app/auth/login/page.tsx`: Login page implementing Supabase Auth.
  - `app/replica-task-memory/page.tsx`: Page for the Replica Task Memory demonstration.

## Tech Stack Rules
- **Version Enforcement:**
  - next@14: App Router is required; usage of nested routing and route handlers is enforced. No usage of `pages/` directory permitted.
  - supabase@latest: Utilized for authentication and data persistence via Next.js API routes.

## PRD Compliance
- **Non-Negotiable:**
  - "User sign-up, login, and logout functionality via Supabase Auth must be integrated": Requires server-side authentication flows using Next.js 14 standards.
  - "Persistent vertical sidebar for prototype navigation": Must appear consistently across all pages via a shared layout component.

## App Flow Integration
- **Stack-Aligned Flow:**
  - Next.js 14 Auth Flow → `app/auth/login/page.tsx` employs server actions and integrated Supabase Auth.
  - Each prototype demo is mapped to its own route under `app/`, ensuring clear separation of functionalities and mock implementations for external features (e.g., Web3 and Telephony).

---