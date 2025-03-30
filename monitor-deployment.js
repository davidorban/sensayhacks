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
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Common error patterns and suggested fixes
const errorPatterns = [
  {
    pattern: /'(\w+)' is assigned a value but never used/,
    fix: (match) => `Fix unused variable '${match[1]}' by either removing it, using an underscore prefix (_${match[1]}), or using empty destructuring if it's from useState().`
  },
  {
    pattern: /Missing dependency: '(\w+)'/,
    fix: (match) => `Add '${match[1]}' to the dependency array in useEffect().`
  },
  {
    pattern: /"use client"/i,
    fix: () => `Add "use client" directive at the top of the file if using client-side React features.`
  },
  {
    pattern: /Each child in a list should have a unique "key" prop/,
    fix: () => `Add a unique key prop to each element in the mapped array.`
  }
];

// Store the latest deployment ID to avoid re-processing
let latestDeploymentId = null;

/**
 * Logs a message to the console with optional color
 */
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Executes a command and returns the output
 */
function executeCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    log(`Error executing command: ${command}`, colors.red);
    log(error.message, colors.red);
    return null;
  }
}

/**
 * Executes a command asynchronously
 */
function executeCommandAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

/**
 * Parses error logs and suggests fixes
 */
function suggestFixes(errorLog) {
  const lines = errorLog.split('\n');
  const suggestions = [];
  
  for (const line of lines) {
    for (const { pattern, fix } of errorPatterns) {
      const match = line.match(pattern);
      if (match) {
        suggestions.push({
          error: line.trim(),
          suggestion: fix(match)
        });
      }
    }
  }
  
  return suggestions;
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
 * Monitors a deployment until it completes or fails
 */
async function monitorDeployment(deploymentId) {
  log(`Monitoring deployment: ${deploymentId}`, colors.cyan);
  
  let retries = 0;
  let deploymentState = null;
  
  while (retries < MAX_RETRIES) {
    try {
      const output = await executeCommandAsync(`vercel inspect ${deploymentId} --yes`);
      
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
          const logs = await executeCommandAsync(`vercel logs ${deploymentId} --yes`);
          if (logs) {
            // Save logs to file
            fs.writeFileSync(ERROR_LOG_FILE, logs);
            log(`Build logs saved to: ${ERROR_LOG_FILE}`, colors.yellow);
            
            // Extract and display error messages
            const errorLines = logs.split('\n').filter(line => 
              line.includes('Error:') || 
              line.includes('error') || 
              line.includes('Failed')
            );
            
            if (errorLines.length > 0) {
              log(`\nBuild Errors:`, colors.red);
              errorLines.forEach(line => log(`  ${line}`, colors.red));
              
              // Suggest fixes
              const suggestions = suggestFixes(logs);
              if (suggestions.length > 0) {
                log(`\nSuggested Fixes:`, colors.green);
                suggestions.forEach(({ error, suggestion }) => {
                  log(`  Error: ${error}`, colors.yellow);
                  log(`  Fix: ${suggestion}`, colors.green);
                  log('');
                });
              }
            }
          }
          
          return { success: false, logs };
        } else {
          log(`Deployment status: ${deploymentState} (check ${retries + 1}/${MAX_RETRIES})`, colors.blue);
        }
      }
    } catch (error) {
      log(`Error checking deployment status: ${error.message}`, colors.red);
    }
    
    retries++;
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
  
  log(`Monitoring timed out after ${MAX_RETRIES} checks.`, colors.yellow);
  return { success: false, timedOut: true };
}

/**
 * Polls for new deployments
 */
async function pollForDeployments() {
  log('Starting deployment monitor...', colors.cyan);
  log('Polling for new deployments...', colors.cyan);
  
  while (true) {
    try {
      const deploymentId = await getLatestDeploymentId();
      
      if (deploymentId && deploymentId !== latestDeploymentId) {
        log(`\nNew deployment detected: ${deploymentId}`, colors.magenta);
        latestDeploymentId = deploymentId;
        
        const result = await monitorDeployment(deploymentId);
        
        if (!result.success && !result.timedOut) {
          log(`\nRefer to the linting guide for more information on fixing these errors:`, colors.cyan);
          log(`${path.join(__dirname, 'documentation', 'linting-guide.md')}`, colors.cyan);
        }
      }
    } catch (error) {
      log(`Error polling for deployments: ${error.message}`, colors.red);
    }
    
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }
}

// Start polling
pollForDeployments().catch(error => {
  log(`Error in deployment monitor: ${error.message}`, colors.red);
});
