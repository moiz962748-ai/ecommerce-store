import { getStoreTheme } from '@/lib/store-theme';

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const theme = getStoreTheme(subdomain);
  const formattedSubdomain = subdomain
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return (
    <div data-store-theme={theme} className="flex flex-col min-h-screen bg-store-background text-store-foreground">
      <main className="flex-1">{children}</main>

      
    </div>
  );
}