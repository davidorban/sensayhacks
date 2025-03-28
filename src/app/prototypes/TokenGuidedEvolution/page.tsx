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
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Token-Guided Evolution (Mock)</h1>
      <p className="mb-6 text-gray-600">Guide the evolution of a digital entity (e.g., AI persona) using $SNSY tokens.</p>

      <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-100 shadow">
        <h2 className="text-lg font-semibold mb-2">Current State:</h2>
        <p>Entity: Sensay Assistant Mk.I</p>
        <p>Evolution Stage: <span className="font-bold">{evolutionStage}</span></p>
        {evolutionStage === 1 && <p className="text-sm text-gray-500">Basic conversational abilities.</p>}
        {evolutionStage === 2 && <p className="text-sm text-green-600">Enhanced with Advanced Analytical Skills.</p>}
        {evolutionStage === 3 && <p className="text-sm text-purple-600">Further enhanced with Creative Writing specialization.</p>}
      </div>

      <h2 className="text-xl font-semibold mb-3">Available Evolutions:</h2>
      <div className="space-y-4">
        {evolutionPaths.map((path) => (
          evolutionStage < path.stage && (
            <div key={path.stage} className="p-4 border border-indigo-200 rounded-lg bg-indigo-50 flex items-center justify-between">
              <div>
                <p className="font-medium">Evolve to Stage {path.stage}: {path.description}</p>
                <p className="text-sm text-indigo-700">Cost: {path.cost}</p>
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
          <p className="text-gray-500">No further evolutions available in this mock.</p>
        )}
      </div>

      {confirmation && (
        <div className="mt-6 p-3 bg-green-100 text-green-800 rounded-md border border-green-300 shadow text-center">
          {confirmation}
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500">
        (Note: $SNSY interaction and evolution logic are simulated.)
      </p>
    </div>
  );
};

export default TokenGuidedEvolutionPage;
