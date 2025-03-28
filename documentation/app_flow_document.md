# App Flow Document

## Onboarding and Sign-In/Sign-Up
When a user first accesses the application, they are greeted by a clean landing page (`/`). This page offers clear options for logging in via the `/login` route. The login page utilizes the `Auth` component from `@supabase/auth-ui-react`, allowing users to sign in using either their email address and password or through Google OAuth. Supabase handles the authentication process. If a user attempts to access a protected route (like `/prototypes/*` or `/overview`) without being authenticated, the middleware automatically redirects them to the `/login` page.

## Main Dashboard, Overview, and Prototype Access
Upon successful authentication, the user's experience depends on their email address:
- **`@sensay.io` Users:** Are typically redirected to the root (`/`) or their intended protected route. They see a dual-pane layout. On the left, a persistent vertical sidebar lists the seven prototype ideas, highlighting the active selection. The main content area on the right dynamically displays the UI for the chosen prototype or the home page content if at the root.
- **Non-`@sensay.io` Users:** Are allowed access to the root (`/`) and the `/overview` page. If they attempt to access any page under `/prototypes/*`, the middleware redirects them to `/overview`. The sidebar containing prototype links is **not** displayed for these users.

This controlled access ensures internal prototypes remain accessible only to the intended audience while providing a general overview for other authenticated users.

## Detailed Feature Flows and Page Transitions
Navigation between pages is managed by Next.js routing, supplemented by middleware for authorization control:
- **Middleware Logic:**
    - Unauthenticated access to protected routes (`/prototypes/*`, `/overview`) redirects to `/login`.
    - Authenticated access attempts to `/login` redirect to `/`.
    - Authenticated non-`@sensay.io` users accessing `/prototypes/*` redirect to `/overview`.
- **Prototype Navigation (`@sensay.io` users only):** Selecting a prototype from the sidebar updates the main content area to show its detailed interface. Transitions are handled client-side by Next.js, maintaining the layout consistency with the fixed sidebar.
- **Prototype Interactions:** Within each prototype view (Replica Task Memory, Pure Voice, MCP Client/Server, Token-Gated Memories, Token-Guided Evolution, Bonding Replicas, Chatroom), interactions are simulated client-side as previously described (e.g., sending messages, clicking mock buttons, viewing simulated results). The core user flow involves selecting a prototype and interacting with its specific mock UI elements.

## Error States and Alternate Paths
Application flow control primarily relies on redirects enforced by the middleware for authentication and authorization:
- **Invalid Login:** Handled by the Supabase Auth UI, displaying relevant error messages below the form fields.
- **Unauthorized Access:** Users attempting to access pages they are not permitted to view (based on authentication status or email domain) are automatically redirected by the middleware to the appropriate page (`/login` or `/overview`). This prevents users from landing on pages with content they shouldn't see.
- **API/Interaction Errors:** Within the prototypes themselves (which are primarily mockups), errors like simulated API failures might display inline messages, but systemic navigation errors related to auth/authz are handled via redirects.

## Conclusion and Overall App Journey
From beginning to end, the application provides a seamless journey that starts at the landing page with clear options for sign up and login using Supabase Auth. Once authenticated, users enter a centralized dashboard where a persistent vertical sidebar helps them navigate between seven distinct prototype views. Whether interacting with a conversation interface in the Replica Task Memory feature, simulating a voice interaction in Pure Voice, processing data in the MCP workflow, or engaging in token simulations through unlocking memories, evolving replicas, or bonding interactions, every user action is met with clear, real-time visual feedback. Overall, the design ensures that users, judges, developers, and potential collaborators alike can easily understand the functionality of each prototype as they explore the integrated and consistent interface built for the Sensay Hackathon.