# Sensay API Documentation Enhancement Suggestions

Based on integration experience (March 29, 2025), primarily with the `/v1/replicas/{replicaId}/chat/completions` endpoint, here are suggestions to improve the clarity and usability of the Sensay API documentation:

1.  **Explicit Header Requirements for Chat Completions:**
    *   Clearly list *all* mandatory HTTP headers for the `/chat/completions` endpoint (e.g., `X-ORGANIZATION-SECRET`, `Content-Type`, `X-API-Version`).
    *   Specify if any headers are optional or explicitly disallowed for this endpoint.

2.  **Clarify the Role of `X-USER-ID` Header:**
    *   State whether the `X-USER-ID` header is expected, optional, or should *not* be sent to the `/chat/completions` endpoint.
    *   Explain its purpose if it *is* used by this specific endpoint.

3.  **API Version Specificity (`X-API-Version`):**
    *   Document the valid and recommended `X-API-Version` value(s) specifically for the `/chat/completions` endpoint.
    *   Indicate if specific versions are required for certain features or if older versions are deprecated.
    *   Ensure consistency in recommended versions across different examples and endpoints if applicable.

4.  **More Granular Error Messages (Especially 401 Unauthorized):**
    *   Provide more specific feedback in error responses, particularly for 401 errors.
    *   Examples: "Unauthorized: Invalid/Missing X-ORGANIZATION-SECRET", "Unauthorized: Invalid/Unsupported X-API-Version", "Unauthorized: Unexpected Header X-USER-ID sent".

5.  **Endpoint Path Clarification:**
    *   Briefly clarify the relationship or status between `/v1/experimental/replicas/...` and `/v1/replicas/...` endpoints, especially if one path is preferred or deprecated.

These clarifications would help developers integrate with the Sensay API more efficiently and reduce troubleshooting time related to authentication and request structure.
