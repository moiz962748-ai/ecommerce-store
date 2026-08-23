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
  bgGradient: string;
  badgeBorder: string;
  badgeText: string;
  badgeBg: string;
  primaryButton: string;
  searchBorder: string;
  searchFocus: string;
  accentText: string;
  cardBorder: string;
  cardBg: string;
  cardHover: string;
  cardEmojiBg: string;
  cardCategoryText: string;
  cardBadge: string;
  stats: { value: string; label: string }[];
  floatingCards: { title: string; category: string; price: string; badge: string; emoji: string }[];
  searchTags: string[];
}> = {
  boutique: {
    tag: "Exclusive Luxury Pret & Couture",
    title1: "Timeless Elegance &",
    title2: "Modern Luxury",
    description: "Discover handcrafted silhouettes, pure fabrics, and bespoke festive wear designed for effortless grace.",
    bgGradient: "bg-[#fbfbfb]",
    badgeBorder: "border-border",
    badgeText: "text-foreground",
    badgeBg: "bg-card",
    primaryButton: "bg-primary text-primary-foreground hover:opacity-90",
    searchBorder: "border-input bg-card text-foreground placeholder:text-muted-foreground",
    searchFocus: "focus:ring-2 focus:ring-ring",
    accentText: "text-foreground underline decoration-foreground/20 underline-offset-8",
    cardBorder: "border-border",
    cardBg: "bg-card",
    cardHover: "hover:border-foreground/20 hover:shadow-md",
    cardEmojiBg: "bg-accent border-border text-foreground",
    cardCategoryText: "text-muted-foreground",
    cardBadge: "bg-accent text-foreground/80 border-border",
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
    bgGradient: "bg-[#ffffff]",
    badgeBorder: "border-sky-200",
    badgeText: "text-sky-800",
    badgeBg: "bg-sky-50",
    primaryButton: "bg-sky-600 hover:bg-sky-700 text-white",
    searchBorder: "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400",
    searchFocus: "focus:border-sky-500 focus:ring-2 focus:ring-sky-100",
    accentText: "text-slate-950",
    cardBorder: "border-slate-200",
    cardBg: "bg-white",
    cardHover: "hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5",
    cardEmojiBg: "bg-sky-50 border-sky-100 text-sky-800",
    cardCategoryText: "text-sky-700",
    cardBadge: "bg-sky-50 text-sky-800 border-sky-200",
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
    bgGradient: "bg-[#ffffff]",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-800",
    badgeBg: "bg-emerald-50",
    primaryButton: "bg-emerald-600 hover:bg-emerald-700 text-white",
    searchBorder: "border-emerald-200 bg-white text-slate-900 placeholder:text-slate-400",
    searchFocus: "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
    accentText: "text-slate-950",
    cardBorder: "border-emerald-200",
    cardBg: "bg-white",
    cardHover: "hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5",
    cardEmojiBg: "bg-emerald-50 border-emerald-100 text-emerald-800",
    cardCategoryText: "text-emerald-700",
    cardBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
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
    bgGradient: "bg-[#ffffff]",
    badgeBorder: "border-purple-200",
    badgeText: "text-purple-800",
    badgeBg: "bg-purple-50",
    primaryButton: "bg-purple-600 hover:bg-purple-700 text-white",
    searchBorder: "border-purple-200 bg-white text-slate-900 placeholder:text-slate-400",
    searchFocus: "focus:border-purple-500 focus:ring-2 focus:ring-purple-100",
    accentText: "text-slate-950",
    cardBorder: "border-purple-200",
    cardBg: "bg-white",
    cardHover: "hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5",
    cardEmojiBg: "bg-purple-50 border-purple-100 text-purple-800",
    cardCategoryText: "text-purple-700",
    cardBadge: "bg-purple-50 text-purple-800 border-purple-200",
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
  const displayCta = heroConfig?.buttonText?.trim() || "Browse All Products";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/store/${subdomain}/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white text-slate-900 border-b border-slate-200/80 transition-colors duration-300">
      
      {/* Subtle Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)`,
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
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-xs ${currentTheme.badgeBg} ${currentTheme.badgeBorder}`}
              >
                <Sparkles size={14} className={currentTheme.badgeText} />
                <span className={`text-xs font-semibold tracking-wide uppercase ${currentTheme.badgeText}`}>
                  {displayEyebrow}
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] mb-6 text-slate-950">
              {customHeadline ? (
                <span>{customHeadline}</span>
              ) : (
                <>
                  <span>{currentTheme.title1}</span>{" "}
                  <span className="block mt-1 text-slate-950">
                    {currentTheme.title2}
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 text-slate-600">
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
                  placeholder={`Search ${storeName} collections, gear, products...`}
                  suppressHydrationWarning
                  className={`w-full h-13 pl-11 pr-32 rounded-2xl border text-sm transition-all shadow-xs ${currentTheme.searchBorder} ${currentTheme.searchFocus}`}
                />
                <button
                  type="submit"
                  suppressHydrationWarning
                  className={`absolute right-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${currentTheme.primaryButton}`}
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
                    suppressHydrationWarning
                    onClick={() => router.push(`/store/${subdomain}/products?q=${encodeURIComponent(tag)}`)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-xs"
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
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${currentTheme.primaryButton}`}
              >
                <span>{displayCta}</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href={`/store/${subdomain}/cart`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white font-semibold text-sm text-slate-800 hover:bg-slate-50 transition-all shadow-xs"
              >
                <ShoppingBag size={16} className="text-slate-500" />
                <span>{isBoutique ? "View Bag" : "View Cart"}</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: Floating Cards */}
          <div className="lg:col-span-5 relative flex flex-col gap-4 max-w-md mx-auto w-full">
            {currentTheme.floatingCards.map((card, idx) => (
              <div
                key={card.title}
                className={`relative rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 border shadow-xs ${currentTheme.cardBorder} ${currentTheme.cardBg} ${currentTheme.cardHover}`}
                style={{
                  marginLeft: idx === 1 ? "1.5rem" : idx === 2 ? "0.5rem" : "0",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl border ${currentTheme.cardEmojiBg}`}
                    >
                      {card.emoji}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${currentTheme.cardCategoryText}`}>
                        {card.category}
                      </div>
                      <h4 className="text-sm font-bold line-clamp-1 text-slate-950">
                        {card.title}
                      </h4>
                      <p className="text-xs font-semibold mt-0.5 text-slate-700">
                        {card.price}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${currentTheme.cardBadge}`}
                  >
                    {card.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}