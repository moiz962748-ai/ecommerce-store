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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      {/* 1. Mobile Top Header (Clean Light Bar with High-Contrast Typography) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-xs sticky top-0 z-30">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">CMS Admin</h2>
          {user && (
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              {user.role} · {user.fullName}
            </p>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
          className="p-2 rounded-xl bg-accent text-foreground hover:bg-accent/80 focus:outline-none transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* 2. Backdrop for Mobile Drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* 3. Sidebar (Original Admin Portal Palette & Warm Charcoal/Dark Styling) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out md:static md:translate-x-0 border-r border-sidebar-border shadow-2xl md:shadow-none ${
          sidebarOpen ? 'translate-x-0 w-72 sm:w-80' : '-translate-x-full'
        } ${isCollapsed ? 'md:w-[72px]' : 'md:w-64'}`}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-5 py-5 border-b border-sidebar-border min-h-[73px]">
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h2 className="font-heading text-lg font-bold tracking-tight">CMS Admin</h2>
              {user && (
                <p className="text-[10px] font-medium text-sidebar-foreground/60 truncate uppercase tracking-wider">
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

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-5 border-b border-sidebar-border">
          <div>
            <h3 className="font-heading font-bold text-base text-sidebar-foreground tracking-tight">CMS Navigation</h3>
            {user && (
              <p className="text-[10px] font-medium text-sidebar-foreground/60 uppercase tracking-wider mt-0.5">
                {user.role} · {user.fullName}
              </p>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close drawer"
            className="p-1.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Original Theme Native Sidebar Styling) */}
        <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                title={item.label}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                } ${isCollapsed ? 'md:justify-center md:px-2' : ''}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-sidebar-primary' : ''}`} />
                <span className={`truncate ${isCollapsed ? 'md:hidden' : 'inline'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-sidebar-border">
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

          {isCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="hidden md:flex w-full justify-center p-2.5 rounded-xl text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
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