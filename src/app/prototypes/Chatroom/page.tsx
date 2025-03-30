"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
  id: number;
  sender: string; // 'User' or Replica name
  text: string;
  timestamp: string;
}

interface Replica {
  id: string;
  name: string;
  specialty: string;
  color: string;
}

const availableReplicas: Replica[] = [
  { id: 'replica1', name: 'Memory Replica', specialty: 'Knowledge management and shared memory', color: 'bg-green-200' },
  { id: 'replica2', name: 'Sync Replica', specialty: 'State synchronization and coordination', color: 'bg-purple-200' },
  { id: 'replica3', name: 'Goal Replica', specialty: 'Collective goal planning and execution', color: 'bg-yellow-200' },
];

const ChatroomPage = () => {
  const [selectedReplicas, setSelectedReplicas] = useState<string[]>([availableReplicas[0].id]); // Default to first replica
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'Memory Replica', text: 'Welcome to the Bonded Replicas Chat! Select replicas and send a message to see how we collaborate with shared memory and state.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [bondingEnabled, setBondingEnabled] = useState(false);
  const [sharedMemory, setSharedMemory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleReplicaSelection = (replicaId: string) => {
    setSelectedReplicas(prev =>
      prev.includes(replicaId)
        ? prev.length > 1 ? prev.filter(id => id !== replicaId) : prev // Keep at least one selected
        : [...prev, replicaId]
    );
  };

  const toggleBonding = () => {
    const newBondingState = !bondingEnabled;
    setBondingEnabled(newBondingState);
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
    
    if (newBondingState) {
      // Initialize shared memory when bonding is enabled
      setSharedMemory([
        "User is interested in AI collaboration",
        "Current task: Exploring bonding capabilities"
      ]);
      
      // Add system message about bonding being enabled
      const bondingMessage: ChatMessage = {
        id: messages.length + 1,
        sender: 'System',
        text: 'Bonding enabled between replicas. Shared memory and state synchronization activated.',
        timestamp
      };
      setMessages(prev => [...prev, bondingMessage]);
    } else {
      // Clear shared memory when bonding is disabled
      setSharedMemory([]);
      
      // Add system message about bonding being disabled
      const bondingMessage: ChatMessage = {
        id: messages.length + 1,
        sender: 'System',
        text: 'Bonding disabled. Replicas are now operating independently without shared memory.',
        timestamp
      };
      setMessages(prev => [...prev, bondingMessage]);
    }
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

    // If bonding is enabled, add the user's message to shared memory
    if (bondingEnabled) {
      setSharedMemory(prev => [...prev, `User query: ${newMessage}`]);
    }

    // Generate more interactive and contextual responses based on bonding status
    setTimeout(() => {
      // First pass: selected replicas generate their responses
      selectedReplicas.forEach((replicaId, index) => {
        const replica = availableReplicas.find(r => r.id === replicaId);
        if (replica) {
          const delay = index * 800; // Stagger the responses
          
          setTimeout(() => {
            let responseText = '';
            
            if (bondingEnabled) {
              // Bonded replicas reference shared memory and each other
              switch (replica.name) {
                case 'Memory Replica':
                  responseText = `I've stored your query about "${newMessage}" in our shared memory. Based on our collective knowledge, we can provide a coordinated response.`;
                  break;
                case 'Sync Replica':
                  responseText = `Synchronizing state with other replicas based on your query. I can see that Memory Replica has stored your question in our shared memory.`;
                  break;
                case 'Goal Replica':
                  responseText = `I'm establishing a collective goal to address your query: "${newMessage}". Working with the other replicas to formulate a comprehensive response.`;
                  break;
                default:
                  responseText = `Processing your query with access to our shared memory pool.`;
              }
            } else {
              // Unbonded replicas give independent responses
              responseText = `(Independent mode) ${replica.name} response: I'll process your query about "${newMessage}" individually, without coordination with other replicas.`;
            }
            
            const replicaResponse: ChatMessage = {
              id: currentMessages.length + 1 + index,
              sender: replica.name,
              text: responseText,
              timestamp,
            };
            
            setMessages(prev => [...prev, replicaResponse]);
          }, delay);
        }
      });
      
      // Second pass: if bonded, add a collaborative follow-up after individual responses
      if (bondingEnabled && selectedReplicas.length > 1) {
        const collaborationDelay = selectedReplicas.length * 1000 + 500;
        
        setTimeout(() => {
          // Determine which replicas are involved
          const involvedReplicas = selectedReplicas.map(id => 
            availableReplicas.find(r => r.id === id)?.name
          ).filter(Boolean).join(', ');
          
          // Generate a collaborative response
          const collaborativeResponse: ChatMessage = {
            id: currentMessages.length + selectedReplicas.length + 1,
            sender: 'Collaborative Response',
            text: `Based on our shared analysis (${involvedReplicas}), we've synthesized the following insights about "${newMessage}": This query relates to ${getQueryTopic(newMessage)}. Our bonded state allows us to provide a unified perspective while leveraging our individual specialties.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }),
          };
          
          setMessages(prev => [...prev, collaborativeResponse]);
          
          // Update shared memory with the collaborative insight
          if (bondingEnabled) {
            setSharedMemory(prev => [...prev, `Collaborative insight: ${getQueryTopic(newMessage)}`]);
          }
        }, collaborationDelay);
      }
    }, 500);

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
  };

  // Helper function to determine the topic of a query (simplified mock)
  const getQueryTopic = (_query: string): string => {
    const topics = [
      "AI collaboration mechanisms",
      "shared memory systems",
      "synchronized state management",
      "collective intelligence",
      "bonding protocols between AI systems"
    ];
    
    // Simple mock logic - in a real system this would be more sophisticated
    return topics[Math.floor(Math.random() * topics.length)];
  };

  // Helper to get background color based on sender
  const getBgColor = (sender: string) => {
    if (sender === 'User') return 'bg-indigo-600 text-white';
    if (sender === 'System') return 'bg-gray-200';
    if (sender === 'Collaborative Response') return 'bg-blue-200';
    
    const replica = availableReplicas.find(r => r.name === sender);
    return replica?.color || 'bg-gray-200';
  };

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">Bonded Replicas Chat</h1>

      {/* Interactive Chat Section */} 
      <Card className="flex-1 flex flex-col overflow-hidden bg-white text-gray-900"> 
        <CardHeader className="border-b border-gray-300"> 
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Chat Participants</CardTitle> 
              <div className="flex flex-wrap gap-2 pt-2">
                {availableReplicas.map(replica => (
                  <Button
                    key={replica.id}
                    variant={selectedReplicas.includes(replica.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleReplicaSelection(replica.id)}
                  >
                    {replica.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="bonding-mode" 
                checked={bondingEnabled}
                onCheckedChange={toggleBonding}
              />
              <Label
                className="cursor-pointer"
                onClick={() => toggleBonding()}
              >
                Bonding Mode
              </Label>
              <Badge variant={bondingEnabled ? "default" : "outline"} className="ml-2">
                {bondingEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 flex-grow">
          <CardContent className="col-span-1 md:col-span-3 flex-grow overflow-y-auto p-4 border-r border-gray-200"> 
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${msg.sender === 'User' ? 'bg-primary text-primary-foreground' : getBgColor(msg.sender)}`}>
                    <p className="text-sm font-semibold mb-0.5 ${msg.sender !== 'User' ? 'text-gray-700' : ''}">{msg.sender}</p>
                    <p className={`text-sm ${msg.sender !== 'User' ? 'text-gray-900' : ''}`}>{msg.text}</p>
                    <span className={`text-xs opacity-70 block mt-1 text-right ${msg.sender !== 'User' ? 'text-gray-600' : ''}`}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          {/* Shared Memory Panel - only visible when bonding is enabled */}
          <div className={`hidden md:block md:col-span-1 p-4 bg-gray-50 overflow-y-auto ${bondingEnabled ? '' : 'opacity-50'}`}>
            <h3 className="font-medium text-gray-900 mb-2">Shared Memory Pool</h3>
            {bondingEnabled ? (
              <div>
                {sharedMemory.length > 0 ? (
                  <ul className="space-y-2">
                    {sharedMemory.map((item, index) => (
                      <li key={index} className="text-sm bg-white p-2 rounded border border-gray-200">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No shared memories yet.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Bonding disabled. Enable bonding to see shared memory.</p>
            )}
          </div>
        </div>

        {/* Input Area */} 
        <div className="p-4 border-t border-gray-200 bg-background"> 
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={selectedReplicas.length > 0 ? "Type your message..." : "Select at least one replica"}
              disabled={selectedReplicas.length === 0}
              className="flex-grow"
            />
            <Button
              onClick={handleSendMessage}
              disabled={newMessage.trim() === '' || selectedReplicas.length === 0}
            >
              Send
            </Button>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              (Note: Interactions are simulated. Toggle bonding to see different behaviors.)
            </p>
            <div className="text-xs text-gray-500">
              {bondingEnabled ? (
                <span className="text-green-600 font-medium">Bonded Mode: Replicas share memory and state</span>
              ) : (
                <span>Independent Mode: Replicas operate separately</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatroomPage;
