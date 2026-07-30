import React from 'react';
import { Search, Globe, Plus } from 'lucide-react';
import { WebApp, Profile, Workspace, Category } from '../types';
import { AppCard } from '../components/AppCard';

interface DashboardPageProps {
  filteredApps: WebApp[];
  profiles: Profile[];
  workspaces: Workspace[];
  categories: Category[];
  activeWorkspaceId: string;
  activeProfileId: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openWindowIds: string[];
  onLaunchApp: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  onEditApp: (app: WebApp) => void;
  onDuplicateApp: (id: string) => void;
  onDeleteApp: (id: string) => void;
  onCreateDesktopLauncher: (id: string) => void;
  onOpenAddModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  filteredApps,
  profiles,
  workspaces,
  categories,
  activeWorkspaceId,
  activeProfileId,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  openWindowIds,
  onLaunchApp,
  onToggleFavorite,
  onTogglePin,
  onEditApp,
  onDuplicateApp,
  onDeleteApp,
  onCreateDesktopLauncher,
  onOpenAddModal,
}) => {
  const activeWorkspaceName =
    activeWorkspaceId === 'ws-all'
      ? 'All Applications'
      : workspaces.find((w) => w.id === activeWorkspaceId)?.name || 'Workspace';

  const activeProfileName =
    profiles.find((p) => p.id === activeProfileId)?.name || 'Personal';

  return (
    <div className="p-6 space-y-6 flex-1 flex flex-col">
      {/* Header Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{activeWorkspaceName}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {filteredApps.length}
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Isolated session profile: <strong className="text-slate-200">{activeProfileName}</strong>
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter web apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', ...categories.map((c) => c.name)].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Cards Grid */}
      {filteredApps.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-3xl my-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-blue-400 mb-3">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">No Web Applications Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Add your favorite web services like Slack, Notion, GitHub, or ChatGPT to turn them into isolated native desktop applications.
          </p>
          <button
            onClick={onOpenAddModal}
            className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Install First Web App</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              profile={profiles.find((p) => p.id === app.profileId)}
              workspace={workspaces.find((w) => w.id === app.workspaceId)}
              isOpen={openWindowIds.includes(app.id)}
              onLaunch={onLaunchApp}
              onToggleFavorite={onToggleFavorite}
              onTogglePin={onTogglePin}
              onEdit={onEditApp}
              onDuplicate={onDuplicateApp}
              onDelete={onDeleteApp}
              onCreateDesktopLauncher={onCreateDesktopLauncher}
            />
          ))}
        </div>
      )}
    </div>
  );
};
