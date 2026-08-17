'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { StoreThemeToggle } from '@/components/store-theme-toggle';

function getStoreLogo(subdomain: string) {
  const lower = (subdomain || '').toLowerCase();
  if (lower.includes('sport') || lower.includes('fitness')) {
    return '/sports-logo.png';
  }
  if (lower.includes('cloth') || lower.includes('fashion') || lower.includes('apparel')) {
    return '/clothing-logo.png';
  }
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Sync cart & wishlist counts from localStorage
  const syncCounts = useCallback(() => {
    try {
      const rawCart =
        localStorage.getItem(`cart_${subdomain}`) ||
        localStorage.getItem('store_cart') ||
        localStorage.getItem('cart');

      const rawWishlist =
        localStorage.getItem(`wishlist_${subdomain}`) ||
        localStorage.getItem('store_wishlist') ||
        localStorage.getItem('wishlist');

      if (rawCart) {
        const parsed = JSON.parse(rawCart);
        if (Array.isArray(parsed)) {
          const totalQty = parsed.reduce(
            (acc: number, item: any) => acc + (Number(item.quantity) || 1),
            0,
          );
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }

      if (rawWishlist) {
        const parsed = JSON.parse(rawWishlist);
        setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
      } else {
        setWishlistCount(0);
      }
    } catch {
      setCartCount(0);
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

  const activeLogo = logoUrl || getStoreLogo(subdomain);

  return (
    <div className="sticky top-0 z-50 border-b border-store-border bg-store-background/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
        {/* Brand / Logo */}
        <Link href={`/store/${subdomain}`} className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-store-border bg-white p-1 shadow-sm">
            <img
              src={activeLogo}
              alt={storeName}
              className="h-full w-full object-contain"
            />
          </div>
          <p className="truncate text-lg font-bold text-store-foreground store-heading">{storeName}</p>
        </Link>

        {/* Search — desktop only */}
        <div className="hidden min-w-[200px] flex-1 items-center gap-2 rounded-full border border-store-border bg-store-card px-3 py-2 md:flex md:max-w-xs">
          <span className="text-store-muted">⌕</span>
          <input
            aria-label="Search products"
            placeholder="Search"
            className="w-full bg-transparent text-sm text-store-foreground placeholder:text-store-muted outline-none"
          />
        </div>

        {/* Nav — desktop only */}
        <nav className="hidden items-center gap-5 text-sm md:flex">
          <Link
            href={`/store/${subdomain}/wishlist`}
            className="relative text-store-foreground hover:text-store-accent flex items-center gap-1.5"
          >
            Wishlist
            {wishlistCount > 0 && (
              <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href={`/store/${subdomain}/cart`}
            className="relative text-store-foreground hover:text-store-accent flex items-center gap-1.5"
          >
            Cart
            {cartCount > 0 && (
              <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href={`/store/${subdomain}/orders`} className="text-store-foreground hover:text-store-accent">
            Orders
          </Link>
          <Link href="/login" className="text-store-foreground hover:text-store-accent">
            Login
          </Link>
          <Link href={`/store/${subdomain}#about`} className="text-store-foreground hover:text-store-accent">
            About
          </Link>
          <Link href={`/store/${subdomain}#contact`} className="text-store-foreground hover:text-store-accent">
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <StoreThemeToggle />
        </div>

        {/* Mobile: Quick Cart Icon + Theme Toggle + Hamburger */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Link
            href={`/store/${subdomain}/cart`}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-store-border bg-store-card text-store-foreground text-sm"
            aria-label="View Cart"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <StoreThemeToggle />

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-store-border bg-store-card text-store-foreground font-bold"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="border-t border-store-border bg-store-background px-4 py-4 md:hidden">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-store-border bg-store-card px-3 py-2">
            <span className="text-store-muted">⌕</span>
            <input
              aria-label="Search products"
              placeholder="Search"
              className="w-full bg-transparent text-sm text-store-foreground placeholder:text-store-muted outline-none"
            />
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            <Link
              href={`/store/${subdomain}/wishlist`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-store-foreground hover:text-store-accent py-1"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href={`/store/${subdomain}/cart`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-store-foreground hover:text-store-accent py-1"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href={`/store/${subdomain}/orders`}
              onClick={() => setMenuOpen(false)}
              className="text-store-foreground hover:text-store-accent py-1"
            >
              My Orders
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-store-foreground hover:text-store-accent py-1"
            >
              Login
            </Link>
            <Link
              href={`/store/${subdomain}#about`}
              onClick={() => setMenuOpen(false)}
              className="text-store-foreground hover:text-store-accent py-1"
            >
              About
            </Link>
            <Link
              href={`/store/${subdomain}#contact`}
              onClick={() => setMenuOpen(false)}
              className="text-store-foreground hover:text-store-accent py-1"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}