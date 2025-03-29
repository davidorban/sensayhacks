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
  const userId = request.headers.get('X-USER-ID') || 'test-user-id';
  console.log('User ID being used:', userId);

  // --- First, let's attempt to list replicas to find valid IDs --- //
  console.log('Attempting to list available replicas...');
  
  try {
    const listReplicasUrl = `${SENSAY_API_URL_BASE}/replicas`;
    console.log('List Replicas URL:', listReplicasUrl);
    
    const replicasResponse = await fetch(listReplicasUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET,
        'X-API-VERSION': '2025-03-25'
      }
    });
    
    const replicasText = await replicasResponse.text();
    console.log('Replicas API Response Status:', replicasResponse.status);
    console.log('Replicas API Response:', replicasText);
    
    let replicaId = '16d38fcc-5cb0-4f94-9cee-3e8398ef4700'; // Default fallback
    
    if (replicasResponse.ok) {
      try {
        const replicasData = JSON.parse(replicasText);
        if (Array.isArray(replicasData) && replicasData.length > 0) {
          // Use the first replica ID from the response
          replicaId = replicasData[0].id || replicaId;
          console.log('Found replica ID from API:', replicaId);
        }
      } catch (e) {
        console.error('Failed to parse replicas response:', e);
      }
    }
    
    // Extract the content of the last message (assuming it's the user's input)
    const lastMessageContent = messages.length > 0 ? messages[messages.length - 1].content : '';

    // --- Try different API path variations --- //
    // The following are possible paths we'll try in order:
    // 1. /v1/replicas/{id}/chat/completions (standard)
    // 2. /v1/experimental/replicas/{id}/chat/completions (experimental)
    // 3. /replicas/{id}/chat/completions (no v1 prefix)
    // 4. /replicas/{id}/completions (no chat segment)
    // 5. /v1/chat/completions (OpenAI-style path)
    
    // Store all attempts and their results
    const attemptResults = [];
    
    // --- 1. Try Standard Path --- //
    const standardApiUrl = `${SENSAY_API_URL_BASE}/replicas/${replicaId}/chat/completions`;
    console.log('1. Trying standard API URL:', standardApiUrl);
    
    try {
      // Body should only contain 'content' as per docs
      const standardRequestBody = { content: lastMessageContent };
      console.log('Standard request body:', JSON.stringify(standardRequestBody, null, 2));
      
      const standardResponse = await fetch(standardApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET,
          'X-API-VERSION': '2025-03-25',
          'X-USER-ID': userId
        },
        body: JSON.stringify(standardRequestBody),
      });

      const standardResponseText = await standardResponse.text();
      console.log('Standard API Response Status:', standardResponse.status);
      console.log('Standard API Response Body:', standardResponseText);
      
      attemptResults.push({
        path: 'standard',
        url: standardApiUrl,
        status: standardResponse.status,
        response: standardResponseText
      });
      
      if (standardResponse.ok) {
        let responseData = JSON.parse(standardResponseText);
        // Extract the reply
        const reply = responseData?.choices?.[0]?.message?.content;
        if (typeof reply === 'string') {
          return NextResponse.json({ 
            reply, 
            apiPath: 'standard',
            replicaId
          });
        }
      }
    } catch (error) {
      console.error('Error in standard path attempt:', error);
      attemptResults.push({
        path: 'standard',
        url: standardApiUrl,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // --- 2. Try Experimental Path --- //
    const experimentalApiUrl = `${SENSAY_API_URL_BASE}/experimental/replicas/${replicaId}/chat/completions`;
    console.log('2. Trying experimental API URL:', experimentalApiUrl);
    
    try {
      // For experimental, try the OpenAI format with messages array
      const experimentalRequestBody = { messages: messages, model: "sensay-default" };
      console.log('Experimental request body:', JSON.stringify(experimentalRequestBody, null, 2));
      
      const experimentalResponse = await fetch(experimentalApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET,
          'X-API-VERSION': '2025-03-25',
          'X-USER-ID': userId
        },
        body: JSON.stringify(experimentalRequestBody),
      });

      const experimentalResponseText = await experimentalResponse.text();
      console.log('Experimental API Response Status:', experimentalResponse.status);
      console.log('Experimental API Response Body:', experimentalResponseText);
      
      attemptResults.push({
        path: 'experimental',
        url: experimentalApiUrl,
        status: experimentalResponse.status,
        response: experimentalResponseText
      });
      
      if (experimentalResponse.ok) {
        let responseData = JSON.parse(experimentalResponseText);
        // Extract the reply
        const reply = responseData?.choices?.[0]?.message?.content;
        if (typeof reply === 'string') {
          return NextResponse.json({ 
            reply, 
            apiPath: 'experimental',
            replicaId
          });
        }
      }
    } catch (error) {
      console.error('Error in experimental path attempt:', error);
      attemptResults.push({
        path: 'experimental',
        url: experimentalApiUrl,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // --- 3. Try No v1 Prefix Path --- //
    // Remove v1 from base URL if it exists
    const baseUrlWithoutV1 = SENSAY_API_URL_BASE.replace(/\/v1$/, '');
    const noV1ApiUrl = `${baseUrlWithoutV1}/replicas/${replicaId}/chat/completions`;
    console.log('3. Trying API URL without v1 prefix:', noV1ApiUrl);
    
    try {
      // Try both content and messages formats
      const noV1RequestBody = { content: lastMessageContent };
      console.log('No v1 request body:', JSON.stringify(noV1RequestBody, null, 2));
      
      const noV1Response = await fetch(noV1ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET,
          'X-API-VERSION': '2025-03-25',
          'X-USER-ID': userId
        },
        body: JSON.stringify(noV1RequestBody),
      });

      const noV1ResponseText = await noV1Response.text();
      console.log('No v1 API Response Status:', noV1Response.status);
      console.log('No v1 API Response Body:', noV1ResponseText);
      
      attemptResults.push({
        path: 'no-v1-prefix',
        url: noV1ApiUrl,
        status: noV1Response.status,
        response: noV1ResponseText
      });
      
      if (noV1Response.ok) {
        let responseData = JSON.parse(noV1ResponseText);
        // Extract the reply
        const reply = responseData?.choices?.[0]?.message?.content;
        if (typeof reply === 'string') {
          return NextResponse.json({ 
            reply, 
            apiPath: 'no-v1-prefix',
            replicaId
          });
        }
      }
    } catch (error) {
      console.error('Error in no-v1-prefix path attempt:', error);
      attemptResults.push({
        path: 'no-v1-prefix',
        url: noV1ApiUrl,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // --- 4. Try Direct Completions Path (no chat segment) --- //
    const noChartApiUrl = `${SENSAY_API_URL_BASE}/replicas/${replicaId}/completions`;
    console.log('4. Trying API URL without chat segment:', noChartApiUrl);
    
    try {
      const noChartRequestBody = { content: lastMessageContent };
      console.log('No chat segment request body:', JSON.stringify(noChartRequestBody, null, 2));
      
      const noChartResponse = await fetch(noChartApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET,
          'X-API-VERSION': '2025-03-25',
          'X-USER-ID': userId
        },
        body: JSON.stringify(noChartRequestBody),
      });

      const noChartResponseText = await noChartResponse.text();
      console.log('No chat segment API Response Status:', noChartResponse.status);
      console.log('No chat segment API Response Body:', noChartResponseText);
      
      attemptResults.push({
        path: 'no-chat-segment',
        url: noChartApiUrl,
        status: noChartResponse.status,
        response: noChartResponseText
      });
      
      if (noChartResponse.ok) {
        let responseData = JSON.parse(noChartResponseText);
        // Extract the reply
        const reply = responseData?.choices?.[0]?.message?.content || responseData?.choices?.[0]?.text;
        if (typeof reply === 'string') {
          return NextResponse.json({ 
            reply, 
            apiPath: 'no-chat-segment',
            replicaId
          });
        }
      }
    } catch (error) {
      console.error('Error in no-chart-segment path attempt:', error);
      attemptResults.push({
        path: 'no-chat-segment',
        url: noChartApiUrl,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // --- 5. Try OpenAI-style Path --- //
    const openAIStyleUrl = `${SENSAY_API_URL_BASE}/chat/completions`;
    console.log('5. Trying OpenAI-style URL:', openAIStyleUrl);
    
    try {
      const openAIStyleRequestBody = { 
        messages: messages, 
        model: "sensay-default",
        user: userId
      };
      console.log('OpenAI-style request body:', JSON.stringify(openAIStyleRequestBody, null, 2));
      
      const openAIStyleResponse = await fetch(openAIStyleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-ORGANIZATION-SECRET': SENSAY_ORGANIZATION_SECRET,
          'X-API-VERSION': '2025-03-25',
          'X-USER-ID': userId
        },
        body: JSON.stringify(openAIStyleRequestBody),
      });

      const openAIStyleResponseText = await openAIStyleResponse.text();
      console.log('OpenAI-style API Response Status:', openAIStyleResponse.status);
      console.log('OpenAI-style API Response Body:', openAIStyleResponseText);
      
      attemptResults.push({
        path: 'openai-style',
        url: openAIStyleUrl,
        status: openAIStyleResponse.status,
        response: openAIStyleResponseText
      });
      
      if (openAIStyleResponse.ok) {
        let responseData = JSON.parse(openAIStyleResponseText);
        // Extract the reply
        const reply = responseData?.choices?.[0]?.message?.content;
        if (typeof reply === 'string') {
          return NextResponse.json({ 
            reply, 
            apiPath: 'openai-style',
            replicaId
          });
        }
      }
    } catch (error) {
      console.error('Error in openai-style path attempt:', error);
      attemptResults.push({
        path: 'openai-style',
        url: openAIStyleUrl,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // If all attempts failed, return detailed error information
    return NextResponse.json({ 
      error: 'All API path attempts failed',
      attempts: attemptResults,
      replicaId,
      baseApiUrl: SENSAY_API_URL_BASE
    }, { status: 500 });
    
  } catch (error) {
    console.error('Error during API discovery process:', error);
    return NextResponse.json({ 
      error: 'API discovery process failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
