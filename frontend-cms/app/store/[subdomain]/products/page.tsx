'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Sparkles, ShoppingBag, Laptop, Shirt, Trophy } from 'lucide-react';

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
  if (lower.includes('shawl') || lower.includes('velvet') || lower.includes('dupatta')) return '🧣';
  if (lower.includes('pret') || lower.includes('suit') || lower.includes('dress') || lower.includes('kurti')) return '👗';
  if (lower.includes('abaya') || lower.includes('pishwas') || lower.includes('couture') || lower.includes('silk')) return '✨';
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
  if (lower.includes('jacket') || lower.includes('coat')) return '🧥';
  if (lower.includes('jeans') || lower.includes('pants') || lower.includes('trouser')) return '👖';
  if (lower.includes('hat') || lower.includes('cap')) return '🧢';
  if (lower.includes('bag') || lower.includes('handbag')) return '👜';
  if (lower.includes('shoe')) return '👟';
  return '✨';
}

function getProductCategory(productName: string, isBoutique: boolean = false) {
  const lower = productName.toLowerCase();
  if (isBoutique) {
    if (lower.includes('pishwas') || lower.includes('couture') || lower.includes('bridal') || lower.includes('maxi')) return 'Formal & Couture';
    if (lower.includes('shawl') || lower.includes('velvet') || lower.includes('dupatta')) return 'Shawls & Wraps';
    if (lower.includes('abaya') || lower.includes('modest')) return 'Abayas';
    if (lower.includes('silk') || lower.includes('raw silk') || lower.includes('organza')) return 'Festive Edit';
    if (lower.includes('pret') || lower.includes('kurti') || lower.includes('suit') || lower.includes('tunic')) return 'Luxury Pret';
    return 'Luxury Pret';
  }
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
  const isBoutique =
    store?.templateConfig?.theme === 'boutique' ||
    lowerSub.includes('boutique') ||
    lowerSub.includes('luxury');

  const isSports =
    !isBoutique &&
    (store?.templateConfig?.theme === 'sports' ||
      lowerSub.includes('sport') ||
      lowerSub.includes('fitness'));

  const isClothing =
    !isBoutique &&
    (store?.templateConfig?.theme === 'clothing' ||
      lowerSub.includes('cloth') ||
      lowerSub.includes('fashion') ||
      lowerSub.includes('apparel'));

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
    return ['All', ...new Set(products.map((product) => product.category || getProductCategory(product.name, isBoutique)))];
  }, [products, isBoutique]);

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(
      (product) => (product.category || getProductCategory(product.name, isBoutique)) === selectedCategory
    );
  }, [products, selectedCategory, isBoutique]);

  const heroEyebrow = isBoutique
    ? 'Handcrafted Pret & Couture'
    : isSports
    ? 'Performance Essentials'
    : isClothing
    ? 'Curated Style Essentials'
    : 'Next-Gen Smart Tech';

  const heroHeadline = isBoutique
    ? 'Artisanal Ensembles & Festive Silhouettes'
    : isSports
    ? 'Gear Engineered for Athletic Peak'
    : isClothing
    ? 'Elevate Your Signature Everyday Looks'
    : 'Discover Precision Hardware & Gadgets';

  const HeroIcon = isBoutique ? Sparkles : isSports ? Trophy : isClothing ? Shirt : Laptop;

  if (loading) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center p-8 ${
          isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-xs ${
            isBoutique
              ? 'border-border bg-card text-foreground'
              : isSports
              ? 'border-emerald-200 bg-white text-emerald-800'
              : isClothing
              ? 'border-purple-200 bg-white text-purple-800'
              : 'border-slate-200 bg-white text-sky-800'
          }`}
        >
          <div
            className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
              isBoutique
                ? 'border-foreground'
                : isSports
                ? 'border-emerald-600'
                : isClothing
                ? 'border-purple-600'
                : 'border-sky-600'
            }`}
          />
          <span className="text-sm font-medium">Loading collection...</span>
        </div>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-center gap-4 p-8 ${
          isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
        }`}
      >
        <p className={`text-sm font-semibold ${isBoutique ? 'text-destructive' : 'text-rose-600'}`}>
          {error || 'Store not found'}
        </p>
        <Link
          href={`/store/${subdomain}`}
          className={`rounded-xl border px-5 py-2.5 text-xs font-bold transition-all shadow-xs ${
            isBoutique
              ? 'border-border bg-card text-foreground hover:bg-accent'
              : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
          }`}
        >
          Return to Store Home
        </Link>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen w-full transition-colors duration-300 ${
        isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* 1. Top Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 md:px-8 md:pt-12 md:pb-8">
        <div
          className={`relative overflow-hidden rounded-3xl border p-8 md:p-12 transition-all duration-300 shadow-xs ${
            isBoutique
              ? 'border-border bg-card'
              : isSports
              ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40'
              : isClothing
              ? 'border-purple-200/80 bg-gradient-to-br from-purple-50 via-white to-purple-50/40'
              : 'border-slate-200 bg-gradient-to-br from-sky-50 via-white to-slate-50'
          }`}
        >
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-xs ${
                  isBoutique
                    ? 'border-border bg-accent text-foreground'
                    : isSports
                    ? 'border-emerald-200 bg-emerald-100/70 text-emerald-800'
                    : isClothing
                    ? 'border-purple-200 bg-purple-100/70 text-purple-800'
                    : 'border-sky-200 bg-sky-100/70 text-sky-800'
                }`}
              >
                <HeroIcon size={13} />
                <span>{heroEyebrow}</span>
              </div>

              <h1 className={`text-3xl font-black tracking-tight sm:text-4xl md:text-5xl leading-tight ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
                {heroHeadline}
              </h1>
            </div>

            <div className="shrink-0">
              <Link
                href={`/store/${subdomain}`}
                className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-xs font-bold transition-all shadow-xs ${
                  isBoutique
                    ? 'border-border bg-card text-foreground hover:bg-accent'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <ArrowLeft size={14} />
                <span>{isBoutique ? 'Back to Atelier' : 'Back to Store'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Catalog Listing & Category Filter Tabs */}
      <section className="mx-auto max-w-7xl px-4 pt-4 pb-24 sm:px-6 md:px-8">
        
        {/* Category Pill Filters */}
        <div className="mb-10 flex flex-wrap items-center gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-xs ${
                  isSelected
                    ? isBoutique
                      ? 'bg-primary text-primary-foreground'
                      : isSports
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                      : isClothing
                      ? 'bg-purple-600 text-white shadow-purple-600/20'
                      : 'bg-sky-600 text-white shadow-sky-600/20'
                    : isBoutique
                    ? 'border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950'
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
            className={`rounded-3xl border p-16 text-center shadow-xs ${
              isBoutique
                ? 'border-border bg-card'
                : 'border-slate-200 bg-white'
            }`}
          >
            <ShoppingBag size={40} className={`mx-auto mb-3 ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`} />
            <h3 className={`text-base font-bold ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>No products found</h3>
            <p className={`mt-1 text-xs ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
              There are no items listed in this specific category yet.
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => {
              const displayPrice = product.price ?? product.basePrice ?? 0;
              const displayCat = product.category || getProductCategory(product.name, isBoutique);

              return (
                <Link
                  key={product.id}
                  href={`/store/${subdomain}/products/${product.id}`}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 shadow-xs ${
                    isBoutique
                      ? 'border-border bg-card hover:border-foreground/20 hover:shadow-md'
                      : isSports
                      ? 'border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-md'
                      : isClothing
                      ? 'border-purple-100 bg-white hover:border-purple-300 hover:shadow-md'
                      : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Visual Media Container */}
                    <div
                      className={`relative flex h-52 items-center justify-center overflow-hidden border-b p-5 ${
                        isBoutique
                          ? 'border-border bg-accent/40'
                          : isSports
                          ? 'border-emerald-100 bg-emerald-50/50'
                          : isClothing
                          ? 'border-purple-100 bg-purple-50/50'
                          : 'border-slate-100 bg-slate-50'
                      }`}
                    >
                      <div
                        className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                          isBoutique
                            ? 'border-border bg-card text-foreground'
                            : isSports
                            ? 'border-emerald-200 bg-white text-emerald-800'
                            : isClothing
                            ? 'border-purple-200 bg-white text-purple-800'
                            : 'border-sky-200 bg-white text-sky-800'
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

                    {/* Card Content */}
                    <div className="p-5">
                      <h2
                        className={`text-base font-bold transition-colors line-clamp-1 ${
                          isBoutique
                            ? 'text-foreground group-hover:opacity-80'
                            : isSports
                            ? 'text-slate-950 group-hover:text-emerald-700'
                            : isClothing
                            ? 'text-slate-950 group-hover:text-purple-700'
                            : 'text-slate-950 group-hover:text-sky-700'
                        }`}
                      >
                        {product.name}
                      </h2>
                      <p className={`mt-1.5 line-clamp-2 text-xs leading-relaxed ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div
                    className={`mt-4 flex items-center justify-between border-t p-5 pt-4 ${
                      isBoutique
                        ? 'border-border'
                        : isSports
                        ? 'border-emerald-100'
                        : isClothing
                        ? 'border-purple-100'
                        : 'border-slate-100'
                    }`}
                  >
                    <div>
                      <p className={`text-[10px] uppercase tracking-widest font-semibold ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Price</p>
                      <p
                        className={`text-lg font-black ${
                          isBoutique
                            ? 'text-foreground'
                            : isSports
                            ? 'text-emerald-700'
                            : isClothing
                            ? 'text-purple-700'
                            : 'text-sky-700'
                        }`}
                      >
                        Rs. {Number(displayPrice).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs ${
                        isBoutique
                          ? 'border-border bg-card text-foreground group-hover:bg-accent'
                          : isSports
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
                          : isClothing
                          ? 'border-purple-200 bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white'
                          : 'border-sky-200 bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white'
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