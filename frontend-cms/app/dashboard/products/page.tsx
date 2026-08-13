'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  storeId: string;
  categoryId: string;
}

interface Store {
  id: string;
  name: string;
  subDomain: string;
}

interface Category {
  id: string;
  name: string;
}

const createProductSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  basePrice: z.number().min(0, { message: 'Price cannot be negative' }),
  storeId: z.string().uuid({ message: 'Please select a store' }),
  categoryId: z.string().uuid({ message: 'Please select a category' }),
});

type CreateProductValues = z.infer<typeof createProductSchema>;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setFocus,
    formState: { errors },
  } = useForm<CreateProductValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      storeId: '',
      categoryId: '',
    },
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = getStoredToken();
      const [productsData, storesData, categoriesData] = await Promise.all([
        apiClient('/products', { token: token || undefined }),
        apiClient('/stores', { token: token || undefined }),
        apiClient('/categories', { token: token || undefined }),
      ]);
      setProducts(productsData);
      setStores(storesData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onSubmit = async (values: CreateProductValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const token = getStoredToken();
      await apiClient('/products', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify(values),
      });

      reset();
      setDialogOpen(false);
      fetchAll();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStore = (id: string) => stores.find((s) => s.id === id);
  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Products</h1>
          <p className="text-muted-foreground">Manage all products</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button>Create Product</Button>} />
            <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle className="font-heading">Create a new product</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit, (errors) => {
                const first = Object.keys(errors)[0];
                if (first) setFocus(first as any);
              })}
              className="space-y-4 mt-2"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Red T-Shirt"
                  {...register('name')}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Optional description" {...register('description')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" placeholder="https://..." {...register('imageUrl')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basePrice">Price</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  placeholder="999"
                  {...register('basePrice', { valueAsNumber: true })}
                  aria-describedby={errors.basePrice ? 'basePrice-error' : undefined}
                />
                {errors.basePrice && (
                  <p id="basePrice-error" className="text-sm text-red-500">{errors.basePrice.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Store</Label>
                <Controller
                  control={control}
                  name="storeId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-describedby={errors.storeId ? 'storeId-error' : undefined}>
                        <SelectValue placeholder="Select a store" />
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
                />
                {errors.storeId && (
                  <p id="storeId-error" className="text-sm text-red-500">{errors.storeId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-describedby={errors.categoryId ? 'categoryId-error' : undefined}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p id="categoryId-error" className="text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>

              <div role="status" aria-live="polite">{submitError && <p className="text-sm text-red-500">{submitError}</p>}</div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-muted-foreground">Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No products yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => {
              const store = getStore(product.storeId);
              const tag = store ? getStoreTag(store.subDomain) : null;
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {tag && (
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${tagDotClass[tag]}`} />
                      )}
                      {store?.name || '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getCategoryName(product.categoryId)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">Rs. {product.basePrice}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}