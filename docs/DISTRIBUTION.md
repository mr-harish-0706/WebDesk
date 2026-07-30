# WebDesk Application Distribution Guide

This guide provides step-by-step instructions for publishing and packaging **WebDesk** across major Linux package indexes, Linux app stores, Windows package managers, and macOS Homebrew Casks.

---

## 📦 1. GitHub Releases (Primary Distribution)

GitHub Releases serves as the primary distribution channel for WebDesk releases.

### Release Artifact Checklist
- [x] `WebDesk-1.0.0.AppImage` (Universal Linux Portable)
- [x] `webdesk_1.0.0_amd64.deb` (Debian / Ubuntu / Pop!_OS)
- [x] `webdesk-1.0.0.x86_64.rpm` (Fedora / openSUSE / RHEL)
- [x] `WebDesk Setup 1.0.0.exe` (Windows NSIS Installer)
- [x] `WebDesk-1.0.0.dmg` (macOS Universal Apple Silicon/Intel)
- [x] `SHA256SUMS.txt` (Integrity Hashes)

---

## 🐧 2. Flathub / Flatpak Distribution

Flathub is the central app store for Flatpak applications across all Linux distributions.

### Flatpak Manifest (`com.webdesk.app.yml`)
```yaml
app-id: com.webdesk.app
runtime: org.freedesktop.Platform
runtime-version: '23.08'
sdk: org.freedesktop.Sdk
base: org.electronjs.Electron2.BaseApp
command: webdesk
finish-args:
  - --share=ipc
  - --socket=x11
  - --socket=wayland
  - --device=dri
  - --share=network
  - --filesystem=host
```

### Submission Steps
1. Fork [flathub/flathub](https://github.com/flathub/flathub).
2. Create pull request containing `com.webdesk.app.yml` and appstream metadata `com.webdesk.app.metainfo.xml`.

---

## 🛍️ 3. Snap Store Distribution

Canonical Snap Store distribution for Ubuntu and Linux distros with Snap support.

### Snapcraft Configuration (`snap/snapcraft.yaml`)
```yaml
name: webdesk
version: '1.0.0'
summary: Universal Linux Web Application Manager
description: Isolated web application launcher with custom workspaces and session partitions.
confinement: strict
base: core22

apps:
  webdesk:
    command: webdesk
    extensions: [gnome]
    plugs:
      - network
      - network-bind
      - desktop
      - desktop-legacy
      - x11
      - wayland
```

### Publishing Command
```bash
snapcraft upload --release=stable release/1.0.0/webdesk_1.0.0_amd64.snap
```

---

## 🏹 4. Arch User Repository (AUR)

Package recipe for Arch Linux, Manjaro, and EndeavourOS.

### PKGBUILD Recipe
```bash
# Maintainer: WebDesk Team <team@webdesk.app>
pkgname=webdesk-bin
pkgver=1.0.0
pkgrel=1
pkgdesc="Universal Linux Web Application Manager"
arch=('x86_64')
url="https://github.com/webdesk/webdesk"
license=('MIT')
depends=('libnotify' 'nss' 'libxtst' 'libsecret')
source=("https://github.com/webdesk/webdesk/releases/download/v${pkgver}/webdesk_${pkgver}_amd64.deb")
sha256sums=('SKIP')

package() {
  tar -xf data.tar.xz -C "${pkgdir}"
}
```

---

## 🪟 5. Windows Winget & Chocolatey

### Winget Manifest (`manifests/w/WebDesk/WebDesk/1.0.0/WebDesk.WebDesk.yaml`)
```yaml
PackageIdentifier: WebDesk.WebDesk
PackageVersion: 1.0.0
PackageName: WebDesk
Publisher: WebDesk Contributors
License: MIT
ShortDescription: Universal Web Application Manager with isolated session profiles.
Installers:
  - Architecture: x64
    InstallerType: nsis
    InstallerUrl: https://github.com/webdesk/webdesk/releases/download/v1.0.0/WebDesk-Setup-1.0.0.exe
    InstallerSha256: SHA256_HASH_HERE
```

---

## 🍺 6. macOS Homebrew Cask

Submit to `homebrew/homebrew-cask`:

```ruby
cask "webdesk" do
  version "1.0.0"
  sha256 "SHA256_HASH_HERE"

  url "https://github.com/webdesk/webdesk/releases/download/v#{version}/WebDesk-#{version}.dmg"
  name "WebDesk"
  desc "Universal Web Application Manager"
  homepage "https://github.com/webdesk/webdesk"

  app "WebDesk.app"
end
```
