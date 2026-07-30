export interface WebDeskPluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
}

export interface WebDeskPluginAPI {
  registerSidebarItem: (item: { id: string; label: string; icon: string; onClick: () => void }) => void;
  registerSettingsSection: (section: { id: string; title: string; component: React.ComponentType }) => void;
  onAppLaunched: (callback: (appId: string) => void) => void;
  onWorkspaceChanged: (callback: (workspaceId: string) => void) => void;
  showNotification: (title: string, body: string) => void;
}

export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<string, WebDeskPluginManifest> = new Map();

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  public registerPlugin(manifest: WebDeskPluginManifest, initFn: (api: WebDeskPluginAPI) => void): void {
    if (this.plugins.has(manifest.id)) {
      console.warn(`Plugin ${manifest.id} is already registered`);
      return;
    }
    this.plugins.set(manifest.id, manifest);

    const api: WebDeskPluginAPI = {
      registerSidebarItem: (item) => {
        console.log(`[Plugin:${manifest.id}] Registered sidebar item:`, item.label);
      },
      registerSettingsSection: (section) => {
        console.log(`[Plugin:${manifest.id}] Registered settings section:`, section.title);
      },
      onAppLaunched: (cb) => {
        console.log(`[Plugin:${manifest.id}] Listening for app launches`);
      },
      onWorkspaceChanged: (cb) => {
        console.log(`[Plugin:${manifest.id}] Listening for workspace changes`);
      },
      showNotification: (title, body) => {
        if ('Notification' in window) {
          new Notification(title, { body });
        }
      },
    };

    try {
      initFn(api);
      console.log(`Successfully loaded plugin ${manifest.name} v${manifest.version}`);
    } catch (err) {
      console.error(`Error initializing plugin ${manifest.name}:`, err);
    }
  }

  public getLoadedPlugins(): WebDeskPluginManifest[] {
    return Array.from(this.plugins.values());
  }
}

export const pluginManager = PluginManager.getInstance();
