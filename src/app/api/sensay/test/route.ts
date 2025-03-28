import { type NextRequest, NextResponse } from 'next/server';

const SENSAY_API_URL_BASE = process.env.SENSAY_API_URL || 'https://api.sensay.io/v1';

// Define expected request body structure for this test route
interface TestApiRequest {
    action: 'listReplicas' | 'createChatCompletion';
    secret: string;
    userId?: string;          // Required for chat completion
    replicaId?: string;       // Required for chat completion
    content?: string;         // Required for chat completion
    replicaSearchTerm?: string; // Optional for listing replicas
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

    const { action, secret, userId, replicaId, content, replicaSearchTerm } = body;

    if (!secret) {
        return NextResponse.json({ error: 'API Secret (X-ORGANIZATION-SECRET) is required.' }, { status: 400 });
    }

    let targetUrl = '';
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'X-ORGANIZATION-SECRET': secret,
        'Content-Type': 'application/json',
        // Use the specific API version from the curl examples or latest known good version
        'X-API-Version': '2025-03-25' // Match the provided curl example
    };
    let fetchOptions: RequestInit = {
        method: 'GET', // Default to GET
        headers: headers,
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
                break;

            case 'createChatCompletion':
                console.log('Action: createChatCompletion');
                if (!replicaId || !userId || content === undefined) {
                    return NextResponse.json({ error: 'Replica ID, User ID, and Content are required for chat completion.' }, { status: 400 });
                }
                targetUrl = `${SENSAY_API_URL_BASE}/replicas/${replicaId}/chat/completions`;
                headers['X-USER-ID'] = userId;
                fetchOptions.method = 'POST';
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
