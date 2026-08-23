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
  boutique: {
    tagline: 'Handcrafted Luxury Pret & Bespoke Couture',
    description:
      'Your premier destination for pure fabrics, artisanal hand embellishments, luxury festive edits, and tailored silhouettes crafted for timeless elegance.',
    badgeText: 'Official Boutique House',
    categories: [
      { name: 'Luxury Pret & Tunics', href: 'luxury-pret' },
      { name: 'Formal & Couture Pishwas', href: 'couture' },
      { name: 'Festive Raw Silk Ensembles', href: 'festive-edit' },
      { name: 'Korean Chiffon Abayas', href: 'abayas' },
    ],
  },
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
  const isBoutique = lowerSub.includes('boutique') || lowerSub.includes('luxury');
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');
  const configKey = isBoutique ? 'boutique' : isSports ? 'sports' : isClothing ? 'clothing' : 'electronics';

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
        isBoutique
          ? 'bg-background border-border text-foreground'
          : isSports
          ? 'bg-[#f4fbf7] border-emerald-200/80 text-slate-900'
          : isClothing
          ? 'bg-[#faf7fc] border-purple-200/80 text-slate-900'
          : 'bg-[#f8fafc] border-slate-200 text-slate-900'
      }`}
    >
      {/* Top Value Badges Ribbon */}
      <div
        className={`border-b ${
          isBoutique
            ? 'border-border bg-card/60'
            : isSports
            ? 'border-emerald-200/70 bg-white/70'
            : isClothing
            ? 'border-purple-200/70 bg-white/70'
            : 'border-slate-200/80 bg-white/70'
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
                title: isBoutique ? '100% Pure Fabric' : '100% Authentic',
                desc: isBoutique ? 'Premium silk, organza & chiffon' : 'Brand genuine guarantee backed',
              },
              {
                icon: RotateCcw,
                title: isBoutique ? 'Custom Alterations' : '7-Day Easy Return',
                desc: isBoutique ? 'Made to measure support' : 'Doorstep exchange & refund policy',
              },
              {
                icon: Headphones,
                title: 'Styling Assistance',
                desc: 'Consult our wardrobe specialists',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-xs ${
                      isBoutique
                        ? 'border-border bg-accent text-foreground'
                        : isSports
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : isClothing
                        ? 'border-purple-200 bg-purple-50 text-purple-700'
                        : 'border-sky-200 bg-sky-50 text-sky-700'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold leading-tight ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
                      {item.title}
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>{item.desc}</p>
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
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider shadow-xs ${
                  isBoutique
                    ? 'border-border bg-card text-foreground'
                    : isSports
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : isClothing
                    ? 'border-purple-200 bg-purple-50 text-purple-800'
                    : 'border-sky-200 bg-sky-50 text-sky-800'
                }`}
              >
                <Sparkles size={12} />
                {config.badgeText}
              </span>
            </div>

            <h3 className={`text-2xl font-black tracking-tight ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>{storeName}</h3>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
              {config.description}
            </p>

            <div className="pt-2">
              <span className={`text-xs font-semibold block mb-2 uppercase tracking-wider ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                Payment Options Supported
              </span>
              <div className={`flex flex-wrap gap-2 text-xs font-bold ${isBoutique ? 'text-foreground' : 'text-slate-800'}`}>
                <span className={`px-2.5 py-1 rounded-lg border shadow-xs ${isBoutique ? 'border-border bg-card' : 'border-slate-200 bg-white'}`}>
                  💵 Cash on Delivery
                </span>
                <span className={`px-2.5 py-1 rounded-lg border shadow-xs ${isBoutique ? 'border-border bg-card' : 'border-slate-200 bg-white'}`}>
                  💳 Online Bank Transfer
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-widest ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
              Collections & Edits
            </h4>
            <ul className={`space-y-2 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
              {config.categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/store/${subdomain}/products?category=${encodeURIComponent(cat.href)}`}
                    className={`transition-colors ${
                      isBoutique
                        ? 'hover:text-foreground'
                        : isSports
                        ? 'hover:text-emerald-700'
                        : isClothing
                        ? 'hover:text-purple-700'
                        : 'hover:text-sky-700'
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
                    isBoutique
                      ? 'text-foreground hover:underline'
                      : isSports
                      ? 'text-emerald-700 hover:underline'
                      : isClothing
                      ? 'text-purple-700 hover:underline'
                      : 'text-sky-700 hover:underline'
                  }`}
                >
                  View All Collection →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className={`text-xs font-bold uppercase tracking-widest ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
              Exclusive Privileges
            </h4>
            <p className={`text-xs leading-relaxed ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
              {isBoutique
                ? 'Subscribe to receive private previews of new festive drops, limited couture collections, and exclusive discounts.'
                : 'Get notified when new seasonal drops, limited discounts, and member coupons arrive.'}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative flex items-center">
                <Mail size={16} className={`absolute left-3.5 pointer-events-none ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`} />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  suppressHydrationWarning
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-24 text-xs transition-all shadow-xs ${
                    isBoutique
                      ? 'bg-card border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
                      : isSports
                      ? 'bg-white text-slate-900 placeholder:text-slate-400 border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : isClothing
                      ? 'bg-white text-slate-900 placeholder:text-slate-400 border-purple-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                  }`}
                />
                <button
                  type="submit"
                  suppressHydrationWarning
                  className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                    isBoutique
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : isSports
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : isClothing
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                >
                  Join
                </button>
              </div>

              {subscribed && (
                <p className="text-xs font-semibold text-emerald-600 animate-fade-in">
                  ✓ Thanks for subscribing! Check your inbox soon.
                </p>
              )}
            </form>

            <div className={`pt-2 flex items-center gap-4 text-xs ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
              <Link
                href={`/store/${subdomain}/orders`}
                className={`transition-colors ${
                  isBoutique ? 'hover:text-foreground' : isSports ? 'hover:text-emerald-700' : isClothing ? 'hover:text-purple-700' : 'hover:text-sky-700'
                }`}
              >
                Track Orders
              </Link>
              <span>•</span>
              <Link
                href={`/store/${subdomain}/wishlist`}
                className={`transition-colors ${
                  isBoutique ? 'hover:text-foreground' : isSports ? 'hover:text-emerald-700' : isClothing ? 'hover:text-purple-700' : 'hover:text-sky-700'
                }`}
              >
                My Wishlist
              </Link>
              <span>•</span>
              <Link
                href={`/store/${subdomain}#contact`}
                className={`transition-colors ${
                  isBoutique ? 'hover:text-foreground' : isSports ? 'hover:text-emerald-700' : isClothing ? 'hover:text-purple-700' : 'hover:text-sky-700'
                }`}
              >
                Help & Contact
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${isBoutique ? 'border-border text-muted-foreground' : 'border-slate-200 text-slate-500'}`}>
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span
              className={`font-bold ${
                isBoutique
                  ? 'text-foreground'
                  : isSports
                  ? 'text-emerald-700'
                  : isClothing
                  ? 'text-purple-700'
                  : 'text-sky-700'
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