'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  quantity: number;
  variantId: string;
  variantName: string;
  price: number;
  productId: string;
  productName: string;
  imageUrl?: string | null;
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

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchCart = async () => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const data = await apiClient('/cart', { token });
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id: string) => {
    const token = getStoredToken();
    setRemovingId(id);
    try {
      await apiClient(`/cart/${id}`, { method: 'DELETE', token: token || undefined });
      await fetchCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-store-background text-store-foreground">
        <div className="rounded-2xl border border-store-border bg-store-card px-6 py-4 text-store-muted">
          Loading cart...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-store-background text-store-foreground">
      <header className="border-b border-store-border bg-store-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href={`/store/${subdomain}`} className="flex items-center gap-3">
            <div>
              <p className="text-lg font-bold text-store-foreground store-heading">Cart</p>
            </div>
          </Link>

          <Link href={`/store/${subdomain}/products`}>
            <Button variant="outline" className="border-store-border bg-store-card text-store-foreground hover:bg-store-accent hover:text-store-background">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8 rounded-[28px] border border-store-border bg-store-card p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-store-muted">{subdomain.toLowerCase().includes('sport') || subdomain.toLowerCase().includes('fitness') ? 'Ready to train' : 'Your basket'}</p>
          <h1 className="mt-3 text-4xl font-bold text-store-foreground store-heading">{subdomain.toLowerCase().includes('sport') || subdomain.toLowerCase().includes('fitness') ? 'Training gear cart' : 'Shopping cart'}</h1>
        </div>

        {error && <p className="mb-5 text-red-500">{error}</p>}

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-store-border bg-store-card px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-store-background text-3xl text-store-accent">
              🛒
            </div>
            <h2 className="text-2xl font-bold text-store-foreground store-heading">Your cart is empty</h2>
            <p className="mt-3 text-store-muted">Add your favorite items to continue shopping.</p>
            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <Button className="bg-store-accent text-store-background hover:bg-store-accent/90">
                Browse products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-[24px] border border-store-border bg-store-card p-4 sm:flex-row sm:items-center">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-store-border bg-[linear-gradient(135deg,rgba(117,161,255,0.18),rgba(255,255,255,0.04))]">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-5xl text-store-accent">{getProductVisual(item.productName)}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <Link href={`/store/${subdomain}/products/${item.productId}`}>
                          <h2 className="text-xl font-semibold text-store-foreground store-heading hover:text-store-accent">
                            {item.productName}
                          </h2>
                        </Link>
                        <p className="mt-1 text-sm text-store-muted">{item.variantName || 'Standard variant'}</p>
                      </div>

                      <p className="text-2xl font-bold text-store-accent">Rs. {item.price}</p>
                    </div>

                    <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="rounded-full border border-store-border bg-store-background px-3 py-1 text-sm text-store-foreground">
                        Qty: {item.quantity}
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={`/store/${subdomain}/products/${item.productId}`} className="text-sm text-store-muted hover:text-store-accent">
                          View item
                        </Link>
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
                </div>
              ))}
            </div>

            <aside className="rounded-[28px] border border-store-border bg-store-card p-6">
              <h2 className="text-2xl font-bold text-store-foreground store-heading">Summary</h2>

              <div className="mt-6 space-y-4 text-sm text-store-muted">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-store-foreground">Rs. {subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="text-store-foreground">Rs. {shipping}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span className="text-store-foreground">Rs. 0</span>
                </div>
              </div>

              <div className="mt-6 border-t border-store-border pt-4">
                <div className="flex items-center justify-between text-lg font-semibold text-store-foreground">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>
              </div>

              <Link href={`/store/${subdomain}/checkout`} className="mt-6 block">
                <Button size="lg" className="w-full bg-store-accent text-store-background hover:bg-store-accent/90">
                  Proceed to checkout
                </Button>
              </Link>

              <Link href={`/store/${subdomain}/products`} className="mt-3 block text-center text-sm text-store-muted hover:text-store-accent">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}