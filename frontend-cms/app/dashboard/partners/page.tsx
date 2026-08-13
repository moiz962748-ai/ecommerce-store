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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  subDomain: string;
}

const assignSchema = z.object({
  storeId: z.string().uuid({ message: 'Please select a store' }),
  userId: z.string().uuid({ message: 'Please enter a valid user ID (UUID)' }),
});

type AssignFormValues = z.infer<typeof assignSchema>;

export default function PartnersPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setFocus,
    formState: { errors },
  } = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: { storeId: '', userId: '' },
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = getStoredToken();
        const data = await apiClient('/stores', { token: token || undefined });
        setStores(data);
      } finally {
        setLoadingStores(false);
      }
    };
    fetchStores();
  }, []);

  const onSubmit = async (values: AssignFormValues) => {
    setSubmitError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      const token = getStoredToken();
      await apiClient('/stores/assign-partner', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify(values),
      });
      setSuccess(true);
      reset();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Assign Partner</h1>
        <p className="text-muted-foreground">Grant a user access to manage a store</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="font-heading">New Assignment</CardTitle>
          <CardDescription>
            Enter the user&apos;s ID and select the store they should manage.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              const first = Object.keys(errors)[0];
              if (first) setFocus(first as any);
            })}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Store</Label>
              {loadingStores ? (
                <p className="text-muted-foreground text-sm">Loading stores...</p>
              ) : (
                <Controller
                  control={control}
                  name="storeId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(v) => field.onChange(v || '')}>
                      <SelectTrigger className="w-full" aria-describedby={errors.storeId ? 'storeId-error' : undefined}>
                        <SelectValue>
                          {(value: string | null) => {
                            const store = stores.find((s) => s.id === value);
                            if (!store) return 'Select a store';
                            const tag = getStoreTag(store.subDomain);
                            return (
                              <span className="flex items-center gap-2">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${tagDotClass[tag]}`} />
                                {store.name}
                              </span>
                            );
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => {
                          const tag = getStoreTag(store.subDomain);
                          return (
                            <SelectItem key={store.id} value={store.id}>
                              <span className="flex items-center gap-2">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${tagDotClass[tag]}`} />
                                {store.name}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {errors.storeId && (
                <p id="storeId-error" className="text-sm text-red-500">{errors.storeId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="e.g. 862915c5-2f43-474c-8208-75dfa8a7fd51"
                className="font-mono text-xs"
                {...register('userId')}
                aria-describedby={errors.userId ? 'userId-error' : undefined}
              />
              <p className="text-xs text-muted-foreground">
                Find this in the Users table in Supabase for now.
              </p>
              {errors.userId && (
                <p id="userId-error" className="text-sm text-red-500">{errors.userId.message}</p>
              )}
            </div>

            <div role="status" aria-live="polite">
              {submitError && <p className="text-sm text-red-500">{submitError}</p>}
              {success && <p className="text-sm text-green-600">Partner assigned successfully!</p>}
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Assign Partner'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}