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
