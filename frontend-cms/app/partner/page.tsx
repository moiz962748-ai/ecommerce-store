'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { getStoreTag, tagDotClass, tagBorderClass } from '@/lib/store-tags';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Store {
  id: string;
  name: string;
  subDomain: string;
  isActive: boolean;
}

export default function PartnerHomePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyStores = async () => {
      try {
        const token = getStoredToken();
        const data = await apiClient('/stores/my-stores', { token: token || undefined });
        setStores(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStores();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold mb-1">My Stores</h1>
      <p className="text-muted-foreground mb-6">Stores you are assigned to manage</p>

      {loading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.length === 0 && (
            <p className="text-muted-foreground">
              You are not assigned to any store yet. Contact an admin.
            </p>
          )}

          {stores.map((store) => {
            const tag = getStoreTag(store.subDomain);
            return (
              <Card key={store.id} className={`border-l-4 ${tagBorderClass[tag]}`}>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${tagDotClass[tag]}`} />
                    {store.name}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">{store.subDomain}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      store.isActive
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {store.isActive ? 'Active' : 'Inactive'}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}