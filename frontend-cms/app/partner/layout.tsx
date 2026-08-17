'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getStoredToken, getStoredUser, clearAuth, StoredUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar text-sidebar-foreground border-b border-sidebar-border sticky top-0 z-40">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">Partner Portal</h2>
          {user && (
            <p className="text-[11px] text-sidebar-foreground/60 uppercase tracking-wide">
              {user.role} · {user.fullName}
            </p>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: Slide-over on mobile, static on desktop */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Header (Hidden on Mobile) */}
          <div className="hidden md:block px-6 py-7 border-b border-sidebar-border">
            <h2 className="font-heading text-xl font-semibold tracking-tight">Partner Portal</h2>
            {user && (
              <p className="text-xs text-sidebar-foreground/60 mt-1.5 uppercase tracking-wide">
                {user.role} · {user.fullName}
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-5 space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors border-l-2 ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-tag-electronics'
                      : 'border-l-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="outline"
            className="w-full bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}