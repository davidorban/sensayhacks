"use client";
import React, { useState } from 'react';

export const metadata = {
  title: 'Token-Gated Memories | Sensay Proto',
};

const TokenGatedMemoriesPage = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = () => {
    setIsLoading(true);
    console.log("(Mock) Initiating $SNSY unlock process...");

    // Simulate unlock delay
    setTimeout(() => {
      console.log("(Mock) Unlock successful!");
      setIsUnlocked(true);
      setIsLoading(false);
    }, 2000); // 2 second delay
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> 
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Token-Gated Memories (Mock)</h1> 
      <p className="mb-6 text-sm text-gray-300"> 
        Concept: Demonstrates accessing exclusive content (memories) by requiring a mock payment/unlock using $SNSY tokens.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-lg flex-1 flex flex-col">
        
        <div className={`p-6 border rounded-lg shadow-sm transition-colors flex-1 flex flex-col ${isUnlocked ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
          }`}>
          <h2 className={`text-xl font-semibold mb-3 flex items-center ${isUnlocked ? 'text-green-700' : 'text-red-700'}`}>
            {isUnlocked ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v3m-6-3h12a2 2 0 002-2v-4a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
            Memory Access Status: {isUnlocked ? 'Unlocked' : 'Locked'}
          </h2>

          {isUnlocked ? (
            <div className="flex-1 p-4 bg-white border border-gray-200 rounded-md shadow-md mt-4 space-y-2">
              <p className="text-green-800 font-medium">Exclusive Memory Content:</p>
              <ul className="list-disc list-inside text-gray-700 pl-4">
                <li>(Mock) Secret strategy for project Alpha.</li>
                <li>(Mock) Notes from the 2024 offsite.</li>
                <li>(Mock) Early draft of the new feature proposal.</li>
              </ul>
            </div>
          ) : (
            <div className="flex-1 mt-4 flex flex-col items-center justify-center"> 
              <p className="text-red-800 mb-4 text-center">You need to unlock access to view these exclusive memories.</p>
              <button
                onClick={handleUnlock}
                disabled={isLoading}
                className={`px-5 py-2 rounded-md text-white font-semibold transition-colors flex items-center justify-center
                  ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Unlocking...
                  </>
                ) : (
                  'Unlock with $SNSY (Mock)'
                )}
              </button>
            </div>
          )}
        </div> 

        <p className="mt-4 text-sm text-gray-500 text-center"> 
          (Note: $SNSY interaction is simulated.)
        </p>
      </div>
    </div>
  );
};

export default TokenGatedMemoriesPage;
