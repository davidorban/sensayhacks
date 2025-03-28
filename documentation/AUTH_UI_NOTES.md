# Authentication and UI/UX Notes

This document summarizes the key decisions and patterns implemented for user authentication and related UI/UX flows in the Sensay Hackathon Ideas Showcase project.

## Authentication Flow

- **Provider:** Supabase is used for authentication.
- **Methods:** Users can log in via Email/Password or Google OAuth.
- **Libraries:**
    - `@supabase/ssr`: Used for managing authentication state and cookies across Server Components, Client Components, Middleware, and Route Handlers.
    - `@supabase/auth-ui-react`: Provides the pre-built UI components used on the `/login` page.
- **Client Setup:**
    - **Server-Side:** `src/lib/supabase/server.ts` provides two distinct helper functions for creating Supabase clients with correct cookie handling:
        - `createServerComponentClient()`: For use in Server Components, Server Actions, and Route Handlers (uses `cookies()` from `next/headers`).
        - `createMiddlewareClient(req)`: For use in `middleware.ts` (uses `req.cookies` and returns a potentially modified `response` object).
    - **Client-Side:** `src/lib/supabase/client.ts` provides `createClient()` which initializes a `createBrowserClient` instance for use in Client Components.
- **Session Management:**
    - Session cookies are automatically handled by the `@supabase/ssr` helper functions.
    - `src/middleware.ts` refreshes the session on relevant requests using `getSession()`.
    - `src/components/AuthStatus.tsx` (Client Component) uses `supabase.auth.onAuthStateChange` to listen for sign-in/sign-out events and update the UI dynamically.
- **Login Page (`/login`):**
    - Uses the `<Auth>` component from `@supabase/auth-ui-react`.
    - Configured providers: `['google']` (Email/Password is enabled by default).
    - `redirectTo` is set to `/auth/callback` for the OAuth flow.
- **Auth Callback (`/auth/callback`):**
    - Route Handler that exchanges the OAuth code for a session using `createServerComponentClient()`.
    - Redirects the user back to the root (`/`).
- **Sign Out:**
    - Handled by `src/components/SignOutButton.tsx`.
    - Calls `supabase.auth.signOut()`.
    - Performs a full page reload to the home page using `window.location.assign('/')` to ensure the layout and server components reset correctly to the logged-out state.

## Authorization Logic (Middleware)

- **File:** `src/middleware.ts`
- **Protection:** Applies to all routes except static assets (`_next/*`, `favicon.ico`, `img/*`) and explicitly public routes (`/`, `/login`, `/auth/callback`, `/privacy`, `/terms`).
- **Rules:**
    1. If a user is **not** logged in and tries to access a protected route (e.g., `/prototypes/*`, `/overview`), they are redirected to `/login`.
    2. If a user **is** logged in and tries to access `/login`, they are redirected to `/`.
    3. If a user **is** logged in with an email **not** ending in `@sensay.io`:
        - Accessing `/prototypes/*` redirects them to `/overview`.
        - Accessing `/overview` or other non-prototype routes is allowed.
    4. If a user **is** logged in with an email ending in `@sensay.io`, access to all routes (including `/prototypes/*`) is allowed.

## UI/UX Patterns

- **Layout (`src/app/layout.tsx`):**
    - Fetches the server-side session using `createServerComponentClient()`.
    - Conditionally renders the `Sidebar` component only if the user is logged in *and* their email ends with `@sensay.io`.
    - Always renders the `AuthStatus` component.
- **Auth Status (`src/components/AuthStatus.tsx`):**
    - Fixed position in the top-right corner (`fixed top-4 right-4 z-50`).
    - Uses client-side Supabase client and `onAuthStateChange` to get the session.
    - If a session exists, it displays the user's email and the `SignOutButton`.
    - If no session exists, it renders nothing.
- **Sidebar (`src/components/Sidebar.tsx`):**
    - Only rendered for authenticated `@sensay.io` users (controlled by `layout.tsx`).
    - Contains navigation links to the different prototypes.
- **Home Page Logo (`src/app/page.tsx`):**
    - Uses the Next.js `<Image>` component.
    - `src` is set to `/img/sensayhacks.jpg` (referencing `public/img/sensayhacks.jpg`).
    - Includes the `unoptimized={true}` prop. This was necessary because Vercel's image optimization was failing for this specific JPG file, preventing it from loading. Using `unoptimized` ensures the image is served directly and displays reliably.
- **Styling:**
    - Primarily uses Tailwind CSS.
    - Adopts a dark theme with `bg-gray-900` for main backgrounds and contrasting text colors.

