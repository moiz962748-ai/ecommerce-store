'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function StoreThemeToggle({ subdomain }: { subdomain?: string }) {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  const lowerSub = (subdomain || '').toLowerCase();
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');

  useEffect(() => {
    const stored = localStorage.getItem(`store_mode_${subdomain || 'default'}`);
    const rootMode = document.querySelector('[data-store-root="true"]')?.getAttribute('data-store-mode');
    
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
      applyMode(stored);
    } else if (rootMode === 'light' || rootMode === 'dark') {
      setMode(rootMode);
    }
  }, [subdomain]);

  const applyMode = (newMode: 'dark' | 'light') => {
    const root = document.querySelector('[data-store-root="true"]') || document.documentElement;
    root.setAttribute('data-store-mode', newMode);
    if (newMode === 'light') {
      root.classList.add('store-light');
      root.classList.remove('store-dark');
    } else {
      root.classList.add('store-dark');
      root.classList.remove('store-light');
    }
  };

  const toggleMode = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    localStorage.setItem(`store_mode_${subdomain || 'default'}`, nextMode);
    applyMode(nextMode);
  };

  const isLight = mode === 'light';

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label="Toggle Light / Dark Mode"
      title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 ${
        isLight
          ? isSports
            ? 'border-slate-200 bg-slate-100/90 text-slate-700 hover:border-emerald-500/60 hover:bg-emerald-50 hover:text-emerald-600'
            : isClothing
            ? 'border-slate-200 bg-slate-100/90 text-slate-700 hover:border-purple-500/60 hover:bg-purple-50 hover:text-purple-600'
            : 'border-slate-200 bg-slate-100/90 text-slate-700 hover:border-cyan-500/60 hover:bg-cyan-50 hover:text-cyan-600'
          : isSports
          ? 'border-emerald-950/80 bg-slate-900/80 text-emerald-300 hover:border-emerald-500/60 hover:bg-emerald-950/40 hover:text-emerald-200'
          : isClothing
          ? 'border-purple-950/80 bg-slate-900/80 text-purple-300 hover:border-purple-500/60 hover:bg-purple-950/40 hover:text-purple-200'
          : 'border-slate-800 bg-slate-900/80 text-cyan-300 hover:border-cyan-500/60 hover:bg-cyan-950/40 hover:text-cyan-200'
      }`}
    >
      {isLight ? (
        <Moon size={16} className="transition-transform duration-300 hover:-rotate-12" />
      ) : (
        <Sun size={16} className="transition-transform duration-300 hover:rotate-45" />
      )}
    </button>
  );
}