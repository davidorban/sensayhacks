"use client";

import React, { useState } from 'react';

interface McpOutput {
  status: string;
  data: Record<string, unknown>;
}

const MCPClientPage = () => {
  const [inputData, setInputData] = useState('');
  const [output, setOutput] = useState<McpOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTriggerMcp = () => {
    setIsLoading(true);
    setOutput(null);
    console.log('(Mock) Triggering MCP with data:', inputData);

    // Simulate API call delay
    setTimeout(() => {
      // Mock response from MCP
      const mockResponse: McpOutput = {
        status: 'Success',
        data: {
          processedInput: inputData,
          result: `Mock result based on input - ${Date.now()}`,
          details: 'This is a simulated response from the MCP server.',
        },
      };
      setOutput(mockResponse);
      setIsLoading(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> 
      <h1 className="text-2xl font-bold mb-2 text-gray-100">MCP Client/Server (Mock)</h1> 
      <p className="mb-6 text-sm text-gray-300"> 
        Concept: Simulates a UI triggering a backend Micro-process Controller (MCP) with input data and displaying the processed output.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-lg flex-1 flex flex-col">

        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"> 
          <label htmlFor="mcpInput" className="block text-sm font-medium text-gray-700 mb-2">Input Data (e.g., JSON):</label>
          <textarea
            id="mcpInput"
            rows={4}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder='{ "param1": "value1", "param2": 123 }'
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
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
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Trigger MCP (Mock)'
            )}
          </button>
        </div>

        <div className="flex-1 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm min-h-[120px]"> 
          <h2 className="text-lg font-semibold mb-2 text-gray-800">MCP Output (Mock):</h2>
          {isLoading && (
            <p className="text-gray-500 italic">Processing request...</p>
          )}
          {output && (
            <pre className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 overflow-x-auto"><code>{JSON.stringify(output, null, 2)}</code></pre>
          )} 
          {!isLoading && !output && (
             <p className="text-gray-500 italic">Output will appear here after triggering MCP.</p>
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
