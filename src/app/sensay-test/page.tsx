'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Define structure for the request body sent to our backend API
interface ApiResponse {
    success: boolean;
    content?: string;
    response?: {
        success?: boolean;
        content?: string;
        error?: string;
        [key: string]: unknown;
    };
    error?: string;
}

const SensayApiTestPage = () => {
    // Input States
    const [userId, setUserId] = useState<string>('test-user');
    const [replicaId, setReplicaId] = useState<string>('');
    const [chatContent, setChatContent] = useState<string>('');

    // Response/Data States
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Handle API calls
    const handleApiCall = async () => {
        setIsLoading(true);
        setError(null);
        setApiResponse(null); // Clear previous response

        try {
            const response = await fetch('/api/sensay-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: chatContent
                        }
                    ],
                    userId: userId,
                    replicaId: replicaId || undefined // Only send if not empty
                }),
            });

            const data = await response.json();
            setApiResponse(data); // Store the raw JSON response

            if (!response.ok || !data.success) {
                setError(`API Error (${response.status}): ${data.error || JSON.stringify(data)}`);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(`Fetch Error: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-2xl font-bold mb-4">Sensay API Test Page</h1>

            <div className="space-y-4 mb-6 p-4 border rounded bg-gray-50">
                <h2 className="text-lg font-semibold">Send a Message to Sensay API</h2>
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">User ID:</label>
                    <input
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        placeholder="Enter user ID (defaults to test-user)"
                    />
                </div>
                <div>
                    <label htmlFor="replicaId" className="block text-sm font-medium text-gray-700 mb-1">Replica ID (Optional):</label>
                    <input
                        id="replicaId"
                        value={replicaId}
                        onChange={(e) => setReplicaId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        placeholder="Leave empty to use the default from environment variables"
                    />
                </div>
                <div>
                    <label htmlFor="chatContent" className="block text-sm font-medium text-gray-700 mb-1">Message Content:</label>
                    <textarea
                        id="chatContent"
                        value={chatContent}
                        onChange={(e) => setChatContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-32 text-black"
                        placeholder="Enter your message here..."
                    />
                </div>
                <button
                    onClick={handleApiCall}
                    disabled={isLoading || !chatContent}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Send Message
                </button>
            </div>

            {/* Response Area */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">API Response:</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}
                <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto text-sm">
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            <span>Loading...</span>
                        </div>
                    ) : (
                        apiResponse ? JSON.stringify(apiResponse, null, 2) : 'No response yet. Trigger an API call.'
                    )}
                </pre>
            </div>
        </div>
    );
};

export default SensayApiTestPage;
