import Link from 'next/link';

export default function Home() {
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold mb-6">Sensay Hackathon Ideas Showcase</h1>
        <p className="mb-8 text-lg">
          Welcome! This showcase presents UI mockups for various Sensay platform ideas explored during the hackathon.
          Use the sidebar to navigate between the different prototypes.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Available Prototypes:</h2>
        <ul className="list-disc list-inside space-y-2">
          {prototypes.map((proto) => (
            <li key={proto.path}>
              <Link href={proto.path} className="text-blue-500 hover:underline">
                {proto.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
