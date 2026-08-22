"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, ShoppingBag, Search, ChevronDown } from "lucide-react";

interface StoreHeroProps {
  subdomain: string;
  storeName: string;
  heroConfig?: {
    eyebrow?: string;
    headline?: string;
    buttonText?: string;
  };
}

const STORE_CONFIGS: Record<string, {
  tag: string;
  title1: string;
  title2: string;
  description: string;
  primaryGlow: string;
  secondaryGlow: string;
  badgeBorder: string;
  badgeText: string;
  badgeBg: string;
  stats: { value: string; label: string }[];
  floatingCards: { title: string; category: string; price: string; badge: string; emoji: string }[];
  searchTags: string[];
}> = {
  boutique: {
    tag: "Exclusive Luxury Pret & Couture",
    title1: "Timeless Elegance &",
    title2: "Modern Luxury",
    description: "Discover handcrafted silhouettes, pure fabrics, and bespoke festive wear designed for effortless grace.",
    primaryGlow: "bg-amber-500/10",
    secondaryGlow: "bg-stone-500/10",
    badgeBorder: "border-border",
    badgeText: "text-foreground",
    badgeBg: "from-card to-card",
    stats: [
      { value: "400+", label: "Exclusive Cuts" },
      { value: "100%", label: "Pure Fabrics" },
      { value: "Bespoke", label: "Tailoring" },
      { value: "Express", label: "Delivery" },
    ],
    floatingCards: [
      { title: "Embroidered Raw Silk Maxi", category: "Luxury Pret", price: "Rs. 32,500", badge: "Exclusive", emoji: "✨" },
      { title: "Pure Chiffon Festive Set", category: "Couture", price: "Rs. 24,000", badge: "Bestseller", emoji: "👗" },
      { title: "Handworked Organza Dupatta", category: "Accessories", price: "Rs. 8,500", badge: "New", emoji: "🧣" },
    ],
    searchTags: ["Luxury Pret", "Festive Wear", "Abayas", "Silk Ensembles", "Formal Edit"],
  },
  electronics: {
    tag: "Next-Gen Tech Essentials",
    title1: "Discover Smart",
    title2: "Modern Technology",
    description: "Explore cutting-edge gadgets, laptops, audio gear, and everyday tech designed for seamless workflows.",
    primaryGlow: "bg-cyan-500/20",
    secondaryGlow: "bg-blue-600/20",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-300",
    badgeBg: "from-cyan-500/20 to-blue-500/20",
    stats: [
      { value: "500+", label: "Tech Products" },
      { value: "100%", label: "Authentic" },
      { value: "12 Mo", label: "Warranty" },
      { value: "24/7", label: "Support" },
    ],
    floatingCards: [
      { title: "M3 MacBook Air", category: "Laptop", price: "Rs. 240,000", badge: "Featured", emoji: "💻" },
      { title: "Sony WH-1000XM5", category: "Audio", price: "Rs. 85,000", badge: "Popular", emoji: "🎧" },
      { title: "Apple Watch S9", category: "Wearable", price: "Rs. 95,000", badge: "Trending", emoji: "⌚" },
    ],
    searchTags: ["Laptops", "Headphones", "Smartwatches", "Keyboards", "Cameras"],
  },
  sports: {
    tag: "Peak Athletic Performance",
    title1: "Elevate Your",
    title2: "Fitness Journey",
    description: "Equip yourself with premium workout gear, footwear, and apparel engineered for endurance.",
    primaryGlow: "bg-emerald-500/25",
    secondaryGlow: "bg-teal-500/20",
    badgeBorder: "border-emerald-500/40",
    badgeText: "text-emerald-400",
    badgeBg: "from-emerald-500/20 to-teal-500/20",
    stats: [
      { value: "350+", label: "Sports Gear" },
      { value: "Pro", label: "Quality Grade" },
      { value: "48 Hr", label: "Express Delivery" },
      { value: "100%", label: "Satisfaction" },
    ],
    floatingCards: [
      { title: "Pro Running Shoes", category: "Footwear", price: "Rs. 18,500", badge: "Bestseller", emoji: "👟" },
      { title: "Cast Iron Kettlebell", category: "Gym", price: "Rs. 6,500", badge: "Heavy Duty", emoji: "🏋️" },
      { title: "Insulated Sports Flask", category: "Hydration", price: "Rs. 3,200", badge: "Eco", emoji: "💧" },
    ],
    searchTags: ["Running Shoes", "Dumbbells", "Gym Wear", "Water Bottles", "Yoga Mats"],
  },
  clothing: {
    tag: "Curated Fashion & Apparel",
    title1: "Define Your",
    title2: "Signature Style",
    description: "Explore the latest trends, seasonal collections, and timeless casual wear crafted with comfort in mind.",
    primaryGlow: "bg-purple-500/25",
    secondaryGlow: "bg-pink-500/20",
    badgeBorder: "border-purple-500/40",
    badgeText: "text-purple-300",
    badgeBg: "from-purple-500/20 to-pink-500/20",
    stats: [
      { value: "1,200+", label: "Styles" },
      { value: "Cotton", label: "100% Organic" },
      { value: "7-Day", label: "Easy Return" },
      { value: "Free", label: "Delivery over 3k" },
    ],
    floatingCards: [
      { title: "Oversized Heavy Tee", category: "Streetwear", price: "Rs. 3,200", badge: "New Arrival", emoji: "👕" },
      { title: "Relaxed Fit Denim", category: "Pants", price: "Rs. 5,800", badge: "Trending", emoji: "👖" },
      { title: "Classic Wool Overcoat", category: "Winter", price: "Rs. 14,000", badge: "Premium", emoji: "🧥" },
    ],
    searchTags: ["Oversized Tees", "Hoodies", "Jeans", "Jackets", "Accessories"],
  },
};

export function StoreHeroSection({ subdomain, storeName, heroConfig }: StoreHeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const lowerSubdomain = (subdomain || "").toLowerCase();
  const configKey = lowerSubdomain.includes("boutique") || lowerSubdomain.includes("luxury")
    ? "boutique"
    : lowerSubdomain.includes("sport")
    ? "sports"
    : lowerSubdomain.includes("cloth")
    ? "clothing"
    : "electronics";

  const isBoutique = configKey === "boutique";
  const currentTheme = STORE_CONFIGS[configKey];

  const displayEyebrow = heroConfig?.eyebrow?.trim() || currentTheme.tag;
  const customHeadline = heroConfig?.headline?.trim();
  const displayCta = heroConfig?.buttonText?.trim() || "Browse Collection";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/store/${subdomain}/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <section
      className={`relative min-h-[85vh] flex items-center overflow-hidden transition-colors duration-300 ${
        isBoutique
          ? "bg-background text-foreground border-b border-border"
          : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Background for Dark Themes */}
      {!isBoutique && (
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            configKey === "sports"
              ? "bg-gradient-to-br from-[#061A14] via-[#020617] to-[#041F18]"
              : configKey === "clothing"
              ? "bg-gradient-to-br from-[#12071F] via-[#020617] to-[#1A0A26]"
              : "bg-gradient-to-br from-slate-950 via-[#0B1528] to-slate-950"
          }`}
        />
      )}

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${
            isBoutique ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.15)"
          } 1px, transparent 1px), linear-gradient(90deg, ${
            isBoutique ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.15)"
          } 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex mb-5">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                  isBoutique
                    ? "border-border bg-card text-foreground shadow-xs"
                    : `bg-gradient-to-r ${currentTheme.badgeBg} ${currentTheme.badgeBorder} backdrop-blur-md`
                }`}
              >
                <Sparkles size={14} className={isBoutique ? "text-foreground/70" : currentTheme.badgeText} />
                <span className={`text-xs font-semibold tracking-wide uppercase ${isBoutique ? "text-foreground/80" : currentTheme.badgeText}`}>
                  {displayEyebrow}
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] mb-6 ${
                isBoutique ? "text-foreground" : "text-white"
              }`}
            >
              {customHeadline ? (
                <span>{customHeadline}</span>
              ) : isBoutique ? (
                <>
                  <span>{currentTheme.title1}</span>{" "}
                  <span className="text-foreground/85 underline decoration-foreground/20 underline-offset-8">
                    {currentTheme.title2}
                  </span>
                </>
              ) : (
                <>
                  <span>{currentTheme.title1}</span>{" "}
                  <span
                    className={`bg-gradient-to-r ${
                      configKey === "sports"
                        ? "from-emerald-400 via-teal-400 to-green-300"
                        : configKey === "clothing"
                        ? "from-purple-400 via-fuchsia-400 to-pink-300"
                        : "from-cyan-400 via-blue-400 to-indigo-300"
                    } bg-clip-text text-transparent`}
                  >
                    {currentTheme.title2}
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p
              className={`text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 ${
                isBoutique ? "text-muted-foreground" : "text-slate-400"
              }`}
            >
              {currentTheme.description}
            </p>

            {/* Search Bar */}
            <div className="mb-6 max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${storeName} collections, pret, fabrics...`}
                  suppressHydrationWarning
                  className={`w-full h-13 pl-11 pr-32 rounded-2xl border text-sm transition-all shadow-xs ${
                    isBoutique
                      ? "border-input bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                      : "bg-slate-900/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60"
                  }`}
                />
                <button
                  type="submit"
                  suppressHydrationWarning
                  className={`absolute right-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    isBoutique
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : configKey === "sports"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                      : configKey === "clothing"
                      ? "bg-purple-600 hover:bg-purple-500 text-white"
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                  }`}
                >
                  Search
                </button>
              </form>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3 justify-center lg:justify-start">
                <span className="text-xs text-muted-foreground font-medium">Popular:</span>
                {currentTheme.searchTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => router.push(`/store/${subdomain}/products?q=${encodeURIComponent(tag)}`)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors shadow-xs ${
                      isBoutique
                        ? "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30"
                        : "border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
              <Link
                href={`/store/${subdomain}/products`}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  isBoutique
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : configKey === "sports"
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    : configKey === "clothing"
                    ? "bg-purple-600 text-white hover:bg-purple-500"
                    : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                }`}
              >
                <span>{displayCta}</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href={`/store/${subdomain}/cart`}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border font-semibold text-sm transition-all shadow-xs ${
                  isBoutique
                    ? "border-border bg-card text-foreground hover:bg-accent"
                    : "border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                }`}
              >
                <ShoppingBag size={16} className={isBoutique ? "text-muted-foreground" : "text-cyan-400"} />
                <span>View Bag</span>
              </Link>
            </div>

            {/* Statistics */}
            <div className={`mt-10 pt-8 border-t ${isBoutique ? "border-border" : "border-slate-800/80"}`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {currentTheme.stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className={`text-2xl sm:text-3xl font-black ${isBoutique ? "text-foreground" : "text-white"}`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs font-medium tracking-wide uppercase mt-0.5 ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Floating Cards */}
          <div className="lg:col-span-5 relative flex flex-col gap-4 max-w-md mx-auto w-full">
            {currentTheme.floatingCards.map((card, idx) => (
              <div
                key={card.title}
                className={`relative rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 ${
                  isBoutique
                    ? "border border-border bg-card shadow-xs hover:border-foreground/20 hover:shadow-md"
                    : "border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl shadow-2xl hover:border-slate-700"
                }`}
                style={{
                  marginLeft: idx === 1 ? "1.5rem" : idx === 2 ? "0.5rem" : "0",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl border ${
                        isBoutique
                          ? "bg-accent border-border text-foreground"
                          : "bg-slate-800/80 border-slate-700/50"
                      }`}
                    >
                      {card.emoji}
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${isBoutique ? "text-muted-foreground" : "text-cyan-400"}`}>
                        {card.category}
                      </div>
                      <h4 className={`text-sm font-bold line-clamp-1 ${isBoutique ? "text-foreground" : "text-white"}`}>
                        {card.title}
                      </h4>
                      <p className={`text-xs font-semibold mt-0.5 ${isBoutique ? "text-foreground/80" : "text-slate-300"}`}>
                        {card.price}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      isBoutique
                        ? "bg-accent text-foreground/80 border-border"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {card.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 opacity-60">
          <span className={`text-[10px] font-semibold tracking-widest uppercase ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
            Scroll to explore
          </span>
          <ChevronDown size={14} className={`${isBoutique ? "text-muted-foreground" : "text-slate-400"} animate-bounce`} />
        </div>
      </div>
    </section>
  );
}