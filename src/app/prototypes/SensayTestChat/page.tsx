'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: number;
  sender: 'User' | 'Replica';
  text: string;
  timestamp: string;
  isLoading?: boolean;
}

interface ApiAttempt {
  path: string;
  url: string;
  status?: number;
  error?: string;
  response?: string;
}

export default function SensayTestChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // For auto-scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = userInput.trim();
    if (trimmedInput === '' || isLoading) return;

    setError(null); // Clear previous errors
    setIsLoading(true);
    const timestamp = new Date().toLocaleTimeString();

    // Add user message to display
    const userMessage: Message = {
      id: Date.now(),
      sender: 'User',
      text: trimmedInput,
      timestamp: timestamp,
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput(''); // Clear input field

    // Prepare message for API
    const messagesForApi = [
      { role: 'user', content: trimmedInput } as const
    ];

    try {
      const response = await fetch('/api/chat-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesForApi,
          model: 'sensay-default' // Add the model parameter required by the backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = `API Error: ${response.statusText}`;
        let errorDetails = '';
        
        if (data) {
          if (data.error) {
            errorMessage = data.error;
          }
          
          // Add detailed error information if available
          if (data.attempts) {
            errorDetails = 'API Attempt Details:\n\n';
            data.attempts.forEach((attempt: ApiAttempt, index: number) => {
              errorDetails += `Attempt ${index + 1} (${attempt.path}):\n`;
              errorDetails += `URL: ${attempt.url}\n`;
              errorDetails += `Status: ${attempt.status || 'Unknown'}\n`;
              
              if (attempt.error) {
                errorDetails += `Error: ${attempt.error}\n`;
              }
              
              if (attempt.response) {
                const truncatedResponse = attempt.response.length > 100 
                  ? attempt.response.substring(0, 100) + '...' 
                  : attempt.response;
                errorDetails += `Response: ${truncatedResponse}\n`;
              }
              
              errorDetails += '\n';
            });
          }
          
          if (data.replicaId) {
            errorDetails += `Replica ID used: ${data.replicaId}\n`;
          }
          
          if (data.baseApiUrl) {
            errorDetails += `Base API URL: ${data.baseApiUrl}\n`;
          }
        }
        
        // Log the detailed error from backend if available
        console.error('Backend Error Details:', data?.error || 'No specific error message from backend.');
        if (errorDetails) {
          console.error('Error Details:', errorDetails);
        }
        
        throw new Error(errorMessage + (errorDetails ? `\n\n${errorDetails}` : ''));
      }

      // Add replica response to display
      const replicaMessage: Message = {
        id: Date.now() + 1,
        sender: 'Replica',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prevMessages => [...prevMessages, replicaMessage]);

    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to get reply: ${errorMessage}`);
      // Add an error message to the chat display
      const errorMessageObj: Message = {
        id: Date.now() + 2,
        sender: 'Replica',
        text: `Error: ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessageObj]);

    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent form submission/new line
      handleSend();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Sensay API Test Chat</CardTitle>
        </CardHeader>
        <CardContent className="h-[500px] overflow-y-auto space-y-4 p-4 bg-white border rounded">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow ${msg.sender === 'User'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm font-semibold mb-1">{msg.sender}</p>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 rounded-lg shadow bg-gray-200 text-gray-800">
                <p className="text-sm font-semibold mb-1">Replica</p>
                <p className="italic">Typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="pt-4 border-t bg-gray-50 flex-col items-start">
          {error && <p className="text-red-500 text-sm mb-2 w-full">{error}</p>}
          <div className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button onClick={handleSend} disabled={isLoading || userInput.trim() === ''}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
