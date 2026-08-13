'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { getStoreTag, tagBorderClass, tagDotClass } from '@/lib/store-tags';

interface Store {
  id: string;
  name: string;
  subDomain: string;
  isActive: boolean;
}

export default function DashboardHomePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = getStoredToken();
        const data = await apiClient('/stores', { token: token || undefined });
        setStores(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Overview of your stores</p>

      {loading && <p className="text-muted-foreground">Loading stores...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.length === 0 && (
            <p className="text-muted-foreground">No stores found yet.</p>
          )}

          {stores.map((store) => {
            const tag = getStoreTag(store.subDomain);
            return (
              <div
                key={store.id}
                className={`bg-card rounded-lg border-l-4 border border-border ${tagBorderClass[tag]} p-5 transform transition-transform duration-150 hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${tagDotClass[tag]}`} />
                  <h3 className="font-heading text-lg font-semibold">{store.name}</h3>
                </div>
                <p className="font-mono text-xs text-muted-foreground mb-4">
                  {store.subDomain}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    store.isActive
                      ? 'border-tag-sports text-tag-sports'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {store.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}