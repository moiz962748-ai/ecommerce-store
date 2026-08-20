'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, LogIn, LogOut, Menu, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { StoreThemeToggle } from '@/components/store-theme-toggle';

function getStoreLogo(subdomain: string) {
  const lower = (subdomain || '').toLowerCase();
  if (lower.includes('sport') || lower.includes('fitness')) return '/sports-logo.png';
  if (lower.includes('cloth') || lower.includes('fashion') || lower.includes('apparel')) return '/clothing-logo.png';
  return '/electronics-logo.png';
}

export function StoreHeader({
  storeName,
  subdomain,
  logoUrl,
}: {
  storeName: string;
  subdomain: string;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const lowerSub = (subdomain || '').toLowerCase();
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');

  // Sync Cart & Wishlist counts
  const syncCounts = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const data = await apiClient('/cart', { token });
        if (Array.isArray(data)) {
          const total = data.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0);
          setCartCount(total);
        }
      } catch {
        setCartCount(0);
      }
    } else {
      try {
        const rawCart = localStorage.getItem(`cart_${subdomain}`);
        if (rawCart) {
          const parsed = JSON.parse(rawCart);
          const total = Array.isArray(parsed)
            ? parsed.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0)
            : 0;
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    }

    try {
      const rawWish = localStorage.getItem(`wishlist_${subdomain}`);
      setWishlistCount(rawWish ? JSON.parse(rawWish).length : 0);
    } catch {
      setWishlistCount(0);
    }
  }, [subdomain]);

  useEffect(() => {
    syncCounts();
    window.addEventListener('storage', syncCounts);
    window.addEventListener('cart-updated', syncCounts);
    window.addEventListener('wishlist-updated', syncCounts);

    return () => {
      window.removeEventListener('storage', syncCounts);
      window.removeEventListener('cart-updated', syncCounts);
      window.removeEventListener('wishlist-updated', syncCounts);
    };
  }, [syncCounts]);

  const currentReturnUrl = pathname || `/store/${subdomain}`;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCartCount(0);
    window.dispatchEvent(new Event('storage'));
    window.location.assign(`/store/${subdomain}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/store/${subdomain}/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: `/store/${subdomain}` },
    { name: 'Products', href: `/store/${subdomain}/products` },
    { name: 'Cart', href: `/store/${subdomain}/cart`, count: cartCount },
    { name: 'Wishlist', href: `/store/${subdomain}/wishlist`, count: wishlistCount },
    { name: 'About', href: `/store/${subdomain}/about` },
    { name: 'Contact', href: `/store/${subdomain}/contact` },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        isSports
          ? 'bg-white/95 border-emerald-100 text-slate-900 dark:bg-[#020d09]/95 dark:border-emerald-950/80 dark:text-emerald-50'
          : isClothing
          ? 'bg-white/95 border-purple-100 text-slate-900 dark:bg-[#0b0314]/95 dark:border-purple-950/80 dark:text-purple-50'
          : 'bg-white/95 border-slate-200 text-slate-900 dark:bg-slate-950/95 dark:border-slate-900 dark:text-slate-100'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* 1. Brand / Logo */}
        <Link href={`/store/${subdomain}`} className="flex min-w-0 items-center gap-3 group">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-1 shadow-sm transition-transform group-hover:scale-105 ${
              isSports
                ? 'border-emerald-500/40 bg-emerald-50 dark:bg-slate-900'
                : isClothing
                ? 'border-purple-500/40 bg-purple-50 dark:bg-slate-900'
                : 'border-cyan-500/40 bg-cyan-50 dark:bg-slate-900'
            }`}
          >
            <img
              src={logoUrl || getStoreLogo(subdomain)}
              alt={storeName}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className={`font-bold text-lg tracking-tight text-slate-900 dark:text-white transition-colors ${
                isSports
                  ? 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400'
                  : isClothing
                  ? 'group-hover:text-purple-600 dark:group-hover:text-purple-300'
                  : 'group-hover:text-cyan-600 dark:group-hover:text-cyan-300'
              }`}
            >
              {storeName}
            </span>
            <span className="text-[10px] tracking-widest text-slate-500 dark:text-slate-400 font-semibold uppercase">
              PAKISTAN
            </span>
          </div>
        </Link>

        {/* 2. Main Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? isSports
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-500'
                      : isClothing
                      ? 'text-purple-600 dark:text-purple-300 font-bold border-b-2 border-purple-500'
                      : 'text-cyan-600 dark:text-cyan-400 font-bold border-b-2 border-cyan-500'
                    : isSports
                    ? 'text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400'
                    : isClothing
                    ? 'text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-300'
                    : 'text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400'
                }`}
              >
                <span>{link.name}</span>
                {typeof link.count === 'number' && link.count > 0 && (
                  <span
                    className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-sm ${
                      link.name === 'Wishlist'
                        ? 'bg-rose-500 text-white'
                        : isSports
                        ? 'bg-emerald-500 text-slate-950'
                        : isClothing
                        ? 'bg-purple-600 text-white'
                        : 'bg-cyan-500 text-slate-950'
                    }`}
                  >
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Search */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className={`h-9 w-44 rounded-lg border bg-slate-100 text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 px-3 text-xs dark:text-white dark:placeholder:text-slate-500 focus:outline-none transition-all ${
                    isSports
                      ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : isClothing
                      ? 'border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                  isSports
                    ? 'border-slate-200 bg-slate-100 text-slate-700 hover:border-emerald-500/60 hover:text-emerald-600 dark:border-emerald-950/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-emerald-300'
                    : isClothing
                    ? 'border-slate-200 bg-slate-100 text-slate-700 hover:border-purple-500/60 hover:text-purple-600 dark:border-purple-950/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-purple-300'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:border-cyan-500/60 hover:text-cyan-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-cyan-300'
                }`}
              >
                <Search size={16} />
              </button>
            )}
          </div>

          <StoreThemeToggle subdomain={subdomain} />

          {/* Auth Button */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:text-rose-600 hover:border-rose-300 dark:border-slate-800 dark:bg-slate-900/80 text-xs font-bold dark:text-slate-300 dark:hover:text-rose-400 dark:hover:border-rose-500/40 transition-all"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(currentReturnUrl)}`}
              onClick={() => sessionStorage.setItem('redirect_after_login', currentReturnUrl)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
                isSports
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                  : isClothing
                  ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
              }`}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* 4. Mobile Controls */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <StoreThemeToggle subdomain={subdomain} />

          <button
            type="button"
            onClick={() => router.push(`/store/${subdomain}/products`)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Search size={16} />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className={`border-t px-4 py-4 md:hidden backdrop-blur-xl shadow-xl transition-colors duration-300 ${
            isSports
              ? 'bg-white/98 border-emerald-100 dark:border-emerald-950/80 dark:bg-[#020d09]/98'
              : isClothing
              ? 'bg-white/98 border-purple-100 dark:border-purple-950/80 dark:bg-[#0b0314]/98'
              : 'bg-white/98 border-slate-200 dark:border-slate-900 dark:bg-slate-950/98'
          }`}
        >
          <div className="flex flex-col gap-2.5 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? isSports
                        ? 'bg-emerald-50 text-emerald-700 font-bold dark:bg-emerald-950/50 dark:text-emerald-400'
                        : isClothing
                        ? 'bg-purple-50 text-purple-700 font-bold dark:bg-purple-950/50 dark:text-purple-300'
                        : 'bg-cyan-50 text-cyan-700 font-bold dark:bg-cyan-950/50 dark:text-cyan-400'
                      : isSports
                      ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60 dark:hover:text-emerald-400'
                      : isClothing
                      ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60 dark:hover:text-purple-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60 dark:hover:text-cyan-300'
                  }`}
                >
                  <span>{link.name}</span>
                  {typeof link.count === 'number' && link.count > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        link.name === 'Wishlist'
                          ? 'bg-rose-500 text-white'
                          : isSports
                          ? 'bg-emerald-500 text-slate-950'
                          : isClothing
                          ? 'bg-purple-600 text-white'
                          : 'bg-cyan-500 text-slate-950'
                      }`}
                    >
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left font-semibold text-rose-600 dark:text-rose-400 py-2 px-3 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(currentReturnUrl)}`}
                  onClick={() => {
                    setMenuOpen(false);
                    sessionStorage.setItem('redirect_after_login', currentReturnUrl);
                  }}
                  className={`block text-center w-full py-2.5 rounded-lg font-bold text-xs shadow-md ${
                    isSports
                      ? 'bg-emerald-500 text-slate-950'
                      : isClothing
                      ? 'bg-purple-600 text-white'
                      : 'bg-cyan-500 text-slate-950'
                  }`}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}