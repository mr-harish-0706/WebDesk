# WebDesk Architecture Specification

## Process Isolation Model

```
 ┌─────────────────────────────────────────────────────────────┐
 │                       Electron Main                         │
 │  (Node.js Runtime, File System Access, Linux .desktop engine) │
 └──────────────┬──────────────────────────────┬───────────────┘
                │                              │
 ┌──────────────┴──────────────┐ ┌─────────────┴──────────────┐
 │     Main App Window UI      │ │   Isolated App Windows      │
 │  (React + Tailwind + Vite)  │ │ (Partitioned Session Engine)│
 └─────────────────────────────┘ └─────────────────────────────┘
```

1. **Electron Main Process (`electron/main/index.ts`)**:
   - Manages window lifecycle, single instance locks, system tray menus, and Linux `.desktop` launcher creation.
   - Hosts the SQLite Database service (`electron/main/db.ts`).
   - Manages isolated browser sessions (`electron/main/sessionManager.ts`) using Electron `session.fromPartition('persist:profile_id')`.

2. **Secure Preload Bridge (`electron/preload/index.ts`)**:
   - Exposes a type-safe `window.webdesk` bridge object into the renderer via `contextBridge`.
   - Renderer executes with `contextIsolation: true`, `sandbox: true`, and `nodeIntegration: false` for maximum security.

3. **Isolated Session Partitions**:
   - Each session profile (e.g. Work, Personal, College) is backed by its own `persist:` storage partition.
   - Cookies, local storage, indexedDB, and cache remain 100% isolated between profiles.

4. **Linux Desktop Integration Engine (`electron/main/linuxIntegration.ts`)**:
   - Writes XDG Desktop specification `.desktop` files in `~/.local/share/applications/webdesk-[id].desktop`.
   - Allows launching web apps directly with custom command line flags `--app-id=[id]`.
