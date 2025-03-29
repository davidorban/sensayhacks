import { NextResponse, type NextRequest } from 'next/server';

// Define expected request message structure (subset of OpenAI)
interface RequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | null; // Allow null content just in case, though API expects string
}

// Define expected request body structure
interface RequestBody {
  messages: RequestMessage[];
  model?: string; // Make model optional
  userId?: string; // Add userId field
}

// Define message interface for API interactions
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string | null;
  id?: string;
  isLoading?: boolean;
}

// Define attempt result tracking
interface AttemptResult {
  path: string;
  url: string;
  status?: number;
  error?: string;
  response?: string;
}

// Environment variables - Make sure to set clean base API URL
let SENSAY_API_URL_BASE = process.env.SENSAY_API_URL_BASE || 'https://api.sensay.io';

// Remove any trailing slashes
SENSAY_API_URL_BASE = SENSAY_API_URL_BASE.replace(/\/+$/, '');

// Check if the URL already contains API version and path segments
const hasV1 = SENSAY_API_URL_BASE.includes('/v1');
const hasExperimental = SENSAY_API_URL_BASE.includes('/experimental');
const hasReplicas = SENSAY_API_URL_BASE.includes('/replicas');

// If URL already has path segments, use a cleaned version
if (hasV1 || hasExperimental || hasReplicas) {
  // Extract the base domain
  const baseUrlMatch = SENSAY_API_URL_BASE.match(/(https?:\/\/[^\/]+)/);
  if (baseUrlMatch) {
    console.log('Detected already configured URL with path segments, using domain only');
    SENSAY_API_URL_BASE = baseUrlMatch[1];
  }
}

// The API key should be stored in SENSAY_ORGANIZATION_SECRET or SENSAY_API_KEY
// The correct header format may vary (x-api-key, Authorization, etc.)
// We'll try multiple variations to find the right one
const SENSAY_ORGANIZATION_SECRET = process.env.SENSAY_ORGANIZATION_SECRET || process.env.SENSAY_API_KEY || '';

// Current date for API versioning
const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

// Log environment variable values on function execution (for debugging Vercel env)
console.log('Clean API Base URL:', SENSAY_API_URL_BASE);
console.log('API Key Config:', SENSAY_ORGANIZATION_SECRET ? '[PROVIDED]' : '[MISSING]');
console.log('Using API Version Date:', currentDate);

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
    body = await request.json() as RequestBody;
    
    // Add default userId if not provided
    if (!body.userId) {
      body.userId = 'test-user-id';
    }
    
    // Set default model if not provided
    if (!body.model) {
      body.model = 'sensay';
    }
  } catch (e) {
    console.error('Failed to parse request body:', e);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate body content (basic)
  if (!body || typeof body !== 'object' || !Array.isArray(body.messages)) { 
      const error = 'Invalid request format: requires messages array.';
      console.error(error, 'Received:', body);
      return NextResponse.json({ error }, { status: 400 });
  }

  // Extract the messages from the validated body
  const { messages, userId = body.userId || 'test-user-id' } = body;

  // Track the results of each attempt
  const attemptResults: AttemptResult[] = [];

  // Hardcoded replicaId for this test - would eventually come from user settings or selection
  let replicaId = '16d38fcc-5cb0-4f94-9cee-3e8398ef4700';

  // First try to list replicas to get valid IDs
  try {
    console.log('Attempting to list replicas...');
    const listReplicasUrl = `${SENSAY_API_URL_BASE}/v1/replicas`;
    console.log('List Replicas URL:', listReplicasUrl);
    
    const listReplicasResponse = await fetch(listReplicasUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Organization-Secret': SENSAY_ORGANIZATION_SECRET,
        'X-USER-ID': userId,
        'X-API-Version': currentDate
      }
    });
    
    const listReplicasText = await listReplicasResponse.text();
    console.log('List Replicas Status:', listReplicasResponse.status);
    console.log('List Replicas Response:', listReplicasText);
    
    if (listReplicasResponse.ok) {
      try {
        const replicasData = JSON.parse(listReplicasText);
        if (replicasData.replicas && replicasData.replicas.length > 0) {
          // Use the first replica ID from the list
          replicaId = replicasData.replicas[0].id;
          console.log('Found valid replica ID:', replicaId);
        }
      } catch (parseError) {
        console.error('Error parsing replicas response:', parseError);
      }
    }
  } catch (listError) {
    console.error('Error listing replicas:', listError);
  }

  // Attempt 1: Standard OpenAI-style path - /v1/chat/completions
  try {
    console.log('Attempting OpenAI-style path...');
    const openAIStyleApiUrl = `${SENSAY_API_URL_BASE}/v1/chat/completions`;
    
    const requestBody = {
      messages: messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      model: 'sensay', // This may need to be adjusted based on Sensay API requirements
    };
    
    console.log('OpenAI-style URL:', openAIStyleApiUrl);
    console.log('OpenAI-style Request Body:', JSON.stringify(requestBody));
    
    const openAIStyleResponse = await fetch(openAIStyleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Organization-Secret': SENSAY_ORGANIZATION_SECRET,
        'X-USER-ID': userId,
        'X-API-Version': currentDate
      },
      body: JSON.stringify(requestBody),
    });
    
    const openAIStyleResponseText = await openAIStyleResponse.text();
    console.log('OpenAI-style Response Status:', openAIStyleResponse.status);
    console.log('OpenAI-style Response Body:', openAIStyleResponseText);
    
    attemptResults.push({
      path: 'OpenAI-style API Path',
      url: openAIStyleApiUrl,
      status: openAIStyleResponse.status,
      error: openAIStyleResponse.statusText,
      response: openAIStyleResponseText
    });
    
    if (openAIStyleResponse.ok) {
      const responseData = JSON.parse(openAIStyleResponseText);
      // Extract the reply
      const reply = responseData?.choices?.[0]?.message?.content;
      if (typeof reply === 'string') {
        return NextResponse.json({ 
          reply,
          apiPathUsed: 'openai-style',
          debug: { url: openAIStyleApiUrl }
        });
      }
    }
  } catch (error) {
    console.error('Error in openai-style path attempt:', error);
    const openAIStyleApiUrl = `${SENSAY_API_URL_BASE}/v1/chat/completions`;
    attemptResults.push({
      path: 'OpenAI-style API Path',
      url: openAIStyleApiUrl,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Attempt 2: Path with replica ID - /v1/replicas/{id}/chat/completions
  try {
    console.log('Attempting standard replica path...');
    const standardApiUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    
    const requestBody = {
      messages: messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    };
    
    console.log('Standard API URL:', standardApiUrl);
    console.log('Standard Request Body:', JSON.stringify(requestBody));
    
    const standardResponse = await fetch(standardApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Organization-Secret': SENSAY_ORGANIZATION_SECRET,
        'x-organization-secret': SENSAY_ORGANIZATION_SECRET, // Try lowercase version too
        'Organization-Secret': SENSAY_ORGANIZATION_SECRET, // Try without X- prefix
        'X-API-KEY': SENSAY_ORGANIZATION_SECRET, // Try as API key
        'X-USER-ID': userId,
        'X-API-Version': currentDate
      },
      body: JSON.stringify(requestBody),
    });
    
    const standardResponseText = await standardResponse.text();
    console.log('Standard API Response Status:', standardResponse.status);
    console.log('Standard API Response Body:', standardResponseText);
    
    attemptResults.push({
      path: 'Standard API Path',
      url: standardApiUrl,
      status: standardResponse.status,
      error: standardResponse.statusText,
      response: standardResponseText
    });
    
    if (standardResponse.ok) {
      const responseData = JSON.parse(standardResponseText);
      // Extract the reply
      const reply = responseData?.choices?.[0]?.message?.content;
      if (typeof reply === 'string') {
        return NextResponse.json({ 
          reply,
          apiPathUsed: 'standard',
          debug: { url: standardApiUrl }
        });
      }
    }
  } catch (error) {
    console.error('Error in standard path attempt:', error);
    const standardApiUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    attemptResults.push({
      path: 'Standard API Path',
      url: standardApiUrl,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Attempt 3: Experimental path - /v1/experimental/replicas/{id}/chat/completions
  try {
    console.log('Attempting experimental path...');
    const experimentalApiUrl = `${SENSAY_API_URL_BASE}/v1/experimental/replicas/${replicaId}/chat/completions`;
    
    const requestBody = {
      messages: messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    };
    
    console.log('Experimental API URL:', experimentalApiUrl);
    console.log('Experimental Request Body:', JSON.stringify(requestBody));
    
    const experimentalResponse = await fetch(experimentalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Organization-Secret': SENSAY_ORGANIZATION_SECRET,
        'x-organization-secret': SENSAY_ORGANIZATION_SECRET,
        'Organization-Secret': SENSAY_ORGANIZATION_SECRET,
        'X-API-KEY': SENSAY_ORGANIZATION_SECRET,
        'X-USER-ID': userId,
        'X-API-Version': currentDate
      },
      body: JSON.stringify(requestBody),
    });
    
    const experimentalResponseText = await experimentalResponse.text();
    console.log('Experimental API Response Status:', experimentalResponse.status);
    console.log('Experimental API Response Body:', experimentalResponseText);
    
    attemptResults.push({
      path: 'Experimental API Path',
      url: experimentalApiUrl,
      status: experimentalResponse.status,
      error: experimentalResponse.statusText,
      response: experimentalResponseText
    });
    
    if (experimentalResponse.ok) {
      const responseData = JSON.parse(experimentalResponseText);
      // Extract the reply
      const reply = responseData?.choices?.[0]?.message?.content;
      if (typeof reply === 'string') {
        return NextResponse.json({ 
          reply,
          apiPathUsed: 'experimental',
          debug: { url: experimentalApiUrl }
        });
      }
    }
  } catch (error) {
    console.error('Error in experimental path attempt:', error);
    const experimentalApiUrl = `${SENSAY_API_URL_BASE}/v1/experimental/replicas/${replicaId}/chat/completions`;
    attemptResults.push({
      path: 'Experimental API Path',
      url: experimentalApiUrl,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Attempt 4: Just completions, no chat segment - /v1/replicas/{id}/completions
  try {
    console.log('Attempting completions without chat segment...');
    const completionsApiUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/completions`;
    
    const requestBody = {
      prompt: messages.map((msg: Message) => `${msg.role}: ${msg.content}`).join('\n'),
      max_tokens: 500,
    };
    
    console.log('Completions API URL:', completionsApiUrl);
    console.log('Completions Request Body:', JSON.stringify(requestBody));
    
    const completionsResponse = await fetch(completionsApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Organization-Secret': SENSAY_ORGANIZATION_SECRET,
        'X-USER-ID': userId,
        'X-API-Version': currentDate
      },
      body: JSON.stringify(requestBody),
    });
    
    const completionsResponseText = await completionsResponse.text();
    console.log('Completions API Response Status:', completionsResponse.status);
    console.log('Completions API Response Body:', completionsResponseText);
    
    attemptResults.push({
      path: 'Completions API Path',
      url: completionsApiUrl,
      status: completionsResponse.status,
      error: completionsResponse.statusText,
      response: completionsResponseText
    });
    
    if (completionsResponse.ok) {
      const responseData = JSON.parse(completionsResponseText);
      // Extract the reply, this format might be different
      const reply = responseData?.choices?.[0]?.text || responseData?.text;
      if (typeof reply === 'string') {
        return NextResponse.json({ 
          reply,
          apiPathUsed: 'completions',
          debug: { url: completionsApiUrl }
        });
      }
    }
  } catch (error) {
    console.error('Error in completions path attempt:', error);
    const completionsApiUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/completions`;
    attemptResults.push({
      path: 'Completions API Path',
      url: completionsApiUrl,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Attempt 5: Different organization header - "Authorization" instead of "X-Organization-Secret"
  try {
    console.log('Attempting with Authorization header...');
    const authApiUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    
    const requestBody = {
      messages: messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    };
    
    console.log('Auth API URL:', authApiUrl);
    console.log('Auth Request Body:', JSON.stringify(requestBody));
    
    const authResponse = await fetch(authApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENSAY_ORGANIZATION_SECRET}`,
        'X-USER-ID': userId,
        'X-API-Version': currentDate
      },
      body: JSON.stringify(requestBody),
    });
    
    const authResponseText = await authResponse.text();
    console.log('Auth API Response Status:', authResponse.status);
    console.log('Auth API Response Body:', authResponseText);
    
    attemptResults.push({
      path: 'Authorization Header API Path',
      url: authApiUrl,
      status: authResponse.status,
      error: authResponse.statusText,
      response: authResponseText
    });
    
    if (authResponse.ok) {
      const responseData = JSON.parse(authResponseText);
      // Extract the reply
      const reply = responseData?.choices?.[0]?.message?.content;
      if (typeof reply === 'string') {
        return NextResponse.json({ 
          reply,
          apiPathUsed: 'auth-header',
          debug: { url: authApiUrl }
        });
      }
    }
  } catch (error) {
    console.error('Error in auth header path attempt:', error);
    const authApiUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    attemptResults.push({
      path: 'Authorization Header API Path',
      url: authApiUrl,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Attempt 6: Auth variations with lowercase 'key' and 'secret'
  try {
    console.log('Attempting with lowercase auth headers...');
    const lowerCaseAuthUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    
    const requestBody = {
      messages: messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    };
    
    console.log('Lowercase Auth URL:', lowerCaseAuthUrl);
    
    const lowerCaseResponse = await fetch(lowerCaseAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SENSAY_ORGANIZATION_SECRET,
        'x-user-id': userId,
        'x-api-version': currentDate
      },
      body: JSON.stringify(requestBody),
    });
    
    const lowerCaseResponseText = await lowerCaseResponse.text();
    console.log('Lowercase Auth Response Status:', lowerCaseResponse.status);
    console.log('Lowercase Auth Response Body:', lowerCaseResponseText);
    
    attemptResults.push({
      path: 'Lowercase Headers Path',
      url: lowerCaseAuthUrl,
      status: lowerCaseResponse.status,
      error: lowerCaseResponse.statusText,
      response: lowerCaseResponseText
    });
    
    if (lowerCaseResponse.ok) {
      const responseData = JSON.parse(lowerCaseResponseText);
      // Extract the reply
      const reply = responseData?.choices?.[0]?.message?.content;
      if (typeof reply === 'string') {
        return NextResponse.json({ 
          reply,
          apiPathUsed: 'lowercase-headers',
          debug: { url: lowerCaseAuthUrl }
        });
      }
    }
  } catch (error) {
    console.error('Error in lowercase headers attempt:', error);
    const lowerCaseAuthUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    attemptResults.push({
      path: 'Lowercase Headers Path',
      url: lowerCaseAuthUrl,
      error: error instanceof Error ? error.message : String(error)
    });
  }
  
  // Attempt 7: API key in URL query parameter
  try {
    console.log('Attempting with API key as query parameter...');
    const queryParamUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions?api_key=${encodeURIComponent(SENSAY_ORGANIZATION_SECRET)}`;
    
    const requestBody = {
      messages: messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    };
    
    console.log('Query Param Auth URL:', queryParamUrl.replace(SENSAY_ORGANIZATION_SECRET, '[REDACTED]'));
    
    const queryParamResponse = await fetch(queryParamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-USER-ID': userId,
        'X-API-Version': currentDate
      },
      body: JSON.stringify(requestBody),
    });
    
    const queryParamResponseText = await queryParamResponse.text();
    console.log('Query Param Auth Response Status:', queryParamResponse.status);
    console.log('Query Param Auth Response Body:', queryParamResponseText);
    
    attemptResults.push({
      path: 'Query Parameter Auth Path',
      url: queryParamUrl.replace(SENSAY_ORGANIZATION_SECRET, '[REDACTED]'),
      status: queryParamResponse.status,
      error: queryParamResponse.statusText,
      response: queryParamResponseText
    });
    
    if (queryParamResponse.ok) {
      const responseData = JSON.parse(queryParamResponseText);
      // Extract the reply
      const reply = responseData?.choices?.[0]?.message?.content;
      if (typeof reply === 'string') {
        return NextResponse.json({ 
          reply,
          apiPathUsed: 'query-param-auth',
          debug: { url: queryParamUrl.replace(SENSAY_ORGANIZATION_SECRET, '[REDACTED]') }
        });
      }
    }
  } catch (error) {
    console.error('Error in query param auth attempt:', error);
    const queryParamUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions?api_key=[REDACTED]`;
    attemptResults.push({
      path: 'Query Parameter Auth Path',
      url: queryParamUrl,
      error: error instanceof Error ? error.message : String(error)
    });
  }
  
  // Attempt 8: Standard Bearer Token Auth
  try {
    console.log('Attempting with Bearer token authentication...');
    const bearerAuthUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    
    const requestBody = {
      messages: messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    };
    
    console.log('Bearer Auth URL:', bearerAuthUrl);
    
    const bearerResponse = await fetch(bearerAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENSAY_ORGANIZATION_SECRET}`,
        'X-USER-ID': userId,
        'X-API-Version': currentDate
      },
      body: JSON.stringify(requestBody),
    });
    
    const bearerResponseText = await bearerResponse.text();
    console.log('Bearer Auth Response Status:', bearerResponse.status);
    console.log('Bearer Auth Response Body:', bearerResponseText);
    
    attemptResults.push({
      path: 'Bearer Token Auth Path',
      url: bearerAuthUrl,
      status: bearerResponse.status,
      error: bearerResponse.statusText,
      response: bearerResponseText
    });
    
    if (bearerResponse.ok) {
      const responseData = JSON.parse(bearerResponseText);
      // Extract the reply
      const reply = responseData?.choices?.[0]?.message?.content;
      if (typeof reply === 'string') {
        return NextResponse.json({ 
          reply,
          apiPathUsed: 'bearer-auth',
          debug: { url: bearerAuthUrl }
        });
      }
    }
  } catch (error) {
    console.error('Error in Bearer token auth attempt:', error);
    const bearerAuthUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    attemptResults.push({
      path: 'Bearer Token Auth Path',
      url: bearerAuthUrl,
      error: error instanceof Error ? error.message : String(error)
    });
  }
  
  // Attempt 9: Experimental Bearer Token Auth
  try {
    console.log('Attempting with Bearer token on experimental path...');
    const expBearerAuthUrl = `${SENSAY_API_URL_BASE}/v1/experimental/replicas/${replicaId}/chat/completions`;
    
    const requestBody = {
      messages: messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    };
    
    console.log('Experimental Bearer Auth URL:', expBearerAuthUrl);
    
    const expBearerResponse = await fetch(expBearerAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENSAY_ORGANIZATION_SECRET}`,
        'X-USER-ID': userId,
        'X-API-Version': currentDate
      },
      body: JSON.stringify(requestBody),
    });
    
    const expBearerResponseText = await expBearerResponse.text();
    console.log('Experimental Bearer Auth Response Status:', expBearerResponse.status);
    console.log('Experimental Bearer Auth Response Body:', expBearerResponseText);
    
    attemptResults.push({
      path: 'Experimental Bearer Token Auth Path',
      url: expBearerAuthUrl,
      status: expBearerResponse.status,
      error: expBearerResponse.statusText,
      response: expBearerResponseText
    });
    
    if (expBearerResponse.ok) {
      const responseData = JSON.parse(expBearerResponseText);
      // Extract the reply
      const reply = responseData?.choices?.[0]?.message?.content;
      if (typeof reply === 'string') {
        return NextResponse.json({ 
          reply,
          apiPathUsed: 'experimental-bearer-auth',
          debug: { url: expBearerAuthUrl }
        });
      }
    }
  } catch (error) {
    console.error('Error in experimental Bearer token auth attempt:', error);
    const expBearerAuthUrl = `${SENSAY_API_URL_BASE}/v1/experimental/replicas/${replicaId}/chat/completions`;
    attemptResults.push({
      path: 'Experimental Bearer Token Auth Path',
      url: expBearerAuthUrl,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // If all attempts failed, return detailed error information
  return NextResponse.json(
    {
      error: 'All API path attempts failed',
      baseApiUrl: SENSAY_API_URL_BASE,
      replicaId: replicaId,
      attempts: attemptResults,
      message: 'Attempted multiple API paths. See attempts for details.'
    },
    { status: 500 }
  );
}
