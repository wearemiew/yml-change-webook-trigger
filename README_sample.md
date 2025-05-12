<img class="logo" src="https://github.com/wearemiew/.github/raw/main/static/miew-banner.png" alt="Miew Banner"/>

# Miewtify

An opinionated monorepo of ESLint configurations for frontend development.

## Packages

This monorepo uses npm workspaces to manage the following package:

- `@miew/eslint-miewtify`: A shareable ESLint configuration optimized for React and TypeScript projects.

## Installation

Install the package in your project:

```bash
npm install --save-dev @miew/eslint-miewtify
```

## Usage

Create an `.eslintrc.js` (or `.eslintrc.json`) in your project root and extend the config:

```js
// .eslintrc.js
export default {
  extends: ["@miew/eslint-miewtify"],
};
```

## Installing Peer Dependencies

After installing the package you'll need to install the peer dependencies to work with this linter

```
npx install-peerdeps --dev @miew/eslint-miewtify

```

## Scripts

In this repository, you can run:

```bash
npm run publish-eslint-config
```

to publish the ESLint config package to npm.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
