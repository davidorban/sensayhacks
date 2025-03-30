#!/usr/bin/env node

/**
 * Vercel Deployment Monitor
 * A tool to monitor Vercel deployments and analyze build errors
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');

// ===== Configuration =====
const config = {
  pollInterval: 10000,
  maxRetries: 60,
  checkInterval: 5000,
  errorLogFile: path.join(__dirname, 'vercel-build-errors.log'),
  colors: {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
  }
};

// ===== CLI Arguments =====
const args = {
  parse() {
    const argv = process.argv.slice(2);
    return {
      localLogFile: argv.find(arg => arg.startsWith('--log='))?.split('=')[1],
      vercelToken: argv.find(arg => arg.startsWith('--token='))?.split('=')[1] || process.env.VERCEL_TOKEN,
      vercelTeamId: argv.find(arg => arg.startsWith('--team='))?.split('=')[1] || process.env.VERCEL_TEAM_ID,
      verifyMode: argv.includes('--verify')
    };
  }
};

// ===== Error Patterns =====
const errorPatterns = [
  {
    pattern: /'([^']+)' is defined but never used/,
    fix: (match) => `Remove the unused variable '${match[1]}' or prefix it with an underscore (_${match[1]}).`
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
    fix: () => `Check your font configuration and install autoprefixer: npm install --save-dev autoprefixer`
  }
];

// ===== Logger =====
const logger = {
  log(message, color = config.colors.reset) {
    console.log(`${color}${message}${config.colors.reset}`);
  }
};

// ===== Command Executor =====
const executor = {
  async execute(command) {
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
};

// ===== Vercel API Client =====
const vercelAPI = {
  async fetch(endpoint, token, teamId) {
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
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            
            // Check for API errors
            if (res.statusCode !== 200) {
              reject(new Error(`Vercel API Error (${res.statusCode}): ${parsedData.error?.message || JSON.stringify(parsedData)}`));
              return;
            }
            
            resolve(parsedData);
          } catch (e) {
            reject(new Error(`Failed to parse Vercel API response: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  },

  async getLatestDeployments(token, teamId, limit = 5) {
    const data = await this.fetch(`/v6/deployments?limit=${limit}`, token, teamId);
    return data.deployments || [];
  },

  async getDeploymentStatus(deploymentId, token, teamId) {
    const data = await this.fetch(`/v13/deployments/${deploymentId}`, token, teamId);
    return {
      state: data.readyState,
      ready: data.readyState === 'READY',
      error: data.readyState === 'ERROR',
      createdAt: data.created,
      url: data.url,
      inspectUrl: `https://vercel.com/${teamId ? `team/${teamId}` : ''}/${data.name}/deployments/${deploymentId}`
    };
  },

  async getDeploymentBuildLogs(deploymentId, token, teamId) {
    try {
      logger.log(`Fetching build logs for deployment ${deploymentId}...`, config.colors.cyan);
      const data = await this.fetch(`/v13/deployments/${deploymentId}/events`, token, teamId);
      
      if (!data || !data.events || !Array.isArray(data.events)) {
        throw new Error('Invalid response format from Vercel API');
      }
      
      // Filter for build events and errors
      const buildEvents = data.events.filter(event => 
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
      
      return logMessages;
    } catch (error) {
      logger.log(`Error fetching build logs: ${error.message}`, config.colors.red);
      return null;
    }
  },
  
  async getDeploymentFunctions(deploymentId, token, teamId) {
    try {
      const data = await this.fetch(`/v13/deployments/${deploymentId}/functions`, token, teamId);
      return data.functions || [];
    } catch (error) {
      logger.log(`Error fetching deployment functions: ${error.message}`, config.colors.red);
      return [];
    }
  },
  
  async getDeploymentDetail(deploymentId, token, teamId) {
    try {
      const data = await this.fetch(`/v13/deployments/${deploymentId}`, token, teamId);
      return data;
    } catch (error) {
      logger.log(`Error fetching deployment details: ${error.message}`, config.colors.red);
      return null;
    }
  }
};

// ===== Vercel CLI Client =====
const vercelCLI = {
  async getLatestDeploymentId() {
    try {
      const output = await executor.execute('vercel list --yes');
      const lines = output.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length >= 2) {
        const deploymentLine = lines[1];
        const parts = deploymentLine.split(/\s+/);
        
        if (parts.length > 0) {
          return parts[0];
        }
      }
      
      return null;
    } catch (error) {
      logger.log(`Error getting latest deployment: ${error.message}`, config.colors.red);
      return null;
    }
  },

  async getDeploymentStatus(deploymentId) {
    try {
      const output = await executor.execute(`vercel inspect ${deploymentId}`);
      
      if (output.includes('status      ● Ready')) {
        return 'Ready';
      } else if (output.includes('status      ● Error')) {
        return 'Error';
      }
      
      const statusLines = output.split('\n').filter(line => line.trim().toLowerCase().includes('status'));
      
      for (const statusLine of statusLines) {
        if (statusLine.includes('Ready')) return 'Ready';
        if (statusLine.includes('Error')) return 'Error';
      }
      
      return null;
    } catch (error) {
      logger.log(`Error checking deployment status via CLI: ${error.message}`, config.colors.red);
      return null;
    }
  },

  async getDeploymentLogs(deploymentId) {
    try {
      logger.log('Fetching build logs via CLI...', config.colors.yellow);
      return await executor.execute(`vercel logs ${deploymentId}`);
    } catch (error) {
      logger.log(`Error fetching logs via CLI: ${error.message}`, config.colors.red);
      return null;
    }
  }
};

// ===== Error Analyzer =====
const errorAnalyzer = {
  extractErrorsFromLog(logContent) {
    const errorPatternRegexes = [
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
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      const isErrorLine = errorPatternRegexes.some(pattern => pattern.test(line));
      if (isErrorLine) {
        // Include some context
        const contextStart = Math.max(0, i - 2);
        const contextEnd = Math.min(lines.length - 1, i + 3);
        
        for (let j = contextStart; j <= contextEnd; j++) {
          errorLines.push(lines[j]);
        }
        
        i = contextEnd;
      }
    }
    
    return errorLines;
  },

  displayErrors(errorLines) {
    if (errorLines.length === 0) {
      logger.log('No specific errors found in the logs.', config.colors.yellow);
      return;
    }
    
    logger.log('\n🔍 Extracted Error Information:', config.colors.red + config.colors.bold);
    logger.log('----------------------------', config.colors.red);
    
    errorLines.forEach(line => {
      if (/error|failed|cannot|undefined|not found/i.test(line)) {
        logger.log(line, config.colors.red);
      } else {
        logger.log(line);
      }
    });
    
    logger.log('----------------------------', config.colors.red);
  },

  suggestFixes(logContent) {
    logger.log('\nAnalyzing errors and suggesting fixes...', config.colors.blue);
    
    let fixesSuggested = false;
    
    for (const { pattern, fix } of errorPatterns) {
      const regex = new RegExp(pattern);
      const match = regex.exec(logContent);
      
      if (match) {
        const suggestion = fix(match);
        logger.log(`\n🔍 Found issue: ${match[0]}`, config.colors.yellow);
        logger.log(`✅ Suggested fix: ${suggestion}`, config.colors.green);
        fixesSuggested = true;
      }
    }
    
    if (!fixesSuggested) {
      logger.log('\nNo specific fixes could be suggested for these errors.', config.colors.yellow);
      logger.log('Please review the error logs manually for more details.', config.colors.yellow);
    }
    
    // Check for missing dependencies
    const missingDependencies = this.extractMissingDependencies(logContent);
    if (missingDependencies.length > 0) {
      logger.log('\n📦 Missing dependencies detected:', config.colors.yellow);
      missingDependencies.forEach(dep => {
        logger.log(`   - ${dep}`, config.colors.yellow);
      });
      logger.log(`\n💡 Run the following command to install missing dependencies:`, config.colors.green);
      logger.log(`npm install ${missingDependencies.join(' ')}`, config.colors.cyan);
    }
  },

  extractMissingDependencies(logContent) {
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
  },

  async fixCommonIssues(errorLog) {
    const missingModules = this.extractMissingDependencies(errorLog);
    
    if (missingModules.length > 0) {
      logger.log(`\nDetected missing modules: ${missingModules.join(', ')}`, config.colors.yellow);
      logger.log(`Would you like to install these modules? (y/n)`, config.colors.cyan);
      
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
        logger.log(`\nInstalling missing modules...`, config.colors.green);
        try {
          await executor.execute(`npm install ${missingModules.join(' ')}`);
          logger.log(`Modules installed successfully!`, config.colors.green);
          return true;
        } catch (error) {
          logger.log(`Failed to install modules: ${error.message}`, config.colors.red);
          return false;
        }
      }
    }
    
    return false;
  }
};

// ===== User Interaction =====
const userInteraction = {
  async verifyDataSource(source, data, verifyMode) {
    if (!verifyMode) return true;
    
    logger.log(`\n${config.colors.bold}${config.colors.yellow}VERIFICATION MODE${config.colors.reset}`, config.colors.yellow);
    logger.log(`Data source: ${source}`, config.colors.yellow);
    logger.log(`Data sample: ${data.substring(0, 200)}...`, config.colors.yellow);
    logger.log(`${config.colors.bold}${config.colors.yellow}Please verify this matches what you see in the Vercel dashboard${config.colors.reset}\n`, config.colors.yellow);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      rl.question('Does this match what you see in the Vercel dashboard? (y/n) ', (answer) => {
        rl.close();
        if (answer.toLowerCase() === 'y') {
          logger.log('Verification confirmed. Proceeding with analysis.', config.colors.green);
          resolve(true);
        } else {
          logger.log('Verification failed. Please check the data source.', config.colors.red);
          resolve(false);
        }
      });
    });
  }
};

// ===== Deployment Monitor =====
const deploymentMonitor = {
  async monitorDeployment(deploymentId, options) {
    logger.log(`Monitoring deployment: ${deploymentId}`, config.colors.cyan);
    
    let retries = 0;
    
    while (retries < config.maxRetries) {
      try {
        // Get detailed status via API
        const statusObj = await vercelAPI.getDeploymentStatus(
          deploymentId, 
          options.vercelToken, 
          options.vercelTeamId
        );
        
        const timestamp = new Date().toISOString();
        logger.log(`[${timestamp}] Deployment status: ${statusObj.state}`, config.colors.blue);
        
        // Display deployment URL if available
        if (statusObj.url) {
          logger.log(`Deployment URL: https://${statusObj.url}`, config.colors.cyan);
        }
        
        // Provide link to Vercel dashboard for this deployment
        if (statusObj.inspectUrl) {
          logger.log(`Dashboard: ${statusObj.inspectUrl}`, config.colors.cyan);
        }
        
        if (statusObj.error) {
          logger.log(`Deployment failed with status: ${statusObj.state}`, config.colors.red);
          
          // Get full deployment details for more error context
          const deploymentDetail = await vercelAPI.getDeploymentDetail(
            deploymentId, 
            options.vercelToken, 
            options.vercelTeamId
          );
          
          if (deploymentDetail && deploymentDetail.error) {
            logger.log(`Error message: ${deploymentDetail.error.message || 'Unknown error'}`, config.colors.red);
          }
          
          // Get build logs via API
          const errorLog = await vercelAPI.getDeploymentBuildLogs(
            deploymentId, 
            options.vercelToken, 
            options.vercelTeamId
          );
          
          if (errorLog) {
            // Verify data if required
            const verified = await userInteraction.verifyDataSource(
              `Logs for deployment ${deploymentId}`, 
              errorLog,
              options.verifyMode
            );
            
            if (!verified) return 'error';
            
            // Analyze errors
            const errors = errorAnalyzer.extractErrorsFromLog(errorLog);
            errorAnalyzer.displayErrors(errors);
            errorAnalyzer.suggestFixes(errorLog);
            await errorAnalyzer.fixCommonIssues(errorLog);
            
            // Save error log
            fs.writeFileSync(config.errorLogFile, errorLog);
            logger.log(`Error log saved to ${config.errorLogFile}`, config.colors.yellow);
          } else {
            logger.log('Could not retrieve build logs.', config.colors.red);
          }
          
          return 'error';
        } else if (statusObj.ready) {
          logger.log(`Deployment successful!`, config.colors.green);
          return 'success';
        } else {
          // Get deployment functions to show progress
          const functions = await vercelAPI.getDeploymentFunctions(
            deploymentId, 
            options.vercelToken, 
            options.vercelTeamId
          );
          
          if (functions.length > 0) {
            logger.log(`Building ${functions.length} functions...`, config.colors.yellow);
          }
        }
      } catch (error) {
        logger.log(`Error checking deployment: ${error.message}`, config.colors.red);
      }
      
      retries++;
      await new Promise(resolve => setTimeout(resolve, config.checkInterval));
    }
    
    logger.log(`Exceeded maximum retries (${config.maxRetries})`, config.colors.red);
    return 'error';
  },

  async pollAPI(options) {
    logger.log('Starting deployment monitor using Vercel API...', config.colors.cyan);
    
    let lastDeploymentId = null;
    let deploymentSuccessful = false;
    
    while (!deploymentSuccessful) {
      logger.log('Polling for new deployments...', config.colors.blue);
      
      try {
        // Get the most recent deployments
        const deployments = await vercelAPI.getLatestDeployments(
          options.vercelToken, 
          options.vercelTeamId
        );
        
        if (deployments.length > 0) {
          const latestDeployment = deployments[0];
          const deploymentId = latestDeployment.uid;
          
          if (deploymentId && deploymentId !== lastDeploymentId) {
            logger.log(`\nNew deployment detected: ${deploymentId}`, config.colors.magenta);
            logger.log(`Created: ${new Date(latestDeployment.created).toLocaleString()}`, config.colors.yellow);
            logger.log(`Name: ${latestDeployment.name}`, config.colors.yellow);
            
            lastDeploymentId = deploymentId;
            
            const result = await this.monitorDeployment(deploymentId, options);
            
            if (result === 'success') {
              deploymentSuccessful = true;
              logger.log('Deployment monitoring completed successfully.', config.colors.green + config.colors.bold);
            }
          }
        } else {
          logger.log('No deployments found.', config.colors.yellow);
        }
      } catch (error) {
        logger.log(`Error polling deployments: ${error.message}`, config.colors.red);
      }
      
      if (!deploymentSuccessful) {
        await new Promise(resolve => setTimeout(resolve, config.pollInterval));
      }
    }
  }
};

// ===== Log Processor =====
const logProcessor = {
  processLocalLogFile(filePath) {
    try {
      const logContent = fs.readFileSync(filePath, 'utf8');
      logger.log('Processing local log file...', config.colors.cyan);
      
      const errorLines = errorAnalyzer.extractErrorsFromLog(logContent);
      errorAnalyzer.displayErrors(errorLines);
      errorAnalyzer.suggestFixes(logContent);
      errorAnalyzer.fixCommonIssues(logContent);
      
      return true;
    } catch (error) {
      logger.log(`Error processing log file: ${error.message}`, config.colors.red);
      return false;
    }
  }
};

// ===== Main Application =====
async function main() {
  const options = args.parse();
  
  if (options.localLogFile) {
    logProcessor.processLocalLogFile(options.localLogFile);
    return;
  }
  
  // Verify token is provided for API-only mode
  if (!options.vercelToken) {
    logger.log(`${config.colors.red}${config.colors.bold}ERROR: Vercel API token is required for deployment monitoring.${config.colors.reset}`, config.colors.red);
    logger.log(`Please provide your Vercel API token using one of these methods:`, config.colors.yellow);
    logger.log(`  1. Command line: node monitor-deployment.js --token=YOUR_VERCEL_TOKEN`, config.colors.yellow);
    logger.log(`  2. Environment variable: export VERCEL_TOKEN=YOUR_VERCEL_TOKEN`, config.colors.yellow);
    logger.log(`\nTo get a Vercel API token:`, config.colors.cyan);
    logger.log(`  1. Go to https://vercel.com/account/tokens`, config.colors.cyan);
    logger.log(`  2. Click "Create" and give your token a name`, config.colors.cyan);
    logger.log(`  3. Copy the token (it will only be shown once)`, config.colors.cyan);
    
    process.exit(1);
  }

  // If team ID is needed but not provided
  if (!options.vercelTeamId) {
    logger.log(`${config.colors.yellow}NOTE: No team ID provided. Will monitor personal account deployments.${config.colors.reset}`, config.colors.yellow);
    logger.log(`If you need to monitor a team project, add: --team=TEAM_ID`, config.colors.yellow);
  }

  logger.log(`Starting Vercel deployment monitor...`, config.colors.green + config.colors.bold);
  await deploymentMonitor.pollAPI(options);
}

// Start the application
main().catch(error => {
  logger.log(`Error: ${error.message}`, config.colors.red);
  process.exit(1);
});