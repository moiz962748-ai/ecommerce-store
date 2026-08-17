'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
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

interface Category {
  id: string;
  name: string;
}

const categorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Hooks
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = getStoredToken();
      const data = await apiClient('/categories', { token: token || undefined });
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditValue('name', category.name);
    setSubmitError(null);
    setEditDialogOpen(true);
  };

  const onCreateSubmit = async (values: CategoryFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const token = getStoredToken();
      await apiClient('/categories', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify(values),
      });

      resetCreate();
      setCreateDialogOpen(false);
      fetchCategories();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onEditSubmit = async (values: CategoryFormValues) => {
    if (!selectedCategory) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const token = getStoredToken();
      await apiClient(`/categories/${selectedCategory.id}`, {
        method: 'PATCH',
        token: token || undefined,
        body: JSON.stringify(values),
      });

      resetEdit();
      setEditDialogOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setDeletingId(id);
    try {
      const token = getStoredToken();
      await apiClient(`/categories/${id}`, {
        method: 'DELETE',
        token: token || undefined,
      });
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage product categories</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger render={<Button className="w-full sm:w-auto">Create Category</Button>} />
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle className="font-heading">Create a new category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="create-name">Category Name</Label>
                <Input
                  id="create-name"
                  placeholder="Clothing"
                  {...registerCreate('name')}
                />
                {createErrors.name && (
                  <p className="text-xs text-red-500">{createErrors.name.message}</p>
                )}
              </div>

              {submitError && <p className="text-xs text-red-500">{submitError}</p>}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Category'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                placeholder="Category Name"
                {...registerEdit('name')}
              />
              {editErrors.name && (
                <p className="text-xs text-red-500">{editErrors.name.message}</p>
              )}
            </div>

            {submitError && <p className="text-xs text-red-500">{submitError}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Updating...' : 'Save Changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {loading && <p className="text-sm text-muted-foreground">Loading categories...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="rounded-md border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[160px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-sm text-muted-foreground py-6">
                    No categories yet. Create your first one.
                  </TableCell>
                </TableRow>
              )}
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium text-sm">{category.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === category.id}
                      onClick={() => handleDelete(category.id)}
                    >
                      {deletingId === category.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}