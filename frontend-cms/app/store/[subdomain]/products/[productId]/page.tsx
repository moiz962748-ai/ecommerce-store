'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface Store {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;
  const productId = params.productId as string;

  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundStore = await apiClient(`/public/stores/${subdomain}`);
        setStore(foundStore);

        const allProducts = await apiClient(`/public/products/store/${foundStore.id}`);
        const foundProduct = allProducts.find((p: Product) => p.id === productId);

        if (!foundProduct) {
          setError('Product not found');
        } else {
          setProduct(foundProduct);
        }
      } catch (err: any) {
        setError('Unable to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subdomain, productId]);

  const handleAddToCart = async () => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    setAdding(true);
    setAddedMessage(null);
    try {
      await apiClient('/cart', {
        method: 'POST',
        token,
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setAddedMessage('Added to cart!');
    } catch (err: any) {
      setAddedMessage(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (error || !store || !product) {
    return (
      <main className="p-8">
        <p className="text-red-500">{error || 'Not found'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b p-6 flex items-center justify-between">
        <Link href={`/store/${subdomain}`}>
          <h1 className="text-xl font-bold">{store.name}</h1>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href={`/store/${subdomain}/products`} className="text-sm underline">
            Back to Products
          </Link>
          <Link href={`/store/${subdomain}/cart`} className="text-sm underline">
            Cart
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
        <p className="text-2xl font-semibold text-muted-foreground mb-6">
          Rs. {product.basePrice}
        </p>
        <p className="mb-8">{product.description}</p>

        <Button size="lg" onClick={handleAddToCart} disabled={adding}>
          {adding ? 'Adding...' : 'Add to Cart'}
        </Button>

        {addedMessage && (
          <p className="mt-3 text-sm text-green-600">{addedMessage}</p>
        )}
      </div>
    </main>
  );
}