"use client";

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import zxcvbn from 'zxcvbn';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

const registerSchema = z
  .object({
    fullName: z.string().min(1, { message: 'Full name is required' }),
    email: z.string().email({ message: 'Please provide a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password') || '';
  const [agreed, setAgreed] = useState(false);

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = values as any;
      await apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccess(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      const msg = err?.message || 'Registration failed';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const passwordScore = useMemo(() => {
    if (!passwordValue) return 0;
    try {
      const res = zxcvbn(passwordValue);
      return Math.max(0, Math.min(4, res.score));
    } catch (e) {
      let score = 0;
      if (passwordValue.length >= 8) score += 1;
      if (/[A-Z]/.test(passwordValue)) score += 1;
      if (/[0-9]/.test(passwordValue)) score += 1;
      if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
      return score;
    }
  }, [passwordValue]);

  const strengthLabel = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordScore];

  const disabledReason = !agreed
    ? 'Check the box below to continue'
    : !isValid
    ? 'Fill in all fields correctly to continue'
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-6 flex flex-col items-center">
        <div className="mb-3 flex gap-1.5">
          <span className="h-1 w-8 rounded-full bg-tag-electronics" />
          <span className="h-1 w-8 rounded-full bg-tag-sports" />
          <span className="h-1 w-8 rounded-full bg-tag-clothing" />
        </div>
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          Register
        </h1>
      </div>

      <Card className="w-full max-w-sm bg-card border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl font-semibold text-foreground">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground">Sign up for a new CMS account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              const first = Object.keys(errors)[0];
              if (first) setFocus(first as any);
            })}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...register('fullName')}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {errors.email.message}
                </p>
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
                <p id="password-error" className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide confirm password' : 'Show confirm password'}
                  title={showPassword ? 'Hide confirm password' : 'Show confirm password'}
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
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Strength</Label>
              <div className="w-full bg-muted p-1 rounded">
                <div
                  className={`h-2 rounded transition-all duration-200 ${
                    passwordScore <= 1
                      ? 'bg-red-500 w-1/4'
                      : passwordScore === 2
                      ? 'bg-amber-400 w-2/4'
                      : passwordScore === 3
                      ? 'bg-emerald-400 w-3/4'
                      : 'bg-emerald-600 w-full'
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground">{strengthLabel}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 accent-[var(--sidebar-accent)]"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <a className="underline text-sidebar-accent">Terms</a>
              </label>
            </div>

            <div aria-live="polite">
              {serverError && (
                <p className="text-sm text-red-500 text-center">{serverError}</p>
              )}

              {success && (
                <p className="text-sm text-green-600 text-center">
                  Account created successfully! Redirecting to login...
                </p>
              )}
            </div>

            <div className="relative">
              <Button
                type="submit"
                className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:opacity-95"
                disabled={loading || !agreed || !isValid}
              >
                {loading ? 'Creating account...' : 'Register'}
              </Button>

              {/* success animation */}
              <div
                aria-hidden={!success}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transform transition-all duration-300 ${
                  success ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
              >
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md">
                  <Icon name="check" variant="filled" size={18} className="text-white" />
                </div>
              </div>
            </div>

            {!loading && !success && disabledReason && (
              <p className="text-xs text-center text-muted-foreground">{disabledReason}</p>
            )}

            <p className="text-sm text-center text-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline text-sidebar-accent">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}