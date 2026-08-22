'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Package,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface Order {
  id: string;
  userId: string;
  storeId: string;
  price: string;
  orderStatus: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  address: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<
  Order['orderStatus'],
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    icon: CheckCircle2,
  },
  SHIPPED: {
    label: 'Dispatched',
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-300',
    border: 'border-purple-500/30',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lowerSub = (subdomain || '').toLowerCase();
  const isBoutique = lowerSub.includes('boutique') || lowerSub.includes('luxury');
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');

  const fetchOrders = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(`/store/${subdomain}/orders`)}`);
      return;
    }

    try {
      const data = await apiClient('/orders/my-orders', { token });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  }, [subdomain, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
          <span className="text-sm font-medium">Loading order history...</span>
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
      {/* Top Header */}
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

          <Link
            href={`/store/${subdomain}/products`}
            className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
              isBoutique
                ? 'border-border bg-card text-foreground hover:bg-accent shadow-xs'
                : isSports
                ? 'border-emerald-900/50 bg-slate-900/80 text-emerald-300 hover:bg-emerald-950/60'
                : isClothing
                ? 'border-purple-900/50 bg-slate-900/80 text-purple-300 hover:bg-purple-950/60'
                : 'border-slate-800 bg-slate-900/80 text-cyan-300 hover:bg-slate-800'
            }`}
          >
            Explore Collection
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Banner Section */}
        <div
          className={`relative mb-8 overflow-hidden rounded-3xl border p-6 md:p-8 ${
            isBoutique
              ? 'border-border bg-card shadow-xs'
              : isSports
              ? 'border-emerald-900/40 bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-slate-950 shadow-xl backdrop-blur-xl'
              : isClothing
              ? 'border-purple-900/40 bg-gradient-to-br from-purple-950/30 via-slate-900/70 to-slate-950 shadow-xl backdrop-blur-xl'
              : 'border-cyan-900/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/70 to-slate-950 shadow-xl backdrop-blur-xl'
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
            {isBoutique ? 'Order Records' : 'Order Tracking'}
          </div>

          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isBoutique ? 'text-foreground' : 'text-white'}`}>
            My Order History
          </h1>
          <p className={`mt-2 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
            Real-time status updates and fulfillment details for your bespoke and pret orders.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Empty Orders State */}
        {orders.length === 0 ? (
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
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-3xl shadow-lg'
                  : isClothing
                  ? 'border-purple-500/30 bg-purple-500/10 text-purple-400 text-3xl shadow-lg'
                  : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-3xl shadow-lg'
              }`}
            >
              <Package size={28} />
            </div>
            <h2 className={`text-2xl font-bold ${isBoutique ? 'text-foreground' : 'text-white'}`}>No orders placed yet</h2>
            <p className={`mt-2 text-xs sm:text-sm max-w-sm mx-auto ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
              Once you confirm an order with our atelier, your delivery details and tracking will appear here.
            </p>
            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <span
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
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
                <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        ) : (
          /* Orders Table View */
          <div
            className={`overflow-hidden rounded-3xl border ${
              isBoutique
                ? 'border-border bg-card shadow-xs'
                : isSports
                ? 'border-emerald-900/30 bg-slate-900/60 shadow-2xl backdrop-blur-xl'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60 shadow-2xl backdrop-blur-xl'
                : 'border-slate-800/80 bg-slate-900/60 shadow-2xl backdrop-blur-xl'
            }`}
          >
            <Table>
              <TableHeader
                className={`border-b ${
                  isBoutique
                    ? 'border-border bg-accent/40'
                    : isSports
                    ? 'border-emerald-950 bg-emerald-950/20'
                    : isClothing
                    ? 'border-purple-950 bg-purple-950/20'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 pl-6 ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                    Order ID
                  </TableHead>
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                    Date
                  </TableHead>
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                    Delivery Address
                  </TableHead>
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                    Total
                  </TableHead>
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 pr-6 text-right ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                    Fulfillment Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow
                      key={order.id}
                      className={`border-b transition-colors ${
                        isBoutique
                          ? 'border-border hover:bg-accent/20'
                          : 'border-slate-800/60 hover:bg-slate-800/40'
                      }`}
                    >
                      {/* ID */}
                      <TableCell className={`font-mono text-xs font-bold py-4 pl-6 ${isBoutique ? 'text-foreground' : 'text-white'}`}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </TableCell>

                      {/* Date */}
                      <TableCell className={`text-xs py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-300'}`}>
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>

                      {/* Address */}
                      <TableCell className={`text-xs max-w-xs truncate py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                        {order.address}
                      </TableCell>

                      {/* Price */}
                      <TableCell
                        className={`text-xs sm:text-sm font-black py-4 ${
                          isBoutique
                            ? 'text-foreground'
                            : isSports
                            ? 'text-emerald-400'
                            : isClothing
                            ? 'text-purple-300'
                            : 'text-cyan-400'
                        }`}
                      >
                        Rs. {Number(order.price).toLocaleString()}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4 pr-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
}