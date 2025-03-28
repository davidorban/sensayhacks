import { NextResponse } from 'next/server';

// Define the expected structure of a message in the request
interface RequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Define the expected structure of the request body
interface RequestBody {
  messages: RequestMessage[];
  replicaId: string;
}

// Define the structure of the Sensay API response we expect
interface SensayChoice {
  index: number;
  message: {
    role: 'assistant';
    content: string;
  };
  finish_reason: string;
}

interface SensayResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: SensayChoice[];
  // ... other fields like usage might exist
}


export async function POST(request: Request) {
  const sensayApiKey = process.env.SENSAY_API_KEY;

  if (!sensayApiKey) {
    console.error('Sensay API Key not found in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
  }

  try {
    const { messages, replicaId }: RequestBody = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Bad Request: Missing or invalid messages array.' }, { status: 400 });
    }
    if (!replicaId) {
        return NextResponse.json({ error: 'Bad Request: Missing replicaId.' }, { status: 400 });
    }

    // Construct the payload for the Sensay API
    // The API expects the full message history (or relevant parts)
    const payload = {
      messages: messages, // Send the message history as received
      source: 'web',    // Specify the source as web
      store: true,      // Store the interaction in history
      // Add other parameters like 'model' if needed/supported by the specific endpoint
    };

    const sensayApiUrl = `https://api.sensay.io/v1/experimental/replicas/${replicaId}/chat/completions`;

    console.log(`Calling Sensay API: ${sensayApiUrl} with ${messages.length} messages.`);

    const response = await fetch(sensayApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sensayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Sensay API Error (${response.status}): ${errorBody}`);
      return NextResponse.json({ error: `Sensay API request failed with status ${response.status}. ${errorBody}` }, { status: response.status });
    }

    const data: SensayResponse = await response.json();

    // Extract the assistant's reply
    const assistantMessageContent = data.choices?.[0]?.message?.content;

    if (!assistantMessageContent) {
        console.error('Sensay API response did not contain expected message content:', data);
        return NextResponse.json({ error: 'Failed to parse assistant message from Sensay response.' }, { status: 500 });
    }

    console.log("Received response from Sensay API.");

    // Return just the content string
    return NextResponse.json({ reply: assistantMessageContent });

  } catch (error) {
    console.error('Error processing Sensay chat request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
