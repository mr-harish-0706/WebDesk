import { BrowserWindow, session, shell, dialog } from 'electron';
import path from 'path';
import { dbService } from './db';
import { FaviconScrapeResult, WebApp } from '../../src/types';

export class AppSessionManager {
  private activeWindows: Map<string, BrowserWindow> = new Map();

  public getOpenWindowIds(): string[] {
    return Array.from(this.activeWindows.keys());
  }

  public isAppOpen(appId: string): boolean {
    return this.activeWindows.has(appId);
  }

  public getWindow(appId: string): BrowserWindow | undefined {
    return this.activeWindows.get(appId);
  }

  public launchApp(appId: string): boolean {
    const webApp = dbService.getAppById(appId);
    if (!webApp) {
      console.error(`App ${appId} not found`);
      return false;
    }

    // If window already open, focus it
    if (this.activeWindows.has(appId)) {
      const existingWin = this.activeWindows.get(appId);
      if (existingWin && !existingWin.isDestroyed()) {
        if (existingWin.isMinimized()) existingWin.restore();
        existingWin.focus();
        return true;
      }
    }

    const profile = dbService.getProfiles().find(p => p.id === webApp.profileId);
    const partitionName = profile?.partition || `persist:profile-${webApp.profileId}`;

    // Get or create isolated session partition
    const ses = session.fromPartition(partitionName);

    // Apply Proxy if specified in profile
    if (profile?.proxyUrl) {
      ses.setProxy({ proxyRules: profile.proxyUrl });
    }

    // Apply User Agent if specified
    const customUserAgent = webApp.userAgent || profile?.userAgent || 
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 WebDesk/1.0';

    const win = new BrowserWindow({
      width: 1280,
      height: 800,
      title: webApp.name,
      icon: webApp.icon,
      webPreferences: {
        partition: partitionName,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
      },
    });

    win.webContents.setUserAgent(customUserAgent);

    // Permission handling (e.g. notifications)
    ses.setPermissionRequestHandler((webContents, permission, callback) => {
      const allowedPermissions = ['notifications', 'fullscreen', 'clipboard-read', 'clipboard-sanitized-write', 'media'];
      callback(allowedPermissions.includes(permission));
    });

    // Custom CSS injection if defined
    if (webApp.customCss) {
      win.webContents.on('did-finish-load', () => {
        win.webContents.insertCSS(webApp.customCss!);
      });
    }

    // Custom JS injection if defined
    if (webApp.customJs) {
      win.webContents.on('did-finish-load', () => {
        win.webContents.executeJavaScript(webApp.customJs!).catch(console.error);
      });
    }

    // Handle new-window requests securely
    win.webContents.setWindowOpenHandler(({ url }) => {
      try {
        const parsed = new URL(url);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          shell.openExternal(url);
        } else {
          console.warn(`Blocked external launch of unvalidated URL scheme: ${url}`);
        }
      } catch (err) {
        console.error('Invalid URL opening attempt:', err);
      }
      return { action: 'deny' };
    });

    // Update last opened timestamp
    dbService.updateApp(appId, { lastOpened: new Date().toISOString() });

    win.loadURL(webApp.url);

    this.activeWindows.set(appId, win);

    win.on('closed', () => {
      this.activeWindows.delete(appId);
    });

    return true;
  }

  public closeAppWindow(appId: string): boolean {
    const win = this.activeWindows.get(appId);
    if (win && !win.isDestroyed()) {
      win.close();
      this.activeWindows.delete(appId);
      return true;
    }
    return false;
  }

  public static async scrapeMetadata(targetUrl: string): Promise<FaviconScrapeResult> {
    try {
      let formattedUrl = targetUrl;
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const parsedUrl = new URL(formattedUrl);
      const origin = parsedUrl.origin;
      const faviconUrl = `${origin}/favicon.ico`;

      return {
        title: parsedUrl.hostname.replace('www.', ''),
        iconUrl: faviconUrl,
      };
    } catch (err) {
      console.error('Failed to scrape metadata:', err);
      return {};
    }
  }
}

export const sessionManager = new AppSessionManager();
