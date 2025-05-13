const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require('child_process');

async function run() {
  try {
    // Get the GitHub context
    const context = github.context;
    console.log('Starting version detection...');
    
    // Only run when PR is merged
    if (context.eventName === 'pull_request' && !context.payload.pull_request.merged) {
      console.log('Pull request was closed without merging - skipping version bump');
      core.setOutput('bump_type', 'none');
      return;
    }
    
    // Skip if [skip ci] is found in PR commits
    const baseSha = context.payload.pull_request.base.sha;
    const headSha = context.payload.pull_request.head.sha;
    
    console.log(`Checking for [skip ci] in commits from ${baseSha} to ${headSha}`);
    try {
      const skipCiCheck = execSync(`git log --pretty="%s" ${baseSha}..${headSha}`).toString();
      if (skipCiCheck.includes('[skip ci]')) {
        console.log('Skip CI flag found in PR commits, skipping version bump');
        core.setOutput('bump_type', 'none');
        return;
      }
    } catch (error) {
      console.log(`Error checking for skip CI: ${error.message}`);
    }
    
    console.log('No skip CI flags found, proceeding with version bump detection');
    
    // Get PR title and body
    const prTitle = context.payload.pull_request.title;
    const prBody = context.payload.pull_request.body || '';
    
    console.log(`PR title: ${prTitle}`);
    
    // Initialize variables for version bump detection
    let hasBreakingChange = false;
    let hasFeature = false;
    let hasFix = false;
    
    // Check PR title for breaking changes
    if (/^feat.*!:/.test(prTitle) || prTitle.includes('BREAKING CHANGE')) {
      console.log('PR title indicates breaking change');
      hasBreakingChange = true;
    }
    
    // Check PR body for breaking changes
    if (prBody.includes('BREAKING CHANGE')) {
      console.log('PR body indicates breaking change');
      hasBreakingChange = true;
    }
    
    // Get commits in the PR
    try {
      console.log(`Getting commits between ${baseSha} and ${headSha}`);
      const commitsOutput = execSync(`git log --pretty=format:"%s" ${baseSha}..${headSha}`).toString();
      const commits = commitsOutput.split('\n').filter(commit => commit.trim() !== '');
      
      console.log(`Found ${commits.length} commits:`);
      commits.forEach(commit => console.log(`- ${commit}`));
      
      // Check commit messages
      for (const commit of commits) {
        // Check for breaking changes
        if (/^[a-z]+.*!:/.test(commit) || commit.includes('BREAKING CHANGE')) {
          console.log(`Breaking change found in commit: ${commit}`);
          hasBreakingChange = true;
        }
        // Check for features
        else if (commit.startsWith('feat')) {
          console.log(`Feature commit found: ${commit}`);
          hasFeature = true;
        }
        // Check for fixes
        else if (commit.startsWith('fix') || commit.startsWith('perf')) {
          console.log(`Fix/perf commit found: ${commit}`);
          hasFix = true;
        }
      }
    } catch (error) {
      console.log(`Error processing commits: ${error.message}`);
    }
    
    // Determine bump type
    let bumpType = 'none';
    if (hasBreakingChange) {
      bumpType = 'major';
    } else if (hasFeature) {
      bumpType = 'minor';
    } else if (hasFix) {
      bumpType = 'patch';
    }
    
    console.log(`Determined bump type: ${bumpType}`);
    core.setOutput('bump_type', bumpType);
    
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`);
  }
}

run();
