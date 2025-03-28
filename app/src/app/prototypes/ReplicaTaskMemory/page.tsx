"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Undo2, Loader2 } from 'lucide-react'; // Added Loader2 for loading state

interface Message {
  id: number;
  sender: 'User' | 'Replica';
  text: string;
  timestamp: string;
  isLoading?: boolean; // Add isLoading flag for replica messages
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const ReplicaTaskMemoryPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Replica', text: 'Hello! How can I assist you today?', timestamp: '10:00 AM' },
  ]);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Schedule meeting', completed: true },
  ]);
  const [isSending, setIsSending] = useState(false); // Loading state for API call

  // Ref for scrolling messages
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle task detection and modification (separated from sending)
  const handleTaskLogic = (userInput: string) => {
    const lowerCaseMessage = userInput.toLowerCase();
    let taskAdded = false;

    if (lowerCaseMessage.includes('add task') || lowerCaseMessage.includes('remind me to')) {
      const taskText = userInput.replace(/(add task|remind me to)\s*/i, '').trim();
      if (taskText) {
        const newTask: Task = {
          id: Date.now(), // Use timestamp for potentially more unique ID
          text: taskText,
          completed: false,
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
        taskAdded = true;
        console.log(`Task added: "${taskText}"`);
      }
    }
    // Potentially add logic here to handle task completion/deletion via chat if desired
    return taskAdded; // Indicate if a task action was taken
  };

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

    // Handle local task logic based on user input BEFORE sending to API
    handleTaskLogic(userInput);

    // Prepare message history for API
    // Send the current user message along with previous context if needed
    // For simplicity, let's start by sending only the current user message
    // Adjust this based on how much context Sensay needs
    const messagesForApi = [
        // ...messages, // Include previous messages if Sensay needs history context
        { role: 'user', content: userInput } // Use OpenAI-compatible format
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
        const response = await fetch('/api/sensay/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messagesForApi,
                replicaId: 'rdavidorban' // Use the identified replicaId
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
        } else {
            // Update the loading message with the actual reply
            setMessages(prevMessages => prevMessages.map(msg =>
                msg.id === loadingMessageId
                    ? { ...msg, text: data.reply, isLoading: false }
                    : msg
            ));
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
    } finally {
        setIsSending(false);
    }
  };

  // Handle task toggle
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle task deletion
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-900"> {/* Dark BG */}
      <div className="p-4 border-b border-gray-700"> {/* Darker border */}
        <h1 className="text-2xl font-bold text-gray-100">Replica Task Memory (Mock)</h1> {/* Light text, (Mock) added */}
        <p className="mt-2 text-sm text-gray-300"> {/* Lighter gray text */}
          Concept: A chat interface where a user interacts with a replica that can manage a simple task list based on the conversation.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex p-4 space-x-4 overflow-hidden">
        {/* Chat Section (Remains Light) */}
        <div className="flex-1 flex flex-col bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
          {/* Message Display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
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
          {/* Input Area (Remains Light) */}
          <div className="p-4 border-t border-gray-300 bg-gray-50 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Talk to the replica..."
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
              disabled={!input.trim() || isSending} // Disable button when sending
            >
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
            </button>
          </div>
        </div>

        {/* Task List Section (Dark Theme) */}
        <div className="w-80 bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col flex-shrink-0 border border-gray-700"> 
          <h2 className="text-lg font-semibold mb-4 text-gray-100">Tasks</h2> {/* Light text */}
          <div className="flex-1 overflow-y-auto space-y-2 p-3 bg-gray-700 border border-gray-600 rounded-md"> {/* Darker list BG */}
            {tasks.length === 0 ? (
              <p className="text-gray-400 italic text-sm">No tasks yet.</p> /* Lighter text */
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`flex items-center justify-between p-2 rounded ${task.completed ? 'bg-green-900' : 'bg-gray-600'} text-gray-100`}
                  >
                    <span className={`${task.completed ? 'line-through text-gray-400' : ''}`}>{task.text}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`p-1 rounded ${task.completed ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'} focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-700 ${task.completed ? 'focus:ring-yellow-300' : 'focus:ring-green-300'}`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed ? <Undo2 size={16} /> : <Check size={16} />}
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-red-400 hover:text-red-300 rounded focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-700 focus:ring-red-300"
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
