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

// Parse command line arguments
const args = process.argv.slice(2);
const localLogFile = args.find(arg => arg.startsWith('--log='))?.split('=')[1];

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
  let deploymentState = null;
  
  while (retries < MAX_RETRIES) {
    try {
      const output = await executeCommandAsync(`vercel inspect ${deploymentId}`);
      
      // Extract state from the output
      const stateMatch = output.match(/State:\s+(\w+)/);
      if (stateMatch) {
        deploymentState = stateMatch[1];
        
        if (deploymentState === 'READY') {
          log(`✅ Deployment successful!`, colors.green + colors.bold);
          return { success: true };
        } else if (deploymentState === 'ERROR') {
          log(`❌ Deployment failed!`, colors.red + colors.bold);
          
          // Get build logs
          try {
            const logs = await executeCommandAsync(`vercel logs ${deploymentId} --output=json`);
            if (logs) {
              // Save logs to file
              fs.writeFileSync(ERROR_LOG_FILE, logs);
              log(`Build logs saved to ${ERROR_LOG_FILE}`, colors.blue);
              
              // Extract and display errors
              const errorLines = extractErrorsFromLog(logs);
              displayErrors(errorLines);
              
              // Suggest fixes
              suggestFixesForErrors(logs);
              
              // Offer to fix common issues
              await fixCommonIssues(logs);
            }
          } catch (logError) {
            log(`Failed to get logs: ${logError.message}`, colors.red);
            
            // Try with regular logs command as fallback
            try {
              const regularLogs = await executeCommandAsync(`vercel logs ${deploymentId}`);
              if (regularLogs) {
                fs.writeFileSync(ERROR_LOG_FILE, regularLogs);
                log(`Basic logs saved to ${ERROR_LOG_FILE}`, colors.blue);
                
                // Process logs
                const errorLines = extractErrorsFromLog(regularLogs);
                displayErrors(errorLines);
                suggestFixesForErrors(regularLogs);
                await fixCommonIssues(regularLogs);
              }
            } catch (fallbackError) {
              log(`Failed to get logs with fallback method: ${fallbackError.message}`, colors.red);
            }
          }
          
          return { success: false };
        }
      }
      
      retries++;
      log(`Deployment status: ${deploymentState || 'Building'} (check ${retries}/${MAX_RETRIES})`, colors.blue);
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    } catch (error) {
      log(`Error checking deployment status: ${error.message}`, colors.red);
      retries++;
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }
  }
  
  log(`Timed out waiting for deployment to complete.`, colors.yellow);
  return { success: false, timedOut: true };
}

/**
 * Polls for new deployments
 */
async function pollForDeployments() {
  log('Starting deployment monitor...', colors.cyan);
  
  let lastDeploymentId = null;
  
  while (true) {
    log('Polling for new deployments...', colors.blue);
    
    const deploymentId = await getLatestDeploymentId();
    
    if (deploymentId && deploymentId !== lastDeploymentId) {
      log(`\nNew deployment detected: ${deploymentId}`, colors.magenta);
      lastDeploymentId = deploymentId;
      
      await monitorDeployment(deploymentId);
    }
    
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }
}

// Main execution
if (localLogFile) {
  processLocalLogFile(localLogFile);
} else {
  // Start normal polling
  pollForDeployments().catch(error => {
    log(`Error in deployment monitor: ${error.message}`, colors.red);
  });
}
