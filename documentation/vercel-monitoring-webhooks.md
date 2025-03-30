# Vercel Deployment Monitor with Webhooks

This tool provides real-time monitoring of Vercel deployments using webhooks instead of API polling. It automatically detects build failures, analyzes errors, and suggests fixes to help you resolve deployment issues quickly.

## Key Features

- **Real-time webhook integration** with Vercel for instant deployment notifications
- **Automated error analysis** with suggested fixes for common build failures
- **Flexible domain configuration** supporting custom domains and subdomains
- **Interactive dashboard** to view deployment history and error reports
- **Slack notifications** for deployment successes and failures
- **Secure webhook handling** with signature verification

## Why Webhooks Instead of Polling?

- **Efficiency**: No constant API requests, only processes events when they happen
- **Immediacy**: Real-time notification of deployment status changes
- **Reliability**: No missed events due to polling intervals
- **Completeness**: Gets the full event payload directly from Vercel

## Deployment Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VERCEL_TOKEN` | Your Vercel API token | Yes |
| `WEBHOOK_SECRET` | Secret for verifying webhook signatures | Yes |
| `MONITOR_DOMAIN` | The domain where the monitor is deployed | Yes |
| `VERCEL_TEAM_ID` | Your Vercel team ID (for team projects) | No |
| `PORT` | The port to listen on (default: 3000) | No |
| `USE_HTTPS` | Set to 'true' if your domain uses HTTPS | No |
| `SLACK_WEBHOOK_URL` | Slack webhook URL for notifications | No |

### Local Development

```bash
# Install dependencies
npm install express body-parser

# Set environment variables
export VERCEL_TOKEN=your_token
export WEBHOOK_SECRET=your_secret
export MONITOR_DOMAIN=localhost:3000

# Start the server
node monitor.js
```

For development with public access, use a tool like ngrok:
```bash
ngrok http 3000
```

### Cloud Deployment

#### Heroku

1. Create a new Heroku app
2. Set the required environment variables in the Heroku dashboard
3. Deploy the code to Heroku
4. Set `MONITOR_DOMAIN` to your-app.herokuapp.com

#### Vercel (ironically)

1. Create a new Vercel project
2. Set the required environment variables in the Vercel dashboard
3. Deploy the code to Vercel
4. Set `MONITOR_DOMAIN` to your-app.vercel.app

#### Custom Domain

1. Deploy to any platform supporting Node.js
2. Configure your custom domain
3. Set `MONITOR_DOMAIN` to your-domain.com
4. Set `USE_HTTPS` to 'true' if you have SSL

## Subdomain Support

This monitor can use different subdomains for different projects:

- If `MONITOR_DOMAIN` is example.com, you can create webhooks at:
  - project1.example.com/webhook
  - project2.example.com/webhook

To use this feature:
1. Configure DNS wildcard records for *.example.com
2. Configure your web server to route all subdomains to this app
3. When setting up webhooks, use the subdomain parameter:
   `/setup?project=YourProject&subdomain=project1`

## Using the Monitor

### Setting Up a Webhook

Visit the setup endpoint to create a webhook for your Vercel project:

```
https://your-domain.com/setup?project=YourProjectName
```

To use a custom subdomain:

```
https://your-domain.com/setup?project=YourProjectName&subdomain=custom
```

### Viewing the Dashboard

Access the dashboard to see deployment status and error reports:

```
https://your-domain.com/dashboard
```

### Viewing Error Reports

When a deployment fails, a detailed error report is generated. Access it at:

```
https://your-domain.com/reports/[deployment-id]
```

## Error Analysis

The monitor automatically analyzes build logs and suggests fixes for common issues:

- Missing dependencies
- React hook dependency warnings
- Next.js client component errors
- Font configuration issues
- Unused variable warnings

## Security Considerations

- Always set a strong `WEBHOOK_SECRET` to verify incoming webhook requests
- Secure your Vercel API token as it provides access to your Vercel account
- Use HTTPS in production environments