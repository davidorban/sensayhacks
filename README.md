# Sensay Hackathon Ideas Showcase

This project showcases various UI prototypes for potential Sensay features, built using Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Project Structure

- `src/app/`: Main application routes and pages.
  - `layout.tsx`: Root layout, includes the sidebar.
  - `page.tsx`: Main dashboard page.
  - `prototypes/`: Contains individual pages for each prototype idea.
- `src/components/`: Reusable React components (e.g., `Sidebar.tsx`).
- `public/`: Static assets.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `next.config.mjs`: Next.js configuration.
- `tsconfig.json`: TypeScript configuration.
- `package.json`: Project dependencies and scripts.

## Getting Started

1.  **Clone the repository (if applicable).**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Implemented Prototypes

The application includes the following mock UI prototypes accessible via the sidebar:

1.  **Replica Task Memory:**
    - **Concept:** A chat interface where a user interacts with a replica that can manage a simple task list based on the conversation.
    - **Features:** Displays chat history, allows sending messages, simulates replica responses, shows a task list, allows marking tasks as complete/incomplete, simulates adding tasks via chat command (e.g., "add task buy milk").
    - **File:** `src/app/prototypes/ReplicaTaskMemory/page.tsx`

2.  **Pure Voice:**
    - **Concept:** A minimal interface demonstrating a voice-only interaction flow.
    - **Features:** A single button to start/stop listening (mocked), displays a mock transcript of user speech and potential replica response.
    - **File:** `src/app/prototypes/PureVoice/page.tsx`

3.  **MCP Client/Server:**
    - **Concept:** Simulates a UI triggering a backend Micro-process Controller (MCP) with input data and displaying the processed output.
    - **Features:** Text area for input (e.g., JSON), button to trigger the mock MCP call, loading state during simulation, displays mock JSON output.
    - **File:** `src/app/prototypes/MCPClient/page.tsx`

4.  **Token-Gated Memories:**
    - **Concept:** Demonstrates accessing exclusive content (memories) by requiring a mock payment/unlock using $SNSY tokens.
    - **Features:** Shows locked/unlocked status with icons/colors, provides a button to simulate unlocking with $SNSY (includes loading state), displays mock exclusive content when unlocked.
    - **File:** `src/app/prototypes/TokenGatedMemories/page.tsx`

5.  **Token-Guided Evolution:**
    - **Concept:** Allows a user to guide the development or "evolution" of a digital entity (e.g., AI persona) by spending $SNSY tokens.
    - **Features:** Displays the current evolution stage/state of the entity, lists available evolution paths with mock $SNSY costs, provides buttons to trigger evolution (includes loading state and confirmation).
    - **File:** `src/app/prototypes/TokenGuidedEvolution/page.tsx`

6.  **Bonding Replicas:**
    - **Concept:** Simulates the idea of two or more replica instances "bonding" to share memory, state, or insights.
    - **Features:** Toggle button to switch between bonded/unbonded states (with visual cues like icons/colors), displays a mock shared memory pool when bonded.
    - **File:** `src/app/prototypes/BondingReplicas/page.tsx`

7.  **Chatroom:**
    - **Concept:** A chat interface allowing interaction with multiple selected replicas simultaneously.
    - **Features:** Allows selecting/deselecting available mock replicas, displays chat messages differentiated by sender (User vs. different Replicas) using distinct colors/styles, input field for sending messages to selected replicas.
    - **File:** `src/app/prototypes/Chatroom/page.tsx`

## Notes

- All interactions involving backend processes, token transactions, voice processing, or actual AI responses are **simulated** within the frontend for demonstration purposes.
- Styling is done primarily using Tailwind CSS.
