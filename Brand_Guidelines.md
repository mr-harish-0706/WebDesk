# WebDesk Brand Guidelines

This document specifies the visual identity, brand principles, color palettes, typography, and logo usage guidelines for **WebDesk**.

---

## 1. Brand Essence

- **Name**: WebDesk
- **Tagline**: The Universal Linux Web Application Manager
- **Mission**: Empower users to run, isolate, organize, and launch web applications as native desktop applications with custom session partitions, Linux `.desktop` launcher integration, and modern glassmorphism aesthetics.
- **Visual Style**: Sleek, modern, dark-mode first, glassmorphism, responsive, inspired by Arc Browser, VS Code, Discord, and GNOME Shell.

---

## 2. Color System

### Primary & Accent Palette

| Role | Name | Hex | HSL | RGB | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Accent** | Electric Blue | `#3b82f6` | `217°, 91%, 60%` | `59, 130, 246` | Buttons, active tab indicators, primary focus |
| **Secondary Accent**| Indigo Spark | `#6366f1` | `239°, 84%, 67%` | `99, 102, 241` | Gradients, badges, sparkles |
| **Tertiary Accent** | Purple Glow | `#8b5cf6` | `258°, 90%, 66%` | `139, 92, 246` | AI workspace tags, special highlights |
| **Emerald Tag** | Mint Emerald | `#10b981` | `160°, 84%, 39%` | `16, 185, 129` | Work profile tags, running app indicators |
| **Amber Tag** | Solar Amber | `#f59e0b` | `38°, 92%, 50%` | `245, 158, 11` | Favorites, warnings, college profile |
| **Rose Tag** | Crimson Rose | `#ec4899` | `330°, 81%, 60%` | `236, 72, 153` | Social category, destructive warnings |

### Neutral Surface Palette

| Surface | Hex | Description |
| :--- | :--- | :--- |
| **Background Primary** | `#0f172a` | Main application background (Slate 900) |
| **Background Secondary**| `#1e293b` | Sidebar & card background (Slate 800) |
| **Background Surface** | `#334155` | Hover states, borders, active panels (Slate 700) |
| **Border Soft** | `rgba(255,255,255,0.1)` | Subtle card borders |
| **Text Primary** | `#f8fafc` | Primary headings, titles |
| **Text Muted** | `#94a3b8` | Subtitles, URLs, secondary labels |

---

## 3. Typography

- **Primary UI Font**: `Inter` (sans-serif)
  - Headings: `Inter Bold` (700) / `SemiBold` (600)
  - Body: `Inter Medium` (500) / `Regular` (400)
- **Monospace Font**: `JetBrains Mono` / `Fira Code` (monospace)
  - Partition IDs, `.desktop` paths, keyboard shortcut badges.

---

## 4. Logo & Icon Specification

### Vector Logo
- Master file: `assets/branding/logo.svg`
- Features a rounded square container with dual glassmorphism gradient layers, glowing central grid shield, and accent sparkles.

### Multi-Platform Icon Requirements

```
build/
├── icons/
│   ├── icon.png      # 512x512 PNG (Linux PNG icon)
│   ├── icon.ico      # Multi-resolution ICO (Windows 16x16 to 256x256)
│   └── icon.icns     # Apple ICNS format (macOS 16x16 to 1024x1024)
```
