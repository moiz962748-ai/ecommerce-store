'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface Store {
  id: string;
  name: string;
  subDomain: string;
}

const KNOWN_SUBDOMAINS = ['electronics', 'sports', 'clothing'] as const;

const STORE_META: Record<
  (typeof KNOWN_SUBDOMAINS)[number],
  { tagline: string; borderClass: string; dotClass: string }
> = {
  electronics: {
    tagline: 'Smart tech essentials',
    borderClass: 'border-l-tag-electronics',
    dotClass: 'bg-tag-electronics',
  },
  sports: {
    tagline: 'Fuel your performance',
    borderClass: 'border-l-tag-sports',
    dotClass: 'bg-tag-sports',
  },
  clothing: {
    tagline: 'Curated wardrobe essentials',
    borderClass: 'border-l-tag-clothing',
    dotClass: 'bg-tag-clothing',
  },
};

export default function HomePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      const results = await Promise.allSettled(
        KNOWN_SUBDOMAINS.map((sub) => apiClient(`/public/stores/${sub}`)),
      );
      const found = results
        .filter((r): r is PromiseFulfilledResult<Store> => r.status === 'fulfilled')
        .map((r) => r.value);
      setStores(found);
      setLoading(false);
    };

    fetchStores();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-16">
      <Link href="/login" className="absolute right-6 top-6 text-sm text-muted-foreground underline">
        Admin / Partner Login
      </Link>

      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-3 flex gap-1.5">
          <span className="h-1 w-8 rounded-full bg-tag-electronics" />
          <span className="h-1 w-8 rounded-full bg-tag-sports" />
          <span className="h-1 w-8 rounded-full bg-tag-clothing" />
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          CMS Marketplace
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          One platform, three independent stores. Pick one to start shopping.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading stores...</p>
      ) : (
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {KNOWN_SUBDOMAINS.map((sub) => {
            const store = stores.find((s) => s.subDomain === sub);
            const meta = STORE_META[sub];
            if (!store) return null;

            return (
              <Link
                key={sub}
                href={`/store/${sub}`}
                className={`group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 border-l-4 ${meta.borderClass} shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}
              >
                <div>
                  <span className={`inline-block h-2 w-2 rounded-full ${meta.dotClass}`} />
                  <h2 className="font-heading mt-3 text-xl font-semibold text-foreground">
                    {store.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{meta.tagline}</p>
                </div>
                <span className="mt-6 text-sm font-medium text-foreground underline underline-offset-4 group-hover:no-underline">
                  Enter store →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}