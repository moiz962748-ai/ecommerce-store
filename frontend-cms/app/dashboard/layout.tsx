'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getStoredToken, getStoredUser, clearAuth, StoredUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Stores', href: '/dashboard/stores' },
  { label: 'Products', href: '/dashboard/products' },
  { label: 'Categories', href: '/dashboard/categories' },
  { label: 'Orders', href: '/dashboard/orders' },
  { label: 'Partners', href: '/dashboard/partners' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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

    setUser(storedUser);
    setChecked(true);
  }, [router]);

  // Route change hone par mobile sidebar auto close ho jaye
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar text-sidebar-foreground border-b border-sidebar-border sticky top-0 z-30">
        <div>
          <h2 className="font-heading text-lg font-semibold">CMS Admin</h2>
          {user && (
            <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wide">
              {user.role} · {user.fullName}
            </p>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
          className="p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground focus:outline-none"
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar (Desktop: standard sidebar, Mobile: slide-out drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Desktop Header */}
        <div className="hidden md:block px-6 py-7 border-b border-sidebar-border">
          <h2 className="font-heading text-xl font-semibold tracking-tight">CMS Admin</h2>
          {user && (
            <p className="text-xs text-sidebar-foreground/60 mt-1.5 uppercase tracking-wide">
              {user.role} · {user.fullName}
            </p>
          )}
        </div>

        {/* Mobile Sidebar Close Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-sidebar-border">
          <span className="font-semibold text-sm">Navigation</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded hover:bg-sidebar-accent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors border-l-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-tag-electronics font-medium'
                    : 'border-l-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
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
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}