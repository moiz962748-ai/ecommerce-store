'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { StoreReviews } from '@/components/store-reviews';

interface Store {
  id: string;
  name: string;
  subDomain: string;
  logoUrl: string | null;
  templateConfig?: {
    theme?: string;
  };
}

interface Product {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  imageUrl?: string | null;
}

export default function StoreHomePage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const found = await apiClient(`/public/stores/${subdomain}`);
        setStore(found);

        try {
          const productsData = await apiClient(`/public/products/store/${found.id}`);
          setProducts(productsData.slice(0, 4));
        } catch {
          setProducts([]);
        }
      } catch {
        setError('Store not found');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [subdomain]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-store-background text-store-foreground">
        <p className="text-store-muted">Loading...</p>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-store-background text-store-foreground">
        <p className="text-red-500">{error || 'Store not found'}</p>
      </main>
    );
  }

  const isClothingStore =
    store?.templateConfig?.theme === 'clothing' ||
    subdomain.toLowerCase().includes('cloth') ||
    subdomain.toLowerCase().includes('fashion');

  const isSportsStore =
    store?.templateConfig?.theme === 'sports' ||
    subdomain.toLowerCase().includes('sport') ||
    subdomain.toLowerCase().includes('fitness');

  const showcaseProducts =
    products.length > 0
      ? products.slice(0, 3)
      : isSportsStore
      ? [
          { id: 'mock-1', name: 'Trail Running Shoes', basePrice: 7999, description: 'Lightweight grip and comfort for every mile' },
          { id: 'mock-2', name: 'Performance Gym Set', basePrice: 6599, description: 'Built for mobility, strength, and everyday training' },
          { id: 'mock-3', name: 'Training Water Bottle', basePrice: 2999, description: 'Hydration essential for workouts and active routines' },
        ]
      : isClothingStore
      ? [
          { id: 'mock-1', name: 'Tailored Wool Blazer', basePrice: 8999, description: 'Sharp layering essential for polished everyday looks' },
          { id: 'mock-2', name: 'Classic Leather Sneakers', basePrice: 5999, description: 'Minimal everyday comfort for both casual and elevated outfits' },
          { id: 'mock-3', name: 'Silk Printed Dress', basePrice: 10999, description: 'A versatile statement piece for brunches, evenings, and travel' },
        ]
      : [
          { id: 'mock-1', name: 'Slim Bezel Laptop', basePrice: 89999, description: 'Lightweight performance laptop' },
          { id: 'mock-2', name: 'Gaming Mouse', basePrice: 4999, description: 'Ultra-responsive precision mouse' },
          { id: 'mock-3', name: 'Wireless Headphones', basePrice: 12999, description: 'Immersive sound for daily use' },
        ];

  const storefrontCopy = isSportsStore
    ? {
        badge: 'Fuel your performance',
        heroTitle: `Welcome to ${store.name}`,
        button: 'Shop Gear',
        aboutTitle: 'About the Brand',
        aboutText:
          'From performance essentials to everyday training gear, we design products that help athletes move stronger, move faster, and stay motivated through every session.',
        features: ['Performance Fit', 'Built to Move', 'Everyday Energy'],
        featureIcons: ['🏃', '⚡', '🔥'],
        whyChoose:
          'We focus on active lifestyles, dependable performance, and gear that keeps up with real routines. Whether you are training, recovering, or heading outdoors, our collection is built to support momentum, resilience, and confidence in every movement.',
        steps: [
          { title: 'Step 1', text: 'Explore your training essentials', icon: '🏋️' },
          { title: 'Step 2', text: 'Choose performance-ready gear', icon: '🧢' },
          { title: 'Step 3', text: 'Train harder and recover faster', icon: '💪' },
        ],
        footerText: 'Performance-driven essentials built for movement, endurance, and everyday athletic life.',
      }
    : isClothingStore
    ? {
        badge: 'Curated wardrobe essentials',
        heroTitle: `Welcome to ${store.name}`,
        button: 'Shop Collection',
        aboutTitle: 'About the Brand',
        aboutText:
          'Discover elevated essentials, premium fabrics, and timeless silhouettes designed to move effortlessly from day to night.',
        features: ['Premium Fabric', 'Easy Styling', 'Everyday Comfort'],
        featureIcons: ['🧵', '👗', '✨'],
        whyChoose:
          'We bring together refined design, comfortable materials, and trend-led styling to help every customer build a wardrobe that feels personal, polished, and easy to wear. From everyday basics to statement pieces, our collection is curated for modern living, effortless confidence, and lasting versatility.',
        steps: [
          { title: 'Step 1', text: 'Browse the latest looks', icon: '👀' },
          { title: 'Step 2', text: 'Choose your perfect fit', icon: '🛍️' },
          { title: 'Step 3', text: 'Style it with confidence', icon: '✨' },
        ],
        footerText: 'Fashion-forward essentials, timeless silhouettes, and premium comfort for your everyday wardrobe.',
      }
    : {
        badge: 'Smart tech essentials',
        heroTitle: `Welcome to ${store.name}`,
        button: 'Shop Now',
        aboutTitle: 'About Store',
        aboutText:
          'Discover premium technology and everyday essentials designed for faster workflows, smarter living, and a seamless shopping experience.',
        features: ['Fast Service', 'Easy Shopping', 'Low Cost'],
        featureIcons: ['⚡', '🛒', '💸'],
        whyChoose:
          'We combine trusted electronics, curated product recommendations, and reliable after-sales support to make every purchase simple, secure, and satisfying. Our platform is designed to help customers discover the right devices faster, compare quality options with confidence, and enjoy a seamless buying journey from start to finish. With dependable service, competitive pricing, and a focus on customer trust, we make technology shopping easier and more enjoyable for everyone.',
        steps: [
          { title: 'Step 1', text: 'Browse and choose your product', icon: '👤' },
          { title: 'Step 2', text: 'Add to cart and complete checkout', icon: '💳' },
          { title: 'Step 3', text: 'Track your order and get fast delivery', icon: '🚚' },
        ],
        footerText: 'Smart gadgets, everyday essentials, and trusted support for modern living.',
      };

  return (
    <main className="bg-store-background text-store-foreground">
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="store-hero-panel relative overflow-hidden rounded-[28px] border border-store-border bg-store-card px-6 py-16 text-center md:px-10">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-8 top-10 h-44 w-44 rounded-full bg-store-accent blur-3xl" />
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />
          </div>

          <div className="relative z-10">
            <p className="store-hero-badge mb-6 text-sm uppercase tracking-[0.2em] text-store-muted">
              {storefrontCopy.badge}
            </p>
            <h2 className="store-heading text-4xl font-bold text-store-foreground md:text-6xl">
              {storefrontCopy.heroTitle}
            </h2>

            <div className="mt-10 flex justify-center">
              <Link href={`/store/${subdomain}/products`}>
                <Button
                  size="lg"
                  className="bg-store-accent text-store-background transition-colors hover:bg-store-accent/90 hover:text-store-background"
                >
                  {storefrontCopy.button}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <h3 className="mb-8 text-3xl font-bold text-store-foreground store-heading">Products</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {showcaseProducts.map((product) => {
            const productIcon =
              product.name.toLowerCase().includes('running') ||
              product.name.toLowerCase().includes('shoe') ||
              product.name.toLowerCase().includes('sneaker')
                ? '👟'
                : product.name.toLowerCase().includes('gym') ||
                  product.name.toLowerCase().includes('fitness') ||
                  product.name.toLowerCase().includes('set')
                ? '🏋️'
                : product.name.toLowerCase().includes('water') ||
                  product.name.toLowerCase().includes('bottle')
                ? '💧'
                : product.name.toLowerCase().includes('blazer') ||
                  product.name.toLowerCase().includes('coat')
                ? '🧥'
                : product.name.toLowerCase().includes('dress') ||
                  product.name.toLowerCase().includes('jacket')
                ? '👗'
                : product.name.toLowerCase().includes('bag') ||
                  product.name.toLowerCase().includes('wallet')
                ? '👜'
                : product.name.toLowerCase().includes('watch')
                ? '⌚'
                : product.name.toLowerCase().includes('laptop')
                ? '💻'
                : '✨';

            return (
              <Link
                key={product.id}
                href={`/store/${subdomain}/products/${product.id}`}
                className="group overflow-hidden rounded-2xl border border-store-border bg-store-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-store-accent"
              >
                <div className="store-product-thumb mb-4 flex h-52 items-center justify-center overflow-hidden rounded-xl border border-store-border">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-6xl text-store-accent">{productIcon}</span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-store-foreground store-heading">
                      {product.name}
                    </h4>
                    <p className="mt-2 font-bold text-store-accent">Rs. {product.basePrice}</p>
                  </div>
                  <span className="rounded-full border border-store-border bg-store-background px-2 py-1 text-xs text-store-muted opacity-0 transition-opacity group-hover:opacity-100">
                    Quick View
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <h3 className="mb-6 text-3xl font-bold text-store-foreground store-heading">
          {storefrontCopy.aboutTitle}
        </h3>
        <div className="store-muted-card rounded-2xl border border-store-border bg-store-card px-6 py-5 text-store-muted">
          <p className="max-w-3xl text-base leading-7">{storefrontCopy.aboutText}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {storefrontCopy.features.map((feature, index) => (
            <div
              key={feature}
              className="rounded-2xl border border-store-border bg-store-card px-5 py-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-store-border bg-store-background text-xl text-store-accent">
                {storefrontCopy.featureIcons[index]}
              </div>
              <h4 className="text-lg font-semibold text-store-foreground store-heading">
                {feature}
              </h4>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <h3 className="mb-6 text-3xl font-bold text-store-foreground store-heading">Why Choose Us</h3>
        <div className="store-muted-card rounded-2xl border border-store-border bg-store-card px-6 py-5 text-store-muted">
          <p className="max-w-4xl text-base leading-8">{storefrontCopy.whyChoose}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <h3 className="mb-6 text-3xl font-bold text-store-foreground store-heading">How It Works</h3>
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
          {storefrontCopy.steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center md:gap-4"
            >
              <div className="flex min-h-[120px] w-full flex-1 items-center justify-between rounded-2xl border border-store-border bg-store-card p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-store-background text-xl text-store-accent">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-store-foreground store-heading">
                      {step.title}
                    </p>
                    <p className="text-sm text-store-muted">{step.text}</p>
                  </div>
                </div>
              </div>

              {index < storefrontCopy.steps.length - 1 && (
                <span className="self-center text-2xl text-store-accent md:hidden">↓</span>
              )}
              {index < storefrontCopy.steps.length - 1 && (
                <span className="hidden self-center text-2xl text-store-accent md:inline">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="mx-auto max-w-6xl px-4 py-4 md:py-8">
        <StoreReviews storeName={store.name} />
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid gap-6 rounded-[28px] border border-store-border bg-store-card p-6 md:grid-cols-[1.1fr_1.4fr] md:p-8">
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-store-muted">
                Contact Us
              </p>
              <h3 className="text-3xl font-bold text-store-foreground store-heading">
                We’d love to hear from you
              </h3>
            </div>

            <div className="space-y-4 text-store-muted">
              <div className="rounded-2xl border border-store-border bg-store-background p-4">
                <p className="text-sm uppercase tracking-[0.18em] text-store-muted">Email</p>
                <p className="mt-2 text-base text-store-foreground">
                  hello@{store.subDomain || 'store'}.com
                </p>
              </div>
              <div className="rounded-2xl border border-store-border bg-store-background p-4">
                <p className="text-sm uppercase tracking-[0.18em] text-store-muted">Phone</p>
                <p className="mt-2 text-base text-store-foreground">+92 300 1234567</p>
              </div>
              <div className="rounded-2xl border border-store-border bg-store-background p-4">
                <p className="text-sm uppercase tracking-[0.18em] text-store-muted">Address</p>
                <p className="mt-2 text-base text-store-foreground">Islamabad, Pakistan</p>
              </div>
            </div>
          </div>

          <form className="space-y-4 rounded-2xl border border-store-border bg-store-background p-5 md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-store-foreground">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-store-border bg-store-card px-3 py-2.5 text-sm text-store-foreground placeholder:text-store-muted outline-none transition focus:border-store-accent"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-store-foreground">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-store-border bg-store-card px-3 py-2.5 text-sm text-store-foreground placeholder:text-store-muted outline-none transition focus:border-store-accent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-store-foreground">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="How can we help?"
                className="w-full rounded-xl border border-store-border bg-store-card px-3 py-2.5 text-sm text-store-foreground placeholder:text-store-muted outline-none transition focus:border-store-accent"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-store-foreground">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Write your message..."
                className="w-full rounded-xl border border-store-border bg-store-card px-3 py-2.5 text-sm text-store-foreground placeholder:text-store-muted outline-none transition focus:border-store-accent"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-store-accent px-5 py-2.5 text-sm font-semibold text-store-background transition-colors hover:bg-store-accent/90"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer id="contact-footer" className="mt-12 border-t border-store-border bg-store-card px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <p className="store-heading text-xl font-semibold text-store-foreground">{store.name}</p>
              <p className="mt-3 text-sm leading-6 text-store-muted">
                {storefrontCopy.footerText}
              </p>
            </div>

            <div>
              <p className="store-heading text-base font-semibold text-store-foreground">Shop</p>
              <ul className="mt-3 space-y-2 text-sm text-store-muted">
                <li>
                  <Link href={`/store/${subdomain}/products`} className="hover:text-store-accent">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-store-accent">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#contact" className="hover:text-store-accent">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="store-heading text-base font-semibold text-store-foreground">Support</p>
              <ul className="mt-3 space-y-2 text-sm text-store-muted">
                <li>
                  <Link href="#" className="hover:text-store-accent">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-store-accent">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-store-accent">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="store-heading text-base font-semibold text-store-foreground">Follow Us</p>
              <div className="mt-3 flex gap-3 text-sm text-store-muted">
                <Link href="#" className="hover:text-store-accent">
                  Instagram
                </Link>
                <Link href="#" className="hover:text-store-accent">
                  Facebook
                </Link>
                <Link href="#" className="hover:text-store-accent">
                  X
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-store-border pt-6 text-center text-sm text-store-muted">
            <p>© 2026 {store.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}