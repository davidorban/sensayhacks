"use client";
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const MCPConceptPage = () => {
  const [conceptContent, setConceptContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConceptMarkdown = async () => {
      try {
        // This would ideally fetch from an API that serves the markdown content
        // For now, we're embedding the content directly from the documentation
        const content = `
# Model Context Protocol (MCP)

## Introduction

The Model Context Protocol (MCP) is a standardized interface for large language models (LLMs) to interact with external tools and services. It provides a structured way for models to request information, perform actions, and receive feedback from the outside world.

## Core Concepts

### Tools and Capabilities

MCP defines a set of tools that models can use to extend their capabilities beyond their training data:

- **Information Retrieval**: Access to up-to-date information
- **Code Execution**: Running code in sandboxed environments
- **External API Access**: Interacting with third-party services
- **File Operations**: Reading and writing files
- **User Interaction**: Requesting input or confirmation from users

### Structured Communication

MCP uses a JSON-based format for communication between models and tools:

- **Tool Definitions**: Describe available tools and their parameters
- **Tool Calls**: Requests from models to use specific tools
- **Tool Responses**: Results returned from tools to models

### Security and Safety

MCP includes built-in safety mechanisms:

- **Permission Systems**: Control what tools models can access
- **Sandboxing**: Isolate tool execution environments
- **Audit Logging**: Track all tool usage for review

## Benefits

- **Enhanced Capabilities**: Models can perform tasks beyond their training data
- **Standardization**: Common interface across different models and platforms
- **Safety**: Structured approach to model-tool interactions with built-in safeguards
- **Extensibility**: Easy to add new tools and capabilities

## Implementation

MCP can be implemented in various ways:

- **Client Libraries**: SDKs for different programming languages
- **Server Implementations**: Standalone services that handle tool execution
- **Model Integration**: Direct support within model APIs

## Use Cases

- **Research Assistants**: Access and analyze up-to-date information
- **Development Tools**: Help write, debug, and explain code
- **Automation Agents**: Perform complex workflows across multiple systems
- **Interactive Applications**: Create dynamic user experiences

## Future Directions

The MCP standard continues to evolve with:

- **Tool Discovery**: Dynamic discovery of available tools
- **Tool Composition**: Combining tools for complex operations
- **Multi-step Planning**: Supporting longer sequences of tool usage
- **Cross-model Collaboration**: Enabling multiple models to work together

## Community and Ecosystem

MCP is supported by a growing ecosystem:

- **Open Source Implementations**: Community-maintained libraries
- **Tool Repositories**: Collections of ready-to-use tools
- **Best Practices**: Guidelines for effective and safe tool development
- **Governance**: Collaborative development of the protocol standard
`;
        setConceptContent(content);
        setIsLoading(false);
      } catch {
        setError('Failed to load concept description');
        setIsLoading(false);
      }
    };

    fetchConceptMarkdown();
  }, []);

  // Function to convert markdown to HTML (very basic implementation)
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return '';
    
    // Split the markdown into lines
    const lines = markdown.split('\n');
    
    // Process each line
    return lines.map((line, index) => {
      // H1 headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>;
      }
      // H2 headers
      else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-indigo-700">{line.substring(3)}</h2>;
      }
      // H3 headers
      else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium mt-5 mb-2 text-indigo-600">{line.substring(4)}</h3>;
      }
      // Bold text (very basic implementation)
      else if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="my-2">
            {parts.map((part, i) => (
              i % 2 === 0 ? part : <strong key={i}>{part}</strong>
            ))}
          </p>
        );
      }
      // Regular paragraph
      else if (line.trim() !== '') {
        return <p key={index} className="my-2">{line}</p>;
      }
      // Empty line
      return <br key={index} />;
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Model Context Protocol (MCP) Concept</h1>
      <p className="mb-6 text-sm text-gray-300">
        Understanding the Model Context Protocol and its applications.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-lg flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading concept description...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            {renderMarkdown(conceptContent)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MCPConceptPage;
