<img class="logo" src="https://github.com/wearemiew/.github/raw/main/static/miew-banner.png" alt="Miew Banner"/>

# yml-change-webhook

A GitHub Action that detects changes in YML files and triggers webhooks in response to those changes.

## Overview

The `yml-change-webhook` GitHub Action automates the process of monitoring YML file changes within your repository and executing webhooks based on those changes. This action is perfect for scenarios where external systems need to be notified or updated whenever configuration files are modified.

## Features

- **Intelligent Change Detection**: Accurately identifies which YML files have been modified in both `push` and `pull_request` events
- **Webhook Automation**: Extracts webhook URLs from YML files and triggers them automatically
- **Detailed Reporting**: Generates a summary report of triggered webhooks and their execution status
- **Flexible Configuration**: Works with customizable options to fit your specific workflow requirements
- **Seamless Integration**: Easily incorporate into any GitHub workflow that relies on YML configuration

## Usage

Add this action to your GitHub workflow file:

```yaml
name: YML Change Notification
on:
  push:
    paths:
      - "**.yml"
      - "**.yaml"
  pull_request:
    paths:
      - "**.yml"
      - "**.yaml"

jobs:
  notify-changes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Detect YML Changes & Trigger Webhooks
        uses: wearemiew/yml-change-webhook-trigger@v1
        with:
          # Optional: Specify base reference for comparison (useful in PR scenarios)
          base_ref: ${{ github.event.pull_request.base.ref }}
```

> **Note**: You can use any of the following tag references:
> - `@v1` - Always points to the latest v1.x.x release
> - `@v1.0` - Always points to the latest v1.0.x release
> - `@v1.0.1` - Points to the specific v1.0.1 release

## Inputs

| Input      | Description                          | Required | Default |
| ---------- | ------------------------------------ | -------- | ------- |
| `base_ref` | Base reference for comparing changes | No       | ''      |

## Outputs

| Output            | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `changed_files`   | JSON array of YML files that changed                      |
| `webhook_results` | JSON array of webhook execution results with file mappings |

## YML File Structure

The action expects webhook URLs to be defined in your YML files using a specific structure:

```yaml
# Example config.yml
service: myService
config:
  timeout: 30
  retries: 3

# Webhook definitions
x-update-webhooks:
  - https://api.example.com/notify
  - https://webhook.site/your-unique-id
```

When this YML file changes, the action will automatically trigger all webhooks listed in the `x-update-webhooks` array.

## Webhook Execution Report

The action automatically generates a detailed report of webhook executions directly in the GitHub Actions workflow summary. This report includes:

- A summary of files that triggered webhooks
- A detailed list of all webhook executions with their status and duration

This report helps you quickly identify which files triggered which webhooks and whether those webhook calls were successful.

Example report:

```markdown
# Webhook Trigger Summary

For a detailed look at webhook triggers during this workflow run. Total changed files: 2

## Files Changed

| File | Webhook Count |
| ---- | ------------- |
| config/api.yml | 1 |
| settings/notifications.yml | 2 |

## Webhook Executions

| File | Webhook | Status | Duration |
| ---- | ------- | ------ | -------- |
| config/api.yml | https://example.com/webhook1 | ✅ success | 340ms |
| settings/notifications.yml | https://example.com/webhook2 | ✅ success | 220ms |
| settings/notifications.yml | https://example.com/webhook3 | ❌ failed | - |
```

## Use Cases

- **Automated Configuration Updates**: Update services when their configuration changes
- **CI/CD Pipeline Integration**: Trigger downstream processes based on build config modifications
- **Documentation Synchronization**: Keep documentation in sync with YML changes
- **Infrastructure as Code**: Notify infrastructure management tools of changes to definitions

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/wearemiew/yml-change-webhook-trigger.git
cd yml-change-webhook-trigger

# Install dependencies
npm install
```

### Testing

```bash
npm test
```

### Release Process

This project uses automated GitHub Actions workflows for releases:

1. When code is pushed to the `main` branch, the `auto-release.yml` workflow:
   - Builds the action (generating the `dist` folder)
   - Creates a new release if the version in `package.json` has been updated
   - Updates the major version tag (e.g., `v1`) and the major.minor version tag (e.g., `v1.0`) to point to the latest release

2. When a release is created, the `publish.yml` workflow:
   - Runs tests and builds the action
   - Commits the `dist` directory to the repository
   - Updates the major version tag (e.g., `v1`) and the major.minor version tag (e.g., `v1.0`)

To manually trigger a new release:

```bash
# Update the version in package.json
npm version patch  # or minor or major

# Push changes to main
git push

# The auto-release workflow will handle the rest
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
