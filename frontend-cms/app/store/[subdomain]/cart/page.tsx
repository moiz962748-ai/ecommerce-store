'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
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

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  if (loading) {
    return (
      <main className="p-8">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b p-6 flex items-center justify-between">
        <Link href={`/store/${subdomain}`}>
          <h1 className="text-xl font-bold">Cart</h1>
        </Link>
        <Link href={`/store/${subdomain}/products`} className="text-sm underline">
          Continue Shopping
        </Link>
      </header>

      <div className="max-w-3xl mx-auto p-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {items.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>Rs. {item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>Rs. {Number(item.price) * item.quantity}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        disabled={removingId === item.id}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xl font-bold">Total: Rs. {total}</p>
              <Link href={`/store/${subdomain}/checkout`}>
                <Button size="lg">Proceed to Checkout</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}