"use client";
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";   
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 

const MCPPage = () => {
  const [toolName, setToolName] = useState<string>('sensay.natural_language_query'); 
  const [inputData, setInputData] = useState<string>('{\n  "query": "Who are the managers with the most popular Replicas in our organization?",\n  "max_results": 5,\n  "include_sources": true\n}'); 
  // Keeping apiKey state for future implementation
  const [, ] = useState<string>(''); 
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

    try {
      // Parse input data for validation only
      JSON.parse(inputData);
      
      // Simulate a response for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example response for natural language query about Replica managers
      const mockResponse = {
        "results": [
          {
            "title": "Sarah Johnson - Product Team",
            "summary": "Manages 8 Replicas with a combined total of 12,450 monthly active users. Most popular Replica: 'ProductGuru' with 4,200 MAU.",
            "source": "Sensay Analytics Dashboard, March 2025"
          },
          {
            "title": "Michael Chen - Customer Success",
            "summary": "Manages 5 Replicas with a combined total of 9,875 monthly active users. Most popular Replica: 'SupportHelper' with 3,750 MAU.",
            "source": "Replica Performance Report, Q1 2025"
          },
          {
            "title": "Aisha Patel - Marketing",
            "summary": "Manages 6 Replicas with a combined total of 8,320 monthly active users. Most popular Replica: 'CampaignAssistant' with 2,900 MAU.",
            "source": "Department KPI Metrics, March 2025"
          },
          {
            "title": "David Rodriguez - Engineering",
            "summary": "Manages 4 Replicas with a combined total of 7,150 monthly active users. Most popular Replica: 'CodeReviewer' with 2,600 MAU.",
            "source": "Engineering Team Dashboard, Q1 2025"
          },
          {
            "title": "Emma Wilson - HR",
            "summary": "Manages 3 Replicas with a combined total of 5,280 monthly active users. Most popular Replica: 'OnboardingGuide' with 2,450 MAU.",
            "source": "HR Analytics Report, March 2025"
          }
        ],
        "metadata": {
          "query_processed": "managers with most popular replicas organization ranking",
          "total_results_available": 18,
          "processing_time_ms": 287
        }
      };
      
      setResponseString(JSON.stringify(mockResponse, null, 2));
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
        A prototype interface to interact with the Sensay API through natural language using the Model Context Protocol.
        See <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">modelcontextprotocol.io</a> and the
        <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">TypeScript SDK</a> for details.
        For a detailed explanation of the MCP concept and its implementation for Sensay, visit the <a href="/prototypes/MCP-Concept" className="text-blue-600 hover:underline">MCP Concept</a> page.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Natural Language MCP Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="toolName" className="block text-sm font-medium text-gray-700 mb-1">Tool Name:</label>
                <Input
                  id="toolName"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder='e.g., sensay.natural_language_query'
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
                  placeholder='{ "query": "Who are the managers with the most popular Replicas?", "max_results": 5 }'
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
              <p className="text-gray-500 italic">Processing natural language query...</p>
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
              <p className="text-gray-500 italic">Results will appear here after processing your natural language query.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="mt-6 text-sm text-gray-400 text-center">
        (Note: This is a demonstration of how LLMs can use MCP to interact with the Sensay API through natural language.)
      </p>
    </div>
  );
};

export default MCPPage;
