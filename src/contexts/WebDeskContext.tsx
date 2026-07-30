import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WebApp, Profile, Workspace, Category, AppSettings } from '../types';
import { setupWebDeskAPI } from '../utils/mockWebDeskApi';

setupWebDeskAPI();

interface WebDeskContextType {
  apps: WebApp[];
  profiles: Profile[];
  workspaces: Workspace[];
  categories: Category[];
  settings: AppSettings | null;
  openWindowIds: string[];
  currentTab: 'apps' | 'workspaces' | 'profiles' | 'settings';
  setCurrentTab: (tab: 'apps' | 'workspaces' | 'profiles' | 'settings') => void;
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshData: () => Promise<void>;
  launchApp: (id: string) => Promise<void>;
  saveApp: (appData: any, editingAppId?: string) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  duplicateApp: (id: string) => Promise<void>;
  toggleFavorite: (id: string, isFavorite: boolean) => Promise<void>;
  togglePin: (id: string, isPinned: boolean) => Promise<void>;
  createDesktopLauncher: (id: string) => Promise<void>;
  createWorkspace: (wsData: Omit<Workspace, 'id'>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  createProfile: (profData: Omit<Profile, 'id'>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  exportData: () => Promise<void>;
  importData: () => Promise<void>;
}

const WebDeskContext = createContext<WebDeskContextType | undefined>(undefined);

export const WebDeskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<'apps' | 'workspaces' | 'profiles' | 'settings'>('apps');

  const [apps, setApps] = useState<WebApp[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws-all');
  const [activeProfileId, setActiveProfileId] = useState<string>('profile-personal');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [openWindowIds, setOpenWindowIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshData = async () => {
    try {
      if (window.webdesk) {
        const [a, p, w, c, s, openWins] = await Promise.all([
          window.webdesk.getApps(),
          window.webdesk.getProfiles(),
          window.webdesk.getWorkspaces(),
          window.webdesk.getCategories(),
          window.webdesk.getSettings(),
          window.webdesk.getOpenAppWindows(),
        ]);
        setApps(a || []);
        setProfiles(p || []);
        setWorkspaces(w || []);
        setCategories(c || []);
        setSettings(s);
        setOpenWindowIds(openWins || []);
      }
    } catch (err) {
      console.error('Failed to load data from WebDesk IPC:', err);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(async () => {
      if (window.webdesk) {
        const openWins = await window.webdesk.getOpenAppWindows();
        setOpenWindowIds(openWins || []);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const launchApp = async (id: string) => {
    if (window.webdesk) {
      await window.webdesk.launchApp(id);
      refreshData();
    }
  };

  const saveApp = async (appData: any, editingAppId?: string) => {
    if (window.webdesk) {
      if (editingAppId) {
        await window.webdesk.updateApp(editingAppId, appData);
        showToast(`Updated ${appData.name}`);
      } else {
        await window.webdesk.createApp(appData);
        showToast(`Added ${appData.name} as Web App`);
      }
      refreshData();
    }
  };

  const deleteApp = async (id: string) => {
    if (window.webdesk) {
      await window.webdesk.deleteApp(id);
      showToast('App deleted');
      refreshData();
    }
  };

  const duplicateApp = async (id: string) => {
    if (window.webdesk) {
      await window.webdesk.duplicateApp(id);
      showToast('App duplicated');
      refreshData();
    }
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    if (window.webdesk) {
      await window.webdesk.updateApp(id, { isFavorite });
      refreshData();
    }
  };

  const togglePin = async (id: string, isPinned: boolean) => {
    if (window.webdesk) {
      await window.webdesk.updateApp(id, { isPinned });
      refreshData();
    }
  };

  const createDesktopLauncher = async (id: string) => {
    if (window.webdesk) {
      await window.webdesk.createDesktopLauncher(id);
      showToast('Created Linux .desktop launcher in ~/.local/share/applications');
    }
  };

  const createWorkspace = async (wsData: Omit<Workspace, 'id'>) => {
    if (window.webdesk) {
      await window.webdesk.createWorkspace(wsData);
      showToast(`Created workspace ${wsData.name}`);
      refreshData();
    }
  };

  const deleteWorkspace = async (id: string) => {
    if (window.webdesk) {
      await window.webdesk.deleteWorkspace(id);
      showToast('Workspace deleted');
      refreshData();
    }
  };

  const createProfile = async (profData: Omit<Profile, 'id'>) => {
    if (window.webdesk) {
      await window.webdesk.createProfile(profData);
      showToast(`Created profile ${profData.name}`);
      refreshData();
    }
  };

  const deleteProfile = async (id: string) => {
    if (window.webdesk) {
      await window.webdesk.deleteProfile(id);
      showToast('Profile deleted');
      refreshData();
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    if (window.webdesk) {
      const updated = await window.webdesk.updateSettings(newSettings);
      setSettings(updated);
      showToast('Settings saved');
    }
  };

  const exportData = async () => {
    if (window.webdesk) {
      const json = await window.webdesk.exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `webdesk-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported WebDesk backup file');
    }
  };

  const importData = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const text = await file.text();
        if (window.webdesk) {
          const success = await window.webdesk.importData(text);
          if (success) {
            showToast('Backup restored successfully');
            refreshData();
          } else {
            showToast('Failed to parse backup JSON');
          }
        }
      }
    };
    input.click();
  };

  return (
    <WebDeskContext.Provider
      value={{
        apps,
        profiles,
        workspaces,
        categories,
        settings,
        openWindowIds,
        currentTab,
        setCurrentTab,
        activeWorkspaceId,
        setActiveWorkspaceId,
        activeProfileId,
        setActiveProfileId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        refreshData,
        launchApp,
        saveApp,
        deleteApp,
        duplicateApp,
        toggleFavorite,
        togglePin,
        createDesktopLauncher,
        createWorkspace,
        deleteWorkspace,
        createProfile,
        deleteProfile,
        updateSettings,
        exportData,
        importData,
      }}
    >
      {children}
    </WebDeskContext.Provider>
  );
};

export const useWebDesk = () => {
  const context = useContext(WebDeskContext);
  if (!context) {
    throw new Error('useWebDesk must be used within a WebDeskProvider');
  }
  return context;
};
