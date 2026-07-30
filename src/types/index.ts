export interface WebApp {
  id: string;
  name: string;
  url: string;
  icon?: string;
  category: string;
  profileId: string;
  workspaceId: string;
  isFavorite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  order: number;
  userAgent?: string;
  customCss?: string;
  customJs?: string;
  badgeCount?: number;
  notificationsEnabled: boolean;
  lastOpened?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  color: string;
  icon: string;
  partition: string;
  proxyUrl?: string;
  userAgent?: string;
  isSystem?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  isSystem?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  language: string;
  downloadPath: string;
  openAtLogin: boolean;
  systemTray: boolean;
  minimizeToTray: boolean;
  closeToTray: boolean;
  hardwareAcceleration: boolean;
  compactMode: boolean;
  defaultProfileId: string;
  defaultWorkspaceId: string;
  linuxDesktopLauncher: boolean;
}

export interface DownloadProgress {
  id: string;
  appId: string;
  fileName: string;
  filePath: string;
  url: string;
  totalBytes: number;
  receivedBytes: number;
  status: 'progressing' | 'completed' | 'cancelled' | 'failed';
  timestamp: string;
}

export interface AppHistoryItem {
  id: string;
  appId: string;
  title: string;
  url: string;
  timestamp: string;
}

export interface FaviconScrapeResult {
  title?: string;
  iconUrl?: string;
  themeColor?: string;
}

// Window WebDesk API definition exposed via Preload Context Bridge
export interface IWebDeskAPI {
  // App Management
  getApps: () => Promise<WebApp[]>;
  getAppById: (id: string) => Promise<WebApp | null>;
  createApp: (app: Omit<WebApp, 'id' | 'createdAt'>) => Promise<WebApp>;
  updateApp: (id: string, app: Partial<WebApp>) => Promise<WebApp>;
  deleteApp: (id: string) => Promise<boolean>;
  duplicateApp: (id: string) => Promise<WebApp>;
  reorderApps: (appOrders: { id: string; order: number }[]) => Promise<boolean>;
  scrapeMetadata: (url: string) => Promise<FaviconScrapeResult>;

  // App Execution
  launchApp: (id: string) => Promise<boolean>;
  closeAppWindow: (id: string) => Promise<boolean>;
  getOpenAppWindows: () => Promise<string[]>;

  // Profiles
  getProfiles: () => Promise<Profile[]>;
  createProfile: (profile: Omit<Profile, 'id'>) => Promise<Profile>;
  updateProfile: (id: string, profile: Partial<Profile>) => Promise<Profile>;
  deleteProfile: (id: string) => Promise<boolean>;
  clearProfileData: (id: string) => Promise<boolean>;

  // Workspaces
  getWorkspaces: () => Promise<Workspace[]>;
  createWorkspace: (workspace: Omit<Workspace, 'id'>) => Promise<Workspace>;
  updateWorkspace: (id: string, workspace: Partial<Workspace>) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<boolean>;

  // Categories
  getCategories: () => Promise<Category[]>;
  createCategory: (category: Omit<Category, 'id'>) => Promise<Category>;

  // Settings
  getSettings: () => Promise<AppSettings>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;

  // Linux Desktop Integration
  createDesktopLauncher: (appId: string) => Promise<boolean>;
  removeDesktopLauncher: (appId: string) => Promise<boolean>;

  // Backup & Import/Export
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<boolean>;

  // System & Window Actions
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  isMaximized: () => Promise<boolean>;
  openExternalUrl: (url: string) => Promise<boolean>;
  selectDirectory: () => Promise<string | null>;
  selectFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>;
}

declare global {
  interface Window {
    webdesk: IWebDeskAPI;
  }
}
