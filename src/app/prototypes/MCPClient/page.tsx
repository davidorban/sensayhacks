"use client";
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";   
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 

const MCPClientPage = () => {
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
        <li>Register Sensay API endpoints as "tools" that can be invoked via MCP</li>
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
      <p>Here's how a Sensay API endpoint could be defined as an MCP tool:</p>
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
        <li><strong>Memory Management</strong>: <code>manage_memory</code> - Interact with a replica's knowledge/memory</li>
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
        "content": "What&apos;s your experience with memory care?"
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

      <h3>10. Benefits for Developers</h3>
      <ul>
        <li><strong>Simplified Integration</strong>: One consistent interface for all Sensay capabilities</li>
        <li><strong>Composability</strong>: Chain operations without multiple API calls</li>
        <li><strong>Contextual Awareness</strong>: MCP maintains state between commands</li>
        <li><strong>Cross-platform Consistency</strong>: Same MCP protocol works in any environment</li>
      </ul>
      <p>This approach would make Sensay's powerful replica capabilities more accessible through the MCP paradigm while maintaining the robustness of the existing API infrastructure.</p>
      {/* Test escapes: &apos; &quot; */}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6 text-gray-100"> {/* Ensure text color contrasts with bg */}
      <h1 className="text-3xl font-bold mb-4 text-center">MCP Client Prototype</h1> {/* Centered Title */}

      <Card className="mb-6 bg-card border"> {/* Use Shadcn theme variables */}
        <CardHeader>
            <CardTitle className="text-xl text-card-foreground">MCP Implementation Concept for Sensay</CardTitle> {/* Use Shadcn theme variable */}
        </CardHeader>
        <CardContent>
            <DescriptionContent />
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-6">

        <Card className="flex-1 bg-white text-gray-900"> 
          <CardHeader>
            <CardTitle>Invoke MCP Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="toolName" className="block text-sm font-medium text-gray-700 mb-1">Tool Name:</label>
                <Input
                  type="text"
                  id="toolName"
                  value={toolName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToolName(e.target.value)}
                  placeholder='e.g., github.create_issue'
                  className="text-black" // Ensure input text is visible
                />
              </div>
              <div>
                <label htmlFor="inputData" className="block text-sm font-medium text-gray-700 mb-1">Input Data (JSON):</label>
                <Textarea
                  id="inputData"
                  rows={8} // Adjusted rows
                  value={inputData}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputData(e.target.value)}
                  placeholder='{ &quot;owner&quot;: &quot;octocat&quot;, &quot;repo&quot;: &quot;Spoon-Knife&quot;, &quot;title&quot;: &quot;New Issue Title&quot; }'
                  className="font-mono text-sm text-black" // Ensure textarea text is visible
                />
              </div>
              <Button
                onClick={handleTriggerMcp}
                disabled={isLoading}
                className="w-full" 
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  'Invoke Tool'
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">(Note: Interactions are simulated locally via `/api/mcp`)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-gray-50 text-gray-900"> 
          <CardHeader>
            <CardTitle>MCP Output</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[200px]"> 
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                <p className="ml-2 text-gray-500 italic">Processing request...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
              </div>
            )}
            {responseString !== null && !isLoading && !error && (
              <pre className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 overflow-x-auto max-h-[400px]"> 
                <code>{responseString}</code>
              </pre>
            )}
            {!isLoading && responseString === null && !error && (
               <p className="text-gray-500 italic text-center pt-10">Output will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MCPClientPage;
