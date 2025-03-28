import { type NextRequest, NextResponse } from 'next/server';

const SENSAY_API_URL_BASE = process.env.SENSAY_API_URL || 'https://api.sensay.io/v1';

// Define expected request body structure for this test route
interface TestApiRequest {
    action: 'listReplicas' | 'createChatCompletion' | 'createUserAndListReplicas';
    secret: string;
    userId?: string;          // Required for chat completion
    replicaId?: string;       // Required for chat completion
    content?: string;         // Required for chat completion
    replicaSearchTerm?: string; // Optional for listing replicas
    userName?: string; // Optional for user creation (defaults will be used)
    userEmail?: string; // Optional for user creation (defaults will be used)
}

export async function POST(request: NextRequest) {
    console.log('API route /api/sensay/test hit');
    let body: TestApiRequest;

    try {
        body = await request.json();
    } catch (e) {
        const error = e instanceof Error ? e.message : 'Invalid JSON body';
        return NextResponse.json({ error }, { status: 400 });
    }

    const { action, secret, userId, replicaId, content, replicaSearchTerm, userName, userEmail } = body;

    if (!secret) {
        return NextResponse.json({ error: 'API Secret (X-ORGANIZATION-SECRET) is required.' }, { status: 400 });
    }

    let targetUrl = '';
    // Define headers common to most Sensay API calls
    const sensayHeaders = (includeUserId = false): Record<string, string> => ({
        'Accept': 'application/json',
        'X-ORGANIZATION-SECRET': secret,
        'Content-Type': 'application/json',
        'X-API-Version': '2025-03-25', // Match the provided curl example
        ...(includeUserId && userId && { 'X-USER-ID': userId }),
    });

    const fetchOptions: RequestInit = { 
        method: 'GET', // Default to GET
        headers: sensayHeaders(),
    };
    let requestBody = {};

    try {
        switch (action) {
            case 'listReplicas':
                console.log('Action: listReplicas');
                targetUrl = `${SENSAY_API_URL_BASE}/replicas`;
                if (replicaSearchTerm) {
                    const params = new URLSearchParams({ search: replicaSearchTerm });
                    targetUrl += `?${params.toString()}`;
                }
                fetchOptions.method = 'GET';
                fetchOptions.headers = sensayHeaders(); // Use common headers
                break;

            case 'createUserAndListReplicas':
                console.log('Action: createUserAndListReplicas');
                if (!userId) {
                    return NextResponse.json({ error: 'User ID is required for creating/listing.' }, { status: 400 });
                }

                // Step 1: Attempt to create the user
                const createUserUrl = `${SENSAY_API_URL_BASE}/users`;
                const userCreateName = userName || "Test User"; // Use provided or default
                const userCreateEmail = userEmail || "test@example.com"; // Use provided or default

                console.log(`Attempting to create user ${userId} (${userCreateName})`);
                try {
                    const userCreateResponse = await fetch(createUserUrl, {
                        method: 'POST',
                        headers: sensayHeaders(),
                        body: JSON.stringify({
                            id: userId,
                            name: userCreateName,
                            email: userCreateEmail,
                        }),
                    });

                    const userCreateData = await userCreateResponse.json();

                    // Allow proceeding if user creation succeeded (2xx) or if user already exists (e.g., 409 Conflict or similar)
                    // Adjust the status code check if Sensay uses a different one for existing users
                    if (!userCreateResponse.ok && userCreateResponse.status !== 409) { // Assuming 409 for existing user
                        console.error(`Sensay User Create Error (${userCreateResponse.status}):`, userCreateData);
                        return NextResponse.json({ error: 'Failed to create or verify user', details: userCreateData }, { status: userCreateResponse.status });
                    }
                    console.log(`User ${userId} created or already exists (Status: ${userCreateResponse.status}).`);

                } catch (userError) {
                    console.error('Error during Sensay User creation call:', userError);
                    const errorMessage = userError instanceof Error ? userError.message : 'An unexpected error occurred during user creation';
                    return NextResponse.json({ error: `User Creation Failed: ${errorMessage}` }, { status: 500 });
                }

                // Step 2: List Replicas (only if user creation/verification passed)
                console.log('Proceeding to list replicas');
                targetUrl = `${SENSAY_API_URL_BASE}/replicas`;
                if (replicaSearchTerm) {
                    const params = new URLSearchParams({ search: replicaSearchTerm });
                    targetUrl += `?${params.toString()}`;
                }
                fetchOptions.method = 'GET';
                fetchOptions.headers = sensayHeaders(); // Use common headers (no user ID needed for list)
                break;

            case 'createChatCompletion':
                console.log('Action: createChatCompletion');
                if (!replicaId || !userId || content === undefined) {
                    return NextResponse.json({ error: 'Replica ID, User ID, and Content are required for chat completion.' }, { status: 400 });
                }
                targetUrl = `${SENSAY_API_URL_BASE}/replicas/${replicaId}/chat/completions`;
                fetchOptions.method = 'POST';
                fetchOptions.headers = sensayHeaders(true); // Include User ID
                requestBody = {
                    content: content,
                    // Add other chat completion params from curl example if needed
                    // source: "web", // Example if needed
                    // skip_chat_history: false // Example if needed
                };
                fetchOptions.body = JSON.stringify(requestBody);
                break;

            default:
                return NextResponse.json({ error: 'Invalid action specified.' }, { status: 400 });
        }

        console.log(`Fetching URL: ${fetchOptions.method} ${targetUrl}`);
        const response = await fetch(targetUrl, fetchOptions);

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`Sensay API Error (${response.status}) for action ${action}:`, responseData);
            // Return the actual error structure from Sensay if possible
            return NextResponse.json(responseData, { status: response.status });
        }

        console.log(`Sensay API Success for action ${action}.`);
        return NextResponse.json(responseData, { status: 200 });

    } catch (error: unknown) {
        console.error(`Error during Sensay API call for action ${action}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
    }
}
