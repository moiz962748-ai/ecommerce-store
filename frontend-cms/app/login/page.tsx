"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
const Input = dynamic(() => import('@/components/ui/input').then((m) => m.Input), { ssr: false });
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/Icon';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setLoading(true);
    try {
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      // Stored in localStorage for now — will upgrade to httpOnly cookies later
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'PARTNER') {
        router.push('/partner');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-6 flex flex-col items-center">
        <div className="mb-3 flex gap-1.5">
          <span className="h-1 w-8 rounded-full bg-tag-electronics" />
          <span className="h-1 w-8 rounded-full bg-tag-sports" />
          <span className="h-1 w-8 rounded-full bg-tag-clothing" />
        </div>
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          CMS Admin
        </h1>
      </div>

      <Card className="w-full max-w-sm bg-card border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl font-semibold text-foreground">Login</CardTitle>
          <CardDescription className="text-muted-foreground">Sign in to your CMS account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="p-1 rounded text-muted-foreground hover:text-muted-foreground/90"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? (
                    <Icon name="eye-off" variant="filled" size={16} className="w-4 h-4" />
                  ) : (
                    <Icon name="eye" variant="outline" size={16} className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <p role="status" aria-live="polite" className="text-sm text-red-500 text-center">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:opacity-95"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-sm text-center text-foreground">
              Don&apos;t have an account?{' '}
              <a href="/register" className="underline text-sidebar-accent">
                Register
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}