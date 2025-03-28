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
    <div>
      <h1 className="text-2xl font-bold mb-4">Pure Voice</h1>
      <p className="mb-6 text-gray-600">Simulate a pure voice interaction by clicking the microphone.</p>

      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleToggleListen}
          className={`px-5 py-2.5 rounded-lg text-white font-semibold transition-colors flex items-center justify-center shadow hover:shadow-md
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
          <span className="text-red-500 animate-pulse font-medium">Listening...</span>
        )}
      </div>

      {transcript && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md shadow border border-gray-200"> {/* Added border */} 
          <p className="font-mono text-sm text-gray-800">{transcript}</p>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500">
        (Note: This is a UI mockup. Actual voice processing is not implemented.)
      </p>
    </div>
  );
};

export default PureVoicePage;
