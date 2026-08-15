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

  try {
    const store = await apiClient(`/public/stores/${subdomain}`);
    const configuredTheme = store?.templateConfig?.theme;
    const configuredMode = store?.templateConfig?.mode;

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
        <div className="mx-auto flex w-full max-w-7xl items-center justify-end px-4 py-3">
          <StoreThemeToggle />
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}