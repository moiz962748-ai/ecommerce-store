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
  boutique: [
    {
      id: "luxury-pret",
      name: "Luxury Pret",
      description: "Ready-to-wear embroidered tunics & festive sets",
      icon: "✨",
      bgColor: "bg-accent border-border",
      textColor: "text-foreground",
    },
    {
      id: "couture",
      name: "Formal & Couture",
      description: "Handcrafted bridal, pishwas & formal maxis",
      icon: "👗",
      bgColor: "bg-accent border-border",
      textColor: "text-foreground",
    },
    {
      id: "festive-edit",
      name: "Festive Raw Silk",
      description: "Pure raw silk 3-piece sets with organza dupattas",
      icon: "🥻",
      bgColor: "bg-accent border-border",
      textColor: "text-foreground",
    },
    {
      id: "abayas",
      name: "Abayas & Modest",
      description: "Premium Korean Nida & Chiffon front-open abayas",
      icon: "🧕",
      bgColor: "bg-accent border-border",
      textColor: "text-foreground",
    },
    {
      id: "shawls",
      name: "Velvet Shawls",
      description: "Artisanal velvet & Pashmina winter wraps",
      icon: "🧣",
      bgColor: "bg-accent border-border",
      textColor: "text-foreground",
    },
    {
      id: "stitching",
      name: "Bespoke Stitching",
      description: "Custom tailoring & made-to-measure services",
      icon: "🪡",
      bgColor: "bg-accent border-border",
      textColor: "text-foreground",
    },
    {
      id: "accessories",
      name: "Jewels & Clutches",
      description: "Handcrafted khussas, potlis & jewelry pieces",
      icon: "💎",
      bgColor: "bg-accent border-border",
      textColor: "text-foreground",
    },
  ],
  electronics: [
    {
      id: "laptops",
      name: "Laptops & PCs",
      description: "Workstations, ultrabooks, and gaming rigs",
      icon: "💻",
      bgColor: "bg-sky-50 border-sky-100",
      textColor: "text-sky-700",
    },
    {
      id: "audio",
      name: "Audio & Sound",
      description: "Noise cancelling headphones and earbuds",
      icon: "🎧",
      bgColor: "bg-cyan-50 border-cyan-100",
      textColor: "text-cyan-700",
    },
    {
      id: "wearables",
      name: "Smart Wearables",
      description: "Smartwatches, fitness bands, and trackers",
      icon: "⌚",
      bgColor: "bg-blue-50 border-blue-100",
      textColor: "text-blue-700",
    },
    {
      id: "accessories",
      name: "Keyboards & Mice",
      description: "Mechanical keyboards, ergonomic mice",
      icon: "⌨️",
      bgColor: "bg-slate-100 border-slate-200",
      textColor: "text-slate-700",
    },
    {
      id: "phones",
      name: "Smartphones",
      description: "Flagship devices and mobile accessories",
      icon: "📱",
      bgColor: "bg-sky-50 border-sky-100",
      textColor: "text-sky-700",
    },
    {
      id: "cameras",
      name: "Cameras & Vision",
      description: "Mirrorless gear, webcams, and lenses",
      icon: "📷",
      bgColor: "bg-indigo-50 border-indigo-100",
      textColor: "text-indigo-700",
    },
    {
      id: "speakers",
      name: "Smart Audio & Speakers",
      description: "Bluetooth speakers and home sound systems",
      icon: "🔊",
      bgColor: "bg-cyan-50 border-cyan-100",
      textColor: "text-cyan-700",
    },
  ],
  sports: [
    {
      id: "footwear",
      name: "Footwear & Shoes",
      description: "Running sneakers, trail shoes, training cleats",
      icon: "👟",
      bgColor: "bg-emerald-50 border-emerald-100",
      textColor: "text-emerald-700",
    },
    {
      id: "gym-gear",
      name: "Gym & Weights",
      description: "Dumbbells, kettlebells, resistance bands",
      icon: "🏋️",
      bgColor: "bg-teal-50 border-teal-100",
      textColor: "text-teal-700",
    },
    {
      id: "apparel",
      name: "Activewear & Tops",
      description: "Breathable shirts, shorts, compression wear",
      icon: "🎽",
      bgColor: "bg-emerald-50 border-emerald-100",
      textColor: "text-emerald-700",
    },
    {
      id: "hydration",
      name: "Hydration & Bottles",
      description: "Insulated flasks, shakers, hydration packs",
      icon: "💧",
      bgColor: "bg-cyan-50 border-cyan-100",
      textColor: "text-cyan-700",
    },
    {
      id: "recovery",
      name: "Yoga & Recovery",
      description: "Mats, foam rollers, massage guns",
      icon: "🧘",
      bgColor: "bg-teal-50 border-teal-100",
      textColor: "text-teal-700",
    },
    {
      id: "outdoor",
      name: "Outdoor & Trekking",
      description: "Backpacks, trail accessories, camping essentials",
      icon: "🏕️",
      bgColor: "bg-emerald-50 border-emerald-100",
      textColor: "text-emerald-700",
    },
    {
      id: "sports-accessories",
      name: "Gloves & Straps",
      description: "Lifting straps, wrist wraps, support belts",
      icon: "🥊",
      bgColor: "bg-teal-50 border-teal-100",
      textColor: "text-teal-700",
    },
  ],
  clothing: [
    {
      id: "t-shirts",
      name: "T-Shirts & Tops",
      description: "Oversized tees, graphic prints, basics",
      icon: "👕",
      bgColor: "bg-purple-50 border-purple-100",
      textColor: "text-purple-700",
    },
    {
      id: "bottoms",
      name: "Jeans & Trousers",
      description: "Relaxed denim, cargos, tailored pants",
      icon: "👖",
      bgColor: "bg-indigo-50 border-indigo-100",
      textColor: "text-indigo-700",
    },
    {
      id: "outerwear",
      name: "Jackets & Hoodies",
      description: "Bomber jackets, fleece hoodies, overcoats",
      icon: "🧥",
      bgColor: "bg-purple-50 border-purple-100",
      textColor: "text-purple-700",
    },
    {
      id: "dresses",
      name: "Dresses & Co-ords",
      description: "Casual wear, formal silhouettes, sets",
      icon: "👗",
      bgColor: "bg-pink-50 border-pink-100",
      textColor: "text-pink-700",
    },
    {
      id: "accessories",
      name: "Bags & Belts",
      description: "Crossbody bags, leather accessories, hats",
      icon: "👜",
      bgColor: "bg-purple-50 border-purple-100",
      textColor: "text-purple-700",
    },
    {
      id: "footwear",
      name: "Shoes & Boots",
      description: "Casual sneakers, loafers, leather boots",
      icon: "👞",
      bgColor: "bg-indigo-50 border-indigo-100",
      textColor: "text-indigo-700",
    },
    {
      id: "knitwear",
      name: "Sweaters & Cardigans",
      description: "Wool knitwear, winter essentials",
      icon: "🧶",
      bgColor: "bg-purple-50 border-purple-100",
      textColor: "text-purple-700",
    },
  ],
};

export function StoreCategoriesSection({ subdomain }: StoreCategoriesProps) {
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const lowerSubdomain = (subdomain || "").toLowerCase();
  const isBoutique = lowerSubdomain.includes("boutique") || lowerSubdomain.includes("luxury");
  const isSports = lowerSubdomain.includes("sport");
  const isClothing = lowerSubdomain.includes("cloth");
  const configKey = isBoutique ? "boutique" : isSports ? "sports" : isClothing ? "clothing" : "electronics";

  const categories = STORE_CATEGORIES[configKey] || STORE_CATEGORIES.electronics;

  useEffect(() => {
    const fetchProductsCount = async () => {
      try {
        const store = await apiClient(`/public/stores/${subdomain}`);
        if (store?.id) {
          const products = await apiClient(`/public/products/store/${store.id}`);
          setTotalProducts(Array.isArray(products) ? products.length : 14);
        }
      } catch {
        setTotalProducts(14);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsCount();
  }, [subdomain]);

  return (
    <section
      className={`relative py-20 md:py-28 overflow-hidden border-t transition-colors duration-300 ${
        isBoutique
          ? "bg-background border-border text-foreground"
          : isSports
          ? "bg-[#f4fbf7] border-emerald-200/80 text-slate-900"
          : isClothing
          ? "bg-[#faf7fc] border-purple-200/80 text-slate-900"
          : "bg-[#f8fafc] border-slate-200 text-slate-900"
      }`}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs ${
              isBoutique
                ? "border-border bg-card text-foreground"
                : isSports
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : isClothing
                ? "border-purple-200 bg-purple-50 text-purple-800"
                : "border-sky-200 bg-sky-50 text-sky-800"
            }`}
          >
            <LayoutGrid size={14} />
            Categories & Edits
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${isBoutique ? "text-foreground" : "text-slate-950"}`}>
            Browse by{" "}
            <span
              className={
                isBoutique
                  ? "text-foreground/90 underline decoration-border underline-offset-8"
                  : isSports
                  ? "text-emerald-700 underline decoration-emerald-300 underline-offset-8"
                  : isClothing
                  ? "text-purple-700 underline decoration-purple-300 underline-offset-8"
                  : "text-sky-700 underline decoration-sky-300 underline-offset-8"
              }
            >
              Category
            </span>
          </h2>
          <p className={`mt-3.5 text-sm sm:text-base leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-600"}`}>
            {isBoutique
              ? "Discover artisanal hand-embellished couture, festive edits, and everyday pret crafted to perfection."
              : "Browse through curated collections tailored to your lifestyle, performance, and everyday needs."}
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
                className={`group relative flex flex-col justify-between h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-xs ${
                  isBoutique
                    ? "border-border bg-card hover:border-foreground/20 hover:shadow-md"
                    : isSports
                    ? "border-emerald-200/80 bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5"
                    : isClothing
                    ? "border-purple-200/80 bg-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5"
                    : "border-slate-200/80 bg-white hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5"
                }`}
              >
                <div>
                  {/* Category Icon Badge */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border ${cat.bgColor} text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-xs`}
                  >
                    {cat.icon}
                  </div>

                  <h3
                    className={`text-lg font-bold transition-colors ${
                      isBoutique
                        ? "text-foreground group-hover:text-foreground/80"
                        : isSports
                        ? "text-slate-900 group-hover:text-emerald-700"
                        : isClothing
                        ? "text-slate-900 group-hover:text-purple-700"
                        : "text-slate-900 group-hover:text-sky-700"
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className={`mt-1.5 text-xs leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-600"}`}>
                    {cat.description}
                  </p>
                </div>

                <div
                  className={`mt-6 flex items-center justify-between pt-4 border-t ${
                    isBoutique
                      ? "border-border"
                      : "border-slate-100"
                  }`}
                >
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
                    Available
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isBoutique
                        ? "bg-accent border border-border text-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                        : isSports
                        ? "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white"
                        : isClothing
                        ? "bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white"
                        : "bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white"
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
              className={`group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 ${
                isBoutique
                  ? "bg-primary text-primary-foreground"
                  : isSports
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : isClothing
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-sky-600 text-white hover:bg-sky-700"
              }`}
            >
              <div className="relative">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300 ${
                    isBoutique ? "bg-primary-foreground/15 text-primary-foreground" : "bg-white/20 text-white"
                  }`}
                >
                  <LayoutGrid size={26} />
                </div>
                <h3 className="text-2xl font-black mb-2">View All</h3>
                <p className="text-xs opacity-90 leading-relaxed mb-4">
                  {loading
                    ? "Loading catalog..."
                    : `Explore all ${totalProducts}+ handcrafted items in our full catalog`}
                </p>
              </div>

              <div className={`relative flex items-center justify-between pt-4 border-t ${isBoutique ? "border-primary-foreground/20" : "border-white/20"}`}>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Browse Catalog
                </span>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform ${
                    isBoutique ? "bg-primary-foreground text-primary" : "bg-white text-slate-900"
                  }`}
                >
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom Request / Custom Inquiry Strip */}
        <div className="mt-14 text-center">
          <p className={`text-sm mb-3 ${isBoutique ? "text-muted-foreground" : "text-slate-600"}`}>
            {isBoutique ? "Need assistance with custom measurements or bridal appointments?" : "Looking for a specific model or bulk order?"}
          </p>
          <Link
            href={`/store/${subdomain}#contact`}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
              isBoutique
                ? "border-border bg-card text-foreground hover:bg-accent"
                : isSports
                ? "border-emerald-200 bg-white text-emerald-800 hover:border-emerald-400 hover:text-emerald-900"
                : isClothing
                ? "border-purple-200 bg-white text-purple-800 hover:border-purple-400 hover:text-purple-900"
                : "border-slate-200 bg-white text-slate-800 hover:border-sky-400 hover:text-sky-900"
            }`}
          >
            <span>{isBoutique ? "Book Consultation" : "Contact Store Team"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}