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

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for custom iframe styling
fix: handle popup blocked by browser
docs: update README with new examples
```

## Pull Request Process

1. **Update documentation** if you're adding/changing APIs
2. **Update CHANGELOG.md** with your changes
3. **Ensure all checks pass**:
   - TypeScript compiles without errors
   - Build succeeds
4. **Write a clear PR description** explaining:
   - What problem does this solve?
   - How does it solve it?
   - Any breaking changes?
5. **Wait for review** from maintainers

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

