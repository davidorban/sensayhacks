"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users, Settings, Zap, BrainCircuit } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: string;
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
  { id: 'replica1', name: 'Market Analyst', specialty: 'Business strategy and market trends', color: 'bg-blue-200' },
  { id: 'replica2', name: 'Financial Advisor', specialty: 'Financial planning and investment', color: 'bg-purple-200' },
  { id: 'replica3', name: 'Technical Expert', specialty: 'Technology implementation and architecture', color: 'bg-green-200' },
  { id: 'replica4', name: 'Creative Director', specialty: 'Design thinking and innovation', color: 'bg-yellow-200' },
];

// Define conversation modes
const conversationModes = [
  { id: 'democratic', name: 'Democratic', description: 'All replicas contribute equally to the discussion' },
  { id: 'moderated', name: 'Moderated', description: 'One replica acts as facilitator, directing the conversation flow' },
  { id: 'structured', name: 'Structured', description: 'Following specific protocols (e.g., Six Thinking Hats, SWOT analysis)' },
  { id: 'adversarial', name: 'Adversarial', description: 'Replicas intentionally take opposing viewpoints to explore tensions' },
];

const ChatroomPage = () => {
  const [selectedReplicas, setSelectedReplicas] = useState<string[]>([availableReplicas[0].id, availableReplicas[1].id]); // Default to first two replicas
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'System', text: 'Welcome to the Sensay Chatroom! Select replicas and conversation mode to start a multi-participant discussion.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationMode, setConversationMode] = useState('democratic');
  const [currentTopic, setCurrentTopic] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleReplicaSelection = (replicaId: string) => {
    setSelectedReplicas(prev =>
      prev.includes(replicaId)
        ? prev.length > 1 ? prev.filter(id => id !== replicaId) : prev // Keep at least one selected
        : [...prev, replicaId]
    );
  };

  const handleModeChange = (mode: string) => {
    const prevMode = conversationMode;
    setConversationMode(mode);
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
    
    // Add system message about mode change
    const modeChangeMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'System',
      text: `Conversation mode changed from ${prevMode} to ${mode}.`,
      timestamp
    };
    setMessages(prev => [...prev, modeChangeMessage]);
    
    // Add facilitator message for moderated mode
    if (mode === 'moderated' && selectedReplicas.length > 0) {
      const facilitator = availableReplicas.find(r => r.id === selectedReplicas[0]);
      if (facilitator) {
        const facilitatorMessage: ChatMessage = {
          id: messages.length + 2,
          sender: facilitator.name,
          text: `I'll be facilitating this conversation. Let's make sure we stay focused on the topic and everyone gets a chance to contribute.`,
          timestamp
        };
        setMessages(prev => [...prev, facilitatorMessage]);
      }
    }
    
    // Add structure message for structured mode
    if (mode === 'structured') {
      const structureMessage: ChatMessage = {
        id: messages.length + 2,
        sender: 'System',
        text: `Structured conversation initiated. We'll follow a SWOT analysis format: Strengths, Weaknesses, Opportunities, and Threats.`,
        timestamp
      };
      setMessages(prev => [...prev, structureMessage]);
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

    // If this is the first user message, set it as the current topic
    if (!currentTopic) {
      setCurrentTopic(newMessage);
    }

    const currentMessages = [...messages, userMessage];

    // Generate responses based on conversation mode
    setTimeout(() => {
      // Select which replicas will respond based on the conversation mode
      let respondingReplicas = [...selectedReplicas];
      
      if (conversationMode === 'moderated' && selectedReplicas.length > 1) {
        // In moderated mode, the first replica responds first as the facilitator
        const facilitatorId = selectedReplicas[0];
        const otherReplicaId = selectedReplicas.find(id => id !== facilitatorId);
        respondingReplicas = otherReplicaId ? [facilitatorId, otherReplicaId] : [facilitatorId];
      }
      
      // Generate individual replica responses
      respondingReplicas.forEach((replicaId, index) => {
        const replica = availableReplicas.find(r => r.id === replicaId);
        if (replica) {
          const delay = index * 800; // Stagger the responses
          
          setTimeout(() => {
            let responseText = '';
            
            switch (conversationMode) {
              case 'democratic':
                responseText = generateDemocraticResponse(replica, newMessage);
                break;
              case 'moderated':
                responseText = generateModeratedResponse(replica, newMessage, index === 0);
                break;
              case 'structured':
                responseText = generateStructuredResponse(replica, newMessage);
                break;
              case 'adversarial':
                responseText = generateAdversarialResponse(replica, newMessage, index);
                break;
              default:
                responseText = `I'll analyze your message about "${newMessage}" from my perspective as a ${replica.specialty} expert.`;
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
      
      // For certain modes, add a summary or synthesis after individual responses
      if ((conversationMode === 'democratic' || conversationMode === 'structured') && selectedReplicas.length > 1) {
        const synthesisDelay = respondingReplicas.length * 1000 + 500;
        
        setTimeout(() => {
          // Generate a synthesis of the conversation
          const synthesisMessage: ChatMessage = {
            id: currentMessages.length + respondingReplicas.length + 1,
            sender: 'Synthesis',
            text: generateSynthesis(newMessage, conversationMode),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }),
          };
          
          setMessages(prev => [...prev, synthesisMessage]);
        }, synthesisDelay);
      }
    }, 500);

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
  };

  // Helper functions to generate different types of responses
  const generateDemocraticResponse = (replica: Replica, query: string): string => {
    const responses: Record<string, string> = {
      'Market Analyst': `From a market perspective, "${query}" relates to current trends in customer behavior. We're seeing increased demand for personalized experiences.`,
      'Financial Advisor': `Looking at the financial implications of "${query}", we should consider the investment required and potential ROI over a 3-5 year period.`,
      'Technical Expert': `The technical feasibility of "${query}" is high. We could implement this using current technologies with moderate effort.`,
      'Creative Director': `"${query}" presents an opportunity for innovative design thinking. We could approach this from several creative angles.`
    };
    
    return responses[replica.name] || `As a ${replica.specialty} expert, I believe "${query}" deserves careful consideration.`;
  };
  
  const generateModeratedResponse = (replica: Replica, query: string, isFacilitator: boolean): string => {
    if (isFacilitator) {
      return `Thank you for bringing up "${query}". This is an important topic. I'd like to hear from my colleagues about their specialized perspectives before providing a synthesis.`;
    } else {
      return `Thanks for the opportunity to contribute. From my ${replica.specialty} perspective, "${query}" has several important dimensions we should explore.`;
    }
  };
  
  const generateStructuredResponse = (replica: Replica, query: string): string => {
    const swotResponses: Record<string, string> = {
      'Market Analyst': `STRENGTHS: "${query}" could give us a competitive advantage in emerging markets.`,
      'Financial Advisor': `WEAKNESSES: The financial investment required for "${query}" might strain our current budget.`,
      'Technical Expert': `OPPORTUNITIES: "${query}" opens up possibilities for technological innovation and integration with our existing systems.`,
      'Creative Director': `THREATS: If we don't pursue "${query}", competitors might capture this market segment first.`
    };
    
    return swotResponses[replica.name] || `SWOT Analysis for "${query}" from ${replica.specialty} perspective: [Analysis in progress]`;
  };
  
  const generateAdversarialResponse = (replica: Replica, query: string, index: number): string => {
    // Alternate between positive and negative perspectives
    if (index % 2 === 0) {
      return `I strongly support the idea of "${query}" because it aligns with our strategic goals and could provide significant benefits.`;
    } else {
      return `I must challenge the assumption that "${query}" is the right approach. There are several risks and downsides we need to consider.`;
    }
  };
  
  const generateSynthesis = (query: string, mode: string): string => {
    if (mode === 'democratic') {
      return `Based on our collective expertise, we've identified multiple perspectives on "${query}". The market analysis shows potential demand, financial considerations highlight investment needs, technical assessment confirms feasibility, and creative input suggests innovative approaches.`;
    } else if (mode === 'structured') {
      return `SWOT Analysis Summary for "${query}": We've identified key strengths in market positioning, weaknesses in resource allocation, opportunities for innovation, and threats from competitive pressure. This balanced assessment should inform our decision-making.`;
    }
    return `Synthesizing our discussion on "${query}", we've explored multiple facets of this topic and identified key considerations for moving forward.`;
  };

  // Helper to get background color based on sender
  const getBgColor = (sender: string) => {
    if (sender === 'User') return 'bg-indigo-600 text-white';
    if (sender === 'System') return 'bg-gray-200';
    if (sender === 'Synthesis') return 'bg-blue-200';
    
    const replica = availableReplicas.find(r => r.name === sender);
    return replica?.color || 'bg-gray-200';
  };

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">Sensay Chatroom</h1>
      <p className="text-center mb-6">A dedicated space for real-time conversations between users and multiple Sensay replicas</p>

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
            
            <div>
              <CardTitle className="text-lg">Conversation Mode</CardTitle>
              <Tabs value={conversationMode} onValueChange={handleModeChange} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mt-2">
                  {conversationModes.map(mode => (
                    <TabsTrigger key={mode.id} value={mode.id}>{mode.name}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
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
          
          {/* Participant Panel */}
          <div className="hidden md:block md:col-span-1 p-4 bg-gray-50 overflow-y-auto">
            <h3 className="font-medium text-gray-900 mb-2">Active Participants</h3>
            <div className="space-y-2">
              <div className="flex items-center p-2 bg-blue-50 rounded-md">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  <span className="text-blue-600 font-semibold">U</span>
                </div>
                <div>
                  <p className="text-sm font-medium">User (You)</p>
                </div>
              </div>
              
              {selectedReplicas.map(replicaId => {
                const replica = availableReplicas.find(r => r.id === replicaId);
                if (!replica) return null;
                
                return (
                  <div key={replica.id} className={`flex items-center p-2 rounded-md ${replica.color.replace('bg-', 'bg-').replace('200', '50')}`}>
                    <div className={`${replica.color} rounded-full w-8 h-8 flex items-center justify-center mr-2`}>
                      <span className={`${replica.color.replace('bg-', 'text-').replace('200', '600')} font-semibold`}>
                        {replica.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{replica.name}</p>
                      <p className="text-xs text-gray-500">{replica.specialty}</p>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Current Mode</h4>
                <Badge className="mb-1">
                  {conversationModes.find(m => m.id === conversationMode)?.name || 'Democratic'}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  {conversationModes.find(m => m.id === conversationMode)?.description || 'All replicas contribute equally to the discussion'}
                </p>
              </div>
              
              {currentTopic && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Current Topic</h4>
                  <p className="text-sm p-2 bg-white rounded-md border border-gray-200">
                    {currentTopic}
                  </p>
                </div>
              )}
            </div>
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
              (Note: Interactions are simulated. Change conversation mode to see different behaviors.)
            </p>
            <div className="text-xs text-gray-500">
              <span>Mode: <span className="font-medium">{conversationModes.find(m => m.id === conversationMode)?.name || 'Democratic'}</span></span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatroomPage;
