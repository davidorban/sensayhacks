#!/usr/bin/env node

/**
 * Vercel Deployment Monitor with Webhooks
 * 
 * This script creates a server to receive Vercel webhooks for deployment events
 * and provides real-time analysis of build errors.
 * 
 * It can be deployed on various domains and used remotely to monitor Vercel deployments.
 */

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const config = {
  port: process.env.PORT || 3000,
  webhookSecret: process.env.WEBHOOK_SECRET || '',
  vercelToken: process.env.VERCEL_TOKEN,
  vercelTeamId: process.env.VERCEL_TEAM_ID,
  errorLogDir: path.join(__dirname, 'logs'),
  // This will be configurable via environment variable
  domain: process.env.MONITOR_DOMAIN || 'localhost:3000',
  useHttps: process.env.USE_HTTPS === 'true' || false,
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
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

// Ensure the log directory exists
if (!fs.existsSync(config.errorLogDir)) {
  fs.mkdirSync(config.errorLogDir, { recursive: true });
}

// Error patterns to look for and their fixes
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

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Logging utility
const logger = {
  log(message, color = config.colors.reset) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${color}${message}${config.colors.reset}`);
  },
  
  error(message) {
    this.log(message, config.colors.red);
  },
  
  success(message) {
    this.log(message, config.colors.green);
  },
  
  info(message) {
    this.log(message, config.colors.cyan);
  },
  
  warn(message) {
    this.log(message, config.colors.yellow);
  }
};

// Vercel API client
const vercelAPI = {
  async fetch(endpoint, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.vercel.com',
        path: config.vercelTeamId ? `${endpoint}?teamId=${config.vercelTeamId}` : endpoint,
        method: method,
        headers: {
          'Authorization': `Bearer ${config.vercelToken}`,
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
            if (res.statusCode >= 400) {
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
      
      if (body) {
        req.write(JSON.stringify(body));
      }
      
      req.end();
    });
  },

  async getDeploymentBuildLogs(deploymentId) {
    try {
      logger.info(`Fetching build logs for deployment ${deploymentId}...`);
      const data = await this.fetch(`/v13/deployments/${deploymentId}/events`);
      
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
      logger.error(`Error fetching build logs: ${error.message}`);
      return null;
    }
  },
  
  async getDeploymentDetails(deploymentId) {
    try {
      return await this.fetch(`/v13/deployments/${deploymentId}`);
    } catch (error) {
      logger.error(`Error fetching deployment details: ${error.message}`);
      return null;
    }
  },
  
  async createWebhook(name, url) {
    try {
      const data = await this.fetch('/v10/webhooks', 'POST', {
        name: name,
        url: url,
        events: ['deployment']
      });
      
      logger.success(`Webhook created successfully with ID: ${data.id}`);
      return data;
    } catch (error) {
      logger.error(`Error creating webhook: ${error.message}`);
      return null;
    }
  },
  
  async listWebhooks() {
    try {
      const data = await this.fetch('/v10/webhooks');
      return data.webhooks || [];
    } catch (error) {
      logger.error(`Error listing webhooks: ${error.message}`);
      return [];
    }
  },
  
  async deleteWebhook(id) {
    try {
      await this.fetch(`/v10/webhooks/${id}`, 'DELETE');
      logger.success(`Webhook ${id} deleted successfully`);
      return true;
    } catch (error) {
      logger.error(`Error deleting webhook: ${error.message}`);
      return false;
    }
  }
};

// Error analyzer
const errorAnalyzer = {
  extractErrorsFromLog(logContent) {
    const errorPatternRegexes = [
      /Error: Cannot find module '([^']+)'/g,
      /Failed to compile/g,
      /Module not found: Can't resolve '([^']+)'/g,
      /An error occurred in/g,
      /[^\s]+ is defined but never used/g
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

  formatErrorReport(errorLines, deploymentId, url) {
    let report = `# Deployment Error Report\n\n`;
    report += `**Deployment ID:** ${deploymentId}\n`;
    
    if (url) {
      report += `**Deployment URL:** ${url}\n`;
    }
    
    report += `**Timestamp:** ${new Date().toISOString()}\n\n`;
    
    report += `## Error Details\n\n`;
    report += '```\n';
    report += errorLines.join('\n');
    report += '\n```\n\n';
    
    report += `## Suggested Fixes\n\n`;
    
    // Look for known error patterns and suggest fixes
    let fixesSuggested = false;
    const errorContent = errorLines.join('\n');
    
    for (const { pattern, fix } of errorPatterns) {
      const regex = new RegExp(pattern);
      const match = regex.exec(errorContent);
      
      if (match) {
        const suggestion = fix(match);
        report += `- **Issue:** ${match[0]}\n`;
        report += `  **Fix:** ${suggestion}\n\n`;
        fixesSuggested = true;
      }
    }
    
    if (!fixesSuggested) {
      report += '- No specific fixes could be suggested automatically. Please review the error log manually.\n\n';
    }
    
    // Check for missing dependencies
    const missingDependencies = this.extractMissingDependencies(errorContent);
    if (missingDependencies.length > 0) {
      report += `## Missing Dependencies\n\n`;
      report += 'Install the following dependencies:\n\n';
      report += '```bash\n';
      report += `npm install ${missingDependencies.join(' ')}\n`;
      report += '```\n\n';
    }
    
    return report;
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
  
  saveErrorReport(report, deploymentId) {
    const filename = path.join(config.errorLogDir, `error-report-${deploymentId}.md`);
    fs.writeFileSync(filename, report);
    logger.info(`Error report saved to ${filename}`);
    return filename;
  }
};

// Notification utility
const notifier = {
  async sendSlackNotification(message, deploymentId, isError = false) {
    if (!config.slackWebhookUrl) {
      return;
    }
    
    try {
      const payload = {
        text: message,
        attachments: [
          {
            color: isError ? '#ff0000' : '#36a64f',
            fields: [
              {
                title: 'Deployment ID',
                value: deploymentId,
                short: true
              },
              {
                title: 'Status',
                value: isError ? 'Failed' : 'Success',
                short: true
              }
            ],
            footer: `Vercel Deployment Monitor | ${new Date().toISOString()}`
          }
        ]
      };
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const url = new URL(config.slackWebhookUrl);
      
      const req = https.request({
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          if (res.statusCode === 200) {
            logger.success(`Slack notification sent for deployment ${deploymentId}`);
          } else {
            logger.error(`Failed to send Slack notification: HTTP ${res.statusCode}`);
          }
        });
      });
      
      req.on('error', (error) => {
        logger.error(`Error sending Slack notification: ${error.message}`);
      });
      
      req.write(JSON.stringify(payload));
      req.end();
    } catch (error) {
      logger.error(`Failed to send Slack notification: ${error.message}`);
    }
  }
};

// Verify webhook signature
function verifySignature(payload, signature) {
  if (!config.webhookSecret) {
    logger.warn('No webhook secret configured - skipping signature verification');
    return true;
  }
  
  try {
    const hmac = crypto.createHmac('sha256', config.webhookSecret);
    const computedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  } catch (error) {
    logger.error(`Signature verification error: ${error.message}`);
    return false;
  }
}

// Handle deployment events
async function handleDeploymentEvent(payload) {
  const deployment = payload.payload;
  const deploymentId = deployment.id;
  const type = payload.type; // created, ready, error, etc.
  
  logger.info(`Received deployment event: ${type} for ${deploymentId}`);
  
  // For error events, fetch logs and analyze
  if (type === 'deployment.error') {
    logger.error(`Deployment failed: ${deploymentId}`);
    
    // Get deployment details
    const details = await vercelAPI.getDeploymentDetails(deploymentId);
    const deploymentUrl = details?.url ? `https://${details.url}` : null;
    const projectName = details?.name || 'Unknown Project';
    
    // Get build logs
    const logs = await vercelAPI.getDeploymentBuildLogs(deploymentId);
    
    if (logs) {
      // Extract and analyze errors
      const errorLines = errorAnalyzer.extractErrorsFromLog(logs);
      
      if (errorLines.length > 0) {
        // Create error report
        const report = errorAnalyzer.formatErrorReport(errorLines, deploymentId, deploymentUrl);
        const reportPath = errorAnalyzer.saveErrorReport(report, deploymentId);
        
        // Display the report path
        logger.info(`Full error report available at: ${reportPath}`);
        
        // Display error summary
        logger.error('Error Summary:');
        errorLines.slice(0, 5).forEach(line => {
          if (/error|failed|cannot|undefined|not found/i.test(line)) {
            logger.error(`  ${line}`);
          }
        });
        
        if (errorLines.length > 5) {
          logger.info(`  ... and ${errorLines.length - 5} more lines. See the full report for details.`);
        }
        
        // Generate public URL for the error report
        const reportUrl = `${config.useHttps ? 'https' : 'http'}://${config.domain}/reports/${deploymentId}`;
        
        // Send notification
        await notifier.sendSlackNotification(
          `❌ Deployment for *${projectName}* failed.\nView the error report: ${reportUrl}`,
          deploymentId,
          true
        );
      } else {
        logger.warn('No specific errors found in the logs.');
      }
    } else {
      logger.error('Could not retrieve build logs.');
    }
  } else if (type === 'deployment.ready') {
    // Deployment succeeded
    const details = await vercelAPI.getDeploymentDetails(deploymentId);
    const projectName = details?.name || 'Unknown Project';
    logger.success(`Deployment successful for ${projectName}: ${deploymentId}`);
    
    if (details?.url) {
      logger.info(`Deployment URL: https://${details.url}`);
      
      // Send notification for successful deployment
      await notifier.sendSlackNotification(
        `✅ Deployment for *${projectName}* successfully completed!\nURL: https://${details.url}`,
        deploymentId,
        false
      );
    }
  } else if (type === 'deployment.created') {
    // New deployment created
    const details = await vercelAPI.getDeploymentDetails(deploymentId);
    const projectName = details?.name || 'Unknown Project';
    logger.info(`New deployment created for ${projectName}: ${deploymentId}`);
  }
}

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const signature = req.headers['x-vercel-signature'];
  
  // Verify signature if secret is configured
  if (config.webhookSecret && !verifySignature(req.body, signature)) {
    logger.error('Invalid webhook signature');
    return res.status(401).send('Invalid signature');
  }
  
  try {
    // Process the webhook asynchronously - don't wait to respond
    Promise.resolve().then(() => handleDeploymentEvent(req.body));
    
    // Respond immediately to Vercel
    res.status(200).send('OK');
  } catch (error) {
    logger.error(`Error processing webhook: ${error.message}`);
    res.status(500).send('Internal server error');
  }
});

// Setup endpoint
app.get('/setup', async (req, res) => {
  try {
    // Check if token is configured
    if (!config.vercelToken) {
      return res.status(400).send('Vercel API token not configured. Set the VERCEL_TOKEN environment variable.');
    }
    
    // Get project name for this webhook (optional)
    const projectName = req.query.project || 'Deployment Monitor';
    
    // Get subdomain if specified
    const subdomain = req.query.subdomain || '';
    
    // Create webhook URL
    let webhookUrl;
    if (subdomain) {
      webhookUrl = `${config.useHttps ? 'https' : 'http'}://${subdomain}.${config.domain}/webhook`;
    } else {
      webhookUrl = `${config.useHttps ? 'https' : 'http'}://${config.domain}/webhook`;
    }
    
    // List existing webhooks
    const webhooks = await vercelAPI.listWebhooks();
    
    // Check if a webhook for this URL already exists
    const existingWebhook = webhooks.find(hook => hook.url === webhookUrl);
    
    if (existingWebhook) {
      res.send(`Webhook already exists with ID: ${existingWebhook.id}`);
    } else {
      // Create a new webhook
      const webhook = await vercelAPI.createWebhook(projectName, webhookUrl);
      
      if (webhook) {
        res.send(`Webhook created successfully with ID: ${webhook.id}`);
      } else {
        res.status(500).send('Failed to create webhook');
      }
    }
  } catch (error) {
    logger.error(`Error in setup: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Report endpoint to view error reports
app.get('/reports/:deploymentId', (req, res) => {
  const deploymentId = req.params.deploymentId;
  const reportPath = path.join(config.errorLogDir, `error-report-${deploymentId}.md`);
  
  if (fs.existsSync(reportPath)) {
    const report = fs.readFileSync(reportPath, 'utf8');
    
    // Convert Markdown to HTML (very basic conversion)
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Deployment Error Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1, h2 { color: #333; }
          pre { background: #f7f7f7; padding: 10px; border-radius: 4px; overflow: auto; }
          code { background: #f1f1f1; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        </style>
      </head>
      <body>
        ${report
          .replace(/^# (.*)/gm, '<h1>$1</h1>')
          .replace(/^## (.*)/gm, '<h2>$1</h2>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/```([^`]+)```/gs, '<pre><code>$1</code></pre>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\n/g, '<br>')}
      </body>
      </html>
    `;
    
    res.send(html);
  } else {
    res.status(404).send('Error report not found');
  }
});

// Dashboard endpoint
app.get('/dashboard', (req, res) => {
  // Find all error reports
  const reports = [];
  if (fs.existsSync(config.errorLogDir)) {
    fs.readdirSync(config.errorLogDir).forEach(file => {
      if (file.startsWith('error-report-') && file.endsWith('.md')) {
        const deploymentId = file.replace('error-report-', '').replace('.md', '');
        const stats = fs.statSync(path.join(config.errorLogDir, file));
        reports.push({
          deploymentId,
          timestamp: stats.mtime,
          url: `/reports/${deploymentId}`
        });
      }
    });
  }
  
  // Sort by timestamp, most recent first
  reports.sort((a, b) => b.timestamp - a.timestamp);
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vercel Deployment Monitor</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 20px; max-width: 1200px; margin: 0 auto; }
        h1 { color: #333; }
        .card { border: 1px solid #ddd; border-radius: 4px; padding: 20px; margin-bottom: 20px; }
        .info { border-left: 5px solid #0070f3; }
        .error { border-left: 5px solid #ff0000; }
        pre { background: #f7f7f7; padding: 10px; border-radius: 4px; overflow: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        tr:hover { background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <h1>Vercel Deployment Monitor</h1>
      <div class="card info">
        <h2>Status: Active</h2>
        <p>Monitoring deployments for errors and providing automated analysis.</p>
        <p>Webhook URL: <code>${config.useHttps ? 'https' : 'http'}://${config.domain}/webhook</code></p>
      </div>
      
      <h2>Recent Error Reports</h2>
      ${reports.length > 0 ? `
        <table>
          <tr>
            <th>Deployment ID</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
          ${reports.map(report => `
            <tr>
              <td>${report.deploymentId}</td>
              <td>${report.timestamp.toLocaleString()}</td>
              <td><a href="${report.url}" target="_blank">View Report</a></td>
            </tr>
          `).join('')}
        </table>
      ` : '<p>No error reports found.</p>'}
      
      <h2>Setup Instructions</h2>
      <p>To set up a webhook for your Vercel project:</p>
      <pre>curl "${config.useHttps ? 'https' : 'http'}://${config.domain}/setup?project=YourProjectName"</pre>
      
      <p>To use a custom subdomain:</p>
      <pre>curl "${config.useHttps ? 'https' : 'http'}://${config.domain}/setup?project=YourProjectName&subdomain=yoursubdomain"</pre>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(config.port, () => {
  logger.success(`Vercel Deployment Monitor listening on port ${config.port}`);
  logger.info(`
===============================================
REMOTE DEPLOYMENT MONITOR
===============================================
  
Configuration:
- Domain: ${config.domain}
- HTTPS: ${config.useHttps ? 'Enabled' : 'Disabled'}
- Port: ${config.port}

Your webhook is available at:
${config.useHttps ? 'https' : 'http'}://${config.domain}/webhook

To configure a new project, use:
${config.useHttps ? 'https' : 'http'}://${config.domain}/setup?project=YourProjectName

Dashboard available at:
${config.useHttps ? 'https' : 'http'}://${config.domain}/dashboard

For proper functionality, set these environment variables:
- VERCEL_TOKEN: Your Vercel API token
- WEBHOOK_SECRET: Secret key for webhook signature verification
- VERCEL_TEAM_ID: (Optional) Your Vercel team ID if using team projects
- MONITOR_DOMAIN: Your deployment domain (default: ${config.domain})
- USE_HTTPS: 'true' to use HTTPS URLs, 'false' for HTTP
- SLACK_WEBHOOK_URL: Slack webhook URL for notifications

To override the default domain or use a subdomain, set MONITOR_DOMAIN 
environment variable or use the 'subdomain' query parameter when setting up:
${config.useHttps ? 'https' : 'http'}://${config.domain}/setup?project=YourProject&subdomain=custom
  `);
});

/**
 * DEPLOYMENT INSTRUCTIONS
 * 
 * This monitor can be deployed on various domains and platforms.
 * 
 * ENVIRONMENT VARIABLES:
 * - PORT: The port to listen on (default: 3000)
 * - VERCEL_TOKEN: Your Vercel API token (required)
 * - WEBHOOK_SECRET: Secret for verifying webhook signatures
 * - VERCEL_TEAM_ID: Your Vercel team ID (for team projects)
 * - MONITOR_DOMAIN: The domain where the monitor is deployed
 * - USE_HTTPS: Set to 'true' if your domain uses HTTPS
 * - SLACK_WEBHOOK_URL: Slack webhook URL for notifications
 * 
 * DEPLOYMENT OPTIONS:
 * 
 * 1. Local Development:
 *    - npm install express body-parser
 *    - export VERCEL_TOKEN=your_token
 *    - node monitor.js
 * 
 * 2. Heroku Deployment:
 *    - Create a new Heroku app
 *    - Set the required environment variables
 *    - Deploy the code to Heroku
 *    - Set MONITOR_DOMAIN to your-app.herokuapp.com
 * 
 * 3. Vercel Deployment (ironically):
 *    - Create a new Vercel project
 *    - Set the required environment variables
 *    - Deploy the code to Vercel
 *    - Set MONITOR_DOMAIN to your-app.vercel.app
 * 
 * 4. Custom Domain:
 *    - Deploy to any platform supporting Node.js
 *    - Configure your custom domain
 *    - Set MONITOR_DOMAIN to your-domain.com
 *    - Set USE_HTTPS to 'true' if you have SSL
 * 
 * SUBDOMAIN SUPPORT:
 * 
 * This monitor supports using subdomains for different projects:
 * - If MONITOR_DOMAIN is example.com, you can create webhooks at:
 *   - project1.example.com/webhook
 *   - project2.example.com/webhook
 * 
 * To use this feature, you need to:
 * 1. Configure DNS wildcard records for *.example.com
 * 2. Configure your web server to route all subdomains to this app
 * 3. Set MONITOR_DOMAIN to example.com
 * 4. When setting up webhooks, use the subdomain parameter:
 *    /setup?project=YourProject&subdomain=project1
 */