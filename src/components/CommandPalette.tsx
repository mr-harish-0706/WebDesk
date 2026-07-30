import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Settings, User, LayoutGrid, Plus, Terminal } from 'lucide-react';
import { WebApp, Workspace, Profile } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  apps: WebApp[];
  workspaces: Workspace[];
  profiles: Profile[];
  onLaunchApp: (id: string) => void;
  onSelectTab: (tab: 'apps' | 'workspaces' | 'profiles' | 'settings') => void;
  onOpenAddModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  apps,
  workspaces,
  profiles,
  onLaunchApp,
  onSelectTab,
  onOpenAddModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const filteredApps = apps.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.url.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [
    { type: 'action', id: 'act-add', title: 'Add New Web Application', subtitle: 'Action', icon: <Plus className="w-4 h-4 text-blue-400" />, action: () => { onOpenAddModal(); onClose(); } },
    { type: 'action', id: 'act-settings', title: 'Open Settings', subtitle: 'Action', icon: <Settings className="w-4 h-4 text-indigo-400" />, action: () => { onSelectTab('settings'); onClose(); } },
    ...filteredApps.map((a) => ({
      type: 'app',
      id: a.id,
      title: `Launch ${a.name}`,
      subtitle: a.url,
      icon: a.icon ? <img src={a.icon} alt="" className="w-4 h-4 object-contain rounded" /> : <ExternalLink className="w-4 h-4 text-blue-400" />,
      action: () => { onLaunchApp(a.id); onClose(); },
    })),
    ...filteredWorkspaces.map((w) => ({
      type: 'workspace',
      id: w.id,
      title: `Switch Workspace: ${w.name}`,
      subtitle: 'Workspace',
      icon: <LayoutGrid className="w-4 h-4 text-cyan-400" />,
      action: () => { onSelectTab('apps'); onClose(); },
    })),
    ...filteredProfiles.map((p) => ({
      type: 'profile',
      id: p.id,
      title: `Profile: ${p.name}`,
      subtitle: p.partition,
      icon: <User className="w-4 h-4 text-purple-400" />,
      action: () => { onSelectTab('profiles'); onClose(); },
    })),
  ];

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].action();
      }
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-24 z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col"
      >
        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Type a command or app name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownList}
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching apps or commands found
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-slate-100">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <kbd className="px-2 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                      Enter ↵
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
