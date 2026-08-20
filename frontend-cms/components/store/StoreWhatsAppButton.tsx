'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export function StoreWhatsAppButton({ subdomain }: { subdomain: string }) {
  const [whatsappConfig, setWhatsappConfig] = useState<{
    enabled: boolean;
    phone: string;
    defaultMessage?: string;
  } | null>(null);

  useEffect(() => {
    if (!subdomain) return;
    async function loadConfig() {
      try {
        const store = await apiClient(`/public/stores/${subdomain}`);
        const config = store?.templateConfig?.social?.whatsapp;
        if (config && config.enabled && config.phone) {
          setWhatsappConfig(config);
        }
      } catch {
        // Fallback
      }
    }
    loadConfig();
  }, [subdomain]);

  if (!whatsappConfig || !whatsappConfig.enabled || !whatsappConfig.phone) {
    return null;
  }

  // Clean phone number (remove spaces, plus, hyphens for wa.me URL)
  const cleanPhone = whatsappConfig.phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(whatsappConfig.defaultMessage || 'Hello! I have an inquiry.');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 hover:bg-[#20ba5a] active:scale-95 transition-all duration-300 group"
    >
      <MessageCircle className="h-7 w-7 fill-white text-[#25D366]" />
      
      {/* Tooltip on Hover */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}