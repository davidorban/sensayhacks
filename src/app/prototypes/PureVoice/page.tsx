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

  // Description Component
  const DescriptionContent = () => (
    <div className="prose prose-invert max-w-none">
      <h2>Sensay Pure Voice</h2>
      <h3>Overview</h3>
      <p>Pure Voice represents the ultimate evolution of conversational AI interfaces - stripping away all visual elements, screens, and apps to create a seamless, natural voice-only interaction with your digital replica. By leveraging traditional telephone infrastructure alongside cutting-edge voice synthesis, Pure Voice enables your Sensay replica to call your phone directly or receive calls from any telephone, creating truly immersive and accessible conversations.</p>

      <h3>Core Concept</h3>
      <p>The fundamental premise of Pure Voice is radical simplicity: <strong>everything disappears except the voice</strong>. This minimal interface eliminates barriers to engagement and creates a more natural, human-like interaction with your digital replica - available anywhere with telephone service, regardless of smartphone access or technical proficiency.</p>

      <h3>Technical Architecture</h3>
      <h4>Integration Components</h4>
      <ul>
        <li><strong>Twilio Integration</strong>: Telephone network connectivity and call management</li>
        <li><strong>ElevenLabs Conversational AI</strong>: High-fidelity, emotionally nuanced voice synthesis</li>
        <li><strong>Sensay Replica Backend</strong>: Conversation intelligence and persona management</li>
        <li><strong>Call Scheduling System</strong>: Time-based trigger mechanism for outbound calls</li>
      </ul>
      <h4>Call Flow - Outbound (Replica to Human)</h4>
      <ol>
        <li>Scheduled trigger or API request initiates call sequence</li>
        <li>Sensay platform prepares replica context and conversation parameters</li>
        <li>Twilio places outbound call to specified telephone number</li>
        <li>Upon answer, ElevenLabs synthesizes replica voice in real-time</li>
        <li>Conversation audio is processed bidirectionally</li>
        <li>Call recording (optional) is stored in the user&apos;s Sensay account</li>
      </ol>
      <h4>Call Flow - Inbound (Human to Replica)</h4>
      <ol>
        <li>User dials dedicated phone number associated with their replica</li>
        <li>Twilio routes call to Sensay platform</li>
        <li>Authentication occurs via caller ID or phone-based verification</li>
        <li>Sensay loads appropriate replica profile and context</li>
        <li>ElevenLabs manages voice synthesis for natural conversation</li>
        <li>Call continues until user terminates or scheduled end</li>
      </ol>

      <h3>Use Cases</h3>
      <h4>Accessibility & Convenience</h4>
      <ul>
        <li><strong>Device-Independent Access</strong>: Interact with your replica from any phone, anywhere</li>
        <li><strong>Technology Barrier Elimination</strong>: Accessible to those uncomfortable with apps/computers</li>
        <li><strong>Hands-Free Interaction</strong>: Use while driving, walking, or otherwise engaged</li>
        <li><strong>Universal Availability</strong>: Function in areas with limited internet but phone service</li>
      </ul>
      <h4>Scheduled Interactions</h4>
      <ul>
        <li><strong>Morning Briefings</strong>: Receive a call with your daily schedule, news, and priorities</li>
        <li><strong>Check-In Calls</strong>: Regular wellness or progress checks at predetermined times</li>
        <li><strong>Reminder Systems</strong>: Important deadline or medication notifications</li>
        <li><strong>Scheduled Coaching</strong>: Regular sessions with specialized replica advisors</li>
      </ul>
      <h4>Location-Based Access</h4>
      <ul>
        <li><strong>Travel Companion</strong>: Call your replica from hotel phones while traveling</li>
        <li><strong>Public Access</strong>: Engage from pay phones or borrowed devices</li>
        <li><strong>Hospitality Integration</strong>: Hotel room phones provide instant replica access</li>
        <li><strong>Workplace Flexibility</strong>: Use office phones without installing personal software</li>
      </ul>
      <h4>Interpersonal Scenarios</h4>
      <ul>
        <li><strong>Shared Experiences</strong>: Put your replica on speakerphone to interact with groups</li>
        <li><strong>Introduction Opportunities</strong>: Let friends speak with your replica during social settings</li>
        <li><strong>Collaborative Discussions</strong>: Conference call between multiple humans and replicas</li>
      </ul>

      <h3>Technical Considerations</h3>
      <h4>Voice Quality Optimization</h4>
      <ul>
        <li><strong>Emotional Resonance</strong>: ElevenLabs provides nuanced emotional expression</li>
        <li><strong>Conversation-Specific Tuning</strong>: Voice characteristics adapted to call context</li>
        <li><strong>Network Adaptation</strong>: Quality adjustment based on connection limitations</li>
        <li><strong>Voice Personalization</strong>: Matching replica voice to user preferences</li>
      </ul>
      <h4>Security & Authentication</h4>
      <ul>
        <li><strong>Caller ID Verification</strong>: Primary authentication mechanism</li>
        <li><strong>Voice Biometric Options</strong>: Secondary authentication layer</li>
        <li><strong>PIN-Based Fallbacks</strong>: Secure access from unrecognized numbers</li>
        <li><strong>Privacy Controls</strong>: Clear recording and data usage policies</li>
      </ul>
      <h4>Telephone Network Considerations</h4>
      <ul>
        <li><strong>International Accessibility</strong>: Country-specific number provisioning</li>
        <li><strong>Cost Management</strong>: Efficient call routing to minimize expenses</li>
        <li><strong>Quality Assurance</strong>: Handling varying telephone network conditions</li>
        <li><strong>Fallback Mechanisms</strong>: SMS options when voice quality is compromised</li>
      </ul>

      <h3>Implementation Roadmap</h3>
      <h4>Phase 1: Core Infrastructure</h4>
      <ul>
        <li>Twilio integration for basic call handling</li>
        <li>ElevenLabs voice synthesis implementation</li>
        <li>Simple inbound call processing</li>
        <li>Basic authentication system</li>
      </ul>
      <h4>Phase 2: Enhanced Functionality</h4>
      <ul>
        <li>Scheduled outbound calls</li>
        <li>Call recording and management</li>
        <li>Improved voice quality and latency</li>
        <li>Extended conversation duration capabilities</li>
      </ul>
      <h4>Phase 3: Advanced Features</h4>
      <ul>
        <li>Multi-participant calls (conference capability)</li>
        <li>Context-aware conversation handling</li>
        <li>Cross-device conversation continuity</li>
        <li>Advanced security and authentication</li>
      </ul>
      <h4>Phase 4: Enterprise Capabilities</h4>
      <ul>
        <li>Custom business phone integration</li>
        <li>Analytics and conversation insights</li>
        <li>Compliance recording options</li>
        <li>Role-specific voice tuning</li>
      </ul>

      <h3>Business Value</h3>
      <h4>Individual Users</h4>
      <ul>
        <li><strong>Continuous Access</strong>: Never be without your digital replica</li>
        <li><strong>Simplified Interaction</strong>: No apps, screens, or technical knowledge required</li>
        <li><strong>Ambient Computing</strong>: Integrate replica assistance into daily life naturally</li>
        <li><strong>Genuine Connection</strong>: Voice-only creates more emotionally resonant experiences</li>
      </ul>
      <h4>Enterprise Applications</h4>
      <ul>
        <li><strong>Universal Employee Access</strong>: Reach all staff regardless of technology adoption</li>
        <li><strong>Zero Training Deployment</strong>: Leverage familiar telephone interfaces</li>
        <li><strong>Location Flexibility</strong>: Access from secure facilities where mobile devices are restricted</li>
        <li><strong>Consistent Experience</strong>: Standardized interface across all access points</li>
      </ul>

      <h3>Competitive Differentiation</h3>
      <p>Pure Voice transforms Sensay from a digital platform into an omnipresent companion, accessible through the most universal communication technology available. By embracing the telephone network&apos;s ubiquity and simplicity, Sensay replicas become available in contexts where other AI assistants cannot reach, creating unprecedented continuity in the human-AI relationship.</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background p-6 text-foreground">
      <h1 className="text-3xl font-bold mb-4 text-center">Pure Voice Prototype</h1>

      {/* Description Section */}
      <Card className="mb-6 bg-card border">
        <CardHeader>
          <CardTitle className="text-xl text-card-foreground">Concept: Sensay Pure Voice</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionContent />
        </CardContent>
      </Card>

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
