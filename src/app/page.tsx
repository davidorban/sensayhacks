import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Home | Sensay Proto',
};

export default function Home() {
  const prototypes = [
    { name: 'Replica Task Memory', path: '/prototypes/ReplicaTaskMemory' },
    { name: 'Pure Voice', path: '/prototypes/PureVoice' },
    { name: 'MCP', path: '/prototypes/MCP' },
    { name: 'Token-Gated Memories', path: '/prototypes/TokenGatedMemories' },
    { name: 'Token-Guided Evolution', path: '/prototypes/TokenGuidedEvolution' },
    { name: 'Bonding Replicas', path: '/prototypes/BondingReplicas' },
    { name: 'Chatroom', path: '/prototypes/Chatroom' },
  ].sort((a, b) => a.name.localeCompare(b.name)); // Keep sorted

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> {/* Outer Dark BG */}
      {/* Header Area */}
      <Image 
        className="mx-auto mb-8"
        src="/img/sensayhacks.jpg" 
        alt="Sensay Hacks Logo" 
        width={180} // Slightly smaller?
        height={90} 
        priority 
        unoptimized={true} 
      />
      {/* Remove wrapper div and Login Link */}
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-100">Sensay Hackathon Ideas Showcase</h1>
      <p className="text-lg text-gray-300 mb-4 text-center"> {/* Light Text */}
        This project showcases various UI prototypes for potential Sensay features, built using Next.js 14 (App Router), TypeScript, and Tailwind CSS.
      </p>
      <div className="flex justify-center gap-6 mb-8">
        <a href="https://davidorban.gitbook.io/sensayhacks" className="text-indigo-400 hover:text-indigo-300 underline">
          View Documentation →
        </a>
        <a href="https://github.com/davidorban/sensayhacks" className="text-indigo-400 hover:text-indigo-300 underline">
          View on GitHub →
        </a>
      </div>

      {/* Content Area - White Rounded Box */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex-1"> 
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Prototypes:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prototypes.map((proto) => (
            <Link key={proto.path} href={proto.path} className="block p-4 bg-gray-50 rounded-lg shadow hover:bg-gray-100 hover:shadow-md transition-all border border-gray-200">
                <h3 className="text-lg font-medium text-indigo-700 mb-1">{proto.name}</h3>
                {/* Optional: Add short description if available */}
                <p className="text-sm text-gray-600">Explore the {proto.name.toLowerCase()} concept.</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-8 pb-6 text-center text-gray-400 text-sm">
        <Link href="/privacy" className="hover:text-gray-200 mx-2">Privacy Policy</Link>
        |
        <Link href="/terms" className="hover:text-gray-200 mx-2">Terms & Conditions</Link>
        |
        <a href="https://davidorban.gitbook.io/sensayhacks" className="hover:text-gray-200 mx-2">Documentation</a>
        |
        <a href="https://github.com/davidorban/sensayhacks" className="hover:text-gray-200 mx-2">GitHub</a>
      </footer>

    </div>
  );
}
