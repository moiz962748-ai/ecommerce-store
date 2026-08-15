'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { getStoreTag, tagDotClass } from '@/lib/store-tags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Store {
  id: string;
  name: string;
  subDomain: string;
  isActive: boolean;
  createdAt: string;
}

const createStoreSchema = z.object({
  name: z.string().min(1, { message: 'Store name is required' }),
  subDomain: z.string().min(1, { message: 'Subdomain is required' }),
  theme: z.enum(['default', 'electronics', 'sports', 'clothing']),
  mode: z.enum(['dark', 'light']),
});

type CreateStoreValues = z.infer<typeof createStoreSchema>;

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<CreateStoreValues>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      theme: 'default',
      mode: 'dark',
    },
  });

  const fetchStores = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchStores();
  }, []);

  const onSubmit = async (values: CreateStoreValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const token = getStoredToken();
      await apiClient('/stores', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify(values),
      });

      reset();
      setDialogOpen(false);
      fetchStores();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Stores</h1>
          <p className="text-muted-foreground">Manage all stores on the platform</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button>Create Store</Button>} />
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle className="font-heading">Create a new store</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit, (errors) => {
                const first = Object.keys(errors)[0];
                if (first) setFocus(first as any);
              })}
              className="space-y-4 mt-2"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  placeholder="My Store"
                  {...register('name')}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subDomain">Subdomain</Label>
                <Input
                  id="subDomain"
                  placeholder="my-store"
                  {...register('subDomain')}
                  aria-describedby={errors.subDomain ? 'subDomain-error' : undefined}
                />
                {errors.subDomain && (
                  <p id="subDomain-error" className="text-sm text-red-500">{errors.subDomain.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Store Theme</Label>
                  <select
                    id="theme"
                    defaultValue="default"
                    {...register('theme')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="default">Default</option>
                    <option value="electronics">Electronics</option>
                    <option value="sports">Sports</option>
                    <option value="clothing">Clothing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <select
                    id="mode"
                    defaultValue="dark"
                    {...register('mode')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
              </div>

              <div role="status" aria-live="polite">{submitError && <p className="text-sm text-red-500">{submitError}</p>}</div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Store'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-muted-foreground">Loading stores...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subdomain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No stores yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
            {stores.map((store) => {
              const tag = getStoreTag(store.subDomain);
              return (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${tagDotClass[tag]}`} />
                      {store.name}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {store.subDomain}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        store.isActive
                          ? 'border-tag-sports text-tag-sports'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {store.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}