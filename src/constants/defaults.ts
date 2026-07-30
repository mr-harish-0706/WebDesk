import { Profile, Workspace, Category, AppSettings, WebApp } from '../types';

export const DEFAULT_PROFILES: Profile[] = [
  { id: 'profile-personal', name: 'Personal', color: '#3b82f6', icon: 'User', partition: 'persist:personal', isSystem: true },
  { id: 'profile-work', name: 'Work', color: '#10b981', icon: 'Briefcase', partition: 'persist:work', isSystem: true },
  { id: 'profile-college', name: 'College', color: '#f59e0b', icon: 'GraduationCap', partition: 'persist:college', isSystem: true },
  { id: 'profile-gaming', name: 'Gaming', color: '#8b5cf6', icon: 'Gamepad2', partition: 'persist:gaming', isSystem: true },
];

export const DEFAULT_WORKSPACES: Workspace[] = [
  { id: 'ws-all', name: 'All Apps', color: '#6366f1', icon: 'LayoutGrid', order: 0, isSystem: true },
  { id: 'ws-dev', name: 'Development', color: '#06b6d4', icon: 'Code', order: 1 },
  { id: 'ws-social', name: 'Social & Chat', color: '#ec4899', icon: 'MessageSquare', order: 2 },
  { id: 'ws-ai', name: 'AI Assistants', color: '#8b5cf6', icon: 'Sparkles', order: 3 },
  { id: 'ws-prod', name: 'Productivity', color: '#10b981', icon: 'CheckSquare', order: 4 },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-social', name: 'Social', icon: 'MessageCircle', color: '#3b82f6' },
  { id: 'cat-productivity', name: 'Productivity', icon: 'Briefcase', color: '#10b981' },
  { id: 'cat-developer', name: 'Developer', icon: 'Code2', color: '#06b6d4' },
  { id: 'cat-ai', name: 'AI Tools', icon: 'Bot', color: '#8b5cf6' },
  { id: 'cat-utilities', name: 'Utilities', icon: 'Wrench', color: '#f59e0b' },
  { id: 'cat-entertainment', name: 'Entertainment', icon: 'Film', color: '#ec4899' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#3b82f6',
  language: 'en',
  downloadPath: '',
  openAtLogin: false,
  systemTray: true,
  minimizeToTray: true,
  closeToTray: false,
  hardwareAcceleration: true,
  compactMode: false,
  defaultProfileId: 'profile-personal',
  defaultWorkspaceId: 'ws-all',
  linuxDesktopLauncher: true,
};

export const DEFAULT_INITIAL_APPS: WebApp[] = [
  {
    id: 'app-github',
    name: 'GitHub',
    url: 'https://github.com',
    category: 'Developer',
    profileId: 'profile-work',
    workspaceId: 'ws-dev',
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    order: 0,
    notificationsEnabled: true,
    createdAt: new Date().toISOString(),
    icon: 'https://github.githubassets.com/favicons/favicon.svg'
  },
  {
    id: 'app-chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    category: 'AI Tools',
    profileId: 'profile-personal',
    workspaceId: 'ws-ai',
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    order: 1,
    notificationsEnabled: true,
    createdAt: new Date().toISOString(),
    icon: 'https://chatgpt.com/favicon.ico'
  },
  {
    id: 'app-discord',
    name: 'Discord Web',
    url: 'https://discord.com/app',
    category: 'Social',
    profileId: 'profile-personal',
    workspaceId: 'ws-social',
    isFavorite: true,
    isPinned: false,
    isArchived: false,
    order: 2,
    notificationsEnabled: true,
    createdAt: new Date().toISOString(),
    icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png'
  },
  {
    id: 'app-notion',
    name: 'Notion',
    url: 'https://www.notion.so',
    category: 'Productivity',
    profileId: 'profile-work',
    workspaceId: 'ws-prod',
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    order: 3,
    notificationsEnabled: true,
    createdAt: new Date().toISOString(),
    icon: 'https://www.notion.so/images/favicon.ico'
  }
];
