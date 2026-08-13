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
  basePrice: number;
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
  basePrice: z.number().min(0, { message: 'Price cannot be negative' }),
  storeId: z.string().uuid(),
  categoryId: z.string().uuid({ message: 'Please select a category' }),
});

type CreateProductValues = z.infer<typeof createProductSchema>;

export default function PartnerProductsPage() {
  const [myStore, setMyStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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
    setValue,
    formState: { errors },
  } = useForm<CreateProductValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { name: '', description: '', storeId: '', categoryId: '' },
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = getStoredToken();
      const [myStores, categoriesData] = await Promise.all([
        apiClient('/stores/my-stores', { token: token || undefined }),
        apiClient('/categories', { token: token || undefined }),
      ]);

      const store = myStores[0] || null;
      setMyStore(store);
      setCategories(categoriesData);

      if (store) {
        setValue('storeId', store.id);
        const productsData = await apiClient(`/products/store/${store.id}`, {
          token: token || undefined,
        });
        setProducts(productsData);
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

      reset({ name: '', description: '', storeId: myStore?.id || '', categoryId: '' });
      setDialogOpen(false);
      fetchAll();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '—';

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!myStore) {
    return <p className="text-muted-foreground">You are not assigned to any store yet.</p>;
  }

  const tag = getStoreTag(myStore.subDomain);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold flex items-center gap-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${tagDotClass[tag]}`} />
            Products — {myStore.name}
          </h1>
          <p className="text-muted-foreground">Manage products for your store</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button>Create Product</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Create a new product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Red T-Shirt" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Optional description" {...register('description')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basePrice">Price</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  placeholder="999"
                  {...register('basePrice', { valueAsNumber: true })}
                />
                {errors.basePrice && (
                  <p className="text-sm text-red-500">{errors.basePrice.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(v) => field.onChange(v || '')}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(value: string | null) =>
                            categories.find((c) => c.id === value)?.name || 'Select a category'
                          }
                        </SelectValue>
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
                  <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>

              {submitError && <p className="text-sm text-red-500">{submitError}</p>}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No products yet. Create your first one.
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-muted-foreground">{getCategoryName(product.categoryId)}</TableCell>
              <TableCell className="font-mono text-xs">Rs. {product.basePrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}