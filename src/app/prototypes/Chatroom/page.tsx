"use client";
import React, { useState, useRef } from 'react';

export const metadata = {
  title: 'Chatroom | Sensay Proto',
};

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    // Text color is now handled directly on the text element
    return colors[index % colors.length]; 
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> {/* Outer Dark BG */}
      {/* Header Area */}
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Chatroom (Mock)</h1> {/* Light Text */}
      <p className="mb-6 text-sm text-gray-300"> {/* Light Text */}
        Concept: A simulated chatroom where multiple Replicas (and potentially the user) can interact.
      </p>

      {/* Content Area - White Rounded Box, taking full height */} 
      <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden"> 
        {/* Replica Selection - Kept background white, moved padding/border here */}
        <div className="p-4 border-b border-gray-300 shadow-sm bg-white"> 
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

        {/* Chat Display Area - Removed individual padding/border/bg */}
        <div className="flex-grow overflow-y-auto p-4"> {/* Add padding here */} 
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                {/* Bubble styling remains */}
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${msg.sender === 'User' ? 'bg-indigo-500 text-white' : getBgColor(msg.sender)}`}>
                  <p className="text-sm font-semibold mb-0.5 ${msg.sender !== 'User' ? 'text-gray-700' : ''}">{msg.sender}</p> {/* Ensure sender name is visible */}
                  <p className={`text-sm ${msg.sender !== 'User' ? 'text-gray-900' : ''}`}>{msg.text}</p>
                  <span className={`text-xs opacity-70 block mt-1 text-right ${msg.sender !== 'User' ? 'text-gray-600' : ''}`}>{msg.timestamp}</span> {/* Ensure timestamp is visible */}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Kept light bg, removed outer border */}
        <div className="p-4 border-t border-gray-200 bg-gray-50"> 
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={selectedReplicas.length > 0 ? "Type your message..." : "Select at least one replica to chat"}
              disabled={selectedReplicas.length === 0}
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={newMessage.trim() === '' || selectedReplicas.length === 0}
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            (Note: Interactions are simulated. Select replicas above.)
          </p>
        </div>
      </div> 
    </div>
  );
};

export default ChatroomPage;
