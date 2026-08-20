'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getStoredToken, getStoredUser, clearAuth, StoredUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Store,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Stores', href: '/dashboard/stores', icon: Store },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Categories', href: '/dashboard/categories', icon: Layers },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Partners', href: '/dashboard/partners', icon: Users },
  { label: 'Customizer', href: '/dashboard/customizer', icon: Palette },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state

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
      {/* 1. Mobile Top Header */}
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
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 2. Backdrop for Mobile Drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* 3. Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out md:static md:translate-x-0 border-r border-sidebar-border shadow-2xl md:shadow-none ${
          sidebarOpen ? 'translate-x-0 w-72 sm:w-80' : '-translate-x-full'
        } ${isCollapsed ? 'md:w-[72px]' : 'md:w-64'}`}
      >
        {/* Desktop Header with Toggle Button */}
        <div className="hidden md:flex items-center justify-between px-4 py-5 border-b border-sidebar-border min-h-[73px]">
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h2 className="font-heading text-lg font-semibold tracking-tight">CMS Admin</h2>
              {user && (
                <p className="text-[11px] text-sidebar-foreground/60 truncate uppercase tracking-wide">
                  {user.role} · {user.fullName}
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`p-1.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${
              isCollapsed ? 'mx-auto' : 'ml-auto'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Header with Close Button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-sidebar-border">
          <div>
            <h3 className="font-heading font-bold text-base text-sidebar-foreground">CMS Navigation</h3>
            {user && (
              <p className="text-[10px] text-sidebar-foreground/60 uppercase">
                {user.role} · {user.fullName}
              </p>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                title={item.label}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                } ${isCollapsed ? 'md:justify-center md:px-2' : ''}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary' : ''}`} />
                <span className={`truncate ${isCollapsed ? 'md:hidden' : 'inline'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-sidebar-border">
          {/* Full Logout Button (Always on Mobile, and Desktop when Expanded) */}
          <div className={isCollapsed ? 'md:hidden' : 'block'}>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Icon-Only Logout Button (Desktop when Collapsed only) */}
          {isCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="hidden md:flex w-full justify-center p-2.5 rounded-lg text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* 4. Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-full overflow-x-hidden transition-all duration-300">
        {children}
      </main>
    </div>
  );
}