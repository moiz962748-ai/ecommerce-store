'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, LogIn, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { StoreThemeToggle } from '@/components/store-theme-toggle';

function getStoreLogo(subdomain: string) {
  const lower = (subdomain || '').toLowerCase();
  if (lower.includes('boutique') || lower.includes('luxury')) return '/clothing-logo.png';
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Announcement State
  const [announcement, setAnnouncement] = useState<{
    enabled: boolean;
    text: string;
    badge?: string;
    link?: string;
  } | null>(null);

  const lowerSub = (subdomain || '').toLowerCase();
  const isBoutique = lowerSub.includes('boutique') || lowerSub.includes('luxury');
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');

  // Sync Dark/Light Mode with Store Root
  useEffect(() => {
    const checkThemeMode = () => {
      const isDocDark = document.documentElement.classList.contains('dark');
      const rootStore = document.querySelector('[data-store-root="true"]');
      const storeMode = rootStore?.getAttribute('data-store-mode');

      if (storeMode) {
        setIsDarkMode(storeMode === 'dark');
      } else {
        setIsDarkMode(isDocDark || !document.documentElement.classList.contains('light'));
      }
    };

    checkThemeMode();
    const observer = new MutationObserver(checkThemeMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    const rootStore = document.querySelector('[data-store-root="true"]');
    if (rootStore) {
      observer.observe(rootStore, { attributes: true, attributeFilter: ['data-store-mode'] });
    }

    window.addEventListener('storage', checkThemeMode);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', checkThemeMode);
    };
  }, []);

  // Fetch Announcement Config
  useEffect(() => {
    if (!subdomain) return;
    async function fetchAnnouncement() {
      try {
        const store = await apiClient(`/public/stores/${subdomain}`);
        if (store?.templateConfig?.announcement) {
          setAnnouncement(store.templateConfig.announcement);
        }
      } catch {
        // Fallback default
      }
    }
    fetchAnnouncement();
  }, [subdomain]);

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
    <header className="sticky top-0 z-50 transition-colors duration-300">
      {/* 0. Dynamic Announcement Bar */}
      {announcement?.enabled && announcement.text && (
        <div
          className={`w-full py-2 px-4 text-xs font-medium transition-colors text-center flex items-center justify-center gap-2 border-b ${
            isBoutique
              ? 'bg-accent text-foreground border-border'
              : !isDarkMode
              ? isSports
                ? 'bg-emerald-100 text-emerald-950 border-emerald-200'
                : isClothing
                ? 'bg-purple-100 text-purple-950 border-purple-200'
                : 'bg-cyan-100 text-cyan-950 border-cyan-200'
              : isSports
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-900/60'
              : isClothing
              ? 'bg-purple-950/90 text-purple-200 border-purple-900/60'
              : 'bg-cyan-950/90 text-cyan-200 border-cyan-900/60'
          }`}
        >
          {announcement.badge && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isBoutique
                  ? 'bg-primary text-primary-foreground'
                  : isSports
                  ? 'bg-emerald-500 text-slate-950'
                  : isClothing
                  ? 'bg-purple-500 text-white'
                  : 'bg-cyan-400 text-slate-950'
              }`}
            >
              {announcement.badge}
            </span>
          )}
          <span>{announcement.text}</span>
          {announcement.link && (
            <Link
              href={announcement.link}
              className="inline-flex items-center gap-0.5 underline font-bold hover:opacity-80 transition-opacity ml-1"
            >
              <span>Explore</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <div
        className={`border-b backdrop-blur-md transition-colors duration-300 ${
          isBoutique
            ? 'bg-background/95 border-border text-foreground shadow-xs'
            : !isDarkMode
            ? isSports
              ? 'bg-white/95 border-emerald-100 text-slate-900 shadow-sm'
              : isClothing
              ? 'bg-white/95 border-purple-100 text-slate-900 shadow-sm'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
            : isSports
            ? 'bg-[#020d09]/95 border-emerald-950/80 text-emerald-50'
            : isClothing
            ? 'bg-[#0b0314]/95 border-purple-950/80 text-purple-50'
            : 'bg-slate-950/95 border-slate-900 text-slate-100'
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          
          {/* 1. Brand / Logo */}
          <Link href={`/store/${subdomain}`} className="flex min-w-0 items-center gap-3 group">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-1 shadow-xs transition-transform group-hover:scale-105 ${
                isBoutique
                  ? 'border-border bg-card'
                  : !isDarkMode
                  ? isSports
                    ? 'border-emerald-500/40 bg-emerald-50'
                    : isClothing
                    ? 'border-purple-500/40 bg-purple-50'
                    : 'border-cyan-500/40 bg-cyan-50'
                  : isSports
                  ? 'border-emerald-500/40 bg-slate-900'
                  : isClothing
                  ? 'border-purple-500/40 bg-slate-900'
                  : 'border-cyan-500/40 bg-slate-900'
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
                className={`font-bold text-lg tracking-tight transition-colors ${
                  isBoutique
                    ? 'text-foreground group-hover:opacity-80'
                    : !isDarkMode
                    ? isSports
                      ? 'text-slate-900 group-hover:text-emerald-600'
                      : isClothing
                      ? 'text-slate-900 group-hover:text-purple-600'
                      : 'text-slate-900 group-hover:text-cyan-600'
                    : isSports
                    ? 'text-white group-hover:text-emerald-400'
                    : isClothing
                    ? 'text-white group-hover:text-purple-300'
                    : 'text-white group-hover:text-cyan-300'
                }`}
              >
                {storeName}
              </span>
              <span className={`text-[10px] tracking-widest font-semibold uppercase ${isBoutique ? 'text-muted-foreground' : !isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                ATELIER PAKISTAN
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
                      ? isBoutique
                        ? 'text-foreground font-bold border-b-2 border-foreground'
                        : isSports
                        ? 'text-emerald-400 font-bold border-b-2 border-emerald-400'
                        : isClothing
                        ? 'text-purple-400 font-bold border-b-2 border-purple-400'
                        : 'text-cyan-400 font-bold border-b-2 border-cyan-400'
                      : isBoutique
                      ? 'text-muted-foreground hover:text-foreground'
                      : !isDarkMode
                      ? isSports
                        ? 'text-slate-600 hover:text-emerald-600'
                        : isClothing
                        ? 'text-slate-600 hover:text-purple-600'
                        : 'text-slate-600 hover:text-cyan-600'
                      : isSports
                      ? 'text-slate-300 hover:text-emerald-400'
                      : isClothing
                      ? 'text-slate-300 hover:text-purple-300'
                      : 'text-slate-300 hover:text-cyan-400'
                  }`}
                >
                  <span>{link.name}</span>
                  {typeof link.count === 'number' && link.count > 0 && (
                    <span
                      className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-xs ${
                        link.name === 'Wishlist'
                          ? 'bg-rose-500 text-white'
                          : isBoutique
                          ? 'bg-primary text-primary-foreground'
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
                    placeholder="Search collections..."
                    className={`h-9 w-44 rounded-lg border px-3 text-xs focus:outline-none transition-all ${
                      isBoutique
                        ? 'bg-card text-foreground border-input placeholder:text-muted-foreground focus:ring-1 focus:ring-ring'
                        : !isDarkMode
                        ? 'bg-slate-100 text-slate-900 border-slate-300 placeholder:text-slate-400'
                        : 'bg-slate-900 text-white border-slate-800 placeholder:text-slate-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className={`ml-1.5 text-xs ${isBoutique ? 'text-muted-foreground hover:text-foreground' : !isDarkMode ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`}
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
                    isBoutique
                      ? 'border-border bg-card text-foreground hover:bg-accent shadow-xs'
                      : !isDarkMode
                      ? 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900'
                      : isSports
                      ? 'border-emerald-950/80 bg-slate-900/80 text-slate-300 hover:border-emerald-500/60'
                      : isClothing
                      ? 'border-purple-950/80 bg-slate-900/80 text-slate-300 hover:border-purple-500/60'
                      : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-cyan-500/60'
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
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                  isBoutique
                    ? 'border-border bg-card text-foreground hover:text-destructive hover:bg-destructive/10 shadow-xs'
                    : !isDarkMode
                    ? 'border-slate-200 bg-slate-100 text-slate-700 hover:text-rose-600'
                    : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-rose-400'
                }`}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href={`/login?redirect=${encodeURIComponent(currentReturnUrl)}`}
                onClick={() => sessionStorage.setItem('redirect_after_login', currentReturnUrl)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  isBoutique
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : isSports
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-500'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
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
              className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                isBoutique
                  ? 'border-border bg-card text-foreground shadow-xs'
                  : !isDarkMode
                  ? 'border-slate-200 bg-slate-100 text-slate-700'
                  : 'border-slate-800 bg-slate-900 text-slate-300'
              }`}
            >
              <Search size={16} />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                isBoutique
                  ? 'border-border bg-card text-foreground shadow-xs'
                  : !isDarkMode
                  ? 'border-slate-200 bg-slate-100 text-slate-800'
                  : 'border-slate-800 bg-slate-900 text-slate-200'
              }`}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div
            className={`border-t px-4 py-4 md:hidden shadow-xl transition-colors duration-300 ${
              isBoutique
                ? 'bg-background border-border text-foreground'
                : !isDarkMode
                ? 'bg-white/98 border-slate-200 text-slate-900'
                : isSports
                ? 'bg-[#020d09]/98 border-emerald-950/80 text-emerald-50'
                : isClothing
                ? 'bg-[#0b0314]/98 border-purple-950/80 text-purple-50'
                : 'bg-slate-950/98 border-slate-900 text-slate-100'
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
                        ? isBoutique
                          ? 'bg-accent text-foreground font-bold'
                          : isSports
                          ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                          : isClothing
                          ? 'bg-purple-500/10 text-purple-300 font-bold'
                          : 'bg-cyan-500/10 text-cyan-400 font-bold'
                        : isBoutique
                        ? 'text-foreground/80 hover:bg-accent'
                        : !isDarkMode
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <span>{link.name}</span>
                    {typeof link.count === 'number' && link.count > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          link.name === 'Wishlist'
                            ? 'bg-rose-500 text-white'
                            : isBoutique
                            ? 'bg-primary text-primary-foreground'
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

              <div className={`pt-3 border-t ${isBoutique ? 'border-border' : !isDarkMode ? 'border-slate-200' : 'border-slate-800'}`}>
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left font-semibold text-rose-500 py-2 px-3 rounded-lg hover:bg-rose-500/10 transition-colors"
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
                    className={`block text-center w-full py-2.5 rounded-lg font-bold text-xs shadow-xs ${
                      isBoutique
                        ? 'bg-primary text-primary-foreground'
                        : isSports
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
      </div>
    </header>
  );
}