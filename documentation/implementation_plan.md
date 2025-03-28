# Implementation plan

## Phase 1: Environment Setup

1. Install Node.js (if not already installed) and initialize a new Next.js project using Next.js 14 (Note: Next.js 14 is required for best compatibility with current AI coding tools and LLM models) as per the Tech Stack requirements. (Reference: Tech Stack, Technical)
2. Create the project directory structure with folders `/pages`, `/components`, `/services`, and `/styles` to organize code. (Reference: Project Requirements: Technical)
3. Configure TypeScript for the project by adding a `tsconfig.json` at the project root. (Reference: Tech Stack)
4. **Validation**: Run `npm run dev` to confirm the Next.js development server starts without errors.

## Phase 2: Frontend Development

5. Create a persistent vertical sidebar component at `/components/Sidebar.tsx` that enables navigation between the 7 prototype ideas. (Reference: Project Requirements: Navigation)
6. In `/pages/_app.tsx`, import and include the Sidebar so that it persists across all pages. (Reference: Project Requirements: Navigation, UI/UX)
7. Create a main page at `/pages/index.tsx` that displays an introductory dashboard and a list of the 7 prototype ideas. (Reference: Project Requirements: Core Functionality)
8. Generate separate Next.js pages or dynamic routes for each prototype idea under `/pages/prototypes/`:
   - Replica Task Memory (`ReplicaTaskMemory.tsx`)
   - Pure Voice (`PureVoice.tsx`)
   - MCP Client/Server (`MCPClient.tsx`)
   - Token-Gated Memories (`TokenGatedMemories.tsx`)
   - Token-Guided Evolution (`TokenGuidedEvolution.tsx`)
   - Bonding Replicas (`BondingReplicas.tsx`)
   - Chatroom (`Chatroom.tsx`)
   (Reference: Project Requirements: Individual Prototype Functionality)
9. For each prototype page, implement a basic user interface using Windsurf-generated components to ensure speed and consistency. For example, in `/components/prototypes/ReplicaTaskMemory.tsx`, include a chat area, chronological message display, and a task list. (Reference: Project Requirements: UI/UX & Prototype Functionality)
10. In the Pure Voice component (`/components/prototypes/PureVoice.tsx`), add a button that initiates a mocked voice interaction and include placeholder text clearly marked as "(Mock)". (Reference: Project Requirements: Pure Voice)
11. In the MCP Client/Server component (`/components/prototypes/MCPClient.tsx`), implement input fields to accept data points and a button to simulate triggering the MCP, displaying structured output. (Reference: Project Requirements: MCP Client/Server)
12. For Token-Gated Memories (`/components/prototypes/TokenGatedMemories.tsx`) and Token-Guided Evolution (`/components/prototypes/TokenGuidedEvolution.tsx`), add UI elements that show locked/unlocked states and include a mock $SNSY unlock/payment button respectively, with visual cues like loading spinners or confirmation messages. (Reference: Project Requirements: Token-Gated Memories, Token-Guided Evolution)
13. In Bonding Replicas (`/components/prototypes/BondingReplicas.tsx`), implement a toggle for bonding status along with associated updates in the UI and a note indicating that the interactions are mocked. (Reference: Project Requirements: Bonding Replicas)
14. In the Chatroom component (`/components/prototypes/Chatroom.tsx`), allow selection of multiple replicas and display a conversation transcript. Differentiate messages by text alignment, background color, timestamps, and sender labels. (Reference: Project Requirements: Chatroom)
15. Add loading indicators in all components where asynchronous operations (even if simulated) occur. (Reference: Project Requirements: UI/UX)
16. **Validation**: Run `npm run dev` and manually verify that each prototype page is accessible via the sidebar and displays its intended mocked interface.

## Phase 3: Backend Development

17. Create Next.js API routes under `/pages/api/` to serve as mocked back-end endpoints. For example, add `/pages/api/sensay/mockData.ts` which returns dummy data for simulated Sensay API interactions. (Reference: Project Requirements: Technical, Mock Implementations)
18. Use Next.js API routes to process interactions triggered from the prototype pages (e.g., simulate sending data for the MCP Client/Server or chat messages for Replica Task Memory). (Reference: Project Requirements: Individual Prototype Functionality)
19. Create a service module at `/services/api.ts` to abstract API calls from the frontend to these endpoints. (Reference: Project Requirements: Technical)
20. Configure serverless function behavior and add comments to ensure any Web3 and Telephony logic remains clearly marked as mock. (Reference: Project Requirements: Out of Scope)
21. **Validation**: Use `curl` or browser testing to request `/api/sensay/mockData` and verify the dummy data is returned correctly.

## Phase 4: Integration

22. Set up Supabase Auth in the project by installing the Supabase client package and creating `/services/auth.ts` to manage user sign-up, login, and logout functions. (Reference: Project Requirements: Authentication, Tech Stack)
23. In the login and sign-up pages (create `/pages/login.tsx` and `/pages/signup.tsx`), integrate Supabase Auth flows using the functions from `/services/auth.ts`. (Reference: Project Requirements: Authentication)
24. Use environment variables for sensitive keys by creating a `.env.local` file at the project root containing SENSAY_API_KEY, SUPABASE_URL, and SUPABASE_ANON_KEY. (Reference: Project Requirements: Environment Variables)
25. Ensure that all API calls from the frontend use the service modules (`/services/auth.ts` and `/services/api.ts`) to interact with Supabase and Next.js API routes. (Reference: Project Requirements: Integration)
26. Connect each prototype page’s interactive elements (buttons, input fields) to their respective API endpoints through the service layer. (Reference: Project Requirements: Individual Prototype Functionality)
27. **Validation**: In the browser, simulate a full login flow, navigate through the sidebar to each prototype, and trigger interactions to verify API calls are correctly mocked.

## Phase 5: Deployment

28. Push the complete project code to your Git repository.
29. Configure Vercel integration by linking the repository to Vercel (Reference: Project Requirements: Deployment).
30. In the Vercel dashboard, securely set the environment variables SENSAY_API_KEY, SUPABASE_URL, and SUPABASE_ANON_KEY. (Reference: Project Requirements: Environment Variables)
31. Deploy the application to Vercel and verify that all static assets and API routes are working as expected. (Reference: Project Requirements: Deployment)
32. **Validation**: Access the production URL provided by Vercel, perform a test login, navigate through all prototype views, and confirm that the UI displays all mock functionalities correctly.

This step-by-step plan ensures that the Sensay Hackathon Ideas Showcase UI is implemented with clear separation between frontend and backend responsibilities, uses a modern stack with Next.js 14 and Supabase, and satisfies the required mock implementations and authentication flows outlined in the project requirements.