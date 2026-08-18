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

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const lowerSub = (subdomain || '').toLowerCase();
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
          <span>Loading cart...</span>
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
      {/* Top Header Bar */}
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
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
            {isSports ? 'Ready for Training' : isClothing ? 'Style Bag' : 'Review & Checkout'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isSports ? 'Training Gear Cart' : isClothing ? 'Your Shopping Bag' : 'Your Tech Cart'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} ready for express dispatch
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Empty Cart State */}
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
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white">Your cart is currently empty</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Explore our verified collections and add your favorite products.
            </p>
            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <Button
                className={`rounded-xl font-bold text-xs sm:text-sm px-6 py-2.5 shadow-lg ${
                  isSports
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
                }`}
              >
                Browse Catalog
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
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border p-4 sm:p-5 backdrop-blur-md transition-all shadow-lg ${
                    isSports
                      ? 'border-emerald-900/30 bg-slate-900/60'
                      : isClothing
                      ? 'border-purple-900/30 bg-slate-900/60'
                      : 'border-slate-800/80 bg-slate-900/60'
                  }`}
                >
                  {/* Thumbnail / Emoji */}
                  <div
                    className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-2 ${
                      isSports
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
                          className={`text-base font-bold text-white transition-colors truncate hover:underline ${
                            isSports
                              ? 'hover:text-emerald-400'
                              : isClothing
                              ? 'hover:text-purple-300'
                              : 'hover:text-cyan-300'
                          }`}
                        >
                          {item.productName}
                        </h2>
                      </Link>
                      <p
                        className={`text-base sm:text-lg font-black shrink-0 ${
                          isSports
                            ? 'text-emerald-400'
                            : isClothing
                            ? 'text-purple-300'
                            : 'text-cyan-400'
                        }`}
                      >
                        Rs. {Number(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.variantName || 'Standard Edition'} • Rs. {Number(item.price).toLocaleString()} each
                    </p>

                    {/* Quantity & Actions Bar */}
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
                      <span className="rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-slate-300">
                        Qty: {item.quantity}
                      </span>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/store/${subdomain}/products/${item.productId}`}
                          className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                          View Item
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                          className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
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
              className={`rounded-3xl border p-6 backdrop-blur-xl shadow-2xl ${
                isSports
                  ? 'border-emerald-900/30 bg-slate-900/60 shadow-emerald-950/10'
                  : isClothing
                  ? 'border-purple-900/30 bg-slate-900/60 shadow-purple-950/10'
                  : 'border-slate-800/80 bg-slate-900/60 shadow-cyan-950/10'
              }`}
            >
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck
                  size={18}
                  className={isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
                />
                Order Summary
              </h2>

              <div className="mt-6 space-y-3 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">
                    Rs. {Number(subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-white font-semibold">
                    {shipping > 0 ? `Rs. ${shipping}` : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sales Tax & GST</span>
                  <span className="text-white font-semibold">Rs. 0</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="mt-6 border-t border-slate-800/80 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Estimated Total</span>
                  <span
                    className={`text-2xl font-black ${
                      isSports
                        ? 'text-emerald-400'
                        : isClothing
                        ? 'text-purple-300'
                        : 'text-cyan-400'
                    }`}
                  >
                    Rs. {Number(total).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">Includes all applicable platform fees</p>
              </div>

              {/* Checkout Action Button */}
              <Button
                size="lg"
                onClick={handleProceedToCheckout}
                className={`mt-6 w-full h-12 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  isSports
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
                }`}
              >
                Proceed to Checkout
                <ArrowRight size={16} className="ml-1.5" />
              </Button>

              {/* Secure Info Note */}
              <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
                <Truck size={14} />
                <span>Express courier tracking dispatched on payment</span>
              </div>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}