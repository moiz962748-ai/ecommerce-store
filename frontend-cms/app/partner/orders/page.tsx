'use client';

import { useEffect, useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Store {
  id: string;
  name: string;
}

interface Order {
  id: string;
  price: string;
  orderStatus: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  address: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function PartnerOrdersPage() {
  const [myStore, setMyStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async (storeId: string) => {
    const token = getStoredToken();
    const data = await apiClient(`/orders/store/${storeId}`, { token: token || undefined });
    setOrders(data);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = getStoredToken();
      const myStores = await apiClient('/stores/my-stores', { token: token || undefined });
      const store = myStores[0] || null;
      setMyStore(store);

      if (store) {
        await fetchOrders(store.id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!myStore) return;
    setUpdatingId(orderId);
    try {
      const token = getStoredToken();
      await apiClient(`/orders/${orderId}/status`, {
        method: 'PATCH',
        token: token || undefined,
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchOrders(myStore.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!myStore) {
    return <p className="text-muted-foreground">You are not assigned to any store yet.</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders — {myStore.name}</h1>
        <p className="text-muted-foreground">View and manage orders for your store</p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Update Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No orders yet.
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="max-w-xs truncate">{order.address}</TableCell>
              <TableCell>Rs. {order.price}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                  {order.orderStatus}
                </span>
              </TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Select
                  value={order.orderStatus}
                  onValueChange={(value) => value && handleStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-40" disabled={updatingId === order.id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}