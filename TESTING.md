# Sensay API Integration Testing

This document outlines the steps taken to debug and test the integration with the Sensay Chat API.

## Initial Problem

- **Issue:** Persistent `400 Bad Request` error from the Sensay API endpoint `/v1/experimental/replicas/{replicaId}/chat/completions`.
- **Error Message:** The API response indicated that the `content` field was required (`{ "error": "content: Required" }`), even though the request body appeared to include it correctly in the `messages` array.

## Debugging Steps

1.  **Verified Request Structure:**
    - Confirmed the `messages` array sent from the frontend (`ReplicaTaskMemory/page.tsx`) followed the OpenAI-compatible format: `[{ "role": "system", "content": "..." }, { "role": "user", "content": "..." }]`.
    - Initially included `replicaId` in the request body, but removed it as per API docs (it belongs in the URL path).

2.  **Checked API Endpoint and Headers:**
    - Confirmed the correct endpoint URL was being constructed: `SENSAY_API_URL_BASE/{replicaId}/chat/completions`.
    - Verified required headers `Content-Type: application/json`, `X-ORGANIZATION-SECRET`, and `X-API-Version: 2025-03-25` were being sent.
    - Compared with a working test route (`/api/sensay/test`) to align the `X-API-Version`.

3.  **Added Logging:**
    - Implemented logging in the backend API route (`/api/sensay/chat/route.ts`) to capture the exact URL, headers (masking the secret), and body being sent to the Sensay API.
    - Added logs to Vercel and inspected the CSV output.
    - Logs confirmed the `messages` array structure being sent was correct, with `role` and `content` present for all messages.

4.  **Hypothesized Missing `model` Field:**
    - Based on OpenAI's API, added a placeholder `model: "sensay-default"` field to the request body sent to Sensay.
    - **Result:** Still received the `400 Bad Request - content: Required` error.

5.  **Created Isolated Test Environment:**
    - Created a new API route `/api/sensay/test-chat/route.ts` that bypasses Supabase, task list logic, and only forwards a simple message array to Sensay.
    - Created a new frontend page `/prototypes/SensayTestChat/page.tsx` using basic `shadcn/ui` components (`Input`, `Button`, `Card`) to interact solely with the new test route.

6.  **Resolved Build Issues:**
    - Encountered build failures because `shadcn/ui` was not initialized.
    - Ran `npx shadcn@latest init` and `npx shadcn@latest add button input card` to set up the UI library and add the required components.

7.  **Resolved Server Configuration Error:**
    - The deployed test page initially returned a `500 Internal Server Error` with the message `Server configuration error`.
    - **Cause:** The test API route (`/api/sensay/test-chat`) was incorrectly reading the organization secret from `process.env.SENSAY_API_KEY` instead of `process.env.SENSAY_ORGANIZATION_SECRET`.
    - **Fix:** Corrected the environment variable name in the route.

## Current Status (as of 2025-03-29 14:53)

- The corrected test route (`/api/sensay/test-chat`) has been deployed.
- Awaiting results from testing the `/prototypes/SensayTestChat` page after ensuring the `SENSAY_ORGANIZATION_SECRET` environment variable is correctly set in Vercel.
