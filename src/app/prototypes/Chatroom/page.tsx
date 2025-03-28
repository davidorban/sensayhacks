"use client";

import React, { useState } from 'react';

interface ChatMessage {
  id: number;
  sender: string; // 'User' or Replica name
  text: string;
  timestamp: string;
}

interface Replica {
  id: string;
  name: string;
}

const availableReplicas: Replica[] = [
  { id: 'replica1', name: 'Assistant Alpha' },
  { id: 'replica2', name: 'Helper Bot Beta' },
  { id: 'replica3', name: 'Support AI Gamma' },
];

const ChatroomPage = () => {
  const [selectedReplicas, setSelectedReplicas] = useState<string[]>([availableReplicas[0].id]); // Default to first replica
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'Assistant Alpha', text: 'Welcome to the multi-replica chatroom!', timestamp: '11:00 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleReplicaSelection = (replicaId: string) => {
    setSelectedReplicas(prev =>
      prev.includes(replicaId)
        ? prev.filter(id => id !== replicaId)
        : [...prev, replicaId]
    );
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || selectedReplicas.length === 0) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'User',
      text: newMessage,
      timestamp,
    };

    const currentMessages = [...messages, userMessage];

    // Mock responses from selected replicas
    selectedReplicas.forEach((replicaId) => {
      const replica = availableReplicas.find(r => r.id === replicaId);
      if (replica) {
        const replicaResponse: ChatMessage = {
          id: currentMessages.length + 1,
          sender: replica.name,
          text: `(Mock) Response from ${replica.name}: Roger that! Received "${newMessage}"`, 
          timestamp,
        };
        currentMessages.push(replicaResponse);
      }
    });

    setMessages(currentMessages);
    setNewMessage('');
  };

  // Helper to get background color based on sender
  const getBgColor = (sender: string) => {
    if (sender === 'User') return 'bg-indigo-600 text-white'; 
    const index = availableReplicas.findIndex(r => r.name === sender);
    const colors = ['bg-green-200', 'bg-purple-200', 'bg-yellow-200', 'bg-pink-200'];
    return colors[index % colors.length] + ' text-black'; 
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100"> {/* Darkened bg */}
      <h1 className="text-2xl font-bold mb-4 px-4 pt-4">Chatroom (Mock)</h1>
      
      {/* Replica Selection */}
      <div className="mb-4 px-4 pt-2 pb-4 bg-white border-b border-gray-300 shadow-sm"> {/* Darkened border */}
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Replicas to Chat With:</label> 
        <div className="flex flex-wrap gap-2">
          {availableReplicas.map(replica => (
            <button
              key={replica.id}
              onClick={() => handleReplicaSelection(replica.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium border
                ${selectedReplicas.includes(replica.id)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              {replica.name}
            </button>
          ))}
        </div>
      </div>

      {/* Message Display */}
      <div className="flex-1 overflow-y-auto mb-0 space-y-4 p-4 bg-gray-200"> {/* Darkened bg */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'User' ? 'items-end' : 'items-start'}`}>
            <div
              className={`p-3 rounded-lg max-w-xs lg:max-w-lg ${getBgColor(msg.sender)} shadow`}
            >
              <p className="font-semibold text-sm mb-1">{msg.sender}</p>
              <p>{msg.text}</p>
              <span className="text-xs opacity-70 block mt-1 text-right">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-300 bg-white"> {/* Darkened border */}
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={selectedReplicas.length > 0 ? "Type your message..." : "Select at least one replica to chat"}
            disabled={selectedReplicas.length === 0}
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === '' || selectedReplicas.length === 0}
            className="p-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
         <p className="mt-2 text-xs text-gray-500">
        (Note: Interactions are simulated. Select replicas above.)
      </p>
      </div>
    </div>
  );
};

export default ChatroomPage;
