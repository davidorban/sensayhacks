import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

// Define message structure
interface Message {
  id: number;
  sender: 'User' | 'Replica';
  text: string;
  timestamp: string;
  isLoading?: boolean; // Optional flag for loading state
}

// Define task structure (must match backend/Supabase)
interface Task {
  id: number | string;
  text: string;
  completed: boolean;
}

const ReplicaTaskMemoryPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Replica', text: 'Hello! How can I assist you with your tasks today?', timestamp: '...' },
  ]);
  const [input, setInput] = useState('');
  // Task state now solely driven by API response
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSending, setIsSending] = useState(false); // Loading state for API call

  // Ref for scrolling messages
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message and calling API
  const handleSend = async () => {
    if (input.trim() === '' || isSending) return;

    setIsSending(true);
    const userInput = input;
    setInput(''); // Clear input immediately

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

    // Create and display user message immediately
    const userMessage: Message = {
      id: Date.now(),
      sender: 'User',
      text: userInput,
      timestamp: timestamp,
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Prepare message history for API (sending only the last user message based on current backend)
    // If backend needs full history, adjust this
    const messagesForApi = [
        { role: 'user', content: userInput } as const // Use OpenAI-compatible format
    ];

    // Add a temporary loading message for the replica
    const loadingMessageId = Date.now() + 1;
    const loadingMessage: Message = {
        id: loadingMessageId,
        sender: 'Replica',
        text: '', // No text initially
        timestamp: timestamp,
        isLoading: true,
    };
    setMessages(prevMessages => [...prevMessages, loadingMessage]);

    try {
      // Get user ID from somewhere secure (e.g., auth context, hardcoded for now if needed)
      // In a real app, this would come from user authentication state.
      // For now, using a placeholder. Make sure backend expects this via X-USER-ID.
      const userId = 'test-user'; // Placeholder - ensure this matches what backend uses if hardcoded there too

      const response = await fetch('/api/sensay/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-USER-ID': userId, // Send the user ID header
          },
          body: JSON.stringify({
              messages: messagesForApi,
              replicaId: 'rdavidorban' // Assuming this is still the target replica
          }),
      });

      const data = await response.json();

      if (!response.ok) {
          console.error("API Error:", data.error);
          // Update loading message with error
          setMessages(prevMessages => prevMessages.map(msg =>
              msg.id === loadingMessageId
                  ? { ...msg, text: `Error: ${data.error || 'Failed to get response'}`, isLoading: false }
                  : msg
          ));
          // Optionally update tasks if the error response includes them (e.g., tasks before failure)
          if (data.tasks && Array.isArray(data.tasks)) {
            setTasks(data.tasks);
          }
      } else {
          // Update the loading message with the actual reply
          setMessages(prevMessages => prevMessages.map(msg =>
              msg.id === loadingMessageId
                  ? { ...msg, text: data.reply || "[No reply content]", isLoading: false }
                  : msg
          ));

          // Update tasks state with the list returned from the API
          if (data.tasks && Array.isArray(data.tasks)) {
              console.log("Received tasks from API:", data.tasks);
              setTasks(data.tasks);
          } else {
              console.warn("API response did not include a valid 'tasks' array:", data);
              // Maybe clear tasks if the API implies they should be empty?
              // setTasks([]);
          }
      }

    } catch (error) {
        console.error("Fetch Error:", error);
        const errorMsg = error instanceof Error ? error.message : 'Network error or failed to fetch';
        // Update loading message with fetch error
        setMessages(prevMessages => prevMessages.map(msg =>
            msg.id === loadingMessageId
                ? { ...msg, text: `Error: ${errorMsg}`, isLoading: false }
                : msg
        ));
        // Do not update tasks on fetch error, keep the last known state
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-900"> 
      <div className="p-4 border-b border-gray-700"> 
        <h1 className="text-2xl font-bold text-gray-100">Replica Task Memory (DB Connected)</h1>
        <p className="mt-2 text-sm text-gray-300"> 
          Chat with the replica. Tasks are stored in the database and will update based on the conversation (via backend logic).
        </p>
      </div>

      <div className="flex-1 flex p-4 space-x-4 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'User' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="text-xs text-gray-500">Thinking...</span>
                    </div>
                  ) : (
                    <>
                        <strong className="font-semibold">{msg.sender === 'User' ? 'You' : 'Replica'}: </strong>{msg.text}
                        <span className="text-xs text-gray-500 block mt-1 text-right">{msg.timestamp}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-300 bg-gray-50 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              disabled={isSending} 
            />
            <button
              onClick={handleSend}
              disabled={isSending || input.trim() === ''} 
              className={`px-4 py-2 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSending || input.trim() === '' ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}`}>
              {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send'}
            </button>
          </div>
        </div>

        <div className="w-1/3 flex flex-col bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-300">Tasks (from DB)</h2>
          <div className="flex-1 overflow-y-auto p-4">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks found in the database for this user.</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.text}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplicaTaskMemoryPage;
