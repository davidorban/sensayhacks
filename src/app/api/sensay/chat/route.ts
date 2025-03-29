import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define expected structure for incoming request messages
interface RequestMessage {
  role: 'user' | 'assistant' | 'system'; // Align with OpenAI structure
  content: string;
}

// Define the expected request body structure
interface RequestBody {
  messages: RequestMessage[];
}

// Define a basic Task interface (align with frontend and Supabase table)
interface Task {
  id: number | string;
  text: string;
  completed: boolean;
}

// Type guard to check if an object has a 'choices' property (basic Sensay success check)
function hasChoicesProperty(data: unknown): data is { choices: unknown } {
    return typeof data === 'object' && data !== null && 'choices' in data;
}

// Initialize Supabase client details (ensure these are in Vercel env vars)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helper function to get a Supabase client instance for a specific request/user
// This passes the user ID header necessary for RLS policies
const getSupabaseClient = (userId: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing from environment variables.');
    return null; // Handle missing configuration
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'X-USER-ID': userId
      }
    }
  });
}

// Use the official Sensay API endpoint and structure
const SENSAY_API_URL_BASE = process.env.SENSAY_API_URL_BASE || 'https://api.sensay.io/v1';
const ORGANIZATION_SECRET = process.env.SENSAY_ORGANIZATION_SECRET || process.env.SENSAY_API_KEY; // Support both variable names
const TARGET_REPLICA_UUID = '16d38fcc-5cb0-4f94-9cee-3e8398ef4700'; // Hardcoded Replica UUID

export async function POST(request: Request) {
  // --- Environment Variables & Basic Validation ---
  if (!ORGANIZATION_SECRET) {
    console.error('Sensay Organization Secret not found in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: Missing Organization Secret.' }, { status: 500 });
  }

  // --- Get User ID --- // Essential for Supabase RLS and Sensay
  const userId = request.headers.get('X-USER-ID');
  if (!userId) {
    return NextResponse.json({ error: 'X-USER-ID header is required' }, { status: 400 });
  }

  // --- Initialize Supabase Client for this request --- //
  const supabase = getSupabaseClient(userId);
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client could not be initialized. Check server logs.' }, { status: 500 });
  }

  // --- Request Body Parsing and Validation --- //
  let body: RequestBody;
  try {
    body = await request.json();
    // Validate structure (basic check)
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
        throw new Error('Invalid request body structure. Expecting { messages: [...] }');
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON body';
    return NextResponse.json({ error }, { status: 400 });
  }

  const userMessages = body.messages; // Messages from the client

  // --- Fetch Tasks from Supabase --- //
  let tasksFromSupabase: Task[] = [];
  try {
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('id, text, completed') // Select needed columns
      // .eq('user_id', userId) // Filter by user_id - RLS should handle this, but explicit doesn't hurt
      .order('created_at', { ascending: true }); // Order by creation time

    if (tasksError) {
      console.error('Supabase error fetching tasks:', tasksError);
      // Proceeding without tasks, but log it
    } else {
      tasksFromSupabase = tasksData || [];
      console.log(`Fetched ${tasksFromSupabase.length} tasks for user ${userId}`);
    }
  } catch (fetchError) {
    console.error('Error fetching tasks from Supabase:', fetchError);
    // Proceeding without tasks
  }

  // --- Prepare Messages for Sensay (Inject Task Context) --- //
  const taskContext = tasksFromSupabase.length > 0
    ? "Here is your current task list retrieved from the database:\n" + tasksFromSupabase.map((task, index) =>
        `${index + 1}. ${task.text} [${task.completed ? 'Completed' : 'Pending'}]`
      ).join('\n')
    : "You currently have no tasks in the database.";

  // Construct messages array for Sensay API (OpenAI format)
  const messagesForApi: RequestMessage[] = [
    { role: 'system', content: taskContext }, // Inject tasks as a system message
    // Add messages from the request body AFTER the system message
    ...userMessages
  ];

  // --- Call Sensay API --- //
  // Prepare both standard and experimental API URLs
  const standardApiUrl = `${SENSAY_API_URL_BASE}/replicas/${TARGET_REPLICA_UUID}/chat/completions`;
  const experimentalApiUrl = `${SENSAY_API_URL_BASE}/experimental/replicas/${TARGET_REPLICA_UUID}/chat/completions`;

  // --- DEBUG LOGGING --- //
  console.log('Attempting to call Sensay API with standard path first');
  console.log('Standard URL:', standardApiUrl);
  console.log('Experimental URL (fallback):', experimentalApiUrl);
  console.log('Headers:', {
      'Content-Type': 'application/json',
      'X-ORGANIZATION-SECRET': ORGANIZATION_SECRET ? '********' : 'MISSING', // Don't log the actual key
      'X-API-Version': '2025-03-25',
  });
  
  // Extract the content of the last message for standard API format
  const lastMessageContent = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';
  console.log('Last message content:', lastMessageContent);
  // --- END DEBUG LOGGING ---

  let sensayResponseData: unknown;
  let replyContent: string | null | undefined;
  let usedApiPath = 'unknown';

  try {
    // --- First try standard API path --- //
    console.log('Trying standard API path first...');
    const standardRequestBody = { content: lastMessageContent };
    console.log('Standard request body:', JSON.stringify(standardRequestBody, null, 2));
    
    const standardResponse = await fetch(standardApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ORGANIZATION-SECRET': ORGANIZATION_SECRET,
        'X-USER-ID': userId,  // Include user ID in headers
        'X-API-Version': '2025-03-25',
      },
      body: JSON.stringify(standardRequestBody),
    });

    const standardResponseText = await standardResponse.text();
    console.log('Standard API response status:', standardResponse.status);
    console.log('Standard API response body:', standardResponseText);

    if (standardResponse.ok) {
      try {
        sensayResponseData = JSON.parse(standardResponseText);
        usedApiPath = 'standard';
        console.log('Standard API call succeeded');
      } catch (e) {
        console.error('Failed to parse standard API response as JSON:', e);
        throw new Error('Failed to parse standard API response');
      }
    } else {
      console.log('Standard API call failed, trying experimental path...');
    }

    // --- If standard failed, try experimental API path --- //
    if (!standardResponse.ok) {
      console.log('Trying experimental API path as fallback...');
      const experimentalRequestBody = { messages: messagesForApi, model: "sensay-default" };
      console.log('Experimental request body:', JSON.stringify(experimentalRequestBody, null, 2));
      
      const experimentalResponse = await fetch(experimentalApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ORGANIZATION-SECRET': ORGANIZATION_SECRET,
          'X-USER-ID': userId,
          'X-API-Version': '2025-03-25',
        },
        body: JSON.stringify(experimentalRequestBody),
      });

      const experimentalResponseText = await experimentalResponse.text();
      console.log('Experimental API response status:', experimentalResponse.status);
      console.log('Experimental API response body:', experimentalResponseText);

      if (experimentalResponse.ok) {
        try {
          sensayResponseData = JSON.parse(experimentalResponseText);
          usedApiPath = 'experimental';
          console.log('Experimental API call succeeded');
        } catch (e) {
          console.error('Failed to parse experimental API response as JSON:', e);
          throw new Error('Failed to parse experimental API response');
        }
      } else {
        // Both API calls failed
        let errorMessage = 'Unknown Sensay API error';
        try {
          const jsonError = JSON.parse(experimentalResponseText);
          errorMessage = typeof jsonError.error === 'string' ? jsonError.error : 
                        (jsonError.message || 'Unknown error format');
        } catch {
          // Use text if JSON parsing fails
          errorMessage = experimentalResponseText || experimentalResponse.statusText;
        }
        console.error(`Both API paths failed. Last error (${experimentalResponse.status}):`, errorMessage);
        throw new Error(`Sensay API Error (${experimentalResponse.status}): ${errorMessage}`);
      }
    }

    // --- Parse the successful response --- //
    if (hasChoicesProperty(sensayResponseData) && Array.isArray(sensayResponseData.choices) && sensayResponseData.choices.length > 0) {
        const firstChoice = sensayResponseData.choices[0];
        if (typeof firstChoice === 'object' && firstChoice !== null && 'message' in firstChoice) {
            const message = firstChoice.message;
            if (typeof message === 'object' && message !== null && 'content' in message && typeof message.content === 'string') {
                replyContent = message.content;
            }
        }
    }

    if (replyContent === undefined) {
        console.error('Could not extract valid reply content from Sensay success response:', sensayResponseData);
        replyContent = "[Error: Failed to parse reply content from Sensay]";
    }

    console.log(`Sensay API Success (${usedApiPath}). Reply:`, replyContent);
  } catch (error: unknown) {
    console.error('Error calling Sensay API:', error);
    // Network or other fetch error, return generic error and tasks fetched earlier
    // Use the tasks fetched *before* the failed Sensay call in the response
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to communicate with Sensay API', 
      tasks: tasksFromSupabase,
      apiDetails: {
        standardApiUrl,
        experimentalApiUrl,
        lastUsedPath: usedApiPath
      }
    }, { status: 500 });
  }

  // --- Task Intent Detection & Modification (Simple Keyword Matching) --- //
  let tasksModified = false;
  const lastUserMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

  try {
    // --- ADD --- //
    if (lastUserMessage.startsWith('add task ') || lastUserMessage.startsWith('remind me to ')) {
      const taskText = lastUserMessage.replace(/^(add task|remind me to)\s+/i, '').trim();
      if (taskText) {
        console.log(`Attempting to add task: "${taskText}" for user ${userId}`);
        const { error: insertError } = await supabase
          .from('tasks')
          .insert({ user_id: userId, text: taskText, completed: false }); // Ensure user_id is set

        if (insertError) {
          console.error('Supabase insert error:', insertError);
          // Optionally inform the user via replyContent? For now, just log.
        } else {
          console.log('Supabase task inserted successfully.');
          tasksModified = true;
        }
      }
    }
    // --- COMPLETE --- //
    else if (lastUserMessage.startsWith('complete task ') || lastUserMessage.startsWith('finish task ') || lastUserMessage.startsWith('done with task ')) {
        const match = lastUserMessage.match(/\d+/); // Find the first number
        const taskNumber = match ? parseInt(match[0], 10) : NaN;

        if (!isNaN(taskNumber) && taskNumber > 0 && taskNumber <= tasksFromSupabase.length) {
            const taskIndex = taskNumber - 1; // Convert to 0-based index
            const taskToComplete = tasksFromSupabase[taskIndex];
            if (taskToComplete && !taskToComplete.completed) {
                console.log(`Attempting to complete task #${taskNumber}: "${taskToComplete.text}" (ID: ${taskToComplete.id}) for user ${userId}`);
                const { error: updateError } = await supabase
                    .from('tasks')
                    .update({ completed: true })
                    .match({ id: taskToComplete.id, user_id: userId }); // Match ID and user_id (RLS also enforces)

                if (updateError) {
                    console.error('Supabase update error:', updateError);
                } else {
                    console.log('Supabase task updated successfully.');
                    tasksModified = true;
                }
            }
        } else {
            console.log('Could not find valid task number to complete in message:', lastUserMessage);
        }
    }
    // --- DELETE --- //
    else if (lastUserMessage.startsWith('delete task ') || lastUserMessage.startsWith('remove task ')) {
        const match = lastUserMessage.match(/\d+/);
        const taskNumber = match ? parseInt(match[0], 10) : NaN;

        if (!isNaN(taskNumber) && taskNumber > 0 && taskNumber <= tasksFromSupabase.length) {
            const taskIndex = taskNumber - 1;
            const taskToDelete = tasksFromSupabase[taskIndex];
            if (taskToDelete) {
                console.log(`Attempting to delete task #${taskNumber}: "${taskToDelete.text}" (ID: ${taskToDelete.id}) for user ${userId}`);
                const { error: deleteError } = await supabase
                    .from('tasks')
                    .delete()
                    .match({ id: taskToDelete.id, user_id: userId }); // Match ID and user_id (RLS also enforces)

                if (deleteError) {
                    console.error('Supabase delete error:', deleteError);
                } else {
                    console.log('Supabase task deleted successfully.');
                    tasksModified = true;
                }
            }
        } else {
            console.log('Could not find valid task number to delete in message:', lastUserMessage);
        }
    }

    // --- Re-fetch tasks if modified --- //
    if (tasksModified) {
      console.log('Tasks modified, re-fetching list from Supabase...');
      const { data: updatedTasksData, error: updatedTasksError } = await supabase
        .from('tasks')
        .select('id, text, completed')
        .order('created_at', { ascending: true });

      if (updatedTasksError) {
        console.error('Supabase error re-fetching tasks:', updatedTasksError);
        // Keep the stale tasksFromSupabase list, maybe add note to reply?
      } else {
        tasksFromSupabase = updatedTasksData || []; // Update the list to return
        console.log(`Re-fetched ${tasksFromSupabase.length} tasks.`);
      }
    }
  } catch (modificationError) {
      console.error('Error during task modification logic:', modificationError);
      // Proceed with returning original tasks, modification failed
  }

  // --- Return Response --- //
  // Return the Sensay reply and the final tasks list (potentially updated)
  return NextResponse.json({ reply: replyContent, tasks: tasksFromSupabase });
}
