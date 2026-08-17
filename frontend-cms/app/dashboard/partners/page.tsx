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
    <div className="w-full max-w-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight">
          Assign Partner
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Grant a user access to manage a store
        </p>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-lg shadow-sm border">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <CardTitle className="font-heading text-lg sm:text-xl">
            New Assignment
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Enter the user&apos;s ID and select the store they should manage.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              const first = Object.keys(errors)[0];
              if (first) setFocus(first as any);
            })}
            className="space-y-4"
          >
            {/* Store Selection */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Store</Label>
              {loadingStores ? (
                <div className="h-10 w-full rounded-md border border-input bg-muted/40 animate-pulse flex items-center px-3 text-xs text-muted-foreground">
                  Loading stores...
                </div>
              ) : (
                <Controller
                  control={control}
                  name="storeId"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v || '')}
                    >
                      <SelectTrigger
                        className="w-full text-sm h-10"
                        aria-describedby={errors.storeId ? 'storeId-error' : undefined}
                      >
                        <SelectValue placeholder="Select a store">
                          {(value: string | null) => {
                            const store = stores.find((s) => s.id === value);
                            if (!store) return 'Select a store';
                            const tag = getStoreTag(store.subDomain);
                            return (
                              <span className="flex items-center gap-2 truncate">
                                <span
                                  className={`inline-block w-2 h-2 rounded-full shrink-0 ${tagDotClass[tag]}`}
                                />
                                <span className="truncate">{store.name}</span>
                              </span>
                            );
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {stores.map((store) => {
                          const tag = getStoreTag(store.subDomain);
                          return (
                            <SelectItem key={store.id} value={store.id}>
                              <span className="flex items-center gap-2">
                                <span
                                  className={`inline-block w-2 h-2 rounded-full shrink-0 ${tagDotClass[tag]}`}
                                />
                                <span className="truncate">{store.name}</span>
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
                <p id="storeId-error" className="text-xs text-red-500 font-medium">
                  {errors.storeId.message}
                </p>
              )}
            </div>

            {/* User ID Input */}
            <div className="space-y-1.5">
              <Label htmlFor="userId" className="text-sm font-medium">
                User ID
              </Label>
              <Input
                id="userId"
                placeholder="e.g. 862915c5-2f43-474c-8208-75dfa8a7fd51"
                className="font-mono text-xs sm:text-sm h-10 w-full"
                {...register('userId')}
                aria-describedby={errors.userId ? 'userId-error' : undefined}
              />
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                Find this in the Users table in Supabase for now.
              </p>
              {errors.userId && (
                <p id="userId-error" className="text-xs text-red-500 font-medium">
                  {errors.userId.message}
                </p>
              )}
            </div>

            {/* Status Messages */}
            <div role="status" aria-live="polite">
              {submitError && (
                <p className="text-xs sm:text-sm text-red-500 bg-red-50 p-2.5 rounded-md border border-red-200">
                  {submitError}
                </p>
              )}
              {success && (
                <p className="text-xs sm:text-sm text-green-700 bg-green-50 p-2.5 rounded-md border border-green-200">
                  Partner assigned successfully!
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 text-sm font-medium"
              disabled={submitting}
            >
              {submitting ? 'Assigning...' : 'Assign Partner'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}