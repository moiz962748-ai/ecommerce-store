'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface WishlistItem {
  id: string;
  variantId: string;
  variantName: string;
  price: number;
  productId: string;
  productName: string;
}

function getProductVisual(productName: string) {
  const lower = productName.toLowerCase();
  if (lower.includes('laptop') || lower.includes('computer')) return '💻';
  if (lower.includes('mouse')) return '🖱️';
  if (lower.includes('headphone') || lower.includes('earbud') || lower.includes('audio')) return '🎧';
  if (lower.includes('phone') || lower.includes('mobile')) return '📱';
  if (lower.includes('watch')) return '⌚';
  if (lower.includes('camera')) return '📷';
  if (lower.includes('speaker')) return '🔊';
  if (lower.includes('keyboard')) return '⌨️';
  return '⚡';
}

export default function WishlistPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const fetchWishlist = async () => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const data = await apiClient('/wishlist', { token });
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id: string) => {
    const token = getStoredToken();
    setRemovingId(id);
    try {
      await apiClient(`/wishlist/${id}`, { method: 'DELETE', token: token || undefined });
      await fetchWishlist();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId: string) => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    setAddingId(productId);
    setError(null);
    setCartMessage(null);

    try {
      await apiClient('/cart', {
        method: 'POST',
        token,
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setCartMessage('Added to cart successfully.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-store-background text-store-foreground">
        <div className="rounded-2xl border border-store-border bg-store-card px-6 py-4 text-store-muted">
          Loading wishlist...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-store-background text-store-foreground">
      <header className="border-b border-store-border bg-store-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href={`/store/${subdomain}`} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-store-border bg-store-card text-lg text-store-accent">
              ⚡
            </div>
            <div>
              <p className="text-lg font-bold text-store-foreground store-heading">Wishlist</p>
            </div>
          </Link>

          <Link href={`/store/${subdomain}/products`}>
            <Button variant="outline" className="border-store-border bg-store-card text-store-foreground hover:bg-store-accent hover:text-store-background">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8 rounded-[28px] border border-store-border bg-store-card p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-store-muted">Saved items</p>
          <h1 className="mt-3 text-4xl font-bold text-store-foreground store-heading">Your wishlist</h1>
        </div>

        {error && <p className="mb-5 text-red-500">{error}</p>}
        {cartMessage && <p className="mb-5 text-sm text-green-600">{cartMessage}</p>}

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-store-border bg-store-card px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-store-background text-3xl text-store-accent">
              ♥
            </div>
            <h2 className="text-2xl font-bold text-store-foreground store-heading">Your wishlist is empty</h2>
            <p className="mt-3 text-store-muted">Save products you love and come back anytime.</p>
            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <Button className="bg-store-accent text-store-background hover:bg-store-accent/90">
                Browse products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-[24px] border border-store-border bg-store-card">
                <div className="border-b border-store-border bg-[linear-gradient(135deg,rgba(117,161,255,0.18),rgba(255,255,255,0.04))] p-5">
                  <div className="flex h-48 items-center justify-center text-7xl text-store-accent">
                    {getProductVisual(item.productName)}
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-store-muted">Saved item</p>
                    <Link href={`/store/${subdomain}/products/${item.productId}`}>
                      <h3 className="mt-2 text-xl font-semibold text-store-foreground store-heading hover:text-store-accent">
                        {item.productName}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-store-muted">{item.variantName || 'Standard variant'}</span>
                    <span className="text-2xl font-bold text-store-accent">Rs. {item.price}</span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={addingId === item.productId}
                      className="flex-1 bg-store-accent text-store-background hover:bg-store-accent/90"
                    >
                      {addingId === item.productId ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      className="border-store-border bg-store-background text-store-foreground hover:border-store-accent"
                    >
                      {removingId === item.id ? 'Removing...' : 'Remove'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}