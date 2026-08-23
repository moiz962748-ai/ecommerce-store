'use client';

import React, { useEffect } from 'react';

export function StoreThemeToggle({ subdomain }: { subdomain?: string }) {
  useEffect(() => {
    const rootStore = document.querySelector('[data-store-root="true"]');
    const html = document.documentElement;

    const lowerSub = (subdomain || '').toLowerCase();
    const isBoutique = lowerSub.includes('boutique') || lowerSub.includes('luxury');

    if (isBoutique) {
      if (rootStore) {
        rootStore.setAttribute('data-store-mode', 'dark');
        rootStore.classList.add('store-dark');
        rootStore.classList.remove('store-light');
      }
      html.setAttribute('data-theme', 'dark');
      html.classList.remove('light');
      html.classList.add('dark');
      localStorage.setItem(`store_mode_${subdomain || 'default'}`, 'dark');
    } else {
      if (rootStore) {
        rootStore.setAttribute('data-store-mode', 'light');
        rootStore.classList.add('store-light');
        rootStore.classList.remove('store-dark');
      }
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem(`store_mode_${subdomain || 'default'}`, 'light');
    }
  }, [subdomain]);

  return null;
}