'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
  Layers,
} from 'lucide-react';

interface Store {
  id: string;
  name: string;
  templateConfig?: {
    theme?: string;
  };
}

interface Variant {
  id: string;
  productId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price: number;
  sku?: string | null;
  stock?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice?: number;
  price?: number;
  imageUrl?: string | null;
  category?: string;
  variants?: Variant[];
}

function getProductVisual(productName: string) {
  const lower = productName.toLowerCase();
  if (lower.includes('shawl') || lower.includes('velvet') || lower.includes('dupatta')) return '🧣';
  if (lower.includes('pret') || lower.includes('suit') || lower.includes('dress') || lower.includes('kurti')) return '👗';
  if (lower.includes('abaya') || lower.includes('pishwas') || lower.includes('couture') || lower.includes('silk')) return '✨';
  if (lower.includes('running') || lower.includes('shoe') || lower.includes('sneaker')) return '👟';
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('training')) return '🏋️';
  if (lower.includes('water') || lower.includes('bottle') || lower.includes('hydration')) return '💧';
  if (lower.includes('laptop') || lower.includes('computer')) return '💻';
  if (lower.includes('mouse')) return '🖱️';
  if (lower.includes('headphone') || lower.includes('earbud') || lower.includes('audio')) return '🎧';
  if (lower.includes('phone') || lower.includes('mobile')) return '📱';
  if (lower.includes('watch')) return '⌚';
  if (lower.includes('camera')) return '📷';
  if (lower.includes('speaker')) return '🔊';
  if (lower.includes('keyboard')) return '⌨️';
  if (lower.includes('shirt') || lower.includes('t-shirt')) return '👕';
  if (lower.includes('jacket') || lower.includes('coat')) return '🧥';
  if (lower.includes('jeans') || lower.includes('pants')) return '👖';
  return '✨';
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;
  const productId = (params.id || params.productId) as string;

  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const [wishlisting, setWishlisting] = useState(false);
  const [wishlistSuccess, setWishlistSuccess] = useState(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  const lowerSub = (subdomain || '').toLowerCase();
  const isBoutique =
    store?.templateConfig?.theme === 'boutique' ||
    lowerSub.includes('boutique') ||
    lowerSub.includes('luxury');

  const isSports =
    !isBoutique &&
    (store?.templateConfig?.theme === 'sports' ||
      lowerSub.includes('sport') ||
      lowerSub.includes('fitness'));

  const isClothing =
    !isBoutique &&
    (store?.templateConfig?.theme === 'clothing' ||
      lowerSub.includes('cloth') ||
      lowerSub.includes('fashion') ||
      lowerSub.includes('apparel'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundStore = await apiClient(`/public/stores/${subdomain}`);
        setStore(foundStore);

        // Fetch single product with associated variants
        let foundProduct: Product | null = null;
        try {
          foundProduct = await apiClient(`/products/${productId}`);
        } catch {
          const allProducts = await apiClient(`/public/products/store/${foundStore.id}`);
          foundProduct = Array.isArray(allProducts)
            ? allProducts.find((p: Product) => p.id === productId)
            : null;
        }

        if (!foundProduct) {
          setError('Product not found');
        } else {
          setProduct(foundProduct);
          if (foundProduct.variants && foundProduct.variants.length > 0) {
            setSelectedVariant(foundProduct.variants[0]);
          }
        }
      } catch {
        setError('Unable to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subdomain, productId]);

  const updateLocalStorageCart = () => {
    try {
      const storageKey = `cart_${subdomain}`;
      const existing = localStorage.getItem(storageKey);
      let cartItems = existing ? JSON.parse(existing) : [];
      const targetVariantId = selectedVariant?.id || null;
      const itemIndex = cartItems.findIndex(
        (item: any) =>
          item.productId === productId && item.productVariantId === targetVariantId
      );

      if (itemIndex > -1) {
        cartItems[itemIndex].quantity += 1;
      } else {
        cartItems.push({
          productId,
          productVariantId: targetVariantId,
          variantName: selectedVariant?.name || null,
          quantity: 1,
        });
      }

      localStorage.setItem(storageKey, JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      // Ignore local storage parse error
    }
  };

  const updateLocalStorageWishlist = () => {
    try {
      const storageKey = `wishlist_${subdomain}`;
      const existing = localStorage.getItem(storageKey);
      let wishlistItems = existing ? JSON.parse(existing) : [];

      if (!wishlistItems.includes(productId)) {
        wishlistItems.push(productId);
      }

      localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch {
      // Ignore local storage parse error
    }
  };

  const handleAddToCart = async () => {
    const token = getStoredToken();
    if (!token) {
      const returnUrl = `/store/${subdomain}/cart`;
      sessionStorage.setItem('redirect_after_login', returnUrl);
      window.location.assign(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setAdding(true);
    setAddedSuccess(false);
    setCartError(null);

    try {
      await apiClient('/cart', {
        method: 'POST',
        token,
        body: JSON.stringify({
          productId,
          productVariantId: selectedVariant?.id,
          quantity: 1,
        }),
      });

      updateLocalStorageCart();
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 5000);
    } catch (err: any) {
      setCartError(err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleAddToWishlist = async () => {
    const token = getStoredToken();
    if (!token) {
      const returnUrl = `/store/${subdomain}/wishlist`;
      sessionStorage.setItem('redirect_after_login', returnUrl);
      window.location.assign(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setWishlisting(true);
    setWishlistSuccess(false);
    setWishlistError(null);

    try {
      await apiClient('/wishlist', {
        method: 'POST',
        token,
        body: JSON.stringify({
          productId,
          productVariantId: selectedVariant?.id,
        }),
      });

      updateLocalStorageWishlist();
      setWishlistSuccess(true);
      setTimeout(() => setWishlistSuccess(false), 5000);
    } catch (err: any) {
      setWishlistError(err.message || 'Failed to add to wishlist');
    } finally {
      setWishlisting(false);
    }
  };

  if (loading) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center p-8 ${
          isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-xs ${
            isBoutique
              ? 'border-border bg-card text-foreground'
              : isSports
              ? 'border-emerald-200 bg-white text-emerald-800'
              : isClothing
              ? 'border-purple-200 bg-white text-purple-800'
              : 'border-slate-200 bg-white text-sky-800'
          }`}
        >
          <div
            className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
              isBoutique
                ? 'border-foreground'
                : isSports
                ? 'border-emerald-600'
                : isClothing
                ? 'border-purple-600'
                : 'border-sky-600'
            }`}
          />
          <span className="text-sm font-medium">Loading details...</span>
        </div>
      </main>
    );
  }

  if (error || !store || !product) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-center gap-4 p-8 ${
          isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
        }`}
      >
        <p className={`text-sm font-semibold ${isBoutique ? 'text-destructive' : 'text-rose-600'}`}>
          {error || 'Product not found'}
        </p>
        <Link
          href={`/store/${subdomain}/products`}
          className={`rounded-xl border px-5 py-2.5 text-xs font-bold transition-all shadow-xs ${
            isBoutique
              ? 'border-border bg-card text-foreground hover:bg-accent'
              : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
          }`}
        >
          Back to Products
        </Link>
      </main>
    );
  }

  const productEmoji = getProductVisual(product.name);

  // Active Display Info (Switched dynamically based on variant selection)
  const activeImage = selectedVariant?.imageUrl || product.imageUrl;
  const activePrice = selectedVariant?.price ?? product.price ?? product.basePrice ?? 0;
  const activeDescription = selectedVariant?.description || product.description;
  const activeSku = selectedVariant?.sku || `${product.id.slice(0, 8).toUpperCase()}`;
  const variantsList = product.variants || [];

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isBoutique ? 'bg-background text-foreground' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav
          className={`mb-8 flex items-center gap-2 text-xs sm:text-sm font-medium ${
            isBoutique ? 'text-muted-foreground' : 'text-slate-500'
          }`}
        >
          <Link
            href={`/store/${subdomain}`}
            className={`transition-colors ${
              isBoutique
                ? 'hover:text-foreground'
                : isSports
                ? 'hover:text-emerald-700'
                : isClothing
                ? 'hover:text-purple-700'
                : 'hover:text-sky-700'
            }`}
          >
            {isBoutique ? 'Atelier' : 'Home'}
          </Link>
          <span>/</span>
          <Link
            href={`/store/${subdomain}/products`}
            className={`transition-colors ${
              isBoutique
                ? 'hover:text-foreground'
                : isSports
                ? 'hover:text-emerald-700'
                : isClothing
                ? 'hover:text-purple-700'
                : 'hover:text-sky-700'
            }`}
          >
            Products
          </Link>
          <span>/</span>
          <span
            className={`font-bold truncate max-w-[200px] sm:max-w-xs ${
              isBoutique ? 'text-foreground' : 'text-slate-950'
            }`}
          >
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* LEFT: Image Gallery & Variant Photos */}
          <section
            className={`rounded-3xl border p-4 md:p-6 shadow-xs ${
              isBoutique
                ? 'border-border bg-card'
                : isSports
                ? 'border-emerald-200/80 bg-white'
                : isClothing
                ? 'border-purple-200/80 bg-white'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span
                className={`rounded-full border px-3 py-1 shadow-xs ${
                  isBoutique
                    ? 'border-border bg-accent text-foreground'
                    : isSports
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : isClothing
                    ? 'border-purple-200 bg-purple-50 text-purple-800'
                    : 'border-sky-200 bg-sky-50 text-sky-800'
                }`}
              >
                {selectedVariant ? `Variant: ${selectedVariant.name}` : isBoutique ? 'Pure Fabric Pret' : 'Authentic Gear'}
              </span>
              <span className={`font-semibold ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                Fast Dispatch
              </span>
            </div>

            {/* Main Preview Container */}
            <div
              className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 flex h-[340px] md:h-[420px] items-center justify-center transition-all duration-300 ${
                isBoutique
                  ? 'border-border bg-accent/30'
                  : isSports
                  ? 'border-emerald-100 bg-emerald-50/50'
                  : isClothing
                  ? 'border-purple-100 bg-purple-50/50'
                  : 'border-slate-100 bg-slate-50'
              }`}
            >
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={selectedVariant?.name || product.name}
                  className="h-full w-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <span className="text-[120px] md:text-[140px] drop-shadow-md transition-transform duration-300 hover:scale-110">
                  {productEmoji}
                </span>
              )}
            </div>

            {/* Variant / Thumbnail Gallery Strip */}
            {variantsList.length > 0 && (
              <div className="mt-4">
                <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                  Select Variant Image
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {/* Default Base Product Thumb */}
                  <div
                    onClick={() => setSelectedVariant(null)}
                    className={`flex h-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 transition-all ${
                      selectedVariant === null
                        ? isBoutique
                          ? 'border-foreground bg-accent shadow-sm'
                          : 'border-sky-600 bg-sky-50 shadow-sm'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt="Default" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl">{productEmoji}</span>
                    )}
                  </div>

                  {/* Variants Thumbs */}
                  {variantsList.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex h-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 transition-all ${
                          isSelected
                            ? isBoutique
                              ? 'border-foreground bg-accent shadow-sm'
                              : isSports
                              ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                              : isClothing
                              ? 'border-purple-600 bg-purple-50 shadow-sm'
                              : 'border-sky-600 bg-sky-50 shadow-sm'
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {v.imageUrl ? (
                          <img src={v.imageUrl} alt={v.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-center px-1 truncate">{v.name}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* RIGHT: Product Information, Variant Selectors & CTAs */}
          <section className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isBoutique
                      ? 'text-muted-foreground'
                      : isSports
                      ? 'text-emerald-700'
                      : isClothing
                      ? 'text-purple-700'
                      : 'text-sky-700'
                  }`}
                >
                  {store.name} Official
                </span>
                <span className={isBoutique ? 'text-border' : 'text-slate-300'}>•</span>
                <span className={`text-xs ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                  SKU: {activeSku}
                </span>
              </div>

              <h1
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${
                  isBoutique ? 'text-foreground' : 'text-slate-950'
                }`}
              >
                {product.name}
              </h1>
            </div>

            {/* Ratings Bar */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1 ${
                  isBoutique
                    ? 'text-foreground'
                    : isSports
                    ? 'text-emerald-600'
                    : isClothing
                    ? 'text-purple-600'
                    : 'text-sky-600'
                }`}
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-current" />
                ))}
              </div>
              <span className={`text-sm font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                4.9
              </span>
              <span className={`text-xs ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                (128 verified reviews)
              </span>
            </div>

            {/* Dynamic Price Box */}
            <div
              className={`rounded-2xl border p-5 shadow-xs ${
                isBoutique
                  ? 'border-border bg-card'
                  : isSports
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : isClothing
                  ? 'border-purple-200 bg-purple-50/50'
                  : 'border-slate-200 bg-sky-50/40'
              }`}
            >
              <span
                className={`text-[11px] uppercase tracking-widest font-bold block ${
                  isBoutique ? 'text-muted-foreground' : 'text-slate-500'
                }`}
              >
                Price (Inclusive of all taxes)
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <p
                  className={`text-3xl sm:text-4xl font-black ${
                    isBoutique
                      ? 'text-foreground'
                      : isSports
                      ? 'text-emerald-700'
                      : isClothing
                      ? 'text-purple-700'
                      : 'text-sky-700'
                  }`}
                >
                  Rs. {Number(activePrice).toLocaleString()}
                </p>
                <span className={`text-sm font-semibold line-through ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                  Rs. {(Number(activePrice) * 1.2).toLocaleString()}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${
                    isBoutique
                      ? 'bg-accent text-foreground border-border'
                      : isSports
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : isClothing
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : 'bg-sky-100 text-sky-800 border-sky-200'
                  }`}
                >
                  Save 20%
                </span>
              </div>
            </div>

            {/* VARIANT SELECTOR SWATCHES */}
            {variantsList.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isBoutique ? 'text-foreground' : 'text-slate-700'}`}>
                    <Layers size={14} /> Choose Option / Variant:
                  </span>
                  {selectedVariant && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {selectedVariant.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {variantsList.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shadow-xs ${
                          isSelected
                            ? isBoutique
                              ? 'border-foreground bg-primary text-primary-foreground shadow-sm scale-102'
                              : isSports
                              ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm scale-102'
                              : isClothing
                              ? 'border-purple-600 bg-purple-600 text-white shadow-sm scale-102'
                              : 'border-sky-600 bg-sky-600 text-white shadow-sm scale-102'
                            : isBoutique
                            ? 'border-border bg-card text-foreground hover:bg-accent'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                        }`}
                      >
                        {v.imageUrl && (
                          <img src={v.imageUrl} alt={v.name} className="w-5 h-5 rounded-md object-cover" />
                        )}
                        <span>{v.name}</span>
                        <span className="opacity-75 font-mono text-[11px]">(Rs. {Number(v.price).toLocaleString()})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="border-b pb-6 space-y-2">
              <span className={`text-xs font-bold uppercase tracking-wider block ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                Description
              </span>
              <p className={`text-sm leading-relaxed ${isBoutique ? 'text-foreground/90' : 'text-slate-600'}`}>
                {activeDescription}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Nationwide Delivery', desc: '48hr Express' },
                { icon: RotateCcw, label: 'Support & Help', desc: 'Direct Assistance' },
                { icon: ShieldCheck, label: '100% Authentic', desc: 'Verified Quality' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`rounded-2xl border p-3.5 text-center shadow-xs ${
                      isBoutique
                        ? 'border-border bg-card'
                        : isSports
                        ? 'border-emerald-100 bg-white'
                        : isClothing
                        ? 'border-purple-100 bg-white'
                        : 'border-slate-100 bg-white'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={`mx-auto mb-1.5 ${
                        isBoutique
                          ? 'text-foreground'
                          : isSports
                          ? 'text-emerald-600'
                          : isClothing
                          ? 'text-purple-600'
                          : 'text-sky-600'
                      }`}
                    />
                    <div className={`text-xs font-bold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={adding}
                className={`h-12 w-full rounded-xl font-bold text-sm transition-all sm:flex-1 shadow-sm ${
                  isBoutique
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : isSports
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
              >
                <ShoppingBag size={16} className="mr-2" />
                {adding
                  ? 'Adding...'
                  : selectedVariant
                  ? `Add ${selectedVariant.name} to Cart`
                  : isBoutique
                  ? 'Add to Bag'
                  : 'Add to Cart'}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToWishlist}
                disabled={wishlisting}
                className={`h-12 w-full rounded-xl border font-bold text-sm transition-all sm:flex-1 shadow-xs ${
                  isBoutique
                    ? 'border-border bg-card text-foreground hover:bg-accent'
                    : isSports
                    ? 'border-slate-200 bg-white text-slate-800 hover:bg-emerald-50 hover:border-emerald-300'
                    : isClothing
                    ? 'border-slate-200 bg-white text-slate-800 hover:bg-purple-50 hover:border-purple-300'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-sky-50 hover:border-sky-300'
                }`}
              >
                <Heart size={16} className="mr-2" />
                {wishlisting ? 'Saving...' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Feedback Alerts */}
            {addedSuccess && (
              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs sm:text-sm shadow-xs ${
                  isBoutique
                    ? 'border-border bg-card text-foreground'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                }`}
              >
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Item successfully added to cart!
                </span>
                <Link
                  href={`/store/${subdomain}/cart`}
                  className="font-bold underline hover:opacity-80 flex items-center gap-1"
                >
                  View Cart <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {wishlistSuccess && (
              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs sm:text-sm shadow-xs ${
                  isBoutique
                    ? 'border-border bg-card text-foreground'
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}
              >
                <span className="font-semibold flex items-center gap-1.5">
                  <Heart size={16} className="fill-current" /> Item saved to your wishlist!
                </span>
                <Link
                  href={`/store/${subdomain}/wishlist`}
                  className="font-bold underline hover:opacity-80 flex items-center gap-1"
                >
                  View Wishlist <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {cartError && <p className="text-xs font-semibold text-destructive">{cartError}</p>}
            {wishlistError && <p className="text-xs font-semibold text-destructive">{wishlistError}</p>}
          </section>
        </div>

        {/* Bottom Detailed Specifications Grid */}
        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <div
            className={`rounded-3xl border p-6 shadow-xs ${
              isBoutique ? 'border-border bg-card' : 'border-slate-200 bg-white'
            }`}
          >
            <h2
              className={`mb-4 text-xl font-bold flex items-center gap-2 ${
                isBoutique ? 'text-foreground' : 'text-slate-950'
              }`}
            >
              <Sparkles
                size={18}
                className={
                  isBoutique
                    ? 'text-foreground'
                    : isSports
                    ? 'text-emerald-600'
                    : isClothing
                    ? 'text-purple-600'
                    : 'text-sky-600'
                }
              />
              {isBoutique ? 'Fabric & Craft Details' : 'Product Specifications'}
            </h2>
            <ul
              className={`space-y-3 text-xs sm:text-sm ${
                isBoutique ? 'text-muted-foreground' : 'text-slate-600'
              }`}
            >
              <li
                className={`flex justify-between border-b pb-2.5 ${
                  isBoutique ? 'border-border' : 'border-slate-100'
                }`}
              >
                <span>Material / Grade</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                  100% Genuine Certified
                </span>
              </li>
              <li
                className={`flex justify-between border-b pb-2.5 ${
                  isBoutique ? 'border-border' : 'border-slate-100'
                }`}
              >
                <span>Build & Finish</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                  Precision Engineered
                </span>
              </li>
              <li
                className={`flex justify-between border-b pb-2.5 ${
                  isBoutique ? 'border-border' : 'border-slate-100'
                }`}
              >
                <span>Packaging</span>
                <span className={`font-semibold ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                  Official Branded Box
                </span>
              </li>
              <li className="flex justify-between pb-1">
                <span>Stock Status</span>
                <span
                  className={`font-bold ${
                    isBoutique ? 'text-foreground' : 'text-emerald-700'
                  }`}
                >
                  {selectedVariant?.stock && selectedVariant.stock > 0
                    ? `In Stock (${selectedVariant.stock} available)`
                    : 'In Stock & Ready to Dispatch'}
                </span>
              </li>
            </ul>
          </div>

          <div
            className={`rounded-3xl border p-6 shadow-xs ${
              isBoutique ? 'border-border bg-card' : 'border-slate-200 bg-white'
            }`}
          >
            <h2
              className={`mb-4 text-xl font-bold flex items-center gap-2 ${
                isBoutique ? 'text-foreground' : 'text-slate-950'
              }`}
            >
              <ShieldCheck
                size={18}
                className={
                  isBoutique
                    ? 'text-foreground'
                    : isSports
                    ? 'text-emerald-600'
                    : isClothing
                    ? 'text-purple-600'
                    : 'text-sky-600'
                }
              />
              Customer Guarantee
            </h2>
            <div className="space-y-3">
              <div
                className={`rounded-2xl border p-4 ${
                  isBoutique ? 'border-border bg-accent/30' : 'border-slate-100 bg-slate-50'
                }`}
              >
                <p
                  className={`font-bold text-xs sm:text-sm ${
                    isBoutique ? 'text-foreground' : 'text-slate-900'
                  }`}
                >
                  Guaranteed Authenticity
                </p>
                <p
                  className={`mt-1 text-xs ${
                    isBoutique ? 'text-muted-foreground' : 'text-slate-600'
                  }`}
                >
                  Every item passes stringent quality checks before leaving the warehouse.
                </p>
              </div>
              <div
                className={`rounded-2xl border p-4 ${
                  isBoutique ? 'border-border bg-accent/30' : 'border-slate-100 bg-slate-50'
                }`}
              >
                <p
                  className={`font-bold text-xs sm:text-sm ${
                    isBoutique ? 'text-foreground' : 'text-slate-900'
                  }`}
                >
                  Easy Exchange & Warranty Support
                </p>
                <p
                  className={`mt-1 text-xs ${
                    isBoutique ? 'text-muted-foreground' : 'text-slate-600'
                  }`}
                >
                  Reach out to our customer care team anytime for returns or replacement queries.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}