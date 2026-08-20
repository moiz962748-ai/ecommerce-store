'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Sparkles, ShieldCheck, Zap, Users, Target } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

const THEME_STYLES: Record<string, {
  bg: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  accentGradient: string;
  cardBorder: string;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  missionBg: string;
  missionBorder: string;
  missionText: string;
}> = {
  electronics: {
    bg: 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950',
    badgeBorder: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-400',
    accentGradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    cardBorder: 'border-slate-800/80',
    cardBg: 'bg-slate-900/60',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    missionBg: 'bg-cyan-950/30',
    missionBorder: 'border-cyan-800/40',
    missionText: 'text-cyan-200',
  },
  sports: {
    bg: 'bg-[#020d09] text-emerald-50 selection:bg-emerald-500 selection:text-slate-950',
    badgeBorder: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    accentGradient: 'from-emerald-400 via-teal-400 to-green-300',
    cardBorder: 'border-emerald-950/80',
    cardBg: 'bg-[#061a14]/60',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    missionBg: 'bg-emerald-950/30',
    missionBorder: 'border-emerald-800/40',
    missionText: 'text-emerald-200',
  },
  clothing: {
    bg: 'bg-[#0b0314] text-purple-50 selection:bg-purple-500 selection:text-white',
    badgeBorder: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-400',
    accentGradient: 'from-purple-400 via-fuchsia-400 to-pink-300',
    cardBorder: 'border-purple-950/80',
    cardBg: 'bg-[#1a0a26]/60',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    missionBg: 'bg-purple-950/30',
    missionBorder: 'border-purple-800/40',
    missionText: 'text-purple-200',
  },
};

export default function StoreAboutPage() {
  const params = useParams();
  const subdomain = (params?.subdomain as string) || '';

  const lowerSubdomain = subdomain.toLowerCase();
  const [storeTheme, setStoreTheme] = useState<string>(
    lowerSubdomain.includes('sport') ? 'sports' : lowerSubdomain.includes('cloth') ? 'clothing' : 'electronics'
  );

  const [storeName, setStoreName] = useState<string>(
    subdomain ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1) : 'Our Store'
  );
  const [aboutStory, setAboutStory] = useState<string>(
    'Powering modern e-commerce experiences across Pakistan with verified authenticity, direct brand warranty, and seamless doorstep delivery.'
  );
  const [aboutMission, setAboutMission] = useState<string>('');

  useEffect(() => {
    if (!subdomain) return;

    async function fetchStoreDetails() {
      try {
        const store = await apiClient(`/public/stores/${subdomain}`);
        if (store?.name) setStoreName(store.name);
        
        const configuredTheme = store?.templateConfig?.theme;
        if (configuredTheme && THEME_STYLES[configuredTheme]) {
          setStoreTheme(configuredTheme);
        }

        if (store?.templateConfig?.about?.story) {
          setAboutStory(store.templateConfig.about.story);
        }
        if (store?.templateConfig?.about?.mission) {
          setAboutMission(store.templateConfig.about.mission);
        }
      } catch {
        // Fallback to default values
      }
    }

    fetchStoreDetails();
  }, [subdomain]);

  const currentTheme = THEME_STYLES[storeTheme] || THEME_STYLES.electronics;

  return (
    <main className={`min-h-screen w-full transition-colors duration-500 ${currentTheme.bg}`}>
      {/* 1. Hero Header */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 md:px-8 md:pt-16 md:pb-12 text-center">
        <div className={`inline-flex items-center gap-2 rounded-full border ${currentTheme.badgeBorder} ${currentTheme.badgeBg} px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-5 ${currentTheme.badgeText}`}>
          <Sparkles size={13} />
          <span>OUR STORY & PHILOSOPHY</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
          About <span className={`bg-gradient-to-r ${currentTheme.accentGradient} bg-clip-text text-transparent`}>{storeName}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed whitespace-pre-line">
          {aboutStory}
        </p>

        {aboutMission && (
          <div className={`mx-auto mt-6 max-w-xl p-4 rounded-2xl ${currentTheme.missionBg} border ${currentTheme.missionBorder} ${currentTheme.missionText} text-xs sm:text-sm`}>
            <span className={`font-bold ${currentTheme.badgeText} uppercase tracking-wide block mb-1`}>Our Mission</span>
            {aboutMission}
          </div>
        )}
      </section>

      {/* 2. Pillars Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 border-t border-slate-800/60">
        <div className="mb-10 text-center md:text-left">
          <div className={`inline-flex items-center gap-2 rounded-full border ${currentTheme.badgeBorder} ${currentTheme.badgeBg} px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider ${currentTheme.badgeText} mb-2`}>
            <Target size={12} />
            <span>OUR VALUES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Built on Transparency & Trust</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`rounded-3xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-8 backdrop-blur-md shadow-xl`}>
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold">100% Genuine Backed</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Every device and item listed is strictly sourced from verified distributors and authorized local partners.
            </p>
          </div>

          <div className={`rounded-3xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-8 backdrop-blur-md shadow-xl`}>
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold">Express Nationwide Logistics</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Dispatched with high-grade packaging and express tracking to all major cities across Pakistan.
            </p>
          </div>

          <div className={`rounded-3xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-8 backdrop-blur-md shadow-xl sm:col-span-2 lg:col-span-1`}>
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold">Customer First Support</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Dedicated after-sales support team ready to assist with doorstep exchanges, setups, and warranty claims.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}