'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
} from 'lucide-react';

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
  basePrice?: number;
  price?: number;
  imageUrl?: string | null;
  category?: string;
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
  if (lower.includes('shirt') || lower.includes('t-shirt')) return '👕';
  if (lower.includes('dress')) return '👗';
  if (lower.includes('jacket') || lower.includes('coat')) return '🧥';
  if (lower.includes('jeans') || lower.includes('pants')) return '👖';
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

  const lowerSub = (subdomain || '').toLowerCase();
  const isSports =
    store?.templateConfig?.theme === 'sports' ||
    lowerSub.includes('sport') ||
    lowerSub.includes('fitness');

  const isClothing =
    store?.templateConfig?.theme === 'clothing' ||
    lowerSub.includes('cloth') ||
    lowerSub.includes('fashion') ||
    lowerSub.includes('apparel');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundStore = await apiClient(`/public/stores/${subdomain}`);
        setStore(foundStore);

        const allProducts = await apiClient(`/public/products/store/${foundStore.id}`);
        const foundProduct = Array.isArray(allProducts)
          ? allProducts.find((p: Product) => p.id === productId)
          : null;

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
      const returnUrl = `/store/${subdomain}/cart`;
      sessionStorage.setItem('redirect_after_login', returnUrl);
      window.location.assign(`/login?redirect=${encodeURIComponent(returnUrl)}`);
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
      const returnUrl = `/store/${subdomain}/wishlist`;
      sessionStorage.setItem('redirect_after_login', returnUrl);
      window.location.assign(`/login?redirect=${encodeURIComponent(returnUrl)}`);
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
      <main
        className={`flex min-h-screen items-center justify-center ${
          isSports
            ? 'bg-[#020d09] text-emerald-50'
            : isClothing
            ? 'bg-[#0b0314] text-purple-50'
            : 'bg-slate-950 text-slate-100'
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-6 py-4 backdrop-blur-md ${
            isSports
              ? 'border-emerald-900/50 bg-slate-900/80 text-emerald-300'
              : isClothing
              ? 'border-purple-900/50 bg-slate-900/80 text-purple-300'
              : 'border-slate-800 bg-slate-900/80 text-slate-300'
          }`}
        >
          <div
            className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
              isSports ? 'border-emerald-400' : isClothing ? 'border-purple-400' : 'border-cyan-400'
            }`}
          />
          <span>Loading product details...</span>
        </div>
      </main>
    );
  }

  if (error || !store || !product) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-center gap-4 ${
          isSports
            ? 'bg-[#020d09] text-emerald-50'
            : isClothing
            ? 'bg-[#0b0314] text-purple-50'
            : 'bg-slate-950 text-slate-100'
        }`}
      >
        <p className="text-sm font-semibold text-rose-400">{error || 'Product not found'}</p>
        <Link
          href={`/store/${subdomain}/products`}
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
        >
          Back to Products Catalog
        </Link>
      </main>
    );
  }

  const productEmoji = getProductVisual(product.name);
  const displayPrice = product.price ?? product.basePrice ?? 0;
  const thumbnails = [
    product.imageUrl || productEmoji,
    isSports ? '🏃' : isClothing ? '✨' : '⚡',
    isSports ? '🏋️' : isClothing ? '👗' : '🎧',
    isSports ? '💧' : isClothing ? '🧵' : '📦',
  ];

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isSports
          ? 'bg-[#020d09] text-emerald-50 selection:bg-emerald-500 selection:text-slate-950'
          : isClothing
          ? 'bg-[#0b0314] text-purple-50 selection:bg-purple-500 selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400">
          <Link
            href={`/store/${subdomain}`}
            className={`transition-colors ${
              isSports ? 'hover:text-emerald-400' : isClothing ? 'hover:text-purple-300' : 'hover:text-cyan-300'
            }`}
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/store/${subdomain}/products`}
            className={`transition-colors ${
              isSports ? 'hover:text-emerald-400' : isClothing ? 'hover:text-purple-300' : 'hover:text-cyan-300'
            }`}
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-white font-bold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          
          {/* LEFT: Image & Media Gallery */}
          <section
            className={`rounded-3xl border p-4 md:p-6 backdrop-blur-xl shadow-2xl ${
              isSports
                ? 'border-emerald-900/30 bg-slate-900/60 shadow-emerald-950/20'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60 shadow-purple-950/20'
                : 'border-slate-800/80 bg-slate-900/60 shadow-cyan-950/20'
            }`}
          >
            <div className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span
                className={`rounded-full border px-3 py-1 ${
                  isSports
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : isClothing
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                    : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                }`}
              >
                {isSports ? 'Performance Grade' : isClothing ? 'Curated Fit' : 'Authentic Gear'}
              </span>
              <span className="text-slate-400 font-semibold">Fast Nationwide Dispatch</span>
            </div>

            {/* Hero Visual Preview */}
            <div
              className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 flex h-[340px] md:h-[420px] items-center justify-center ${
                isSports
                  ? 'border-emerald-950/80 bg-gradient-to-br from-emerald-950/30 via-slate-950 to-slate-950'
                  : isClothing
                  ? 'border-purple-950/80 bg-gradient-to-br from-purple-950/30 via-slate-950 to-slate-950'
                  : 'border-slate-800/80 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-slate-950'
              }`}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <span className="text-[120px] md:text-[140px] drop-shadow-2xl transition-transform duration-300 hover:scale-110">
                  {productEmoji}
                </span>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {thumbnails.map((item, index) => {
                const isImage = typeof item === 'string' && item.startsWith('http');
                return (
                  <div
                    key={`${product.id}-${index}`}
                    className={`flex h-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border transition-all ${
                      index === 0
                        ? isSports
                          ? 'border-emerald-500 bg-slate-900 text-emerald-400'
                          : isClothing
                          ? 'border-purple-500 bg-slate-900 text-purple-300'
                          : 'border-cyan-500 bg-slate-900 text-cyan-300'
                        : 'border-slate-800 bg-slate-900/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                    }`}
                  >
                    {isImage ? (
                      <img src={item} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-3xl">{item}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* RIGHT: Product Information & CTAs */}
          <section className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isSports ? 'text-emerald-400' : isClothing ? 'text-purple-300' : 'text-cyan-400'
                  }`}
                >
                  {store.name} Official
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">SKU: {product.id.slice(0, 8).toUpperCase()}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Ratings & Reviews bar */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1 ${
                  isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'
                }`}
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-current" />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-300">4.9</span>
              <span className="text-xs text-slate-500">(128 verified ratings)</span>
            </div>

            {/* Dynamic Price Box */}
            <div
              className={`rounded-2xl border p-5 backdrop-blur-md ${
                isSports
                  ? 'border-emerald-900/40 bg-emerald-950/20'
                  : isClothing
                  ? 'border-purple-900/40 bg-purple-950/20'
                  : 'border-slate-800 bg-slate-900/80'
              }`}
            >
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold block">
                Price (Inclusive of all taxes)
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <p
                  className={`text-3xl sm:text-4xl font-black ${
                    isSports ? 'text-emerald-400' : isClothing ? 'text-purple-300' : 'text-cyan-400'
                  }`}
                >
                  Rs. {Number(displayPrice).toLocaleString()}
                </p>
                <span className="text-sm font-semibold text-slate-500 line-through">
                  Rs. {(Number(displayPrice) * 1.2).toLocaleString()}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isSports
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : isClothing
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}
                >
                  Save 20%
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-slate-300 border-b border-slate-800/80 pb-6">
              {product.description}
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Fast Delivery', desc: '48hr Express' },
                { icon: RotateCcw, label: 'Easy Returns', desc: '7-Day Policy' },
                { icon: ShieldCheck, label: 'Authentic', desc: '100% Genuine' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`rounded-2xl border p-3.5 text-center ${
                      isSports
                        ? 'border-emerald-950 bg-slate-900/60'
                        : isClothing
                        ? 'border-purple-950 bg-slate-900/60'
                        : 'border-slate-800/80 bg-slate-900/60'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={`mx-auto mb-1.5 ${
                        isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'
                      }`}
                    />
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={adding}
                className={`h-12 w-full rounded-xl font-bold text-sm transition-all shadow-lg sm:flex-1 ${
                  isSports
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
                }`}
              >
                <ShoppingBag size={16} className="mr-2" />
                {adding ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToWishlist}
                disabled={wishlisting}
                className={`h-12 w-full rounded-xl border font-bold text-sm backdrop-blur-md transition-all sm:flex-1 ${
                  isSports
                    ? 'border-emerald-900/60 bg-slate-900/80 text-emerald-300 hover:bg-emerald-950/60 hover:border-emerald-500/40'
                    : isClothing
                    ? 'border-purple-900/60 bg-slate-900/80 text-purple-300 hover:bg-purple-950/60 hover:border-purple-500/40'
                    : 'border-slate-800 bg-slate-900/80 text-cyan-300 hover:bg-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <Heart size={16} className="mr-2" />
                {wishlisting ? 'Saving...' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Feedback Alerts */}
            {addedSuccess && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs sm:text-sm text-emerald-400 backdrop-blur-md">
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Item successfully added to cart!
                </span>
                <Link
                  href={`/store/${subdomain}/cart`}
                  className="font-bold underline hover:opacity-80 flex items-center gap-1"
                >
                  View Cart <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {wishlistSuccess && (
              <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs sm:text-sm text-rose-400 backdrop-blur-md">
                <span className="font-semibold flex items-center gap-1.5">
                  <Heart size={16} className="fill-current" /> Item saved to your wishlist!
                </span>
                <Link
                  href={`/store/${subdomain}/wishlist`}
                  className="font-bold underline hover:opacity-80 flex items-center gap-1"
                >
                  View Wishlist <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {cartError && <p className="text-xs font-semibold text-rose-400">{cartError}</p>}
            {wishlistError && <p className="text-xs font-semibold text-rose-400">{wishlistError}</p>}
          </section>
        </div>

        {/* Bottom Detailed Specifications Grid */}
        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <div
            className={`rounded-3xl border p-6 backdrop-blur-md ${
              isSports
                ? 'border-emerald-900/30 bg-slate-900/60'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60'
                : 'border-slate-800/80 bg-slate-900/60'
            }`}
          >
            <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
              <Sparkles
                size={18}
                className={isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
              />
              Product Specifications
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span>Brand Partner</span>
                <span className="text-white font-semibold">Official Authorized</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span>Warranty</span>
                <span className="text-white font-semibold">12 Months Brand Warranty</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span>Condition</span>
                <span className="text-white font-semibold">100% Brand New Sealed</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>Stock Status</span>
                <span
                  className={`font-bold ${
                    isSports ? 'text-emerald-400' : isClothing ? 'text-purple-300' : 'text-cyan-400'
                  }`}
                >
                  In Stock & Ready to Ship
                </span>
              </li>
            </ul>
          </div>

          <div
            className={`rounded-3xl border p-6 backdrop-blur-md ${
              isSports
                ? 'border-emerald-900/30 bg-slate-900/60'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60'
                : 'border-slate-800/80 bg-slate-900/60'
            }`}
          >
            <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck
                size={18}
                className={isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
              />
              Why Shop With Us
            </h2>
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="font-bold text-white text-xs sm:text-sm">Verified Product Sourcing</p>
                <p className="mt-1 text-xs text-slate-400">
                  Every product undergoes strict authenticity checks before packaging.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="font-bold text-white text-xs sm:text-sm">Doorstep Size & Model Exchanges</p>
                <p className="mt-1 text-xs text-slate-400">
                  Enjoy straightforward exchanges with our dedicated after-sales support helpline.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}