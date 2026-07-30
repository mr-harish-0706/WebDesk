# WebDesk Developer Guide

## File Structure Overview

```
webApp/
├── electron/
│   ├── main/
│   │   ├── index.ts              # Main process entry point
│   │   ├── db.ts                 # SQLite database service & default datasets
│   │   ├── sessionManager.ts     # Isolated session & window manager
│   │   └── linuxIntegration.ts   # Linux .desktop launcher generator
│   └── preload/
│       └── index.ts              # Type-safe context bridge loader
├── src/
│   ├── components/
│   │   ├── TitleBar.tsx          # Custom frameless title bar
│   │   ├── Sidebar.tsx           # Navigation, workspaces & profiles bar
│   │   ├── AppCard.tsx           # Web app card component
│   │   ├── AppModal.tsx          # Add / Edit web app modal
│   │   ├── CommandPalette.tsx    # Ctrl+K quick launcher
│   │   ├── WorkspaceView.tsx     # Custom workspaces manager
│   │   ├── ProfileView.tsx       # Isolated session profiles manager
│   │   └── SettingsView.tsx      # Theme & Linux integration settings
│   ├── plugins/
│   │   └── PluginManager.ts      # Plugin API framework
│   ├── types/
│   │   └── index.ts              # Shared TypeScript definitions
│   ├── utils/
│   │   └── mockWebDeskApi.ts     # Browser fallback mock API
│   ├── App.tsx                   # Main React application shell
│   ├── main.tsx                  # React DOM entry point
│   └── index.css                 # Tailwind CSS & theme tokens
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── electron-builder.yml
```

## Adding a New Feature

1. **IPC Channel Definition**: Add new method signature to `IWebDeskAPI` in `src/types/index.ts`.
2. **Main Handler**: Implement IPC handler in `electron/main/index.ts` or helper services.
3. **Preload Exposure**: Expose wrapper function in `electron/preload/index.ts`.
4. **Mock Fallback**: Update `src/utils/mockWebDeskApi.ts` for browser dev testing.
5. **React Component UI**: Consume `window.webdesk.newMethod()` in React UI components.
