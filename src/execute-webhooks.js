const axios = require('axios');
const core = require('@actions/core');

/**
 * Execute webhooks with POST requests
 * 
 * @param {Array<{url: string, file: string}>} webhooks - Array of webhook objects with URLs and source files
 * @returns {Promise<Array>} Array of execution results
 */
async function executeWebhooks(webhooks) {
  const results = [];
  // Create unique webhooks while preserving file origin
  const uniqueWebhooks = [];
  const seenUrls = new Set();

  for (const webhook of webhooks) {
    if (!seenUrls.has(webhook.url)) {
      seenUrls.add(webhook.url);
      uniqueWebhooks.push(webhook);
    }
  }

  core.debug(`Preparing to execute ${uniqueWebhooks.length} unique webhook(s)`);

  for (const webhook of uniqueWebhooks) {
    const url = webhook.url;
    const file = webhook.file;
    try {
      core.info(`Executing webhook: ${maskUrl(url)}`);

      const response = await axios.post(url, {
        source: 'yml-change-webhook',
        timestamp: new Date().toISOString()
      });

      const executionTime = response.headers['x-response-time'] || 'unknown';

      results.push({
        url: maskUrl(url),
        file: file,
        success: true,
        status: response.status,
        duration: executionTime,
        timestamp: new Date().toISOString()
      });

      core.info(`Webhook executed successfully: ${maskUrl(url)} (Status: ${response.status})`);
    } catch (error) {
      const errorMessage = error.response
        ? `Status: ${error.response.status}, Message: ${error.response.statusText}`
        : error.message;

      results.push({
        url: maskUrl(url),
        file: file,
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });

      core.warning(`Webhook execution failed: ${maskUrl(url)} - ${errorMessage}`);
    }
  }

  return results;
}

/**
 * Masks part of the URL for security when logging.
 * 
 * @param {string} url - The webhook URL
 * @returns {string} Masked URL
 */
function maskUrl(url) {
  try {
    const urlObj = new URL(url);
    const host = urlObj.host;
    const path = urlObj.pathname.length > 10
      ? urlObj.pathname.substring(0, 4) + '...' + urlObj.pathname.substring(urlObj.pathname.length - 4)
      : urlObj.pathname;

    return `${urlObj.protocol}//${host}${path}`;
  } catch (e) {
    // If URL parsing fails, return a generic masked version
    return url.substring(0, 10) + '...' + url.substring(url.length - 5);
  }
}


module.exports = executeWebhooks;
