export const IPC_CHANNELS = {
  // DB Apps
  DB_GET_APPS: 'db:getApps',
  DB_GET_APP_BY_ID: 'db:getAppById',
  DB_CREATE_APP: 'db:createApp',
  DB_UPDATE_APP: 'db:updateApp',
  DB_DELETE_APP: 'db:deleteApp',
  DB_DUPLICATE_APP: 'db:duplicateApp',
  DB_REORDER_APPS: 'db:reorderApps',

  // App Execution
  APP_LAUNCH: 'app:launch',
  APP_CLOSE_WINDOW: 'app:closeWindow',
  APP_GET_OPEN_WINDOWS: 'app:getOpenWindows',
  APP_SCRAPE_METADATA: 'app:scrapeMetadata',

  // Profiles
  DB_GET_PROFILES: 'db:getProfiles',
  DB_CREATE_PROFILE: 'db:createProfile',
  DB_UPDATE_PROFILE: 'db:updateProfile',
  DB_DELETE_PROFILE: 'db:deleteProfile',
  DB_CLEAR_PROFILE_DATA: 'db:clearProfileData',

  // Workspaces
  DB_GET_WORKSPACES: 'db:getWorkspaces',
  DB_CREATE_WORKSPACE: 'db:createWorkspace',
  DB_UPDATE_WORKSPACE: 'db:updateWorkspace',
  DB_DELETE_WORKSPACE: 'db:deleteWorkspace',

  // Categories
  DB_GET_CATEGORIES: 'db:getCategories',
  DB_CREATE_CATEGORY: 'db:createCategory',

  // Settings
  DB_GET_SETTINGS: 'db:getSettings',
  DB_UPDATE_SETTINGS: 'db:updateSettings',

  // Linux Launcher
  LINUX_CREATE_LAUNCHER: 'linux:createLauncher',
  LINUX_REMOVE_LAUNCHER: 'linux:removeLauncher',

  // Export / Import
  DB_EXPORT_DATA: 'db:exportData',
  DB_IMPORT_DATA: 'db:importData',

  // Window Controls
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
  WINDOW_IS_MAXIMIZED: 'window:isMaximized',

  // System
  SYSTEM_OPEN_EXTERNAL: 'system:openExternal',
  DIALOG_SELECT_DIRECTORY: 'dialog:selectDirectory',
  DIALOG_SELECT_FILE: 'dialog:selectFile',
} as const;
