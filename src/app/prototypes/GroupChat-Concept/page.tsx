"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, GitMerge, Zap, MessageCircle, BrainCircuit, Clock } from 'lucide-react';

const GroupChatConceptPage = () => {
  const [isLoading] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Sensay Group Chat Concept</h1>
      <p className="mb-6 text-sm text-gray-300">
        Collaborative intelligence between multiple digital replicas working together to solve problems, generate insights, and create unique value.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Sensay Replica Group Chat</CardTitle>
            <CardDescription>
              Multiple replicas collaborating to provide richer insights and solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Core Concept</h3>
                <p>
                  The Sensay Replica Group Chat introduces a compelling new dimension to AI interaction - collaborative intelligence between multiple digital replicas working together to solve problems, generate insights, and create unique value through their collective abilities.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Collective Intelligence</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Multiple replicas with distinct expertise collaborate to provide richer, more nuanced outcomes than one-on-one interactions.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <GitMerge className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Diverse Perspectives</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Replicas with different expertise areas approach problems from complementary angles for comprehensive analysis.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Asynchronous Collaboration</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Replicas work through problems over time, notifying humans when solutions are ready, allowing for efficient delegation.</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-indigo-700">Key Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-indigo-800 mt-0 mb-2">For Enterprises</h4>
                    <ul className="list-disc pl-5 mb-0">
                      <li>Richer problem exploration from multiple angles</li>
                      <li>Knowledge synthesis across departmental boundaries</li>
                      <li>Process improvement by identifying gaps and opportunities</li>
                      <li>Institutional memory preserving complex reasoning chains</li>
                      <li>24/7 collaboration even when humans are offline</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-indigo-800 mt-0 mb-2">For Individuals</h4>
                    <ul className="list-disc pl-5 mb-0">
                      <li>Personal growth through deeper insights into challenges</li>
                      <li>Decision support with balanced, diverse input</li>
                      <li>Learning enhancement by observing expert discussions</li>
                      <li>Entertainment from watching interesting conversations</li>
                      <li>Emotional support with varied perspectives during difficult times</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="scenarios" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Enterprise Collaboration Scenario</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <p className="italic text-gray-700 mb-3">
                    "I need to figure out how to respond to Competitor X's new product launch. Let me delegate this to my strategy team."
                  </p>
                  
                  <p className="mb-3">
                    Imagine a business leader who needs to develop a strategic response to a market disruption. Rather than consulting a single AI assistant, they create a working group of specialized Sensay replicas:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h5 className="font-semibold text-indigo-700 mb-2">The Team</h5>
                      <ul className="list-disc pl-5">
                        <li>Market analysis expert</li>
                        <li>Competitive intelligence specialist</li>
                        <li>Product development strategist</li>
                        <li>Financial modeling analyst</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-indigo-700 mb-2">The Process</h5>
                      <ul className="list-disc pl-5">
                        <li>Leader provides initial brief and key documents</li>
                        <li>Replicas work through the problem together</li>
                        <li>Each contributes their specialized expertise</li>
                        <li>Leader attends to other priorities</li>
                        <li>Receives notification when consensus is reached</li>
                      </ul>
                    </div>
                  </div>
                  
                  <p>
                    Hours later, the leader receives a notification that the replica team has reached consensus on a recommended approach. They can review the entire conversation thread to understand the reasoning process, or simply review the final recommendations.
                  </p>
                </div>
                
                <h3 className="text-xl font-semibold text-indigo-700">Personal Advisory Scenario</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="mb-3">
                    In personal settings, this group chat capability creates tremendous value by replicating how we naturally seek diverse perspectives on important life decisions.
                  </p>
                  
                  <p className="mb-3">
                    A person considering a career change might create a group chat with replica advisors representing different perspectives:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-indigo-700 mb-1">Risk-taking Entrepreneur</h5>
                      <p className="text-sm text-gray-700 m-0">Highlights opportunities and encourages bold moves</p>
                    </div>
                    
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-indigo-700 mb-1">Financial Planning Expert</h5>
                      <p className="text-sm text-gray-700 m-0">Analyzes financial implications and security concerns</p>
                    </div>
                    
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-indigo-700 mb-1">Work-Life Balance Coach</h5>
                      <p className="text-sm text-gray-700 m-0">Considers lifestyle impact and personal fulfillment</p>
                    </div>
                  </div>
                  
                  <p>
                    As they share their situation, these replicas engage in dialogue, revealing nuances the person might not have considered on their own, leading to a more balanced decision.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="dynamics" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Conversation Dynamics</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Initiation</h4>
                  <ol className="list-decimal pl-5 mb-0">
                    <li>User creates a group chat with a specific topic or question</li>
                    <li>User selects which replicas to include (either pre-existing or purpose-created)</li>
                    <li>User provides initial context, questions, or resources</li>
                    <li>User decides whether to participate actively or review later</li>
                  </ol>
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
                        <GitMerge className="h-5 w-5 text-indigo-600" />
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
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Termination Mechanisms</h4>
                  <p className="mb-3">
                    What makes the group chat concept particularly powerful is how it handles conversation flow and termination:
                  </p>
                  <ol className="list-decimal pl-5 mb-4">
                    <li><strong>Natural Progression:</strong> Just as human conversations flow through exploration, debate, and resolution phases</li>
                    <li><strong>Self-Regulation:</strong> Replicas can assess when they're making progress or getting stuck</li>
                    <li><strong>Consensus Detection:</strong> Through semantic analysis, replicas recognize when they've reached agreement</li>
                    <li><strong>Appropriate Conclusion:</strong> Replicas themselves determine when further discussion would add little value</li>
                  </ol>
                  
                  <p className="mb-2">Additional termination approaches include:</p>
                  <ul className="list-disc pl-5 mb-0">
                    <li><strong>Goal Achievement:</strong> Conversation ends when specific objectives are accomplished</li>
                    <li><strong>Time/Depth Limits:</strong> Predefined constraints on conversation length</li>
                    <li><strong>User Intervention:</strong> Human decides when to conclude the discussion</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Technical Framework</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Replica Differentiation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <BrainCircuit className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Specialization</h5>
                        <p className="text-sm text-gray-700 m-0">Expertise in different subject areas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Personality</h5>
                        <p className="text-sm text-gray-700 m-0">Varied communication styles and approaches</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <MessageCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Knowledge Base</h5>
                        <p className="text-sm text-gray-700 m-0">Access to different information sources</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Zap className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-indigo-700 mt-0 mb-1">Reasoning Styles</h5>
                        <p className="text-sm text-gray-700 m-0">Analytical, creative, critical, practical, etc.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Conversation Management</h4>
                  <ul className="list-disc pl-5 mb-0">
                    <li><strong>Thread Organization:</strong> Maintaining coherent discussion structure</li>
                    <li><strong>Balance Mechanisms:</strong> Ensuring all replicas contribute appropriately</li>
                    <li><strong>Progress Tracking:</strong> Monitoring advancement toward goals</li>
                    <li><strong>Semantic Analysis:</strong> Detecting repetition, novelty, and convergence</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Human Integration</h4>
                  <ul className="list-disc pl-5 mb-0">
                    <li><strong>Notification Systems:</strong> Alerting users when significant developments occur</li>
                    <li><strong>Intervention Options:</strong> Allowing humans to steer, redirect, or refocus discussions</li>
                    <li><strong>Summarization:</strong> Condensing long discussions into digestible insights</li>
                    <li><strong>Follow-up:</strong> Enabling humans to ask clarifying questions about the discussion</li>
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

export default GroupChatConceptPage;
