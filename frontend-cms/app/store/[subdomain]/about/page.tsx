'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Sparkles, ShieldCheck, Zap, Users, Target } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function StoreAboutPage() {
  const params = useParams();
  const subdomain = params?.subdomain as string;

  const [storeName, setStoreName] = useState<string>(
    subdomain ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1) : 'Our Platform'
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
        if (store?.name) {
          setStoreName(store.name);
        }
        if (store?.templateConfig?.about?.story) {
          setAboutStory(store.templateConfig.about.story);
        }
        if (store?.templateConfig?.about?.mission) {
          setAboutMission(store.templateConfig.about.mission);
        }
      } catch {
        // Fallback default values remain active if API fails
      }
    }

    fetchStoreDetails();
  }, [subdomain]);

  return (
    <main className="min-h-screen w-full transition-colors duration-300">
      {/* 1. Hero Header */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 md:px-8 md:pt-14 md:pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-5">
          <Sparkles size={13} className="text-cyan-400" />
          <span>OUR STORY & PHILOSOPHY</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
          About <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">{storeName}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed whitespace-pre-line">
          {aboutStory}
        </p>

        {aboutMission && (
          <div className="mx-auto mt-6 max-w-xl p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs sm:text-sm">
            <span className="font-bold text-cyan-400 uppercase tracking-wide block mb-1">Our Mission</span>
            {aboutMission}
          </div>
        )}
      </section>

      {/* 2. Core Pillars & Mission Cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 border-t border-slate-800/60">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
            <Target size={12} />
            <span>OUR VALUES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Built on Transparency & Trust</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 backdrop-blur-md shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold">100% Genuine Backed</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Every device and item listed is strictly sourced from verified distributors and authorized local partners.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 backdrop-blur-md shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold">Express Nationwide Logistics</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Dispatched with high-grade packaging and express tracking to all major cities across Pakistan.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 backdrop-blur-md shadow-xl sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
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