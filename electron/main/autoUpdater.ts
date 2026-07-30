import { BrowserWindow, ipcMain } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

export class AutoUpdateService {
  private static instance: AutoUpdateService;
  private mainWindow: BrowserWindow | null = null;

  public static getInstance(): AutoUpdateService {
    if (!AutoUpdateService.instance) {
      AutoUpdateService.instance = new AutoUpdateService();
    }
    return AutoUpdateService.instance;
  }

  public init(window: BrowserWindow): void {
    this.mainWindow = window;

    // Configure autoUpdater
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    // Event Listeners
    autoUpdater.on('checking-for-update', () => {
      this.sendToRenderer('updater:status', { status: 'checking' });
    });

    autoUpdater.on('update-available', (info: any) => {
      this.sendToRenderer('updater:status', { status: 'available', info });
    });

    autoUpdater.on('update-not-available', (info: any) => {
      this.sendToRenderer('updater:status', { status: 'not-available', info });
    });

    autoUpdater.on('error', (err: Error) => {
      console.error('AutoUpdater Error:', err);
      this.sendToRenderer('updater:status', { status: 'error', error: err.message });
    });

    autoUpdater.on('download-progress', (progressObj: any) => {
      this.sendToRenderer('updater:progress', progressObj);
    });

    autoUpdater.on('update-downloaded', (info: any) => {
      this.sendToRenderer('updater:status', { status: 'downloaded', info });
    });

    // IPC Handlers
    ipcMain.handle('updater:checkForUpdates', () => {
      return autoUpdater.checkForUpdates();
    });

    ipcMain.handle('updater:downloadUpdate', () => {
      return autoUpdater.downloadUpdate();
    });

    ipcMain.handle('updater:quitAndInstall', () => {
      autoUpdater.quitAndInstall();
    });
  }

  private sendToRenderer(channel: string, data: any): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, data);
    }
  }
}

export const autoUpdateService = AutoUpdateService.getInstance();
