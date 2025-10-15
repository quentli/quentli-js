# Semantic Release Setup Complete ✅

This document summarizes the semantic-release setup that has been added to the `@quentli/js` repository.

## What Was Installed

### Dependencies Added to `package.json`

```json
{
  "devDependencies": {
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/commit-analyzer": "^11.1.0",
    "@semantic-release/git": "^10.0.1",
    "@semantic-release/github": "^9.2.6",
    "@semantic-release/npm": "^11.0.2",
    "@semantic-release/release-notes-generator": "^12.1.0",
    "semantic-release": "^23.0.0"
  }
}
```

## Files Created

### 1. `.releaserc.json` - Semantic Release Configuration

Configures semantic-release to:
- Release from `main` branch (production)
- Support `beta` branch (pre-releases)
- Analyze commits using conventional commit format
- Generate release notes automatically
- Update CHANGELOG.md
- Publish to npm
- Create GitHub releases
- Commit version changes back to the repo

### 2. `.github/workflows/release.yml` - Release Workflow

GitHub Actions workflow that:
- Triggers on push to `main` or `beta` branches
- Installs dependencies with pnpm
- Builds the package
- Runs type checking
- Executes semantic-release to publish

**Required Secrets:**
- `NPM_TOKEN` - Must be added to GitHub repository secrets
- `GITHUB_TOKEN` - Automatically provided by GitHub

### 3. `.github/workflows/ci.yml` - Continuous Integration

GitHub Actions workflow that:
- Triggers on pull requests to `main` or `beta`
- Triggers on pushes to feature branches
- Runs type checking and builds
- Ensures code quality before merging

### 4. `.github/RELEASE.md` - Release Documentation

Comprehensive guide covering:
- How semantic-release works
- Commit message formats and conventions
- Version bump rules
- Setup requirements
- Troubleshooting guide

### 5. `.github/SETUP_CHECKLIST.md` - Setup Checklist

Step-by-step checklist to:
- Configure NPM token
- Verify GitHub permissions
- Test the setup
- Troubleshoot common issues

## Files Modified

### 1. `package.json`

Added semantic-release and plugin dependencies.

### 2. `CONTRIBUTING.md`

- Updated with detailed conventional commit guidelines
- Explained how commits affect version bumps
- Documented the automated release process
- Added examples of commit messages

### 3. `README.md`

- Added contributing section
- Referenced semantic-release and conventional commits
- Linked to CONTRIBUTING.md for guidelines

## How It Works

### Commit Message → Version Bump Mapping

| Commit Type | Example | Version Bump | From → To |
|-------------|---------|--------------|-----------|
| `feat:` | `feat: add new feature` | **MINOR** | 0.3.1 → 0.4.0 |
| `fix:` | `fix: resolve bug` | **PATCH** | 0.3.1 → 0.3.2 |
| `perf:` | `perf: improve speed` | **PATCH** | 0.3.1 → 0.3.2 |
| `feat!:` | `feat!: breaking change` | **MAJOR** | 0.3.1 → 1.0.0 |
| `docs:` | `docs: update readme` | **NONE** | 0.3.1 → 0.3.1 |
| `chore:` | `chore: update deps` | **NONE** | 0.3.1 → 0.3.1 |

### Automated Release Flow

```
Developer merges PR to main
         ↓
GitHub Actions detects push to main
         ↓
Release workflow starts
         ↓
1. Checkout code (full history)
2. Setup Node.js & pnpm
3. Install dependencies
4. Build package
5. Run type check
6. Execute semantic-release
         ↓
Semantic Release:
  - Analyzes commits since last release
  - Determines version bump
  - Generates release notes from commits
  - Updates version in package.json (for published package only)
  - Publishes to npm with correct version
  - Creates GitHub release with notes
  - Creates git tag for the release
         ↓
✅ Package published to npm
✅ GitHub release created with full notes
✅ Git tag created
```

**Important:** Following [semantic-release best practices](https://semantic-release.gitbook.io/semantic-release/support/faq), the version in the repository's `package.json` remains `0.0.0-development`. Only the published npm package contains the actual version number.

## Next Steps

### 1. Install Dependencies

```bash
cd /Users/arvindell/Projects/quentli/quentli-js
pnpm install
```

### 2. Commit and Push Changes

```bash
git add .
git commit -m "chore: add semantic-release configuration

- Add semantic-release and plugins
- Create GitHub Actions workflows for CI and releases
- Update documentation with conventional commit guidelines
- Add comprehensive release process documentation"
git push origin improved-payment-sessions
```

### 3. Configure GitHub Secrets

**Important:** Before merging to `main`, you must configure the NPM token:

1. Generate NPM token at https://www.npmjs.com/
   - Profile → Access Tokens → Generate New Token
   - Select "Automation" type

2. Add to GitHub repository:
   - Go to: https://github.com/quentli/quentli-js/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token

### 4. Test the Setup (Optional but Recommended)

Test semantic-release locally without publishing:

```bash
export NPM_TOKEN="your-npm-token"
export GITHUB_TOKEN="your-github-token"
npx semantic-release --dry-run
```

This shows what would happen without actually publishing.

### 5. Merge to Main

Once the NPM token is configured:

1. Create a PR from `improved-payment-sessions` to `main`
2. Ensure CI workflow passes
3. Merge the PR
4. The release workflow will automatically run and publish

### 6. Verify First Release

After merging to main, verify:

- ✅ GitHub Actions "Release" workflow completes successfully
- ✅ New version appears on npm: `npm view @quentli/js version`
- ✅ GitHub release is created in the "Releases" tab
- ✅ Git tag is created: `git fetch --tags && git tag -l`

**Note:** The `package.json` version in the repository will remain `0.0.0-development` - this is correct!

## Branch Strategy

### `main` Branch (Production)
- All commits trigger production releases
- Version format: `1.2.3`
- Published to npm with `latest` tag

### `beta` Branch (Pre-release)
- All commits trigger beta releases
- Version format: `1.2.3-beta.1`
- Published to npm with `beta` tag
- Install with: `npm install @quentli/js@beta`

## Commit Message Examples

### Feature Addition
```bash
git commit -m "feat: add support for custom iframe styling

Allows developers to pass custom CSS classes and inline styles
to embedded payment iframes for better integration."
```

### Bug Fix
```bash
git commit -m "fix: prevent memory leak on iframe cleanup

Properly remove all event listeners and clear message channels
when destroying embedded payment instances."
```

### Breaking Change
```bash
git commit -m "feat!: require explicit session credentials

BREAKING CHANGE: The displayPopup and displayEmbedded methods
now require both accessToken and csrfToken to be explicitly
provided in the session object. Previously, csrfToken was optional."
```

### Documentation Only
```bash
git commit -m "docs: add examples for all display modes

Added comprehensive code examples for popup, embedded,
and page redirect payment display modes."
```

## Troubleshooting

### Issue: Release doesn't trigger

**Cause:** No commits that trigger a version bump

**Solution:** Ensure commits use `feat:`, `fix:`, or `perf:` prefixes, or include breaking changes

### Issue: NPM publish fails with 403

**Cause:** Invalid or missing NPM token

**Solution:**
1. Verify NPM_TOKEN secret is set correctly in GitHub
2. Check token hasn't expired on npmjs.com
3. Ensure you have publish permissions for @quentli/js

### Issue: GitHub release fails

**Cause:** Insufficient GitHub permissions

**Solution:**
1. Go to Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"

## Support

For questions or issues with semantic-release:

- 📖 [Semantic Release Docs](https://semantic-release.gitbook.io/)
- 📖 [Conventional Commits](https://www.conventionalcommits.org/)
- 📄 See `.github/RELEASE.md` for detailed documentation
- 📄 See `.github/SETUP_CHECKLIST.md` for setup verification

## Summary

✅ **Automated Versioning** - Versions determined by commit messages
✅ **Automated Publishing** - Publishes to npm on merge to main
✅ **Automated Releases** - Creates GitHub releases with notes
✅ **Simplified Changelog** - Links to GitHub Releases (no file commits)
✅ **CI/CD Pipeline** - PR checks and release automation
✅ **Pre-release Support** - Beta releases from beta branch
✅ **Best Practices** - Follows semantic-release recommendations
✅ **Comprehensive Documentation** - Complete guides and examples

**Repository Version:** `0.0.0-development` (placeholder, per semantic-release best practices)
**Published Version:** Check with `npm view @quentli/js version`

---

## Why `0.0.0-development`?

Per [semantic-release FAQ](https://semantic-release.gitbook.io/semantic-release/support/faq), committing version updates back to the repository adds unnecessary complexity:

- Branch protection complications
- Pre-commit hook conflicts  
- Potential version sync issues

Instead, semantic-release:
- Tracks versions via git tags
- Updates version only in the published npm package
- Uses `0.0.0-development` in the repo to indicate semantic-release management

**To check the actual version:**
```bash
npm view @quentli/js version
```

Or visit the [Releases page](https://github.com/quentli/quentli-js/releases).

