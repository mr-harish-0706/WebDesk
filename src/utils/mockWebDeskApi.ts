import { WebApp, Profile, Workspace, Category, AppSettings, IWebDeskAPI } from '../types';
import {
  DEFAULT_PROFILES,
  DEFAULT_WORKSPACES,
  DEFAULT_CATEGORIES,
  DEFAULT_SETTINGS,
  DEFAULT_INITIAL_APPS,
} from '../constants/defaults';

export const createMockWebDeskAPI = (): IWebDeskAPI => {
  let apps = [...DEFAULT_INITIAL_APPS];
  let profiles = [...DEFAULT_PROFILES];
  let workspaces = [...DEFAULT_WORKSPACES];
  let categories = [...DEFAULT_CATEGORIES];
  let settings = { ...DEFAULT_SETTINGS };

  return {
    getApps: async () => apps.filter(a => !a.isArchived),
    getAppById: async (id) => apps.find(a => a.id === id) || null,
    createApp: async (appData) => {
      const newApp: WebApp = {
        ...appData,
        id: `app-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      apps.push(newApp);
      return newApp;
    },
    updateApp: async (id, appData) => {
      const idx = apps.findIndex(a => a.id === id);
      if (idx !== -1) {
        apps[idx] = { ...apps[idx], ...appData };
        return apps[idx];
      }
      throw new Error(`App ${id} not found`);
    },
    deleteApp: async (id) => {
      apps = apps.filter(a => a.id !== id);
      return true;
    },
    duplicateApp: async (id) => {
      const orig = apps.find(a => a.id === id);
      if (!orig) throw new Error(`App ${id} not found`);
      const copy: WebApp = {
        ...orig,
        id: `app-${Date.now()}`,
        name: `${orig.name} (Copy)`,
        createdAt: new Date().toISOString(),
      };
      apps.push(copy);
      return copy;
    },
    reorderApps: async (orders) => {
      const map = new Map(orders.map(o => [o.id, o.order]));
      apps.forEach(a => {
        if (map.has(a.id)) a.order = map.get(a.id)!;
      });
      return true;
    },
    scrapeMetadata: async (url) => {
      const hostname = url.replace(/https?:\/\//, '').split('/')[0];
      return {
        title: hostname,
        iconUrl: `https://${hostname}/favicon.ico`,
      };
    },

    launchApp: async (id) => {
      const app = apps.find(a => a.id === id);
      if (app) {
        window.open(app.url, '_blank');
        return true;
      }
      return false;
    },
    closeAppWindow: async () => true,
    getOpenAppWindows: async () => [],

    getProfiles: async () => profiles,
    createProfile: async (prof) => {
      const newP: Profile = { ...prof, id: `profile-${Date.now()}`, partition: `persist:${Date.now()}` };
      profiles.push(newP);
      return newP;
    },
    updateProfile: async (id, prof) => {
      const idx = profiles.findIndex(p => p.id === id);
      if (idx !== -1) {
        profiles[idx] = { ...profiles[idx], ...prof };
        return profiles[idx];
      }
      throw new Error(`Profile ${id} not found`);
    },
    deleteProfile: async (id) => {
      profiles = profiles.filter(p => p.id !== id);
      return true;
    },
    clearProfileData: async () => true,

    getWorkspaces: async () => workspaces,
    createWorkspace: async (ws) => {
      const newWs: Workspace = { ...ws, id: `ws-${Date.now()}` };
      workspaces.push(newWs);
      return newWs;
    },
    updateWorkspace: async (id, ws) => {
      const idx = workspaces.findIndex(w => w.id === id);
      if (idx !== -1) {
        workspaces[idx] = { ...workspaces[idx], ...ws };
        return workspaces[idx];
      }
      throw new Error(`Workspace ${id} not found`);
    },
    deleteWorkspace: async (id) => {
      workspaces = workspaces.filter(w => w.id !== id);
      return true;
    },

    getCategories: async () => categories,
    createCategory: async (cat) => {
      const newCat: Category = { ...cat, id: `cat-${Date.now()}` };
      categories.push(newCat);
      return newCat;
    },

    getSettings: async () => settings,
    updateSettings: async (s) => {
      settings = { ...settings, ...s };
      return settings;
    },

    createDesktopLauncher: async () => true,
    removeDesktopLauncher: async () => true,

    exportData: async () => JSON.stringify({ apps, profiles, workspaces, categories, settings }),
    importData: async () => true,

    minimizeWindow: () => {},
    maximizeWindow: () => {},
    closeWindow: () => {},
    isMaximized: async () => false,
    openExternalUrl: async (url) => { window.open(url, '_blank'); return true; },
    selectDirectory: async () => '/home/user/Downloads',
    selectFile: async () => null,
  };
};

export function setupWebDeskAPI(): void {
  if (!window.webdesk) {
    console.warn('Electron window.webdesk context bridge not found. Injecting fallback mock API for web environment.');
    window.webdesk = createMockWebDeskAPI();
  }
}
