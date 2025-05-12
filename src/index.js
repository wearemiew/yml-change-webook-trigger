const core = require('@actions/core');
const detectChanges = require('./detect-changes');
const parseYaml = require('./parse-yaml');
const executeWebhooks = require('./execute-webhooks');

async function run() {
  try {
    // Get the base reference for comparison
    const baseRef = core.getInput('base_ref');
    
    // Detect changed YML files
    const changedFiles = detectChanges(baseRef);
    core.info(`Detected ${changedFiles.length} changed YML file(s)`);
    
    // Set output for other actions to use
    core.setOutput('changed_files', JSON.stringify(changedFiles));
    
    if (changedFiles.length === 0) {
      core.info('No YML files changed. Exiting.');
      return;
    }
    
    // Extract webhooks from each changed file
    let allWebhooks = [];
    for (const file of changedFiles) {
      const webhooks = parseYaml.extractWebhooks(file);
      core.info(`Found ${webhooks.length} webhook(s) in ${file}`);
      allWebhooks = [...allWebhooks, ...webhooks];
    }
    
    if (allWebhooks.length === 0) {
      core.info('No webhooks found in changed YML files. Exiting.');
      return;
    }
    
    // Execute all webhooks
    core.info(`Executing ${allWebhooks.length} webhook(s)...`);
    const results = await executeWebhooks(allWebhooks);
    
    // Log the results
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    core.info(`Webhook execution complete: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      core.warning('Some webhooks failed to execute. Check the logs for details.');
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
