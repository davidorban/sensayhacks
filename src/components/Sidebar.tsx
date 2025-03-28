import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const Sidebar = ({ children }: { children?: React.ReactNode }) => {
  const prototypes = [
    { name: 'Bonding Replicas', path: '/prototypes/BondingReplicas' },
    { name: 'Chatroom', path: '/prototypes/Chatroom' },
    { name: 'MCP Client/Server', path: '/prototypes/MCPClient' },
    { name: 'Pure Voice', path: '/prototypes/PureVoice' },
    { name: 'Replica Task Memory', path: '/prototypes/ReplicaTaskMemory' },
    { name: 'Token-Gated Memories', path: '/prototypes/TokenGatedMemories' },
    { name: 'Token-Guided Evolution', path: '/prototypes/TokenGuidedEvolution' },
  ];

  // Sort prototypes alphabetically by name
  prototypes.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 flex flex-col">
      <h2 className="text-xl font-semibold mb-6">Prototypes</h2>
      <nav className="flex-grow">
        <ul>
          <li className="mb-3">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          {prototypes.map((proto) => (
            <li key={proto.path} className="mb-3">
              <Link href={proto.path} className="hover:text-gray-300">
                {proto.name}
              </Link>
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
