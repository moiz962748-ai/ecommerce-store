"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  Search,
  SlidersHorizontal,
  CreditCard,
  Truck,
  ShoppingBag,
} from "lucide-react";

interface StoreHowItWorksProps {
  subdomain: string;
}

const STORE_STEPS: Record<
  string,
  Array<{
    id: number;
    iconName: "Search" | "SlidersHorizontal" | "CreditCard" | "Truck";
    title: string;
    description: string;
    features: string[];
    color: string;
    gradient: string;
    nextColor: string | null;
  }>
> = {
  boutique: [
    {
      id: 1,
      iconName: "Search",
      title: "Explore Luxury Pret & Couture",
      description:
        "Browse artisanal bridal wear, raw silk pishwas, hand-embroidered maxis, and contemporary festive edits crafted by seasoned couturiers.",
      features: ["100% Pure silk & organza", "Artisanal handwork", "Exclusive collections"],
      color: "#18181b",
      gradient: "linear-gradient(135deg, #27272a 0%, #09090b 100%)",
      nextColor: "#27272a",
    },
    {
      id: 2,
      iconName: "SlidersHorizontal",
      title: "Select Silhouette & Sizing",
      description:
        "Choose standard ready-to-wear sizes or request bespoke made-to-measure tailoring adjustments with custom neckline & sleeve options.",
      features: ["Made-to-measure guide", "Color customization", "Fabric swatches"],
      color: "#27272a",
      gradient: "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)",
      nextColor: "#3f3f46",
    },
    {
      id: 3,
      iconName: "CreditCard",
      title: "Secure Checkout & Order Booking",
      description:
        "Confirm your order effortlessly with secure online debit/credit cards, direct bank transfer, or Cash on Delivery across Pakistan.",
      features: ["Encrypted checkout", "Direct bank transfer", "Cash on Delivery"],
      color: "#3f3f46",
      gradient: "linear-gradient(135deg, #52525b 0%, #27272a 100%)",
      nextColor: "#18181b",
    },
    {
      id: 4,
      iconName: "Truck",
      title: "Handcrafted Luxury Delivery",
      description:
        "Each outfit is steam-finished, packaged in keepsake garment bags, and dispatched with real-time tracking to your doorstep.",
      features: ["Keepsake packaging", "Nationwide express delivery", "Doorstep exchange"],
      color: "#18181b",
      gradient: "linear-gradient(135deg, #27272a 0%, #09090b 100%)",
      nextColor: null,
    },
  ],
  electronics: [
    {
      id: 1,
      iconName: "Search",
      title: "Discover Smart Tech",
      description:
        "Explore hundreds of verified electronic devices, premium laptops, noise-canceling audio gear, and workplace essentials.",
      features: ["100% Genuine products", "Detailed specs", "Brand warranty"],
      color: "#06B6D4",
      gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
      nextColor: "#3B82F6",
    },
    {
      id: 2,
      iconName: "SlidersHorizontal",
      title: "Compare & Customize",
      description:
        "Filter by technical specs, storage, processor generation, or price to find the exact setup for your daily workflow.",
      features: ["Smart specs filter", "Live stock check", "Price match"],
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
      nextColor: "#6366F1",
    },
    {
      id: 3,
      iconName: "CreditCard",
      title: "Secure Instant Checkout",
      description:
        "Add to cart and checkout smoothly with encrypted payment channels or Cash on Delivery across Pakistan.",
      features: ["Encrypted checkout", "Cash on delivery", "Instant confirmation"],
      color: "#6366F1",
      gradient: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
      nextColor: "#0284C7",
    },
    {
      id: 4,
      iconName: "Truck",
      title: "Express Insured Delivery",
      description:
        "Get your fragile electronics securely packaged and dispatched to your doorstep with end-to-end order tracking.",
      features: ["Bubble wrap safety", "Live SMS updates", "7-day easy returns"],
      color: "#0284C7",
      gradient: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
      nextColor: null,
    },
  ],
  sports: [
    {
      id: 1,
      iconName: "Search",
      title: "Browse Training Gear",
      description:
        "Discover heavy-duty gym weights, performance running footwear, hydration flasks, and athletic sportswear.",
      features: ["Athlete tested", "All sport types", "Size guides"],
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      nextColor: "#14B8A6",
    },
    {
      id: 2,
      iconName: "SlidersHorizontal",
      title: "Filter by Activity",
      description:
        "Filter gear by workout type, endurance level, weight classes, or preferred colorways with quick sorting.",
      features: ["Fitness filters", "Weight variants", "Quick sort"],
      color: "#14B8A6",
      gradient: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
      nextColor: "#059669",
    },
    {
      id: 3,
      iconName: "CreditCard",
      title: "Hassle-Free Order",
      description:
        "Save items to wishlist or complete your order in seconds with flexible payment and discount coupons.",
      features: ["Wishlist saves", "Seasonal promos", "Fast checkout"],
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      nextColor: "#10B981",
    },
    {
      id: 4,
      iconName: "Truck",
      title: "Doorstep Dispatch",
      description:
        "Quick dispatch so you never miss a workout session. Free express delivery on orders over Rs. 3,000.",
      features: ["48-hour delivery", "Verified courier", "Hassle-free exchange"],
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
      nextColor: null,
    },
  ],
  clothing: [
    {
      id: 1,
      iconName: "Search",
      title: "Explore Fashion Trends",
      description:
        "Discover seasonal collections, oversized streetwear, formal silhouettes, and premium casual daily wear.",
      features: ["Trend alerts", "100% Cotton fabric", "Full size range"],
      color: "#A855F7",
      gradient: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
      nextColor: "#D946EF",
    },
    {
      id: 2,
      iconName: "SlidersHorizontal",
      title: "Pick Your Fit & Color",
      description:
        "Use size charts and fit selectors to choose the perfect silhouette tailored to your look and comfort.",
      features: ["Accurate size chart", "Color swatches", "Fabric details"],
      color: "#D946EF",
      gradient: "linear-gradient(135deg, #D946EF 0%, #C026D3 100%)",
      nextColor: "#EC4899",
    },
    {
      id: 3,
      iconName: "CreditCard",
      title: "One-Click Shopping",
      description:
        "Checkout seamlessly with direct cards or Cash on Delivery with zero hidden convenience charges.",
      features: ["No hidden fees", "Secure payment", "Instant tracking code"],
      color: "#EC4899",
      gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
      nextColor: "#8B5CF6",
    },
    {
      id: 4,
      iconName: "Truck",
      title: "Delivered in Style",
      description:
        "Custom packaged deliveries with flexible 7-day doorstep size exchanges and return guarantee.",
      features: ["Eco-friendly packaging", "Size exchange", "7-day return policy"],
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      nextColor: null,
    },
  ],
};

const CTA_SPARKLES = [
  { top: 10, left: 15, duration: 2 },
  { top: 20, left: 45, duration: 2.5 },
  { top: 30, left: 75, duration: 3 },
  { top: 40, left: 85, duration: 2.2 },
  { top: 50, left: 25, duration: 2.8 },
  { top: 60, left: 55, duration: 3.2 },
  { top: 70, left: 15, duration: 2.4 },
  { top: 80, left: 65, duration: 2.6 },
  { top: 15, left: 90, duration: 3.1 },
  { top: 25, left: 5, duration: 2.9 },
  { top: 35, left: 40, duration: 2.3 },
  { top: 45, left: 70, duration: 2.7 },
  { top: 55, left: 10, duration: 3.3 },
  { top: 65, left: 80, duration: 2.1 },
  { top: 75, left: 30, duration: 2.5 },
  { top: 85, left: 50, duration: 2.8 },
];

function StepIcon({ name }: { name: string }) {
  switch (name) {
    case "Search":
      return <Search size={32} className="text-white" />;
    case "SlidersHorizontal":
      return <SlidersHorizontal size={32} className="text-white" />;
    case "CreditCard":
      return <CreditCard size={32} className="text-white" />;
    case "Truck":
      return <Truck size={32} className="text-white" />;
    default:
      return <Sparkles size={32} className="text-white" />;
  }
}

export function StoreHowItWorks({ subdomain }: StoreHowItWorksProps) {
  const lowerSubdomain = (subdomain || "").toLowerCase();
  const isBoutique = lowerSubdomain.includes("boutique") || lowerSubdomain.includes("luxury");
  const isSports = lowerSubdomain.includes("sport");
  const isClothing = lowerSubdomain.includes("cloth");
  const configKey = isBoutique ? "boutique" : isSports ? "sports" : isClothing ? "clothing" : "electronics";

  const steps = STORE_STEPS[configKey] || STORE_STEPS.electronics;

  return (
    <section
      className={`relative py-20 md:py-28 overflow-hidden border-t transition-colors duration-300 ${
        isBoutique
          ? "bg-background border-border text-foreground"
          : isSports
          ? "bg-[#020d09] border-emerald-950/60 text-slate-100"
          : isClothing
          ? "bg-[#0b0314] border-purple-950/60 text-slate-100"
          : "bg-slate-950 border-slate-900 text-slate-100"
      }`}
    >
      {/* Background Ambient Glows for dark themes */}
      {!isBoutique && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl ${
              isSports ? "bg-emerald-500/10" : isClothing ? "bg-purple-500/10" : "bg-cyan-500/10"
            }`}
          />
          <div
            className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl ${
              isSports ? "bg-teal-500/10" : isClothing ? "bg-pink-500/10" : "bg-blue-500/10"
            }`}
          />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
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
            <PlayCircle size={14} />
            The Couture Experience
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${isBoutique ? "text-foreground" : "text-white"}`}>
            Your Journey to{" "}
            <span
              className={
                isBoutique
                  ? "text-foreground/90 underline decoration-border underline-offset-8"
                  : `bg-gradient-to-r ${
                      isSports
                        ? "from-emerald-400 via-teal-400 to-green-300"
                        : isClothing
                        ? "from-purple-400 via-fuchsia-400 to-pink-300"
                        : "from-cyan-400 via-blue-400 to-indigo-300"
                    } bg-clip-text text-transparent`
              }
            >
              {isBoutique ? "Effortless Luxury" : "Better Shopping"}
            </span>
          </h2>
          <p className={`mt-3.5 text-sm sm:text-base leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
            {isBoutique
              ? "Four seamless steps from selecting your bespoke couture piece to unboxing hand-finished elegance."
              : "Four simple steps from finding your favorite product to unboxing at your doorstep."}
          </p>
        </div>

        {/* Step Cards with Vertical Connecting Lines */}
        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;

            return (
              <div key={step.id} className="relative flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Left Column: Details (7 cols) */}
                  <div
                    className={`lg:col-span-7 ${
                      isEven ? "lg:order-2 text-center lg:text-left" : "text-center lg:text-left"
                    }`}
                  >
                    <div
                      className={`inline-block px-3 py-1 rounded-md border text-xs font-bold uppercase tracking-widest mb-3 ${
                        isBoutique
                          ? "bg-accent border-border text-foreground"
                          : isSports
                          ? "bg-slate-900/90 border-emerald-900/40 text-emerald-300"
                          : isClothing
                          ? "bg-slate-900/90 border-purple-900/40 text-purple-300"
                          : "bg-slate-900/90 border-cyan-900/40 text-cyan-300"
                      }`}
                    >
                      Step {step.id}
                    </div>
                    <h3 className={`text-2xl sm:text-3xl font-extrabold mb-3 ${isBoutique ? "text-foreground" : "text-white"}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed mb-5 max-w-xl mx-auto lg:mx-0 ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
                      {step.description}
                    </p>

                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {step.features.map((feat) => (
                        <span
                          key={feat}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium ${
                            isBoutique
                              ? "bg-card border-border text-foreground/90 shadow-xs"
                              : "bg-slate-900/80 border-slate-800 text-slate-300"
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: isBoutique ? "var(--foreground)" : step.color }}
                          />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Node Visual Icon (5 cols) */}
                  <div
                    className={`lg:col-span-5 flex justify-center ${
                      isEven ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="relative">
                      {/* Outer Ring */}
                      <div
                        className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center border-4 relative transition-transform duration-500 hover:scale-105 ${
                          isBoutique
                            ? "border-border shadow-md"
                            : "border-slate-900/80 shadow-2xl"
                        }`}
                        style={{
                          background: step.gradient,
                          boxShadow: isBoutique ? "0 10px 25px rgba(0,0,0,0.08)" : `0 0 45px ${step.color}40`,
                        }}
                      >
                        <StepIcon name={step.iconName} />

                        {/* Step Number Badge */}
                        <div
                          className={`absolute top-2 right-2 w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center text-xs sm:text-sm font-black shadow-lg ${
                            isBoutique
                              ? "bg-card border-border text-foreground"
                              : "bg-slate-950 border-white/20 text-white"
                          }`}
                        >
                          {step.id}
                        </div>

                        {/* Orbit Dot */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md animate-pulse" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Connecting Line between Steps */}
                {step.nextColor && (
                  <div className={`w-1 h-12 sm:h-16 my-4 rounded-full relative overflow-hidden ${isBoutique ? "bg-border" : "bg-slate-800"}`}>
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        background: isBoutique
                          ? "linear-gradient(to bottom, var(--muted-foreground), var(--border))"
                          : `linear-gradient(to bottom, ${step.color}, ${step.nextColor})`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ready to Shop Dynamic Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 md:mt-24 max-w-4xl mx-auto"
        >
          <div
            className={`relative overflow-hidden rounded-3xl p-8 md:p-12 text-center ${
              isBoutique
                ? "bg-card border border-border shadow-md"
                : "shadow-2xl"
            }`}
            style={
              isBoutique
                ? {}
                : {
                    background: isSports
                      ? "linear-gradient(135deg, #059669 0%, #10B981 50%, #14B8A6 100%)"
                      : isClothing
                      ? "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)"
                      : "linear-gradient(135deg, #0284C7 0%, #06B6D4 50%, #3B82F6 100%)",
                  }
            }
          >
            {/* Sparkles for dark mode */}
            {!isBoutique && (
              <div className="absolute inset-0 opacity-25 pointer-events-none">
                {CTA_SPARKLES.map((sparkle, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{ top: `${sparkle.top}%`, left: `${sparkle.left}%` }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: sparkle.duration,
                      repeat: Infinity,
                      delay: (i * 0.1) % 2,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10">
              <div className="inline-flex mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs ${
                    isBoutique
                      ? "bg-accent border border-border text-foreground"
                      : "bg-white/20 backdrop-blur-md text-white shadow-xl"
                  }`}
                >
                  <Sparkles size={28} />
                </div>
              </div>

              <h3 className={`text-3xl sm:text-4xl font-black mb-4 ${isBoutique ? "text-foreground" : "text-white"}`}>
                {isBoutique ? "Ready to Wear Timeless Elegance?" : "Ready to Upgrade Your Lifestyle?"}
              </h3>

              <p className={`text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-white/95"}`}>
                {isBoutique
                  ? "Explore our curated couture drops, custom-made bridal wear, and premium luxury pret available across Pakistan."
                  : "Join thousands of satisfied customers enjoying premium quality, fast shipping, and dependable support across Pakistan."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                <Link
                  href={`/store/${subdomain}/products`}
                  className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    isBoutique
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-white text-slate-950 hover:bg-slate-100 shadow-lg"
                  }`}
                >
                  <span>Browse Collection</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href={`/store/${subdomain}/cart`}
                  className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    isBoutique
                      ? "border border-border bg-card text-foreground hover:bg-accent shadow-xs"
                      : "bg-white/20 border border-white/30 text-white hover:bg-white/30 backdrop-blur-md"
                  }`}
                >
                  <ShoppingBag size={16} />
                  <span>View Bag</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}