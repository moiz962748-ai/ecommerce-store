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
  templateConfig?: {
    theme?: string;
  };
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
  if (lower.includes('running') || lower.includes('shoe') || lower.includes('sneaker')) return '👟';
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('training')) return '🏋️';
  if (lower.includes('water') || lower.includes('bottle') || lower.includes('hydration')) return '💧';
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
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const [wishlisting, setWishlisting] = useState(false);
  const [wishlistSuccess, setWishlistSuccess] = useState(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  const isSportsStore =
    store?.templateConfig?.theme === 'sports' ||
    subdomain.toLowerCase().includes('sport') ||
    subdomain.toLowerCase().includes('fitness');

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

  const updateLocalStorageCart = () => {
    try {
      const storageKey = `cart_${subdomain}`;
      const existing = localStorage.getItem(storageKey);
      let cartItems = existing ? JSON.parse(existing) : [];
      const itemIndex = cartItems.findIndex((item: any) => item.productId === productId);

      if (itemIndex > -1) {
        cartItems[itemIndex].quantity += 1;
      } else {
        cartItems.push({ productId, quantity: 1 });
      }

      localStorage.setItem(storageKey, JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      // Ignore local storage parse error
    }
  };

  const updateLocalStorageWishlist = () => {
    try {
      const storageKey = `wishlist_${subdomain}`;
      const existing = localStorage.getItem(storageKey);
      let wishlistItems = existing ? JSON.parse(existing) : [];

      if (!wishlistItems.includes(productId)) {
        wishlistItems.push(productId);
      }

      localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch {
      // Ignore local storage parse error
    }
  };

  const handleAddToCart = async () => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    setAdding(true);
    setAddedSuccess(false);
    setCartError(null);

    try {
      await apiClient('/cart', {
        method: 'POST',
        token,
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      updateLocalStorageCart();
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 5000);
    } catch (err: any) {
      setCartError(err.message || 'Failed to add to cart');
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
    setWishlistSuccess(false);
    setWishlistError(null);

    try {
      await apiClient('/wishlist', {
        method: 'POST',
        token,
        body: JSON.stringify({ productId }),
      });

      updateLocalStorageWishlist();
      setWishlistSuccess(true);
      setTimeout(() => setWishlistSuccess(false), 5000);
    } catch (err: any) {
      setWishlistError(err.message || 'Failed to add to wishlist');
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
  const thumbnails = [
    product.imageUrl || productEmoji,
    isSportsStore ? '🏃' : '✨',
    isSportsStore ? '⚡' : '🚀',
    isSportsStore ? '💧' : '📦',
  ];

  return (
    <main className="min-h-screen bg-store-background text-store-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-6 flex items-center gap-2 text-sm text-store-muted">
          <Link href={`/store/${subdomain}`} className="hover:text-store-accent">
            Home
          </Link>
          <span>/</span>
          <Link href={`/store/${subdomain}/products`} className="hover:text-store-accent">
            Products
          </Link>
          <span>/</span>
          <span className="text-store-foreground">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[28px] border border-store-border bg-store-card p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between text-sm text-store-muted">
              <span className="rounded-full border border-store-border bg-store-background px-3 py-1 uppercase tracking-[0.2em]">
                {isSportsStore ? 'Performance pick' : 'Featured item'}
              </span>
              <span>{isSportsStore ? 'Fast shipping' : 'Free shipping'}</span>
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
              <h1 className="text-4xl font-bold tracking-tight text-store-foreground store-heading">
                {product.name}
              </h1>
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
                <div
                  key={item}
                  className="rounded-xl border border-store-border bg-store-card px-3 py-3 text-center text-sm text-store-foreground"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={adding}
                className="h-12 w-full rounded-xl bg-store-accent text-store-background hover:bg-store-accent/90 sm:flex-1"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToWishlist}
                disabled={wishlisting}
                className="h-12 w-full rounded-xl border-2 border-store-border bg-store-card text-store-foreground hover:bg-store-accent hover:text-store-background sm:flex-1"
              >
                {wishlisting ? 'Saving...' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Instant Feedback Banners for Cart & Wishlist */}
            {addedSuccess && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-600 dark:text-emerald-400">
                <span className="font-medium">✓ Item successfully added to cart!</span>
                <Link
                  href={`/store/${subdomain}/cart`}
                  className="font-semibold underline hover:opacity-80"
                >
                  View Cart →
                </Link>
              </div>
            )}

            {wishlistSuccess && (
              <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-600 dark:text-rose-400">
                <span className="font-medium">♥ Item saved to wishlist!</span>
                <Link
                  href={`/store/${subdomain}/wishlist`}
                  className="font-semibold underline hover:opacity-80"
                >
                  View Wishlist →
                </Link>
              </div>
            )}

            {cartError && <p className="text-sm text-red-500">{cartError}</p>}
            {wishlistError && <p className="text-sm text-red-500">{wishlistError}</p>}
          </section>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[24px] border border-store-border bg-store-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-store-foreground store-heading">
              Product Details
            </h2>
            <ul className="space-y-3 text-store-muted">
              <li className="flex justify-between gap-4 border-b border-store-border pb-2">
                <span>Brand</span>
                <span className="text-store-foreground">Premium Series</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-store-border pb-2">
                <span>Warranty</span>
                <span className="text-store-foreground">12 months</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-store-border pb-2">
                <span>Condition</span>
                <span className="text-store-foreground">New</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Availability</span>
                <span className="text-store-foreground">In stock</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-store-border bg-store-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-store-foreground store-heading">
              Why customers buy
            </h2>
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