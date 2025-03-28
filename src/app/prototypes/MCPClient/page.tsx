"use client";
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface McpOutput {
  status: string;
  data: Record<string, unknown>;
}

const MCPClientPage = () => {
  const [toolName, setToolName] = useState<string>(''); // Name of the MCP tool to invoke
  const [inputData, setInputData] = useState<string>(''); // Input data for the tool (as JSON string)
  const [apiKey, setApiKey] = useState<string>(''); // Placeholder for potential MCP auth/config
  const [response, setResponse] = useState<unknown | null>(null); // Store MCP response
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle triggering the MCP tool invocation via the backend
  const handleTriggerMcp = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    if (!toolName || !inputData) {
      setError('Tool Name and Input Data cannot be empty.');
      setIsLoading(false);
      return;
    }

    let parsedInputData: object;
    try {
      parsedInputData = JSON.parse(inputData);
    } catch (parseError) {
      setError('Invalid JSON in Input Data.');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Update API endpoint and request structure if necessary
      const apiResponse = await fetch('/api/mcp', { // Assuming a backend route at /api/mcp
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MCP-Auth': apiKey, // Example auth header, adjust based on actual MCP SDK needs
        },
        body: JSON.stringify({
          toolName: toolName,
          inputData: parsedInputData,
        }),
      });

      const data = await apiResponse.json();
      setResponse(data);
    } catch (error) {
      setError('Failed to invoke MCP tool.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> 
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Model Context Protocol (MCP) Client Prototype</h1> 
      <p className="mb-6 text-sm text-gray-300"> 
        A prototype interface to interact with tools via the Model Context Protocol.
        See <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">modelcontextprotocol.io</a> and the
        <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">TypeScript SDK</a> for details.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-lg flex-1 flex flex-col">

        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"> 
          <label htmlFor="toolName" className="block text-sm font-medium text-gray-700 mb-2">Tool Name:</label>
          <input
            type="text"
            id="toolName"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            placeholder='e.g., github.create_issue'
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2 text-black"
          />

          <label htmlFor="inputData" className="block text-sm font-medium text-gray-700 mb-2">Input Data (JSON):</label>
          <textarea
            id="inputData"
            rows={10}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder='{ "owner": "octocat", "repo": "Spoon-Knife", "title": "New Issue Title" }'
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-black"
          />
          <button
            onClick={handleTriggerMcp}
            disabled={isLoading}
            className={`mt-3 w-full px-4 py-2 rounded-md text-white font-semibold transition-colors flex items-center justify-center
              ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Processing...
              </>
            ) : (
              'Invoke Tool'
            )}
          </button>
        </div>

        <div className="flex-1 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm min-h-[120px]"> 
          <h2 className="text-lg font-semibold mb-2 text-gray-800">MCP Output:</h2>
          {isLoading && (
            <p className="text-gray-500 italic">Processing request...</p>
          )}
          {response && (
            <pre className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 overflow-x-auto"><code>{JSON.stringify(response, null, 2)}</code></pre>
          )} 
          {!isLoading && !response && (
             <p className="text-gray-500 italic">Output will appear here after invoking MCP tool.</p>
          )}
        </div>
        
        <p className="mt-6 text-sm text-gray-500"> 
          (Note: Interactions are simulated locally.)
        </p>
      </div>
    </div>
  );
};

export default MCPClientPage;
