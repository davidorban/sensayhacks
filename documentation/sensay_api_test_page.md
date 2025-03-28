# Sensay API Test Page & Project Progress

This document outlines the functionality of the Sensay API Test Page and summarizes the key accomplishments in the SensayHacks project as of 2025-03-28.

## Sensay API Test Page (`/sensay-test`)

**Purpose:**

To provide a simple interface for directly interacting with key Sensay API endpoints, facilitating testing and understanding of the API's behavior without involving the more complex logic of the main chat prototype.

**Features:**

*   **Configuration:** Input fields for:
    *   `Sensay API Secret (X-ORGANIZATION-SECRET)`: Your organization's API key (required).
    *   `User ID (X-USER-ID)`: The external ID for the user (required for most actions).
    *   `User Name (Optional)`: Name used when creating/verifying the user.
    *   `User Email (Optional)`: Email used when creating/verifying the user.
*   **Create User & List Replicas:**
    *   Input for an optional `Replica Search Term`.
    *   A button that triggers a sequence:
        1.  Calls `POST /v1/users` to ensure the specified `User ID` exists (using provided or default Name/Email).
        2.  If the user exists or is created successfully, calls `GET /v1/replicas` (optionally filtered by the search term).
*   **Create Chat Completion:**
    *   A dropdown to select a `Replica ID` (populated after successfully listing replicas).
    *   A textarea for `Chat Content`.
    *   A button that calls `POST /v1/replicas/{selectedReplicaId}/chat/completions` using the provided `User ID` and `Chat Content`.
*   **API Response:** A display area showing the raw JSON response from the last API call made, along with any errors or loading states.

**Backend Route (`/api/sensay/test`):**

*   A dedicated Next.js API route handles requests from the `/sensay-test` page.
*   It securely uses the provided API Secret to make the actual calls to the Sensay API (`/v1/users`, `/v1/replicas`, `/v1/replicas/{id}/chat/completions`).
*   It includes the necessary headers (`X-ORGANIZATION-SECRET`, `X-USER-ID`, `Content-Type`, `Accept`, `X-API-Version`).
*   It returns the raw JSON response from the Sensay API back to the frontend.

## Project Progress Summary

*   **Replica Task Memory Prototype (`/prototypes/ReplicaTaskMemory`):**
    *   Initial chat interface built.
    *   Integrated Supabase for task management.
    *   The backend API route (`/api/sensay/chat`) now fetches tasks associated with the `X-USER-ID` from Supabase before calling the Sensay API.
    *   Fetched tasks are injected into the context sent to Sensay.
    *   The frontend displays tasks retrieved from the API response.
    *   Row Level Security (RLS) is configured in Supabase on the `tasks` table to ensure users can only access their own data based on the `X-USER-ID` header.
    *   **Note:** The chat API call in this prototype (`/api/sensay/chat`) still uses the older OpenAI message format and needs updating to align with the direct `content` format used in the `/sensay-test` page and recent cURL examples.
*   **Sensay API Interaction:**
    *   Implemented direct calls to core Sensay endpoints (`users`, `replicas`, `chat/completions`) via the test page and its backend route.
    *   Clarified usage of API Secret, User ID, and Replica ID.
*   **Deployment & Build:**
    *   Successfully resolved numerous ESLint and TypeScript build errors encountered during Vercel deployments.
    *   Continuous deployment to Vercel from the `main` branch is active.

**Next Steps Considerations:**

*   Update the main prototype's chat API call (`/api/sensay/chat`) to use the correct Sensay API format (e.g., `content` field instead of `messages`).
*   Implement dynamic Replica ID fetching/selection in the main prototype instead of using a hardcoded value.
*   Implement task modification logic (add, complete, delete) in `/api/sensay/chat` based on Sensay's response or keywords.
*   Refine error handling and user feedback.
