"use client"; // Required for useState

import React, { useState } from 'react';

interface Message {
  id: number;
  sender: 'User' | 'Replica';
  text: string;
  timestamp: string;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const ReplicaTaskMemoryPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Replica', text: 'Hello! How can I help you today?', timestamp: '10:00 AM' },
    { id: 2, sender: 'User', text: 'Remind me to buy groceries.', timestamp: '10:01 AM' },
    { id: 3, sender: 'Replica', text: 'Okay, I\'ve added "Buy groceries" to your tasks.', timestamp: '10:01 AM' },
  ]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Finish report', completed: true },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'User',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }),
    };

    // Mock replica response
    const replicaResponse: Message = {
      id: messages.length + 2,
      sender: 'Replica',
      text: `Okay, I received: "${newMessage}". (Mock Response)`, // Mocked interaction
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }),
    };

    setMessages([...messages, userMessage, replicaResponse]);
    setNewMessage('');

    // Mock task creation if message contains "add task" or similar
    if (newMessage.toLowerCase().includes('add task')) {
      const taskText = newMessage.split('add task')[1]?.trim() || 'New Task from Chat';
      const newTask: Task = {
        id: tasks.length + 1,
        text: taskText,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="flex flex-1"> 
      {/* Chat Area */} 
      <div className="flex-1 flex flex-col bg-gray-100 p-4 border-r border-gray-300">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Replica Task Memory</h1>
        {/* Message Display */} 
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2 bg-gray-100 rounded shadow"> 
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-3 rounded-lg max-w-xs lg:max-w-md shadow 
                 ${msg.sender === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black' 
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-500 block mt-1 text-right">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Message Input */} 
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Send
          </button>
        </div>
      </div>

      {/* Task List */} 
      <div className="w-80 bg-gray-50 p-4 overflow-y-auto flex-shrink-0"> 
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-2 rounded transition-colors duration-150 hover:bg-gray-200 
               ${task.completed ? 'bg-green-100' : 'bg-yellow-100'
                }`}
            >
              <span className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.text}
              </span>
              <button
                onClick={() => toggleTask(task.id)}
                className={`px-2 py-1 text-xs rounded ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReplicaTaskMemoryPage;
