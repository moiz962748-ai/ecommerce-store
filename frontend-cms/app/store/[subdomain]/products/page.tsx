'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  templateConfig?: { theme?: string };
}

interface Product {
  id: string;
  name: string;
  basePrice?: number;
  price?: number;
  description: string;
  imageUrl?: string | null;
  category?: string;
}

function getProductVisual(productName: string) {
  const lower = productName.toLowerCase();
  if (lower.includes('running') || lower.includes('sneaker')) return '👟';
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('training')) return '🏋️';
  if (lower.includes('bottle') || lower.includes('hydration')) return '💧';
  if (lower.includes('laptop') || lower.includes('computer')) return '💻';
  if (lower.includes('mouse')) return '🖱️';
  if (lower.includes('headphone') || lower.includes('earbud') || lower.includes('audio')) return '🎧';
  if (lower.includes('phone') || lower.includes('mobile')) return '📱';
  if (lower.includes('watch')) return '⌚';
  if (lower.includes('camera')) return '📷';
  if (lower.includes('speaker')) return '🔊';
  if (lower.includes('keyboard')) return '⌨️';
  if (lower.includes('shirt') || lower.includes('t-shirt')) return '👕';
  if (lower.includes('dress')) return '👗';
  if (lower.includes('jacket') || lower.includes('coat')) return '🧥';
  if (lower.includes('jeans') || lower.includes('pants') || lower.includes('trouser')) return '👖';
  if (lower.includes('hat') || lower.includes('cap')) return '🧢';
  if (lower.includes('bag') || lower.includes('handbag')) return '👜';
  if (lower.includes('shoe')) return '👟';
  return '⚡';
}

function getProductCategory(productName: string) {
  const lower = productName.toLowerCase();
  if (lower.includes('running') || lower.includes('sneaker')) return 'Footwear';
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('training')) return 'Training';
  if (lower.includes('bottle') || lower.includes('hydration')) return 'Hydration';
  if (lower.includes('laptop') || lower.includes('computer') || lower.includes('phone')) return 'Tech';
  if (lower.includes('mouse') || lower.includes('keyboard') || lower.includes('speaker')) return 'Accessories';
  if (lower.includes('headphone') || lower.includes('audio')) return 'Audio';
  if (lower.includes('watch') || lower.includes('camera')) return 'Lifestyle';
  if (
    lower.includes('shirt') ||
    lower.includes('t-shirt') ||
    lower.includes('dress') ||
    lower.includes('jacket') ||
    lower.includes('coat') ||
    lower.includes('jeans') ||
    lower.includes('pants')
  )
    return 'Apparel';
  if (lower.includes('hat') || lower.includes('cap') || lower.includes('bag')) return 'Accessories';
  if (lower.includes('shoe')) return 'Footwear';
  return 'Featured';
}

export default function StoreProductsPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lowerSub = (subdomain || '').toLowerCase();
  const isSports =
    store?.templateConfig?.theme === 'sports' ||
    lowerSub.includes('sport') ||
    lowerSub.includes('fitness');

  const isClothing =
    store?.templateConfig?.theme === 'clothing' ||
    lowerSub.includes('cloth') ||
    lowerSub.includes('fashion') ||
    lowerSub.includes('apparel');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundStore = await apiClient(`/public/stores/${subdomain}`);
        setStore(foundStore);

        const productsData = await apiClient(`/public/products/store/${foundStore.id}`);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch {
        setError('Unable to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subdomain]);

  const categories = useMemo(() => {
    const allCategories = ['All', ...new Set(products.map((product) => product.category || getProductCategory(product.name)))];
    return allCategories;
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(
      (product) => (product.category || getProductCategory(product.name)) === selectedCategory
    );
  }, [products, selectedCategory]);

  const heroEyebrow = isSports
    ? 'Performance essentials'
    : isClothing
    ? 'Curated Style essentials'
    : 'Next-Gen Smart Tech';

  const heroHeadline = isSports
    ? 'Gear Engineered for Athletic Peak'
    : isClothing
    ? 'Elevate Your Signature Everyday Looks'
    : 'Discover Precision Hardware & Gadgets';

  if (loading) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${
          isSports ? 'bg-[#020d09] text-emerald-50' : isClothing ? 'bg-[#0b0314] text-purple-50' : 'bg-slate-950 text-slate-100'
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-6 py-4 backdrop-blur-md ${
            isSports
              ? 'border-emerald-900/50 bg-slate-900/80 text-emerald-300'
              : isClothing
              ? 'border-purple-900/50 bg-slate-900/80 text-purple-300'
              : 'border-slate-800 bg-slate-900/80 text-slate-300'
          }`}
        >
          <div
            className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
              isSports ? 'border-emerald-400' : isClothing ? 'border-purple-400' : 'border-cyan-400'
            }`}
          />
          <span>Loading catalog...</span>
        </div>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-center gap-4 ${
          isSports ? 'bg-[#020d09] text-emerald-50' : isClothing ? 'bg-[#0b0314] text-purple-50' : 'bg-slate-950 text-slate-100'
        }`}
      >
        <p className="text-sm font-semibold text-rose-400">{error || 'Store not found'}</p>
        <Link
          href={`/store/${subdomain}`}
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
        >
          Return to Store Home
        </Link>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isSports
          ? 'bg-[#020d09] text-emerald-50 selection:bg-emerald-500 selection:text-slate-950'
          : isClothing
          ? 'bg-[#0b0314] text-purple-50 selection:bg-purple-500 selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
      }`}
    >
      {/* Top Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <div
          className={`relative overflow-hidden rounded-3xl border p-6 backdrop-blur-xl md:p-10 ${
            isSports
              ? 'border-emerald-900/40 bg-gradient-to-br from-emerald-950/40 via-slate-900/70 to-slate-950 shadow-2xl shadow-emerald-950/20'
              : isClothing
              ? 'border-purple-900/40 bg-gradient-to-br from-purple-950/40 via-slate-900/70 to-slate-950 shadow-2xl shadow-purple-950/20'
              : 'border-cyan-900/40 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 shadow-2xl shadow-cyan-950/20'
          }`}
        >
          {/* Ambient Glow */}
          <div
            className={`absolute -right-10 -top-10 h-72 w-72 rounded-full blur-[100px] pointer-events-none ${
              isSports ? 'bg-emerald-500/15' : isClothing ? 'bg-purple-500/15' : 'bg-cyan-500/15'
            }`}
          />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider mb-3 ${
                  isSports
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : isClothing
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                    : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                }`}
              >
                <Sparkles size={12} />
                {heroEyebrow}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                {heroHeadline}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/store/${subdomain}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-bold text-slate-200 backdrop-blur-md transition-all hover:border-slate-700 hover:bg-slate-800"
              >
                <ArrowLeft size={14} />
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalog Listing */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:px-8">
        
        {/* Category Pill Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? isSports
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                      : isClothing
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                    : isSports
                    ? 'border border-emerald-950/60 bg-slate-900/60 text-slate-300 hover:border-emerald-500/40 hover:text-white'
                    : isClothing
                    ? 'border border-purple-950/60 bg-slate-900/60 text-slate-300 hover:border-purple-500/40 hover:text-white'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Empty Catalog State */}
        {visibleProducts.length === 0 ? (
          <div
            className={`rounded-2xl border p-12 text-center backdrop-blur-md ${
              isSports
                ? 'border-emerald-950 bg-slate-900/40 text-slate-400'
                : isClothing
                ? 'border-purple-950 bg-slate-900/40 text-slate-400'
                : 'border-slate-900 bg-slate-900/40 text-slate-400'
            }`}
          >
            <ShoppingBag size={36} className="mx-auto mb-3 text-slate-600" />
            <p className="text-sm">No products available in this category yet.</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => {
              const displayPrice = product.price ?? product.basePrice ?? 0;
              const displayCat = product.category || getProductCategory(product.name);

              return (
                <Link
                  key={product.id}
                  href={`/store/${subdomain}/products/${product.id}`}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 shadow-xl ${
                    isSports
                      ? 'border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/90'
                      : isClothing
                      ? 'border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/90'
                      : 'border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90'
                  }`}
                >
                  <div>
                    {/* Visual Media Container */}
                    <div
                      className={`relative flex h-52 items-center justify-center overflow-hidden border-b p-5 ${
                        isSports
                          ? 'border-emerald-950/80 bg-emerald-950/20'
                          : isClothing
                          ? 'border-purple-950/80 bg-purple-950/20'
                          : 'border-slate-800/80 bg-slate-950/40'
                      }`}
                    >
                      <div
                        className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          isSports
                            ? 'border-emerald-500/30 bg-slate-950/80 text-emerald-400'
                            : isClothing
                            ? 'border-purple-500/30 bg-slate-950/80 text-purple-300'
                            : 'border-cyan-500/30 bg-slate-950/80 text-cyan-300'
                        }`}
                      >
                        {displayCat}
                      </div>

                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
                          {getProductVisual(product.name)}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h2
                        className={`text-base font-bold text-white transition-colors line-clamp-1 ${
                          isSports
                            ? 'group-hover:text-emerald-400'
                            : isClothing
                            ? 'group-hover:text-purple-300'
                            : 'group-hover:text-cyan-300'
                        }`}
                      >
                        {product.name}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-xs text-slate-400 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div
                    className={`mt-4 flex items-center justify-between border-t p-5 pt-4 ${
                      isSports
                        ? 'border-emerald-950/80'
                        : isClothing
                        ? 'border-purple-950/80'
                        : 'border-slate-800/80'
                    }`}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">Price</p>
                      <p
                        className={`text-lg font-black ${
                          isSports
                            ? 'text-emerald-400'
                            : isClothing
                            ? 'text-purple-300'
                            : 'text-cyan-300'
                        }`}
                      >
                        Rs. {Number(displayPrice).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
                        isSports
                          ? 'border-emerald-900/60 bg-slate-800/80 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950'
                          : isClothing
                          ? 'border-purple-900/60 bg-slate-800/80 text-purple-300 group-hover:bg-purple-600 group-hover:text-white'
                          : 'border-slate-700 bg-slate-800/80 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950'
                      }`}
                    >
                      View
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}