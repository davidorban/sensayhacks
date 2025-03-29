import { NextResponse, type NextRequest } from 'next/server';

// Define expected request message structure (subset of OpenAI)
interface RequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | null; // Allow null content just in case, though API expects string
}

// Define expected request body structure
interface RequestBody {
  messages: RequestMessage[];
}

// Define expected response message structure from Sensay (subset)
interface SensayResponseMessage {
  role: 'assistant';
  content: string | null;
}

// Environment variables
const SENSAY_API_URL_BASE = process.env.SENSAY_API_URL_BASE;
const ORGANIZATION_SECRET = process.env.SENSAY_API_KEY; // Reverted: Use the env var name user has defined

// Hardcoded Replica UUID (from previous debugging)
const TARGET_REPLICA_UUID = '16d38fcc-5cb0-4f94-9cee-3e8398ef4700';

export async function POST(request: NextRequest) {
  console.log('--- Request received at /api/sensay/test-chat ---');

  // Basic validation
  if (!SENSAY_API_URL_BASE || !ORGANIZATION_SECRET) { // Fix typo
    console.error('API URL Base or Organization Secret not configured.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // --- Request Body Parsing and Validation --- //
  let body: RequestBody;
  let userMessages: RequestMessage[];
  try {
    body = await request.json();
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
        throw new Error('Invalid request body structure. Expecting { messages: [...] }');
    }
    // Basic validation for content within messages
    for (const msg of body.messages) {
        if (typeof msg.content !== 'string' || msg.content.trim() === '') {
            console.error('Invalid message format found in request:', msg);
            throw new Error('Invalid message format: Role and non-empty content are required.');
        }
    }
    userMessages = body.messages;
    console.log('Parsed user messages from request:', JSON.stringify(userMessages, null, 2));
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON body or message format';
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error }, { status: 400 });
  }

  // --- Call Sensay API --- //
  const apiUrl = `${SENSAY_API_URL_BASE.replace('/experimental', '')}/${TARGET_REPLICA_UUID}/chat/completions`;

  // --- DEBUG LOGGING --- //
  console.log('Sending to Sensay API:');
  console.log('URL:', apiUrl);
  console.log('Headers:', {
      'Content-Type': 'application/json',
      'X-ORGANIZATION-SECRET': ORGANIZATION_SECRET ? '********' : 'MISSING', // Don't log the actual key
      'X-API-Version': '2025-03-25',
      'X-USER-ID': 'test-user-001' // Log placeholder User ID
  });
  const userMessageContent = userMessages[userMessages.length - 1].content;
  console.log('Body:', JSON.stringify({ content: userMessageContent }, null, 2)); // Log the simplified body structure
  // --- END DEBUG LOGGING ---

  let sensayResponseData: unknown;
  let replyContent: string | null | undefined;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ORGANIZATION-SECRET': ORGANIZATION_SECRET, // Send the value from SENSAY_API_KEY env var
        'X-API-Version': '2025-03-25',
        'X-USER-ID': 'test-user-001' // Placeholder User ID
      },
      body: JSON.stringify({ content: userMessageContent }),
    });

    // --- Handle Sensay Response --- //
    sensayResponseData = await response.json();
    console.log('Raw Sensay Response Status:', response.status);
    console.log('Raw Sensay Response Body:', JSON.stringify(sensayResponseData, null, 2));

    if (!response.ok) {
      // Try to extract a more specific error message if possible
      let errorMessage = `Sensay API Error (${response.status})`;
      if (typeof sensayResponseData === 'object' && sensayResponseData !== null && 'error' in sensayResponseData) {
        errorMessage += `: ${sensayResponseData.error}`;
      } else {
        errorMessage += `: ${response.statusText}`;
      }
       console.error(errorMessage, 'Raw Response:', sensayResponseData);
      throw new Error(errorMessage);
    }

    console.log("Raw Sensay Response Data:", JSON.stringify(sensayResponseData, null, 2));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replyContent = (sensayResponseData as any)?.response || 
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   (sensayResponseData as any)?.content || 
                   JSON.stringify(sensayResponseData);

  } catch (error) {
    console.error('Error during Sensay API call or response processing:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during Sensay API interaction';
    // Return the Sensay error if available, otherwise a generic 500
    const status = errorMessage.startsWith('Sensay API Error') ? 400 : 500;
    return NextResponse.json({ error: errorMessage, rawResponse: sensayResponseData ?? null }, { status });
  }

  // --- Return Success Response --- //
  if (!replyContent) {
    console.error('Could not extract reply content from Sensay response:', sensayResponseData);
    return NextResponse.json({ error: 'Failed to extract reply content from Sensay response.' }, { status: 500 });
  }

  console.log('Successfully got reply from Sensay:', replyContent);
  return NextResponse.json({ reply: replyContent });

}
