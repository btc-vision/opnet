# Contributing Guidelines

Thank you for considering contributing to OPNet! Please take a moment to review the following guidelines before submitting your contribution.

## Security

**DO NOT** open public issues for security vulnerabilities. Report them privately via [GitHub Security Advisories](https://github.com/btc-vision/opnet/security/advisories/new).

See [SECURITY.md](./SECURITY.md) for our full security policy.

## Pull Requests

When submitting a pull request, please use our [pull request template](./.github/PULL_REQUEST_TEMPLATE.md) and follow these guidelines:

### Before You Begin

1. **Fork the repository**: If you haven't already, fork the repository to your GitHub account.

2. **Create a new branch**: Create a new branch for your feature or bug fix. This helps keep the main branch clean and makes it easier to review your changes.

3. **Ensure your code is up-to-date**: Before starting work, make sure your forked repository is up-to-date with the latest changes from the main repository.

### Making Changes

1. **Follow coding conventions**: Make sure your code follows the existing coding style and conventions used in the project.

2. **Write descriptive commit messages**: Write clear and descriptive commit messages that explain the purpose of your changes.

3. **Test your changes**: Before submitting your pull request, make sure to test your changes thoroughly:
   ```bash
   npm install
   npm test
   npm run build
   ```

### Submitting the Pull Request

1. **Create a descriptive title**: Use a clear and descriptive title for your pull request that summarizes the purpose of your changes.

2. **Complete the PR template**: Fill out all sections of the pull request template, including the type of change and checklist items.

3. **Link related issues**: If your pull request addresses a specific issue, make sure to reference it in the description using GitHub's issue linking syntax (`Fixes #123` or `Relates to #456`).

4. **Review and address feedback**: Be responsive to any feedback or comments you receive on your pull request and make any necessary changes.

## Issues

When submitting an issue, please use the appropriate template:

- **Bug reports**: Use the [bug report template](https://github.com/btc-vision/opnet/issues/new?template=bug_report.yml)
- **Feature requests**: Use the [feature request template](https://github.com/btc-vision/opnet/issues/new?template=feature_request.md)

### Guidelines for Issues

1. **Use a descriptive title**: Use a clear and descriptive title that summarizes the issue you're experiencing.

2. **Provide detailed steps to reproduce**: Include detailed steps to reproduce the issue, including any relevant code or configuration.

3. **Include relevant information**: Provide any relevant information such as error messages, screenshots, or logs that can help diagnose the problem.

4. **Specify your environment**: Include your Node.js version and opnet version in bug reports.

5. **Check for existing issues**: Before submitting a new issue, please check if a similar issue has already been reported to avoid duplicates.

## Development Setup

```bash
git clone https://github.com/btc-vision/opnet.git
cd opnet
npm install
npm run build
```

## License

By contributing, you agree that your contributions will be licensed under the project's [Apache-2.0](./LICENSE) license.

Thank you for your contributions!
