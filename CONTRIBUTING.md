# Contributing to @quentli/js

Thank you for your interest in contributing to @quentli/js! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/quentli-js.git
   cd quentli-js
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Building

Build the package:
```bash
npm run build
```

Watch mode for development:
```bash
npm run dev
```

### Type Checking

Run TypeScript type checking:
```bash
npm run typecheck
```

### Testing Your Changes

1. Build the package: `npm run build`
2. Open `example.html` in a browser to test manually
3. For integration testing, link the package locally:
   ```bash
   npm link
   # In your test project
   npm link @quentli/js
   ```

## Code Style

- Use TypeScript for all source files
- Follow existing code style and conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) with [semantic-release](https://semantic-release.gitbook.io/) for automated versioning and publishing.

**Your commit messages determine the version bump:**

- `feat:` - New features (triggers MINOR version bump: 0.1.0 → 0.2.0)
- `fix:` - Bug fixes (triggers PATCH version bump: 0.1.0 → 0.1.1)
- `docs:` - Documentation changes (no version bump)
- `refactor:` - Code refactoring (no version bump)
- `test:` - Adding or updating tests (no version bump)
- `chore:` - Maintenance tasks (no version bump)
- `perf:` - Performance improvements (triggers PATCH version bump)

**Breaking changes** (triggers MAJOR version bump: 0.1.0 → 1.0.0):
```
feat!: remove deprecated displayModal method

BREAKING CHANGE: displayModal has been removed, use displayPopup instead
```

Examples:
```
feat: add support for custom iframe styling
fix: handle popup blocked by browser
docs: update README with new examples
perf: optimize message channel cleanup
```

**Important:** Versioning is automatically managed by semantic-release. Do not manually update the version in `package.json` - it intentionally stays at `0.0.0-development` to indicate it's managed by semantic-release. See the [semantic-release FAQ](https://semantic-release.gitbook.io/semantic-release/support/faq) for details.

## Pull Request Process

1. **Update documentation** if you're adding/changing APIs
2. **Use conventional commit messages** (see above)
3. **Ensure all checks pass**:
   - TypeScript compiles without errors
   - Build succeeds
4. **Write a clear PR description** explaining:
   - What problem does this solve?
   - How does it solve it?
   - Any breaking changes?
5. **Wait for review** from maintainers

Once your PR is merged to `main`, semantic-release will automatically:
- Analyze your commits to determine the version bump
- Generate release notes
- Publish to npm with the new version
- Create a GitHub release with detailed notes
- Create a git tag for the release

All release notes are published on the [GitHub Releases page](https://github.com/quentli/quentli-js/releases).

## Feature Requests

Have an idea for a new feature? We'd love to hear it!

1. Check if it's already been requested in [Issues](https://github.com/quentli/quentli-js/issues)
2. If not, create a new issue with the `enhancement` label
3. Describe:
   - The problem you're trying to solve
   - Your proposed solution
   - Any alternatives you've considered

## Bug Reports

Found a bug? Please report it!

1. Check if it's already reported in [Issues](https://github.com/quentli/quentli-js/issues)
2. If not, create a new issue with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/environment details
   - Code samples if applicable

## Questions?

- 📚 Check the [Documentation](https://docs.quentli.com)
- 💬 Join our [Discord Community](https://discord.gg/quentli)
- ✉️ Email us at [soporte@quentli.com](mailto:soporte@quentli.com)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to @quentli/js! 🎉

