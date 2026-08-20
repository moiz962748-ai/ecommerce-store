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
  const configKey = lowerSubdomain.includes("sport")
    ? "sports"
    : lowerSubdomain.includes("cloth")
    ? "clothing"
    : "electronics";

  const currentTheme = STORE_CONFIGS[configKey];

  // Dynamic CMS Config overrides with fallbacks
  const displayEyebrow = heroConfig?.eyebrow?.trim() || currentTheme.tag;
  const customHeadline = heroConfig?.headline?.trim();
  const displayCta = heroConfig?.buttonText?.trim() || "Browse All Products";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/store/${subdomain}/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950 text-slate-100">
      {/* Dynamic Background Base */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          configKey === "sports"
            ? "bg-gradient-to-br from-[#061A14] via-[#020617] to-[#041F18]"
            : configKey === "clothing"
            ? "bg-gradient-to-br from-[#12071F] via-[#020617] to-[#1A0A26]"
            : "bg-gradient-to-br from-slate-950 via-[#0B1528] to-slate-950"
        }`}
      />

      {/* Radial Ambient Mesh Overlays */}
      {configKey === "sports" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent_70%)] pointer-events-none" />
      )}
      {configKey === "clothing" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(168,85,247,0.18),transparent_70%)] pointer-events-none" />
      )}
      {configKey === "electronics" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(6,182,212,0.14),transparent_70%)] pointer-events-none" />
      )}

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${
            configKey === "sports"
              ? "rgba(16,185,129,0.2)"
              : configKey === "clothing"
              ? "rgba(168,85,247,0.2)"
              : "rgba(255,255,255,0.15)"
          } 1px, transparent 1px), linear-gradient(90deg, ${
            configKey === "sports"
              ? "rgba(16,185,129,0.2)"
              : configKey === "clothing"
              ? "rgba(168,85,247,0.2)"
              : "rgba(255,255,255,0.15)"
          } 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-16 left-10 w-96 h-96 ${currentTheme.primaryGlow} rounded-full blur-[120px] animate-pulse`}
        />
        <div
          className={`absolute bottom-16 right-10 w-96 h-96 ${currentTheme.secondaryGlow} rounded-full blur-[120px] animate-pulse`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex mb-5">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-gradient-to-r ${currentTheme.badgeBg} ${currentTheme.badgeBorder} backdrop-blur-md`}
              >
                <Sparkles size={14} className={currentTheme.badgeText} />
                <span className={`text-xs font-semibold ${currentTheme.badgeText} tracking-wide uppercase`}>
                  {displayEyebrow}
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
              {customHeadline ? (
                <span
                  className={`bg-gradient-to-r ${
                    configKey === "sports"
                      ? "from-emerald-400 via-teal-400 to-green-300"
                      : configKey === "clothing"
                      ? "from-purple-400 via-fuchsia-400 to-pink-300"
                      : "from-cyan-400 via-blue-400 to-indigo-300"
                  } bg-clip-text text-transparent`}
                >
                  {customHeadline}
                </span>
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
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              {currentTheme.description}
            </p>

            {/* Search Bar */}
            <div className="mb-6 max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${storeName} products, categories, brands...`}
                  className={`w-full h-13 pl-11 pr-32 rounded-2xl border bg-slate-900/80 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-md focus:outline-none transition-all shadow-inner ${
                    configKey === "sports"
                      ? "border-emerald-950 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                      : configKey === "clothing"
                      ? "border-purple-950 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
                      : "border-slate-800 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute right-2 px-4 py-2 rounded-xl font-semibold text-xs transition-colors ${
                    configKey === "sports"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                      : configKey === "clothing"
                      ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                  }`}
                >
                  Search
                </button>
              </form>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3 justify-center lg:justify-start">
                <span className="text-xs text-slate-500 font-medium">Popular:</span>
                {currentTheme.searchTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => router.push(`/store/${subdomain}/products?q=${encodeURIComponent(tag)}`)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
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
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  configKey === "sports"
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20"
                    : configKey === "clothing"
                    ? "bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25"
                    : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20"
                }`}
              >
                {displayCta}
                <ArrowRight size={16} />
              </Link>

              <Link
                href={`/store/${subdomain}/cart`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:border-slate-700 transition-all backdrop-blur-md"
              >
                <ShoppingBag
                  size={16}
                  className={
                    configKey === "sports"
                      ? "text-emerald-400"
                      : configKey === "clothing"
                      ? "text-purple-400"
                      : "text-cyan-400"
                  }
                />
                View Cart
              </Link>
            </div>

            {/* Statistics */}
            <div className="mt-10 pt-8 border-t border-slate-800/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {currentTheme.stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-0.5">
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
                className="relative rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-xl shadow-2xl hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
                style={{
                  marginLeft: idx === 1 ? "1.5rem" : idx === 2 ? "0.5rem" : "0",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/50 text-2xl">
                      {card.emoji}
                    </div>
                    <div>
                      <div
                        className={`text-xs font-semibold ${
                          configKey === "sports"
                            ? "text-emerald-400"
                            : configKey === "clothing"
                            ? "text-purple-400"
                            : "text-cyan-400"
                        }`}
                      >
                        {card.category}
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{card.title}</h4>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5">{card.price}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {card.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 opacity-60">
          <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
            Scroll to explore
          </span>
          <ChevronDown size={14} className="text-slate-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}