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
  path?: string;
  url?: string;
  method?: string;
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

// Helper function for consistent authentication headers
function getAuthHeaders(userId: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SENSAY_ORGANIZATION_SECRET}`,
    'X-USER-ID': userId,
    'X-API-Version': currentDate
  };
}

// Helper function for organization-only auth headers (for initial user creation)
function getOrgOnlyHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Organization-Secret': SENSAY_ORGANIZATION_SECRET,
    'X-API-Version': currentDate
  };
}

export async function POST(request: NextRequest) {
  console.log('--- Request received at /api/chat-test ---');
  
  try {
    // Get the request body
    const body = await request.json();
    
    // Extract messages and user ID from the request body
    const { messages, userId = 'test-user-id' } = body as RequestBody;
    
    console.log('Messages received:', messages);
    console.log('User ID:', userId);
    
    // Get replica ID from request or use default
    let replicaId = body.replicaId || '16d38fcc-5cb0-4f94-9cee-3e8398ef4700';
    console.log('Using Replica ID:', replicaId);
    
    // Array to store results of each user creation attempt
    const userCreationResults: AttemptResult[] = [];
    
    // Try to register the user first with X-Organization-Secret header
    try {
      console.log('Attempting user registration with Organization Secret header...');
      const createUserUrl = `${SENSAY_API_URL_BASE}/v1/users`;
      const createUserBody = { 
        external_id: userId, 
        metadata: { 
          app: "SensayHacks",
          source: "api-integration"
        }
      };
      
      const createUserResponse = await fetch(createUserUrl, {
        method: 'POST',
        headers: getOrgOnlyHeaders(),
        body: JSON.stringify(createUserBody),
      });
      
      const createUserText = await createUserResponse.text();
      console.log('User registration status (Org Secret):', createUserResponse.status);
      console.log('User registration response (Org Secret):', createUserText);
      
      userCreationResults.push({
        method: 'Organization Secret Header',
        status: createUserResponse.status,
        response: createUserText
      });
      
      if (createUserResponse.ok) {
        console.log('User registered successfully with Organization Secret header');
      }
    } catch (error) {
      console.log('Error creating user with Organization Secret header:', error);
      userCreationResults.push({
        method: 'Organization Secret Header',
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Try to register the user with Bearer token
    try {
      console.log('Attempting user registration with Bearer token...');
      const createUserUrl = `${SENSAY_API_URL_BASE}/v1/users`;
      const createUserBody = { 
        external_id: userId, 
        metadata: { 
          app: "SensayHacks",
          source: "api-integration"
        }
      };
      
      const createUserResponse = await fetch(createUserUrl, {
        method: 'POST',
        headers: getAuthHeaders(userId),
        body: JSON.stringify(createUserBody),
      });
      
      const createUserText = await createUserResponse.text();
      console.log('User registration status (Bearer):', createUserResponse.status);
      console.log('User registration response (Bearer):', createUserText);
      
      userCreationResults.push({
        method: 'Bearer Token',
        status: createUserResponse.status,
        response: createUserText
      });
      
      if (createUserResponse.ok) {
        console.log('User registered successfully with Bearer token');
      }
    } catch (error) {
      console.log('Error creating user with Bearer token:', error);
      userCreationResults.push({
        method: 'Bearer Token',
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Basic validation
    if (!SENSAY_API_URL_BASE) { 
      console.error('API URL Base not configured.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    if (!SENSAY_ORGANIZATION_SECRET) { 
      console.error('Organization Secret not configured.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Add default model if not provided
    if (!body.model) {
      body.model = 'sensay';
    }
    
    // Validate body content (basic)
    if (!body || typeof body !== 'object' || !Array.isArray(messages)) { 
      const error = 'Invalid request format: requires messages array.';
      console.error(error, 'Received:', body);
      return NextResponse.json({ error }, { status: 400 });
    }

    // Array to store results of each attempt
    const attemptResults: AttemptResult[] = [];

    // Add more debug info about the configuration
    console.log('Debug - Full headers being used:');
    console.log('Auth headers:', JSON.stringify(getAuthHeaders(userId)));
    console.log('Organization headers:', JSON.stringify(getOrgOnlyHeaders()));
    
    // First try to list replicas to get valid IDs
    try {
      console.log('Attempting to list replicas...');
      const listReplicasUrl = `${SENSAY_API_URL_BASE}/v1/replicas`;
      console.log('List Replicas URL:', listReplicasUrl);
      
      // Try with Bearer token first
      const listReplicasResponse = await fetch(listReplicasUrl, {
        method: 'GET',
        headers: getAuthHeaders(userId)
      });
      
      const listReplicasText = await listReplicasResponse.text();
      console.log('List Replicas Status (Bearer):', listReplicasResponse.status);
      console.log('List Replicas Response (Bearer):', listReplicasText);
      
      // If Bearer token failed, try with Organization Secret
      if (listReplicasResponse.status === 401) {
        console.log('Trying list replicas with Organization Secret...');
        const listReplicasOrgResponse = await fetch(listReplicasUrl, {
          method: 'GET',
          headers: getOrgOnlyHeaders()
        });
        
        const listReplicasOrgText = await listReplicasOrgResponse.text();
        console.log('List Replicas Status (Org):', listReplicasOrgResponse.status);
        console.log('List Replicas Response (Org):', listReplicasOrgText);
        
        if (listReplicasOrgResponse.ok) {
          try {
            const replicasData = JSON.parse(listReplicasOrgText);
            if (replicasData.replicas && replicasData.replicas.length > 0) {
              // Use the first replica ID from the list
              replicaId = replicasData.replicas[0].id;
              console.log('Found valid replica ID (Org):', replicaId);
            }
          } catch (parseError) {
            console.error('Error parsing replicas response (Org):', parseError);
          }
        }
      } else if (listReplicasResponse.ok) {
        try {
          const replicasData = JSON.parse(listReplicasText);
          if (replicasData.replicas && replicasData.replicas.length > 0) {
            // Use the first replica ID from the list
            replicaId = replicasData.replicas[0].id;
            console.log('Found valid replica ID (Bearer):', replicaId);
          }
        } catch (parseError) {
          console.error('Error parsing replicas response (Bearer):', parseError);
        }
      }
    } catch (listError) {
      console.error('Error listing replicas:', listError);
    }

    // Attempt 1: Standard API Path with Bearer token
    try {
      console.log('Attempting standard replica path with Bearer token...');
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
        headers: getAuthHeaders(userId),
        body: JSON.stringify(requestBody),
      });
      
      const standardResponseText = await standardResponse.text();
      console.log('Standard API Response Status (Bearer):', standardResponse.status);
      console.log('Standard API Response Body (Bearer):', standardResponseText);
      
      attemptResults.push({
        path: 'Standard API Path (Bearer)',
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
            apiPathUsed: 'standard-bearer',
            debug: { url: standardApiUrl }
          });
        }
      }
    } catch (error) {
      console.error('Error in standard path attempt with Bearer:', error);
      const standardApiUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
      attemptResults.push({
        path: 'Standard API Path (Bearer)',
        url: standardApiUrl,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Attempt 2: Standard API Path with Organization Secret
    try {
      console.log('Attempting standard replica path with Organization Secret...');
      const standardApiUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
      
      const requestBody = {
        messages: messages.map((msg: Message) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
      };
      
      // Add user ID to Organization Secret headers
      const orgHeadersWithUserId = {
        ...getOrgOnlyHeaders(),
        'X-USER-ID': userId
      };
      
      console.log('Standard API URL (Org):', standardApiUrl);
      console.log('Standard Request Body (Org):', JSON.stringify(requestBody));
      
      const standardOrgResponse = await fetch(standardApiUrl, {
        method: 'POST',
        headers: orgHeadersWithUserId,
        body: JSON.stringify(requestBody),
      });
      
      const standardOrgResponseText = await standardOrgResponse.text();
      console.log('Standard API Response Status (Org):', standardOrgResponse.status);
      console.log('Standard API Response Body (Org):', standardOrgResponseText);
      
      attemptResults.push({
        path: 'Standard API Path (Org)',
        url: standardApiUrl,
        status: standardOrgResponse.status,
        error: standardOrgResponse.statusText,
        response: standardOrgResponseText
      });
      
      if (standardOrgResponse.ok) {
        const responseData = JSON.parse(standardOrgResponseText);
        // Extract the reply
        const reply = responseData?.choices?.[0]?.message?.content;
        if (typeof reply === 'string') {
          return NextResponse.json({ 
            reply,
            apiPathUsed: 'standard-org',
            debug: { url: standardApiUrl }
          });
        }
      }
    } catch (error) {
      console.error('Error in standard path attempt with Org Secret:', error);
      const standardApiUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
      attemptResults.push({
        path: 'Standard API Path (Org)',
        url: standardApiUrl,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Attempt 3: Experimental path with Bearer token
    try {
      console.log('Attempting experimental path with Bearer token...');
      const experimentalApiUrl = `${SENSAY_API_URL_BASE}/v1/experimental/replicas/${replicaId}/chat/completions`;
      
      const requestBody = {
        messages: messages.map((msg: Message) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        store: true,
        source: "web"
      };
      
      console.log('Experimental API URL:', experimentalApiUrl);
      console.log('Experimental Request Body:', JSON.stringify(requestBody));
      
      const experimentalResponse = await fetch(experimentalApiUrl, {
        method: 'POST',
        headers: getAuthHeaders(userId),
        body: JSON.stringify(requestBody),
      });
      
      const experimentalResponseText = await experimentalResponse.text();
      console.log('Experimental API Response Status (Bearer):', experimentalResponse.status);
      console.log('Experimental API Response Body (Bearer):', experimentalResponseText);
      
      attemptResults.push({
        path: 'Experimental API Path (Bearer)',
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
            apiPathUsed: 'experimental-bearer',
            debug: { url: experimentalApiUrl }
          });
        }
      }
    } catch (error) {
      console.error('Error in experimental path attempt with Bearer:', error);
      const experimentalApiUrl = `${SENSAY_API_URL_BASE}/v1/experimental/replicas/${replicaId}/chat/completions`;
      attemptResults.push({
        path: 'Experimental API Path (Bearer)',
        url: experimentalApiUrl,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Attempt 4: Experimental path with Organization Secret
    try {
      console.log('Attempting experimental path with Organization Secret...');
      const experimentalApiUrl = `${SENSAY_API_URL_BASE}/v1/experimental/replicas/${replicaId}/chat/completions`;
      
      const requestBody = {
        messages: messages.map((msg: Message) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        store: true,
        source: "web"
      };
      
      // Add user ID to Organization Secret headers
      const orgHeadersWithUserId = {
        ...getOrgOnlyHeaders(),
        'X-USER-ID': userId
      };
      
      console.log('Experimental API URL (Org):', experimentalApiUrl);
      console.log('Experimental Request Body (Org):', JSON.stringify(requestBody));
      
      const experimentalOrgResponse = await fetch(experimentalApiUrl, {
        method: 'POST',
        headers: orgHeadersWithUserId,
        body: JSON.stringify(requestBody),
      });
      
      const experimentalOrgResponseText = await experimentalOrgResponse.text();
      console.log('Experimental API Response Status (Org):', experimentalOrgResponse.status);
      console.log('Experimental API Response Body (Org):', experimentalOrgResponseText);
      
      attemptResults.push({
        path: 'Experimental API Path (Org)',
        url: experimentalApiUrl,
        status: experimentalOrgResponse.status,
        error: experimentalOrgResponse.statusText,
        response: experimentalOrgResponseText
      });
      
      if (experimentalOrgResponse.ok) {
        const responseData = JSON.parse(experimentalOrgResponseText);
        // Extract the reply
        const reply = responseData?.choices?.[0]?.message?.content;
        if (typeof reply === 'string') {
          return NextResponse.json({ 
            reply,
            apiPathUsed: 'experimental-org',
            debug: { url: experimentalApiUrl }
          });
        }
      }
    } catch (error) {
      console.error('Error in experimental path attempt with Org Secret:', error);
      const experimentalApiUrl = `${SENSAY_API_URL_BASE}/v1/experimental/replicas/${replicaId}/chat/completions`;
      attemptResults.push({
        path: 'Experimental API Path (Org)',
        url: experimentalApiUrl,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // If all attempts failed, return detailed error information
    return NextResponse.json(
      {
        error: 'All API path attempts failed',
        baseApiUrl: SENSAY_API_URL_BASE,
        replicaId: replicaId,
        userCreationResults,
        attempts: attemptResults,
        message: 'Attempted multiple API paths. See attempts for details.'
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to parse request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
