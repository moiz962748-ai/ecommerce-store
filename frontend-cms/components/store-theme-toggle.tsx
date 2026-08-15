'use client';

import { Moon, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StoreThemeToggle() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.querySelector('[data-store-root="true"]') as HTMLElement | null;
    const savedMode = window.localStorage.getItem('store-theme-mode');
    const nextMode = savedMode === 'light' ? 'light' : 'dark';

    if (root) {
      root.setAttribute('data-store-mode', nextMode);
    }

    setMode(nextMode);
  }, []);

  const toggleMode = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    const root = document.querySelector('[data-store-root="true"]') as HTMLElement | null;

    if (root) {
      root.setAttribute('data-store-mode', nextMode);
    }

    setMode(nextMode);
    window.localStorage.setItem('store-theme-mode', nextMode);
  };

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="store-theme-toggle inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-store-accent hover:text-store-accent"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-store-background/80 text-store-accent">
        {mode === 'dark' ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
      <span>{mode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}
