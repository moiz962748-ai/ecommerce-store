'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

interface Store {
  id: string;
  name: string;
  subDomain: string;
  logoUrl: string | null;
}

export default function StoreHomePage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
  try {
    const found = await apiClient(`/public/stores/${subdomain}`);
    setStore(found);
  } catch (err: any) {
    setError('Store not found');
  } finally {
    setLoading(false);
  }
};

    fetchStore();
  }, [subdomain]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error || 'Store not found'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">{store.name}</h1>
        <Link href={`/store/${subdomain}/products`}>
          <Button variant="outline">Shop All Products</Button>
        </Link>
      </header>

      <section className="flex flex-col items-center justify-center text-center py-24 px-4 bg-muted/30">
        <h2 className="text-4xl font-bold mb-4">Welcome to {store.name}</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Discover our full collection of quality products.
        </p>
        <Link href={`/store/${subdomain}/products`}>
          <Button size="lg">Shop Now</Button>
        </Link>
      </section>
    </main>
  );
}