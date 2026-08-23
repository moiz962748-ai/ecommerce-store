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
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: CheckCircle2,
  },
  SHIPPED: {
    label: 'Dispatched',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
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
        className={`flex min-h-screen items-center justify-center p-8 ${
          isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-xs ${
            isBoutique
              ? 'border-border bg-card text-foreground'
              : 'border-slate-200 bg-white text-sky-800'
          }`}
        >
          <div
            className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
              isBoutique ? 'border-foreground' : 'border-sky-600'
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
              isBoutique ? 'text-foreground hover:opacity-80' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <ArrowLeft size={16} />
            <span>{isBoutique ? 'Back to Atelier' : 'Back to Store'}</span>
          </Link>

          <Link
            href={`/store/${subdomain}/products`}
            className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all shadow-xs ${
              isBoutique
                ? 'border-border bg-card text-foreground hover:bg-accent'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            Explore Products
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Banner Section */}
        <div
          className={`relative mb-8 overflow-hidden rounded-3xl border p-6 md:p-8 shadow-xs ${
            isBoutique
              ? 'border-border bg-card'
              : 'border-slate-200 bg-gradient-to-br from-sky-50 via-white to-slate-50'
          }`}
        >
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider mb-3 shadow-xs ${
              isBoutique
                ? 'border-border bg-accent text-foreground'
                : 'border-sky-200 bg-sky-100/70 text-sky-800'
            }`}
          >
            <Sparkles size={12} />
            <span>Order Records</span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
            My Order History
          </h1>
          <p className={`mt-2 text-xs sm:text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
            Real-time status updates and fulfillment details for your orders.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm font-semibold text-rose-800 shadow-xs">
            {error}
          </div>
        )}

        {/* Empty Orders State */}
        {orders.length === 0 ? (
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
                  : 'border-sky-200 bg-sky-50 text-sky-700 text-3xl'
              }`}
            >
              <Package size={28} />
            </div>
            <h2 className={`text-2xl font-bold ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>No orders placed yet</h2>
            <p className={`mt-2 text-xs sm:text-sm max-w-sm mx-auto ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
              Once you confirm an order, your delivery details and tracking status will appear here.
            </p>
            <Link href={`/store/${subdomain}/products`} className="mt-6 inline-block">
              <span
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                  isBoutique
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
              >
                <span>Browse Products</span>
                <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        ) : (
          /* Orders Table View */
          <div
            className={`overflow-hidden rounded-3xl border shadow-xs ${
              isBoutique
                ? 'border-border bg-card'
                : 'border-slate-200 bg-white'
            }`}
          >
            <Table>
              <TableHeader
                className={`border-b ${
                  isBoutique
                    ? 'border-border bg-accent/40'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 pl-6 ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
                    Order ID
                  </TableHead>
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
                    Date
                  </TableHead>
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
                    Delivery Address
                  </TableHead>
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
                    Total
                  </TableHead>
                  <TableHead className={`text-xs font-bold uppercase tracking-wider py-4 pr-6 text-right ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
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
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      {/* ID */}
                      <TableCell className={`font-mono text-xs font-bold py-4 pl-6 ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </TableCell>

                      {/* Date */}
                      <TableCell className={`text-xs py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>

                      {/* Address */}
                      <TableCell className={`text-xs max-w-xs truncate py-4 ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
                        {order.address}
                      </TableCell>

                      {/* Price */}
                      <TableCell
                        className={`text-xs sm:text-sm font-black py-4 ${
                          isBoutique ? 'text-foreground' : 'text-slate-950'
                        }`}
                      >
                        Rs. {Number(order.price).toLocaleString()}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4 pr-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider shadow-xs ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
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