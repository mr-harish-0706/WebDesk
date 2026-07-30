import React, { useState } from 'react';
import {
  ExternalLink,
  Star,
  Pin,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Terminal,
  ShieldCheck,
  Check
} from 'lucide-react';
import { WebApp, Profile, Workspace } from '../types';

interface AppCardProps {
  app: WebApp;
  profile?: Profile;
  workspace?: Workspace;
  isOpen: boolean;
  onLaunch: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  onEdit: (app: WebApp) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateDesktopLauncher: (id: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  profile,
  workspace,
  isOpen,
  onLaunch,
  onToggleFavorite,
  onTogglePin,
  onEdit,
  onDuplicate,
  onDelete,
  onCreateDesktopLauncher,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [launcherCreated, setLauncherCreated] = useState(false);

  const handleCreateLauncher = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateDesktopLauncher(app.id);
    setLauncherCreated(true);
    setTimeout(() => setLauncherCreated(false), 2000);
    setShowMenu(false);
  };

  return (
    <div
      onClick={() => onLaunch(app.id)}
      className="group relative bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between"
    >
      {/* Top Controls & Badges */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* App Icon */}
            <div className="relative w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/80 p-2 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              {app.icon ? (
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-full h-full object-contain rounded-md"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-base font-bold text-blue-400">
                  {app.name.charAt(0)}
                </span>
              )}

              {/* Status Dot */}
              {isOpen && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
              )}
            </div>

            {/* App Title & URL */}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                  {app.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                {app.url.replace(/^https?:\/\//, '')}
              </p>
            </div>
          </div>

          {/* Quick Actions (Favorite, Menu) */}
          <div className="flex items-center gap-1 app-no-drag">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(app.id, !app.isFavorite);
              }}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700/50 transition-colors ${
                app.isFavorite ? 'text-amber-400' : ''
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {/* Context Dropdown Menu */}
              {showMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-7 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-1 text-xs"
                >
                  <button
                    onClick={() => {
                      onEdit(app);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Edit Web App</span>
                  </button>

                  <button
                    onClick={() => {
                      onTogglePin(app.id, !app.isPinned);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Pin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{app.isPinned ? 'Unpin from Sidebar' : 'Pin to Sidebar'}</span>
                  </button>

                  <button
                    onClick={handleCreateLauncher}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Create .desktop Launcher</span>
                  </button>

                  <button
                    onClick={() => {
                      onDuplicate(app.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Duplicate App</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      onDelete(app.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Web App</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info Badges */}
      <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {profile && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 text-slate-200"
              style={{ backgroundColor: `${profile.color}25`, borderColor: `${profile.color}50` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: profile.color }} />
              {profile.name}
            </span>
          )}

          {workspace && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/40">
              {workspace.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-blue-400 group-hover:translate-x-0.5 transition-transform">
          <span className="text-[11px] font-semibold">Launch</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
