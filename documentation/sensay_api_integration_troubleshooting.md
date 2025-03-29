# Sensay API Integration Troubleshooting

## Overview

This document tracks our efforts to troubleshoot and resolve integration issues with the Sensay API in our application. We've implemented multiple API path attempts and authentication methods to diagnose the root cause of the errors.

## Test Results (March 29, 2025)

Our implementation tests multiple API paths and authentication methods in sequence. Below are the detailed results from our latest tests:

### Error Summary

The application is currently receiving a `500 Internal Server Error` from our backend endpoint:
```
POST https://sensayhacks.com/api/chat-test 500 (Internal Server Error)
```

### Detailed API Attempt Results

All API path attempts are failing with either 404 (Not Found) or 401 (Unauthorized) errors:

#### Attempt 1 (OpenAI-style API Path)
- **URL**: `https://api.sensay.io/v1/chat/completions`
- **Status**: 404
- **Error**: Not Found
- **Response**: `{"success":false,"error":"Not Found","request_id":"fra1:iad1::lctgd-1743264620878-29c429aa3dcb"}`

#### Attempt 2 (Standard API Path)
- **URL**: `https://api.sensay.io/v1/replicas/16d38fcc-5cb0-4f94-9cee-3e8398ef4700/chat/completions`
- **Status**: 401
- **Error**: Unauthorized
- **Response**: `{"success":false,"error":"Unauthorized","fingerprint":"2a7c2d95e5464245b78338e8cdd2e032","request_id...`

#### Attempt 3 (Experimental API Path)
- **URL**: `https://api.sensay.io/v1/experimental/replicas/16d38fcc-5cb0-4f94-9cee-3e8398ef4700/chat/completions`
- **Status**: 401
- **Error**: Unauthorized
- **Response**: `{"success":false,"error":"Unauthorized","fingerprint":"01851d2f133b4abb89047c53005dd44f","request_id...`

#### Attempt 4 (Completions API Path)
- **URL**: `https://api.sensay.io/v1/replicas/16d38fcc-5cb0-4f94-9cee-3e8398ef4700/completions`
- **Status**: 404
- **Error**: Not Found
- **Response**: `{"success":false,"error":"Not Found","request_id":"fra1:iad1::hvbqk-1743264621332-c681a5724cc4"}`

#### Attempt 5 (Authorization Header API Path)
- **URL**: `https://api.sensay.io/v1/replicas/16d38fcc-5cb0-4f94-9cee-3e8398ef4700/chat/completions`
- **Status**: 401
- **Error**: Unauthorized
- **Response**: `{"success":false,"error":"Unauthorized","fingerprint":"70ca6ba69e824c0ea95987d62710db10","request_id...`

#### Attempt 6 (Lowercase Headers Path)
- **URL**: `https://api.sensay.io/v1/replicas/16d38fcc-5cb0-4f94-9cee-3e8398ef4700/chat/completions`
- **Status**: 401
- **Error**: Unauthorized
- **Response**: `{"success":false,"error":"Unauthorized","fingerprint":"68f2f8efa958424c8d28f7710dc248f6","request_id...`

#### Attempt 7 (Query Parameter Auth Path)
- **URL**: `https://api.sensay.io/v1/replicas/16d38fcc-5cb0-4f94-9cee-3e8398ef4700/chat/completions?api_key=[REDACTED]`
- **Status**: 401
- **Error**: Unauthorized
- **Response**: `{"success":false,"error":"Unauthorized","fingerprint":"1cf042be21024f42b72c82f5dcd87c78","request_id...`

### Configuration
- **Replica ID used**: `16d38fcc-5cb0-4f94-9cee-3e8398ef4700`
- **Base API URL**: `https://api.sensay.io`

## Debugging Steps Taken

1. **URL Path Duplication Fix**:
   - Identified that the environment variable `SENSAY_API_URL_BASE` contained path segments that were being duplicated in API requests
   - Fixed by extracting just the domain part (`https://api.sensay.io`) and constructing paths properly
   - Updated environment variable in Vercel to remove the path segments

2. **Authentication Methods**:
   - Implemented multiple authentication header variations:
     - `X-Organization-Secret`
     - `x-organization-secret` (lowercase)
     - `Organization-Secret` (without X- prefix)
     - `X-API-KEY`
     - `x-api-key` (lowercase)
   - Tried passing the API key as a query parameter
   - Added the `X-USER-ID` header to all requests

3. **Path Variations**:
   - Tested multiple API path formats:
     - OpenAI-style: `/v1/chat/completions`
     - Standard: `/v1/replicas/{id}/chat/completions`
     - Experimental: `/v1/experimental/replicas/{id}/chat/completions`
     - Completions-only: `/v1/replicas/{id}/completions`

## Key Findings

1. The correct API paths appear to be:
   - `/v1/replicas/{id}/chat/completions` (Standard)
   - `/v1/experimental/replicas/{id}/chat/completions` (Experimental)

2. These paths are returning **401 Unauthorized** errors, not 404s, indicating the endpoints exist but authentication is failing.

3. None of our authentication methods are being accepted by the Sensay API.

## Questions and Next Steps

1. **API Key Format**: Is the API key in the correct format? Does it need a prefix like "Bearer" or special encoding?

2. **Header Requirements**: Are there additional required headers we haven't included?
   - Example: Some APIs require `Authorization: Bearer {token}` instead of custom headers

3. **API Key Permissions**: Does the API key have the correct permissions to access these endpoints?
   - Check if the key is restricted to specific replicas, endpoints, or operations

4. **API Documentation**: Is there official documentation from Sensay that specifies the exact authentication method?

5. **User ID Requirements**: Is the `X-USER-ID` header required? Does it need to be in a specific format?

6. **API Versioning**: Are we using the correct API version? Some of the paths include `/v1/` - is this correct?

7. **Replica ID**: Is the replica ID (`16d38fcc-5cb0-4f94-9cee-3e8398ef4700`) correct and accessible with our API key?

8. **Rate Limiting**: Could we be hitting rate limits which are causing authentication failures?

## Action Plan

1. **Contact Sensay Support**: Share these detailed error messages with Sensay support to get specific guidance on authentication.

2. **Review API Documentation**: Find and review the most recent Sensay API documentation to verify endpoints and authentication methods.

3. **Try Bearer Token Format**: Implement `Authorization: Bearer {token}` header format which is a common standard.

4. **Verify API Key**: Confirm that the API key is active and has the correct permissions in the Sensay dashboard.

5. **Check Logs**: Examine Vercel Function logs for any additional error details not visible in the browser console.

6. **Test with Postman/Curl**: Attempt direct API requests using Postman or curl to isolate if the issue is in our application code or with the API credentials.
