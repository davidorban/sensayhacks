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
  replicaId: string;
}

// Define a basic Task interface (align with frontend and Supabase table)
interface Task {
  id: number | string;
  text: string;
  completed: boolean;
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
const SENSAY_API_URL_BASE = 'https://api.sensay.io/v1/replicas';
const ORGANIZATION_SECRET = process.env.SENSAY_API_KEY; // Using SENSAY_API_KEY as the secret

export async function POST(request: Request) {
  // --- Environment Variables & Basic Validation ---
  if (!ORGANIZATION_SECRET) {
    console.error('Sensay API Key not found in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
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
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0 || !body.replicaId) {
        throw new Error('Invalid request body structure. Expecting { messages: [...], replicaId: "..." }');
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON body';
    return NextResponse.json({ error }, { status: 400 });
  }

  const userMessages = body.messages; // Messages from the client
  const replicaId = body.replicaId;

  // --- Fetch Tasks from Supabase --- //
  let tasksFromSupabase: Task[] = [];
  let fetchErrorOccurred = false;
  try {
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('id, text, completed') // Select needed columns
      // .eq('user_id', userId) // Filter by user_id - RLS should handle this, but explicit doesn't hurt
      .order('created_at', { ascending: true }); // Order by creation time

    if (tasksError) {
      fetchErrorOccurred = true;
      console.error('Supabase error fetching tasks:', tasksError);
      // Proceeding without tasks, but log it
    } else {
      tasksFromSupabase = tasksData || [];
      console.log(`Fetched ${tasksFromSupabase.length} tasks for user ${userId}`);
    }
  } catch (fetchError) {
    fetchErrorOccurred = true;
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
  const apiUrl = `${SENSAY_API_URL_BASE}/${replicaId}/chat/completions`;

  let sensayResponseData: any;
  let replyContent: string | null | undefined;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ORGANIZATION-SECRET': ORGANIZATION_SECRET,
        'X-USER-ID': userId,
        'X-API-Version': '2025-03-18',
      },
      // Send the messages array structured for OpenAI compatibility
      body: JSON.stringify({ messages: messagesForApi }),
    });

    // --- Handle Sensay Response --- //
    sensayResponseData = await response.json(); // Parse JSON regardless of status first

    if (!response.ok) {
      console.error(`Sensay API Error (${response.status}):`, sensayResponseData);
      const errorMessage = sensayResponseData?.error?.message || sensayResponseData?.error || response.statusText || 'Unknown Sensay API error';
      // Return Sensay error, but still include the tasks fetched earlier
      return NextResponse.json({ error: `Sensay API Error: ${errorMessage}`, tasks: tasksFromSupabase }, { status: response.status });
    }

    // --- Response Parsing (Success Case) --- //
    replyContent = sensayResponseData.choices?.[0]?.message?.content;

    if (!replyContent) {
      console.error('Could not extract reply content from Sensay response:', sensayResponseData);
      replyContent = "[Error: Failed to parse reply content from Sensay]";
    }

    console.log('Sensay API Success. Reply:', replyContent);

  } catch (error: unknown) {
    console.error('Error calling Sensay API:', error);
    // Network or other fetch error, return generic error and tasks fetched earlier
    // Use the tasks fetched *before* the failed Sensay call in the response
    return NextResponse.json({ error: 'Failed to communicate with Sensay API', tasks: tasksFromSupabase }, { status: 500 });
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
