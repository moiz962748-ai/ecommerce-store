"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutGrid, ArrowRight, ArrowUpRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface StoreCategoriesProps {
  subdomain: string;
}

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

const STORE_CATEGORIES: Record<string, CategoryItem[]> = {
  electronics: [
    {
      id: "laptops",
      name: "Laptops & PCs",
      description: "Workstations, ultrabooks, and gaming rigs",
      icon: "💻",
      bgColor: "bg-blue-500/10 border-blue-500/30",
      textColor: "text-blue-400",
    },
    {
      id: "audio",
      name: "Audio & Sound",
      description: "Noise cancelling headphones and earbuds",
      icon: "🎧",
      bgColor: "bg-cyan-500/10 border-cyan-500/30",
      textColor: "text-cyan-400",
    },
    {
      id: "wearables",
      name: "Smart Wearables",
      description: "Smartwatches, fitness bands, and trackers",
      icon: "⌚",
      bgColor: "bg-purple-500/10 border-purple-500/30",
      textColor: "text-purple-400",
    },
    {
      id: "accessories",
      name: "Keyboards & Mice",
      description: "Mechanical keyboards, ergonomic mice",
      icon: "⌨️",
      bgColor: "bg-amber-500/10 border-amber-500/30",
      textColor: "text-amber-400",
    },
    {
      id: "phones",
      name: "Smartphones",
      description: "Flagship devices and mobile accessories",
      icon: "📱",
      bgColor: "bg-emerald-500/10 border-emerald-500/30",
      textColor: "text-emerald-400",
    },
    {
      id: "cameras",
      name: "Cameras & Vision",
      description: "Mirrorless gear, webcams, and lenses",
      icon: "📷",
      bgColor: "bg-rose-500/10 border-rose-500/30",
      textColor: "text-rose-400",
    },
    {
      id: "speakers",
      name: "Smart Audio & Speakers",
      description: "Bluetooth speakers and home sound systems",
      icon: "🔊",
      bgColor: "bg-indigo-500/10 border-indigo-500/30",
      textColor: "text-indigo-400",
    },
  ],
  sports: [
    {
      id: "footwear",
      name: "Footwear & Shoes",
      description: "Running sneakers, trail shoes, training cleats",
      icon: "👟",
      bgColor: "bg-emerald-500/10 border-emerald-500/30",
      textColor: "text-emerald-400",
    },
    {
      id: "gym-gear",
      name: "Gym & Weights",
      description: "Dumbbells, kettlebells, resistance bands",
      icon: "🏋️",
      bgColor: "bg-amber-500/10 border-amber-500/30",
      textColor: "text-amber-400",
    },
    {
      id: "apparel",
      name: "Activewear & Tops",
      description: "Breathable shirts, shorts, compression wear",
      icon: "🎽",
      bgColor: "bg-blue-500/10 border-blue-500/30",
      textColor: "text-blue-400",
    },
    {
      id: "hydration",
      name: "Hydration & Bottles",
      description: "Insulated flasks, shakers, hydration packs",
      icon: "💧",
      bgColor: "bg-cyan-500/10 border-cyan-500/30",
      textColor: "text-cyan-400",
    },
    {
      id: "recovery",
      name: "Yoga & Recovery",
      description: "Mats, foam rollers, massage guns",
      icon: "🧘",
      bgColor: "bg-purple-500/10 border-purple-500/30",
      textColor: "text-purple-400",
    },
    {
      id: "outdoor",
      name: "Outdoor & Trekking",
      description: "Backpacks, trail accessories, camping essentials",
      icon: "🏕️",
      bgColor: "bg-lime-500/10 border-lime-500/30",
      textColor: "text-lime-400",
    },
    {
      id: "sports-accessories",
      name: "Gloves & Straps",
      description: "Lifting straps, wrist wraps, support belts",
      icon: "🥊",
      bgColor: "bg-rose-500/10 border-rose-500/30",
      textColor: "text-rose-400",
    },
  ],
  clothing: [
    {
      id: "t-shirts",
      name: "T-Shirts & Tops",
      description: "Oversized tees, graphic prints, basics",
      icon: "👕",
      bgColor: "bg-purple-500/10 border-purple-500/30",
      textColor: "text-purple-400",
    },
    {
      id: "bottoms",
      name: "Jeans & Trousers",
      description: "Relaxed denim, cargos, tailored pants",
      icon: "👖",
      bgColor: "bg-blue-500/10 border-blue-500/30",
      textColor: "text-blue-400",
    },
    {
      id: "outerwear",
      name: "Jackets & Hoodies",
      description: "Bomber jackets, fleece hoodies, overcoats",
      icon: "🧥",
      bgColor: "bg-rose-500/10 border-rose-500/30",
      textColor: "text-rose-400",
    },
    {
      id: "dresses",
      name: "Dresses & Co-ords",
      description: "Casual wear, formal silhouettes, sets",
      icon: "👗",
      bgColor: "bg-pink-500/10 border-pink-500/30",
      textColor: "text-pink-400",
    },
    {
      id: "accessories",
      name: "Bags & Belts",
      description: "Crossbody bags, leather accessories, hats",
      icon: "👜",
      bgColor: "bg-amber-500/10 border-amber-500/30",
      textColor: "text-amber-400",
    },
    {
      id: "footwear",
      name: "Shoes & Boots",
      description: "Casual sneakers, loafers, leather boots",
      icon: "👞",
      bgColor: "bg-cyan-500/10 border-cyan-500/30",
      textColor: "text-cyan-400",
    },
    {
      id: "knitwear",
      name: "Sweaters & Cardigans",
      description: "Wool knitwear, winter essentials",
      icon: "🧶",
      bgColor: "bg-emerald-500/10 border-emerald-500/30",
      textColor: "text-emerald-400",
    },
  ],
};

const SPARKLES = [
  { top: 15, left: 20, duration: 2 },
  { top: 40, left: 75, duration: 2.5 },
  { top: 70, left: 30, duration: 3 },
  { top: 25, left: 60, duration: 2.2 },
  { top: 80, left: 45, duration: 2.8 },
  { top: 55, left: 15, duration: 3.2 },
];

export function StoreCategoriesSection({ subdomain }: StoreCategoriesProps) {
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const lowerSubdomain = (subdomain || "").toLowerCase();
  const isSports = lowerSubdomain.includes("sport");
  const isClothing = lowerSubdomain.includes("cloth");
  const configKey = isSports ? "sports" : isClothing ? "clothing" : "electronics";

  const categories = STORE_CATEGORIES[configKey] || STORE_CATEGORIES.electronics;

  useEffect(() => {
    const fetchProductsCount = async () => {
      try {
        const store = await apiClient(`/public/stores/${subdomain}`);
        if (store?.id) {
          const products = await apiClient(`/public/products/store/${store.id}`);
          setTotalProducts(Array.isArray(products) ? products.length : 12);
        }
      } catch {
        setTotalProducts(12);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsCount();
  }, [subdomain]);

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
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-0 left-10 w-96 h-96 rounded-full blur-3xl ${
            isSports ? "bg-emerald-500/10" : isClothing ? "bg-purple-500/10" : "bg-cyan-500/10"
          }`}
        />
        <div
          className={`absolute bottom-0 right-10 w-96 h-96 rounded-full blur-3xl ${
            isSports ? "bg-teal-500/10" : isClothing ? "bg-pink-500/10" : "bg-blue-500/10"
          }`}
        />
      </div>

      {/* Subtle Dot Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4 ${
              isSports
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : isClothing
                ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
            }`}
          >
            <LayoutGrid size={14} />
            Categories
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Find Products by{" "}
            <span
              className={`bg-gradient-to-r ${
                isSports
                  ? "from-emerald-400 via-teal-400 to-green-300"
                  : isClothing
                  ? "from-purple-400 via-fuchsia-400 to-pink-300"
                  : "from-cyan-400 via-blue-400 to-indigo-300"
              } bg-clip-text text-transparent`}
            >
              Category
            </span>
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-400 leading-relaxed">
            Browse through curated collections tailored to your lifestyle, performance, and everyday needs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Link
                href={`/store/${subdomain}/products?category=${encodeURIComponent(cat.id)}`}
                className={`group relative flex flex-col justify-between h-full rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 shadow-lg hover:-translate-y-1.5 ${
                  isSports
                    ? "border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/90"
                    : isClothing
                    ? "border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/90"
                    : "border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90"
                }`}
              >
                <div>
                  {/* Category Icon Badge */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border ${cat.bgColor} text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {cat.icon}
                  </div>

                  <h3
                    className={`text-lg font-bold text-white transition-colors ${
                      isSports
                        ? "group-hover:text-emerald-400"
                        : isClothing
                        ? "group-hover:text-purple-300"
                        : "group-hover:text-cyan-300"
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div
                  className={`mt-6 flex items-center justify-between pt-4 border-t ${
                    isSports
                      ? "border-emerald-950/80"
                      : isClothing
                      ? "border-purple-950/80"
                      : "border-slate-800/60"
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    In Stock
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isSports
                        ? "bg-slate-800 text-slate-400 group-hover:bg-emerald-500 group-hover:text-slate-950"
                        : isClothing
                        ? "bg-slate-800 text-slate-400 group-hover:bg-purple-600 group-hover:text-white"
                        : "bg-slate-800 text-slate-400 group-hover:bg-cyan-500 group-hover:text-slate-950"
                    }`}
                  >
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* View All Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categories.length * 0.06 }}
          >
            <Link
              href={`/store/${subdomain}/products`}
              className="group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
              style={{
                background: isSports
                  ? "linear-gradient(135deg, #059669 0%, #10B981 50%, #14B8A6 100%)"
                  : isClothing
                  ? "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)"
                  : "linear-gradient(135deg, #0284C7 0%, #06B6D4 50%, #3B82F6 100%)",
              }}
            >
              {/* Animated Sparkles */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                {SPARKLES.map((sparkle, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{ top: `${sparkle.top}%`, left: `${sparkle.left}%` }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.4, 1],
                    }}
                    transition={{
                      duration: sparkle.duration,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 mb-5">
                  <LayoutGrid size={26} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">View All</h3>
                <p className="text-xs text-white/90 leading-relaxed mb-4">
                  {loading
                    ? "Loading products..."
                    : `Explore all ${totalProducts}+ products in our catalog`}
                </p>
              </div>

              <div className="relative flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Browse Catalog
                </span>
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-950 group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom Request / Custom Inquiry Strip */}
        <div className="mt-14 text-center">
          <p className="text-sm text-slate-400 mb-3">Looking for a specific model or bulk order?</p>
          <Link
            href={`/store/${subdomain}#contact`}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              isSports
                ? "border-emerald-900/50 bg-slate-900/80 text-emerald-300 hover:bg-emerald-950/60 hover:border-emerald-500/40"
                : isClothing
                ? "border-purple-900/50 bg-slate-900/80 text-purple-300 hover:bg-purple-950/60 hover:border-purple-500/40"
                : "border-slate-800 bg-slate-900/80 text-cyan-300 hover:bg-slate-800 hover:border-cyan-500/40"
            }`}
          >
            Contact Store Team
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}