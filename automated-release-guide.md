# Automated Release Guide

This document explains how to use the automated release workflow for the `yml-change-webhook` GitHub Action.

## How It Works

The project is set up with an automated release system that:

1. Builds and tests the action whenever code is pushed to the `main` branch
2. Automatically creates a new GitHub release based on the version in `package.json`
3. Updates the major version tag (e.g., `v1`) to point to the latest release

## Development Workflow

### For Regular Development

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, write tests, etc.

3. Run tests locally to ensure everything works:
   ```bash
   npm test
   ```

4. Build the action locally for testing:
   ```bash
   npm run build
   ```

5. Commit and push your changes to the feature branch:
   ```bash
   git add .
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```

6. Create a pull request to merge your changes into `main`

### When Ready to Release

When your changes are ready to be released, follow these steps:

1. Checkout the `main` branch (or use your feature branch if it's not yet merged):
   ```bash
   git checkout main
   git pull
   ```

2. Update the version in `package.json` using one of the version scripts:
   
   For bug fixes:
   ```bash
   npm run version:patch
   ```
   
   For new features:
   ```bash
   npm run version:minor
   ```
   
   For breaking changes:
   ```bash
   npm run version:major
   ```

3. Use the release script to build, commit, and push in one step:
   ```bash
   npm run release
   ```

4. The automated workflow will:
   - Detect the version change in `package.json`
   - Build the action
   - Create a new GitHub release with the version number
   - Update the major version tag

## Manual Publishing to GitHub Marketplace

Currently, publishing to the GitHub Marketplace requires manual intervention:

1. After the automated release is created, go to your repository's releases page
2. Find the latest release
3. Click "Edit release"
4. Check "Publish this Action to the GitHub Marketplace"
5. Fill in the additional marketplace information
6. Save the changes

## Checking Release Status

You can check the status of the automatic release process:

1. Go to the "Actions" tab in your repository
2. Look for the most recent "Automated Build and Release" workflow run
3. Verify that all steps completed successfully

## Troubleshooting

### Release not created automatically

If a release is not created automatically after pushing to `main`:

1. Check if the version in `package.json` was updated
   - The workflow only creates a new release if the version is new
   - If the version already exists as a tag, no release will be created

2. Check the workflow logs in the Actions tab
   - Look for any errors or failures in the steps

3. Verify that changes were made to files that trigger the workflow
   - The workflow ignores changes to markdown files and other non-code files

### Release created but not published to Marketplace

If a release is created but not showing in the Marketplace:

1. Check if you completed the manual steps to publish to the Marketplace
2. Verify that your action meets all GitHub Marketplace requirements
3. Allow some time for the Marketplace listing to propagate

## Future Improvements

In the future, we can explore:

1. Fully automating the Marketplace publication using GitHub's REST API
2. Adding release notes generation with changelog from commits
3. Implementing automated version bumping based on commit messages
