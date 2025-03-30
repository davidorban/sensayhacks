"use client";
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const MCPConceptPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading time for the content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Model Context Protocol (MCP) Concept</h1>
      <p className="mb-6 text-sm text-gray-300">
        Understanding the Model Context Protocol and its applications for Sensay.
      </p>

      <Card className="bg-white shadow-lg flex-1 overflow-auto">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-gray-600">Loading concept description...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-indigo-800 mt-0 mb-4">MCP for Sensay: Implementation Concept</h2>
              <p className="my-3">Looking at the Sensay API specification and considering Anthropic's MCP approach, here's how we could implement an MCP interface for Sensay:</p>
              
              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">1. MCP Client/Server Architecture</h3>
              <p className="my-2">The MCP implementation would consist of:</p>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li><strong>MCP Server</strong>: A middleware layer that sits between client applications and the Sensay API</li>
                <li><strong>MCP Client</strong>: Libraries for different languages that developers can use to interact with Sensay through the MCP protocol</li>
              </ul>

              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">2. Core Components</h3>
              <p className="my-2"><strong>MCP Protocol Definition</strong>:</p>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li>Define a structured JSON schema for MCP messages to/from Sensay</li>
                <li>Messages would include: action type, parameters, authentication tokens, and metadata</li>
              </ul>
              <p className="my-2"><strong>Tool Registry</strong>:</p>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li>Register Sensay API endpoints as "tools" that can be invoked via MCP</li>
                <li>Map Sensay endpoints to tool definitions with parameters and expected responses</li>
              </ul>
              <p className="my-2"><strong>Execution Engine</strong>:</p>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li>Handles routing MCP commands to appropriate Sensay API endpoints</li>
                <li>Manages authentication token handling and session persistence</li>
              </ul>

              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">3. Message Flow</h3>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto my-3">
                <code>{`Client App → MCP Client → MCP Server → Sensay API
                                     ↓
Client App ← MCP Client ← MCP Server ← Sensay API`}</code>
              </pre>

              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">4. Tool Definition Example</h3>
              <p className="my-2">Here's how a Sensay API endpoint could be defined as an MCP tool:</p>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto my-3">
                <code className="language-json">{`{
  "tool_name": "replica_chat_completion",
  "description": "Get a completion response from a replica",
  "parameters": {
    "replicaUUID": {
      "type": "string",
      "format": "uuid",
      "description": "The UUID of the replica to chat with"
    },
    "content": {
      "type": "string",
      "description": "Message content to send to the replica"
    },
    "source": {
      "type": "string",
      "enum": ["discord", "telegram", "embed", "web", "telegram_autopilot"],
      "default": "web"
    },
    "skip_chat_history": {
      "type": "boolean",
      "default": false
    }
  },
  "returns": {
    "content": {
      "type": "string",
      "description": "The replica's response"
    }
  },
  "endpoint": "/v1/replicas/{replicaUUID}/chat/completions"
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">5. Authentication Integration</h3>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li>MCP sessions would maintain Sensay authentication (JWT or Organization Service Token)</li>
                <li>Security layer would handle token refresh and validation</li>
              </ul>

              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">6. Specialized MCP Commands for Sensay</h3>
              <p className="my-2">Beyond simple API mapping, we could add Sensay-specific MCP commands:</p>
              <ol className="list-decimal pl-6 my-2 space-y-1">
                <li><strong>Replica Discovery</strong>: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">find_replica</code> - Search for replicas by tags, name, or other criteria</li>
                <li><strong>Multi-Replica Chat</strong>: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">start_group_chat</code> - Initiate a conversation with multiple replicas</li>
                <li><strong>Memory Management</strong>: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">manage_memory</code> - Interact with a replica's knowledge/memory</li>
                <li><strong>Content Generation Pipeline</strong>: Chain multiple Sensay API calls in a single MCP command</li>
              </ol>

              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">7. Sample MCP Request</h3>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto my-3">
                <code className="language-json">{`{
  "command": "execute_tool",
  "tool": "replica_chat_completion",
  "parameters": {
    "replicaUUID": "03db5651-cb61-4bdf-9ef0-89561f7c9c53",
    "content": "How can you help me with dementia care?",
    "source": "web"
  },
  "auth": {
    "type": "bearer",
    "token": "jwt_token_here"
  }
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">8. Chain of Tools Example</h3>
              <p className="my-2">One powerful MCP feature would be chaining Sensay operations:</p>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto my-3">
                <code className="language-json">{`{
  "command": "execute_chain",
  "chain": [
    {
      "tool": "find_replica",
      "parameters": { "tags": ["Healthcare", "Dementia"] },
      "output_map": { "items[0].uuid": "replicaUUID" }
    },
    {
      "tool": "replica_chat_completion",
      "parameters": {
        "replicaUUID": "\${replicaUUID}",
        "content": "What's your experience with memory care?"
      },
      "output_map": { "content": "response" }
    },
    {
      "tool": "summarize_response",
      "parameters": { "text": "\${response}" }
    }
  ]
}`}</code>
              </pre>

              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">9. Implementation Phases</h3>
              <ol className="list-decimal pl-6 my-2 space-y-1">
                <li><strong>Core API Mapping</strong>: Basic translation of REST endpoints to MCP tools</li>
                <li><strong>Extended Capabilities</strong>: Add Sensay-specific MCP commands and chaining</li>
                <li><strong>SDK Development</strong>: Create language-specific clients (JavaScript, Python, etc.)</li>
                <li><strong>Plugin System</strong>: Allow third-party extensions to the MCP toolset</li>
              </ol>

              <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">10. Benefits for Developers</h3>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li><strong>Simplified Integration</strong>: One consistent interface for all Sensay capabilities</li>
                <li><strong>Composability</strong>: Chain operations without multiple API calls</li>
                <li><strong>Contextual Awareness</strong>: MCP maintains state between commands</li>
                <li><strong>Cross-platform Consistency</strong>: Same MCP protocol works in any environment</li>
              </ul>
              
              <p className="my-3">This approach would make Sensay's powerful replica capabilities more accessible through the MCP paradigm while maintaining the robustness of the existing API infrastructure.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MCPConceptPage;
