"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    { id: 1, sender: 'Assistant Alpha', text: 'Welcome to the Group Chat prototype! Select replicas and send a message.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleReplicaSelection = (replicaId: string) => {
    setSelectedReplicas(prev =>
      prev.includes(replicaId)
        ? prev.length > 1 ? prev.filter(id => id !== replicaId) : prev // Keep at least one selected
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

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Description Component
  const DescriptionContent = () => (
    <div className="prose prose-invert max-w-none">
      <h2>Sensay Replica Group Chat: Collaborative Intelligence</h2>
      <h3>Overview</h3>
      <p>The Sensay Replica Group Chat introduces a powerful new paradigm for AI interactions where multiple specialized digital replicas collaborate to solve problems, generate insights, and create value through their collective intelligence.</p>

      <h3>Core Concept</h3>
      <p>Rather than interacting with a single AI replica, users can create, join, or observe conversations among multiple replicas, each with distinct expertise, roles, or personality traits. These group dynamics create richer, more nuanced outcomes than would be possible through one-on-one interactions.</p>

      <h3>Key Use Cases</h3>
      <h4>Enterprise Problem-Solving</h4>
      <ul>
        <li><strong>Task Delegation</strong>: Leaders delegate complex problems to a team of specialized replicas</li>
        <li><strong>Multi-Disciplinary Analysis</strong>: Replicas with different expertise areas approach problems from complementary angles</li>
        <li><strong>Asynchronous Collaboration</strong>: Replicas work through problems over time, notifying humans when solutions are ready</li>
        <li><strong>Documented Decision Process</strong>: The entire conversation thread provides transparency into how conclusions were reached</li>
        <li><strong>24/7 Collaboration</strong>: Teams of replicas work continuously, even when humans are offline</li>
      </ul>
      <h4>Personal Advisory Panels</h4>
      <ul>
        <li><strong>Diverse Perspectives</strong>: Get advice on personal challenges from several viewpoints simultaneously</li>
        <li><strong>Contrasting Opinions</strong>: Benefit from seeing different approaches to the same problem</li>
        <li><strong>Rich Discussion</strong>: Watch as replicas discuss, debate, and build upon each other&apos;s ideas</li>
        <li><strong>Balanced Consideration</strong>: Ensure multiple factors are weighed in life decisions</li>
      </ul>

      <h3>Conversation Dynamics</h3>
      <h4>Initiation</h4>
      <ol>
        <li>User creates a group chat with a specific topic or question</li>
        <li>User selects which replicas to include (either pre-existing or purpose-created)</li>
        <li>User provides initial context, questions, or resources</li>
        <li>User decides whether to participate actively or review later</li>
      </ol>
      <h4>Collaboration Modes</h4>
      <ul>
        <li><strong>Moderated</strong>: One replica acts as facilitator, directing the conversation flow</li>
        <li><strong>Democratic</strong>: All replicas contribute equally to the discussion</li>
        <li><strong>Structured</strong>: Following specific protocols (e.g., Six Thinking Hats, SWOT analysis)</li>
        <li><strong>Adversarial</strong>: Replicas intentionally take opposing viewpoints to explore tensions</li>
      </ul>
      <h4>Termination Mechanisms</h4>
      <ul>
        <li><strong>Goal Achievement</strong>: Conversation ends when specific objectives are accomplished</li>
        <li><strong>Consensus Detection</strong>: Replicas recognize when they&apos;ve reached agreement</li>
        <li><strong>Self-Assessment</strong>: Replicas collectively decide when further discussion adds little value</li>
        <li><strong>Time/Depth Limits</strong>: Predefined constraints on conversation length</li>
        <li><strong>User Intervention</strong>: Human decides when to conclude the discussion</li>
      </ul>

      <h3>Value Propositions</h3>
      <h4>For Enterprises</h4>
      <ul>
        <li><strong>Richer Problem Exploration</strong>: Ensure problems are examined from multiple angles</li>
        <li><strong>Knowledge Synthesis</strong>: Combine insights across departmental boundaries</li>
        <li><strong>Process Improvement</strong>: Identify gaps and opportunities in workflows</li>
        <li><strong>Institutional Memory</strong>: Preserve complex reasoning chains for future reference</li>
        <li><strong>24/7 Collaboration</strong>: Teams of replicas work continuously, even when humans are offline</li>
      </ul>
      <h4>For Individuals</h4>
      <ul>
        <li><strong>Personal Growth</strong>: Gain deeper insights into personal challenges</li>
        <li><strong>Decision Support</strong>: Make more balanced decisions with diverse input</li>
        <li><strong>Learning Enhancement</strong>: Observe expert discussions on topics of interest</li>
        <li><strong>Entertainment</strong>: Enjoy watching interesting conversations unfold</li>
        <li><strong>Emotional Support</strong>: Receive varied perspectives during difficult life moments</li>
      </ul>

      <h3>Technical Framework</h3>
      <h4>Replica Differentiation</h4>
      <ul>
        <li><strong>Specialization</strong>: Expertise in different subject areas</li>
        <li><strong>Personality</strong>: Varied communication styles and approaches</li>
        <li><strong>Knowledge Base</strong>: Access to different information sources</li>
        <li><strong>Reasoning Styles</strong>: Analytical, creative, critical, practical, etc.</li>
      </ul>
      <h4>Conversation Management</h4>
      <ul>
        <li><strong>Thread Organization</strong>: Maintaining coherent discussion structure</li>
        <li><strong>Balance Mechanisms</strong>: Ensuring all replicas contribute appropriately</li>
        <li><strong>Progress Tracking</strong>: Monitoring advancement toward goals</li>
        <li><strong>Semantic Analysis</strong>: Detecting repetition, novelty, and convergence</li>
      </ul>
      <h4>Human Integration</h4>
      <ul>
        <li><strong>Notification Systems</strong>: Alerting users when significant developments occur</li>
        <li><strong>Intervention Options</strong>: Allowing humans to steer, redirect, or refocus discussions</li>
        <li><strong>Summarization</strong>: Condensing long discussions into digestible insights</li>
        <li><strong>Follow-up</strong>: Enabling humans to ask clarifying questions about the discussion</li>
      </ul>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">Replica Group Chat Prototype</h1>

      {/* Description Section */}
      <Card className="mb-6 bg-card border">
        <CardHeader>
          <CardTitle className="text-xl text-card-foreground">Concept: Sensay Replica Group Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionContent />
        </CardContent>
      </Card>

      {/* Interactive Chat Section - Use Card for consistent styling */} 
      <Card className="flex-1 flex flex-col overflow-hidden bg-white text-gray-900"> 
        <CardHeader className="border-b border-gray-300"> 
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
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-4"> {/* Use CardContent */} 
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                {/* Bubble styling remains */}
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${msg.sender === 'User' ? 'bg-primary text-primary-foreground' : getBgColor(msg.sender)}`}>
                  <p className="text-sm font-semibold mb-0.5 ${msg.sender !== 'User' ? 'text-gray-700' : ''}">{msg.sender}</p> {/* Ensure sender name is visible */}
                  <p className={`text-sm ${msg.sender !== 'User' ? 'text-gray-900' : ''}`}>{msg.text}</p>
                  <span className={`text-xs opacity-70 block mt-1 text-right ${msg.sender !== 'User' ? 'text-gray-600' : ''}`}>{msg.timestamp}</span> {/* Ensure timestamp is visible */}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input Area - Use CardFooter for consistency */} 
        <div className="p-4 border-t border-gray-200 bg-background"> {/* Consistent bg */}
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()} // Send on Enter, not Shift+Enter
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
          <p className="mt-2 text-xs text-gray-500">
            (Note: Interactions are simulated. Select replicas above.)
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChatroomPage;
