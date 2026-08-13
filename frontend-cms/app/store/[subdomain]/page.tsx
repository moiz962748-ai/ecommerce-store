'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

interface Store {
  id: string;
  name: string;
  subDomain: string;
  logoUrl: string | null;
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
  } catch (err: any) {
    setError('Store not found');
  } finally {
    setLoading(false);
  }
};

    fetchStore();
  }, [subdomain]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error || 'Store not found'}</p>
      </main>
    );
  }

  const showcaseProducts = products.length > 0 ? products.slice(0, 3) : [
    { id: 'mock-1', name: 'Slim Bezel Laptop', basePrice: 89999, description: 'Lightweight performance laptop' },
    { id: 'mock-2', name: 'Gaming Mouse', basePrice: 4999, description: 'Ultra-responsive precision mouse' },
    { id: 'mock-3', name: 'Wireless Headphones', basePrice: 12999, description: 'Immersive sound for daily use' },
  ];

  return (
    <main className="bg-store-background text-store-foreground">
      <header className="border-b border-store-border bg-store-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex min-w-[120px] items-center justify-center rounded-md border border-store-border bg-store-card px-3 py-2 text-sm font-medium text-store-muted">
                Logo
              </div>

              <h1 className="text-2xl font-bold text-store-foreground store-heading">{store.name}</h1>
            </div>

            <div className="hidden min-w-[260px] items-center gap-2 rounded-full border border-store-border bg-store-card px-3 py-2 md:flex">
              <span className="text-store-muted">⌕</span>
              <input
                aria-label="Search products"
                placeholder="Search"
                className="w-full bg-transparent text-sm text-store-foreground placeholder:text-store-muted outline-none"
              />
            </div>

            <nav className="flex items-center gap-4 text-sm md:gap-5">
              <Link href="/login" className="text-store-foreground hover:text-store-accent">Login</Link>
              <Link href="#about" className="text-store-foreground hover:text-store-accent">About</Link>
              <a href="#contact" className="text-store-foreground hover:text-store-accent">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="relative overflow-hidden rounded-[28px] border border-store-border bg-[radial-gradient(circle_at_top,_rgba(117,161,255,0.26),_transparent_48%),linear-gradient(135deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.02))] bg-store-card px-6 py-16 text-center shadow-[0_18px_40px_rgba(0,0,0,0.12)] md:px-10">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-8 top-10 h-44 w-44 rounded-full bg-store-accent blur-3xl" />
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />
          </div>

          <div className="relative z-10">
            <p className="mb-6 text-sm uppercase tracking-[0.2em] text-store-muted">Smart tech essentials</p>
            <h2 className="store-heading text-4xl font-bold text-store-foreground md:text-6xl">
              Welcome to {store.name}
            </h2>

            <div className="mt-10 flex justify-center">
              <Link href={`/store/${subdomain}/products`}>
                <Button
                  size="lg"
                  className="bg-store-accent text-store-background transition-colors hover:bg-store-accent/90 hover:text-store-background"
                >
                  Shop Now
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
            const icon = product.name.toLowerCase().includes('laptop')
              ? '💻'
              : product.name.toLowerCase().includes('mouse')
                ? '🖱️'
                : product.name.toLowerCase().includes('headphone')
                  ? '🎧'
                  : product.name.toLowerCase().includes('phone')
                    ? '📱'
                    : product.name.toLowerCase().includes('watch')
                      ? '⌚'
                      : product.name.toLowerCase().includes('speaker')
                        ? '🔊'
                        : '⚡';

            return (
              <Link
                key={product.id}
                href={`/store/${subdomain}/products/${product.id}`}
                className="group overflow-hidden rounded-2xl border border-store-border bg-store-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-store-accent"
              >
                <div className="mb-4 flex h-52 items-center justify-center overflow-hidden rounded-xl border border-store-border bg-[linear-gradient(135deg,rgba(117,161,255,0.18),rgba(255,255,255,0.03))]">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-6xl text-store-accent">{icon}</span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-store-foreground store-heading">{product.name}</h4>
                    <p className="mt-2 text-store-accent font-bold">Rs. {product.basePrice}</p>
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
        <h3 className="mb-6 text-3xl font-bold text-store-foreground store-heading">About Store</h3>
        <div className="rounded-2xl border border-store-border bg-store-card px-6 py-5 text-store-muted">
          <p className="max-w-3xl text-base leading-7">
            Discover premium technology and everyday essentials designed for faster workflows, smarter living, and a seamless shopping experience.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {['Fast Service', 'Easy Shopping', 'Low Cost'].map((feature) => (
            <div key={feature} className="rounded-2xl border border-store-border bg-store-card px-5 py-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-store-border bg-store-background text-xl text-store-accent">
                {feature === 'Fast Service' ? '⚡' : feature === 'Easy Shopping' ? '🛒' : '💸'}
              </div>
              <h4 className="text-lg font-semibold text-store-foreground store-heading">{feature}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <h3 className="mb-6 text-3xl font-bold text-store-foreground store-heading">Why Choose Us</h3>
        <div className="rounded-2xl border border-store-border bg-store-card px-6 py-5 text-store-muted">
          <p className="max-w-4xl text-base leading-8">
            We combine trusted electronics, curated product recommendations, and reliable after-sales support to make every purchase simple, secure, and satisfying. Our platform is designed to help customers discover the right devices faster, compare quality options with confidence, and enjoy a seamless buying journey from start to finish. With dependable service, competitive pricing, and a focus on customer trust, we make technology shopping easier and more enjoyable for everyone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <h3 className="mb-6 text-3xl font-bold text-store-foreground store-heading">How It Works</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Step 1', text: 'Browse and choose your product', icon: '👤' },
            { title: 'Step 2', text: 'Add to cart and complete checkout', icon: '💳' },
            { title: 'Step 3', text: 'Track your order and get fast delivery', icon: '🚚' },
          ].map((step, index) => (
            <div key={step.title} className="flex items-center gap-4">
              <div className="flex min-h-[120px] flex-1 items-center justify-between rounded-2xl border border-store-border bg-store-card p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-store-background text-xl text-store-accent">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-store-foreground store-heading">{step.title}</p>
                    <p className="text-sm text-store-muted">{step.text}</p>
                  </div>
                </div>
              </div>
              {index < 2 && <span className="text-2xl text-store-accent">→</span>}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid gap-6 rounded-[28px] border border-store-border bg-store-card p-6 md:grid-cols-[1.1fr_1.4fr] md:p-8">
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-store-muted">Contact Us</p>
              <h3 className="text-3xl font-bold text-store-foreground store-heading">We’d love to hear from you</h3>
            </div>

            <div className="space-y-4 text-store-muted">
              <div className="rounded-2xl border border-store-border bg-store-background p-4">
                <p className="text-sm uppercase tracking-[0.18em] text-store-muted">Email</p>
                <p className="mt-2 text-base text-store-foreground">hello@{store.subDomain || 'store'}.com</p>
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
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-store-foreground">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-store-border bg-store-card px-3 py-2.5 text-sm text-store-foreground placeholder:text-store-muted outline-none transition focus:border-store-accent"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-store-foreground">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-store-border bg-store-card px-3 py-2.5 text-sm text-store-foreground placeholder:text-store-muted outline-none transition focus:border-store-accent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-store-foreground">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="How can we help?"
                className="w-full rounded-xl border border-store-border bg-store-card px-3 py-2.5 text-sm text-store-foreground placeholder:text-store-muted outline-none transition focus:border-store-accent"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-store-foreground">Message</label>
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
                Smart gadgets, everyday essentials, and trusted support for modern living.
              </p>
            </div>

            <div>
              <p className="store-heading text-base font-semibold text-store-foreground">Shop</p>
              <ul className="mt-3 space-y-2 text-sm text-store-muted">
                <li><Link href={`/store/${subdomain}/products`} className="hover:text-store-accent">All Products</Link></li>
                <li><Link href="#about" className="hover:text-store-accent">About Us</Link></li>
                <li><a href="#contact" className="hover:text-store-accent">Contact</a></li>
              </ul>
            </div>

            <div>
              <p className="store-heading text-base font-semibold text-store-foreground">Support</p>
              <ul className="mt-3 space-y-2 text-sm text-store-muted">
                <li><Link href="#" className="hover:text-store-accent">Shipping Policy</Link></li>
                <li><Link href="#" className="hover:text-store-accent">Returns</Link></li>
                <li><Link href="#" className="hover:text-store-accent">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <p className="store-heading text-base font-semibold text-store-foreground">Follow Us</p>
              <div className="mt-3 flex gap-3 text-sm text-store-muted">
                <Link href="#" className="hover:text-store-accent">Instagram</Link>
                <Link href="#" className="hover:text-store-accent">Facebook</Link>
                <Link href="#" className="hover:text-store-accent">X</Link>
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