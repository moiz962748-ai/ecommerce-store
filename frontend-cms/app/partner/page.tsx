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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight">
          My Stores
        </h1>
        <p className="text-sm text-muted-foreground">
          Stores you are assigned to manage
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading stores...</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stores Content */}
      {!loading && !error && (
        <>
          {stores.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center sm:p-12">
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You are not assigned to any store yet. Contact an admin to get access.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {stores.map((store) => {
                const tag = getStoreTag(store.subDomain);
                return (
                  <Card
                    key={store.id}
                    className={`border-l-4 transition-shadow hover:shadow-sm ${tagBorderClass[tag]}`}
                  >
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3 space-y-1.5">
                      <CardTitle className="font-heading text-base sm:text-lg flex items-center gap-2 truncate">
                        <span
                          className={`inline-block h-2 w-2 shrink-0 rounded-full ${tagDotClass[tag]}`}
                        />
                        <span className="truncate">{store.name}</span>
                      </CardTitle>
                      <CardDescription className="font-mono text-xs text-muted-foreground truncate">
                        {store.subDomain}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                          store.isActive
                            ? 'border-emerald-600/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'border-border bg-muted text-muted-foreground'
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
        </>
      )}
    </div>
  );
}