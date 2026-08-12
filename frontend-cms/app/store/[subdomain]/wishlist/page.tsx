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

interface WishlistItem {
  id: string;
  variantId: string;
  variantName: string;
  price: number;
  productId: string;
  productName: string;
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
    setAddingId(productId);
    try {
      await apiClient('/cart', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify({ productId, quantity: 1 }),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingId(null);
    }
  };

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
          <h1 className="text-xl font-bold">Wishlist</h1>
        </Link>
        <Link href={`/store/${subdomain}/products`} className="text-sm underline">
          Continue Shopping
        </Link>
      </header>

      <div className="max-w-3xl mx-auto p-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {items.length === 0 ? (
          <p className="text-muted-foreground">Your wishlist is empty.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>Rs. {item.price}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={addingId === item.productId}
                    >
                      {addingId === item.productId ? 'Adding...' : 'Add to Cart'}
                    </Button>
                  </TableCell>
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
        )}
      </div>
    </main>
  );
}