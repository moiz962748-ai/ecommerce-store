'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

  // Address form fields
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
      // storeId is required by POST /orders (DTO expects a UUID, not the
      // subdomain string), so resolve it from the public store-by-subdomain
      // endpoint — same one the products/product-detail pages use.
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

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

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
      // POST /orders expects: { storeId, price, address, userId? }
      // userId is derived from the JWT on the backend, so we don't send it.
      const result = await apiClient('/orders', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify({
          storeId: store.id,
          price: total,
          address: `${fullName} | ${phone} | ${address}`,
        }),
      });

      // Backend only creates the Order row (no OrderItems, no cart-clearing),
      // so we clear the cart ourselves the same way the cart page's Remove
      // button does, one item at a time.
      await Promise.all(
        items.map((item) =>
          apiClient(`/cart/${item.id}`, { method: 'DELETE', token: token || undefined }),
        ),
      );

      // There's no GET /orders/:id endpoint yet, so show confirmation right
      // here instead of routing to a page that doesn't exist.
      setPlacedOrder(result.order ?? result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (placedOrder) {
    return (
      <main className="min-h-screen">
        <header className="border-b p-6">
          <h1 className="text-xl font-bold">Order Confirmed</h1>
        </header>
        <div className="max-w-xl mx-auto p-8 space-y-4">
          <p className="text-lg">Thank you! Your order has been placed.</p>
          <div className="border rounded-md p-4 space-y-1 text-sm">
            <p><span className="font-medium">Order ID:</span> {placedOrder.id}</p>
            <p><span className="font-medium">Total:</span> Rs. {placedOrder.price}</p>
            <p><span className="font-medium">Status:</span> {placedOrder.orderStatus}</p>
            <p><span className="font-medium">Payment:</span> Cash on Delivery</p>
          </div>
          <Link href={`/store/${subdomain}/products`}>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b p-6 flex items-center justify-between">
        <Link href={`/store/${subdomain}`}>
          <h1 className="text-xl font-bold">Checkout</h1>
        </Link>
        <Link href={`/store/${subdomain}/cart`} className="text-sm underline">
          Back to Cart
        </Link>
      </header>

      <div className="max-w-3xl mx-auto p-8 space-y-8">
        {error && <p className="text-red-500">{error}</p>}

        {/* Order summary */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>Rs. {item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>Rs. {Number(item.price) * item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xl font-bold mt-4 text-right">Total: Rs. {total}</p>
        </section>

        {/* Address form */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Delivery Details</h2>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XXXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <textarea
              id="address"
              value={address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)}
              placeholder="House #, Street, Area, City"
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </section>

        {/* Payment method */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <div className="border rounded-md p-4 bg-muted/30">
            <p className="font-medium">Cash on Delivery</p>
            <p className="text-sm text-muted-foreground">
              Pay in cash when your order arrives.
            </p>
          </div>
        </section>

        <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={submitting}>
          {submitting ? 'Placing Order...' : `Place Order — Rs. ${total}`}
        </Button>
      </div>
    </main>
  );
}