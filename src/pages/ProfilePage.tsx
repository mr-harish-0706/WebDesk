import React, { useState } from 'react';
import { Plus, ShieldCheck, User, Trash2, Key, HardDrive, Lock, Globe, X } from 'lucide-react';
import { Profile, WebApp } from '../types';

interface ProfilePageProps {
  profiles: Profile[];
  apps: WebApp[];
  onCreateProfile: (profile: Omit<Profile, 'id'>) => void;
  onDeleteProfile: (id: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profiles,
  apps,
  onCreateProfile,
  onDeleteProfile,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [proxyUrl, setProxyUrl] = useState('');

  const presetColors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onCreateProfile({
      name,
      color,
      icon: 'User',
      partition: `persist:${name.toLowerCase().replace(/\s+/g, '-')}`,
      proxyUrl: proxyUrl || undefined,
    });
    setName('');
    setProxyUrl('');
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Isolated Profiles</h1>
          <p className="text-xs text-slate-400">
            Each profile operates with completely isolated cookies, cache, local storage, and session state
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Profile</span>
        </button>
      </div>

      {/* Grid of Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((p) => {
          const appCount = apps.filter((a) => a.profileId === p.id).length;

          return (
            <div
              key={p.id}
              className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: `${p.color}20`, border: `1px solid ${p.color}40` }}
                    >
                      <User className="w-5 h-5" style={{ color: p.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                        {p.isSystem && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                            System
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{p.partition}</span>
                    </div>
                  </div>

                  {!p.isSystem && (
                    <button
                      onClick={() => onDeleteProfile(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-700/40">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cookie & Storage Isolation</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Enforced
                    </span>
                  </div>

                  {p.proxyUrl && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-700/40">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span>Proxy: {p.proxyUrl}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400 mt-4">
                <span>Apps assigned: <strong className="text-white">{appCount}</strong></span>
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
              <h3 className="text-base font-semibold text-white">Create Isolated Profile</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Profile Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Freelance Client B"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Color Tag
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custom Proxy (Optional)
                </label>
                <input
                  type="text"
                  placeholder="http://proxy.example.com:8080"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
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
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
