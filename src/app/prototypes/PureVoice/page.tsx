// src/app/prototypes/PureVoice/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="flex-1 flex flex-col bg-background p-6 text-foreground">
      <h1 className="text-3xl font-bold mb-4 text-center">Pure Voice Prototype</h1>

      {/* Interactive Mock Section */}
      <Card className="bg-card border">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Mock Interaction</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="mb-6 text-muted-foreground text-center">
            Simulate a pure voice interaction by clicking the microphone.
          </p>

          <div className="flex flex-col items-center space-y-4 mb-6">
            <Button
              onClick={handleToggleListen}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="w-48"
            >
              {/* Microphone Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a4 4 0 108 0V4a4 4 0 10-8 0v4zm1 4a1 1 0 001 1h2a1 1 0 100-2H8a1 1 0 00-1 1zm9-1a1 1 0 100-2h-1a1 1 0 100 2h1zM3.055 11H4a1 1 0 110 2H3.055a1 1 0 010-2zm11.89 0H16a1 1 0 110 2h-1.055a1 1 0 010-2zM6 15a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </Button>
            {isListening && (
              <span className="text-destructive animate-pulse font-medium">Listening...</span>
            )}
          </div>

          {/* Transcript Area */}
          <div className="p-4 border rounded-lg bg-muted shadow-sm min-h-[100px] w-full max-w-md">
            <p className="font-mono text-sm text-muted-foreground text-center">{transcript || 'Transcript will appear here...'}</p>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            (Note: This is a UI mockup. Actual voice processing is not implemented.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PureVoicePage;
