"use client";

import dynamic from 'next/dynamic';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

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

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cart-updated'));

    // 1. Direct search param check
    const rawParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const directUrlRedirect = rawParams?.get('redirect');
    const sessionRedirect = typeof window !== 'undefined' ? sessionStorage.getItem('redirect_after_login') : null;

    let targetDestination = redirectUrl || directUrlRedirect || sessionRedirect;

    // Decode URL if encoded
    if (targetDestination) {
      targetDestination = decodeURIComponent(targetDestination);
    }

    // 2. Strict Check: Agar destination mojood hai to direct wahan bhejo
    if (targetDestination && targetDestination !== '/login') {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('redirect_after_login');
        window.location.assign(targetDestination);
      } else {
        router.push(targetDestination);
      }
      return;
    }

    // 3. Fallback only if no redirect exists
    const role = data.user?.role?.toUpperCase();
    if (role === 'PARTNER') {
      window.location.assign('/partner');
    } else if (role === 'ADMIN') {
      window.location.assign('/dashboard');
    } else {
      const targetStore = data.user?.subdomain || 'electronics';
      window.location.assign(`/store/${targetStore}`);
    }
  } catch (err: any) {
    setServerError(err.message);
  } finally {
    setLoading(false);
  }
};

  const currentRedirectParam = redirectUrl || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null);
  const registerRedirectLink = currentRedirectParam
    ? `/register?redirect=${encodeURIComponent(currentRedirectParam)}`
    : '/register';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-6 flex flex-col items-center">
        <div className="mb-3 flex gap-1.5">
          <span className="h-1 w-8 rounded-full bg-tag-electronics" />
          <span className="h-1 w-8 rounded-full bg-tag-sports" />
          <span className="h-1 w-8 rounded-full bg-tag-clothing" />
        </div>
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          Login
        </h1>
      </div>

      <Card className="w-full max-w-sm bg-card border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl font-semibold text-foreground">Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account
          </CardDescription>
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
              <Link
                href={registerRedirectLink}
                className="underline text-sidebar-accent"
              >
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}