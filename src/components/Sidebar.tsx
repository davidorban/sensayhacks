"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = ({ children }: { children?: React.ReactNode }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'MCP': true, // Default expanded
  });

  const prototypes = [
    { 
      name: 'Bonding Replicas', 
      children: [
        { name: 'Concept', path: '/prototypes/BondingReplicas-Concept' },
        { name: 'Prototype', path: '/prototypes/BondingReplicas' }
      ]
    },
    { 
      name: 'Chatroom', 
      children: [
        { name: 'Concept', path: '/prototypes/Chatroom-Concept' },
        { name: 'Prototype', path: '/prototypes/Chatroom' }
      ]
    },
    { 
      name: 'MCP', 
      children: [
        { name: 'Concept', path: '/prototypes/MCP-Concept' },
        { name: 'Prototype', path: '/prototypes/MCP' }
      ]
    },
    { 
      name: 'Pure Voice', 
      children: [
        { name: 'Concept', path: '/prototypes/PureVoice-Concept' },
        { name: 'Prototype', path: '/prototypes/PureVoice' }
      ]
    },
    { 
      name: 'Replica Task Memory', 
      children: [
        { name: 'Concept', path: '/prototypes/ReplicaTaskMemory-Concept' },
        { name: 'Prototype', path: '/prototypes/ReplicaTaskMemory' }
      ]
    },
    { 
      name: 'Token-Gated Memories', 
      children: [
        { name: 'Concept', path: '/prototypes/TokenGatedMemories-Concept' },
        { name: 'Prototype', path: '/prototypes/TokenGatedMemories' }
      ]
    },
    { 
      name: 'Token-Guided Evolution', 
      children: [
        { name: 'Concept', path: '/prototypes/TokenGuidedEvolution-Concept' },
        { name: 'Prototype', path: '/prototypes/TokenGuidedEvolution' }
      ]
    },
  ];

  // Sort prototypes alphabetically by name
  prototypes.sort((a, b) => a.name.localeCompare(b.name));

  const toggleExpand = (item: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 flex flex-col">
      <h2 className="text-xl font-semibold mb-6">Prototypes</h2>
      <nav className="flex-grow">
        <ul className="space-y-1">
          <li className="mb-3">
            <Link href="/" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
              Home
            </Link>
          </li>
          {prototypes.map((proto) => (
            <li key={proto.name} className="mb-1">
              <div 
                className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => toggleExpand(proto.name)}
              >
                <span>{proto.name}</span>
                <span className="text-gray-400">
                  {expandedItems[proto.name] ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </span>
              </div>
              {expandedItems[proto.name] && proto.children && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-2">
                  {proto.children.map((child) => (
                    <li key={child.path}>
                      <Link 
                        href={child.path} 
                        className="flex items-center px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        {/* Logo at the bottom */}
        <div className="mb-4">
          <Image 
            src="/img/sensayhacks.jpg" 
            alt="Sensay Hacks Logo" 
            width={200} 
            height={50} 
            style={{ objectFit: 'contain' }}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
