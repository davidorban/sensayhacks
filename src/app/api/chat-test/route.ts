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
}

// Environment variables
const SENSAY_API_URL_BASE = process.env.SENSAY_API_URL_BASE || 'https://api.sensay.io/v1';
const SENSAY_ORGANIZATION_SECRET = process.env.SENSAY_ORGANIZATION_SECRET || process.env.SENSAY_API_KEY;

// Log environment variable values on function execution (for debugging Vercel env)
console.log('SENSAY_API_URL_BASE:', SENSAY_API_URL_BASE ? 'Loaded' : 'MISSING');
console.log('SENSAY_ORGANIZATION_SECRET:', SENSAY_ORGANIZATION_SECRET ? 'Loaded' : 'MISSING');

export async function POST(request: NextRequest) {
  console.log('--- Request received at /api/chat-test ---');

  // Basic validation
  if (!SENSAY_API_URL_BASE) { 
    console.error('API URL Base not configured.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }
  if (!SENSAY_ORGANIZATION_SECRET) { 
    console.error('Organization Secret not configured.');
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
  const { messages } = body; // Only need messages now

  // Get user ID from headers if available
  const userId = request.headers.get('X-USER-ID');
  if (userId) {
    console.log('User ID found in headers:', userId);
  } else {
    console.log('No User ID found in headers');
  }

  // Hardcoded replica UUID - replace with dynamic logic if needed
  const replicaId = '16d38fcc-5cb0-4f94-9cee-3e8398ef4700'; // Ensure this ID is correct

  // Try both standard and experimental API paths
  const standardApiUrl = `${SENSAY_API_URL_BASE}/replicas/${replicaId}/chat/completions`;
  const experimentalApiUrl = `${SENSAY_API_URL_BASE}/experimental/replicas/${replicaId}/chat/completions`;
  
  console.log('Attempting to use standard API URL first:', standardApiUrl);

  // Extract the content of the last message (assuming it's the user's input)
  const lastMessageContent = messages.length > 0 ? messages[messages.length - 1].content : '';

  // --- Try Standard API First --- //
  try {
    // --- DEBUG LOGGING --- //
    console.log('Sending to Sensay API (Standard):');
    console.log('  URL:', standardApiUrl);
    console.log('  Method:', 'POST');
    console.log('  Headers:', JSON.stringify({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET ? '***' : 'MISSING',
      'X-API-VERSION': '2025-03-25'
    }, null, 2));

    // Body should only contain 'content' as per docs
    const requestBodyForSensay = { content: lastMessageContent };
    console.log('  Body:', JSON.stringify(requestBodyForSensay, null, 2));
    // --- END DEBUG LOGGING --- //

    const standardResponse = await fetch(standardApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET,
        'X-API-VERSION': '2025-03-25',
        ...(userId ? { 'X-USER-ID': userId } : {}) // Add user ID if available
      },
      body: JSON.stringify(requestBodyForSensay),
    });

    const standardResponseText = await standardResponse.text();
    console.log('Raw Sensay API Response Status (Standard):', standardResponse.status);
    console.log('Raw Sensay API Response Body (Standard):', standardResponseText);

    if (standardResponse.ok) {
      let responseData: unknown;
      try {
        responseData = JSON.parse(standardResponseText);
        // Validate the structure of the successful response (basic check)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof responseData !== 'object' || responseData === null || !('choices' in responseData) || !Array.isArray((responseData as any).choices) || (responseData as any).choices.length === 0) {
          console.error("Unexpected Sensay API response structure:", responseData);
          throw new Error("Unexpected Sensay API response structure");
        }

        // Extract the reply (adjust based on actual API response structure if needed)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reply = (responseData as any)?.choices[0]?.message?.content;

        if (typeof reply !== 'string') {
          console.error("Could not extract reply content from Sensay response:", responseData);
          throw new Error("Could not extract reply content from Sensay response");
        }

        return NextResponse.json({ reply, apiPath: 'standard' });
      } catch (e) {
        console.error("Failed to parse Sensay API JSON response:", e);
        throw new Error("Failed to parse Sensay API JSON response");
      }
    }

    // If standard API failed, try the experimental path
    console.log('Standard API failed, trying experimental API path');
  } catch (standardError) {
    console.error('Error calling standard Sensay API:', standardError);
  }

  // --- Try Experimental API Next --- //
  console.log('Attempting to use experimental API URL:', experimentalApiUrl);
  
  try {
    // --- DEBUG LOGGING for Experimental --- //
    console.log('Sending to Sensay API (Experimental):');
    console.log('  URL:', experimentalApiUrl);
    console.log('  Method:', 'POST');
    console.log('  Headers:', JSON.stringify({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET ? '***' : 'MISSING',
      'X-API-VERSION': '2025-03-25'
    }, null, 2));

    // For experimental, try the OpenAI format with messages array
    const experimentalRequestBody = { messages: messages, model: "sensay-default" };
    console.log('  Body (Experimental):', JSON.stringify(experimentalRequestBody, null, 2));
    // --- END DEBUG LOGGING --- //

    const experimentalResponse = await fetch(experimentalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET,
        'X-API-VERSION': '2025-03-25',
        ...(userId ? { 'X-USER-ID': userId } : {}) // Add user ID if available
      },
      body: JSON.stringify(experimentalRequestBody),
    });

    const experimentalResponseText = await experimentalResponse.text();
    console.log('Raw Sensay API Response Status (Experimental):', experimentalResponse.status);
    console.log('Raw Sensay API Response Body (Experimental):', experimentalResponseText);

    if (experimentalResponse.ok) {
      let responseData: unknown;
      try {
        responseData = JSON.parse(experimentalResponseText);
        // Validate the structure of the successful response (basic check)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof responseData !== 'object' || responseData === null || !('choices' in responseData) || !Array.isArray((responseData as any).choices) || (responseData as any).choices.length === 0) {
          console.error("Unexpected Sensay API response structure:", responseData);
          throw new Error("Unexpected Sensay API response structure");
        }

        // Extract the reply (adjust based on actual API response structure if needed)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reply = (responseData as any)?.choices[0]?.message?.content;

        if (typeof reply !== 'string') {
          console.error("Could not extract reply content from Sensay response:", responseData);
          throw new Error("Could not extract reply content from Sensay response");
        }

        return NextResponse.json({ reply, apiPath: 'experimental' });
      } catch (e) {
        console.error("Failed to parse Sensay API JSON response:", e);
        throw new Error("Failed to parse Sensay API JSON response");
      }
    }

    // If both failed, combine error messages and throw
    let errorDetail = experimentalResponseText;
    try {
      const jsonError = JSON.parse(experimentalResponseText);
      errorDetail = jsonError.error || jsonError.message || experimentalResponseText;
    } catch {
      // If parsing fails, use the raw text
    }
    console.error(`Sensay API Error (${experimentalResponse.status}):`, errorDetail);
    throw new Error(`Sensay API Error (${experimentalResponse.status}): ${errorDetail}`);
  } catch (error) {
    console.error('Error calling Sensay API (both standard and experimental):', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const status = errorMessage.includes('Sensay API Error (401)') ? 401
                : errorMessage.includes('Sensay API Error (400)') ? 400
                : errorMessage.includes('Sensay API Error (404)') ? 404
                : 500; // Default to internal server error
                
    // Include more details in the error response
    return NextResponse.json({ 
      error: errorMessage,
      details: {
        standardApiUrl,
        experimentalApiUrl,
        requestSent: {
          standard: { content: lastMessageContent },
          experimental: { messages, model: "sensay-default" }
        }
      }
    }, { status });
  }
}
