"use client";

import React, { useState } from 'react';

interface McpOutput {
  status: string;
  data: Record<string, any>;
}

// Define a basic type for the expected mock output
type MockOutputType = { 
  [key: string]: any; // Allow any structure for the mock
};

const MCPClientPage = () => {
  const [inputData, setInputData] = useState('');
  const [output, setOutput] = useState<MockOutputType | null>(null);
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
      setOutput(mockResponse as MockOutputType);
      setIsLoading(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">MCP Client/Server (Mock)</h1>
      <p className="mb-4 text-gray-600">Simulate triggering a Micro-process Controller (MCP).</p>

      <div className="mb-4">
        <label htmlFor="mcpInput" className="block text-sm font-medium text-gray-700 mb-1">
          Input Data (e.g., JSON):
        </label>
        <textarea
          id="mcpInput"
          rows={4}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder='{ "param1": "value1", "param2": 123 }'
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
        />
      </div>

      <button
        onClick={handleTriggerMcp}
        disabled={isLoading}
        className={`px-6 py-2 rounded-md text-white font-semibold transition-colors flex items-center justify-center
          ${isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Trigger MCP (Mock)'
        )}
      </button>

      {output && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">MCP Output (Mock):</h3>
          <pre className="bg-white p-3 rounded text-sm font-mono overflow-x-auto">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500">
        (Note: Interactions are simulated locally.)
      </p>
    </div>
  );
};

export default MCPClientPage;
