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
    <main className="flex flex-col items-center p-8 sm:p-12 md:p-16 lg:p-24 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Sensay Hackathon Ideas Showcase</h1>
        <p className="text-lg text-gray-700 mb-8">
          This project showcases various UI prototypes for potential Sensay features, built using Next.js 14 (App Router), TypeScript, and Tailwind CSS.
          Use the sidebar to explore the different mock prototypes.
        </p>

        <div className="mb-12 text-left inline-block">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Prototypes:</h2>
          <ul className="list-disc list-inside space-y-2">
            {prototypes.map((proto) => (
              <li key={proto.path}>
                <Link href={proto.path} className="text-indigo-600 hover:text-indigo-800 hover:underline">
                  {proto.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t border-gray-300 pt-8">
          <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-4 rounded-md shadow-sm max-w-2xl mx-auto">
            <strong>Important Note:</strong> All interactions involving backend processes, token transactions, voice processing, or actual AI responses are <strong>simulated</strong> within the frontend for demonstration purposes.
          </p>
        </div>

      </div>
    </main>
  );
}
