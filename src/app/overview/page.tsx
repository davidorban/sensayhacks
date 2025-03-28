import React from 'react';
import Link from 'next/link';

// Add metadata for the page title
export const metadata = {
  title: 'Prototypes Overview | Sensay Proto',
};

const OverviewPage = () => {
  const prototypes = [
    { name: 'Replica Task Memory', description: 'A chat interface where a Replica assists with tasks, demonstrating persistent memory and task management.' },
    { name: 'Pure Voice', description: 'Simulates a voice-only interaction with a Replica, focusing on speech-to-text and text-to-speech capabilities.' },
    { name: 'MCP Client/Server', description: 'Showcases a mock client interacting with a simulated Master Control Program (MCP) for managing Replica actions.' },
    { name: 'Token-Gated Memories', description: 'Demonstrates unlocking special Replica memories or features using mock $SNSY tokens.' },
    { name: 'Token-Guided Evolution', description: 'Illustrates how mock $SNSY tokens can be used to guide a Replica\'s personality or capability evolution.' },
    { name: 'Bonding Replicas', description: 'Explores the concept of two Replicas forming a bond and sharing information or capabilities.' },
    { name: 'Chatroom', description: 'A multi-participant chat environment involving a user and multiple Replicas.' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-100">Sensay Hackathon Prototypes Overview</h1>
        <p className="text-lg text-gray-300 mt-2">
          Welcome! This application showcases various UI prototypes for potential Sensay features.
          Full access to interact with these prototypes is currently limited to Sensay team members.
        </p>
         <p className="text-md text-gray-400 mt-4">
          If you believe you should have access, please ensure you are logged in with your @sensay.io email address or contact the project administrator.
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Prototype Descriptions:</h2>
        <div className="space-y-4">
          {prototypes.map((proto) => (
            <div key={proto.name} className="border border-gray-200 rounded p-4">
              <h3 className="text-xl font-medium text-gray-700">{proto.name}</h3>
              <p className="text-gray-600 mt-1">{proto.description}</p>
            </div>
          ))}
        </div>
      </div>

       {/* Optional: Link back to home or offer logout */}
       <div className="mt-6 text-center">
         <Link href="/" className="text-indigo-400 hover:text-indigo-300 mx-2">Back to Home</Link>
         {/* Logout functionality will be added later */}
       </div>
    </div>
  );
};

export default OverviewPage;
