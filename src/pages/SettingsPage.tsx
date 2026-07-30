import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Terminal,
  Download,
  Upload,
  HardDrive,
  Keyboard,
  Shield,
  Bell,
  Check,
  RotateCcw
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onExportData: () => void;
  onImportData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
}) => {
  const [exportMessage, setExportMessage] = useState('');

  const accentColors = [
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Rose', color: '#ec4899' },
    { name: 'Purple', color: '#8b5cf6' },
    { name: 'Cyan', color: '#06b6d4' },
  ];

  const handleExport = async () => {
    onExportData();
    setExportMessage('Database successfully exported!');
    setTimeout(() => setExportMessage(''), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white">Application Settings</h1>
        <p className="text-xs text-slate-400">
          Customize WebDesk appearance, Linux integration, behavior, and data backups
        </p>
      </div>

      {/* Theme & Appearance */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-700/50 pb-3">
          <Palette className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Appearance & Theme</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Theme Mode</label>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => onUpdateSettings({ theme: t })}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize border transition-all ${
                    settings.theme === t
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                      : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  {t} Mode
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Accent Color</label>
            <div className="flex items-center gap-2 pt-1">
              {accentColors.map((ac) => (
                <button
                  key={ac.color}
                  onClick={() => onUpdateSettings({ accentColor: ac.color })}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    settings.accentColor === ac.color ? 'scale-110 border-white shadow-lg' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: ac.color }}
                  title={ac.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Linux Desktop Integration */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-700/50 pb-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Linux Desktop System Integration</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/40">
            <div>
              <div className="text-xs font-medium text-white">Auto-generate Linux .desktop Launchers</div>
              <p className="text-[11px] text-slate-400">
                Automatically registers installed web apps in <code className="font-mono text-emerald-400">~/.local/share/applications/</code> for GNOME/KDE search & dock
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.linuxDesktopLauncher}
              onChange={(e) => onUpdateSettings({ linuxDesktopLauncher: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/40">
            <div>
              <div className="text-xs font-medium text-white">Minimize to System Tray</div>
              <p className="text-[11px] text-slate-400">Keep WebDesk active in background system tray upon minimizing</p>
            </div>
            <input
              type="checkbox"
              checked={settings.minimizeToTray}
              onChange={(e) => onUpdateSettings({ minimizeToTray: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-700/50 pb-3">
          <HardDrive className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">Data Management, Backup & Restore</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Database JSON</span>
          </button>

          <button
            onClick={onImportData}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import Database JSON</span>
          </button>

          {exportMessage && (
            <span className="text-xs font-medium text-emerald-400 animate-in fade-in">
              {exportMessage}
            </span>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Cheat Sheet */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-700/50 pb-3">
          <Keyboard className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Keyboard Shortcuts</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-700/40">
            <span className="text-slate-300">Open Command Palette</span>
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">Ctrl + K</kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-700/40">
            <span className="text-slate-300">New Web App</span>
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">Ctrl + N</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
