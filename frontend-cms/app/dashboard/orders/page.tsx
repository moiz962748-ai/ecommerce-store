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
  userId: string;
  storeId: string;
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

export default function OrdersPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = getStoredToken();
        const data = await apiClient('/stores', { token: token || undefined });
        setStores(data);
        if (data.length > 0) {
          setSelectedStoreId(data[0].id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingStores(false);
      }
    };

    fetchStores();
  }, []);

  const fetchOrders = async (storeId: string) => {
    if (!storeId) return;
    setLoadingOrders(true);
    setError(null);
    try {
      const token = getStoredToken();
      const data = await apiClient(`/orders/store/${storeId}`, { token: token || undefined });
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (selectedStoreId) {
      fetchOrders(selectedStoreId);
    }
  }, [selectedStoreId]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const token = getStoredToken();
      await apiClient(`/orders/${orderId}/status`, {
        method: 'PATCH',
        token: token || undefined,
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchOrders(selectedStoreId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">View and manage orders for a store</p>
      </div>

      <div className="mb-6 max-w-xs">
        {loadingStores ? (
          <p className="text-muted-foreground text-sm">Loading stores...</p>
        ) : (
          <Select value={selectedStoreId} onValueChange={(value) => setSelectedStoreId(value || '')}>
            <SelectTrigger>
              <SelectValue>
                {(value: string | null) =>
                  stores.find((s) => s.id === value)?.name || 'Select a store'
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loadingOrders && <p className="text-muted-foreground">Loading orders...</p>}

      {!loadingOrders && selectedStoreId && (
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
                  No orders for this store yet.
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
      )}
    </div>
  );
}