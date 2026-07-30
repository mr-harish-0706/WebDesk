# Changelog

All notable changes to **WebDesk** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-30

### Added
- **Isolated Session Profiles**: Per-profile storage partitions (`persist:profile_id`) separating cookies, cache, storage, and proxies for Personal, Work, College, and Gaming contexts.
- **Linux XDG `.desktop` Integration**: Automatic `.desktop` launcher generator in `~/.local/share/applications/` for GNOME, KDE, Rofi, and Linux system docks.
- **Custom Context Workspaces**: Context switcher for Development, Social, AI Assistants, and Productivity.
- **Command Palette (`Ctrl+K`)**: Keyboard-first navigation for searching apps, workspaces, and system commands.
- **Favicon & Metadata Auto-Scraper**: Automatic website title and icon fetching.
- **Database Backup & Restore**: Full JSON database export/import functionality.
- **Modern Theme System**: Dark/Light mode engine with HSL accent color customization and glassmorphism UI.
- **Multi-Platform Packages**: Build configurations for AppImage, `.deb`, `.rpm`, `NSIS`, and `DMG`.
