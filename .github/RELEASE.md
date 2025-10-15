# Release Process

This repository uses [semantic-release](https://semantic-release.gitbook.io/) for automated versioning and publishing.

## How It Works

When code is merged to the `main` branch, semantic-release will:

1. **Analyze commits** since the last release using conventional commits
2. **Determine the version bump** (major, minor, or patch)
3. **Generate release notes** from commit messages
4. **Update version** in package.json (only in the published package)
5. **Publish to npm** with the new version
6. **Create a GitHub release** with release notes
7. **Create a git tag** to track the release

**Note:** Per [semantic-release best practices](https://semantic-release.gitbook.io/semantic-release/support/faq), the version in the repository's `package.json` remains as `0.0.0-development` to indicate it's managed by semantic-release. Only the published npm package contains the actual version number.

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[(optional scope)][!]: <description>

[optional body]

[optional footer(s)]
```

### Types and Version Bumps

- `feat:` - New feature → **MINOR** version bump (0.1.0 → 0.2.0)
- `fix:` - Bug fix → **PATCH** version bump (0.1.0 → 0.1.1)
- `perf:` - Performance improvement → **PATCH** version bump
- `docs:` - Documentation only → **No** version bump
- `style:` - Code style changes → **No** version bump
- `refactor:` - Code refactoring → **No** version bump
- `test:` - Test changes → **No** version bump
- `chore:` - Build/tooling changes → **No** version bump

### Breaking Changes

Add `!` after the type or include `BREAKING CHANGE:` in the footer:

```
feat!: remove displayModal method

BREAKING CHANGE: displayModal has been removed. Use displayPopup instead.
```

This triggers a **MAJOR** version bump (0.1.0 → 1.0.0).

## Examples

### Feature Addition
```
feat: add customizable popup dimensions

Allow users to specify custom width and height for payment popups.
```

### Bug Fix
```
fix: prevent memory leak in iframe cleanup

Properly remove event listeners when destroying embedded payments.
```

### Breaking Change
```
feat!: require explicit session credentials

BREAKING CHANGE: Payment sessions now require both accessToken and csrfToken to be explicitly provided. Previously, csrfToken was optional.
```

### Documentation
```
docs: add examples for embedded mode
```

## Branches

- `main` - Production releases
- `beta` - Pre-release versions (e.g., 1.0.0-beta.1)

## GitHub Actions Workflows

### Release Workflow (`.github/workflows/release.yml`)

Triggers on push to `main` or `beta` branches:
- Builds the package
- Runs type checking
- Executes semantic-release
- Publishes to npm
- Creates GitHub release

### CI Workflow (`.github/workflows/ci.yml`)

Triggers on pull requests and feature branches:
- Runs type checking
- Builds the package
- Ensures code quality before merge

## Setup Requirements

### NPM Token

For semantic-release to publish to npm, you need to set up an `NPM_TOKEN` secret:

1. Generate an npm token:
   - Go to [npmjs.com](https://www.npmjs.com/)
   - Click your profile → Access Tokens → Generate New Token
   - Select "Automation" type
   - Copy the token

2. Add to GitHub:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token
   - Click "Add secret"

### GitHub Token

The `GITHUB_TOKEN` is automatically provided by GitHub Actions - no setup needed.

## Manual Release (Not Recommended)

If you need to manually trigger a release:

```bash
# Make sure you're on the main branch
git checkout main
git pull origin main

# Run semantic-release locally
npx semantic-release --no-ci
```

## Troubleshooting

### No release published

If semantic-release doesn't create a release, check:
- Are you on the `main` or `beta` branch?
- Do you have commits since the last release?
- Do your commits follow conventional commit format?
- Do any commits trigger a version bump? (feat, fix, perf, or breaking changes)

### Release failed

Check the GitHub Actions logs:
- Repository → Actions → Failed workflow
- Look for npm authentication errors (check NPM_TOKEN)
- Look for permission errors (check GitHub permissions)

### How do I check the current version?

The version in the repository (`0.0.0-development`) is a placeholder. To check the actual published version:

```bash
# Check latest version
npm view @quentli/js version

# Check all available versions
npm view @quentli/js versions

# Check dist-tags
npm dist-tags ls @quentli/js
```

Or visit the [GitHub Releases page](https://github.com/quentli/quentli-js/releases)

## Best Practices

1. **Write clear commit messages** - They become your release notes
2. **Use conventional commits** - Required for automated versioning
3. **One logical change per commit** - Makes releases easier to understand
4. **Test before merging** - CI workflow ensures quality
5. **Check GitHub Releases** - All release notes are published there
6. **Don't manually edit version** - The `0.0.0-development` in package.json is intentional

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Semantic Release GitHub Actions](https://semantic-release.gitbook.io/semantic-release/recipes/ci-configurations/github-actions)

