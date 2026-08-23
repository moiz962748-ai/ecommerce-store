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
  if (lower.includes('shawl') || lower.includes('velvet') || lower.includes('dupatta')) return '🧣';
  if (lower.includes('pret') || lower.includes('suit') || lower.includes('dress') || lower.includes('kurti')) return '👗';
  if (lower.includes('abaya') || lower.includes('pishwas') || lower.includes('couture') || lower.includes('silk')) return '✨';
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
  if (lower.includes('jacket') || lower.includes('coat')) return '🧥';
  if (lower.includes('jeans') || lower.includes('pants')) return '👖';
  return '✨';
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
  const isBoutique = lowerSub.includes('boutique') || lowerSub.includes('luxury');
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
        className={`flex min-h-screen items-center justify-center p-8 ${
          isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-xs ${
            isBoutique
              ? 'border-border bg-card text-foreground'
              : isSports
              ? 'border-emerald-200 bg-white text-emerald-800'
              : isClothing
              ? 'border-purple-200 bg-white text-purple-800'
              : 'border-slate-200 bg-white text-sky-800'
          }`}
        >
          <div
            className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
              isBoutique
                ? 'border-foreground'
                : isSports
                ? 'border-emerald-600'
                : isClothing
                ? 'border-purple-600'
                : 'border-sky-600'
            }`}
          />
          <span className="text-sm font-medium">Loading your wishlist...</span>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md ${
          isBoutique
            ? 'border-border bg-background/90'
            : 'border-slate-200/80 bg-white/95'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8">
          <Link
            href={`/store/${subdomain}`}
            className={`flex items-center gap-2 text-sm font-bold transition-colors ${
              isBoutique
                ? 'text-foreground hover:opacity-80'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <ArrowLeft size={16} />
            <span>{isBoutique ? 'Back to Atelier' : 'Back to Store'}</span>
          </Link>

          <Link href={`/store/${subdomain}/products`}>
            <Button
              variant="outline"
              className={`rounded-xl border text-xs font-bold transition-all shadow-xs ${
                isBoutique
                  ? 'border-border bg-card text-foreground hover:bg-accent'
                  : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
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
          className={`relative mb-8 overflow-hidden rounded-3xl border p-6 md:p-8 shadow-xs ${
            isBoutique
              ? 'border-border bg-card'
              : isSports
              ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40'
              : isClothing
              ? 'border-purple-200/80 bg-gradient-to-br from-purple-50 via-white to-purple-50/40'
              : 'border-slate-200 bg-gradient-to-br from-sky-50 via-white to-slate-50'
          }`}
        >
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider mb-3 shadow-xs ${
              isBoutique
                ? 'border-border bg-accent text-foreground'
                : isSports
                ? 'border-emerald-200 bg-emerald-100/70 text-emerald-800'
                : isClothing
                ? 'border-purple-200 bg-purple-100/70 text-purple-800'
                : 'border-sky-200 bg-sky-100/70 text-sky-800'
            }`}
          >
            <Sparkles size={12} />
            {isBoutique ? 'Saved Silhouettes' : isSports ? 'Saved Training Gear' : isClothing ? 'Saved Styles' : 'Saved Hardware'}
          </div>

          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
            My Wishlist ({items.length})
          </h1>
          <p className={`mt-2 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
            Keep track of items you admire and move them to your cart whenever you are ready.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm font-semibold text-rose-800 shadow-xs">
            {error}
          </div>
        )}

        {cartMessage && (
          <div className={`mb-6 flex items-center justify-between rounded-2xl border p-4 text-xs sm:text-sm font-semibold shadow-xs ${
            isBoutique
              ? 'border-border bg-card text-foreground'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}>
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
            className={`rounded-3xl border border-dashed p-12 text-center shadow-xs ${
              isBoutique
                ? 'border-border bg-card'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-xs ${
                isBoutique
                  ? 'border-border bg-accent text-foreground text-3xl'
                  : isSports
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-3xl'
                  : isClothing
                  ? 'border-purple-200 bg-purple-50 text-purple-700 text-3xl'
                  : 'border-sky-200 bg-sky-50 text-sky-700 text-3xl'
              }`}
            >
              <Heart size={28} className="fill-current" />
            </div>
            <h2 className={`text-2xl font-bold ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>Your wishlist is empty</h2>
            <p className={`mt-2 text-xs sm:text-sm max-w-sm mx-auto ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
              Save your favorite items here while exploring the catalog.
            </p>
            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <span
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                  isBoutique
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : isSports
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
              >
                <span>Explore Collection</span>
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
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-xs ${
                  isBoutique
                    ? 'border-border bg-card hover:border-foreground/20 hover:shadow-md'
                    : isSports
                    ? 'border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-md'
                    : isClothing
                    ? 'border-purple-100 bg-white hover:border-purple-300 hover:shadow-md'
                    : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Visual Preview */}
                  <div
                    className={`relative flex h-48 items-center justify-center overflow-hidden border-b p-5 ${
                      isBoutique
                        ? 'border-border bg-accent/30'
                        : isSports
                        ? 'border-emerald-100 bg-emerald-50/50'
                        : isClothing
                        ? 'border-purple-100 bg-purple-50/50'
                        : 'border-slate-100 bg-slate-50'
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
                      className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border transition-colors shadow-xs ${
                        isBoutique
                          ? 'border-border bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                          : 'border-slate-200 bg-white text-slate-400 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600'
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Info Details */}
                  <div className="p-5">
                    <span className={`text-[10px] uppercase tracking-widest font-bold block mb-1 ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                      Saved Item
                    </span>
                    <Link href={`/store/${subdomain}/products/${item.productId}`}>
                      <h3
                        className={`text-base font-bold transition-colors truncate hover:underline ${
                          isBoutique
                            ? 'text-foreground hover:opacity-80'
                            : isSports
                            ? 'text-slate-950 hover:text-emerald-700'
                            : isClothing
                            ? 'text-slate-950 hover:text-purple-700'
                            : 'text-slate-950 hover:text-sky-700'
                        }`}
                      >
                        {item.productName}
                      </h3>
                    </Link>
                    <p className={`text-xs mt-1 ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                      {item.variantName || 'Standard Edition'}
                    </p>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div
                  className={`mt-2 border-t p-5 pt-4 flex flex-col gap-3 ${
                    isBoutique
                      ? 'border-border'
                      : isSports
                      ? 'border-emerald-100'
                      : isClothing
                      ? 'border-purple-100'
                      : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs uppercase tracking-wider ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Price</span>
                    <span
                      className={`text-lg font-black ${
                        isBoutique
                          ? 'text-foreground'
                          : isSports
                          ? 'text-emerald-700'
                          : isClothing
                          ? 'text-purple-700'
                          : 'text-sky-700'
                      }`}
                    >
                      Rs. {Number(item.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={addingId === item.productId}
                      className={`h-10 flex-1 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isBoutique
                          ? 'bg-primary text-primary-foreground hover:opacity-90'
                          : isSports
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : isClothing
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      <ShoppingBag size={14} className="mr-1.5" />
                      {addingId === item.productId ? 'Moving...' : isBoutique ? 'Move to Bag' : 'Move to Cart'}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      className={`h-10 rounded-xl border px-3 text-xs font-bold transition-all shadow-xs ${
                        isBoutique
                          ? 'border-border bg-card text-foreground hover:bg-destructive/10 hover:text-destructive'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600'
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