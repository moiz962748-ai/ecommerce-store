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
  theme?: string;
  mode?: string;
  createdAt: string;
}

const storeSchema = z.object({
  name: z.string().min(1, { message: 'Store name is required' }),
  subDomain: z.string().min(1, { message: 'Subdomain is required' }),
  theme: z.enum(['default', 'electronics', 'sports', 'clothing']),
  mode: z.enum(['dark', 'light']),
  isActive: z.boolean().optional(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: { theme: 'default', mode: 'dark' },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
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

  const handleOpenEdit = (store: Store) => {
    setSelectedStore(store);
    setEditValue('name', store.name);
    setEditValue('subDomain', store.subDomain);
    setEditValue('theme', (store.theme as any) || 'default');
    setEditValue('mode', (store.mode as any) || 'dark');
    setEditValue('isActive', store.isActive ?? true);
    setSubmitError(null);
    setEditDialogOpen(true);
  };

  const onCreateSubmit = async (values: StoreFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const token = getStoredToken();
      await apiClient('/stores', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify(values),
      });

      resetCreate();
      setCreateDialogOpen(false);
      fetchStores();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onEditSubmit = async (values: StoreFormValues) => {
    if (!selectedStore) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const token = getStoredToken();
      const updatePayload = {
        name: values.name,
        theme: values.theme,
        mode: values.mode,
      };

      await apiClient(`/stores/${selectedStore.id}`, {
        method: 'PATCH',
        token: token || undefined,
        body: JSON.stringify(updatePayload),
      });

      resetEdit();
      setEditDialogOpen(false);
      setSelectedStore(null);
      fetchStores();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const token = getStoredToken();
      await apiClient(`/stores/${id}`, {
        method: 'DELETE',
        token: token || undefined,
      });
      fetchStores();
    } catch (err: any) {
      alert(err.message || 'Failed to delete store');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-semibold">Stores</h1>
          <p className="text-sm text-muted-foreground">Manage all stores on the platform</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger render={<Button className="w-full sm:w-auto">Create Store</Button>} />
          <DialogContent className="p-6 max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Create a new store</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="create-name">Store Name</Label>
                <Input
                  id="create-name"
                  placeholder="My Store"
                  {...registerCreate('name')}
                />
                {createErrors.name && (
                  <p className="text-xs text-red-500">{createErrors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-subDomain">Subdomain</Label>
                <Input
                  id="create-subDomain"
                  placeholder="my-store"
                  {...registerCreate('subDomain')}
                />
                {createErrors.subDomain && (
                  <p className="text-xs text-red-500">{createErrors.subDomain.message}</p>
                )}
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="create-theme">Store Theme</Label>
                  <select
                    id="create-theme"
                    defaultValue="default"
                    {...registerCreate('theme')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="default">Default</option>
                    <option value="electronics">Electronics</option>
                    <option value="sports">Sports</option>
                    <option value="clothing">Clothing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-mode">Mode</Label>
                  <select
                    id="create-mode"
                    defaultValue="dark"
                    {...registerCreate('mode')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
              </div>

              {submitError && <p className="text-xs text-red-500">{submitError}</p>}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Store'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="p-6 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Store</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Store Name</Label>
              <Input
                id="edit-name"
                placeholder="My Store"
                {...registerEdit('name')}
              />
              {editErrors.name && (
                <p className="text-xs text-red-500">{editErrors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-subDomain">Subdomain</Label>
              <Input
                id="edit-subDomain"
                placeholder="my-store"
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed"
                {...registerEdit('subDomain')}
              />
              <p className="text-[11px] text-muted-foreground">
                Subdomain cannot be changed after creation.
              </p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-theme">Store Theme</Label>
                <select
                  id="edit-theme"
                  {...registerEdit('theme')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="default">Default</option>
                  <option value="electronics">Electronics</option>
                  <option value="sports">Sports</option>
                  <option value="clothing">Clothing</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-mode">Mode</Label>
                <select
                  id="edit-mode"
                  {...registerEdit('mode')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>

            {submitError && <p className="text-xs text-red-500">{submitError}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Updating...' : 'Save Changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {loading && <p className="text-sm text-muted-foreground">Loading stores...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="rounded-md border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subdomain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[160px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">
                    No stores yet. Create your first one.
                  </TableCell>
                </TableRow>
              )}
              {stores.map((store) => {
                const tag = getStoreTag(store.subDomain);
                return (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium text-sm">
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
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(store)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === store.id}
                        onClick={() => handleDelete(store.id)}
                      >
                        {deletingId === store.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}