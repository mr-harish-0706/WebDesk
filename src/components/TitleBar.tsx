import React, { useState, useEffect } from 'react';
import { Minus, Square, Copy, X, Monitor, ShieldCheck, Sparkles } from 'lucide-react';

interface TitleBarProps {
  onOpenCommandPalette: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({ onOpenCommandPalette }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const checkMaximized = async () => {
      if (window.webdesk) {
        const max = await window.webdesk.isMaximized();
        setIsMaximized(max);
      }
    };
    checkMaximized();
  }, []);

  const handleMinimize = () => window.webdesk?.minimizeWindow();
  const handleMaximize = async () => {
    window.webdesk?.maximizeWindow();
    if (window.webdesk) {
      const max = await window.webdesk.isMaximized();
      setIsMaximized(max);
    }
  };
  const handleClose = () => window.webdesk?.closeWindow();

  return (
    <header className="h-10 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between px-3 select-none app-drag-region z-50">
      {/* Left: Brand & App Title */}
      <div className="flex items-center gap-2 app-no-drag">
        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-glow">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs font-semibold tracking-wide bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
          WebDesk
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
          v1.0 Linux
        </span>
      </div>

      {/* Middle: Command Palette Trigger */}
      <button
        onClick={onOpenCommandPalette}
        className="app-no-drag flex items-center gap-2 px-3 py-1 text-xs text-slate-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-md transition-all shadow-inner group"
      >
        <span className="group-hover:text-slate-200">Search apps, workspaces or commands...</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-900 text-slate-300 border border-slate-700 rounded shadow">
          Ctrl + K
        </kbd>
      </button>

      {/* Right: Window Controls */}
      <div className="flex items-center gap-1 app-no-drag">
        <button
          onClick={handleMinimize}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          {isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
        </button>
        <button
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-600 rounded transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
