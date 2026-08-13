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
  const [wishlisting, setWishlisting] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);

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
      } catch {
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

  const handleAddToWishlist = async () => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    setWishlisting(true);
    setWishlistMessage(null);
    try {
      await apiClient('/wishlist', {
        method: 'POST',
        token,
        body: JSON.stringify({ productId }),
      });
      setWishlistMessage('Added to wishlist!');
    } catch (err: any) {
      setWishlistMessage(err.message);
    } finally {
      setWishlisting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-store-background text-store-foreground">
        <div className="rounded-2xl border border-store-border bg-store-card px-6 py-4 text-store-muted">
          Loading product...
        </div>
      </main>
    );
  }

  if (error || !store || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-store-background text-store-foreground">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </main>
    );
  }

  const productEmoji = getProductVisual(product.name);
  const thumbnails = [product.imageUrl || productEmoji, '✨', '🚀', '📦'];

  return (
    <main className="min-h-screen bg-store-background text-store-foreground">
      <header className="border-b border-store-border bg-store-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href={`/store/${subdomain}`} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-store-border bg-store-card text-lg text-store-accent">
              ⚡
            </div>
            <div>
              <p className="text-lg font-bold text-store-foreground store-heading">{store.name}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href={`/store/${subdomain}`} className="text-store-muted hover:text-store-accent">Home</Link>
            <Link href={`/store/${subdomain}/products`} className="text-store-muted hover:text-store-accent">Shop</Link>
            <Link href={`/store/${subdomain}/wishlist`} className="text-store-muted hover:text-store-accent">Wishlist</Link>
            <Link href={`/store/${subdomain}/cart`} className="text-store-muted hover:text-store-accent">Cart</Link>
          </nav>

          <Link href="/login">
            <Button variant="outline" className="border-store-border bg-store-card text-store-foreground hover:bg-store-accent hover:text-store-background">
              Login
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-6 flex items-center gap-2 text-sm text-store-muted">
          <Link href={`/store/${subdomain}`} className="hover:text-store-accent">Home</Link>
          <span>/</span>
          <Link href={`/store/${subdomain}/products`} className="hover:text-store-accent">Products</Link>
          <span>/</span>
          <span className="text-store-foreground">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[28px] border border-store-border bg-store-card p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between text-sm text-store-muted">
              <span className="rounded-full border border-store-border bg-store-background px-3 py-1 uppercase tracking-[0.2em]">
                Featured item
              </span>
              <span>Free shipping</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-store-border bg-[linear-gradient(135deg,rgba(117,161,255,0.16),rgba(255,255,255,0.04))] p-6 md:p-8">
              <div className="flex h-[340px] items-center justify-center overflow-hidden rounded-xl bg-store-background md:h-[420px]">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[130px] text-store-accent">{productEmoji}</span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {thumbnails.map((item, index) => {
                const isImage = typeof item === 'string' && item.startsWith('http');
                return (
                  <div
                    key={`${product.id}-${index}`}
                    className={[
                      'flex h-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border transition-all',
                      index === 0
                        ? 'border-store-accent bg-store-background text-store-accent'
                        : 'border-store-border bg-store-background text-store-foreground opacity-75 hover:border-store-accent',
                    ].join(' ')}
                  >
                    {isImage ? (
                      <img src={item} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-4xl">{item}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-store-muted">{store.name}</p>
              <h1 className="text-4xl font-bold tracking-tight text-store-foreground store-heading">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400">★★★★★</div>
              <span className="text-sm text-store-muted">4.9 rating</span>
            </div>

            <div className="rounded-2xl border border-store-border bg-store-background p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-store-muted">Price</p>
              <p className="mt-2 text-4xl font-bold text-store-accent">Rs. {product.basePrice}</p>
            </div>

            <div className="space-y-3 text-store-muted">
              <p className="text-base leading-7">{product.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {['Free delivery', '7-day return', 'Secure payment'].map((item) => (
                <div key={item} className="rounded-xl border border-store-border bg-store-card px-3 py-3 text-center text-sm text-store-foreground">
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 bg-store-accent text-store-background hover:bg-store-accent/90"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToWishlist}
                disabled={wishlisting}
                className="flex-1 border-store-border bg-store-card text-store-foreground hover:bg-store-accent hover:text-store-background"
              >
                {wishlisting ? 'Saving...' : 'Add to Wishlist'}
              </Button>
            </div>

            {addedMessage && <p className="text-sm text-green-600">{addedMessage}</p>}
            {wishlistMessage && <p className="text-sm text-green-600">{wishlistMessage}</p>}
          </section>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[24px] border border-store-border bg-store-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-store-foreground store-heading">Product Details</h2>
            <ul className="space-y-3 text-store-muted">
              <li className="flex justify-between gap-4 border-b border-store-border pb-2"><span>Brand</span><span className="text-store-foreground">Premium Series</span></li>
              <li className="flex justify-between gap-4 border-b border-store-border pb-2"><span>Warranty</span><span className="text-store-foreground">12 months</span></li>
              <li className="flex justify-between gap-4 border-b border-store-border pb-2"><span>Condition</span><span className="text-store-foreground">New</span></li>
              <li className="flex justify-between gap-4"><span>Availability</span><span className="text-store-foreground">In stock</span></li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-store-border bg-store-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-store-foreground store-heading">Why customers buy</h2>
            <div className="space-y-4 text-store-muted">
              <div className="rounded-2xl border border-store-border bg-store-background p-4">
                <p className="font-semibold text-store-foreground">High performance</p>
                <p className="mt-1">Built for smooth everyday use with a premium finish.</p>
              </div>
              <div className="rounded-2xl border border-store-border bg-store-background p-4">
                <p className="font-semibold text-store-foreground">Ready to use</p>
                <p className="mt-1">Quick setup and dependable support from the store team.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}