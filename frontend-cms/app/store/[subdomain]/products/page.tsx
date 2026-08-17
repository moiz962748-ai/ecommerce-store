'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

interface Store {
  id: string;
  name: string;
  templateConfig?: { theme?: string };
}

interface Product {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  imageUrl?: string | null;
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

  const isSportsStore =
    store?.templateConfig?.theme === 'sports' ||
    subdomain.toLowerCase().includes('sport') ||
    subdomain.toLowerCase().includes('fitness');

  const isClothingStore =
    store?.templateConfig?.theme === 'clothing' ||
    subdomain.toLowerCase().includes('cloth') ||
    subdomain.toLowerCase().includes('fashion') ||
    subdomain.toLowerCase().includes('apparel');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundStore = await apiClient(`/public/stores/${subdomain}`);
        setStore(foundStore);

        const productsData = await apiClient(`/public/products/store/${foundStore.id}`);
        setProducts(productsData);
      } catch {
        setError('Unable to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subdomain]);

  const categories = useMemo(() => {
    const allCategories = ['All', ...new Set(products.map((product) => getProductCategory(product.name)))];
    return allCategories;
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((product) => getProductCategory(product.name) === selectedCategory);
  }, [products, selectedCategory]);

  const heroEyebrow = isSportsStore
    ? 'Performance essentials'
    : isClothingStore
      ? 'Style essentials'
      : 'Smart shopping';

  const heroHeadline = isSportsStore
    ? 'Shop gear built for every workout'
    : isClothingStore
      ? "Shop the season's must-have looks"
      : 'Shop the best gadgets for everyday life';

  const heroButtonText = isSportsStore
    ? 'Shop Collection'
    : isClothingStore
      ? 'Shop the Collection'
      : 'Browse Now';

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-store-background text-store-foreground">
        <div className="rounded-2xl border border-store-border bg-store-card px-6 py-4 text-store-muted">
          Loading products...
        </div>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-store-background text-store-foreground">
        <p className="text-red-500">{error || 'Store not found'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-store-background text-store-foreground">
      
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="overflow-hidden rounded-[28px] border border-store-border bg-[radial-gradient(circle_at_left,_rgba(117,161,255,0.18),_transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] bg-store-card p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-store-muted">
                {heroEyebrow}
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-store-foreground md:text-5xl store-heading">
                {heroHeadline}
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={`/store/${subdomain}`}>
                <Button variant="outline" className="border-store-border bg-store-background text-store-foreground">
                  Back to Home
                </Button>
              </Link>
              <Link href={`/store/${subdomain}/products`}>
                <Button className="bg-store-accent text-store-background transition-colors hover:bg-store-accent/90 hover:text-store-background">
                  {heroButtonText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={[
                'rounded-full border px-4 py-2 text-sm transition-all',
                selectedCategory === category
                  ? 'border-store-accent bg-store-accent text-store-background'
                  : 'border-store-border bg-store-card text-store-muted hover:border-store-accent hover:text-store-foreground',
              ].join(' ')}
            >
              {category}
            </button>
          ))}
        </div>

        {visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-store-border bg-store-card px-6 py-10 text-center text-store-muted">
            No products available in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <Link
                key={product.id}
                href={`/store/${subdomain}/products/${product.id}`}
                className="group overflow-hidden rounded-2xl border border-store-border bg-store-card shadow-sm transition-all hover:-translate-y-1 hover:border-store-accent"
              >
                <div className="relative overflow-hidden border-b border-store-border bg-[linear-gradient(135deg,rgba(117,161,255,0.18),rgba(255,255,255,0.04))] p-5">
                  <div className="absolute right-3 top-3 rounded-full border border-store-border bg-store-background/70 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-store-muted">
                    {getProductCategory(product.name)}
                  </div>
                  <div className="flex h-52 items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-6xl text-store-accent">{getProductVisual(product.name)}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="text-xl font-semibold text-store-foreground store-heading">{product.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-store-muted">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-store-muted">Price</p>
                      <p className="mt-1 text-2xl font-bold text-store-accent">Rs. {product.basePrice}</p>
                    </div>

                    <span className="rounded-full border border-store-border bg-store-background px-3 py-1 text-xs font-medium text-store-foreground">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}