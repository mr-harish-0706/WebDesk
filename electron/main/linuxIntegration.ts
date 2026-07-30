import fs from 'fs';
import path from 'path';
import os from 'os';
import { app } from 'electron';
import { dbService } from './db';

const homeDir = os.homedir();
const linuxApplicationsDir = path.join(homeDir, '.local', 'share', 'applications');

export class LinuxIntegrationService {
  public static ensureApplicationsDirExists(): void {
    if (process.platform !== 'linux') return;
    if (!fs.existsSync(linuxApplicationsDir)) {
      fs.mkdirSync(linuxApplicationsDir, { recursive: true });
    }
  }

  public static createDesktopLauncher(appId: string): boolean {
    if (process.platform !== 'linux') return false;

    const webApp = dbService.getAppById(appId);
    if (!webApp) return false;

    this.ensureApplicationsDirExists();

    const desktopFileName = `webdesk-${appId}.desktop`;
    const desktopFilePath = path.join(linuxApplicationsDir, desktopFileName);
    const execPath = process.env.APPIMAGE || app.getPath('exe');

    const desktopFileContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=${webApp.name} (WebDesk)
Comment=WebDesk Web App - ${webApp.url}
Exec="${execPath}" --app-id="${appId}"
Icon=${webApp.icon || 'webdesk'}
Terminal=false
Categories=Network;WebBrowser;WebDesk;
StartupWMClass=webdesk-${appId}
Actions=Launch;

[Desktop Action Launch]
Name=Open ${webApp.name}
Exec="${execPath}" --app-id="${appId}"
`;

    try {
      fs.writeFileSync(desktopFilePath, desktopFileContent, { mode: 0o755 });
      console.log(`Created Linux desktop launcher at ${desktopFilePath}`);
      return true;
    } catch (err) {
      console.error(`Failed to create desktop launcher for ${appId}:`, err);
      return false;
    }
  }

  public static removeDesktopLauncher(appId: string): boolean {
    if (process.platform !== 'linux') return false;

    const desktopFileName = `webdesk-${appId}.desktop`;
    const desktopFilePath = path.join(linuxApplicationsDir, desktopFileName);

    try {
      if (fs.existsSync(desktopFilePath)) {
        fs.unlinkSync(desktopFilePath);
        console.log(`Removed Linux desktop launcher ${desktopFilePath}`);
      }
      return true;
    } catch (err) {
      console.error(`Failed to remove desktop launcher for ${appId}:`, err);
      return false;
    }
  }

  public static syncAllLaunchers(): void {
    if (process.platform !== 'linux') return;
    const settings = dbService.getSettings();
    if (!settings.linuxDesktopLauncher) return;

    const apps = dbService.getApps();
    apps.forEach(a => {
      this.createDesktopLauncher(a.id);
    });
  }
}
