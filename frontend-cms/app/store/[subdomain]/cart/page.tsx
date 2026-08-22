'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';

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
  if (lower.includes('shawl') || lower.includes('velvet') || lower.includes('dupatta')) return '🧣';
  if (lower.includes('pret') || lower.includes('suit') || lower.includes('dress') || lower.includes('kurti')) return '👗';
  if (lower.includes('abaya') || lower.includes('pishwas')) return '✨';
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

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const lowerSub = (subdomain || '').toLowerCase();
  const isBoutique = lowerSub.includes('boutique') || lowerSub.includes('luxury');
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');

  const fetchCart = useCallback(async () => {
    const token = getStoredToken();
    const cartUrl = `/store/${subdomain}/cart`;

    if (!token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirect_after_login', cartUrl);
        window.location.assign(`/login?redirect=${encodeURIComponent(cartUrl)}`);
      }
      return;
    }

    try {
      const data = await apiClient('/cart', { token });
      setItems(Array.isArray(data) ? data : []);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err: any) {
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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

  const handleProceedToCheckout = () => {
    const token = getStoredToken();
    const checkoutUrl = `/store/${subdomain}/checkout`;

    if (!token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirect_after_login', checkoutUrl);
        window.location.assign(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      }
      return;
    }
    router.push(checkoutUrl);
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${
          isBoutique
            ? 'bg-background text-foreground'
            : isSports
            ? 'bg-[#020d09] text-emerald-50'
            : isClothing
            ? 'bg-[#0b0314] text-purple-50'
            : 'bg-slate-950 text-slate-100'
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-6 py-4 ${
            isBoutique
              ? 'border-border bg-card text-foreground shadow-xs'
              : isSports
              ? 'border-emerald-900/50 bg-slate-900/80 text-emerald-300'
              : isClothing
              ? 'border-purple-900/50 bg-slate-900/80 text-purple-300'
              : 'border-slate-800 bg-slate-900/80 text-slate-300'
          }`}
        >
          <div
            className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
              isBoutique
                ? 'border-foreground'
                : isSports
                ? 'border-emerald-400'
                : isClothing
                ? 'border-purple-400'
                : 'border-cyan-400'
            }`}
          />
          <span className="text-sm font-medium">Loading bag...</span>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isBoutique
          ? 'bg-background text-foreground'
          : isSports
          ? 'bg-[#020d09] text-emerald-50 selection:bg-emerald-500 selection:text-slate-950'
          : isClothing
          ? 'bg-[#0b0314] text-purple-50 selection:bg-purple-500 selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
      }`}
    >
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md ${
          isBoutique
            ? 'border-border bg-background/90'
            : isSports
            ? 'border-emerald-950/80 bg-[#020d09]/90'
            : isClothing
            ? 'border-purple-950/80 bg-[#0b0314]/90'
            : 'border-slate-900 bg-slate-950/90'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8">
          <Link
            href={`/store/${subdomain}`}
            className={`flex items-center gap-2 text-sm font-bold transition-colors ${
              isBoutique ? 'text-foreground hover:opacity-80' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ArrowLeft size={16} />
            <span>Back to Atelier</span>
          </Link>

          <Link href={`/store/${subdomain}/products`}>
            <Button
              variant="outline"
              className={`rounded-xl border text-xs font-bold transition-all ${
                isBoutique
                  ? 'border-border bg-card text-foreground hover:bg-accent shadow-xs'
                  : isSports
                  ? 'border-emerald-900/50 bg-slate-900/80 text-emerald-300 hover:bg-emerald-950/60'
                  : isClothing
                  ? 'border-purple-900/50 bg-slate-900/80 text-purple-300 hover:bg-purple-950/60'
                  : 'border-slate-800 bg-slate-900/80 text-cyan-300 hover:bg-slate-800'
              }`}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Banner Section */}
        <div
          className={`relative mb-8 overflow-hidden rounded-3xl border p-6 md:p-8 ${
            isBoutique
              ? 'border-border bg-card shadow-xs'
              : isSports
              ? 'border-emerald-900/40 bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-slate-950 shadow-xl'
              : isClothing
              ? 'border-purple-900/40 bg-gradient-to-br from-purple-950/30 via-slate-900/70 to-slate-950 shadow-xl'
              : 'border-cyan-900/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/70 to-slate-950 shadow-xl'
          }`}
        >
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider mb-3 ${
              isBoutique
                ? 'border-border bg-accent text-foreground'
                : isSports
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : isClothing
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
            }`}
          >
            <Sparkles size={12} />
            {isBoutique ? 'Couture Bag' : isSports ? 'Ready for Training' : isClothing ? 'Style Bag' : 'Review & Checkout'}
          </div>

          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isBoutique ? 'text-foreground' : 'text-white'}`}>
            {isBoutique ? 'Your Luxury Bag' : isSports ? 'Training Gear Cart' : isClothing ? 'Your Shopping Bag' : 'Your Tech Cart'}
          </h1>
          <p className={`mt-2 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
            {items.length} {items.length === 1 ? 'creation' : 'creations'} ready for express packaging
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <div
            className={`rounded-3xl border border-dashed p-12 text-center ${
              isBoutique
                ? 'border-border bg-card'
                : isSports
                ? 'border-emerald-950 bg-slate-900/40'
                : isClothing
                ? 'border-purple-950 bg-slate-900/40'
                : 'border-slate-900 bg-slate-900/40'
            }`}
          >
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border ${
                isBoutique
                  ? 'border-border bg-accent text-foreground text-3xl shadow-xs'
                  : isSports
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-3xl'
                  : isClothing
                  ? 'border-purple-500/30 bg-purple-500/10 text-purple-400 text-3xl'
                  : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-3xl'
              }`}
            >
              <ShoppingBag size={28} />
            </div>
            <h2 className={`text-2xl font-bold ${isBoutique ? 'text-foreground' : 'text-white'}`}>Your bag is currently empty</h2>
            <p className={`mt-2 text-xs sm:text-sm max-w-sm mx-auto ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
              {isBoutique ? 'Discover artisanal pret, bridal sets, and luxury festive silhouettes.' : 'Explore our verified collections and add your favorite products.'}
            </p>
            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <Button
                className={`rounded-xl font-bold text-xs sm:text-sm px-6 py-2.5 shadow-sm ${
                  isBoutique
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : isSports
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-500'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                }`}
              >
                <span>Browse Collection</span>
                <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart Items & Order Summary Grid */
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] items-start">
            
            {/* LEFT: Item List */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border p-4 sm:p-5 transition-all ${
                    isBoutique
                      ? 'border-border bg-card shadow-xs hover:border-foreground/20'
                      : isSports
                      ? 'border-emerald-900/30 bg-slate-900/60 shadow-lg'
                      : isClothing
                      ? 'border-purple-900/30 bg-slate-900/60 shadow-lg'
                      : 'border-slate-800/80 bg-slate-900/60 shadow-lg'
                  }`}
                >
                  {/* Thumbnail / Emoji */}
                  <div
                    className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-2 ${
                      isBoutique
                        ? 'border-border bg-accent'
                        : isSports
                        ? 'border-emerald-950 bg-emerald-950/20'
                        : isClothing
                        ? 'border-purple-950 bg-purple-950/20'
                        : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-4xl">{getProductVisual(item.productName)}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <Link href={`/store/${subdomain}/products/${item.productId}`}>
                        <h2
                          className={`text-base font-bold truncate transition-colors hover:underline ${
                            isBoutique
                              ? 'text-foreground hover:opacity-80'
                              : isSports
                              ? 'text-white hover:text-emerald-400'
                              : isClothing
                              ? 'text-white hover:text-purple-300'
                              : 'text-white hover:text-cyan-300'
                          }`}
                        >
                          {item.productName}
                        </h2>
                      </Link>
                      <p
                        className={`text-base sm:text-lg font-black shrink-0 ${
                          isBoutique
                            ? 'text-foreground'
                            : isSports
                            ? 'text-emerald-400'
                            : isClothing
                            ? 'text-purple-300'
                            : 'text-cyan-400'
                        }`}
                      >
                        Rs. {Number(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <p className={`text-xs mt-0.5 ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                      {item.variantName || 'Stitched / Standard'} • Rs. {Number(item.price).toLocaleString()} each
                    </p>

                    {/* Quantity & Actions Bar */}
                    <div className={`mt-4 flex items-center justify-between pt-3 border-t ${isBoutique ? 'border-border' : 'border-slate-800/80'}`}>
                      <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${isBoutique ? 'border-border bg-accent text-foreground' : 'border-slate-800 bg-slate-950/80 text-slate-300'}`}>
                        Qty: {item.quantity}
                      </span>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/store/${subdomain}/products/${item.productId}`}
                          className={`text-xs transition-colors ${isBoutique ? 'text-muted-foreground hover:text-foreground' : 'text-slate-400 hover:text-white'}`}
                        >
                          View Item
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                          className={`inline-flex items-center gap-1 text-xs transition-colors ${
                            isBoutique ? 'text-destructive hover:opacity-80' : 'text-rose-400 hover:text-rose-300'
                          }`}
                        >
                          <Trash2 size={13} />
                          {removingId === item.id ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Order Summary */}
            <aside
              className={`rounded-3xl border p-6 ${
                isBoutique
                  ? 'border-border bg-card shadow-xs'
                  : isSports
                  ? 'border-emerald-900/30 bg-slate-900/60 shadow-2xl backdrop-blur-xl'
                  : isClothing
                  ? 'border-purple-900/30 bg-slate-900/60 shadow-2xl backdrop-blur-xl'
                  : 'border-slate-800/80 bg-slate-900/60 shadow-2xl backdrop-blur-xl'
              }`}
            >
              <h2 className={`text-xl font-bold flex items-center gap-2 ${isBoutique ? 'text-foreground' : 'text-white'}`}>
                <ShieldCheck
                  size={18}
                  className={isBoutique ? 'text-foreground' : isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
                />
                Order Summary
              </h2>

              <div className={`mt-6 space-y-3 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-white'}`}>
                    Rs. {Number(subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tracked Nationwide Shipping</span>
                  <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-white'}`}>
                    {shipping > 0 ? `Rs. ${shipping}` : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sales Tax & GST</span>
                  <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-white'}`}>Rs. 0</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className={`mt-6 border-t pt-4 ${isBoutique ? 'border-border' : 'border-slate-800/80'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isBoutique ? 'text-foreground' : 'text-white'}`}>Estimated Total</span>
                  <span
                    className={`text-2xl font-black ${
                      isBoutique
                        ? 'text-foreground'
                        : isSports
                        ? 'text-emerald-400'
                        : isClothing
                        ? 'text-purple-300'
                        : 'text-cyan-400'
                    }`}
                  >
                    Rs. {Number(total).toLocaleString()}
                  </span>
                </div>
                <p className={`mt-1 text-[11px] ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Includes all applicable doorstep taxes</p>
              </div>

              {/* Checkout Action Button */}
              <Button
                size="lg"
                onClick={handleProceedToCheckout}
                className={`mt-6 w-full h-12 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  isBoutique
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : isSports
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-500'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} className="ml-1.5" />
              </Button>

              {/* Secure Info Note */}
              <div className={`mt-6 flex items-center justify-center gap-2 text-center text-[11px] ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                <Truck size={14} />
                <span>Express courier tracking dispatched on order booking</span>
              </div>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}