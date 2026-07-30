import { app, BrowserWindow, ipcMain, shell, dialog, Tray, Menu, nativeImage, NativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { dbService } from './db';
import { sessionManager, AppSessionManager } from './sessionManager';
import { LinuxIntegrationService } from './linuxIntegration';
import { autoUpdateService } from './autoUpdater';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1000,
    minHeight: 650,
    frame: false, // Frameless window for custom modern UI titlebar
    titleBarStyle: 'hidden',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  autoUpdateService.init(mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createSystemTray() {
  const iconPath = path.join(__dirname, '../../build/icons/icon.png');
  let icon: NativeImage;
  
  if (fs.existsSync(iconPath)) {
    icon = nativeImage.createFromPath(iconPath).resize({ width: 18, height: 18 });
  } else {
    // Fallback transparent icon
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open WebDesk',
      click: () => {
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.show();
          mainWindow.focus();
        } else {
          createMainWindow();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit WebDesk',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('WebDesk - Universal Web App Manager');
  tray.setContextMenu(contextMenu);
}

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    // Check if launched with --app-id
    const appIdArg = commandLine.find(arg => arg.startsWith('--app-id='));
    if (appIdArg) {
      const appId = appIdArg.split('=')[1];
      if (appId) {
        sessionManager.launchApp(appId);
        return;
      }
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    // Sync Linux desktop entries on startup
    LinuxIntegrationService.syncAllLaunchers();

    createMainWindow();
    createSystemTray();

    // Check if launched with direct app-id command line flag
    const appIdArg = process.argv.find(arg => arg.startsWith('--app-id='));
    if (appIdArg) {
      const appId = appIdArg.split('=')[1];
      if (appId) {
        sessionManager.launchApp(appId);
      }
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  const settings = dbService.getSettings();
  if (!settings.closeToTray && process.platform !== 'darwin') {
    app.quit();
  }
});

// Register IPC Handlers
function setupIPCHandlers() {
  // DB Apps
  ipcMain.handle('db:getApps', () => dbService.getApps());
  ipcMain.handle('db:getAppById', (_, id) => dbService.getAppById(id));
  ipcMain.handle('db:createApp', (_, appData) => {
    const created = dbService.createApp(appData);
    if (dbService.getSettings().linuxDesktopLauncher) {
      LinuxIntegrationService.createDesktopLauncher(created.id);
    }
    return created;
  });
  ipcMain.handle('db:updateApp', (_, id, appData) => {
    const updated = dbService.updateApp(id, appData);
    if (dbService.getSettings().linuxDesktopLauncher) {
      LinuxIntegrationService.createDesktopLauncher(id);
    }
    return updated;
  });
  ipcMain.handle('db:deleteApp', (_, id) => {
    sessionManager.closeAppWindow(id);
    LinuxIntegrationService.removeDesktopLauncher(id);
    return dbService.deleteApp(id);
  });
  ipcMain.handle('db:duplicateApp', (_, id) => dbService.duplicateApp(id));
  ipcMain.handle('db:reorderApps', (_, orders) => dbService.reorderApps(orders));
  ipcMain.handle('app:scrapeMetadata', (_, url) => AppSessionManager.scrapeMetadata(url));

  // App Execution
  ipcMain.handle('app:launch', (_, id) => sessionManager.launchApp(id));
  ipcMain.handle('app:closeWindow', (_, id) => sessionManager.closeAppWindow(id));
  ipcMain.handle('app:getOpenWindows', () => sessionManager.getOpenWindowIds());

  // Profiles
  ipcMain.handle('db:getProfiles', () => dbService.getProfiles());
  ipcMain.handle('db:createProfile', (_, profile) => dbService.createProfile(profile));
  ipcMain.handle('db:updateProfile', (_, id, profile) => dbService.updateProfile(id, profile));
  ipcMain.handle('db:deleteProfile', (_, id) => dbService.deleteProfile(id));

  // Workspaces
  ipcMain.handle('db:getWorkspaces', () => dbService.getWorkspaces());
  ipcMain.handle('db:createWorkspace', (_, ws) => dbService.createWorkspace(ws));
  ipcMain.handle('db:updateWorkspace', (_, id, ws) => dbService.updateWorkspace(id, ws));
  ipcMain.handle('db:deleteWorkspace', (_, id) => dbService.deleteWorkspace(id));

  // Categories
  ipcMain.handle('db:getCategories', () => dbService.getCategories());
  ipcMain.handle('db:createCategory', (_, cat) => dbService.createCategory(cat));

  // Settings
  ipcMain.handle('db:getSettings', () => dbService.getSettings());
  ipcMain.handle('db:updateSettings', (_, settings) => dbService.updateSettings(settings));

  // Linux Launcher
  ipcMain.handle('linux:createLauncher', (_, appId) => LinuxIntegrationService.createDesktopLauncher(appId));
  ipcMain.handle('linux:removeLauncher', (_, appId) => LinuxIntegrationService.removeDesktopLauncher(appId));

  // Export / Import
  ipcMain.handle('db:exportData', () => dbService.exportData());
  ipcMain.handle('db:importData', (_, json) => dbService.importData(json));

  // Window Controls
  ipcMain.on('window:minimize', () => mainWindow?.minimize());
  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.on('window:close', () => {
    const settings = dbService.getSettings();
    if (settings.minimizeToTray) {
      mainWindow?.hide();
    } else {
      mainWindow?.close();
    }
  });
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() || false);

  // Shell & Dialog
  ipcMain.handle('system:openExternal', (_, url) => shell.openExternal(url));
  ipcMain.handle('dialog:selectDirectory', async () => {
    if (!mainWindow) return null;
    const res = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
    return res.canceled ? null : res.filePaths[0];
  });
  ipcMain.handle('dialog:selectFile', async (_, filters) => {
    if (!mainWindow) return null;
    const res = await dialog.showOpenDialog(mainWindow, { properties: ['openFile'], filters });
    return res.canceled ? null : res.filePaths[0];
  });
}

setupIPCHandlers();
