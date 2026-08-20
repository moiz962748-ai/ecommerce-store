'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  ArrowRight,
  Sparkles,
  Heart,
} from 'lucide-react';

interface StoreFooterProps {
  subdomain: string;
  storeName?: string;
}

const FOOTER_CONFIGS: Record<
  string,
  {
    tagline: string;
    description: string;
    categories: { name: string; href: string }[];
    badgeText: string;
  }
> = {
  electronics: {
    tagline: 'Next-Gen Smart Technology & Hardware',
    description:
      'Your verified destination for authentic premium laptops, noise-canceling audio gear, creator workstations, and modern smart gadgets.',
    badgeText: 'Official Tech Store',
    categories: [
      { name: 'Laptops & Ultrabooks', href: 'laptops' },
      { name: 'Audio & Headphones', href: 'audio' },
      { name: 'Smart Wearables', href: 'wearables' },
      { name: 'Keyboards & Accessories', href: 'accessories' },
    ],
  },
  sports: {
    tagline: 'Peak Athletic Gear & Endurance Equipment',
    description:
      'Engineered for runners, athletes, and fitness enthusiasts. Premium workout apparel, heavy-duty weights, and hydration gear.',
    badgeText: 'Pro Performance Store',
    categories: [
      { name: 'Running & Footwear', href: 'footwear' },
      { name: 'Gym Weights & Sets', href: 'gym-gear' },
      { name: 'Activewear & Tops', href: 'apparel' },
      { name: 'Hydration Flasks', href: 'hydration' },
    ],
  },
  clothing: {
    tagline: 'Contemporary Fashion & Everyday Essentials',
    description:
      'Curated streetwear silhouettes, relaxed denim fits, organic cotton essentials, and modern outerwear tailored for effortless style.',
    badgeText: 'Curated Apparel Store',
    categories: [
      { name: 'Oversized Tees & Tops', href: 't-shirts' },
      { name: 'Denim & Trousers', href: 'bottoms' },
      { name: 'Jackets & Outerwear', href: 'outerwear' },
      { name: 'Bags & Accessories', href: 'accessories' },
    ],
  },
};

export function StoreFooter({ subdomain, storeName = 'Store' }: StoreFooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const lowerSub = (subdomain || '').toLowerCase();
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');
  const configKey = isSports ? 'sports' : isClothing ? 'clothing' : 'electronics';

  const config = FOOTER_CONFIGS[configKey];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 3500);
  };

  return (
    <footer
      className={`relative border-t transition-colors duration-300 ${
        isSports
          ? 'bg-[#020d09] border-emerald-950/80 text-emerald-50'
          : isClothing
          ? 'bg-[#0b0314] border-purple-950/80 text-purple-50'
          : 'bg-slate-950 border-slate-900 text-slate-100'
      }`}
    >
      {/* Top Value Badges Ribbon */}
      <div
        className={`border-b ${
          isSports
            ? 'border-emerald-950/60 bg-emerald-950/20'
            : isClothing
            ? 'border-purple-950/60 bg-purple-950/20'
            : 'border-slate-900 bg-slate-900/40'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: 'Nationwide Delivery',
                desc: 'Fast tracked shipping across Pakistan',
              },
              {
                icon: ShieldCheck,
                title: '100% Authentic',
                desc: 'Brand genuine guarantee backed',
              },
              {
                icon: RotateCcw,
                title: '7-Day Easy Return',
                desc: 'Doorstep exchange & refund policy',
              },
              {
                icon: Headphones,
                title: 'Dedicated Support',
                desc: 'Helpdesk ready for order assistance',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      isSports
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : isClothing
                        ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                        : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${
                  isSports
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : isClothing
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                    : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                }`}
              >
                <Sparkles size={12} />
                {config.badgeText}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">{storeName}</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {config.description}
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase tracking-wider">
                Payment Options Supported
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                <span className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/60">
                  💵 Cash on Delivery
                </span>
                <span className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/60">
                  💳 Online Bank Transfer
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              {config.categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/store/${subdomain}/products?category=${encodeURIComponent(cat.href)}`}
                    className={`transition-colors ${
                      isSports
                        ? 'hover:text-emerald-400'
                        : isClothing
                        ? 'hover:text-purple-300'
                        : 'hover:text-cyan-300'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/store/${subdomain}/products`}
                  className={`font-semibold transition-colors ${
                    isSports
                      ? 'text-emerald-400 hover:underline'
                      : isClothing
                      ? 'text-purple-300 hover:underline'
                      : 'text-cyan-300 hover:underline'
                  }`}
                >
                  View All Products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Stay in the Loop
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get notified when new seasonal drops, limited discounts, and member coupons arrive.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  suppressHydrationWarning
                  className={`w-full rounded-xl border bg-slate-900/90 py-2.5 pl-10 pr-24 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                    isSports
                      ? 'border-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : isClothing
                      ? 'border-purple-950 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
                <button
                  type="submit"
                  suppressHydrationWarning
                  className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSports
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : isClothing
                      ? 'bg-purple-600 text-white hover:bg-purple-500'
                      : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  }`}
                >
                  Join
                </button>
              </div>

              {subscribed && (
                <p className="text-xs font-semibold text-emerald-400 animate-fade-in">
                  ✓ Thanks for subscribing! Check your inbox soon.
                </p>
              )}
            </form>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <Link
                href={`/store/${subdomain}/orders`}
                className={`transition-colors ${
                  isSports ? 'hover:text-emerald-400' : isClothing ? 'hover:text-purple-300' : 'hover:text-cyan-300'
                }`}
              >
                Track Orders
              </Link>
              <span>•</span>
              <Link
                href={`/store/${subdomain}/wishlist`}
                className={`transition-colors ${
                  isSports ? 'hover:text-emerald-400' : isClothing ? 'hover:text-purple-300' : 'hover:text-cyan-300'
                }`}
              >
                My Wishlist
              </Link>
              <span>•</span>
              <Link
                href={`/store/${subdomain}#contact`}
                className={`transition-colors ${
                  isSports ? 'hover:text-emerald-400' : isClothing ? 'hover:text-purple-300' : 'hover:text-cyan-300'
                }`}
              >
                Help & Contact
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span
              className={`font-bold ${
                isSports
                  ? 'text-emerald-400'
                  : isClothing
                  ? 'text-purple-400'
                  : 'text-cyan-400'
              }`}
            >
              Multi-Store Platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}