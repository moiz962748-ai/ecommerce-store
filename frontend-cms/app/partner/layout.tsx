'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getStoredToken, getStoredUser, clearAuth, StoredUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'My Store', href: '/partner' },
  { label: 'Products', href: '/partner/products' },
  { label: 'Orders', href: '/partner/orders' },
];

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    if (storedUser.role !== 'PARTNER' && storedUser.role !== 'ADMIN') {
      router.push('/login');
      return;
    }

    setUser(storedUser);
    setChecked(true);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/20 flex flex-col">
        <div className="p-6 border-b">
          <h2 className="font-bold text-lg">Partner Portal</h2>
          {user && (
            <p className="text-sm text-muted-foreground mt-1">{user.fullName}</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}