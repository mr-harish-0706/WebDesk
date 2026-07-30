# Contributing to WebDesk

Thank you for your interest in contributing to **WebDesk**! We welcome contributions from developers, designers, technical writers, and open-source enthusiasts of all skill levels.

---

## 📜 Code of Conduct

All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all community members with respect and professionalism.

---

## 🛠️ Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/webdesk.git
cd webdesk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm start
```

### 4. Run Type Checking
```bash
npm run typecheck
```

---

## 🌿 Branching Strategy

- `main`: Production-ready releases.
- `develop`: Staging branch for upcoming features.
- Feature branches: Use descriptive names like `feature/custom-user-agent` or `fix/tray-menu-crash`.

---

## 📩 Pull Request Guidelines

1. **Keep PRs focused**: Solve one specific issue or implement one feature per PR.
2. **Type Safety**: Ensure `npm run typecheck` passes with **0 errors**.
3. **Commit Messages**: Follow standard conventional commits format:
   - `feat: add custom proxy support for session profiles`
   - `fix: resolve .desktop file permission issue on Ubuntu`
   - `docs: update API reference for Window IPC`
4. **Link Issues**: Reference related GitHub issues (e.g. `Fixes #42`).
