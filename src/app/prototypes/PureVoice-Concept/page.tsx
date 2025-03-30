"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, Shield, Calendar, MapPin, Users } from 'lucide-react';

const PureVoiceConceptPage = () => {
  const [isLoading] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Sensay Pure Voice Concept</h1>
      <p className="mb-6 text-sm text-gray-300">
        The ultimate evolution of conversational AI interfaces - stripping away all visual elements to create a seamless, natural voice-only interaction with your digital replica.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Sensay Pure Voice</CardTitle>
            <CardDescription>
              Voice-only interaction through traditional telephone infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
                <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Core Concept</h3>
                <p>
                  The fundamental premise of Pure Voice is radical simplicity: <strong>everything disappears except the voice</strong>. This minimal interface eliminates barriers to engagement and creates a more natural, human-like interaction with your digital replica - available anywhere with telephone service, regardless of smartphone access or technical proficiency.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Phone className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Universal Access</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Interact with your replica from any phone, anywhere in the world, without requiring a smartphone or internet connection.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Natural Interaction</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Voice-only creates more emotionally resonant experiences, mimicking human-to-human conversation.</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Simplified Security</h4>
                    </div>
                    <p className="text-sm text-gray-700 m-0">Leverages existing telephone authentication systems with options for voice biometrics and PIN verification.</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-indigo-700">Competitive Differentiation</h3>
                <p>
                  Pure Voice transforms Sensay from a digital platform into an omnipresent companion, accessible through the most universal communication technology available. By embracing the telephone network's ubiquity and simplicity, Sensay replicas become available in contexts where other AI assistants cannot reach, creating unprecedented continuity in the human-AI relationship.
                </p>
              </TabsContent>
              
              <TabsContent value="architecture" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Technical Architecture</h3>
                <p>
                  Pure Voice combines traditional telephone infrastructure with cutting-edge AI to create a seamless voice experience.
                </p>
                
                <h4 className="text-lg font-semibold text-indigo-600 mt-4">Integration Components</h4>
                <ul className="list-disc pl-6 my-3 space-y-1">
                  <li><strong>Twilio Integration</strong>: Telephone network connectivity and call management</li>
                  <li><strong>ElevenLabs Conversational AI</strong>: High-fidelity, emotionally nuanced voice synthesis</li>
                  <li><strong>Sensay Replica Backend</strong>: Conversation intelligence and persona management</li>
                  <li><strong>Call Scheduling System</strong>: Time-based trigger mechanism for outbound calls</li>
                </ul>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-3">
                      <PhoneOutgoing className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-800 m-0">Outbound Call Flow</h4>
                    </div>
                    <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
                      <li>Scheduled trigger or API request initiates call sequence</li>
                      <li>Sensay platform prepares replica context and conversation parameters</li>
                      <li>Twilio places outbound call to specified telephone number</li>
                      <li>Upon answer, ElevenLabs synthesizes replica voice in real-time</li>
                      <li>Conversation audio is processed bidirectionally</li>
                      <li>Call recording (optional) is stored in the user's Sensay account</li>
                    </ol>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center mb-3">
                      <PhoneIncoming className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-800 m-0">Inbound Call Flow</h4>
                    </div>
                    <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
                      <li>User dials dedicated phone number associated with their replica</li>
                      <li>Twilio routes call to Sensay platform</li>
                      <li>Authentication occurs via caller ID or phone-based verification</li>
                      <li>Sensay loads appropriate replica profile and context</li>
                      <li>ElevenLabs manages voice synthesis for natural conversation</li>
                      <li>Call continues until user terminates or scheduled end</li>
                    </ol>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-indigo-600">Technical Considerations</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div>
                    <h5 className="font-semibold text-indigo-700">Voice Quality Optimization</h5>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li><strong>Emotional Resonance</strong>: ElevenLabs provides nuanced emotional expression</li>
                      <li><strong>Conversation-Specific Tuning</strong>: Voice characteristics adapted to call context</li>
                      <li><strong>Network Adaptation</strong>: Quality adjustment based on connection limitations</li>
                      <li><strong>Voice Personalization</strong>: Matching replica voice to user preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-indigo-700">Security & Authentication</h5>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li><strong>Caller ID Verification</strong>: Primary authentication mechanism</li>
                      <li><strong>Voice Biometric Options</strong>: Secondary authentication layer</li>
                      <li><strong>PIN-Based Fallbacks</strong>: Secure access from unrecognized numbers</li>
                      <li><strong>Privacy Controls</strong>: Clear recording and data usage policies</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="use-cases" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Use Cases</h3>
                <p>
                  Pure Voice enables a wide range of scenarios that would be difficult or impossible with traditional app-based interfaces.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-3">
                      <Phone className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Accessibility & Convenience</h4>
                    </div>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li><strong>Device-Independent Access</strong>: Interact with your replica from any phone, anywhere</li>
                      <li><strong>Technology Barrier Elimination</strong>: Accessible to those uncomfortable with apps/computers</li>
                      <li><strong>Hands-Free Interaction</strong>: Use while driving, walking, or otherwise engaged</li>
                      <li><strong>Universal Availability</strong>: Function in areas with limited internet but phone service</li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-3">
                      <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Scheduled Interactions</h4>
                    </div>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li><strong>Morning Briefings</strong>: Receive a call with your daily schedule, news, and priorities</li>
                      <li><strong>Check-In Calls</strong>: Regular wellness or progress checks at predetermined times</li>
                      <li><strong>Reminder Systems</strong>: Important deadline or medication notifications</li>
                      <li><strong>Scheduled Coaching</strong>: Regular sessions with specialized replica advisors</li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-3">
                      <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Location-Based Access</h4>
                    </div>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li><strong>Travel Companion</strong>: Call your replica from hotel phones while traveling</li>
                      <li><strong>Public Access</strong>: Engage from pay phones or borrowed devices</li>
                      <li><strong>Hospitality Integration</strong>: Hotel room phones provide instant replica access</li>
                      <li><strong>Workplace Flexibility</strong>: Use office phones without installing personal software</li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-center mb-3">
                      <Users className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-semibold text-indigo-800 m-0">Interpersonal Scenarios</h4>
                    </div>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li><strong>Shared Experiences</strong>: Put your replica on speakerphone to interact with groups</li>
                      <li><strong>Introduction Opportunities</strong>: Let friends speak with your replica during social settings</li>
                      <li><strong>Collaborative Discussions</strong>: Conference call between multiple humans and replicas</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-indigo-700">Business Value</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                  <div>
                    <h4 className="font-semibold text-indigo-700">Individual Users</h4>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li><strong>Continuous Access</strong>: Never be without your digital replica</li>
                      <li><strong>Simplified Interaction</strong>: No apps, screens, or technical knowledge required</li>
                      <li><strong>Ambient Computing</strong>: Integrate replica assistance into daily life naturally</li>
                      <li><strong>Genuine Connection</strong>: Voice-only creates more emotionally resonant experiences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-indigo-700">Enterprise Applications</h4>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li><strong>Universal Employee Access</strong>: Reach all staff regardless of technology adoption</li>
                      <li><strong>Zero Training Deployment</strong>: Leverage familiar telephone interfaces</li>
                      <li><strong>Location Flexibility</strong>: Access from secure facilities where mobile devices are restricted</li>
                      <li><strong>Consistent Experience</strong>: Standardized interface across all access points</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="roadmap" className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 mt-0">Implementation Roadmap</h3>
                <p>
                  The Pure Voice implementation will be rolled out in four strategic phases, each building on the capabilities of the previous phase.
                </p>
                
                <div className="space-y-6 my-6">
                  <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <h4 className="text-lg font-semibold text-blue-700 m-0">Phase 1: Core Infrastructure</h4>
                    <ul className="list-disc pl-6 text-sm text-gray-700 mt-2 space-y-1">
                      <li>Twilio integration for basic call handling</li>
                      <li>ElevenLabs voice synthesis implementation</li>
                      <li>Simple inbound call processing</li>
                      <li>Basic authentication system</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-indigo-500 pl-4 py-1">
                    <h4 className="text-lg font-semibold text-indigo-700 m-0">Phase 2: Enhanced Functionality</h4>
                    <ul className="list-disc pl-6 text-sm text-gray-700 mt-2 space-y-1">
                      <li>Scheduled outbound calls</li>
                      <li>Call recording and management</li>
                      <li>Improved voice quality and latency</li>
                      <li>Extended conversation duration capabilities</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4 py-1">
                    <h4 className="text-lg font-semibold text-purple-700 m-0">Phase 3: Advanced Features</h4>
                    <ul className="list-disc pl-6 text-sm text-gray-700 mt-2 space-y-1">
                      <li>Multi-participant calls (conference capability)</li>
                      <li>Context-aware conversation handling</li>
                      <li>Cross-device conversation continuity</li>
                      <li>Advanced security and authentication</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-violet-500 pl-4 py-1">
                    <h4 className="text-lg font-semibold text-violet-700 m-0">Phase 4: Enterprise Capabilities</h4>
                    <ul className="list-disc pl-6 text-sm text-gray-700 mt-2 space-y-1">
                      <li>Custom business phone integration</li>
                      <li>Analytics and conversation insights</li>
                      <li>Compliance recording options</li>
                      <li>Role-specific voice tuning</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                  <h4 className="font-semibold text-gray-800">Current Development Status</h4>
                  <p className="text-sm text-gray-700">
                    The Pure Voice concept is currently in the planning and early development stage. We are working on establishing the core infrastructure and integration with Twilio and ElevenLabs. Stay tuned for updates as we progress through our implementation roadmap.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PureVoiceConceptPage;
