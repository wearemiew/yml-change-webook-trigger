const { execSync } = require('child_process');
const core = require('@actions/core');

/**
 * Detects YML files that have been changed in the current push or pull request
 * 
 * @param {string} baseRef - Base reference for comparison (optional)
 * @returns {string[]} Array of changed YML file paths
 */

function detectChanges(baseRef) {
  try {
    let command;
    // If the event is a pull request, use the base reference
    if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
      const base = baseRef || process.env.GITHUB_BASE_REF;
      core.info(`Using base reference: ${base || 'default'}`);
      command = `git diff --name-only origin/${base || 'main'}...HEAD`;
    } else {
      // For push events, compare with the previous commit
      // Check if there's more than one commit in the repository
      try {
        // Try to get the parent commit to see if it exists
        execSync('git rev-parse HEAD^', { stdio: 'pipe' });
        command = 'git diff --name-only HEAD^';
      } catch (e) {
        // If HEAD^ doesn't exist (only one commit), list all files in the repo
        core.info('Repository has only one commit. Listing all YML files instead of diff.');
        command = 'git ls-files';
      }
    }

    core.debug(`Executing command: ${command}`);

    const output = execSync(command).toString().trim();

    if (!output) {
      return [];
    }

    // Filter to only include YML/YAML files
    const changedFiles = output
      .split('\n')
      .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));

    core.debug(`Changed YML files: ${JSON.stringify(changedFiles)}`);

    return changedFiles;
  } catch (error) {
    core.warning(`Error detecting changes: ${error.message}`);
    return [];
  }
}

module.exports = detectChanges;
