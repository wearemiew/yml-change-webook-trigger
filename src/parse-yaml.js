const fs = require('fs');
const yaml = require('js-yaml');
const core = require('@actions/core');

/**
 * Extracts webhook URLs from a YML file
 * 
 * @param {string} filePath - Path to the YML file
 * @returns {string[]} Array of webhook URLs
 */
function extractWebhooks(filePath) {
  try {
    core.debug(`Parsing YML file: ${filePath}`);
    
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse YML content
    const parsed = yaml.load(content);
    
    if (!parsed) {
      core.debug(`File ${filePath} is empty or invalid YML`);
      return [];
    }
    
    // Extract webhooks from x-update-webhooks array
    if (parsed['x-update-webhooks'] && Array.isArray(parsed['x-update-webhooks'])) {
      const webhooks = parsed['x-update-webhooks']
        .filter(url => typeof url === 'string' && url.startsWith('http'));
      
      core.debug(`Found ${webhooks.length} webhook(s) in ${filePath}`);
      return webhooks;
    }
    
    core.debug(`No webhooks found in ${filePath}`);
    return [];
  } catch (error) {
    core.warning(`Error parsing ${filePath}: ${error.message}`);
    return [];
  }
}

module.exports = {
  extractWebhooks
};
