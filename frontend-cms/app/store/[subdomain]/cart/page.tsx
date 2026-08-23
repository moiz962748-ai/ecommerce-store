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
          <span className="text-sm font-medium">Loading cart...</span>
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
      {/* Top Header Bar */}
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
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
            {isBoutique ? 'Couture Bag' : isSports ? 'Ready for Training' : isClothing ? 'Style Bag' : 'Review & Checkout'}
          </div>

          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
            {isBoutique ? 'Your Luxury Bag' : isSports ? 'Training Gear Cart' : isClothing ? 'Your Shopping Bag' : 'Your Tech Cart'}
          </h1>
          <p className={`mt-2 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
            {items.length} {items.length === 1 ? 'item' : 'items'} ready for express delivery
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-xs">
            {error}
          </div>
        )}

        {/* Empty Cart State */}
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
              <ShoppingBag size={28} />
            </div>
            <h2 className={`text-2xl font-bold ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>Your cart is currently empty</h2>
            <p className={`mt-2 text-xs sm:text-sm max-w-sm mx-auto ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
              {isBoutique ? 'Discover artisanal pret, bridal sets, and luxury festive silhouettes.' : 'Explore our verified collections and add your favorite products.'}
            </p>
            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <Button
                className={`rounded-xl font-bold text-xs sm:text-sm px-6 py-2.5 shadow-sm ${
                  isBoutique
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : isSports
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
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
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
                    isBoutique
                      ? 'border-border bg-card hover:border-foreground/20'
                      : isSports
                      ? 'border-emerald-100 bg-white hover:border-emerald-300'
                      : isClothing
                      ? 'border-purple-100 bg-white hover:border-purple-300'
                      : 'border-slate-200 bg-white hover:border-sky-300'
                  }`}
                >
                  {/* Thumbnail / Emoji */}
                  <div
                    className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-2 ${
                      isBoutique
                        ? 'border-border bg-accent'
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
                              ? 'text-slate-950 hover:text-emerald-700'
                              : isClothing
                              ? 'text-slate-950 hover:text-purple-700'
                              : 'text-slate-950 hover:text-sky-700'
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
                            ? 'text-emerald-700'
                            : isClothing
                            ? 'text-purple-700'
                            : 'text-sky-700'
                        }`}
                      >
                        Rs. {Number(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <p className={`text-xs mt-0.5 ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                      {item.variantName || 'Standard Edition'} • Rs. {Number(item.price).toLocaleString()} each
                    </p>

                    {/* Quantity & Actions Bar */}
                    <div className={`mt-4 flex items-center justify-between pt-3 border-t ${isBoutique ? 'border-border' : 'border-slate-100'}`}>
                      <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${isBoutique ? 'border-border bg-accent text-foreground' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
                        Qty: {item.quantity}
                      </span>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/store/${subdomain}/products/${item.productId}`}
                          className={`text-xs transition-colors ${isBoutique ? 'text-muted-foreground hover:text-foreground' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                          View Item
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                          className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors ${
                            isBoutique ? 'text-destructive hover:opacity-80' : 'text-rose-600 hover:text-rose-700'
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
              className={`rounded-3xl border p-6 shadow-xs ${
                isBoutique
                  ? 'border-border bg-card'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <h2 className={`text-xl font-bold flex items-center gap-2 ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
                <ShieldCheck
                  size={18}
                  className={isBoutique ? 'text-foreground' : isSports ? 'text-emerald-600' : isClothing ? 'text-purple-600' : 'text-sky-600'}
                />
                Order Summary
              </h2>

              <div className={`mt-6 space-y-3 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                    Rs. {Number(subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tracked Nationwide Shipping</span>
                  <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                    {shipping > 0 ? `Rs. ${shipping}` : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sales Tax & GST</span>
                  <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>Rs. 0</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className={`mt-6 border-t pt-4 ${isBoutique ? 'border-border' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>Estimated Total</span>
                  <span
                    className={`text-2xl font-black ${
                      isBoutique
                        ? 'text-foreground'
                        : isSports
                        ? 'text-emerald-700'
                        : isClothing
                        ? 'text-purple-700'
                        : 'text-sky-700'
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
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
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