# Sensay API Direct Testing Instructions

Use these curl commands to directly test the Sensay API without going through the web interface. This can help isolate any issues with the API authentication or request format.

## Environment Setup

First, set up your environment variables (replace with your actual values):

```bash
# Windows PowerShell
$SENSAY_API_URL="https://api.sensay.io"
$SENSAY_ORGANIZATION_SECRET="your-organization-secret"
$REPLICA_ID="16d38fcc-5cb0-4f94-9cee-3e8398ef4700"
```

## 1. Test Listing Replicas

This endpoint should work based on your previous success:

```bash
# Windows PowerShell
$headers = @{
    "Content-Type" = "application/json"
    "X-Organization-Secret" = $SENSAY_ORGANIZATION_SECRET
    "X-API-Version" = (Get-Date -Format "yyyy-MM-dd")
}

$response = Invoke-RestMethod -Uri "$SENSAY_API_URL/v1/replicas" -Method GET -Headers $headers

# Output the response
$response | ConvertTo-Json -Depth 10
```

## 2. Test Chat Completions

Try the chat completions endpoint with the same authentication approach:

```bash
# Windows PowerShell
$headers = @{
    "Content-Type" = "application/json"
    "X-Organization-Secret" = $SENSAY_ORGANIZATION_SECRET
    "X-API-Version" = (Get-Date -Format "yyyy-MM-dd")
}

$body = @{
    messages = @(
        @{
            role = "user"
            content = "Hello, how are you today?"
        }
    )
    stream = $false
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$SENSAY_API_URL/v1/replicas/$REPLICA_ID/chat/completions" -Method POST -Headers $headers -Body $body -ErrorAction Stop

# Output the response
$response | ConvertTo-Json -Depth 10
```

If you encounter errors, you can add the `-Verbose` flag to see more details:

```bash
$response = Invoke-RestMethod -Uri "$SENSAY_API_URL/v1/replicas/$REPLICA_ID/chat/completions" -Method POST -Headers $headers -Body $body -Verbose -ErrorAction SilentlyContinue
```

## 3. Try Alternative Endpoints

If the standard endpoint doesn't work, try these alternatives:

```bash
# Try experimental endpoint
$response = Invoke-RestMethod -Uri "$SENSAY_API_URL/v1/experimental/replicas/$REPLICA_ID/chat/completions" -Method POST -Headers $headers -Body $body -ErrorAction SilentlyContinue

# Try with different header case
$headers["X-User-Id"] = $REPLICA_ID
$response = Invoke-RestMethod -Uri "$SENSAY_API_URL/v1/replicas/$REPLICA_ID/chat/completions" -Method POST -Headers $headers -Body $body -ErrorAction SilentlyContinue
```

## 4. Inspect Error Details

If you're getting errors, capture them for analysis:

```bash
try {
    $response = Invoke-RestMethod -Uri "$SENSAY_API_URL/v1/replicas/$REPLICA_ID/chat/completions" -Method POST -Headers $headers -Body $body -ErrorAction Stop
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error Message: $($_.Exception.Message)"
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response Body: $responseBody"
    $reader.Close()
}
```
