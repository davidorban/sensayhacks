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

// Use the official Sensay API endpoint and structure
const SENSAY_API_URL_BASE = 'https://api.sensay.io/v1/replicas';
const ORGANIZATION_SECRET = process.env.SENSAY_API_KEY; // Using SENSAY_API_KEY as the secret

export async function POST(request: Request) {
  if (!ORGANIZATION_SECRET) {
    console.error('Sensay API Key not found in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { messages, replicaId }: RequestBody = body; // replicaId is now the REPLICA_UUID

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required in the request body' }, { status: 400 });
    }
    if (!replicaId) {
        return NextResponse.json({ error: 'Replica UUID (replicaId) is required' }, { status: 400 });
    }

    // Extract the content of the last user message for the official API
    const lastUserMessage = messages[messages.length - 1];
    if (!lastUserMessage || !lastUserMessage.content) {
        return NextResponse.json({ error: 'Invalid last message format' }, { status: 400 });
    }
    const userContent = lastUserMessage.content;

    // Define the target User ID (using test-user as confirmed)
    const userId = 'test-user';

    // Construct the full API URL
    const apiUrl = `${SENSAY_API_URL_BASE}/${replicaId}/chat/completions`;

    console.log(`Sending request to Sensay API: ${apiUrl}`);
    console.log(`Using Replica UUID: ${replicaId}`);
    console.log(`Using User ID: ${userId}`);
    // Avoid logging the secret key

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ORGANIZATION-SECRET': ORGANIZATION_SECRET,
        'X-USER-ID': userId,
      },
      body: JSON.stringify({ content: userContent }), // Send only the content of the last message
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Sensay API Error:', response.status, responseData);
      const errorMessage = responseData.error?.message || responseData.message || 'Failed to fetch from Sensay API';
      return NextResponse.json({ error: `Sensay API Error: ${errorMessage}` }, { status: response.status });
    }

    // --- Response Parsing --- 
    // We need to determine the exact structure of the success response from the official API.
    // Assuming a structure similar to OpenAI for now, adjust as needed.
    // Option 1: Check for OpenAI-like structure
    let replyContent = responseData.choices?.[0]?.message?.content;

    // Option 2: Check if responseData itself has a 'content' field (simpler structure)
    if (!replyContent && responseData.content) {
        replyContent = responseData.content;
    }

    // Option 3: Fallback/Error if structure is unknown
    if (!replyContent) {
        console.error('Could not extract reply content from Sensay response:', responseData);
        return NextResponse.json({ error: 'Failed to parse reply from Sensay API' }, { status: 500 });
    }

    console.log('Sensay API Success. Reply:', replyContent);

    return NextResponse.json({ reply: replyContent });

  } catch (error: any) {
    console.error('Error in /api/sensay/chat:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
