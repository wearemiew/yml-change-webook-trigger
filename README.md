<img class="logo" src="https://github.com/wearemiew/.github/raw/main/static/miew-banner.png" alt="Miew Banner"/>

# yml-change-webhook

A GitHub Action that detects changes in YML files and triggers webhooks in response to those changes.

## Overview

The `yml-change-webhook` GitHub Action automates the process of monitoring YML file changes within your repository and executing webhooks based on those changes. This action is perfect for scenarios where external systems need to be notified or updated whenever configuration files are modified.

## Features

- **Intelligent Change Detection**: Accurately identifies which YML files have been modified in both `push` and `pull_request` events
- **Webhook Automation**: Extracts webhook URLs from YML files and triggers them automatically
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
        uses: wearemiew/yml-change-webhook@v1
        with:
          # Optional: Specify base reference for comparison (useful in PR scenarios)
          base_ref: ${{ github.event.pull_request.base.ref }}
```

## Inputs

| Input      | Description                          | Required | Default |
| ---------- | ------------------------------------ | -------- | ------- |
| `base_ref` | Base reference for comparing changes | No       | ''      |

## Outputs

| Output          | Description                          |
| --------------- | ------------------------------------ |
| `changed_files` | JSON array of YML files that changed |

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
git clone https://github.com/wearemiew/yml-change-webhook.git
cd yml-change-webhook

# Install dependencies
npm install
```

### Testing

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
