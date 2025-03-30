"use client";
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";   
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 

const MCPPage = () => {
  const [toolName, setToolName] = useState<string>(''); 
  const [inputData, setInputData] = useState<string>(''); 
  const [apiKey, ] = useState<string>(''); 
  const [responseString, setResponseString] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTriggerMcp = async () => {
    setIsLoading(true);
    setError(null);
    setResponseString(null); 

    if (!toolName || !inputData) {
      setError('Tool Name and Input Data cannot be empty.');
      setIsLoading(false);
      return;
    }

    let parsedInputData: object;
    try {
      parsedInputData = JSON.parse(inputData);
    } catch {
      setError('Invalid JSON in Input Data.');
      setIsLoading(false);
      return;
    }

    try {
      const apiResponse = await fetch('/api/mcp', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MCP-Auth': apiKey, 
        },
        body: JSON.stringify({
          toolName: toolName,
          inputData: parsedInputData,
        }),
      });

      const data = await apiResponse.json();
      try {
        setResponseString(JSON.stringify(data, null, 2));
      } catch { 
        setError('Failed to stringify the response data.');
        setResponseString('[Error: Could not display response]');
      }
    } catch { 
      setError('Failed to invoke MCP tool.');
    } finally {
      setIsLoading(false);
    }
  };

  const DescriptionContent = () => (
    <div className="prose prose-invert max-w-none"> 
      <h2>MCP for Sensay: Implementation Concept</h2>
      <p>Looking at the Sensay API specification and considering Anthropic&apos;s MCP approach, here&apos;s how we could implement an MCP interface for Sensay:</p>
      
      <h3>1. MCP Client/Server Architecture</h3>
      <p>The MCP implementation would consist of:</p>
      <ul>
        <li><strong>MCP Server</strong>: A middleware layer that sits between client applications and the Sensay API</li>
        <li><strong>MCP Client</strong>: Libraries for different languages that developers can use to interact with Sensay through the MCP protocol</li>
      </ul>

      <h3>2. Core Components</h3>
      <p><strong>MCP Protocol Definition</strong>:</p>
      <ul>
        <li>Define a structured JSON schema for MCP messages to/from Sensay</li>
        <li>Messages would include: action type, parameters, authentication tokens, and metadata</li>
      </ul>
      <p><strong>Tool Registry</strong>:</p>
      <ul>
        <li>Register Sensay API endpoints as &quot;tools&quot; that can be invoked via MCP</li>
        <li>Map Sensay endpoints to tool definitions with parameters and expected responses</li>
      </ul>
      <p><strong>Execution Engine</strong>:</p>
      <ul>
        <li>Handles routing MCP commands to appropriate Sensay API endpoints</li>
        <li>Manages authentication token handling and session persistence</li>
      </ul>

      <h3>3. Message Flow</h3>
      <pre><code>{`Client App → MCP Client → MCP Server → Sensay API
                                     ↓
Client App ← MCP Client ← MCP Server ← Sensay API`}</code></pre>

      <h3>4. Tool Definition Example</h3>
      <p>Here&apos;s how a Sensay API endpoint could be defined as an MCP tool:</p>
      <pre><code className="language-json">{`{
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
}`}</code></pre>

      <h3>5. Authentication Integration</h3>
      <ul>
        <li>MCP sessions would maintain Sensay authentication (JWT or Organization Service Token)</li>
        <li>Security layer would handle token refresh and validation</li>
      </ul>

      <h3>6. Specialized MCP Commands for Sensay</h3>
      <p>Beyond simple API mapping, we could add Sensay-specific MCP commands:</p>
      <ol>
        <li><strong>Replica Discovery</strong>: <code>find_replica</code> - Search for replicas by tags, name, or other criteria</li>
        <li><strong>Multi-Replica Chat</strong>: <code>start_group_chat</code> - Initiate a conversation with multiple replicas</li>
        <li><strong>Memory Management</strong>: <code>manage_memory</code> - Interact with a replica&apos;s knowledge/memory</li>
        <li><strong>Content Generation Pipeline</strong>: Chain multiple Sensay API calls in a single MCP command</li>
      </ol>

      <h3>7. Sample MCP Request</h3>
      <pre><code className="language-json">{`{
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
}`}</code></pre>

      <h3>8. Chain of Tools Example</h3>
      <p>One powerful MCP feature would be chaining Sensay operations:</p>
      <pre><code className="language-json">{`{
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
}`}</code></pre>

      <h3>9. Implementation Phases</h3>
      <ol>
        <li><strong>Core API Mapping</strong>: Basic translation of REST endpoints to MCP tools</li>
        <li><strong>Extended Capabilities</strong>: Add Sensay-specific MCP commands and chaining</li>
        <li><strong>SDK Development</strong>: Create language-specific clients (JavaScript, Python, etc.)</li>
        <li><strong>Plugin System</strong>: Allow third-party extensions to the MCP toolset</li>
      </ol>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Model Context Protocol (MCP) Prototype</h1>
      <p className="mb-6 text-sm text-gray-300">
        A prototype interface to interact with tools via the Model Context Protocol.
        See <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">modelcontextprotocol.io</a> and the
        <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">TypeScript SDK</a> for details.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>MCP Tool Invocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="toolName" className="block text-sm font-medium text-gray-700 mb-1">Tool Name:</label>
                <Input
                  id="toolName"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder='e.g., github.create_issue'
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="inputData" className="block text-sm font-medium text-gray-700 mb-1">Input Data (JSON):</label>
                <Textarea
                  id="inputData"
                  rows={10}
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder='{ "owner": "octocat", "repo": "Spoon-Knife", "title": "New Issue Title" }'
                  className="w-full font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleTriggerMcp}
                disabled={isLoading}
                className="w-full"
                variant={isLoading ? "outline" : "default"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  'Invoke Tool'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>MCP Output</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <p className="text-gray-500 italic">Processing request...</p>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {responseString !== null && (
              <pre className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 overflow-x-auto">
                <code>{responseString}</code>
              </pre>
            )}
            {!isLoading && responseString === null && !error && (
              <p className="text-gray-500 italic">Output will appear here after invoking MCP tool.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-gray-800 text-white shadow-lg">
        <CardHeader>
          <CardTitle>MCP Concept</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionContent />
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-gray-400 text-center">
        (Note: Interactions are simulated locally.)
      </p>
    </div>
  );
};

export default MCPPage;
