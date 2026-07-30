# WebDesk Release Process Guide

This document outlines the step-by-step procedures for preparing, testing, packaging, and publishing official releases for **WebDesk**.

---

## 🔢 1. Versioning Standard

WebDesk follows [Semantic Versioning 2.0.0](https://semver.org/):

`MAJOR.MINOR.PATCH` (e.g. `1.0.0`)

- **MAJOR**: Incompatible API or structural architectural changes.
- **MINOR**: New features added in a backwards-compatible manner.
- **PATCH**: Backwards-compatible bug fixes and security patches.

---

## 📝 2. Pre-Release Checklist

Before tagging a new release:
1. **Verify Type Compilation**:
   ```bash
   npm run typecheck
   ```
2. **Clean & Build Desktop Packages**:
   ```bash
   npm run rebuild
   ```
3. **Update Changelog**:
   Edit [CHANGELOG.md](../CHANGELOG.md) to move `[Unreleased]` items under the new version header.

---

## 🏷️ 3. Creating a Release Tag

```bash
# 1. Bump version in package.json
npm version minor -m "chore(release): bump version to %s"

# 2. Push commit and release tag to GitHub
git push origin main --tags
```

---

## 🔒 4. Generating SHA256 Checksums

To verify binary integrity across Linux distributions, run:

```bash
node scripts/generate-checksums.js
```

This creates `release/SHA256SUMS.txt` containing checksums for `.deb`, `.rpm`, `AppImage`, `.exe`, and `.dmg` installers:

```
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  WebDesk-1.0.0.AppImage
a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e  webdesk_1.0.0_amd64.deb
```

---

## 🚀 5. Automated GitHub Release

Pushing a version tag `v*` automatically triggers the GitHub Actions release workflow (`.github/workflows/release.yml`) which builds and uploads all platform installers directly to the release page.
