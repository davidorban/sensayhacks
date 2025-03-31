# Sensay March 2025 Hackathon Prototypes

This repository contains a collection of innovative AI prototypes developed during the March 2025 Sensay internal hackathon. These prototypes explore cutting-edge concepts in AI interaction, memory management, and system evolution, showcasing the creative potential of Sensay's technology stack.

Each prototype was developed using Next.js 14 (App Router), TypeScript, and Tailwind CSS, demonstrating different aspects of Sensay's capabilities in areas such as chat interfaces, memory management, and replica interactions.

## Features

### Prototypes
- **Token-Gated Memories**: Blockchain-based access control for AI memories
- **Bonding Replicas**: Interconnected AI assistants with shared memory
- **Chatroom**: Multi-user chat interface with AI moderation (formerly Group Chat)
- **MCP**: Multi-Context Processing for complex task handling
- **PureVoice**: Voice-first interface for AI interactions
- **ReplicaTaskMemory**: Persistent task tracking for AI replicas
- **TokenGuidedEvolution**: AI system specialization using blockchain tokens

### Technical Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, Supabase
- **Authentication**: JWT-based authentication
- **Deployment**: Vercel
- **Testing**: Jest, Playwright

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx           # Main dashboard page
│   └── prototypes/         # Individual prototype pages
├── components/            # Reusable React components
│   └── ui/               # UI component library
├── lib/                  # Utility functions and configurations
├── middleware.ts         # API middleware
└── services/            # External service integrations
```

## Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd sensay-hacks
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_SENSAY_API_KEY=your_sensay_api_key
```

4. **Run the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Deployment

The project is deployed to Vercel. Push your changes to the main branch to trigger a deployment.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Sensay API Integration

This project includes integration with the Sensay API:

- **Environment Variables:**
  - `SENSAY_ORGANIZATION_SECRET`: API key for authenticating with the Sensay API (stored securely in Vercel)
  - `SENSAY_REPLICA_ID`: ID of the Sensay replica to communicate with (default: 16d38fcc-5cb0-4f94-9cee-3e8398ef4700)

- **API Routes:**
  - `/api/sensay-test/route.ts`: Test endpoint for verifying Sensay API connectivity
  - `/api/sensay/chat/route.ts`: Production endpoint for the Task Memory prototype

- **Test Page:**
  - `/sensay-test`: A test page for direct interaction with the Sensay API
  - Allows configuring user ID and replica ID for testing

## Next Steps

1. **Fix Task List Display Issue:**
   - Tasks are being detected and stored in Supabase but not appearing in the UI
   - Investigate the connection between the API response and the frontend task list rendering
   - Verify Supabase RLS policies and permissions

2. **Enhance Task Detection:**
   - Improve natural language understanding for task extraction
   - Add support for more task-related commands (e.g., rescheduling, prioritizing)

3. **Implement Task Sync:**
   - Add functionality to sync tasks with external calendars or task management systems

## Implemented Prototypes

The application includes the following UI prototypes accessible via the sidebar:

1.  **Replica Task Memory:**
    - **Concept:** A chat interface where a user interacts with a replica that can manage a simple task list based on the conversation.
    - **Features:** Displays chat history, allows sending messages, simulates replica responses, shows a task list, allows marking tasks as complete/incomplete, simulates adding tasks via chat command (e.g., "add task buy milk").
    - **File:** `src/app/prototypes/ReplicaTaskMemory/page.tsx`

2.  **Pure Voice:**
    - **Concept:** A minimal interface demonstrating a voice-only interaction flow.
    - **Features:** A single button to start/stop listening (mocked), displays a mock transcript of user speech and potential replica response.
    - **File:** `src/app/prototypes/PureVoice/page.tsx`

3.  **MCP Client/Server:**
    - **Concept:** Simulates a UI triggering a backend Model Control Protocol (MCP) with input data and displaying the processed output.
    - **Features:** Text area for input (e.g., JSON), button to trigger the mock MCP call, loading state during simulation, displays mock JSON output.
    - **File:** `src/app/prototypes/MCPClient/page.tsx`

4.  **Token-Gated Memories:**
    - **Concept:** A comprehensive token economy for accessing, evolving, and trading AI memories using $SNSY tokens.
    - **Features:** 
      - **Token Economy:** Purchase tokens, stake for rewards, spend on memories
      - **Tiered Access:** Public, Premium, Expert, and Exclusive memory tiers
      - **Memory Evolution:** Four evolutionary pathways (Analytical, Technical, Creative, Domain) with four stages each
      - **Capability Framework:** Each evolution stage unlocks new memory capabilities
      - **Memory Marketplace:** Discover and purchase new memories
      - **Time-Based Decay:** Memories lose freshness over time
      - **Transaction History:** Complete record of token transactions
    - **File:** `src/app/prototypes/TokenGatedMemories/page.tsx`
    - **Documentation:** `src/app/prototypes/TokenGatedMemories/README.md`

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
