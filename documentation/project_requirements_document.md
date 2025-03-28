# Project Requirements Document (PRD) for Sensay Hackathon Ideas Showcase UI

## 1. Project Overview

This project is a simple web application designed to showcase seven prototype features built with the Sensay API during the hackathon. The application provides a single, navigable interface where users can log in, switch between various demonstration views, and see simulated interactions like text chat, voice interactions, token-based actions, and more. It is intended to give hackathon judges and collaborators a clear demonstration of the core functionalities that could later be expanded into full products.

The main purpose of building this prototype is to rapidly demonstrate core ideas and user interactions in a visually coherent and easy-to-navigate interface. The core objectives include a smooth authentication process, a persistent vertical sidebar for easy navigation, and clear displays of simulated interactions for each prototype. Success will be measured by how well the UI presents each prototype, how easily users can navigate between features, and the overall ability to deploy the demo using a shared backend on Vercel.

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**

*   User authentication (sign up, log in, log out) using Supabase Auth.

*   A persistent vertical navigation sidebar listing the seven prototype ideas.

*   A dynamic main content area that updates when switching between prototype views.

*   Basic UI controls (buttons, text inputs, display areas) that trigger and display core functionalities.

*   Text-based conversation display for the Replica Task Memory feature including messages with timestamps and sender labels.

*   Mock implementations for:

    *   Pure Voice interaction (simulated voice chat via button and placeholder text).
    *   Token-Gated Memories (displaying locked memories and a mock unlock button).
    *   Token-Guided Evolution (display of a replica's level and evolution via mock $SNSY payment).
    *   Bonding Replicas (toggle bonding status that updates UI and affects subsequent chat interactions).

*   A chatroom feature demonstrating multi-replica interactions with clear visual distinctions.

*   Deployment as a single Next.js application on Vercel utilizing Supabase for data storage.

*   Use of Windsurf for generating UI components to speed up development.

**Out-of-Scope:**

*   Pixel-perfect or highly polished UI/UX design.
*   Advanced error handling or management of complex edge cases.
*   Complex state management beyond standard React capabilities.
*   Full integration with real Web3 wallets, blockchain transactions, or telephony.
*   Comprehensive automated testing.
*   Mobile responsiveness with a mobile-first design focus.
*   Advanced user management beyond basic authentication functionalities.

## 3. User Flow

When a new user visits the application, they are greeted with a clean landing screen that offers simple options to either sign in or sign up using email and password through Supabase Auth. Once authenticated, the user is transitioned from the public landing page to the main application view, where they see a persistent vertical sidebar on the left. The sidebar lists all seven prototype ideas, and the active selection is clearly highlighted.

Upon selecting a prototype from the sidebar, the main content area on the right dynamically updates to show the specific UI for that feature. For example, selecting the "Replica Task Memory" view displays a chat interface with a text input, send button, conversation history, and a separate task list. Throughout the application, any action such as clicking a button (for instance, to trigger a mock voice interaction or token-based action) prompts interactive feedback like loading spinners or confirmation messages. This ensures that users always know what process is running and see immediate updates to the interface.

## 4. Core Features (Bullet Points)

*   **User Authentication:**

    *   Sign up using email and password via Supabase Auth.
    *   Log in with existing credentials.
    *   Seamless logout functionality.

*   **Persistent Navigation:**

    *   A vertical sidebar that remains visible at all times.
    *   Lists links to all seven prototype ideas.
    *   Highlights the currently active prototype view.

*   **Replica Task Memory:**

    *   Text input for user messages.
    *   "Send" button to submit messages.
    *   Display of conversation history with timestamps and sender labels.
    *   A dedicated area showing a list of tasks identified during the conversation.

*   **Pure Voice Simulation:**

    *   A prominent button labeled “Start Mock Voice Interaction.”
    *   Placeholder text or simple text-based chat mimicking a voice-driven process.
    *   Visual cues indicating that this feature is a simulated (mock) representation.

*   **MCP Client/Server Workflow:**

    *   A form with input fields (e.g., Source Data ID, Process Type, Priority Level).
    *   A “Process Request” button to trigger the workflow.
    *   Structured output displayed in a table or detailed report format with status indicators.

*   **Token-Gated Memories:**

    *   Display of replica memories with some marked as "Locked - Requires Mock $SNSY."
    *   "Unlock (Mock)" button which, when clicked, simulates a payment and reveals the memory content.
    *   Clear visual distinction between locked and unlocked states.

*   **Token-Guided Evolution:**

    *   Display showing the replica’s current evolution level.
    *   "Evolve (Mock $SNSY Payment)" button that triggers simulated token payment and evolves the replica.
    *   Updated display showing new evolution level and mock NFT details.

*   **Bonding Replicas:**

    *   Display of current bonding status (e.g., "Not Bonded" or "Bonded with [User/Replica B]").
    *   "Toggle Mock Bond" button to simulate bonding status change.
    *   Chat interface updates reflecting changes in replica responses post-bonding (with visual indication of simulation).

*   **Chatroom Feature:**

    *   Selection or presentation of predefined replicas to participate in chat.
    *   Ability to enter an initial seed prompt/message.
    *   Start button that triggers the chat orchestration.
    *   Display of conversation transcript with clear differentiation (colors, icons, labels) for each replica.

*   **Interactive Feedback Elements:**

    *   Use of loading spinners, progress bars, and explicit "(Mock)" labels on simulated actions.
    *   Visual indicators during asynchronous operations like API calls.

## 5. Tech Stack & Tools

*   **Frontend Framework:** Next.js built with React and TypeScript.

*   **Backend & Authentication:** Supabase (using Supabase Auth and PostgreSQL for data storage).

*   **Deployment:** Vercel for hosting the Next.js application.

*   **UI Component Generation:** Windsurf to generate modern, consistent UI components quickly.

*   **External APIs & Integrations:**

    *   Sensay API for interacting with the backend functionalities.
    *   Mock implementations for Web3 (token payment simulation) and telephony.

*   **AI Models & Libraries:**

    *   Claude 3.7 Sonnet by Anthropic for any advanced reasoning tasks.
    *   GPT 4o by OpenAI for code-specific operations and assistance.

*   **Development Tools & Plugins:**

    *   IDE integrations such as Cursor and Windsurf plugins for improved development workflow.

## 6. Non-Functional Requirements

*   **Performance:** The application should load quickly on desktop browsers with minimal delays when switching between prototype views.
*   **Security:** All sensitive data (e.g., environment variables for Sensay API and Supabase credentials) must be securely managed and not hardcoded in the codebase.
*   **Usability:** The UI must be simple, clear, and intuitive, with appropriate visual cues (like buttons, loading indicators, and labels) to guide the user.
*   **Compatibility:** While primarily designed for desktop, code should be modular enough to allow future enhancements, including more mobile-friendly versions.
*   **Feedback Timeliness:** Interactive feedback (such as loading indicators) should not exceed a couple of seconds of delay in reflecting state changes.

## 7. Constraints & Assumptions

*   The design and interactions are focused solely on desktop views for this hackathon demo.
*   All mock implementations (Web3, telephony, etc.) are clearly separated from potential future production logic.
*   It is assumed that all authenticated users will have the same level of access with no role-based permissions.
*   Environment variables (SENSAY_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY) must be pre-configured and securely managed, especially for Vercel deployment.
*   The usage of Windsurf-generated components is assumed to help ensure consistency, but custom styling tweaks might be necessary.

## 8. Known Issues & Potential Pitfalls

*   **API Rate Limits:** When interacting with third-party services like Sensay API, ensure that rate limits are respected to avoid performance issues.
*   **Mock vs. Real Implementation:** There is a risk of confusion between simulated (mock) actions and production behavior. Clear visual indications and labels such as "(Mock)" must be used throughout to avoid misunderstandings.
*   **State Synchronization:** Maintaining consistent state across different prototype views may be challenging, especially when simulating token charges or bonding effects. Use clear state management patterns within React to mitigate this.
*   **Error Handling:** Advanced error handling and validations are out-of-scope for the initial prototype. Developers should include basic error messages but be prepared for more robust handling in future iterations.
*   **Deployment Issues:** Environment misconfigurations (missing or incorrect environment variables) could lead to runtime errors on Vercel. Double-check the deployment settings and secure storage of credentials.
*   **Limited Testing:** Comprehensive automated testing is not part of this initial scope. Manual testing must be thorough during the hackathon to catch any glaring issues.

This PRD provides a clear, structured, and detailed guide to build the Sensay Hackathon Ideas Showcase UI. All subsequent technical documents (tech stack, frontend guidelines, backend architecture, etc.) should refer back to this document for context and clarity.
