'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Define structure for Replica data (based on typical list responses)
interface Replica {
    id: string;
    name?: string;
    // Add other relevant fields from the API response if needed
}

// Define structure for the request body sent to our backend API
interface TestApiRequestBody {
    action: 'listReplicas' | 'createChatCompletion';
    secret: string;
    userId?: string;
    replicaId?: string;
    content?: string;
    replicaSearchTerm?: string;
}

const SensayApiTestPage = () => {
    // Input States
    const [apiSecret, setApiSecret] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [replicaSearch, setReplicaSearch] = useState<string>('');
    const [selectedReplicaId, setSelectedReplicaId] = useState<string>('');
    const [chatContent, setChatContent] = useState<string>('');

    // Response/Data States
    const [replicas, setReplicas] = useState<Replica[]>([]);
    const [apiResponse, setApiResponse] = useState<object | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Handle API calls
    const handleApiCall = async (action: 'listReplicas' | 'createChatCompletion') => {
        setIsLoading(true);
        setError(null);
        setApiResponse(null); // Clear previous response

        let requestBody: TestApiRequestBody;

        if (action === 'createChatCompletion') {
            if (!selectedReplicaId || !userId || !chatContent) {
                setError('Replica ID, User ID, and Chat Content are required for chat completion.');
                setIsLoading(false);
                return;
            }
            requestBody = {
                action: action,
                secret: apiSecret,
                replicaId: selectedReplicaId,
                userId: userId,
                content: chatContent,
            };
        } else { // action === 'listReplicas'
            requestBody = {
                action: action,
                secret: apiSecret,
                replicaSearchTerm: replicaSearch || undefined, // Send undefined if empty
            };
        }

        try {
            const response = await fetch('/api/sensay/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            setApiResponse(data); // Store the raw JSON response

            if (!response.ok) {
                setError(`API Error (${response.status}): ${data.error || JSON.stringify(data)}`);
            } else {
                // If listing replicas succeeded, update the replicas state
                if (action === 'listReplicas' && Array.isArray(data)) { // Assuming list returns an array
                    setReplicas(data);
                    // Auto-select first replica if list is not empty
                    if (data.length > 0 && !selectedReplicaId) {
                        setSelectedReplicaId(data[0].id);
                    }
                } else if (action === 'listReplicas' && data && Array.isArray(data.replicas)) { // Handle potential { replicas: [] } structure
                    setReplicas(data.replicas);
                    if (data.replicas.length > 0 && !selectedReplicaId) {
                        setSelectedReplicaId(data.replicas[0].id);
                    }
                }
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
                <h2 className="text-lg font-semibold">Configuration</h2>
                <div>
                    <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-700 mb-1">Sensay API Secret (X-ORGANIZATION-SECRET):</label>
                    <input
                        type="password" // Use password type for secrets
                        id="apiSecret"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Paste your API Secret here"
                    />
                </div>
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">User ID (X-USER-ID):</label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter the User ID for API calls"
                    />
                </div>
            </div>

            {/* List Replicas Section */}
            <div className="space-y-4 mb-6 p-4 border rounded">
                <h2 className="text-lg font-semibold">1. List Replicas</h2>
                <div>
                    <label htmlFor="replicaSearch" className="block text-sm font-medium text-gray-700 mb-1">Replica Search Term (Optional):</label>
                    <input
                        type="text"
                        id="replicaSearch"
                        value={replicaSearch}
                        onChange={(e) => setReplicaSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        placeholder="e.g., Marco"
                    />
                </div>
                <button
                    onClick={() => handleApiCall('listReplicas')}
                    disabled={isLoading || !apiSecret}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    List Replicas
                </button>
            </div>

            {/* Create Chat Completion Section */}
            <div className="space-y-4 mb-6 p-4 border rounded">
                <h2 className="text-lg font-semibold">2. Create Chat Completion</h2>
                <div>
                    <label htmlFor="replicaSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Replica ID:</label>
                    <select
                        id="replicaSelect"
                        value={selectedReplicaId}
                        onChange={(e) => setSelectedReplicaId(e.target.value)}
                        disabled={replicas.length === 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2 bg-white disabled:bg-gray-100"
                    >
                        <option value="" disabled={selectedReplicaId !== ''}>-- Select a Replica --</option>
                        {replicas.map((replica) => (
                            <option key={replica.id} value={replica.id}>
                                {replica.name ? `${replica.name} (${replica.id})` : replica.id}
                            </option>
                        ))}
                    </select>
                    {replicas.length === 0 && <p className="text-xs text-gray-500">Run &quot;List Replicas&quot; first to populate this dropdown.</p>}
                </div>

                <div>
                    <label htmlFor="chatContent" className="block text-sm font-medium text-gray-700 mb-1">Chat Content:</label>
                    <textarea
                        id="chatContent"
                        rows={3}
                        value={chatContent}
                        onChange={(e) => setChatContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        placeholder="Enter your message here"
                    />
                </div>

                <button
                    onClick={() => handleApiCall('createChatCompletion')}
                    disabled={isLoading || !apiSecret || !userId || !selectedReplicaId || !chatContent}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Send Chat Completion
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
