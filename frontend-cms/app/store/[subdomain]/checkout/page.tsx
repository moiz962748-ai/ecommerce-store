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
      setError('Please provide your full name, valid phone number, and complete delivery address.');
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
          <span>Loading secure checkout...</span>
        </div>
      </main>
    );
  }

  // Order Confirmed Success Screen
  if (placedOrder) {
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
        <header
          className={`border-b backdrop-blur-md ${
            isSports
              ? 'border-emerald-950/80 bg-[#020d09]/90'
              : isClothing
              ? 'border-purple-950/80 bg-[#0b0314]/90'
              : 'border-slate-900 bg-slate-950/90'
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 md:px-8">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2
                className={isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
                size={22}
              />
              Order Confirmation
            </h1>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isSports
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : isClothing
                  ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                  : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
              }`}
            >
              Order Placed
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:px-8">
          <div
            className={`relative overflow-hidden rounded-3xl border p-8 md:p-10 backdrop-blur-xl shadow-2xl text-center ${
              isSports
                ? 'border-emerald-900/40 bg-slate-900/70 shadow-emerald-950/20'
                : isClothing
                ? 'border-purple-900/40 bg-slate-900/70 shadow-purple-950/20'
                : 'border-slate-800/80 bg-slate-900/70 shadow-cyan-950/20'
            }`}
          >
            {/* Success Icon */}
            <div
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border shadow-xl ${
                isSports
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                  : isClothing
                  ? 'border-purple-500/40 bg-purple-500/15 text-purple-400'
                  : 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400'
              }`}
            >
              <CheckCircle2 size={40} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Thank you for your order!
            </h2>
            <p className="mt-2.5 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Your order has been recorded successfully. Our team will verify your details and dispatch your package shortly.
            </p>

            {/* Receipt Summary Card */}
            <div
              className={`mt-8 space-y-3.5 rounded-2xl border p-6 text-left text-xs sm:text-sm backdrop-blur-md ${
                isSports
                  ? 'border-emerald-950 bg-emerald-950/20 text-slate-300'
                  : isClothing
                  ? 'border-purple-950 bg-purple-950/20 text-slate-300'
                  : 'border-slate-800 bg-slate-950/60 text-slate-300'
              }`}
            >
              <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-slate-400">Order ID</span>
                <span className="font-mono font-bold text-white uppercase">{placedOrder.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-slate-400">Total Amount</span>
                <span
                  className={`font-black text-base ${
                    isSports ? 'text-emerald-400' : isClothing ? 'text-purple-300' : 'text-cyan-400'
                  }`}
                >
                  Rs. {Number(placedOrder.price || total).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-emerald-400 uppercase tracking-wider text-xs">
                  {placedOrder.orderStatus || 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-slate-400">Payment Mode</span>
                <span className="font-semibold text-white">Cash on Delivery</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-400">Delivery Address</span>
                <span className="font-medium text-white text-right max-w-xs truncate">{address}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/store/${subdomain}/orders`}>
                <Button
                  variant="outline"
                  className={`w-full sm:w-auto rounded-xl border text-xs font-bold transition-all ${
                    isSports
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
                  className={`w-full sm:w-auto rounded-xl font-bold text-xs shadow-lg transition-all ${
                    isSports
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                      : isClothing
                      ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                      : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
                  }`}
                >
                  Continue Shopping
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
        isSports
          ? 'bg-[#020d09] text-emerald-50 selection:bg-emerald-500 selection:text-slate-950'
          : isClothing
          ? 'bg-[#0b0314] text-purple-50 selection:bg-purple-500 selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
      }`}
    >
      {/* Top Bar */}
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
            href={`/store/${subdomain}/cart`}
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Cart</span>
          </Link>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
              isSports
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
            {isSports ? 'Final Step to Peak' : isClothing ? 'Confirm Your Wardrobe' : 'Final Step'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Complete Your Order
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Please enter your delivery details below to dispatch your order with Cash on Delivery.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm font-semibold text-rose-400">
            {error}
          </div>
        )}

        {/* Form and Order Summary Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          
          {/* LEFT: Shipping Information Form */}
          <section
            className={`space-y-6 rounded-3xl border p-6 md:p-8 backdrop-blur-xl shadow-xl ${
              isSports
                ? 'border-emerald-900/30 bg-slate-900/60'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60'
                : 'border-slate-800/80 bg-slate-900/60'
            }`}
          >
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User
                  size={18}
                  className={isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
                />
                Shipping Information
              </h2>
              <p className="text-xs text-slate-400 mt-1">Our courier will contact you on this number before delivery.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-bold text-slate-300">
                  Full Recipient Name *
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abdul Moiz"
                  className={`rounded-xl border bg-slate-950/80 text-sm text-white placeholder:text-slate-600 transition-all ${
                    isSports
                      ? 'border-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : isClothing
                      ? 'border-purple-950 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold text-slate-300">
                  Phone Number (Active for SMS/Call) *
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className={`rounded-xl border bg-slate-950/80 text-sm text-white placeholder:text-slate-600 transition-all ${
                    isSports
                      ? 'border-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : isClothing
                      ? 'border-purple-950 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-bold text-slate-300">
                  Complete Street Address & City *
                </Label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Street name, Sector / Area, City (e.g. Rawalpindi, Islamabad, Lahore...)"
                  rows={4}
                  className={`w-full rounded-xl border bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                    isSports
                      ? 'border-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : isClothing
                      ? 'border-purple-950 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
              </div>
            </div>

            {/* Payment Option */}
            <div
              className={`rounded-2xl border p-4.5 backdrop-blur-md ${
                isSports
                  ? 'border-emerald-900/40 bg-emerald-950/20'
                  : isClothing
                  ? 'border-purple-900/40 bg-purple-950/20'
                  : 'border-slate-800 bg-slate-950/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                      isSports ? 'bg-emerald-600' : isClothing ? 'bg-purple-600' : 'bg-cyan-600'
                    }`}
                  >
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Payment Method</p>
                    <p className="text-xs text-slate-400">Cash on Delivery (COD)</p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    isSports
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : isClothing
                      ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                      : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  }`}
                >
                  Pay upon arrival
                </span>
              </div>
            </div>
          </section>

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
              <ShoppingBag
                size={18}
                className={isSports ? 'text-emerald-400' : isClothing ? 'text-purple-400' : 'text-cyan-400'}
              />
              Items in Order ({items.length})
            </h2>

            {/* Compact Item List */}
            <div className="mt-5 space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white text-xs sm:text-sm truncate">{item.productName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Qty: {item.quantity} • Rs. {Number(item.price).toLocaleString()} each
                    </p>
                  </div>
                  <p
                    className={`font-bold text-xs sm:text-sm shrink-0 ${
                      isSports ? 'text-emerald-400' : isClothing ? 'text-purple-300' : 'text-cyan-400'
                    }`}
                  >
                    Rs. {Number(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="mt-6 space-y-2.5 border-t border-slate-800/80 pt-4 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">
                  Rs. {Number(subtotal).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Standard Delivery</span>
                <span className="text-white font-semibold">
                  {shipping > 0 ? `Rs. ${shipping}` : 'Free'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST / Tax</span>
                <span className="text-white font-semibold">Rs. 0</span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-5 border-t border-slate-800/80 pt-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">Grand Total</span>
                <span className="text-[10px] text-slate-500">Payable to courier rider</span>
              </div>
              <span
                className={`text-2xl font-black ${
                  isSports ? 'text-emerald-400' : isClothing ? 'text-purple-300' : 'text-cyan-400'
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
              className={`mt-6 w-full h-12 rounded-xl font-bold text-sm transition-all shadow-lg ${
                isSports
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                  : isClothing
                  ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
              }`}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Placing order...</span>
                </div>
              ) : (
                <span>Confirm Order — Rs. {Number(total).toLocaleString()}</span>
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
              <Truck size={13} />
              <span>Free doorstep exchange within 7 days</span>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}