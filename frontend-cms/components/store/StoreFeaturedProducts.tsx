"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight, Sparkles, ShoppingBag, Heart, Check, Eye } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface StoreFeaturedProps {
  subdomain: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  featured?: boolean;
  inStock?: boolean;
  badge?: string;
}

const FALLBACK_PRODUCTS: Record<string, Product[]> = {
  boutique: [
    {
      id: "prod-1",
      name: "Embroidered Organza Festive Suit",
      description: "Intricate hand embroidery with delicate zari work and dyed silk trousers.",
      price: 34500,
      category: "Luxury Pret",
      badge: "Exclusive",
      inStock: true,
    },
    {
      id: "prod-2",
      name: "Pure Raw Silk Floor-Length Pishwas",
      description: "Handcrafted silhouette featuring embellished bodice and tissue dupatta.",
      price: 48000,
      category: "Couture",
      badge: "Bestseller",
      inStock: true,
    },
    {
      id: "prod-3",
      name: "Handcrafted Velvet Embroidered Shawl",
      description: "Plush micro-velvet with traditional tilla motifs and four-sided scalloped border.",
      price: 18500,
      category: "Festive Edit",
      badge: "New Arrival",
      inStock: true,
    },
  ],
  electronics: [
    {
      id: "prod-1",
      name: "Ultra Wireless ANC Headphones",
      description: "Lossless audio streaming with 40-hour battery life and spatial audio.",
      price: 24500,
      category: "Audio",
      badge: "Best Seller",
      inStock: true,
    },
    {
      id: "prod-2",
      name: "Mechanical RGB Gaming Keyboard",
      description: "Hot-swappable tactile switches with aircraft-grade aluminum frame.",
      price: 14200,
      category: "Gaming",
      badge: "Trending",
      inStock: true,
    },
    {
      id: "prod-3",
      name: "Pro 4K Ultra-Wide Monitor",
      description: "144Hz refresh rate, HDR 600, factory calibrated for creators.",
      price: 115000,
      category: "Displays",
      badge: "Featured",
      inStock: true,
    },
  ],
  sports: [
    {
      id: "prod-1",
      name: "Carbon Flow Running Shoes",
      description: "Responsive cushioning and carbon fiber plate for marathon performance.",
      price: 18900,
      category: "Footwear",
      badge: "Top Pick",
      inStock: true,
    },
    {
      id: "prod-2",
      name: "Adjustable Cast-Iron Dumbbell Set",
      description: "Quick-adjust weights from 2.5kg to 24kg per dumbbell with secure lock.",
      price: 28500,
      category: "Gym Gear",
      badge: "Heavy Duty",
      inStock: true,
    },
    {
      id: "prod-3",
      name: "Thermal Insulated Gym Flask",
      description: "Keeps drinks ice-cold for 24 hours. Leak-proof sport lid included.",
      price: 3400,
      category: "Hydration",
      badge: "Popular",
      inStock: true,
    },
  ],
  clothing: [
    {
      id: "prod-1",
      name: "Heavyweight Boxy Oversized Tee",
      description: "260 GSM organic cotton with ribbed collar and drop-shoulder silhouette.",
      price: 3200,
      category: "Streetwear",
      badge: "New Arrival",
      inStock: true,
    },
    {
      id: "prod-2",
      name: "Tailored Relaxed Fit Denim",
      description: "Premium Japanese selvedge-style cotton with subtle vintage wash.",
      price: 5900,
      category: "Bottoms",
      badge: "Trending",
      inStock: true,
    },
    {
      id: "prod-3",
      name: "Minimalist Wool Blend Coat",
      description: "Modern unstructured cut with deep welt pockets and breathable lining.",
      price: 15500,
      category: "Outerwear",
      badge: "Premium",
      inStock: true,
    },
  ],
};

export function StoreFeaturedProducts({ subdomain }: StoreFeaturedProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const lowerSubdomain = (subdomain || "").toLowerCase();
  const isBoutique = lowerSubdomain.includes("boutique") || lowerSubdomain.includes("luxury");
  const isSports = lowerSubdomain.includes("sport");
  const isClothing = lowerSubdomain.includes("cloth");
  const configKey = isBoutique ? "boutique" : isSports ? "sports" : isClothing ? "clothing" : "electronics";

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const store = await apiClient(`/public/stores/${subdomain}`);
        if (store?.id) {
          const res = await apiClient(`/public/products/store/${store.id}`);
          if (Array.isArray(res) && res.length > 0) {
            setProducts(res.slice(0, 6));
          } else {
            setProducts(FALLBACK_PRODUCTS[configKey]);
          }
        } else {
          setProducts(FALLBACK_PRODUCTS[configKey]);
        }
      } catch {
        setProducts(FALLBACK_PRODUCTS[configKey]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [subdomain, configKey]);

  const handleAddToCart = (id: string) => {
    setAddedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [id]: false }));
    }, 1800);
  };

  return (
    <section
      className={`relative py-20 md:py-28 overflow-hidden border-t transition-colors duration-300 ${
        isBoutique
          ? "bg-background border-border text-foreground"
          : isSports
          ? "bg-[#020d09] border-emerald-950/60 text-emerald-50"
          : isClothing
          ? "bg-[#0b0314] border-purple-950/60 text-purple-50"
          : "bg-gradient-to-b from-[#0b132b] via-[#070d1e] to-[#050811] border-cyan-950/60 text-slate-100"
      }`}
    >
      {/* Ambient background glow for non-boutique */}
      {!isBoutique && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className={`absolute top-20 right-10 w-96 h-96 rounded-full blur-[140px] opacity-35 ${
              isSports ? "bg-emerald-500" : isClothing ? "bg-purple-500" : "bg-cyan-500"
            }`}
          />
          <div
            className={`absolute bottom-20 left-10 w-96 h-96 rounded-full blur-[140px] opacity-30 ${
              isSports ? "bg-teal-500" : isClothing ? "bg-pink-500" : "bg-blue-600"
            }`}
          />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-16">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4 ${
                isBoutique
                  ? "border-border bg-card text-foreground shadow-xs"
                  : isSports
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : isClothing
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
              }`}
            >
              <Star
                size={14}
                className={
                  isBoutique
                    ? "fill-foreground/80 text-foreground/80"
                    : isSports
                    ? "fill-emerald-400 text-emerald-400"
                    : isClothing
                    ? "fill-purple-400 text-purple-400"
                    : "fill-cyan-400 text-cyan-400"
                }
              />
              {isBoutique ? "Curated Collection" : "Featured Collection"}
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${isBoutique ? "text-foreground" : "text-white"}`}>
              Hand-Picked{" "}
              <span
                className={
                  isBoutique
                    ? "text-foreground/90 underline decoration-border underline-offset-8"
                    : `bg-gradient-to-r ${
                        isSports
                          ? "from-emerald-400 via-teal-400 to-green-300"
                          : isClothing
                          ? "from-purple-400 via-fuchsia-400 to-pink-300"
                          : "from-cyan-400 via-sky-300 to-blue-400"
                      } bg-clip-text text-transparent`
                }
              >
                {isBoutique ? "Signature Creations" : "Products for You"}
              </span>
            </h2>
            <p className={`mt-3 text-sm sm:text-base max-w-xl leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-300"}`}>
              {isBoutique
                ? "Explore meticulously crafted ensembles featuring pure fabrics, artisanal embroideries, and couture finishes."
                : "Discover top-rated selections curated specifically for quality, performance, and style."}
            </p>
          </div>

          <div className="hidden md:block flex-shrink-0">
            <Link
              href={`/store/${subdomain}/products`}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                isBoutique
                  ? "border-border bg-card text-foreground hover:bg-accent shadow-xs"
                  : isSports
                  ? "border-emerald-900/40 bg-slate-900/80 text-emerald-300 hover:bg-emerald-950/60"
                  : isClothing
                  ? "border-purple-900/40 bg-slate-900/80 text-purple-300 hover:bg-purple-950/60"
                  : "border-cyan-500/30 bg-slate-900/60 text-cyan-300 hover:bg-slate-900/90"
              }`}
            >
              <span>View All Collection</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-6 animate-pulse space-y-4 ${
                  isBoutique ? "border-border bg-card" : "border-slate-800/80 bg-slate-900/50"
                }`}
              >
                <div className={`h-44 rounded-xl ${isBoutique ? "bg-muted" : "bg-slate-800/60"}`} />
                <div className={`h-5 w-2/3 rounded ${isBoutique ? "bg-muted" : "bg-slate-800"}`} />
                <div className={`h-4 w-full rounded ${isBoutique ? "bg-muted/80" : "bg-slate-800/50"}`} />
                <div className={`h-10 rounded-xl ${isBoutique ? "bg-muted" : "bg-slate-800"}`} />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod, index) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-xs ${
                  isBoutique
                    ? "border-border bg-card hover:border-foreground/20 hover:shadow-md"
                    : isSports
                    ? "border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/90"
                    : isClothing
                    ? "border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/90"
                    : "border-cyan-500/20 bg-slate-900/40 hover:border-cyan-400/60 hover:bg-slate-900/70"
                }`}
              >
                <div>
                  {/* Top badges row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isBoutique
                          ? "bg-accent border-border text-foreground/80"
                          : isSports
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : isClothing
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                          : "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                      }`}
                    >
                      {prod.badge || prod.category || "Authentic"}
                    </span>
                    <button
                      type="button"
                      aria-label="Wishlist"
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                        isBoutique
                          ? "bg-card border-border text-muted-foreground hover:text-rose-500 hover:border-rose-300"
                          : "bg-slate-800/80 border-slate-700/50 text-slate-400 hover:text-rose-400"
                      }`}
                    >
                      <Heart size={15} />
                    </button>
                  </div>

                  {/* Product Title */}
                  <h3
                    className={`text-lg font-bold transition-colors line-clamp-1 ${
                      isBoutique
                        ? "text-foreground group-hover:text-foreground/80"
                        : isSports
                        ? "text-white group-hover:text-emerald-400"
                        : isClothing
                        ? "text-white group-hover:text-purple-300"
                        : "text-white group-hover:text-cyan-300"
                    }`}
                  >
                    {prod.name}
                  </h3>

                  {/* Product Description */}
                  <p className={`mt-2 text-xs leading-relaxed line-clamp-2 ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
                    {prod.description}
                  </p>
                </div>

                {/* Bottom Price & Action */}
                <div
                  className={`mt-6 pt-5 border-t flex items-center justify-between ${
                    isBoutique
                      ? "border-border"
                      : isSports
                      ? "border-emerald-950/80"
                      : isClothing
                      ? "border-purple-950/80"
                      : "border-slate-800/80"
                  }`}
                >
                  <div>
                    <span className={`text-[10px] uppercase tracking-widest block font-medium ${isBoutique ? "text-muted-foreground" : "text-slate-500"}`}>
                      Price
                    </span>
                    <span className={`text-lg font-black ${isBoutique ? "text-foreground" : "text-white"}`}>
                      Rs. {Number(prod.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/store/${subdomain}/products/${prod.id}`}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                        isBoutique
                          ? "bg-card border-border text-foreground hover:bg-accent"
                          : "bg-slate-800/90 border-slate-700/80 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <Eye size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        addedIds[prod.id]
                          ? "bg-emerald-600 text-white"
                          : isBoutique
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : isSports
                          ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                          : isClothing
                          ? "bg-purple-600 hover:bg-purple-500 text-white"
                          : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                      }`}
                    >
                      {addedIds[prod.id] ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Sparkles size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">No products found in this boutique catalog.</p>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href={`/store/${subdomain}/products`}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
              isBoutique
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : isSports
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                : isClothing
                ? "bg-purple-600 hover:bg-purple-500 text-white"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            }`}
          >
            <span>Browse All Collection</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Bottom Banner Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-16 md:mt-20 p-6 md:p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
            isBoutique
              ? "border-border bg-card shadow-xs"
              : isSports
              ? "border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10"
              : isClothing
              ? "border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10"
              : "border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-slate-900/40"
          }`}
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 ${
                isBoutique
                  ? "bg-accent border border-border text-foreground"
                  : isSports
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                  : isClothing
                  ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
              }`}
            >
              <Sparkles size={26} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isBoutique ? "text-foreground" : "text-white"}`}>
                {isBoutique ? "Looking for Custom Bridal or Bespoke Stitching?" : "Need a customized or corporate bulk order?"}
              </h3>
              <p className={`text-xs mt-0.5 ${isBoutique ? "text-muted-foreground" : "text-slate-300"}`}>
                {isBoutique
                  ? "Get made-to-measure tailoring consultations and nationwide doorstep delivery."
                  : "Get exclusive wholesale pricing and verified delivery across Pakistan."}
              </p>
            </div>
          </div>

          <Link
            href={`/store/${subdomain}/contact`}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all flex-shrink-0 ${
              isBoutique
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-xs"
                : "bg-slate-900 border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700"
            }`}
          >
            <span>Inquire Now</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}