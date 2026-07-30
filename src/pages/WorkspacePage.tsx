import React, { useState } from 'react';
import { Plus, LayoutGrid, Trash2, Edit3, Code, MessageSquare, Sparkles, CheckSquare, FolderPlus, X } from 'lucide-react';
import { Workspace, WebApp } from '../types';

interface WorkspacePageProps {
  workspaces: Workspace[];
  apps: WebApp[];
  onCreateWorkspace: (workspace: Omit<Workspace, 'id'>) => void;
  onDeleteWorkspace: (id: string) => void;
  onSelectWorkspace: (id: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  workspaces,
  apps,
  onCreateWorkspace,
  onDeleteWorkspace,
  onSelectWorkspace,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('LayoutGrid');

  const presetColors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onCreateWorkspace({
      name,
      color,
      icon,
      order: workspaces.length,
    });
    setName('');
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Workspaces</h1>
          <p className="text-xs text-slate-400">
            Organize your web applications into custom contexts like Work, College, or Development
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Workspace</span>
        </button>
      </div>

      {/* Grid of Workspaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((ws) => {
          const appCount = ws.id === 'ws-all' 
            ? apps.length 
            : apps.filter((a) => a.workspaceId === ws.id).length;

          return (
            <div
              key={ws.id}
              onClick={() => onSelectWorkspace(ws.id)}
              className="group relative bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: `${ws.color}20`, border: `1px solid ${ws.color}40` }}
                    >
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: ws.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {ws.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {appCount} {appCount === 1 ? 'App' : 'Apps'} Installed
                      </span>
                    </div>
                  </div>

                  {!ws.isSystem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteWorkspace(ws.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete Workspace"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Apps Preview */}
              <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                <span>Click to view workspace apps</span>
                <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Create New Workspace</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Design & Research"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        color === c ? 'scale-110 border-white shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
