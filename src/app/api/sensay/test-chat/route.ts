import { NextResponse, type NextRequest } from 'next/server';

// Define expected request message structure (subset of OpenAI)
interface RequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | null; // Allow null content just in case, though API expects string
}

// Define expected request body structure
interface RequestBody {
  messages: RequestMessage[];
  model: string; // Add model parameter
  // secret: string; // No longer expect secret in the body
}

// Environment variables
const SENSAY_API_URL_BASE = process.env.SENSAY_API_URL_BASE;
const SENSAY_API_KEY = process.env.SENSAY_API_KEY;

// Log environment variable values on function execution (for debugging Vercel env)
console.log('SENSAY_API_URL_BASE:', SENSAY_API_URL_BASE ? 'Loaded' : 'MISSING');
console.log('SENSAY_API_KEY:', SENSAY_API_KEY ? 'Loaded' : 'MISSING');

export async function POST(request: NextRequest) {
  console.log('--- Request received at /api/sensay/test-chat ---');

  // Basic validation
  if (!SENSAY_API_URL_BASE) { 
    console.error('API URL Base not configured.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }
  if (!SENSAY_API_KEY) { 
    console.error('API Key not configured.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch (e) {
    console.error('Failed to parse request body:', e);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate body content (basic)
  if (!body || typeof body !== 'object' || !Array.isArray(body.messages) || !body.model) { 
      const error = 'Invalid request format: requires messages array and model.';
      console.error(error, 'Received:', body);
      return NextResponse.json({ error }, { status: 400 });
  }

  // Extract the messages from the validated body
  const { messages, model } = body;

  // Hardcoded replica UUID - replace with dynamic logic if needed
  const replicaId = '16d38fcc-5cb0-4f94-9cee-3e8398ef4700'; // Use the ID from the main chat route

  // --- Call Sensay API --- //
  // Revert to EXPERIMENTAL endpoint and try OLDER API version
  const apiUrl = `${SENSAY_API_URL_BASE}/replicas/${replicaId}/chat/completions`;

  // --- DEBUG LOGGING --- //
  console.log('Sending to Sensay API:');
  console.log('  URL:', apiUrl);
  console.log('  Method:', 'POST');
  console.log('  Headers:', JSON.stringify({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-ORGANIZATION-SECRET': SENSAY_API_KEY ? '***' : 'MISSING', // Use ENV VAR, mask value
    'X-API-VERSION': '2025-03-25'             // Revert to newer version
  }, null, 2));
  console.log('  Body:', JSON.stringify({ messages, model, stream: false }, null, 2)); // Add model parameter
  // --- END DEBUG LOGGING --- //

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-ORGANIZATION-SECRET': SENSAY_API_KEY, // Use API key from environment variables
        'X-API-VERSION': '2025-03-25' // Revert to newer version
      },
      body: JSON.stringify({
        messages: messages,
        model: model, // Add model parameter
        stream: false
      }),
    });

    const responseText = await response.text(); // Get raw response text
    console.log('Raw Sensay API Response Status:', response.status);
    console.log('Raw Sensay API Response Body:', responseText);

    if (!response.ok) {
        let errorDetail = responseText;
        try {
            const jsonError = JSON.parse(responseText);
            errorDetail = jsonError.error || jsonError.message || responseText;
        } catch /* istanbul ignore next -- ignore parse error */ {
            // If parsing fails, use the raw text
        }
        console.error(`Sensay API Error (${response.status}):`, errorDetail);
        throw new Error(`Sensay API Error (${response.status}): ${errorDetail}`);
    }

    let responseData: unknown;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Sensay API JSON response:", e);
      throw new Error("Failed to parse Sensay API JSON response");
    }

    // Validate the structure of the successful response (basic check)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof responseData !== 'object' || responseData === null || !('choices' in responseData) || !Array.isArray((responseData as any).choices) || (responseData as any).choices.length === 0) { // Basic check
      console.error("Unexpected Sensay API response structure:", responseData);
      throw new Error("Unexpected Sensay API response structure");
    }

    // Extract the reply (adjust based on actual API response structure if needed)
    // Assuming OpenAI-like structure: choices[0].message.content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reply = (responseData as any)?.choices[0]?.message?.content;

    if (typeof reply !== 'string') {
        console.error("Could not extract reply content from Sensay response:", responseData);
        throw new Error("Could not extract reply content from Sensay response");
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Error calling Sensay API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // Make sure the status code reflects the origin of the error
    const status = errorMessage.includes('Sensay API Error (401)') ? 401
                 : errorMessage.includes('Sensay API Error (400)') ? 400
                 : 500; // Default to internal server error
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
