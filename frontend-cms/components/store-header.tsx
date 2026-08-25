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
  theme,
}: {
  storeName: string;
  subdomain: string;
  logoUrl?: string | null;
  theme?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Announcement State
  const [announcement, setAnnouncement] = useState<{
    enabled: boolean;
    text: string;
    badge?: string;
    link?: string;
  } | null>(null);

  const lowerSub = (subdomain || '').toLowerCase();
  const isClothing =
    theme === 'clothing' ||
    lowerSub.includes('cloth') ||
    lowerSub.includes('fashion') ||
    lowerSub.includes('apparel');

  const isSports =
    !isClothing &&
    (theme === 'sports' ||
      lowerSub.includes('sport') ||
      lowerSub.includes('fitness'));

  const isBoutique =
    !isClothing &&
    !isSports &&
    (theme === 'boutique' ||
      lowerSub.includes('boutique') ||
      lowerSub.includes('luxury'));

  // Dynamic Theme Colors Map
  const themeStyles = isClothing
    ? {
        activeText: 'text-purple-600',
        activeBar: 'border-purple-600',
        hoverText: 'hover:text-purple-600',
        cartBadge: 'bg-purple-600 text-white',
        wishlistBadge: 'bg-purple-600 text-white',
        mobileActive: 'bg-purple-100 text-purple-800',
        searchBtn: 'border-purple-200 hover:border-purple-400 hover:text-purple-700',
        loginBtn: 'bg-purple-600 text-white hover:bg-purple-700',
      }
    : isSports
    ? {
        activeText: 'text-emerald-600',
        activeBar: 'border-emerald-600',
        hoverText: 'hover:text-emerald-600',
        cartBadge: 'bg-emerald-600 text-white',
        wishlistBadge: 'bg-emerald-600 text-white',
        mobileActive: 'bg-emerald-100 text-emerald-800',
        searchBtn: 'border-emerald-200 hover:border-emerald-400 hover:text-emerald-700',
        loginBtn: 'bg-emerald-600 text-white hover:bg-emerald-700',
      }
    : isBoutique
    ? {
        activeText: 'text-amber-500',
        activeBar: 'border-amber-500',
        hoverText: 'hover:text-amber-500',
        cartBadge: 'bg-amber-500 text-slate-950 font-black',
        wishlistBadge: 'bg-amber-500 text-slate-950 font-black',
        mobileActive: 'bg-accent text-foreground',
        searchBtn: 'border-border bg-card text-foreground hover:bg-accent',
        loginBtn: 'bg-amber-500 text-slate-950 font-bold hover:opacity-90',
      }
    : {
        // Electronics / Default
        activeText: 'text-sky-600',
        activeBar: 'border-sky-600',
        hoverText: 'hover:text-sky-600',
        cartBadge: 'bg-sky-600 text-white',
        wishlistBadge: 'bg-sky-600 text-white',
        mobileActive: 'bg-sky-100 text-sky-800',
        searchBtn: 'border-slate-200 hover:border-sky-400 hover:text-sky-700',
        loginBtn: 'bg-sky-600 text-white hover:bg-sky-700',
      };

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
          className={`w-full py-2 px-4 text-xs font-medium text-center flex items-center justify-center gap-2 border-b ${
            isBoutique
              ? 'bg-accent text-foreground border-border'
              : isSports
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200/80'
              : isClothing
              ? 'bg-purple-50 text-purple-900 border-purple-200/80'
              : 'bg-sky-50 text-sky-950 border-sky-200/80'
          }`}
        >
          {announcement.badge && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isBoutique
                  ? 'bg-amber-500 text-slate-950'
                  : isSports
                  ? 'bg-emerald-600 text-white'
                  : isClothing
                  ? 'bg-purple-600 text-white'
                  : 'bg-sky-600 text-white'
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
            : isSports
            ? 'bg-[#f4fbf7]/95 border-emerald-200/70 text-slate-900 shadow-xs'
            : isClothing
            ? 'bg-[#faf7fc]/95 border-purple-200/70 text-slate-900 shadow-xs'
            : 'bg-[#f8fafc]/95 border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          
          {/* 1. Brand / Logo */}
          <Link href={`/store/${subdomain}`} className="flex min-w-0 items-center gap-3 group">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-1 shadow-xs transition-transform group-hover:scale-105 ${
                isBoutique
                  ? 'border-border bg-card'
                  : isSports
                  ? 'border-emerald-200 bg-white'
                  : isClothing
                  ? 'border-purple-200 bg-white'
                  : 'border-slate-200 bg-white'
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
                    ? 'text-foreground group-hover:text-amber-500'
                    : isSports
                    ? 'text-slate-900 group-hover:text-emerald-600'
                    : isClothing
                    ? 'text-slate-900 group-hover:text-purple-600'
                    : 'text-slate-900 group-hover:text-sky-600'
                }`}
              >
                {storeName}
              </span>
              <span className={`text-[10px] tracking-widest font-semibold uppercase ${isBoutique ? 'text-amber-500/90' : isSports ? 'text-emerald-700/80' : isClothing ? 'text-purple-700/80' : 'text-slate-500'}`}>
                {isBoutique ? 'ATELIER PAKISTAN' : isSports ? 'PERFORMANCE HUB' : isClothing ? 'CURATED APPAREL' : 'PRECISION TECH'}
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
                      ? `${themeStyles.activeText} font-bold border-b-2 ${themeStyles.activeBar}`
                      : `text-slate-600 ${themeStyles.hoverText}`
                  }`}
                >
                  <span>{link.name}</span>
                  {typeof link.count === 'number' && link.count > 0 && (
                    <span
                      className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-xs transition-colors ${
                        link.name === 'Wishlist'
                          ? themeStyles.wishlistBadge
                          : themeStyles.cartBadge
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
                        ? 'bg-card text-foreground border-input placeholder:text-muted-foreground focus:ring-1 focus:ring-amber-500'
                        : isSports
                        ? 'bg-white text-slate-900 border-emerald-200 placeholder:text-slate-400 focus:border-emerald-500'
                        : isClothing
                        ? 'bg-white text-slate-900 border-purple-200 placeholder:text-slate-400 focus:border-purple-500'
                        : 'bg-white text-slate-900 border-slate-300 placeholder:text-slate-400 focus:border-sky-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className={`ml-1.5 text-xs ${isBoutique ? 'text-muted-foreground hover:text-foreground' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${themeStyles.searchBtn}`}
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
                    : 'border-slate-200 bg-white text-slate-700 hover:text-rose-600 hover:bg-rose-50 shadow-xs'
                }`}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href={`/login?redirect=${encodeURIComponent(currentReturnUrl)}`}
                onClick={() => sessionStorage.setItem('redirect_after_login', currentReturnUrl)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${themeStyles.loginBtn}`}
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
              className={`flex h-9 w-9 items-center justify-center rounded-lg border ${themeStyles.searchBtn}`}
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
                  : isSports
                  ? 'border-emerald-200 bg-white text-slate-800'
                  : isClothing
                  ? 'border-purple-200 bg-white text-slate-800'
                  : 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div
            className={`border-t px-4 py-4 md:hidden shadow-lg transition-colors duration-300 ${
              isBoutique
                ? 'bg-background border-border text-foreground'
                : isSports
                ? 'bg-[#f4fbf7] border-emerald-200/80 text-slate-900'
                : isClothing
                ? 'bg-[#faf7fc] border-purple-200/80 text-slate-900'
                : 'bg-[#f8fafc] border-slate-200 text-slate-900'
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
                        ? `${themeStyles.mobileActive} font-bold`
                        : isBoutique
                        ? 'text-foreground/80 hover:bg-accent'
                        : isSports
                        ? 'text-slate-700 hover:bg-emerald-50'
                        : isClothing
                        ? 'text-slate-700 hover:bg-purple-50'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{link.name}</span>
                    {typeof link.count === 'number' && link.count > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          link.name === 'Wishlist'
                            ? themeStyles.wishlistBadge
                            : themeStyles.cartBadge
                        }`}
                      >
                        {link.count}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className={`pt-3 border-t ${isBoutique ? 'border-border' : 'border-slate-200'}`}>
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left font-semibold text-rose-600 py-2 px-3 rounded-lg hover:bg-rose-50 transition-colors"
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
                    className={`block text-center w-full py-2.5 rounded-lg font-bold text-xs shadow-xs ${themeStyles.loginBtn}`}
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