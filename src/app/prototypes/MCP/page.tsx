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

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Model Context Protocol (MCP) Prototype</h1>
      <p className="mb-6 text-sm text-gray-300">
        A prototype interface to interact with tools via the Model Context Protocol.
        See <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">modelcontextprotocol.io</a> and the
        <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">TypeScript SDK</a> for details.
        For a detailed explanation of the MCP concept and its implementation for Sensay, visit the <a href="/prototypes/MCP-Concept" className="text-blue-600 hover:underline">MCP Concept</a> page.
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

      <p className="mt-6 text-sm text-gray-400 text-center">
        (Note: Interactions are simulated locally.)
      </p>
    </div>
  );
};

export default MCPPage;
