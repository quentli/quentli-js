# Semantic Release Setup Checklist

This checklist ensures that semantic-release is properly configured for automated publishing.

## ✅ Repository Setup

- [ ] **Install dependencies**
  ```bash
  cd /Users/arvindell/Projects/quentli/quentli-js
  pnpm install
  ```

- [ ] **Commit the changes**
  ```bash
  git add .
  git commit -m "chore: add semantic-release configuration"
  git push origin improved-payment-sessions
  ```

## ✅ GitHub Configuration

### 1. NPM Token Setup

- [ ] Go to [npmjs.com](https://www.npmjs.com/)
- [ ] Click your profile icon → **Access Tokens**
- [ ] Click **Generate New Token** → Select **Automation**
- [ ] Copy the generated token

### 2. Add NPM Token to GitHub

- [ ] Go to repository: `https://github.com/quentli/quentli-js`
- [ ] Navigate to **Settings** → **Secrets and variables** → **Actions**
- [ ] Click **New repository secret**
- [ ] Name: `NPM_TOKEN`
- [ ] Value: Paste the npm token from step 1
- [ ] Click **Add secret**

### 3. Verify GitHub Token Permissions

The `GITHUB_TOKEN` is automatically provided, but verify the workflow has correct permissions:

- [ ] Go to **Settings** → **Actions** → **General**
- [ ] Under **Workflow permissions**, ensure **Read and write permissions** is selected
- [ ] Check **Allow GitHub Actions to create and approve pull requests**
- [ ] Click **Save**

### 4. Branch Protection (Optional but Recommended)

- [ ] Go to **Settings** → **Branches**
- [ ] Click **Add branch protection rule**
- [ ] Branch name pattern: `main`
- [ ] Enable:
  - [ ] Require a pull request before merging
  - [ ] Require status checks to pass before merging
  - [ ] Require conversation resolution before merging
- [ ] Click **Create**

## ✅ NPM Package Configuration

- [ ] Verify you have publish access to `@quentli/js` on npm
- [ ] Ensure the package is public (or you have a Pro account for private packages)

To check:
```bash
npm whoami
npm access ls-packages
```

## ✅ Testing the Setup

### Test 1: CI Workflow (Pull Request)

1. Create a test branch:
   ```bash
   git checkout -b test/ci-workflow
   echo "// test" >> src/index.ts
   git add .
   git commit -m "test: verify CI workflow"
   git push origin test/ci-workflow
   ```

2. Create a pull request to `main`
3. Verify CI workflow runs and passes
4. Delete the test branch after verification

### Test 2: Release Workflow (Dry Run)

Before merging to main, test locally:

```bash
# Set a test npm token temporarily
export NPM_TOKEN="your-npm-token"
export GITHUB_TOKEN="your-github-token"

# Run semantic-release in dry-run mode
npx semantic-release --dry-run
```

This will show you what would happen without actually publishing.

### Test 3: First Automated Release

1. Merge a PR with a conventional commit to `main`:
   ```bash
   git checkout main
   git pull origin main
   # The merge will trigger the release workflow
   ```

2. Check GitHub Actions:
   - Go to **Actions** tab
   - Verify **Release** workflow runs
   - Check logs for any errors

3. Verify the release:
   - [ ] New version published to npm: `npm view @quentli/js version`
   - [ ] GitHub release created: Check **Releases** tab
   - [ ] Git tag created: `git fetch --tags && git tag -l`
   - [ ] Release notes visible in GitHub Releases

**Note:** The version in the repository's `package.json` will remain `0.0.0-development`. This is intentional per [semantic-release best practices](https://semantic-release.gitbook.io/semantic-release/support/faq).

## ✅ Files Created/Modified

The following files were created or modified:

### Created Files
- `.github/workflows/release.yml` - Release workflow
- `.github/workflows/ci.yml` - CI workflow for PRs
- `.github/RELEASE.md` - Release process documentation
- `.github/SETUP_CHECKLIST.md` - This file
- `.releaserc.json` - Semantic-release configuration

### Modified Files
- `package.json` - Added semantic-release dependencies, version set to `0.0.0-development`
- `CONTRIBUTING.md` - Updated with conventional commit guidelines
- `README.md` - Added contributing section
- `CHANGELOG.md` - Simplified to link to GitHub Releases

## ✅ Commit Message Guidelines

Remind your team to use conventional commits:

**Version Bump Commits:**
- `feat:` → Minor version bump (0.1.0 → 0.2.0)
- `fix:` → Patch version bump (0.1.0 → 0.1.1)
- `perf:` → Patch version bump

**No Version Bump:**
- `docs:`, `style:`, `refactor:`, `test:`, `chore:`

**Breaking Changes:**
- `feat!:` or `BREAKING CHANGE:` footer → Major version bump (0.1.0 → 1.0.0)

## 🎉 You're All Set!

Once all items are checked, semantic-release will automatically:
- Analyze commits
- Determine version bumps
- Generate changelogs
- Publish to npm
- Create GitHub releases

## 📚 Additional Resources

- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🆘 Troubleshooting

### Release doesn't trigger
- Verify you're pushing to `main` or `beta` branch
- Check that commits follow conventional commit format
- Ensure at least one commit triggers a version bump (`feat:`, `fix:`, etc.)

### NPM publish fails
- Verify `NPM_TOKEN` secret is set correctly
- Check npm token hasn't expired
- Ensure you have publish permissions for the package
- Verify package name `@quentli/js` is available or you own it

### GitHub release fails
- Check GitHub Actions permissions (Settings → Actions → General)
- Verify `GITHUB_TOKEN` has write permissions
- Check branch protection rules aren't blocking the bot

For more help, see [RELEASE.md](.github/RELEASE.md)

