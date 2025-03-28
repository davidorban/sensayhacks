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
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> 
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Bonding Replicas (Mock)</h1> 
      <p className="mb-6 text-sm text-gray-300"> 
        Concept: Simulates two or more Replicas interacting and sharing/updating a common state or &quot;bond&quot; (e.g., shared memory or goal).
      </p>
      <p className="mb-6 text-gray-400">Simulate the bonding of two replica instances, allowing shared memory/state.</p> 

      <div className="bg-white p-6 rounded-lg shadow-lg flex-1">

        <div className="mb-6 flex items-center space-x-4">
          <span className="font-medium flex items-center text-gray-700"> 
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
              ${isBonded ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} 
            `}
          >
            {isBonded ? 'Bonded' : 'Unbond'}
          </button>
          <span className={`text-sm ${isBonded ? 'text-green-600' : 'text-gray-600'}`}> 
            {isBonded ? 'Replicas are sharing insights.' : 'Replicas operating independently.'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"> 
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Replica 1</h2>
            <p className="text-sm text-gray-600 mb-3">Status: <span className="font-medium">{isBonded ? 'Bonded' : 'Not Bonded'}</span></p>
          </div>

          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"> 
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Replica 2</h2>
            <p className="text-sm text-gray-600 mb-3">Status: <span className="font-medium">{isBonded ? 'Bonded' : 'Not Bonded'}</span></p>
          </div>

          <div className="p-4 border border-dashed border-indigo-400 rounded-lg bg-indigo-50 shadow-sm flex flex-col justify-center items-center"> 
            <h2 className="text-lg font-semibold mb-2 text-indigo-700">Shared Bond (Mock)</h2>
            <p className="text-center text-sm text-indigo-800 mb-1">{isBonded ? 'Bonded' : 'Not Bonded'}</p>
          </div>
        </div>

        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm min-h-[100px]"> 
          <h3 className="text-md font-semibold mb-2 text-gray-700">Shared Memory Pool (Mock):</h3>
          {isBonded && sharedMemory.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-4">
              {sharedMemory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic"> 
              {isBonded ? 'No shared memories yet.' : 'Bonding required to access shared memory.'}
            </p>
          )}
        </div>

        <p className="mt-6 text-sm text-gray-500"> 
          (Note: Bonding interaction and shared memory are simulated.)
        </p>
      </div>
    </div>
  );
};

export default BondingReplicasPage;
