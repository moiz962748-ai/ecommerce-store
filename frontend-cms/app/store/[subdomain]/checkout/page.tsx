'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CartItem {
  id: string;
  quantity: number;
  variantId: string;
  variantName: string;
  price: number;
  productId: string;
  productName: string;
}

interface StoreInfo {
  id: string;
  name: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;

  const [items, setItems] = useState<CartItem[]>([]);
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const loadData = async () => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const [cartData, storeData] = await Promise.all([
        apiClient('/cart', { token }),
        apiClient(`/public/stores/${subdomain}`),
      ]);

      setItems(cartData);
      setStore(storeData);

      if (cartData.length === 0) {
        router.push(`/store/${subdomain}/cart`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setError(null);

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in your name, phone, and address.');
      return;
    }
    if (!store) {
      setError('Could not resolve this store. Please refresh and try again.');
      return;
    }

    const token = getStoredToken();
    setSubmitting(true);

    try {
      const result = await apiClient('/orders', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify({
          storeId: store.id,
          price: total,
          address: `${fullName} | ${phone} | ${address}`,
        }),
      });

      await Promise.all(
        items.map((item) =>
          apiClient(`/cart/${item.id}`, { method: 'DELETE', token: token || undefined }),
        ),
      );

      setPlacedOrder(result.order ?? result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-store-background text-store-foreground">
        <div className="rounded-2xl border border-store-border bg-store-card px-6 py-4 text-store-muted">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (placedOrder) {
    return (
      <main className="min-h-screen bg-store-background text-store-foreground">
        <header className="border-b border-store-border bg-store-background/95 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
            <h1 className="text-2xl font-bold text-store-foreground store-heading">Order confirmed</h1>
          </div>
        </header>

        <div className="mx-auto max-w-xl px-4 py-10 md:px-8">
          <div className="rounded-[28px] border border-store-border bg-store-card p-8">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-store-background text-3xl text-store-accent">
              ✓
            </div>
            <p className="text-3xl font-bold text-store-foreground store-heading">Thank you!</p>
            <p className="mt-3 text-store-muted">Your order has been placed successfully.</p>

            <div className="mt-6 space-y-3 rounded-2xl border border-store-border bg-store-background p-4 text-sm text-store-muted">
              <p><span className="font-semibold text-store-foreground">Order ID:</span> {placedOrder.id}</p>
              <p><span className="font-semibold text-store-foreground">Total:</span> Rs. {placedOrder.price}</p>
              <p><span className="font-semibold text-store-foreground">Status:</span> {placedOrder.orderStatus}</p>
              <p><span className="font-semibold text-store-foreground">Payment:</span> Cash on Delivery</p>
            </div>

            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <Button className="bg-store-accent text-store-background hover:bg-store-accent/90">
                Continue shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-store-background text-store-foreground">
      <header className="border-b border-store-border bg-store-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          

          <Link href={`/store/${subdomain}/cart`}>
            <Button variant="outline" className="border-store-border bg-store-card text-store-foreground hover:bg-store-accent hover:text-store-background">
              Back to cart
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8 rounded-[28px] border border-store-border bg-store-card p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-store-muted">{subdomain.toLowerCase().includes('sport') || subdomain.toLowerCase().includes('fitness') ? 'Ready to move' : 'Secure checkout'}</p>
          <h1 className="mt-3 text-4xl font-bold text-store-foreground store-heading">{subdomain.toLowerCase().includes('sport') || subdomain.toLowerCase().includes('fitness') ? 'Finish your order' : 'Complete your order'}</h1>
        </div>

        {error && <p className="mb-5 text-red-500">{error}</p>}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6 rounded-[28px] border border-store-border bg-store-card p-6">
            <div>
              <h2 className="text-2xl font-bold text-store-foreground store-heading">Delivery details</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-store-foreground">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="border-store-border bg-store-background text-store-foreground placeholder:text-store-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-store-foreground">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="border-store-border bg-store-background text-store-foreground placeholder:text-store-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-store-foreground">Delivery Address</Label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)}
                  placeholder="House #, Street, Area, City"
                  rows={5}
                  className="w-full rounded-md border border-store-border bg-store-background px-3 py-2 text-sm text-store-foreground placeholder:text-store-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-store-accent"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-store-border bg-store-background p-4">
              <p className="text-lg font-semibold text-store-foreground store-heading">Payment method</p>
              <p className="mt-2 text-store-muted">Cash on Delivery</p>
            </div>
          </section>

          <aside className="rounded-[28px] border border-store-border bg-store-card p-6">
            <h2 className="text-2xl font-bold text-store-foreground store-heading">Order summary</h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-store-border bg-store-background p-3">
                  <div>
                    <p className="font-medium text-store-foreground">{item.productName}</p>
                    <p className="text-xs text-store-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-store-foreground">Rs. {Number(item.price) * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-store-border pt-4 text-sm text-store-muted">
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

            <div className="mt-6 flex items-center justify-between border-t border-store-border pt-4 text-lg font-bold text-store-foreground">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>

            <Button
              size="lg"
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="mt-6 w-full bg-store-accent text-store-background hover:bg-store-accent/90"
            >
              {submitting ? 'Placing order...' : `Place order — Rs. ${total}`}
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
}