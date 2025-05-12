# Contributing to yml-change-webhook

Thank you for your interest in contributing to this project! Here's how you can help.

## Development Process

1. **Fork the repository** and clone it locally.
2. **Create a branch** for your changes:
   ```
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and test them thoroughly.
4. **Commit your changes** with clear, descriptive commit messages.
5. **Push your branch** to your fork.
6. **Submit a pull request** to the main repository.

## Setting up the Development Environment

1. Install dependencies:
   ```
   npm install
   ```

2. Run tests:
   ```
   npm test
   ```

3. Build the action:
   ```
   npm run build
   ```

## Testing

Please make sure all tests pass before submitting a pull request:

```
npm test
```

And add new tests for any new functionality you implement.

## Code Style

We use ESLint and Prettier to maintain code quality. Please make sure your code passes linting:

```
npm run lint
```

Format your code with:

```
npm run format
```

## Pull Request Guidelines

- Update the README.md with details of changes to the interface or functionality.
- Update documentation comments in the code when applicable.
- The pull request should work for all supported Node.js versions.
- Include test cases for your changes.

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
