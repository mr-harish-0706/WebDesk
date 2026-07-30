import React, { useState, useEffect } from 'react';
import { X, Globe, Sparkles, Terminal, Code, Palette, ShieldCheck } from 'lucide-react';
import { WebApp, Profile, Workspace, Category } from '../types';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Omit<WebApp, 'id' | 'createdAt'> | Partial<WebApp>) => void;
  initialApp?: WebApp | null;
  profiles: Profile[];
  workspaces: Workspace[];
  categories: Category[];
}

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialApp,
  profiles,
  workspaces,
  categories,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'General');
  const [profileId, setProfileId] = useState(profiles[0]?.id || 'profile-personal');
  const [workspaceId, setWorkspaceId] = useState(workspaces[0]?.id || 'ws-all');
  const [userAgent, setUserAgent] = useState('');
  const [customCss, setCustomCss] = useState('');
  const [customJs, setCustomJs] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [createLinuxLauncher, setCreateLinuxLauncher] = useState(true);

  useEffect(() => {
    if (initialApp) {
      setName(initialApp.name);
      setUrl(initialApp.url);
      setIcon(initialApp.icon || '');
      setCategory(initialApp.category);
      setProfileId(initialApp.profileId);
      setWorkspaceId(initialApp.workspaceId);
      setUserAgent(initialApp.userAgent || '');
      setCustomCss(initialApp.customCss || '');
      setCustomJs(initialApp.customJs || '');
    } else {
      setName('');
      setUrl('');
      setIcon('');
      setCategory(categories[0]?.name || 'General');
      setProfileId(profiles[0]?.id || 'profile-personal');
      setWorkspaceId(workspaces[0]?.id || 'ws-all');
      setUserAgent('');
      setCustomCss('');
      setCustomJs('');
    }
  }, [initialApp, isOpen, profiles, workspaces, categories]);

  if (!isOpen) return null;

  const handleScrape = async () => {
    if (!url) return;
    setIsScraping(true);
    try {
      const res = await window.webdesk.scrapeMetadata(url);
      if (res.title && !name) setName(res.title);
      if (res.iconUrl && !icon) setIcon(res.iconUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScraping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    let formattedUrl = url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    onSave({
      name,
      url: formattedUrl,
      icon: icon || `https://${new URL(formattedUrl).hostname}/favicon.ico`,
      category,
      profileId,
      workspaceId,
      isFavorite: initialApp ? initialApp.isFavorite : false,
      isPinned: initialApp ? initialApp.isPinned : false,
      isArchived: initialApp ? initialApp.isArchived : false,
      order: initialApp ? initialApp.order : 0,
      userAgent: userAgent || undefined,
      customCss: customCss || undefined,
      customJs: customJs || undefined,
      notificationsEnabled: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">
              {initialApp ? 'Edit Web Application' : 'Add New Web Application'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* URL & Auto-Scrape */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Web Application URL *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://app.slack.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleScrape}
                disabled={isScraping || !url}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isScraping ? 'Auto-fetching...' : 'Auto-fill'}</span>
              </button>
            </div>
          </div>

          {/* Name & Icon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                App Name *
              </label>
              <input
                type="text"
                placeholder="Slack"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Icon URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://.../favicon.ico"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Profile & Workspace Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Session Profile (Isolated Storage)
              </label>
              <select
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.partition})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Workspace
              </label>
              <select
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Customizations */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Advanced Settings
            </span>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Custom User Agent</label>
              <input
                type="text"
                placeholder="Default Linux Chrome User Agent"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Custom CSS Injection</label>
              <textarea
                placeholder="body { background-color: #000 !important; }"
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                rows={2}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder-slate-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-500/25 transition-all"
            >
              {initialApp ? 'Save Changes' : 'Install Web App'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
