import { NextResponse, type NextRequest } from 'next/server';

// Define expected request message structure (subset of OpenAI)
interface RequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | null;
}

// Define expected request body structure
interface RequestBody {
  messages: RequestMessage[];
  model?: string;
  userId?: string;
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
if (SENSAY_API_URL_BASE.endsWith('/')) {
  SENSAY_API_URL_BASE = SENSAY_API_URL_BASE.slice(0, -1);
}

// Authentication secrets
const SENSAY_ORGANIZATION_SECRET = process.env.SENSAY_ORGANIZATION_SECRET || '';

// Set API version to the current date
const currentDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

// Helper function for consistent authentication headers
function getAuthHeaders(userId: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SENSAY_ORGANIZATION_SECRET}`,
    'X-User-Id': userId, // Try with dash format
    'X-USER-ID': userId, // Try with uppercase format as well
    'X-Api-Version': currentDate, // Try with dash format
    'X-API-Version': currentDate // Try with uppercase format as well
  };
}

// Helper function for organization-only auth headers (for initial user creation)
function getOrgOnlyHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Organization-Secret': SENSAY_ORGANIZATION_SECRET,
    'X-Api-Version': currentDate, // Try with dash format
    'X-API-Version': currentDate // Try with uppercase format as well
  };
}

export async function POST(request: NextRequest) {
  console.log('API call received');
  
  try {
    // Parse the request body
    const requestBody: RequestBody = await request.json();
    
    // Extract messages from the request
    const messages = requestBody.messages || [];
    console.log('Received messages:', JSON.stringify(messages));
    
    // Extract or generate user ID
    // In a real app, this would come from your auth system
    const userId = requestBody.userId || `user-${Math.random().toString(36).substring(2, 10)}`;
    console.log('Using User ID:', userId);
    
    // Default replica ID - could be passed in the request if needed
    const replicaId = 'default'; // or requestBody.model if supported
    console.log('Using Replica ID:', replicaId);
    
    // Array to store results of each user creation attempt
    const userCreationResults: AttemptResult[] = [];
    
    // Try to register the user first with X-Organization-Secret header
    try {
      console.log('Attempting user registration with Organization Secret header...');
      const createUserUrl = `${SENSAY_API_URL_BASE}/v1/users`;
      const createUserBody = { 
        external_id: userId,
        organization_secret: SENSAY_ORGANIZATION_SECRET, // Try including in body too
        metadata: { source: 'SensayHacks API test' } 
      };
      
      const createUserResponse = await fetch(createUserUrl, {
        method: 'POST',
        headers: getOrgOnlyHeaders(),
        body: JSON.stringify(createUserBody),
      });
      
      const createUserText = await createUserResponse.text();
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
        organization_secret: SENSAY_ORGANIZATION_SECRET, // Try including in body too
        metadata: { source: 'SensayHacks API test with Bearer token' } 
      };
      
      const createUserResponse = await fetch(createUserUrl, {
        method: 'POST',
        headers: getAuthHeaders(userId),
        body: JSON.stringify(createUserBody),
      });
      
      const createUserText = await createUserResponse.text();
      console.log('User registration response (Bearer token):', createUserText);
      
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
    
    // Attempt to call the Sensay API with consistent authentication
    console.log('Attempting to call Sensay API...');
    
    // Format messages for the API
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Define the request body
    const apiRequestBody = {
      messages: apiMessages,
      organization_secret: SENSAY_ORGANIZATION_SECRET, // Try including in body too
      stream: false
    };
    
    // Make the API call to Sensay
    console.log('Sending request to Sensay API...');
    const chatCompletionUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    
    // Log the headers and request body we're sending
    console.log('Headers:', JSON.stringify(getAuthHeaders(userId)));
    console.log('Request body:', JSON.stringify(apiRequestBody));
    
    const apiResponse = await fetch(chatCompletionUrl, {
      method: 'POST',
      headers: getAuthHeaders(userId),
      body: JSON.stringify(apiRequestBody),
    });
    
    // Get the response as text first for logging
    const responseText = await apiResponse.text();
    console.log('API response status:', apiResponse.status);
    console.log('API response text:', responseText);
    
    // Prepare the user creation results for response
    const detailedAttempts = userCreationResults.map(result => ({
      method: result.method,
      status: result.status,
      response: result.response,
      error: result.error
    }));
    
    // If the API call fails, we'll still return the response with error details
    if (!apiResponse.ok) {
      console.log('API call failed with status:', apiResponse.status);
      
      return NextResponse.json({
        success: false,
        status: apiResponse.status,
        response: responseText,
        userCreationAttempts: detailedAttempts,
        error: `Sensay API call failed with status ${apiResponse.status}`
      }, { status: 500 });
    }
    
    // Parse the API response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (error) {
      console.log('Error parsing JSON response:', error);
      return NextResponse.json({
        success: false,
        status: apiResponse.status,
        response: responseText,
        userCreationAttempts: detailedAttempts,
        error: 'Failed to parse JSON response from Sensay API'
      }, { status: 500 });
    }
    
    // Extract the assistant's message from the response
    const assistantMessage = parsedResponse.choices?.[0]?.message;
    
    if (!assistantMessage) {
      console.log('No assistant message found in response');
      return NextResponse.json({
        success: false,
        status: apiResponse.status,
        response: parsedResponse,
        userCreationAttempts: detailedAttempts,
        error: 'No assistant message found in Sensay API response'
      }, { status: 500 });
    }
    
    // Return the successful response
    console.log('Successfully received response from Sensay API');
    return NextResponse.json({
      success: true,
      message: assistantMessage,
      response: parsedResponse,
      userCreationAttempts: detailedAttempts
    });
    
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
