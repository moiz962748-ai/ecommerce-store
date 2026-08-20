import { StoreHeader } from '@/components/store-header';
import { StoreFooter } from '@/components/store/StoreFooter';
import { StoreWhatsAppButton } from '@/components/store/StoreWhatsAppButton';
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
  let logoUrl: string | undefined = undefined;

  try {
    const store = await apiClient(`/public/stores/${subdomain}`);
    const configuredTheme = store?.templateConfig?.theme;
    const configuredMode = store?.templateConfig?.mode;

    if (store?.name) {
      storeName = store.name;
    }

    if (store?.logoUrl) {
      logoUrl = store.logoUrl;
    }

    if (configuredTheme && ['default', 'ES', 'sports', 'clothing', 'electronics'].includes(configuredTheme)) {
      storeTheme = configuredTheme;
    }

    if (configuredMode === 'light' || configuredMode === 'dark') {
      storeMode = configuredMode;
    }
  } catch {
    // Fall back to default subdomain theme if store not found
  }

  return (
    <div
      data-store-root="true"
      data-store-theme={storeTheme}
      data-store-mode={storeMode}
      className="flex min-h-screen flex-col bg-store-background text-store-foreground"
    >
      <StoreHeader 
        storeName={storeName} 
        subdomain={subdomain} 
        logoUrl={logoUrl} 
      />
      <main className="flex-1">{children}</main>
      <StoreFooter 
        storeName={storeName} 
        subdomain={subdomain} 
      />
      {/* Floating WhatsApp Widget */}
      <StoreWhatsAppButton subdomain={subdomain} />
    </div>
  );
}