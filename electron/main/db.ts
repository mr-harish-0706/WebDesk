import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { WebApp, Profile, Workspace, Category, AppSettings, DownloadProgress } from '../../src/types';
import {
  DEFAULT_PROFILES,
  DEFAULT_WORKSPACES,
  DEFAULT_CATEGORIES,
  DEFAULT_SETTINGS,
  DEFAULT_INITIAL_APPS,
} from '../../src/constants/defaults';

// Data storage directory inside user app data
const userDataPath = app.getPath('userData');
const dbFilePath = path.join(userDataPath, 'webdesk.json');
const iconsDir = path.join(userDataPath, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

interface DBData {
  apps: WebApp[];
  profiles: Profile[];
  workspaces: Workspace[];
  categories: Category[];
  settings: AppSettings;
  downloads: DownloadProgress[];
}

class DatabaseService {
  private data: DBData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DBData {
    try {
      if (fs.existsSync(dbFilePath)) {
        const raw = fs.readFileSync(dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          apps: parsed.apps || DEFAULT_INITIAL_APPS,
          profiles: parsed.profiles || DEFAULT_PROFILES,
          workspaces: parsed.workspaces || DEFAULT_WORKSPACES,
          categories: parsed.categories || DEFAULT_CATEGORIES,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          downloads: parsed.downloads || [],
        };
      }
    } catch (err) {
      console.error('Failed to read database file, initializing defaults:', err);
    }

    const initialData: DBData = {
      apps: DEFAULT_INITIAL_APPS,
      profiles: DEFAULT_PROFILES,
      workspaces: DEFAULT_WORKSPACES,
      categories: DEFAULT_CATEGORIES,
      settings: DEFAULT_SETTINGS,
      downloads: [],
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data?: DBData): void {
    const toSave = data || this.data;
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // APP Operations
  public getApps(): WebApp[] {
    return this.data.apps.filter(a => !a.isArchived);
  }

  public getAppById(id: string): WebApp | null {
    return this.data.apps.find(a => a.id === id) || null;
  }

  public createApp(appData: Omit<WebApp, 'id' | 'createdAt'>): WebApp {
    const newApp: WebApp = {
      ...appData,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.apps.push(newApp);
    this.saveData();
    return newApp;
  }

  public updateApp(id: string, appData: Partial<WebApp>): WebApp {
    const index = this.data.apps.findIndex(a => a.id === id);
    if (index === -1) throw new Error(`App with ID ${id} not found`);
    this.data.apps[index] = { ...this.data.apps[index], ...appData };
    this.saveData();
    return this.data.apps[index];
  }

  public deleteApp(id: string): boolean {
    const initialLength = this.data.apps.length;
    this.data.apps = this.data.apps.filter(a => a.id !== id);
    if (this.data.apps.length !== initialLength) {
      this.saveData();
      return true;
    }
    return false;
  }

  public duplicateApp(id: string): WebApp {
    const original = this.getAppById(id);
    if (!original) throw new Error(`App ${id} not found`);

    const copy: Omit<WebApp, 'id' | 'createdAt'> = {
      ...original,
      name: `${original.name} (Copy)`,
      order: this.data.apps.length,
    };
    return this.createApp(copy);
  }

  public reorderApps(appOrders: { id: string; order: number }[]): boolean {
    const map = new Map(appOrders.map(item => [item.id, item.order]));
    this.data.apps.forEach(app => {
      if (map.has(app.id)) {
        app.order = map.get(app.id)!;
      }
    });
    this.saveData();
    return true;
  }

  // PROFILES
  public getProfiles(): Profile[] {
    return this.data.profiles;
  }

  public createProfile(profileData: Omit<Profile, 'id'>): Profile {
    const id = `profile-${Date.now()}`;
    const newProfile: Profile = {
      ...profileData,
      id,
      partition: profileData.partition || `persist:${id}`,
    };
    this.data.profiles.push(newProfile);
    this.saveData();
    return newProfile;
  }

  public updateProfile(id: string, profileData: Partial<Profile>): Profile {
    const index = this.data.profiles.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Profile ${id} not found`);
    this.data.profiles[index] = { ...this.data.profiles[index], ...profileData };
    this.saveData();
    return this.data.profiles[index];
  }

  public deleteProfile(id: string): boolean {
    const profile = this.data.profiles.find(p => p.id === id);
    if (profile?.isSystem) {
      throw new Error("Cannot delete system default profiles");
    }
    this.data.profiles = this.data.profiles.filter(p => p.id !== id);
    this.saveData();
    return true;
  }

  // WORKSPACES
  public getWorkspaces(): Workspace[] {
    return this.data.workspaces.sort((a, b) => a.order - b.order);
  }

  public createWorkspace(wsData: Omit<Workspace, 'id'>): Workspace {
    const newWs: Workspace = {
      ...wsData,
      id: `ws-${Date.now()}`,
    };
    this.data.workspaces.push(newWs);
    this.saveData();
    return newWs;
  }

  public updateWorkspace(id: string, wsData: Partial<Workspace>): Workspace {
    const index = this.data.workspaces.findIndex(w => w.id === id);
    if (index === -1) throw new Error(`Workspace ${id} not found`);
    this.data.workspaces[index] = { ...this.data.workspaces[index], ...wsData };
    this.saveData();
    return this.data.workspaces[index];
  }

  public deleteWorkspace(id: string): boolean {
    const ws = this.data.workspaces.find(w => w.id === id);
    if (ws?.isSystem) {
      throw new Error("Cannot delete default workspace");
    }
    this.data.workspaces = this.data.workspaces.filter(w => w.id !== id);
    this.saveData();
    return true;
  }

  // CATEGORIES
  public getCategories(): Category[] {
    return this.data.categories;
  }

  public createCategory(catData: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    this.data.categories.push(newCat);
    this.saveData();
    return newCat;
  }

  // SETTINGS
  public getSettings(): AppSettings {
    return this.data.settings;
  }

  public updateSettings(settingsData: Partial<AppSettings>): AppSettings {
    this.data.settings = { ...this.data.settings, ...settingsData };
    this.saveData();
    return this.data.settings;
  }

  // EXPORT / IMPORT
  public exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.apps && parsed.profiles && parsed.workspaces) {
        this.data = {
          apps: parsed.apps,
          profiles: parsed.profiles,
          workspaces: parsed.workspaces,
          categories: parsed.categories || DEFAULT_CATEGORIES,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          downloads: parsed.downloads || [],
        };
        this.saveData();
        return true;
      }
    } catch (err) {
      console.error('Failed to import JSON data:', err);
    }
    return false;
  }
}

export const dbService = new DatabaseService();
