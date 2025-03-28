"use client";

import React, { useState } from 'react';

const TokenGuidedEvolutionPage = () => {
  const [evolutionStage, setEvolutionStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const handleEvolve = (targetStage: number) => {
    setIsLoading(true);
    setConfirmation('');
    console.log(`(Mock) Initiating evolution to Stage ${targetStage} using $SNSY...`);

    // Simulate payment and evolution delay
    setTimeout(() => {
      console.log(`(Mock) Evolution to Stage ${targetStage} successful!`);
      setEvolutionStage(targetStage);
      setConfirmation(`Successfully evolved to Stage ${targetStage}!`);
      setIsLoading(false);
      // Clear confirmation after a few seconds
      setTimeout(() => setConfirmation(''), 3000);
    }, 2500); // 2.5 second delay
  };

  const evolutionPaths = [
    { stage: 2, description: "Develop Advanced Analytical Skills", cost: "10 $SNSY" },
    { stage: 3, description: "Specialize in Creative Writing", cost: "15 $SNSY" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> 
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Token-Guided Evolution (Mock)</h1> 
      <p className="mb-6 text-sm text-gray-300"> 
        Concept: Allows a user to guide the development or &quot;evolution&quot; of a digital entity (e.g., AI persona) by spending $SNSY tokens.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-lg flex-1 flex flex-col">

        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"> 
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Current State:</h2>
          <p className="text-gray-800">Entity: Sensay Assistant Mk.I</p>
          <p className="text-gray-800">Evolution Stage: <span className="font-bold">{evolutionStage}</span></p>
          {evolutionStage === 1 && <p className="text-sm text-gray-500 mt-1">Basic conversational abilities.</p>}
          {evolutionStage === 2 && <p className="text-sm text-green-600 mt-1">Enhanced with Advanced Analytical Skills.</p>}
          {evolutionStage === 3 && <p className="text-sm text-purple-600 mt-1">Further enhanced with Creative Writing specialization.</p>}
        </div>

        <h2 className="text-xl font-semibold mb-3 text-gray-800">Available Evolutions:</h2>
        <div className="flex-1 space-y-4 overflow-y-auto"> 
          {evolutionPaths.map((path) => (
            evolutionStage < path.stage && (
              <div key={path.stage} className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm flex items-center justify-between transition-shadow hover:shadow-md"> 
                <div>
                  <p className="font-medium text-gray-800">Evolve to Stage {path.stage}: {path.description}</p>
                  <p className="text-sm text-indigo-700 mt-1">Cost: {path.cost}</p>
                </div>
                <button
                  onClick={() => handleEvolve(path.stage)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-white font-semibold transition-colors text-sm flex items-center justify-center
                    ${isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Evolving...
                    </>
                  ) : (
                    `Evolve (${path.cost} Mock)`
                  )}
                </button>
              </div>
            )
          ))}
          {evolutionStage >= 3 && (
            <p className="text-gray-500 italic mt-4 text-center">No further evolutions available in this mock.</p>
          )}
        </div>

        {confirmation && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-300 shadow text-center text-sm">
            {confirmation}
          </div>
        )}
        <p className="mt-4 text-sm text-gray-500 text-center"> 
          (Note: $SNSY interaction and evolution logic are simulated.)
        </p>
      </div>
    </div>
  );
};

export default TokenGuidedEvolutionPage;
