# Publishing Guide for yml-change-webhook

This document provides step-by-step instructions for publishing the `yml-change-webhook` GitHub Action to the GitHub Marketplace.

## Prerequisites

Before publishing, ensure that:

1. The action is fully implemented and working correctly
2. All tests are passing
3. Documentation is complete and accurate
4. You have appropriate permissions to publish to the GitHub Marketplace

## Preparing for Publication

### 1. Check Repository Requirements

- [ ] Repository name is clear and indicates the action's functionality (`yml-change-webhook`)
- [ ] Repository description is concise and accurately describes the action
- [ ] Repository has appropriate topics set (e.g., `github-action`, `workflow`, `yml`, `webhook`)
- [ ] README.md includes comprehensive documentation
- [ ] LICENSE file exists (MIT license recommended)
- [ ] Code of Conduct and Contributing guidelines are in place

### 2. Ensure Action Metadata is Complete

The `action.yml` file should include:

- [ ] Clear name and description
- [ ] All input parameters with descriptions and default values
- [ ] All output parameters with descriptions
- [ ] Branding information (icon and color)
- [ ] Correct runtime specification

### 3. Verify the Build Process

- [ ] The action can be built successfully using `npm run build`
- [ ] The `dist/` directory contains the compiled code
- [ ] The compiled code works as expected when used as an action

## Publishing Process

### 1. Create a Release

1. Go to your repository on GitHub
2. Click on "Releases" in the right sidebar
3. Click "Create a new release"
4. Enter a tag version following semantic versioning (e.g., `v1.0.0`)
5. Enter a release title (e.g., "Initial Release")
6. Provide a detailed description of the release, including:
   - Features included
   - Bug fixes
   - Any breaking changes
   - Usage examples
7. **Important**: Check the box "Publish this Action to the GitHub Marketplace"
8. Complete the additional marketplace information:
   - Primary category (recommend: "Continuous integration" or "Automation")
   - Verify screenshot URLs (optional)
   - Verify that the README content looks correct in the preview
9. Click "Publish release"

### 2. Update Major Version Tag

After publishing a release, it's important to update the major version tag (e.g., `v1`) to point to the latest release within that major version. This enables users to reference your action using the major version tag (e.g., `uses: wearemiew/yml-change-webhook@v1`).

The workflow file `.github/workflows/publish.yml` handles this automatically when you create a release.

### 3. Verify Marketplace Listing

After publishing:

1. Go to the GitHub Marketplace
2. Search for your action ("yml-change-webhook")
3. Verify that the listing appears correctly
4. Check that all documentation and metadata are displayed properly

## Post-Publication Maintenance

### Releasing Updates

To release updates to your action:

1. Make and test your changes
2. Update the version in `package.json`
3. Create a new GitHub release with an appropriate semantic version (e.g., `v1.1.0` for new features, `v1.0.1` for bug fixes)
4. The publish workflow will automatically update the major version tag

### Versioning Guidelines

Follow semantic versioning principles:

- **Major version** (`v1.0.0` → `v2.0.0`): Breaking changes
- **Minor version** (`v1.0.0` → `v1.1.0`): New features, backwards compatible
- **Patch version** (`v1.0.0` → `v1.0.1`): Bug fixes, backwards compatible

### Usage Analytics

Monitor the usage of your action through:

- GitHub repository insights
- Marketplace insights (if provided by GitHub)
- GitHub Stars and Forks
- Issues and discussions

## Troubleshooting

### Release Failed to Publish

If your release doesn't appear in the marketplace:

1. Verify that you checked "Publish this Action to the GitHub Marketplace"
2. Ensure your repository is public
3. Check that the action.yml file is valid
4. Verify that all required fields are completed in the release form

### Action Not Working for Users

If users report issues with your action:

1. Check if they're using the correct version reference
2. Verify the action works in your own testing environment
3. Consider creating a demo repository that demonstrates the action working correctly

## Resources

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Publishing actions to GitHub Marketplace](https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace)
- [GitHub Marketplace documentation](https://docs.github.com/en/developers/github-marketplace)
