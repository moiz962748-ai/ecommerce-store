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
          isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
        }`}
      >
        <header
          className={`border-b backdrop-blur-md ${
            isBoutique
              ? 'border-border bg-background/90'
              : 'border-slate-200/80 bg-white/95'
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 md:px-8">
            <h1 className={`text-xl font-bold flex items-center gap-2 ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
              <CheckCircle2
                className={isBoutique ? 'text-foreground' : isSports ? 'text-emerald-600' : isClothing ? 'text-purple-600' : 'text-sky-600'}
                size={22}
              />
              Order Confirmation
            </h1>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-xs ${
                isBoutique
                  ? 'border-border bg-accent text-foreground'
                  : isSports
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : isClothing
                  ? 'border-purple-200 bg-purple-50 text-purple-800'
                  : 'border-sky-200 bg-sky-50 text-sky-800'
              }`}
            >
              Order Confirmed
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:px-8">
          <div
            className={`relative overflow-hidden rounded-3xl border p-8 md:p-10 text-center shadow-xs ${
              isBoutique
                ? 'border-border bg-card'
                : 'border-slate-200 bg-white'
            }`}
          >
            {/* Success Icon */}
            <div
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border shadow-xs ${
                isBoutique
                  ? 'border-border bg-accent text-foreground'
                  : isSports
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                  : isClothing
                  ? 'border-purple-200 bg-purple-50 text-purple-600'
                  : 'border-sky-200 bg-sky-50 text-sky-600'
              }`}
            >
              <CheckCircle2 size={40} />
            </div>

            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
              Thank you for your order!
            </h2>
            <p className={`mt-2.5 text-sm max-w-md mx-auto leading-relaxed ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
              {isBoutique
                ? 'Your bespoke atelier reservation is confirmed. Our couturiers will steam-pack and dispatch your luxury pieces promptly.'
                : 'Your order has been recorded successfully. Our team will verify your details and dispatch your package shortly.'}
            </p>

            {/* Receipt Summary Card */}
            <div
              className={`mt-8 space-y-3.5 rounded-2xl border p-6 text-left text-xs sm:text-sm ${
                isBoutique
                  ? 'border-border bg-accent/30 text-foreground'
                  : 'border-slate-100 bg-slate-50 text-slate-800'
              }`}
            >
              <div className={`flex justify-between border-b pb-2.5 ${isBoutique ? 'border-border' : 'border-slate-200/80'}`}>
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-500'}>Order Reference</span>
                <span className={`font-mono font-bold uppercase ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>{placedOrder.id || 'N/A'}</span>
              </div>
              <div className={`flex justify-between border-b pb-2.5 ${isBoutique ? 'border-border' : 'border-slate-200/80'}`}>
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-500'}>Total Amount</span>
                <span
                  className={`font-black text-base ${
                    isBoutique
                      ? 'text-foreground'
                      : isSports
                      ? 'text-emerald-700'
                      : isClothing
                      ? 'text-purple-700'
                      : 'text-sky-700'
                  }`}
                >
                  Rs. {Number(placedOrder.price || total).toLocaleString()}
                </span>
              </div>
              <div className={`flex justify-between border-b pb-2.5 ${isBoutique ? 'border-border' : 'border-slate-200/80'}`}>
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-500'}>Status</span>
                <span className={`font-semibold uppercase tracking-wider text-xs ${isBoutique ? 'text-foreground' : 'text-emerald-700'}`}>
                  {placedOrder.orderStatus || 'PENDING'}
                </span>
              </div>
              <div className={`flex justify-between border-b pb-2.5 ${isBoutique ? 'border-border' : 'border-slate-200/80'}`}>
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-500'}>Payment Method</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>Cash on Delivery</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className={isBoutique ? 'text-muted-foreground' : 'text-slate-500'}>Delivery Destination</span>
                <span className={`font-medium text-right max-w-xs truncate ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>{address}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/store/${subdomain}/orders`}>
                <Button
                  variant="outline"
                  className={`w-full sm:w-auto rounded-xl border text-xs font-bold transition-all shadow-xs ${
                    isBoutique
                      ? 'border-border bg-card text-foreground hover:bg-accent'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
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
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : isClothing
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-sky-600 text-white hover:bg-sky-700'
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
        isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Top Bar */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md ${
          isBoutique
            ? 'border-border bg-background/90'
            : 'border-slate-200/80 bg-white/95'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8">
          <Link
            href={`/store/${subdomain}/cart`}
            className={`flex items-center gap-2 text-sm font-bold transition-colors ${
              isBoutique ? 'text-foreground hover:opacity-80' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <ArrowLeft size={16} />
            <span>{isBoutique ? 'Return to Bag' : 'Return to Cart'}</span>
          </Link>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider shadow-xs ${
              isBoutique
                ? 'border-border bg-card text-foreground'
                : isSports
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : isClothing
                ? 'border-purple-200 bg-purple-50 text-purple-800'
                : 'border-sky-200 bg-sky-50 text-sky-800'
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
            {isBoutique ? 'Final Step to Couture' : isSports ? 'Final Step to Peak' : isClothing ? 'Confirm Your Wardrobe' : 'Final Step'}
          </div>

          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
            Complete Your Order
          </h1>
          <p className={`mt-2 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
            Please confirm your delivery address and contact information below for Cash on Delivery dispatch.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm font-semibold text-rose-800 shadow-xs">
            {error}
          </div>
        )}

        {/* Form and Order Summary Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          
          {/* LEFT: Shipping Information Form */}
          <section
            className={`space-y-6 rounded-3xl border p-6 md:p-8 shadow-xs ${
              isBoutique
                ? 'border-border bg-card'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div>
              <h2 className={`text-xl font-bold flex items-center gap-2 ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
                <User
                  size={18}
                  className={isBoutique ? 'text-foreground' : isSports ? 'text-emerald-600' : isClothing ? 'text-purple-600' : 'text-sky-600'}
                />
                Recipient Details
              </h2>
              <p className={`text-xs mt-1 ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                Our delivery logistics team will contact you on this number before arrival.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className={`text-xs font-bold ${isBoutique ? 'text-foreground' : 'text-slate-700'}`}>
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
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className={`text-xs font-bold ${isBoutique ? 'text-foreground' : 'text-slate-700'}`}>
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
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className={`text-xs font-bold ${isBoutique ? 'text-foreground' : 'text-slate-700'}`}>
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
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-500'
                  }`}
                />
              </div>
            </div>

            {/* Payment Option */}
            <div
              className={`rounded-2xl border p-4.5 ${
                isBoutique
                  ? 'border-border bg-accent/40'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                      isBoutique
                        ? 'bg-card border border-border text-foreground'
                        : isSports
                        ? 'bg-emerald-600 text-white'
                        : isClothing
                        ? 'bg-purple-600 text-white'
                        : 'bg-sky-600 text-white'
                    }`}
                  >
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>Payment Mode</p>
                    <p className={`text-xs ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Cash on Delivery (COD)</p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-xs ${
                    isBoutique
                      ? 'border-border bg-card text-foreground'
                      : isSports
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : isClothing
                      ? 'border-purple-200 bg-purple-50 text-purple-800'
                      : 'border-sky-200 bg-sky-50 text-sky-800'
                  }`}
                >
                  Pay upon delivery
                </span>
              </div>
            </div>
          </section>

          {/* RIGHT: Order Summary */}
          <aside
            className={`rounded-3xl border p-6 shadow-xs ${
              isBoutique
                ? 'border-border bg-card'
                : 'border-slate-200 bg-white'
            }`}
          >
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
              <ShoppingBag
                size={18}
                className={isBoutique ? 'text-foreground' : isSports ? 'text-emerald-600' : isClothing ? 'text-purple-600' : 'text-sky-600'}
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
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-xs sm:text-sm truncate ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
                      {item.productName}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                      Qty: {item.quantity} • Rs. {Number(item.price).toLocaleString()} each
                    </p>
                  </div>
                  <p
                    className={`font-bold text-xs sm:text-sm shrink-0 ${
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
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className={`mt-6 space-y-2.5 border-t pt-4 text-xs sm:text-sm ${isBoutique ? 'border-border text-muted-foreground' : 'border-slate-100 text-slate-600'}`}>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                  Rs. {Number(subtotal).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Nationwide Shipping</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                  {shipping > 0 ? `Rs. ${shipping}` : 'Free'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST / Tax</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>Rs. 0</span>
              </div>
            </div>

            {/* Total */}
            <div className={`mt-5 border-t pt-4 flex items-center justify-between ${isBoutique ? 'border-border' : 'border-slate-100'}`}>
              <div>
                <span className={`text-sm font-bold block ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>Grand Total</span>
                <span className={`text-[10px] ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Payable to courier rider</span>
              </div>
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

            {/* Place Order CTA Button */}
            <Button
              size="lg"
              onClick={handlePlaceOrder}
              disabled={submitting}
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
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${isBoutique ? 'border-primary-foreground' : 'border-white'}`} />
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