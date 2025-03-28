import Link from 'next/link';

const Sidebar = () => {
  const prototypes = [
    { name: 'Replica Task Memory', path: '/prototypes/ReplicaTaskMemory' },
    { name: 'Pure Voice', path: '/prototypes/PureVoice' },
    { name: 'MCP Client/Server', path: '/prototypes/MCPClient' },
    { name: 'Token-Gated Memories', path: '/prototypes/TokenGatedMemories' },
    { name: 'Token-Guided Evolution', path: '/prototypes/TokenGuidedEvolution' },
    { name: 'Bonding Replicas', path: '/prototypes/BondingReplicas' },
    { name: 'Chatroom', path: '/prototypes/Chatroom' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-5 fixed left-0 top-0">
      <h2 className="text-xl font-semibold mb-6">Prototypes</h2>
      <nav>
        <ul>
          <li className="mb-3">
            <Link href="/" className="hover:text-gray-300">
              Dashboard
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
    </div>
  );
};

export default Sidebar;
