'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { getStoreTag, tagDotClass } from '@/lib/store-tags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, X, ImageIcon, Plus, Trash2, Layers } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
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

interface Variant {
  id?: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price: number;
  sku?: string | null;
  stock?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  basePrice: number;
  storeId: string;
  categoryId: string;
  variants?: Variant[];
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

const variantSchema = z.object({
  name: z.string().min(1, { message: 'Variant name required' }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.number().min(0, { message: 'Price cannot be negative' }),
  sku: z.string().optional(),
  stock: z.number().min(0).optional(),
});

const productSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  basePrice: z.number().min(0, { message: 'Price cannot be negative' }),
  storeId: z.string().uuid({ message: 'Please select a store' }),
  categoryId: z.string().uuid({ message: 'Please select a category' }),
  variants: z.array(variantSchema).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const compressImage = (file: File, callback: (base64: string) => void) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target?.result as string;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const scaleSize = MAX_WIDTH / img.width;
      const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
      const height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressedBase64);
    };
  };
  reader.readAsDataURL(file);
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editSubmitError, setEditSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 1. Create Form
  const createForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      storeId: '',
      categoryId: '',
      variants: [],
    },
  });

  const createVariantsArray = useFieldArray({
    control: createForm.control,
    name: 'variants',
  });

  // 2. Edit Form
  const editForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      storeId: '',
      categoryId: '',
      variants: [],
    },
  });

  const editVariantsArray = useFieldArray({
    control: editForm.control,
    name: 'variants',
  });

  const createImageUrl = createForm.watch('imageUrl');
  const watchedCreateVariants = createForm.watch('variants');

  const editImageUrl = editForm.watch('imageUrl');
  const watchedEditVariants = editForm.watch('variants');

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

  const onCreateSubmit = async (values: ProductFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const token = getStoredToken();
      await apiClient('/products', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify(values),
      });

      createForm.reset();
      setDialogOpen(false);
      fetchAll();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateDialog = () => {
    createForm.reset({
      name: '',
      description: '',
      imageUrl: '',
      basePrice: undefined,
      storeId: '',
      categoryId: '',
      variants: [],
    });
    setSubmitError(null);
    setDialogOpen(true);
  };

  const openEditDialog = async (product: Product) => {
    setEditingProduct(product);
    setEditSubmitError(null);
    setEditDialogOpen(true);

    let productVariants = product.variants || [];
    try {
      const token = getStoredToken();
      const detailed = await apiClient(`/products/${product.id}`, {
        token: token || undefined,
      });
      if (detailed?.variants && Array.isArray(detailed.variants)) {
        productVariants = detailed.variants;
      }
    } catch (err) {
      console.error('Error fetching details:', err);
    }

    editForm.reset({
      name: product.name,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      basePrice: Number(product.basePrice || 0),
      storeId: product.storeId,
      categoryId: product.categoryId,
      variants: productVariants.map((v) => ({
        name: v.name,
        description: v.description || '',
        imageUrl: v.imageUrl || '',
        price: Number(v.price),
        sku: v.sku || '',
        stock: v.stock !== undefined ? Number(v.stock) : 10,
      })),
    });
  };

  const onEditSubmit = async (values: ProductFormValues) => {
    if (!editingProduct) return;

    setEditSubmitError(null);
    setEditSubmitting(true);
    try {
      const token = getStoredToken();
      await apiClient(`/products/${editingProduct.id}`, {
        method: 'PATCH',
        token: token || undefined,
        body: JSON.stringify(values),
      });

      setEditDialogOpen(false);
      setEditingProduct(null);
      editForm.reset();
      fetchAll();
    } catch (err: any) {
      setEditSubmitError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  const openDeleteDialog = (product: Product) => {
    setDeletingProduct(product);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const onDeleteSubmit = async () => {
    if (!deletingProduct) return;

    setDeleteError(null);
    setDeleting(true);
    try {
      const token = getStoredToken();
      await apiClient(`/products/${deletingProduct.id}`, {
        method: 'DELETE',
        token: token || undefined,
      });

      setDeleteDialogOpen(false);
      setDeletingProduct(null);
      fetchAll();
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const getStore = (id: string) => stores.find((s) => s.id === id);
  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '—';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Products</h1>
          <p className="text-muted-foreground">Manage products and product variants</p>
        </div>

        {/* Create Product Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button onClick={openCreateDialog}>Create Product</Button>} />
          <DialogContent className="p-6 max-h-[90vh] overflow-y-auto max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg">Create a new product</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={createForm.handleSubmit(onCreateSubmit, (errors) => {
                const first = Object.keys(errors)[0];
                if (first) createForm.setFocus(first as any);
              })}
              className="space-y-4 mt-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="Embroidered Organza Festive Suit"
                    {...createForm.register('name')}
                  />
                  {createForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{createForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Handcrafted with delicate embroidery"
                    {...createForm.register('description')}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Main Image</Label>
                  {createImageUrl ? (
                    <div className="relative w-28 h-28 rounded-xl border overflow-hidden">
                      <img src={createImageUrl} alt="Main" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => createForm.setValue('imageUrl', '', { shouldDirty: true })}
                        className="absolute top-1.5 right-1.5 p-1 bg-rose-500 text-white rounded-full"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100">
                      <UploadCloud size={20} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600 mt-1">Upload Main Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            compressImage(file, (base64) =>
                              createForm.setValue('imageUrl', base64, { shouldDirty: true }),
                            );
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (Rs.)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    placeholder="34500"
                    {...createForm.register('basePrice', { valueAsNumber: true })}
                  />
                  {createForm.formState.errors.basePrice && (
                    <p className="text-sm text-red-500">{createForm.formState.errors.basePrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Store</Label>
                  <Controller
                    control={createForm.control}
                    name="storeId"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
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
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Category</Label>
                  <Controller
                    control={createForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
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
                </div>
              </div>

              {/* Create Variants Section */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-slate-600" />
                    <span className="font-semibold text-sm">Product Variants</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() =>
                      createVariantsArray.append({
                        name: '',
                        price: createForm.watch('basePrice') || 0,
                        description: '',
                        imageUrl: '',
                        sku: '',
                        stock: 10,
                      })
                    }
                  >
                    <Plus size={14} /> Add Variant
                  </Button>
                </div>

                <div className="space-y-3">
                  {createVariantsArray.fields.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      No variants added. Click "+ Add Variant" to add options.
                    </p>
                  )}
                  {createVariantsArray.fields.map((field, index) => {
                    const variantImg = watchedCreateVariants?.[index]?.imageUrl;
                    return (
                      <div
                        key={field.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
                      >
                        <button
                          type="button"
                          onClick={() => createVariantsArray.remove(index)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-2 gap-3 pr-6">
                          <div>
                            <Label className="text-xs">Variant Name</Label>
                            <Input
                              placeholder="e.g. Red / XL"
                              className="h-8 text-xs bg-white"
                              {...createForm.register(`variants.${index}.name` as const)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Variant Price (Rs.)</Label>
                            <Input
                              type="number"
                              className="h-8 text-xs bg-white"
                              {...createForm.register(`variants.${index}.price` as const, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Variant Description</Label>
                            <Input
                              placeholder="Specific details for this variant"
                              className="h-8 text-xs bg-white"
                              {...createForm.register(`variants.${index}.description` as const)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">SKU</Label>
                            <Input
                              placeholder="SHOE-RED-42"
                              className="h-8 text-xs bg-white"
                              {...createForm.register(`variants.${index}.sku` as const)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Stock</Label>
                            <Input
                              type="number"
                              className="h-8 text-xs bg-white"
                              {...createForm.register(`variants.${index}.stock` as const, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs">Variant Photo</Label>
                          {variantImg ? (
                            <div className="relative w-20 h-20 rounded-lg border overflow-hidden mt-1">
                              <img src={variantImg} alt="Variant" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() =>
                                  createForm.setValue(`variants.${index}.imageUrl` as const, '', {
                                    shouldDirty: true,
                                  })
                                }
                                className="absolute top-1 right-1 p-0.5 bg-rose-500 text-white rounded-full"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center gap-2 mt-1 px-3 py-1.5 border border-dashed rounded-lg cursor-pointer bg-white hover:bg-slate-100 text-xs text-slate-600">
                              <UploadCloud size={14} className="text-slate-400" />
                              <span>Upload Photo for this variant</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    compressImage(file, (base64) =>
                                      createForm.setValue(`variants.${index}.imageUrl` as const, base64, {
                                        shouldDirty: true,
                                      }),
                                    );
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {submitError && <p className="text-sm text-red-500">{submitError}</p>}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating Product...' : 'Create Product'}
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
              <TableHead className="w-14">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No products yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => {
              const store = getStore(product.storeId);
              const tag = store ? getStoreTag(store.subDomain) : null;
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {tag && <span className={`inline-block w-1.5 h-1.5 rounded-full ${tagDotClass[tag]}`} />}
                      {store?.name || '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getCategoryName(product.categoryId)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    Rs. {Number(product.basePrice || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(product)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Edit Product Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingProduct(null);
            setEditSubmitError(null);
            editForm.reset();
          }
        }}
      >
        <DialogContent className="p-6 max-h-[90vh] overflow-y-auto max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">Edit product & variants</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(onEditSubmit, (errors) => {
              const first = Object.keys(errors)[0];
              if (first) editForm.setFocus(first as any);
            })}
            className="space-y-4 mt-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input id="edit-name" {...editForm.register('name')} />
                {editForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input id="edit-description" {...editForm.register('description')} />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Main Image</Label>
                {editImageUrl ? (
                  <div className="relative w-28 h-28 rounded-xl border overflow-hidden">
                    <img src={editImageUrl} alt="Main" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => editForm.setValue('imageUrl', '', { shouldDirty: true })}
                      className="absolute top-1.5 right-1.5 p-1 bg-rose-500 text-white rounded-full"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <UploadCloud size={20} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-600 mt-1">Upload Main Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          compressImage(file, (base64) =>
                            editForm.setValue('imageUrl', base64, { shouldDirty: true }),
                          );
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-basePrice">Base Price (Rs.)</Label>
                <Input
                  id="edit-basePrice"
                  type="number"
                  step="0.01"
                  {...editForm.register('basePrice', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label>Store</Label>
                <Controller
                  control={editForm.control}
                  name="storeId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
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
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Category</Label>
                <Controller
                  control={editForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
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
              </div>
            </div>

            {/* Edit Variants Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-slate-600" />
                  <span className="font-semibold text-sm">Product Variants</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() =>
                    editVariantsArray.append({
                      name: '',
                      price: editForm.watch('basePrice') || 0,
                      description: '',
                      imageUrl: '',
                      sku: '',
                      stock: 10,
                    })
                  }
                >
                  <Plus size={14} /> Add Variant
                </Button>
              </div>

              <div className="space-y-3">
                {editVariantsArray.fields.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No variants for this product.</p>
                )}
                {editVariantsArray.fields.map((field, index) => {
                  const variantImg = watchedEditVariants?.[index]?.imageUrl;
                  return (
                    <div
                      key={field.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => editVariantsArray.remove(index)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-2 gap-3 pr-6">
                        <div>
                          <Label className="text-xs">Variant Name</Label>
                          <Input
                            placeholder="e.g. Red / XL"
                            className="h-8 text-xs bg-white"
                            {...editForm.register(`variants.${index}.name` as const)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Variant Price (Rs.)</Label>
                          <Input
                            type="number"
                            className="h-8 text-xs bg-white"
                            {...editForm.register(`variants.${index}.price` as const, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Variant Description</Label>
                          <Input
                            placeholder="Specific details for this variant"
                            className="h-8 text-xs bg-white"
                            {...editForm.register(`variants.${index}.description` as const)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">SKU</Label>
                          <Input
                            placeholder="SHOE-RED-42"
                            className="h-8 text-xs bg-white"
                            {...editForm.register(`variants.${index}.sku` as const)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Stock</Label>
                          <Input
                            type="number"
                            className="h-8 text-xs bg-white"
                            {...editForm.register(`variants.${index}.stock` as const, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Variant Photo</Label>
                        {variantImg ? (
                          <div className="relative w-20 h-20 rounded-lg border overflow-hidden mt-1">
                            <img src={variantImg} alt="Variant" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() =>
                                editForm.setValue(`variants.${index}.imageUrl` as const, '', {
                                  shouldDirty: true,
                                })
                              }
                              className="absolute top-1 right-1 p-0.5 bg-rose-500 text-white rounded-full"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-2 mt-1 px-3 py-1.5 border border-dashed rounded-lg cursor-pointer bg-white hover:bg-slate-100 text-xs text-slate-600">
                            <UploadCloud size={14} className="text-slate-400" />
                            <span>Upload Photo for this variant</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  compressImage(file, (base64) =>
                                    editForm.setValue(`variants.${index}.imageUrl` as const, base64, {
                                      shouldDirty: true,
                                    }),
                                  );
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {editSubmitError && <p className="text-sm text-red-500">{editSubmitError}</p>}

            <Button type="submit" className="w-full" disabled={editSubmitting}>
              {editSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setDeletingProduct(null);
            setDeleteError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong className="text-foreground">{deletingProduct?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={onDeleteSubmit} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}