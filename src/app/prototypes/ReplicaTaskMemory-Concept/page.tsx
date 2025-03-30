"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Database, Brain, Clock, Shield, Zap } from 'lucide-react';

const ReplicaTaskMemoryConceptPage = () => {
  const [isLoading] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Replica Task Memory Concept</h1>
      <p className="mb-6 text-sm text-gray-300">
        Exploring how AI replicas can maintain persistent task memory across conversations.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Replica Task Memory</CardTitle>
            <CardDescription>
              A framework for AI replicas to maintain persistent task memory in a database
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Core Concept</h3>
                <p>
                  Replica Task Memory is a framework that enables AI replicas to maintain persistent memory of tasks and commitments across multiple conversations. This creates a continuous experience where the replica can recall, track, and update tasks without requiring users to remind it of previous commitments.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Database className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Persistent Storage</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Tasks are stored in a database, ensuring they persist beyond the current session and can be retrieved in future interactions.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Brain className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Contextual Understanding</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">The replica intelligently interprets conversations to identify, track, and update tasks without explicit commands.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Temporal Awareness</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Tasks can include time-based attributes like deadlines, allowing the replica to provide timely reminders and updates.</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-indigo-700">Key Benefits</h3>
                <ul>
                  <li>Eliminates the need for users to repeatedly remind the replica about ongoing tasks</li>
                  <li>Creates a more natural, human-like interaction where past commitments are remembered</li>
                  <li>Enables proactive assistance based on previously established tasks and goals</li>
                  <li>Provides a unified view of all tasks across multiple conversations</li>
                  <li>Allows for task prioritization and organization based on context and importance</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="mechanics" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">How Task Memory Works</h3>
                <p>
                  The task memory system operates through a combination of natural language understanding, database operations, and contextual awareness.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Task Lifecycle</h4>
                  <ol className="list-decimal pl-5 mb-0">
                    <li>Task Identification: Replica analyzes conversations to identify task-related intentions</li>
                    <li>Task Creation: New tasks are stored in the database with relevant attributes</li>
                    <li>Task Tracking: Replica maintains awareness of all active tasks</li>
                    <li>Status Updates: Tasks are updated based on subsequent conversations</li>
                    <li>Task Completion: Tasks are marked as complete when finished</li>
                  </ol>
                </div>
                
                <h4 className="font-semibold text-indigo-700 mt-4">Types of Task Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h5 className="font-semibold text-indigo-700 mb-2">Core Task Properties</h5>
                    <ul className="list-disc pl-5 mb-0">
                      <li>Task description and details</li>
                      <li>Creation timestamp</li>
                      <li>Completion status</li>
                      <li>Priority level</li>
                      <li>Associated categories or tags</li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h5 className="font-semibold text-indigo-700 mb-2">Extended Attributes</h5>
                    <ul className="list-disc pl-5 mb-0">
                      <li>Deadlines and due dates</li>
                      <li>Dependencies on other tasks</li>
                      <li>Related resources or links</li>
                      <li>Subtasks and completion progress</li>
                      <li>Conversation context when created</li>
                    </ul>
                  </div>
                </div>
                
                <h4 className="font-semibold text-indigo-700 mt-4">Task Memory Management</h4>
                <p>
                  The system includes various controls for managing task memory:
                </p>
                <ul>
                  <li><strong>User Controls:</strong> Ability to explicitly add, modify, or delete tasks</li>
                  <li><strong>Implicit Updates:</strong> Tasks automatically updated based on conversation context</li>
                  <li><strong>Task Organization:</strong> Automatic categorization and prioritization of tasks</li>
                  <li><strong>Memory Cleanup:</strong> Archiving of completed or outdated tasks</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="applications" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Real-World Applications</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Personal Productivity</h4>
                  <p className="mb-2">
                    For individual users, task memory creates a reliable personal assistant experience:
                  </p>
                  <div className="bg-white p-3 rounded border border-gray-100 mb-2">
                    <p className="italic text-gray-700 mb-2">
                      "I mentioned needing to call my doctor last week, and today my AI replica reminded me that I hadn't done it yet. It even suggested a good time based on my calendar."
                    </p>
                    <p className="text-sm text-gray-600 mb-0">
                      — Hypothetical User
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mb-0">
                    This continuity of memory creates a more natural and helpful assistant experience.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Project Management</h4>
                  <p className="mb-2">
                    In professional settings, task memory enables more effective collaboration:
                  </p>
                  <ul className="list-disc pl-5 mb-0">
                    <li>Teams can use a shared replica to track project tasks and deadlines</li>
                    <li>The replica maintains awareness of who is responsible for each task</li>
                    <li>Progress updates are automatically tracked through natural conversations</li>
                    <li>The replica can proactively check on task status and send reminders</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Customer Support</h4>
                  <p className="mb-2">
                    Task memory enhances customer service experiences:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-indigo-700 mb-1">Issue Tracking</h5>
                      <p className="text-sm text-gray-700 mb-0">
                        Customer support replicas remember reported issues and follow up on resolutions, even across multiple conversations.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-indigo-700 mb-1">Request Fulfillment</h5>
                      <p className="text-sm text-gray-700 mb-0">
                        When customers request information that takes time to gather, the replica remembers to provide it in subsequent interactions.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Technical Implementation</h3>
                <p>
                  Implementing the Replica Task Memory framework involves several key technical components:
                </p>
                
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 my-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Database Schema</h4>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "tasks": [
    {
      "id": "task-12345",
      "userId": "user-abc123",
      "text": "Schedule quarterly review meeting",
      "completed": false,
      "created_at": "2025-03-28T10:30:00Z",
      "updated_at": "2025-03-30T14:15:00Z",
      "deadline": "2025-04-05T00:00:00Z",
      "priority": "high",
      "tags": ["work", "meetings"]
    }
  ]
}`}
                  </pre>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Zap className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Natural Language Processing</h4>
                    </div>
                    <ul className="list-disc pl-5 mb-0">
                      <li>Intent recognition for task-related requests</li>
                      <li>Entity extraction for task details</li>
                      <li>Context tracking across conversation turns</li>
                      <li>Temporal expression parsing for deadlines</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Security Considerations</h4>
                    </div>
                    <ul className="list-disc pl-5 mb-0">
                      <li>User authentication for task access</li>
                      <li>Data encryption for sensitive task details</li>
                      <li>Permission controls for shared tasks</li>
                      <li>Compliance with data retention policies</li>
                    </ul>
                  </div>
                </div>
                
                <h4 className="font-semibold text-indigo-700 mt-4">Integration with Sensay Platform</h4>
                <p>
                  The Replica Task Memory framework integrates with the broader Sensay ecosystem:
                </p>
                <ul>
                  <li><strong>API Integration:</strong> RESTful endpoints for task management</li>
                  <li><strong>Real-time Updates:</strong> WebSocket connections for immediate task changes</li>
                  <li><strong>Cross-replica Sharing:</strong> Task information can be shared between bonded replicas</li>
                  <li><strong>Analytics:</strong> Insights into task completion rates and patterns</li>
                </ul>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                  <h4 className="font-semibold text-indigo-800 mt-0 mb-2">Sample Implementation Code</h4>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// Example of task management in a conversation
const handleUserMessage = async (userId, message) => {
  // Process the message to identify task-related intents
  const nlpResult = await nlpService.analyze(message);
  
  if (nlpResult.intent === 'create_task') {
    // Extract task details from the message
    const taskText = nlpResult.entities.task_description;
    const deadline = nlpResult.entities.deadline;
    
    // Create a new task in the database
    const task = await taskRepository.create({
      userId,
      text: taskText,
      completed: false,
      deadline: deadline,
      created_at: new Date().toISOString()
    });
    
    return {
      reply: \`I've added "\${taskText}" to your tasks.\`,
      tasks: await taskRepository.getAllForUser(userId)
    };
  }
  
  if (nlpResult.intent === 'complete_task') {
    // Find and update the task
    const taskId = await findTaskByDescription(
      userId, 
      nlpResult.entities.task_description
    );
    
    if (taskId) {
      await taskRepository.update(taskId, { 
        completed: true,
        updated_at: new Date().toISOString()
      });
      
      return {
        reply: "Great job! I've marked that task as complete.",
        tasks: await taskRepository.getAllForUser(userId)
      };
    }
  }
  
  // Handle other task-related intents...
};`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReplicaTaskMemoryConceptPage;
