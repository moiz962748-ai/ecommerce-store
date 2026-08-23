import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const STORES = [
  {
    title: 'Tech Store',
    description: 'Smart tech essentials',
    subdomain: 'electronics',
    color: 'bg-blue-600',
    borderColor: 'border-l-blue-600',
    shadowColor: 'hover:shadow-blue-500/10',
    hoverTextColor: 'group-hover:text-blue-600 hover:text-blue-600',
  },
  {
    title: 'Sports Store',
    description: 'Fuel your performance',
    subdomain: 'sports',
    color: 'bg-emerald-600',
    borderColor: 'border-l-emerald-600',
    shadowColor: 'hover:shadow-emerald-500/10',
    hoverTextColor: 'group-hover:text-emerald-600 hover:text-emerald-600',
  },
  {
    title: 'Clothing Store',
    description: 'Curated wardrobe essentials',
    subdomain: 'clothing',
    color: 'bg-purple-600',
    borderColor: 'border-l-purple-600',
    shadowColor: 'hover:shadow-purple-500/10',
    hoverTextColor: 'group-hover:text-purple-600 hover:text-purple-600',
  },
  {
    title: 'Boutique Store',
    description: 'Artisanal pret & luxury couture',
    subdomain: 'boutique',
    color: 'bg-slate-700',
    borderColor: 'border-l-slate-700',
    shadowColor: 'hover:shadow-slate-500/10',
    hoverTextColor: 'group-hover:text-slate-900 hover:text-slate-900',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[#faf8f5] text-slate-900 flex flex-col justify-between p-6 sm:p-10">
      {/* Top Header Link */}
      <div className="flex justify-end">
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-600 hover:text-slate-950 underline underline-offset-4 transition-colors"
        >
          Admin / Partner Login
        </Link>
      </div>

      {/* Hero & Stores Grid */}
      <div className="mx-auto max-w-6xl w-full my-auto py-12">
        {/* Colorful Bar Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-1 w-8 rounded-full bg-blue-600" />
          <div className="h-1 w-8 rounded-full bg-emerald-600" />
          <div className="h-1 w-8 rounded-full bg-purple-600" />
          <div className="h-1 w-8 rounded-full bg-slate-700" />
        </div>

        {/* Section Titles */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950">
            CMS Marketplace
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 font-medium">
            One platform, four independent multi-tenant stores. Pick one to start shopping.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORES.map((store) => (
            <div
              key={store.subdomain}
              className={`flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${store.shadowColor} border-l-4 ${store.borderColor}`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <span className={`h-2.5 w-2.5 rounded-full ${store.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Storefront
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-950 tracking-tight">
                  {store.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {store.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link
                  href={`/store/${store.subdomain}`}
                  className={`group inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 underline underline-offset-4 transition-colors ${store.hoverTextColor}`}
                >
                  <span>Enter store</span>
                  <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200/60">
        © 2026 CMS Marketplace. Enterprise Multi-Tenant E-Commerce Platform.
      </footer>
    </main>
  );
}