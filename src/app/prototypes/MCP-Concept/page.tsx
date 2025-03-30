"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Code, Server, Zap } from 'lucide-react';

const MCPConceptPage = () => {
  const [isLoading] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Model Context Protocol (MCP) Concept</h1>
      <p className="mb-6 text-sm text-gray-300">
        Understanding the Model Context Protocol and its applications for Sensay.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Model Context Protocol</CardTitle>
            <CardDescription>
              A standardized approach for AI models to request and receive context
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="implementation">Implementation</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Core Concept</h3>
                <p>
                  The Model Context Protocol (MCP) is a standardized approach for AI models to request and receive context during inference. It enables models to dynamically request information they need, rather than requiring all context to be provided upfront.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Zap className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Dynamic Context</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Models request only the information they need, when they need it, reducing token usage and improving efficiency.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Server className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Standardized Protocol</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">A consistent interface for models to request context from external systems, regardless of the underlying implementation.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Code className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Tool Integration</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Enables seamless integration with external tools and data sources, expanding model capabilities.</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-indigo-700">Key Benefits</h3>
                <ul>
                  <li>Reduced token usage by requesting only necessary context</li>
                  <li>Improved model performance through access to relevant information</li>
                  <li>Enhanced security by limiting upfront context exposure</li>
                  <li>Standardized approach across different AI systems</li>
                  <li>Simplified integration with external tools and data sources</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="architecture" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">MCP Client/Server Architecture</h3>
                <p>
                  The MCP implementation consists of two main components: the MCP client (model) and the MCP server (context provider).
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">MCP Client (Model)</h4>
                  <ul className="list-disc pl-5 mb-0">
                    <li>Generates requests for context when needed</li>
                    <li>Formats requests according to the MCP specification</li>
                    <li>Processes responses and incorporates context into reasoning</li>
                    <li>Continues generation with the newly acquired context</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">MCP Server (Context Provider)</h4>
                  <ul className="list-disc pl-5 mb-0">
                    <li>Receives and parses MCP requests</li>
                    <li>Validates request parameters and permissions</li>
                    <li>Retrieves requested information from appropriate sources</li>
                    <li>Formats and returns responses according to the MCP specification</li>
                    <li>Handles errors and provides appropriate feedback</li>
                  </ul>
                </div>
                
                <h4 className="font-semibold text-indigo-700 mt-4">Request/Response Flow</h4>
                <ol className="list-decimal pl-5">
                  <li>Model generates text until it needs additional context</li>
                  <li>Model outputs a structured MCP request</li>
                  <li>Server receives and processes the request</li>
                  <li>Server returns formatted response with requested context</li>
                  <li>Model incorporates context and continues generation</li>
                </ol>
              </TabsContent>
              
              <TabsContent value="implementation" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Implementing MCP for Sensay</h3>
                <p>
                  Integrating MCP with Sensay's architecture involves several components working together to provide dynamic context to models.
                </p>
                
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">MCP Request Format</h4>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "type": "mcp_request",
  "service": "sensay.knowledge_base",
  "method": "query",
  "parameters": {
    "query": "information about user X",
    "max_results": 5
  }
}`}
                  </pre>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">MCP Response Format</h4>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "type": "mcp_response",
  "status": "success",
  "data": {
    "results": [
      { "content": "User X information...", "source": "profile" },
      { "content": "Additional details...", "source": "interactions" }
    ]
  }
}`}
                  </pre>
                </div>
                
                <h4 className="font-semibold text-indigo-700 mt-4">Integration Points</h4>
                <ul className="list-disc pl-5">
                  <li><strong>API Gateway:</strong> Routes MCP requests to appropriate services</li>
                  <li><strong>Authentication:</strong> Validates permissions for requested context</li>
                  <li><strong>Service Registry:</strong> Maintains list of available MCP-compatible services</li>
                  <li><strong>Context Providers:</strong> Individual services that respond to MCP requests</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Example Use Cases</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Knowledge Base Queries</h4>
                  <p className="mb-2">Model can request specific information from Sensay's knowledge base:</p>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "type": "mcp_request",
  "service": "sensay.knowledge_base",
  "method": "query",
  "parameters": {
    "query": "latest information about project X",
    "max_results": 3
  }
}`}
                  </pre>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">User Profile Access</h4>
                  <p className="mb-2">Model can request user preferences or history:</p>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "type": "mcp_request",
  "service": "sensay.user_profiles",
  "method": "get_preferences",
  "parameters": {
    "user_id": "user_123",
    "preference_type": "communication_style"
  }
}`}
                  </pre>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">External Tool Integration</h4>
                  <p className="mb-2">Model can request execution of external tools:</p>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "type": "mcp_request",
  "service": "sensay.tools",
  "method": "execute",
  "parameters": {
    "tool_name": "calendar",
    "action": "check_availability",
    "date_range": {
      "start": "2025-04-01T09:00:00Z",
      "end": "2025-04-01T17:00:00Z"
    }
  }
}`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCPConceptPage;
