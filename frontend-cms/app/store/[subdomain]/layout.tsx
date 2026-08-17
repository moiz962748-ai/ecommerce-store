import Link from 'next/link';
import { StoreThemeToggle } from '@/components/store-theme-toggle';
import { apiClient } from '@/lib/api-client';
import { getStoreTheme } from '@/lib/store-theme';

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  let storeTheme = getStoreTheme(subdomain);
  let storeMode = 'dark';
  let storeName = subdomain;

  try {
    const store = await apiClient(`/public/stores/${subdomain}`);
    const configuredTheme = store?.templateConfig?.theme;
    const configuredMode = store?.templateConfig?.mode;

    if (store?.name) {
      storeName = store.name;
    }

    if (configuredTheme && ['default', 'electronics', 'sports', 'clothing'].includes(configuredTheme)) {
      storeTheme = configuredTheme;
    }

    if (configuredMode === 'light' || configuredMode === 'dark') {
      storeMode = configuredMode;
    }
  } catch {
    // Fall back to the default subdomain-based theme when the store is not found.
  }

  return (
    <div
      data-store-root="true"
      data-store-theme={storeTheme}
      data-store-mode={storeMode}
      className="flex min-h-screen flex-col bg-store-background text-store-foreground"
    >
      <div className="sticky top-0 z-50 border-b border-store-border bg-store-background/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href={`/store/${subdomain}`} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-store-border bg-store-card text-lg text-store-accent">
              ⚡
            </div>
            <p className="text-lg font-bold text-store-foreground store-heading">{storeName}</p>
          </Link>

          <div className="hidden min-w-[220px] flex-1 items-center gap-2 rounded-full border border-store-border bg-store-card px-3 py-2 md:flex md:max-w-xs">
            <span className="text-store-muted">⌕</span>
            <input
              aria-label="Search products"
              placeholder="Search"
              className="w-full bg-transparent text-sm text-store-foreground placeholder:text-store-muted outline-none"
            />
          </div>

          <nav className="flex items-center gap-4 text-sm md:gap-5">
            <Link href="/login" className="text-store-foreground hover:text-store-accent">Login</Link>
            <Link href={`/store/${subdomain}#about`} className="text-store-foreground hover:text-store-accent">About</Link>
            <Link href={`/store/${subdomain}#contact`} className="text-store-foreground hover:text-store-accent">Contact</Link>
          </nav>

          <StoreThemeToggle />
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}