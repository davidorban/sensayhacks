"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageCircle, Users, Settings, Zap, BrainCircuit } from 'lucide-react';

const ChatroomConceptPage = () => {
  const [isLoading] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Sensay Chatroom Concept</h1>
      <p className="mb-6 text-sm text-gray-300">
        A dedicated space for real-time conversations between users and multiple Sensay replicas.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Sensay Chatroom Interface</CardTitle>
            <CardDescription>
              Enabling fluid, multi-participant conversations in a familiar chat environment
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="interface">Interface</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">The Chatroom Experience</h3>
                <p>
                  The Sensay Chatroom provides a familiar messaging interface that supports rich, multi-participant conversations between users and multiple AI replicas. Unlike traditional chatbots, the Sensay Chatroom creates a space where conversations can flow naturally between all participants, with each replica bringing its unique expertise and perspective.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <MessageCircle className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Natural Conversation</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Fluid, contextual dialogue that mimics human group chats, with seamless turn-taking and topic transitions.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Multi-Participant</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Support for multiple human users and AI replicas in the same conversation, each with distinct identities.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <BrainCircuit className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Collective Intelligence</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Replicas collaborate to provide richer insights and solutions than would be possible through one-on-one interactions.</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-indigo-700">Key Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-indigo-800 mt-0 mb-2">For Teams</h4>
                    <ul className="list-disc pl-5 mb-0">
                      <li>Collaborative problem-solving with specialized AI expertise</li>
                      <li>Persistent conversation history for institutional memory</li>
                      <li>Asynchronous collaboration across time zones</li>
                      <li>Reduced meeting time with AI-facilitated discussions</li>
                      <li>Knowledge sharing across departmental boundaries</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-indigo-800 mt-0 mb-2">For Individuals</h4>
                    <ul className="list-disc pl-5 mb-0">
                      <li>Access to diverse perspectives in a single conversation</li>
                      <li>More engaging and dynamic AI interactions</li>
                      <li>Ability to observe expert discussions on topics of interest</li>
                      <li>Personalized advisory panels for important decisions</li>
                      <li>Reduced context-switching between different AI tools</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Core Features</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Conversation Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <MessageCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Thread Organization</h5>
                        <p className="text-sm text-gray-700 m-0">Maintain coherent discussion structure with topic threading and organization</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Participant Management</h5>
                        <p className="text-sm text-gray-700 m-0">Add or remove replicas and human participants as needed</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Collaboration Modes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <MessageCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Moderated</h5>
                        <p className="text-sm text-gray-700 m-0">One replica acts as facilitator, directing the conversation flow</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Democratic</h5>
                        <p className="text-sm text-gray-700 m-0">All replicas contribute equally to the discussion</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Settings className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Structured</h5>
                        <p className="text-sm text-gray-700 m-0">Following specific protocols (e.g., Six Thinking Hats, SWOT analysis)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Zap className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Adversarial</h5>
                        <p className="text-sm text-gray-700 m-0">Replicas intentionally take opposing viewpoints to explore tensions</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">User Experience Features</h4>
                  <ul className="list-disc pl-5 mb-0">
                    <li><strong>Rich Media Support:</strong> Share images, documents, and links within conversations</li>
                    <li><strong>Conversation History:</strong> Searchable archive of past discussions</li>
                    <li><strong>Notification System:</strong> Alerts for important developments or when mentioned</li>
                    <li><strong>Summarization:</strong> AI-generated summaries of lengthy discussions</li>
                    <li><strong>Bookmarking:</strong> Save important messages or insights for later reference</li>
                    <li><strong>Export Options:</strong> Save conversations in various formats (PDF, Markdown, etc.)</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="interface" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Interface Design</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Main Components</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="font-semibold text-indigo-700 mb-2">Chat Area</h5>
                      <div className="bg-white p-3 rounded-lg border border-gray-300 mb-2">
                        <div className="flex items-start mb-3">
                          <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                            <span className="text-blue-600 font-semibold">U</span>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-2 text-sm">
                            How should we approach the market expansion into Europe?
                          </div>
                        </div>
                        
                        <div className="flex items-start mb-3">
                          <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                            <span className="text-indigo-600 font-semibold">M</span>
                          </div>
                          <div className="bg-indigo-50 rounded-lg p-2 text-sm">
                            We should analyze the regulatory landscape first. Each country has different requirements.
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                            <span className="text-purple-600 font-semibold">F</span>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2 text-sm">
                            I agree, but we should also consider our budget constraints and prioritize markets.
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic">Messages are clearly attributed to different participants with visual distinction.</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-indigo-700 mb-2">Participant Panel</h5>
                      <div className="bg-white p-3 rounded-lg border border-gray-300 mb-2">
                        <div className="text-xs uppercase font-semibold text-gray-500 mb-2">Active Participants</div>
                        
                        <div className="flex items-center mb-2 p-1 rounded hover:bg-gray-100">
                          <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                            <span className="text-blue-600 font-semibold text-xs">U</span>
                          </div>
                          <div className="text-sm">User (You)</div>
                        </div>
                        
                        <div className="flex items-center mb-2 p-1 rounded hover:bg-gray-100">
                          <div className="bg-indigo-100 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                            <span className="text-indigo-600 font-semibold text-xs">M</span>
                          </div>
                          <div className="text-sm">Market Analyst</div>
                        </div>
                        
                        <div className="flex items-center p-1 rounded hover:bg-gray-100">
                          <div className="bg-purple-100 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                            <span className="text-purple-600 font-semibold text-xs">F</span>
                          </div>
                          <div className="text-sm">Financial Advisor</div>
                        </div>
                        
                        <div className="mt-3 text-center">
                          <button className="text-xs text-indigo-600 hover:text-indigo-800">+ Add Participant</button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic">Users can see who's in the conversation and add new participants.</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <h5 className="font-semibold text-indigo-700 mb-2">Input Area</h5>
                    <div className="bg-white p-3 rounded-lg border border-gray-300 mb-2">
                      <div className="flex items-center mb-2">
                        <button className="p-1 text-gray-500 hover:text-indigo-600 mr-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </button>
                        <button className="p-1 text-gray-500 hover:text-indigo-600 mr-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>
                        <button className="p-1 text-gray-500 hover:text-indigo-600 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                          </svg>
                        </button>
                        <div className="flex-grow relative">
                          <input type="text" placeholder="Type your message..." className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                          <button className="absolute right-2 top-2 text-indigo-600 hover:text-indigo-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Press Enter to send, Shift+Enter for new line
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 italic">Rich input options with support for media and formatting.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Interface Innovations</h4>
                  <ul className="list-disc pl-5 mb-0">
                    <li><strong>Thinking Indicators:</strong> Visual cues showing when replicas are processing or "thinking"</li>
                    <li><strong>Conversation Flow Visualization:</strong> Optional view showing how topics connect and evolve</li>
                    <li><strong>Participant Insights:</strong> Quick access to each replica's expertise and perspective</li>
                    <li><strong>Context Awareness:</strong> Interface adapts based on conversation topic and goals</li>
                    <li><strong>Accessibility Features:</strong> Support for screen readers, keyboard navigation, and other accessibility needs</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Technical Framework</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Architecture Components</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <BrainCircuit className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Replica Differentiation</h5>
                        <p className="text-sm text-gray-700 m-0">Technical mechanisms for creating distinct AI personalities, expertise areas, and communication styles</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <MessageCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Conversation Management</h5>
                        <p className="text-sm text-gray-700 m-0">Systems for thread organization, balance mechanisms, and semantic analysis</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Human Integration</h5>
                        <p className="text-sm text-gray-700 m-0">Notification systems, intervention options, and summarization capabilities</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Settings className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">System Integration</h5>
                        <p className="text-sm text-gray-700 m-0">APIs and webhooks for connecting with external tools and data sources</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Technical Challenges & Solutions</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 px-3 text-indigo-700">Challenge</th>
                          <th className="text-left py-2 px-3 text-indigo-700">Solution</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3 text-sm font-medium">Maintaining distinct replica identities</td>
                          <td className="py-2 px-3 text-sm">Persistent state management with specialized prompting techniques</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3 text-sm font-medium">Natural conversation flow</td>
                          <td className="py-2 px-3 text-sm">Turn-taking algorithms with semantic analysis for relevance</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3 text-sm font-medium">Scalability with multiple participants</td>
                          <td className="py-2 px-3 text-sm">Efficient context management and selective attention mechanisms</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3 text-sm font-medium">Real-time responsiveness</td>
                          <td className="py-2 px-3 text-sm">Optimized inference with progressive message generation</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-sm font-medium">Knowledge consistency</td>
                          <td className="py-2 px-3 text-sm">Shared knowledge base with specialized access patterns per replica</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Implementation Considerations</h4>
                  <ul className="list-disc pl-5 mb-0">
                    <li><strong>Privacy & Security:</strong> End-to-end encryption and robust data handling practices</li>
                    <li><strong>Scalability:</strong> Architecture designed to handle multiple concurrent chatrooms</li>
                    <li><strong>Performance:</strong> Optimized for low-latency responses even with multiple participants</li>
                    <li><strong>Extensibility:</strong> Plugin system for adding new capabilities and integrations</li>
                    <li><strong>Analytics:</strong> Tools for measuring conversation quality and participant engagement</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatroomConceptPage;
