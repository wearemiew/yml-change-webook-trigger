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

    // Extract webhooks from each changed file with file information
    let allWebhooks = [];
    for (const file of changedFiles) {
      const webhookUrls = parseYaml.extractWebhooks(file);
      core.info(`Found ${webhookUrls.length} webhook(s) in ${file}`);

      // Map each webhook URL to an object with file information
      const webhooks = webhookUrls.map(url => ({
        url,
        file
      }));

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

    // Set webhook results as output
    core.setOutput('webhook_results', JSON.stringify(results));

    if (failed > 0) {
      core.warning('Some webhooks failed to execute. Check the logs for details.');
    }

    // Generate GitHub Step Summary report
    await generateSummaryReport(results, changedFiles);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

/**
 * Generates a summary report for the webhook executions
 * 
 * @param {Array} results - Webhook execution results
 * @param {Array} changedFiles - Files that triggered webhooks
 */
async function generateSummaryReport(results, changedFiles) {
  try {
    const fs = require('fs');
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;

    if (!summaryFile) {
      core.debug('GITHUB_STEP_SUMMARY environment variable not set. Skipping summary generation.');
      return;
    }

    let summaryContent = [];

    // Add header
    summaryContent.push('# Webhook Trigger Summary');
    summaryContent.push('');
    summaryContent.push(`For a detailed look at webhook triggers during this workflow run. Total changed files: ${changedFiles.length}`);
    summaryContent.push('');

    // Add file summary table
    summaryContent.push('## Files Changed');
    summaryContent.push('');
    summaryContent.push('| File | Webhook Count |');
    summaryContent.push('| ---- | ------------- |');

    // Group webhooks by file
    const fileWebhookCount = {};
    for (const result of results) {
      if (!fileWebhookCount[result.file]) {
        fileWebhookCount[result.file] = 0;
      }
      fileWebhookCount[result.file]++;
    }

    for (const file in fileWebhookCount) {
      summaryContent.push(`| ${file} | ${fileWebhookCount[file]} |`);
    }

    summaryContent.push('');

    // Add webhook execution table
    summaryContent.push('## Webhook Executions');
    summaryContent.push('');
    summaryContent.push('| File | Webhook | Status | Duration |');
    summaryContent.push('| ---- | ------- | ------ | -------- |');

    for (const result of results) {
      const status = result.success ? '✅ success' : '❌ failed';
      const duration = result.duration ? result.duration : '-';

      summaryContent.push(`| ${result.file} | ${result.url} | ${status} | ${duration} |`);
    }

    // Write to the summary file
    fs.appendFileSync(summaryFile, summaryContent.join('\n') + '\n');

    core.info('Webhook execution summary generated successfully.');
  } catch (error) {
    core.warning(`Failed to generate summary report: ${error.message}`);
  }
}


run();
