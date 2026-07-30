import React from 'react';
import {
  LayoutGrid,
  Layers,
  UserCheck,
  Settings as SettingsIcon,
  Plus,
  Pin,
  ExternalLink,
  Code,
  MessageSquare,
  Sparkles,
  CheckSquare,
  Briefcase,
  User,
  GraduationCap,
  Gamepad2,
  FolderKanban
} from 'lucide-react';
import { Workspace, Profile, WebApp } from '../types';

interface SidebarProps {
  currentTab: 'apps' | 'workspaces' | 'profiles' | 'settings';
  setCurrentTab: (tab: 'apps' | 'workspaces' | 'profiles' | 'settings') => void;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  profiles: Profile[];
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  pinnedApps: WebApp[];
  onOpenAddModal: () => void;
  onLaunchApp: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  workspaces,
  activeWorkspaceId,
  setActiveWorkspaceId,
  profiles,
  activeProfileId,
  setActiveProfileId,
  pinnedApps,
  onOpenAddModal,
  onLaunchApp,
}) => {
  const getWorkspaceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-4 h-4" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'CheckSquare': return <CheckSquare className="w-4 h-4" />;
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

  const getProfileIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-3.5 h-3.5" />;
      case 'GraduationCap': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Gamepad2': return <Gamepad2 className="w-3.5 h-3.5" />;
      default: return <User className="w-3.5 h-3.5" />;
    }
  };

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between p-3 select-none">
      {/* Top Section */}
      <div className="space-y-5">
        {/* Primary Add App Button */}
        <button
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Web App</span>
        </button>

        {/* Main Navigation Tabs */}
        <nav className="space-y-1">
          <button
            onClick={() => setCurrentTab('apps')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'apps'
                ? 'bg-slate-800 text-blue-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Dashboard & Apps</span>
          </button>

          <button
            onClick={() => setCurrentTab('workspaces')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'workspaces'
                ? 'bg-slate-800 text-blue-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Workspaces</span>
          </button>

          <button
            onClick={() => setCurrentTab('profiles')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'profiles'
                ? 'bg-slate-800 text-blue-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Isolated Profiles</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'settings'
                ? 'bg-slate-800 text-blue-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Workspaces Filter Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Workspaces</span>
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {workspaces.map(ws => {
              const isActive = activeWorkspaceId === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspaceId(ws.id);
                    setCurrentTab('apps');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-slate-100 font-medium border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ws.color }} />
                    <span className="truncate">{ws.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pinned Quick Launch Shortcuts */}
        {pinnedApps.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-1.5 px-3 mb-2 text-[11px] font-semibold text-slate-500 uppercase">
              <Pin className="w-3 h-3" />
              <span>Pinned Apps</span>
            </div>
            <div className="space-y-1">
              {pinnedApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => onLaunchApp(app.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all group"
                >
                  {app.icon ? (
                    <img src={app.icon} alt="" className="w-4 h-4 rounded object-contain" />
                  ) : (
                    <div className="w-4 h-4 rounded bg-slate-700 flex items-center justify-center text-[10px]">
                      {app.name.charAt(0)}
                    </div>
                  )}
                  <span className="truncate">{app.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Profile Status Selector */}
      <div className="pt-3 border-t border-slate-800">
        <div className="px-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
            Active Session Profile
          </label>
          <div className="grid grid-cols-2 gap-1">
            {profiles.map(p => {
              const isSelected = activeProfileId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProfileId(p.id)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                      : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="truncate">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
