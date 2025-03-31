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
  replicaId?: string;
}

// Environment variables - Make sure to set clean base API URL
let SENSAY_API_URL_BASE = process.env.SENSAY_API_URL_BASE || 'https://api.sensay.io';

// Remove any trailing slashes
if (SENSAY_API_URL_BASE.endsWith('/')) {
  SENSAY_API_URL_BASE = SENSAY_API_URL_BASE.slice(0, -1);
}

// Authentication secrets
const SENSAY_ORGANIZATION_SECRET = process.env.SENSAY_ORGANIZATION_SECRET || '';

// Get replica ID from environment variable with a fallback value
const SENSAY_REPLICA_ID = process.env.SENSAY_REPLICA_ID || '16d38fcc-5cb0-4f94-9cee-3e8398ef4700';

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
    const userId = requestBody.userId || 'test-user';
    console.log('Using User ID:', userId);
    
    // Default replica ID - using the environment variable
    const replicaId = SENSAY_REPLICA_ID;
    console.log('Using Replica ID:', replicaId);
    
    try {
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
        // Return early if we can't even list replicas
        return NextResponse.json({
          success: false,
          error: `List Replicas API call failed with status ${listReplicasResponse.status}`,
          details: listReplicasText
        }, { status: 500 });
      }
    } catch (error) {
      console.error('Error in list replicas API call:', error);
      return NextResponse.json({
        success: false,
        error: `Error calling list replicas API: ${error instanceof Error ? error.message : String(error)}`
      }, { status: 500 });
    }
    
    try {
      // Now try the chat completion API with the same authentication approach
      console.log('Attempting to call Chat Completions API with working authentication...');
      
      // Get the content from the first message
      const messageContent = messages[0]?.content || '';
      
      // Define the request body according to Sensay API requirements
      const apiRequestBody = {
        content: messageContent,
        source: 'web',
        skip_chat_history: false
      };
      
      // Make the API call to Sensay
      console.log('Sending request to Sensay API...');
      const chatCompletionUrl = `${SENSAY_API_URL_BASE}/v1/replicas/${replicaId}/chat/completions`;
      
      // Add user ID to headers
      const headers = {
        ...getAuthHeaders(),
        'X-USER-ID': userId
      };
      
      // Log the headers and request body we're sending
      console.log('Headers:', JSON.stringify(headers));
      console.log('Request body:', JSON.stringify(apiRequestBody));
      
      const apiResponse = await fetch(chatCompletionUrl, {
        method: 'POST',
        headers: headers,
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
      
      // Check if the response has the expected format
      if (!parsedResponse.hasOwnProperty('success')) {
        console.log('Unexpected response format from Sensay API');
        return NextResponse.json({
          success: false,
          status: apiResponse.status,
          response: parsedResponse,
          error: 'Unexpected response format from Sensay API'
        }, { status: 500 });
      }
      
      // Check if the API call was successful
      if (!parsedResponse.success) {
        console.log('Sensay API returned an error:', parsedResponse.error);
        return NextResponse.json({
          success: false,
          status: apiResponse.status,
          response: parsedResponse,
          error: parsedResponse.error || 'Unknown error from Sensay API'
        }, { status: 500 });
      }
      
      // Return the successful response
      console.log('Successfully received response from Sensay API');
      return NextResponse.json({
        success: true,
        content: parsedResponse.content,
        response: parsedResponse
      });
    } catch (error) {
      console.error('Error in chat completions API call:', error);
      return NextResponse.json({
        success: false,
        error: `Error calling chat completions API: ${error instanceof Error ? error.message : String(error)}`
      }, { status: 500 });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
