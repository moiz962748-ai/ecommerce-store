'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StoreThemeToggle } from '@/components/store-theme-toggle';

export function StoreHeader({ storeName, subdomain }: { storeName: string; subdomain: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 border-b border-store-border bg-store-background/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href={`/store/${subdomain}`} className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-store-border bg-store-card text-lg text-store-accent">
            ⚡
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
          <Link href={`/store/${subdomain}/wishlist`} className="text-store-foreground hover:text-store-accent">
            Wishlist
          </Link>
          <Link href={`/store/${subdomain}/cart`} className="text-store-foreground hover:text-store-accent">
            Cart
          </Link>
          <Link href={`/store/${subdomain}/orders`} className="text-store-foreground hover:text-store-accent">
            Orders
          </Link>
          <Link href="/login" className="text-store-foreground hover:text-store-accent">Login</Link>
          <Link href={`/store/${subdomain}#about`} className="text-store-foreground hover:text-store-accent">About</Link>
          <Link href={`/store/${subdomain}#contact`} className="text-store-foreground hover:text-store-accent">Contact</Link>
        </nav>

        <div className="hidden md:block">
          <StoreThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <StoreThemeToggle />
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-store-border bg-store-card text-store-foreground"
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
              className="text-store-foreground hover:text-store-accent"
            >
              Wishlist
            </Link>
            <Link
              href={`/store/${subdomain}/cart`}
              onClick={() => setMenuOpen(false)}
              className="text-store-foreground hover:text-store-accent"
            >
              Cart
            </Link>
            <Link
              href={`/store/${subdomain}/orders`}
              onClick={() => setMenuOpen(false)}
              className="text-store-foreground hover:text-store-accent"
            >
              My Orders
            </Link>
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-store-foreground hover:text-store-accent">
              Login
            </Link>
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
          </nav>
        </div>
      )}
    </div>
  );
}