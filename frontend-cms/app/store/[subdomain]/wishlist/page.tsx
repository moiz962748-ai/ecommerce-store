'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface WishlistItem {
  id: string;
  variantId: string;
  variantName: string;
  price: number;
  productId: string;
  productName: string;
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
  if (lower.includes('shirt') || lower.includes('t-shirt')) return '👕';
  if (lower.includes('dress')) return '👗';
  if (lower.includes('jacket') || lower.includes('coat')) return '🧥';
  if (lower.includes('jeans') || lower.includes('pants')) return '👖';
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

  const lowerSub = (subdomain || '').toLowerCase();
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');

  const fetchWishlist = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(`/store/${subdomain}/wishlist`)}`);
      return;
    }

    try {
      const data = await apiClient('/wishlist', { token });
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  }, [subdomain, router]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (id: string) => {
    const token = getStoredToken();
    setRemovingId(id);
    try {
      await apiClient(`/wishlist/${id}`, { method: 'DELETE', token: token || undefined });
      await fetchWishlist();
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId: string) => {
    const token = getStoredToken();
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(`/store/${subdomain}/wishlist`)}`);
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
      setCartMessage('Item added to cart successfully.');
      window.dispatchEvent(new Event('cart-updated'));
      setTimeout(() => setCartMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to add item to cart');
    } finally {
      setAddingId(null);
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
          <span>Loading your wishlist...</span>
        </div>
      </main>
    );
  }

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
      {/* Top Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md ${
          isSports
            ? 'border-emerald-950/80 bg-[#020d09]/90'
            : isClothing
            ? 'border-purple-950/80 bg-[#0b0314]/90'
            : 'border-slate-900 bg-slate-950/90'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8">
          <Link
            href={`/store/${subdomain}`}
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Store</span>
          </Link>

          <Link href={`/store/${subdomain}/products`}>
            <Button
              variant="outline"
              className={`rounded-xl border text-xs font-bold transition-all ${
                isSports
                  ? 'border-emerald-900/50 bg-slate-900/80 text-emerald-300 hover:bg-emerald-950/60 hover:border-emerald-500/40'
                  : isClothing
                  ? 'border-purple-900/50 bg-slate-900/80 text-purple-300 hover:bg-purple-950/60 hover:border-purple-500/40'
                  : 'border-slate-800 bg-slate-900/80 text-cyan-300 hover:bg-slate-800 hover:border-cyan-500/40'
              }`}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Banner Section */}
        <div
          className={`relative mb-8 overflow-hidden rounded-3xl border p-6 md:p-8 backdrop-blur-xl shadow-xl ${
            isSports
              ? 'border-emerald-900/40 bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-slate-950'
              : isClothing
              ? 'border-purple-900/40 bg-gradient-to-br from-purple-950/30 via-slate-900/70 to-slate-950'
              : 'border-cyan-900/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/70 to-slate-950'
          }`}
        >
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider mb-3 ${
              isSports
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : isClothing
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
            }`}
          >
            <Sparkles size={12} />
            {isSports ? 'Saved Training Gear' : isClothing ? 'Saved Styles' : 'Saved Hardware'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Wishlist ({items.length})
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Keep track of items you love and move them to your cart whenever you are ready.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm font-semibold text-rose-400">
            {error}
          </div>
        )}

        {cartMessage && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs sm:text-sm font-semibold text-emerald-400 backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> {cartMessage}
            </span>
            <Link
              href={`/store/${subdomain}/cart`}
              className="font-bold underline hover:opacity-80 flex items-center gap-1"
            >
              View Cart <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Empty Wishlist State */}
        {items.length === 0 ? (
          <div
            className={`rounded-3xl border border-dashed p-12 text-center backdrop-blur-md ${
              isSports
                ? 'border-emerald-950 bg-slate-900/40'
                : isClothing
                ? 'border-purple-950 bg-slate-900/40'
                : 'border-slate-900 bg-slate-900/40'
            }`}
          >
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-lg ${
                isSports
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-3xl'
                  : isClothing
                  ? 'border-purple-500/30 bg-purple-500/10 text-purple-400 text-3xl'
                  : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-3xl'
              }`}
            >
              <Heart size={28} className="fill-current" />
            </div>
            <h2 className="text-2xl font-bold text-white">Your wishlist is empty</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Save your favorite items here while exploring the store to review them later.
            </p>
            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <span
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg ${
                  isSports
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
                }`}
              >
                Explore Products
                <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-xl ${
                  isSports
                    ? 'border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/90'
                    : isClothing
                    ? 'border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/90'
                    : 'border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90'
                }`}
              >
                <div>
                  {/* Visual Preview */}
                  <div
                    className={`relative flex h-48 items-center justify-center overflow-hidden border-b p-5 ${
                      isSports
                        ? 'border-emerald-950/80 bg-emerald-950/20'
                        : isClothing
                        ? 'border-purple-950/80 bg-purple-950/20'
                        : 'border-slate-800/80 bg-slate-950/40'
                    }`}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
                        {getProductVisual(item.productName)}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      aria-label="Remove item"
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/80 text-slate-400 hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Info Details */}
                  <div className="p-5">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                      Saved Item
                    </span>
                    <Link href={`/store/${subdomain}/products/${item.productId}`}>
                      <h3
                        className={`text-base font-bold text-white transition-colors truncate hover:underline ${
                          isSports
                            ? 'hover:text-emerald-400'
                            : isClothing
                            ? 'hover:text-purple-300'
                            : 'hover:text-cyan-300'
                        }`}
                      >
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-400 mt-1">
                      {item.variantName || 'Standard Edition'}
                    </p>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div
                  className={`mt-2 border-t p-5 pt-4 flex flex-col gap-3 ${
                    isSports
                      ? 'border-emerald-950/80'
                      : isClothing
                      ? 'border-purple-950/80'
                      : 'border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Price</span>
                    <span
                      className={`text-lg font-black ${
                        isSports
                          ? 'text-emerald-400'
                          : isClothing
                          ? 'text-purple-300'
                          : 'text-cyan-400'
                      }`}
                    >
                      Rs. {Number(item.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={addingId === item.productId}
                      className={`h-10 flex-1 rounded-xl text-xs font-bold transition-all shadow-md ${
                        isSports
                          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                          : isClothing
                          ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                          : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
                      }`}
                    >
                      <ShoppingBag size={14} className="mr-1.5" />
                      {addingId === item.productId ? 'Adding...' : 'Move to Cart'}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      className={`h-10 rounded-xl border px-3 text-xs font-bold transition-all ${
                        isSports
                          ? 'border-emerald-900/60 bg-slate-900/80 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40'
                          : isClothing
                          ? 'border-purple-900/60 bg-slate-900/80 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40'
                          : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40'
                      }`}
                    >
                      {removingId === item.id ? '...' : 'Remove'}
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