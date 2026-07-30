import { contextBridge, ipcRenderer } from 'electron';
import { IWebDeskAPI } from '../../src/types';

const webdeskAPI: IWebDeskAPI = {
  // App Management
  getApps: () => ipcRenderer.invoke('db:getApps'),
  getAppById: (id: string) => ipcRenderer.invoke('db:getAppById', id),
  createApp: (appData) => ipcRenderer.invoke('db:createApp', appData),
  updateApp: (id, appData) => ipcRenderer.invoke('db:updateApp', id, appData),
  deleteApp: (id) => ipcRenderer.invoke('db:deleteApp', id),
  duplicateApp: (id) => ipcRenderer.invoke('db:duplicateApp', id),
  reorderApps: (orders) => ipcRenderer.invoke('db:reorderApps', orders),
  scrapeMetadata: (url) => ipcRenderer.invoke('app:scrapeMetadata', url),

  // App Execution
  launchApp: (id) => ipcRenderer.invoke('app:launch', id),
  closeAppWindow: (id) => ipcRenderer.invoke('app:closeWindow', id),
  getOpenAppWindows: () => ipcRenderer.invoke('app:getOpenWindows'),

  // Profiles
  getProfiles: () => ipcRenderer.invoke('db:getProfiles'),
  createProfile: (profile) => ipcRenderer.invoke('db:createProfile', profile),
  updateProfile: (id, profile) => ipcRenderer.invoke('db:updateProfile', id, profile),
  deleteProfile: (id) => ipcRenderer.invoke('db:deleteProfile', id),
  clearProfileData: (id) => ipcRenderer.invoke('db:clearProfileData', id),

  // Workspaces
  getWorkspaces: () => ipcRenderer.invoke('db:getWorkspaces'),
  createWorkspace: (workspace) => ipcRenderer.invoke('db:createWorkspace', workspace),
  updateWorkspace: (id, workspace) => ipcRenderer.invoke('db:updateWorkspace', id, workspace),
  deleteWorkspace: (id) => ipcRenderer.invoke('db:deleteWorkspace', id),

  // Categories
  getCategories: () => ipcRenderer.invoke('db:getCategories'),
  createCategory: (category) => ipcRenderer.invoke('db:createCategory', category),

  // Settings
  getSettings: () => ipcRenderer.invoke('db:getSettings'),
  updateSettings: (settings) => ipcRenderer.invoke('db:updateSettings', settings),

  // Linux Launcher
  createDesktopLauncher: (appId) => ipcRenderer.invoke('linux:createLauncher', appId),
  removeDesktopLauncher: (appId) => ipcRenderer.invoke('linux:removeLauncher', appId),

  // Backup & Import/Export
  exportData: () => ipcRenderer.invoke('db:exportData'),
  importData: (json) => ipcRenderer.invoke('db:importData', json),

  // System Window Actions
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  openExternalUrl: (url) => ipcRenderer.invoke('system:openExternal', url),
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  selectFile: (filters) => ipcRenderer.invoke('dialog:selectFile', filters),
};

contextBridge.exposeInMainWorld('webdesk', webdeskAPI);
