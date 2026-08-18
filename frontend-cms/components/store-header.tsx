'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync actual count from backend if logged in, else from unique local store key
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
      // Unauthenticated local cart
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

  const handleCartNavigation = () => {
    const token = localStorage.getItem('accessToken');
    const targetCartUrl = `/store/${subdomain}/cart`;

    if (!token) {
      sessionStorage.setItem('redirect_after_login', targetCartUrl);
      window.location.assign(`/login?redirect=${encodeURIComponent(targetCartUrl)}`);
      return;
    }
    window.location.assign(targetCartUrl);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCartCount(0);
    window.dispatchEvent(new Event('storage'));
    window.location.assign(`/store/${subdomain}`);
  };

  return (
    <div className="sticky top-0 z-50 border-b border-store-border bg-store-background/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href={`/store/${subdomain}`} className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-store-border bg-white p-1 shadow-sm">
            <img src={logoUrl || getStoreLogo(subdomain)} alt={storeName} className="h-full w-full object-contain" />
          </div>
          <p className="truncate text-lg font-bold text-store-foreground store-heading">{storeName}</p>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 text-sm md:flex">
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout} className="text-store-foreground hover:text-red-500 font-medium">
              Logout
            </button>
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(currentReturnUrl)}`}
              onClick={() => sessionStorage.setItem('redirect_after_login', currentReturnUrl)}
              className="text-store-foreground hover:text-store-accent font-medium"
            >
              Login
            </Link>
          )}

          <Link href={`/store/${subdomain}#about`} className="text-store-foreground hover:text-store-accent">
            About
          </Link>
          <Link href={`/store/${subdomain}#contact`} className="text-store-foreground hover:text-store-accent">
            Contact
          </Link>
          <Link href={`/store/${subdomain}/orders`} className="text-store-foreground hover:text-store-accent">
            Orders
          </Link>
          <Link href={`/store/${subdomain}/wishlist`} className="relative text-store-foreground hover:text-store-accent flex items-center gap-1.5">
            Wishlist
            {wishlistCount > 0 && (
              <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Desktop Cart Button */}
          <button
            type="button"
            onClick={handleCartNavigation}
            className="relative text-store-foreground hover:text-store-accent flex items-center gap-1.5 cursor-pointer font-medium"
          >
            Cart
            {cartCount > 0 && (
              <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </nav>

        <div className="hidden md:block">
          <StoreThemeToggle />
        </div>

        {/* Mobile Nav */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={handleCartNavigation}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-store-border bg-store-card text-store-foreground text-sm"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <StoreThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-store-border bg-store-card text-store-foreground font-bold"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="border-t border-store-border bg-store-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-left font-medium text-red-500"
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
                className="font-medium text-store-foreground hover:text-store-accent"
              >
                Login
              </Link>
            )}
            <Link
              href={`/store/${subdomain}#about`}
              onClick={() => setMenuOpen(false)}
              className="text-store-foreground hover:text-store-accent"
            >
              About
            </Link>
            <Link
              href={`/store/${subdomain}#contact`}
              onClick={() => setMenuOpen(false)}
              className="text-store-foreground hover:text-store-accent"
            >
              Contact
            </Link>
            <Link
              href={`/store/${subdomain}/orders`}
              onClick={() => setMenuOpen(false)}
              className="text-store-foreground hover:text-store-accent"
            >
              Orders
            </Link>
            <Link
              href={`/store/${subdomain}/wishlist`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-store-foreground hover:text-store-accent"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleCartNavigation();
              }}
              className="flex items-center justify-between text-left font-medium text-store-foreground hover:text-store-accent"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}