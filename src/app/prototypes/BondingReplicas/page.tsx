// src/app/prototypes/BondingReplicas/page.tsx
"use client";

import React, { useState } from 'react';

const BondingReplicasPage = () => {
  const [isBonded, setIsBonded] = useState(false);
  const [sharedMemory, setSharedMemory] = useState<string[]>([]);

  const handleToggleBonding = () => {
    const newState = !isBonded;
    setIsBonded(newState);
    console.log(`(Mock) Bonding status toggled to: ${newState}`);

    // Simulate adding/removing shared memory when bonded/unbonded
    if (newState) {
      setSharedMemory([
        "(Mock) Shared memory: Project Phoenix deadline is approaching.",
        "(Mock) Shared feeling: Excitement about the upcoming launch."
      ]);
    } else {
      setSharedMemory([]);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bonding Replicas (Mock)</h1>
      <p className="mb-6 text-gray-600">Simulate the bonding of two replica instances, allowing shared memory/state.</p>

      <div className="mb-6 flex items-center space-x-4">
        <span className="font-medium flex items-center">
          {/* Link/Unlink Icon */} 
          {isBonded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 112.828-2.828l1.5 1.5 3-3zm-2.828 8.414a2 2 0 012.828 0l3 3a2 2 0 01-2.828 2.828l-3-3a2 2 0 010-2.828l-1.5-1.5a2 2 0 11-2.828 2.828l1.5 1.5z" clipRule="evenodd" />
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 112.828-2.828L12.586 7.5l3-3a2 2 0 012.828 0zM8.414 11.586a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0l1.5 1.5a2 2 0 11-2.828 2.828L8.414 10.5l-3 3a2 2 0 01-2.828 0z" clipRule="evenodd" />
            </svg>
          )}
          Bonding Status:
        </span>
        <button
          onClick={handleToggleBonding}
          className={`px-5 py-2 rounded-full text-white font-semibold text-sm transition-transform transform hover:scale-105
            ${isBonded ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}
          `}
        >
          {isBonded ? 'Bonded' : 'Not Bonded'}
        </button>
        <span className={`text-sm ${isBonded ? 'text-green-600' : 'text-gray-500'}`}>
          {isBonded ? 'Replicas are sharing insights.' : 'Replicas operating independently.'}
        </span>
      </div>

      <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm min-h-[120px]"> 
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Shared Memory Pool (Mock):</h2>
        {isBonded && sharedMemory.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-gray-600 pl-4">
            {sharedMemory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">
            {isBonded ? 'No shared memories yet.' : 'Bonding required to access shared memory.'}
          </p>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        (Note: Bonding interaction and shared memory are simulated.)
      </p>
    </div>
  );
};

export default BondingReplicasPage;
