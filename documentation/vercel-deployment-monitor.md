# Vercel Deployment Monitor

This tool automatically monitors Vercel deployments for the SensayHacks project, capturing build logs and providing suggestions for fixing common errors.

## Features

- **Automatic Deployment Detection**: Polls for new deployments at regular intervals
- **Real-time Status Tracking**: Monitors deployment progress until completion
- **Automatic Error Detection**: Captures build errors without manual intervention
- **Error Analysis**: Identifies common linting and build issues
- **Fix Suggestions**: Provides actionable suggestions based on the linting guide
- **Log Saving**: Stores detailed build logs for reference

## Usage

### Starting the Monitor

1. Open a terminal in the project root directory
2. Run the monitor script:

```bash
# Using the batch file (Windows)
monitor-deployment.bat

# Or directly with Node.js
node monitor-deployment.js
```

3. The monitor will start polling for new deployments
4. Keep the terminal open while you work on the project

### Workflow

1. Start the monitor before making changes to the codebase
2. Make your changes and commit them as usual
3. Push to the repository to trigger a Vercel deployment
4. The monitor will automatically:
   - Detect the new deployment
   - Track its progress
   - Capture any build errors
   - Suggest fixes based on the error patterns

### Understanding the Output

The monitor provides color-coded output:

- **Blue**: Status updates and progress information
- **Green**: Successful deployments and fix suggestions
- **Yellow**: Warnings and timeout notifications
- **Red**: Error messages and build failures
- **Magenta**: New deployment notifications
- **Cyan**: General information

### Error Logs

If a build fails, the error logs are saved to `vercel-build-errors.log` in the project root. These logs contain detailed information about what went wrong during the build process.

## Common Error Patterns

The monitor automatically recognizes and suggests fixes for common errors:

1. **Unused Variables**: Variables that are declared but never used
2. **Missing Dependencies**: useEffect hooks with missing dependencies
3. **Client Directives**: Components using client-side features without "use client" directive
4. **Missing Key Props**: List items without unique key props

For each detected error, the monitor will provide a specific suggestion based on our [Linting Guide](./linting-guide.md).

## How It Works

The monitor uses the following approach:

1. **Polling**: Checks for new deployments every 10 seconds using `vercel list --yes`
2. **Deployment Tracking**: When a new deployment is detected, monitors its status
3. **Status Checks**: Polls the deployment status every 5 seconds using `vercel inspect --yes`
4. **Error Handling**: If a deployment fails, retrieves and analyzes the logs with `vercel logs --yes`

## Troubleshooting

If the monitor isn't working as expected:

1. **Vercel CLI Not Found**: Ensure Vercel CLI is installed (`npm install -g vercel`)
2. **Authentication Issues**: Make sure you're logged in to Vercel (`vercel login`)
3. **Project Linking**: Verify the project is linked to Vercel (`vercel link`)

## Integration with Development Workflow

For the best experience, integrate the deployment monitor into your development workflow:

1. Start the monitor at the beginning of your development session
2. Refer to the [Linting Guide](./linting-guide.md) to prevent common errors
3. Use the monitor's suggestions to quickly fix any build failures
4. Keep the linting guide and monitor output handy for reference
