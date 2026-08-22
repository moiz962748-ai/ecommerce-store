'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  User,
  Phone,
  MapPin,
  CreditCard,
} from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  variantId: string;
  variantName: string;
  price: number;
  productId: string;
  productName: string;
}

interface StoreInfo {
  id: string;
  name: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;

  const [items, setItems] = useState<CartItem[]>([]);
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const lowerSub = (subdomain || '').toLowerCase();
  const isBoutique = lowerSub.includes('boutique') || lowerSub.includes('luxury');
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');

  const loadData = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(`/store/${subdomain}/checkout`)}`);
      return;
    }

    try {
      const [cartData, storeData] = await Promise.all([
        apiClient('/cart', { token }),
        apiClient(`/public/stores/${subdomain}`),
      ]);

      const cartArray = Array.isArray(cartData) ? cartData : [];
      setItems(cartArray);
      setStore(storeData);

      if (cartArray.length === 0) {
        router.push(`/store/${subdomain}/cart`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  }, [subdomain, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setError(null);

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError('Please provide your full recipient name, valid phone number, and complete delivery address.');
      return;
    }
    if (!store) {
      setError('Could not resolve store information. Please refresh and try again.');
      return;
    }

    const token = getStoredToken();
    setSubmitting(true);

    try {
      const result = await apiClient('/orders', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify({
          storeId: store.id,
          price: total,
          address: `${fullName.trim()} | ${phone.trim()} | ${address.trim()}`,
        }),
      });

      await Promise.all(
        items.map((item) =>
          apiClient(`/cart/${item.id}`, { method: 'DELETE', token: token || undefined })
        )
      );

      window.dispatchEvent(new Event('cart-updated'));
      setPlacedOrder(result.order ?? result);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <span className="text-sm font-medium">Loading secure checkout...</span>
        </div>
      </main>
    );
  }

  // Order Confirmed Success Screen
  if (placedOrder) {
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
        <header
          className={`border-b backdrop-blur-md ${
            isBoutique
              ? 'border-border bg-background/90'
              : isSports
              ? 'border-emerald-950/80 bg-[#020d09]/90'
              : isClothing
              ? 'border-purple-950/80 bg-[#0b0314]/90'
              : 'border-slate-900 bg-slate-950/90'
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 md:px-8">
            <h1 className={`text-xl font-bold flex items-center gap-2 ${isBoutique ? 'text-foreground' : 'text-white'}`}>
              <CheckCircle2
                className={isBoutique ? 'text-foreground' : isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
                size={22}
              />
              Order Confirmation
            </h1>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isBoutique
                  ? 'border-border bg-accent text-foreground shadow-xs'
                  : isSports
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : isClothing
                  ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                  : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
              }`}
            >
              Order Confirmed
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:px-8">
          <div
            className={`relative overflow-hidden rounded-3xl border p-8 md:p-10 text-center ${
              isBoutique
                ? 'border-border bg-card shadow-md'
                : isSports
                ? 'border-emerald-900/40 bg-slate-900/70 shadow-emerald-950/20 shadow-2xl backdrop-blur-xl'
                : isClothing
                ? 'border-purple-900/40 bg-slate-900/70 shadow-purple-950/20 shadow-2xl backdrop-blur-xl'
                : 'border-slate-800/80 bg-slate-900/70 shadow-cyan-950/20 shadow-2xl backdrop-blur-xl'
            }`}
          >
            {/* Success Icon */}
            <div
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border ${
                isBoutique
                  ? 'border-border bg-accent text-foreground shadow-xs'
                  : isSports
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-xl'
                  : isClothing
                  ? 'border-purple-500/40 bg-purple-500/15 text-purple-400 shadow-xl'
                  : 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-xl'
              }`}
            >
              <CheckCircle2 size={40} />
            </div>

            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isBoutique ? 'text-foreground' : 'text-white'}`}>
              Thank you for your order!
            </h2>
            <p className={`mt-2.5 text-sm max-w-md mx-auto leading-relaxed ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
              {isBoutique
                ? 'Your bespoke atelier reservation is confirmed. Our couturiers will steam-pack and dispatch your luxury pieces promptly.'
                : 'Your order has been recorded successfully. Our team will verify your details and dispatch your package shortly.'}
            </p>

            {/* Receipt Summary Card */}
            <div
              className={`mt-8 space-y-3.5 rounded-2xl border p-6 text-left text-xs sm:text-sm ${
                isBoutique
                  ? 'border-border bg-accent/30 text-foreground'
                  : isSports
                  ? 'border-emerald-950 bg-emerald-950/20 text-slate-300 backdrop-blur-md'
                  : isClothing
                  ? 'border-purple-950 bg-purple-950/20 text-slate-300 backdrop-blur-md'
                  : 'border-slate-800 bg-slate-950/60 text-slate-300 backdrop-blur-md'
              }`}
            >
              <div className={`flex justify-between border-b pb-2.5 ${isBoutique ? 'border-border' : 'border-slate-800/80'}`}>
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-400'}>Order Reference</span>
                <span className={`font-mono font-bold uppercase ${isBoutique ? 'text-foreground' : 'text-white'}`}>{placedOrder.id || 'N/A'}</span>
              </div>
              <div className={`flex justify-between border-b pb-2.5 ${isBoutique ? 'border-border' : 'border-slate-800/80'}`}>
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-400'}>Total Amount</span>
                <span
                  className={`font-black text-base ${
                    isBoutique
                      ? 'text-foreground'
                      : isSports
                      ? 'text-emerald-400'
                      : isClothing
                      ? 'text-purple-300'
                      : 'text-cyan-400'
                  }`}
                >
                  Rs. {Number(placedOrder.price || total).toLocaleString()}
                </span>
              </div>
              <div className={`flex justify-between border-b pb-2.5 ${isBoutique ? 'border-border' : 'border-slate-800/80'}`}>
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-400'}>Status</span>
                <span className={`font-semibold uppercase tracking-wider text-xs ${isBoutique ? 'text-foreground' : 'text-emerald-400'}`}>
                  {placedOrder.orderStatus || 'PENDING'}
                </span>
              </div>
              <div className={`flex justify-between border-b pb-2.5 ${isBoutique ? 'border-border' : 'border-slate-800/80'}`}>
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-400'}>Payment Method</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-white'}`}>Cash on Delivery</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-400'}>Delivery Destination</span>
                <span className={`font-medium text-right max-w-xs truncate ${isBoutique ? 'text-foreground' : 'text-white'}`}>{address}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/store/${subdomain}/orders`}>
                <Button
                  variant="outline"
                  className={`w-full sm:w-auto rounded-xl border text-xs font-bold transition-all ${
                    isBoutique
                      ? 'border-border bg-card text-foreground hover:bg-accent shadow-xs'
                      : isSports
                      ? 'border-emerald-900/60 bg-slate-900/80 text-emerald-300 hover:bg-emerald-950/60'
                      : isClothing
                      ? 'border-purple-900/60 bg-slate-900/80 text-purple-300 hover:bg-purple-950/60'
                      : 'border-slate-800 bg-slate-900/80 text-cyan-300 hover:bg-slate-800'
                  }`}
                >
                  View My Orders
                </Button>
              </Link>

              <Link href={`/store/${subdomain}/products`}>
                <Button
                  className={`w-full sm:w-auto rounded-xl font-bold text-xs transition-all shadow-sm ${
                    isBoutique
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : isSports
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : isClothing
                      ? 'bg-purple-600 text-white hover:bg-purple-500'
                      : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  }`}
                >
                  <span>Continue Shopping</span>
                  <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Active Checkout Form View
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
      {/* Top Bar */}
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
            href={`/store/${subdomain}/cart`}
            className={`flex items-center gap-2 text-sm font-bold transition-colors ${
              isBoutique ? 'text-foreground hover:opacity-80' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ArrowLeft size={16} />
            <span>Return to Bag</span>
          </Link>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
              isBoutique
                ? 'border-border bg-card text-foreground shadow-xs'
                : isSports
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : isClothing
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
            }`}
          >
            <ShieldCheck size={14} />
            <span>256-Bit Encrypted Checkout</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Banner */}
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
            {isBoutique ? 'Final Step to Couture' : isSports ? 'Final Step to Peak' : isClothing ? 'Confirm Your Wardrobe' : 'Final Step'}
          </div>

          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isBoutique ? 'text-foreground' : 'text-white'}`}>
            Complete Your Order
          </h1>
          <p className={`mt-2 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
            Please confirm your delivery address and contact information below for Cash on Delivery dispatch.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Form and Order Summary Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          
          {/* LEFT: Shipping Information Form */}
          <section
            className={`space-y-6 rounded-3xl border p-6 md:p-8 ${
              isBoutique
                ? 'border-border bg-card shadow-xs'
                : isSports
                ? 'border-emerald-900/30 bg-slate-900/60 shadow-xl backdrop-blur-xl'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60 shadow-xl backdrop-blur-xl'
                : 'border-slate-800/80 bg-slate-900/60 shadow-xl backdrop-blur-xl'
            }`}
          >
            <div>
              <h2 className={`text-xl font-bold flex items-center gap-2 ${isBoutique ? 'text-foreground' : 'text-white'}`}>
                <User
                  size={18}
                  className={isBoutique ? 'text-foreground' : isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
                />
                Recipient Details
              </h2>
              <p className={`text-xs mt-1 ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                Our delivery logistics team will contact you on this number before arrival.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className={`text-xs font-bold ${isBoutique ? 'text-foreground' : 'text-slate-300'}`}>
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abdul Moiz"
                  className={`rounded-xl border text-sm transition-all shadow-xs ${
                    isBoutique
                      ? 'border-input bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring'
                      : 'border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className={`text-xs font-bold ${isBoutique ? 'text-foreground' : 'text-slate-300'}`}>
                  Phone Number (Active for SMS/Calls) *
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className={`rounded-xl border text-sm transition-all shadow-xs ${
                    isBoutique
                      ? 'border-input bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring'
                      : 'border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className={`text-xs font-bold ${isBoutique ? 'text-foreground' : 'text-slate-300'}`}>
                  Complete Delivery Address & City *
                </Label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Street name, Sector / Area, City (e.g. Rawalpindi, Islamabad, Lahore...)"
                  rows={4}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all shadow-xs focus:outline-none ${
                    isBoutique
                      ? 'border-input bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring'
                      : 'border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600'
                  }`}
                />
              </div>
            </div>

            {/* Payment Option */}
            <div
              className={`rounded-2xl border p-4.5 ${
                isBoutique
                  ? 'border-border bg-accent/40'
                  : isSports
                  ? 'border-emerald-900/40 bg-emerald-950/20'
                  : isClothing
                  ? 'border-purple-900/40 bg-purple-950/20'
                  : 'border-slate-800 bg-slate-950/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isBoutique
                        ? 'bg-card border border-border text-foreground shadow-xs'
                        : isSports
                        ? 'bg-emerald-600 text-white'
                        : isClothing
                        ? 'bg-purple-600 text-white'
                        : 'bg-cyan-600 text-white'
                    }`}
                  >
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isBoutique ? 'text-foreground' : 'text-white'}`}>Payment Mode</p>
                    <p className={`text-xs ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>Cash on Delivery (COD)</p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    isBoutique
                      ? 'border-border bg-card text-foreground shadow-xs'
                      : isSports
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : isClothing
                      ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                      : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  }`}
                >
                  Pay upon delivery
                </span>
              </div>
            </div>
          </section>

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
              <ShoppingBag
                size={18}
                className={isBoutique ? 'text-foreground' : isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
              />
              Items in Order ({items.length})
            </h2>

            {/* Compact Item List */}
            <div className="mt-5 space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${
                    isBoutique
                      ? 'border-border bg-accent/30'
                      : 'border-slate-800/80 bg-slate-950/60'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-xs sm:text-sm truncate ${isBoutique ? 'text-foreground' : 'text-white'}`}>
                      {item.productName}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                      Qty: {item.quantity} • Rs. {Number(item.price).toLocaleString()} each
                    </p>
                  </div>
                  <p
                    className={`font-bold text-xs sm:text-sm shrink-0 ${
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
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className={`mt-6 space-y-2.5 border-t pt-4 text-xs sm:text-sm ${isBoutique ? 'border-border text-muted-foreground' : 'border-slate-800/80 text-slate-400'}`}>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-white'}`}>
                  Rs. {Number(subtotal).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Nationwide Shipping</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-white'}`}>
                  {shipping > 0 ? `Rs. ${shipping}` : 'Free'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST / Tax</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-white'}`}>Rs. 0</span>
              </div>
            </div>

            {/* Total */}
            <div className={`mt-5 border-t pt-4 flex items-center justify-between ${isBoutique ? 'border-border' : 'border-slate-800/80'}`}>
              <div>
                <span className={`text-sm font-bold block ${isBoutique ? 'text-foreground' : 'text-white'}`}>Grand Total</span>
                <span className={`text-[10px] ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Payable to courier rider</span>
              </div>
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

            {/* Place Order CTA Button */}
            <Button
              size="lg"
              onClick={handlePlaceOrder}
              disabled={submitting}
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
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${isBoutique ? 'border-primary-foreground' : 'border-slate-950'}`} />
                  <span>Placing order...</span>
                </div>
              ) : (
                <span>Confirm Order — Rs. {Number(total).toLocaleString()}</span>
              )}
            </Button>

            <div className={`mt-4 flex items-center justify-center gap-2 text-center text-[11px] ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
              <Truck size={13} />
              <span>Free doorstep exchange within 7 days</span>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}