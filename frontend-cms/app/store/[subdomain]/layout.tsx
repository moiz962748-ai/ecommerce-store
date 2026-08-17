import { StoreHeader } from '@/components/store-header';
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
      <StoreHeader storeName={storeName} subdomain={subdomain} />
      <main className="flex-1">{children}</main>
    </div>
  );
}