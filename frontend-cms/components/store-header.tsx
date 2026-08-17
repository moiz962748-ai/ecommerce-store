'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { getStoredToken, getStoredUser } from '@/lib/auth';

interface Store {
  id: string;
  name: string;
  logo?: string;
}

export function StoreHeader() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  
  const [storeName, setStoreName] = useState<string>('Store');
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [showWishlistBadge, setShowWishlistBadge] = useState<boolean>(false);
  const [showCartBadge, setShowCartBadge] = useState<boolean>(false);

  const user = getStoredUser();
  const token = getStoredToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch store name
        const store = await apiClient(`/public/stores/${subdomain}`);
        if (store?.name) {
          setStoreName(store.name);
        }
      } catch (error) {
        console.error('Failed to fetch store info:', error);
      }

      // Fetch wishlist count if authenticated
      if (token) {
        try {
          const wishlist = await apiClient(`/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const count = Array.isArray(wishlist) ? wishlist.length : 0;
          setWishlistCount(count);
          if (count > 0) {
            setShowWishlistBadge(true);
          }
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      }

      // Fetch cart count if authenticated
      if (token) {
        try {
          const cart = await apiClient(`/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const count = Array.isArray(cart) ? cart.length : cart?.items?.length || 0;
          setCartCount(count);
          if (count > 0) {
            setShowCartBadge(true);
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      }
    };

    fetchData();
  }, [subdomain, token]);

  return (
    <header className="border-b border-store-border px-6 py-4">
      <div className="flex items-center justify-between gap-8">
        {/* Left: Logo and Store Name */}
        <div className="flex items-center gap-3">
          <div className="rounded border border-store-border bg-store-card px-3 py-1.5 text-xs text-store-muted">
            Logo
          </div>
          <Link href={`/store/${subdomain}`}>
            <h1 className="store-heading text-lg font-bold text-store-foreground hover:text-store-accent transition-colors">
              {storeName}
            </h1>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="Search"
            className="bg-store-card border-store-border text-store-foreground placeholder:text-store-muted"
          />
        </div>

        {/* Right: Icons and Links */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link
            href={`/store/${subdomain}/wishlist`}
            className="relative text-store-foreground hover:text-store-accent transition-colors"
          >
            <Heart className="h-5 w-5" />
            {showWishlistBadge && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-store-accent text-xs font-semibold text-store-background">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href={`/store/${subdomain}/cart`}
            className="relative text-store-foreground hover:text-store-accent transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {showCartBadge && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-store-accent text-xs font-semibold text-store-background">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login / Account */}
          <Link
            href="/login"
            className="text-store-foreground hover:text-store-accent transition-colors text-sm"
          >
            {user ? user.fullName.split(' ')[0] || 'Account' : 'Login'}
          </Link>

          {/* About */}
          <a
            href="#"
            className="text-store-foreground hover:text-store-accent transition-colors text-sm"
          >
            About
          </a>

          {/* Contact */}
          <a
            href="#"
            className="text-store-foreground hover:text-store-accent transition-colors text-sm"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
