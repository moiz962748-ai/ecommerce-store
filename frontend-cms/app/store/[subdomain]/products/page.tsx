'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Store {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

export default function StoreProductsPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundStore = await apiClient(`/public/stores/${subdomain}`);
        setStore(foundStore);

        const productsData = await apiClient(`/public/products/store/${foundStore.id}`);        setProducts(productsData);
      } catch (err: any) {
        setError('Unable to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subdomain]);

  if (loading) {
    return (
      <main className="p-8">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="p-8">
        <p className="text-red-500">{error || 'Store not found'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b p-6 flex items-center justify-between">
        <Link href={`/store/${subdomain}`}>
          <h1 className="text-xl font-bold">{store.name}</h1>
        </Link>
      </header>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">All Products</h2>

        {products.length === 0 ? (
          <p className="text-muted-foreground">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="text-base">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="font-bold">Rs. {product.basePrice}</span>
                  <Link
                    href={`/store/${subdomain}/products/${product.id}`}
                    className="text-sm underline"
                  >
                    View
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}