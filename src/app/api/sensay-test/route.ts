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

// Helper function for consistent authentication headers - using the format that works
function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Organization-Secret': SENSAY_ORGANIZATION_SECRET,
    'X-API-Version': currentDate
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
    
    // Use the known working user ID
    const userId = '16d38fcc-5cb0-4f94-9cee-3e8398ef4700';
    console.log('Using User ID:', userId);
    
    // Default replica ID - using the known working ID
    const replicaId = '16d38fcc-5cb0-4f94-9cee-3e8398ef4700';
    console.log('Using Replica ID:', replicaId);
    
    // First, let's try the known working API call to list replicas
    console.log('Attempting to list replicas (known working approach)...');
    const listReplicasUrl = `${SENSAY_API_URL_BASE}/v1/replicas`;
    
    // Log the headers we're sending
    console.log('List Replicas Headers:', JSON.stringify(getAuthHeaders()));
    
    const listReplicasResponse = await fetch(listReplicasUrl, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    // Get the response as text first for logging
    const listReplicasText = await listReplicasResponse.text();
    console.log('List Replicas API response status:', listReplicasResponse.status);
    console.log('List Replicas API response text:', listReplicasText);
    
    if (!listReplicasResponse.ok) {
      console.log('List Replicas API call failed with status:', listReplicasResponse.status);
    } else {
      console.log('Successfully retrieved replicas list from Sensay API');
    }
    
    // Check if list replicas was successful and parse response
    if (listReplicasResponse.ok) {
      try {
        const replicas = JSON.parse(listReplicasText);
        console.log('Successfully retrieved replicas list:', JSON.stringify(replicas));
      } catch (error) {
        console.log('Error parsing replicas JSON response:', error);
      }
    } else {
      console.log('List Replicas API call failed with status:', listReplicasResponse.status);
    }
    
    // Now try the chat completion API with the same authentication approach
    console.log('Attempting to call Chat Completions API with working authentication...');
    
    // Format messages for the API
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Define the request body
    const apiRequestBody = {
      messages: apiMessages,
      stream: false
    };
    
    // Make the API call to Sensay
    console.log('Sending request to Sensay API...');
    const chatCompletionUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
    
    // Log the headers and request body we're sending
    console.log('Headers:', JSON.stringify(getAuthHeaders()));
    console.log('Request body:', JSON.stringify(apiRequestBody));
    
    const apiResponse = await fetch(chatCompletionUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(apiRequestBody),
    });
    
    // Get the response as text first for logging
    const responseText = await apiResponse.text();
    console.log('API response status:', apiResponse.status);
    console.log('API response text:', responseText);
    
    // If the API call fails, we'll still return the response with error details
    if (!apiResponse.ok) {
      console.log('API call failed with status:', apiResponse.status);
      
      return NextResponse.json({
        success: false,
        status: apiResponse.status,
        response: responseText,
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
        error: 'No assistant message found in Sensay API response'
      }, { status: 500 });
    }
    
    // Return the successful response
    console.log('Successfully received response from Sensay API');
    return NextResponse.json({
      success: true,
      message: assistantMessage,
      response: parsedResponse
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
