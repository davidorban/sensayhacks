#!/usr/bin/env node

/**
 * Vercel Deployment Monitor
 * 
 * This script monitors Vercel deployments and catches build errors automatically.
 * It will:
 * 1. Poll for new deployments
 * 2. Track deployment status
 * 3. Capture and display build errors
 * 4. Suggest fixes based on common error patterns
 */

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');

// Parse command line arguments
const args = process.argv.slice(2);
const localLogFile = args.find(arg => arg.startsWith('--log='))?.split('=')[1];
const vercelToken = args.find(arg => arg.startsWith('--token='))?.split('=')[1] || process.env.VERCEL_TOKEN;
const vercelTeamId = args.find(arg => arg.startsWith('--team='))?.split('=')[1] || process.env.VERCEL_TEAM_ID;
const verifyMode = args.includes('--verify');

// Configuration
const POLL_INTERVAL = 10000; // Time between deployment checks in milliseconds
const MAX_RETRIES = 60; // Maximum number of status checks
const CHECK_INTERVAL = 5000; // Time between status checks in milliseconds
const ERROR_LOG_FILE = path.join(__dirname, 'vercel-build-errors.log');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Common error patterns and suggested fixes
const errorPatterns = [
  {
    pattern: /'([^']+)' is defined but never used/,
    fix: (match) => `Remove the unused variable '${match[1]}' or prefix it with an underscore (_${match[1]}) to indicate it's intentionally unused.`
  },
  {
    pattern: /React Hook useEffect has a missing dependency: '([^']+)'/,
    fix: (match) => `Add '${match[1]}' to the dependency array of your useEffect hook.`
  },
  {
    pattern: /Component cannot be rendered outside the context of a Client Component/,
    fix: () => `Add "use client" directive at the top of your component file.`
  },
  {
    pattern: /Each child in a list should have a unique "key" prop/,
    fix: () => `Add a unique 'key' prop to each element in your mapped array.`
  },
  {
    pattern: /Cannot find module '([^']+)'/,
    fix: (match) => `Install the missing module with: npm install ${match[1]}`
  },
  {
    pattern: /Module not found: Can't resolve '([^']+)'/,
    fix: (match) => `Install the missing dependency: npm install ${match[1]}`
  },
  {
    pattern: /An error occurred in `next\/font`/,
    fix: () => `Check your font configuration in next.config.js and make sure all required dependencies like autoprefixer are installed`
  }
];

/**
 * Logs a message to the console with color
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Executes a command asynchronously
 */
function executeCommandAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${error.message}\n${stderr}`));
        return;
      }
      resolve(stdout);
    });
  });
}

/**
 * Gets the latest deployment ID
 */
async function getLatestDeploymentId() {
  try {
    const output = await executeCommandAsync('vercel list --yes');
    const lines = output.split('\n').filter(line => line.trim() !== '');
    
    // Skip the header line and get the first deployment
    if (lines.length >= 2) {
      const deploymentLine = lines[1];
      const parts = deploymentLine.split(/\s+/);
      
      // The deployment ID is typically in the first column
      if (parts.length > 0) {
        return parts[0];
      }
    }
    
    return null;
  } catch (error) {
    log(`Error getting latest deployment: ${error.message}`, colors.red);
    return null;
  }
}

/**
 * Analyzes error logs and suggests fixes
 */
function suggestFixesForErrors(logContent) {
  log('\nAnalyzing errors and suggesting fixes...', colors.blue);
  
  let fixesSuggested = false;
  
  for (const { pattern, fix } of errorPatterns) {
    const regex = new RegExp(pattern);
    const match = regex.exec(logContent);
    
    if (match) {
      const suggestion = fix(match);
      log(`\n🔍 Found issue: ${match[0]}`, colors.yellow);
      log(`✅ Suggested fix: ${suggestion}`, colors.green);
      fixesSuggested = true;
    }
  }
  
  if (!fixesSuggested) {
    log('\nNo specific fixes could be suggested for these errors.', colors.yellow);
    log('Please review the error logs manually for more details.', colors.yellow);
  }
  
  // Check for missing dependencies
  const missingDependencies = extractMissingDependencies(logContent);
  if (missingDependencies.length > 0) {
    log('\n📦 Missing dependencies detected:', colors.yellow);
    missingDependencies.forEach(dep => {
      log(`   - ${dep}`, colors.yellow);
    });
    log(`\n💡 Run the following command to install missing dependencies:`, colors.green);
    log(`npm install ${missingDependencies.join(' ')}`, colors.cyan);
  }
}

/**
 * Extract missing dependencies from error logs
 */
function extractMissingDependencies(logContent) {
  const missingModules = [];
  const regex = /Cannot find module '([^']+)'|Can't resolve '([^']+)'/g;
  let match;
  
  while ((match = regex.exec(logContent)) !== null) {
    const moduleName = match[1] || match[2];
    if (moduleName && !missingModules.includes(moduleName) && !moduleName.startsWith('.')) {
      missingModules.push(moduleName);
    }
  }
  
  return missingModules;
}

/**
 * Automatically fix common issues
 */
async function fixCommonIssues(errorLog) {
  const missingModules = extractMissingDependencies(errorLog);
  
  if (missingModules.length > 0) {
    log(`\nDetected missing modules: ${missingModules.join(', ')}`, colors.yellow);
    log(`Would you like to install these modules? (y/n)`, colors.cyan);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const response = await new Promise(resolve => {
      rl.question('', (answer) => {
        rl.close();
        resolve(answer.toString().trim().toLowerCase());
      });
    });
    
    if (response === 'y' || response === 'yes') {
      log(`\nInstalling missing modules...`, colors.green);
      try {
        await executeCommandAsync(`npm install ${missingModules.join(' ')}`);
        log(`Modules installed successfully!`, colors.green);
        return true;
      } catch (error) {
        log(`Failed to install modules: ${error.message}`, colors.red);
        return false;
      }
    }
  }
  
  return false;
}

/**
 * Extract errors from log content
 */
function extractErrorsFromLog(logContent) {
  // Look for specific Next.js and webpack error patterns
  const errorPatterns = [
    /Error: Cannot find module '([^']+)'/g,
    /Failed to compile/g,
    /Module not found: Can't resolve '([^']+)'/g,
    /An error occurred in/g,
    /[^\s]+ is defined but never used/g,
    /Component cannot be rendered outside the context of a Client Component/g,
    /Each child in a list should have a unique "key" prop/g
  ];
  
  const errorLines = [];
  const lines = logContent.split('\n');
  
  // Extract lines that match error patterns or are near error lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const isErrorLine = errorPatterns.some(pattern => pattern.test(line));
    if (isErrorLine) {
      // Include some context (lines before and after the error)
      const contextStart = Math.max(0, i - 2);
      const contextEnd = Math.min(lines.length - 1, i + 3);
      
      for (let j = contextStart; j <= contextEnd; j++) {
        errorLines.push(lines[j]);
      }
      
      // Skip ahead to avoid duplicate context
      i = contextEnd;
    }
  }
  
  return errorLines;
}

/**
 * Display extracted errors
 */
function displayErrors(errorLines) {
  if (errorLines.length === 0) {
    log('No specific errors found in the logs.', colors.yellow);
    return;
  }
  
  log('\n🔍 Extracted Error Information:', colors.red + colors.bold);
  log('----------------------------', colors.red);
  
  errorLines.forEach(line => {
    // Highlight error lines
    if (/error|failed|cannot|undefined|not found/i.test(line)) {
      log(line, colors.red);
    } else {
      log(line);
    }
  });
  
  log('----------------------------', colors.red);
}

/**
 * Process a local log file
 */
function processLocalLogFile(filePath) {
  try {
    const logContent = fs.readFileSync(filePath, 'utf8');
    log('Processing local log file...', colors.cyan);
    
    // Extract and process errors
    const errorLines = extractErrorsFromLog(logContent);
    displayErrors(errorLines);
    
    // Suggest fixes
    suggestFixesForErrors(logContent);
    
    // Offer to fix common issues
    fixCommonIssues(logContent);
    
    return true;
  } catch (error) {
    log(`Error processing log file: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Monitors a deployment until it completes or fails
 */
async function monitorDeployment(deploymentId) {
  log(`Monitoring deployment: ${deploymentId}`, colors.cyan);
  
  let retries = 0;
  let status = null;
  let errorLog = null;
  
  while (retries < MAX_RETRIES) {
    try {
      // Get deployment status using Vercel CLI or API
      let statusOutput;
      
      if (vercelToken) {
        // Use Vercel API directly
        const deploymentData = await fetchFromVercelApi(`/v13/deployments/${deploymentId}`, vercelToken, vercelTeamId);
        status = deploymentData.readyState;
        statusOutput = JSON.stringify(deploymentData, null, 2);
        log(`Deployment status (via API): ${status}`, colors.blue);
      } else {
        // Fallback to CLI
        statusOutput = execSync(`vercel inspect ${deploymentId}`).toString();
        
        // More robust status detection - look for the status line and extract the word after any bullet character
        let statusMatch = null;
        const statusLine = statusOutput.split('\n').find(line => line.trim().startsWith('status'));
        if (statusLine) {
          // Extract the status word, ignoring any bullet point or special character
          const statusWordMatch = statusLine.match(/status.*?(\w+)$/);
          if (statusWordMatch) {
            status = statusWordMatch[1];
          }
        }
        
        log(`Deployment status (via CLI): ${status}`, colors.blue);
      }
      
      // Log the command and timestamp for verification
      const timestamp = new Date().toISOString();
      log(`[${timestamp}] Checking deployment status with command: ${vercelToken ? 'Vercel API' : `vercel inspect ${deploymentId}`}`, colors.cyan);
      
      if (status === 'ERROR' || status === 'Error') {
        log(`Deployment failed with status: ${status}`, colors.red);
        
        // Get build logs directly from API if token is available
        if (vercelToken) {
          const logFilePath = await getDeploymentBuildLogs(deploymentId);
          if (logFilePath) {
            errorLog = fs.readFileSync(logFilePath, 'utf8');
            
            // Verify we're using real data if in verify mode
            const verified = await verifyDataSource(`Vercel API logs for deployment ${deploymentId}`, errorLog);
            if (!verified) {
              log('User verification failed. Aborting analysis.', colors.red);
              return;
            }
            
            // Process the error log
            const errors = extractErrorsFromLog(errorLog);
            displayErrors(errors);
            suggestFixesForErrors(errorLog);
            fixCommonIssues(errorLog);
          }
        } else {
          // Fallback to CLI for logs
          try {
            log('Attempting to fetch build logs...', colors.yellow);
            errorLog = execSync(`vercel logs ${deploymentId}`).toString();
            
            // Verify we're using real data if in verify mode
            const verified = await verifyDataSource(`CLI logs for deployment ${deploymentId}`, errorLog);
            if (!verified) {
              log('User verification failed. Aborting analysis.', colors.red);
              return;
            }
            
            // Process the error log
            const errors = extractErrorsFromLog(errorLog);
            displayErrors(errors);
            suggestFixesForErrors(errorLog);
            fixCommonIssues(errorLog);
          } catch (error) {
            log(`Error fetching logs: ${error.message}`, colors.red);
            log('Please check the Vercel dashboard for detailed error information.', colors.yellow);
            log('Consider providing a Vercel API token for better log access.', colors.yellow);
          }
        }
        
        // Save error log to file
        if (errorLog) {
          fs.writeFileSync(ERROR_LOG_FILE, errorLog);
          log(`Error log saved to ${ERROR_LOG_FILE}`, colors.yellow);
        }
        
        return 'error';
      } else if (status === 'READY' || status === 'Ready') {
        log(`Deployment successful with status: ${status}`, colors.green);
        return 'success';
      }
      
      retries++;
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    } catch (error) {
      log(`Error checking deployment status: ${error.message}`, colors.red);
      retries++;
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }
  }
  
  log(`Exceeded maximum retries (${MAX_RETRIES}) while checking deployment status.`, colors.red);
  return 'error';
}

/**
 * Polls for new deployments
 */
async function pollForDeployments() {
  log('Starting deployment monitor...', colors.cyan);
  
  let lastDeploymentId = null;
  let deploymentSuccessful = false;
  
  while (!deploymentSuccessful) {
    log('Polling for new deployments...', colors.blue);
    
    const deploymentId = await getLatestDeploymentId();
    
    if (deploymentId && deploymentId !== lastDeploymentId) {
      log(`\nNew deployment detected: ${deploymentId}`, colors.magenta);
      lastDeploymentId = deploymentId;
      
      // Monitor the deployment and get the result
      const result = await monitorDeployment(deploymentId);
      
      // If deployment was successful, set flag to exit the loop
      if (result === 'success') {
        deploymentSuccessful = true;
        log('Deployment monitoring completed successfully.', colors.green + colors.bold);
      }
    }
    
    if (!deploymentSuccessful) {
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }
  }
}

// Function to fetch data from Vercel API
function fetchFromVercelApi(endpoint, token = vercelToken, teamId = vercelTeamId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: teamId ? `${endpoint}?teamId=${teamId}` : endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (e) {
          reject(new Error(`Failed to parse Vercel API response: ${e.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Function to get deployment build logs directly from Vercel API
async function getDeploymentBuildLogs(deploymentId, token = vercelToken, teamId = vercelTeamId) {
  try {
    log(`Fetching build logs for deployment ${deploymentId} directly from Vercel API...`, colors.cyan);
    const endpoint = `/v6/deployments/${deploymentId}/events`;
    const events = await fetchFromVercelApi(endpoint, token, teamId);
    
    if (!events || !events.events || !Array.isArray(events.events)) {
      throw new Error('Invalid response format from Vercel API');
    }
    
    // Filter for build events and errors
    const buildEvents = events.events.filter(event => 
      event.type === 'command' || 
      event.type === 'stderr' || 
      event.type === 'stdout' ||
      event.type === 'error'
    );
    
    // Extract log messages
    const logMessages = buildEvents.map(event => {
      const timestamp = new Date(event.created).toISOString();
      return `[${timestamp}] ${event.payload?.text || event.message || JSON.stringify(event.payload)}`;
    }).join('\n');
    
    // Save logs to file for analysis
    const logFilePath = path.join(__dirname, `vercel-build-logs-${deploymentId}.log`);
    fs.writeFileSync(logFilePath, logMessages);
    
    log(`Build logs saved to ${logFilePath}`, colors.green);
    return logFilePath;
  } catch (error) {
    log(`Error fetching build logs: ${error.message}`, colors.red);
    return null;
  }
}

// Function to verify we're using real data
function verifyDataSource(source, data) {
  if (verifyMode) {
    log(`\n${colors.bold}${colors.yellow}VERIFICATION MODE${colors.reset}`, colors.yellow);
    log(`Data source: ${source}`, colors.yellow);
    log(`Timestamp: ${new Date().toISOString()}`, colors.yellow);
    log(`Data sample: ${data.substring(0, 200)}...`, colors.yellow);
    log(`${colors.bold}${colors.yellow}Please verify this matches what you see in the Vercel dashboard${colors.reset}\n`, colors.yellow);
    
    // In verification mode, pause for user confirmation
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      rl.question('Does this match what you see in the Vercel dashboard? (y/n) ', (answer) => {
        rl.close();
        if (answer.toLowerCase() === 'y') {
          log('Verification confirmed. Proceeding with analysis.', colors.green);
          resolve(true);
        } else {
          log('Verification failed. Please check the data source.', colors.red);
          resolve(false);
        }
      });
    });
  }
  
  return Promise.resolve(true); // Skip verification in normal mode
}

// Main execution
if (localLogFile) {
  processLocalLogFile(localLogFile);
} else {
  // Check if we have the necessary Vercel token for API access
  if (!vercelToken && !verifyMode) {
    log(`${colors.yellow}${colors.bold}NOTE: For direct access to Vercel build logs, provide a Vercel API token:${colors.reset}`, colors.yellow);
    log(`  node monitor-deployment.js --token=YOUR_VERCEL_TOKEN`, colors.yellow);
    log(`  Or set the VERCEL_TOKEN environment variable`, colors.yellow);
    log(`${colors.yellow}${colors.bold}To verify logs match what you see in the Vercel dashboard:${colors.reset}`, colors.yellow);
    log(`  node monitor-deployment.js --verify`, colors.yellow);
    log(`${colors.yellow}Running in CLI-only mode (limited log access)...${colors.reset}\n`, colors.yellow);
  }

  log(`Starting deployment monitor...`, colors.green + colors.bold);
  pollForDeployments();
}
