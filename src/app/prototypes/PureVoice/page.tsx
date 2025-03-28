// src/app/prototypes/PureVoice/page.tsx
"use client";

import React, { useState } from 'react';

const PureVoicePage = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleToggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate listening start
      setTranscript("(Mock) Listening...");
      // Simulate receiving speech after a delay
      setTimeout(() => {
        setTranscript("(Mock) User said: 'Hello Sensay, what's the weather?'");
        setIsListening(false); // Turn off listening after mock speech
      }, 3000);
    } else {
      // Simulate listening stop
      setTranscript(""); // Clear transcript when stopped manually
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> {/* Outer Dark BG */}
      {/* Header Area */}
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Pure Voice (Mock)</h1> {/* Light Text */}
      <p className="mb-6 text-sm text-gray-300"> {/* Light Text */}
        Concept: A minimal interface demonstrating a voice-only interaction flow.
      </p>
      
      {/* Content Area - White Rounded Box */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex-1 flex flex-col items-center justify-center"> {/* Center content */} 

        <p className="mb-6 text-gray-700 text-center"> {/* Adjusted text color */}
          Simulate a pure voice interaction by clicking the microphone.
        </p>

        <div className="flex flex-col items-center space-y-4 mb-6"> {/* Column layout for button/indicator */}
          <button
            onClick={handleToggleListen}
            className={`px-5 py-2.5 rounded-lg text-white font-semibold transition-colors flex items-center justify-center shadow hover:shadow-md w-48 /* Fixed width */
              ${isListening
                ? 'bg-red-600 hover:bg-red-700'       // Red when listening
                : 'bg-indigo-600 hover:bg-indigo-700' // Indigo when not listening
              }`}
          >
            {/* Microphone Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a4 4 0 108 0V4a4 4 0 10-8 0v4zm1 4a1 1 0 001 1h2a1 1 0 100-2H8a1 1 0 00-1 1zm9-1a1 1 0 100-2h-1a1 1 0 100 2h1zM3.055 11H4a1 1 0 110 2H3.055a1 1 0 010-2zm11.89 0H16a1 1 0 110 2h-1.055a1 1 0 010-2zM6 15a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          {isListening && (
            <span className="text-red-600 animate-pulse font-medium">Listening...</span>
          )}
        </div>

        {/* Transcript Area */}
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm min-h-[100px] w-full max-w-md"> {/* Light gray bg */}
          <p className="font-mono text-sm text-gray-800 text-center">{transcript || 'Transcript will appear here...'}</p> {/* Placeholder */}
        </div>

        <p className="mt-4 text-sm text-gray-500 text-center"> {/* Adjusted text color */}
          (Note: This is a UI mockup. Actual voice processing is not implemented.)
        </p>
      </div>
    </div>
  );
};

export default PureVoicePage;
