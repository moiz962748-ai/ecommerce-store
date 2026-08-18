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
  const isSports = lowerSubdomain.includes("sport");
  const isClothing = lowerSubdomain.includes("cloth");
  const configKey = isSports ? "sports" : isClothing ? "clothing" : "electronics";

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
        isSports
          ? "bg-[#020d09] border-emerald-950/60 text-emerald-50"
          : isClothing
          ? "bg-[#0b0314] border-purple-950/60 text-purple-50"
          : "bg-slate-950 border-slate-900 text-slate-100"
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-40 right-10 w-80 h-80 rounded-full blur-3xl ${
            isSports ? "bg-emerald-500/10" : isClothing ? "bg-purple-500/10" : "bg-cyan-500/10"
          }`}
        />
        <div
          className={`absolute bottom-40 left-10 w-80 h-80 rounded-full blur-3xl ${
            isSports ? "bg-teal-500/10" : isClothing ? "bg-pink-500/10" : "bg-blue-500/10"
          }`}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-16">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4 ${
                isSports
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : isClothing
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
              }`}
            >
              <Star
                size={14}
                className={
                  isSports
                    ? "fill-emerald-400 text-emerald-400"
                    : isClothing
                    ? "fill-purple-400 text-purple-400"
                    : "fill-cyan-400 text-cyan-400"
                }
              />
              Featured Collection
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Hand-Picked{" "}
              <span
                className={`bg-gradient-to-r ${
                  isSports
                    ? "from-emerald-400 via-teal-400 to-green-300"
                    : isClothing
                    ? "from-purple-400 via-fuchsia-400 to-pink-300"
                    : "from-cyan-400 via-blue-400 to-indigo-300"
                } bg-clip-text text-transparent`}
              >
                Products for You
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
              Discover top-rated selections curated specifically for quality, performance, and style.
            </p>
          </div>

          <div className="hidden md:block flex-shrink-0">
            <Link
              href={`/store/${subdomain}/products`}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all shadow-sm ${
                isSports
                  ? "border-emerald-900/40 bg-slate-900/80 text-emerald-300 hover:bg-emerald-950/60 hover:border-emerald-500/40"
                  : isClothing
                  ? "border-purple-900/40 bg-slate-900/80 text-purple-300 hover:bg-purple-950/60 hover:border-purple-500/40"
                  : "border-slate-800 bg-slate-900/80 text-cyan-300 hover:bg-slate-800 hover:border-cyan-500/40"
              }`}
            >
              View All Products
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
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 animate-pulse space-y-4"
              >
                <div className="h-44 bg-slate-800/60 rounded-xl" />
                <div className="h-5 w-2/3 bg-slate-800 rounded" />
                <div className="h-4 w-full bg-slate-800/50 rounded" />
                <div className="h-10 bg-slate-800 rounded-xl" />
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
                className={`group relative flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-xl ${
                  isSports
                    ? "border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/90"
                    : isClothing
                    ? "border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/90"
                    : "border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90"
                }`}
              >
                <div>
                  {/* Top badges row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isSports
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : isClothing
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                          : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                      }`}
                    >
                      {prod.badge || prod.category || "Verified"}
                    </span>
                    <button
                      type="button"
                      aria-label="Wishlist"
                      className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                    >
                      <Heart size={15} />
                    </button>
                  </div>

                  {/* Product Title */}
                  <h3
                    className={`text-lg font-bold text-white transition-colors line-clamp-1 ${
                      isSports
                        ? "group-hover:text-emerald-400"
                        : isClothing
                        ? "group-hover:text-purple-300"
                        : "group-hover:text-cyan-300"
                    }`}
                  >
                    {prod.name}
                  </h3>

                  {/* Product Description */}
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                {/* Bottom Price & Action */}
                <div
                  className={`mt-6 pt-5 border-t flex items-center justify-between ${
                    isSports
                      ? "border-emerald-950/80"
                      : isClothing
                      ? "border-purple-950/80"
                      : "border-slate-800/80"
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                      Price
                    </span>
                    <span className="text-lg font-black text-white">
                      Rs. {Number(prod.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/store/${subdomain}/products/${prod.id}`}
                      className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      <Eye size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                        addedIds[prod.id]
                          ? "bg-emerald-500 text-slate-950"
                          : isSports
                          ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                          : isClothing
                          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25"
                          : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20"
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
            <Sparkles size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">No products found in this store catalog.</p>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href={`/store/${subdomain}/products`}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isSports
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                : isClothing
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20"
            }`}
          >
            Browse All Products
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
            isSports
              ? "border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10"
              : isClothing
              ? "border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10"
              : "border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10"
          }`}
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                isSports
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                  : isClothing
                  ? "bg-gradient-to-br from-purple-500 to-pink-600"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600"
              }`}
            >
              <Sparkles size={26} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Need a customized or corporate bulk order?</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Get exclusive wholesale pricing and verified delivery across Pakistan.
              </p>
            </div>
          </div>

          <Link
            href={`/store/${subdomain}#contact`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white hover:bg-slate-800 hover:border-slate-700 transition-all flex-shrink-0"
          >
            Inquire Now
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}