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
      color: "#0284C7",
      gradient: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
      nextColor: "#0284C7",
    },
    {
      id: 2,
      iconName: "SlidersHorizontal",
      title: "Compare & Customize",
      description:
        "Filter by technical specs, storage, processor generation, or price to find the exact setup for your daily workflow.",
      features: ["Smart specs filter", "Live stock check", "Price match"],
      color: "#0284C7",
      gradient: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
      nextColor: "#0284C7",
    },
    {
      id: 3,
      iconName: "CreditCard",
      title: "Secure Instant Checkout",
      description:
        "Add to cart and checkout smoothly with encrypted payment channels or Cash on Delivery across Pakistan.",
      features: ["Encrypted checkout", "Cash on delivery", "Instant confirmation"],
      color: "#0284C7",
      gradient: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
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
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      nextColor: "#059669",
    },
    {
      id: 2,
      iconName: "SlidersHorizontal",
      title: "Filter by Activity",
      description:
        "Filter gear by workout type, endurance level, weight classes, or preferred colorways with quick sorting.",
      features: ["Fitness filters", "Weight variants", "Quick sort"],
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
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
      nextColor: "#059669",
    },
    {
      id: 4,
      iconName: "Truck",
      title: "Doorstep Dispatch",
      description:
        "Quick dispatch so you never miss a workout session. Free express delivery on orders over Rs. 3,000.",
      features: ["48-hour delivery", "Verified courier", "Hassle-free exchange"],
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
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
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
      nextColor: "#7C3AED",
    },
    {
      id: 2,
      iconName: "SlidersHorizontal",
      title: "Pick Your Fit & Color",
      description:
        "Use size charts and fit selectors to choose the perfect silhouette tailored to your look and comfort.",
      features: ["Accurate size chart", "Color swatches", "Fabric details"],
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
      nextColor: "#7C3AED",
    },
    {
      id: 3,
      iconName: "CreditCard",
      title: "One-Click Shopping",
      description:
        "Checkout seamlessly with direct cards or Cash on Delivery with zero hidden convenience charges.",
      features: ["No hidden fees", "Secure payment", "Instant tracking code"],
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
      nextColor: "#7C3AED",
    },
    {
      id: 4,
      iconName: "Truck",
      title: "Delivered in Style",
      description:
        "Custom packaged deliveries with flexible 7-day doorstep size exchanges and return guarantee.",
      features: ["Eco-friendly packaging", "Size exchange", "7-day return policy"],
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
      nextColor: null,
    },
  ],
};

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
          ? "bg-[#f4fbf7] border-emerald-200/80 text-slate-900"
          : isClothing
          ? "bg-[#faf7fc] border-purple-200/80 text-slate-900"
          : "bg-[#f8fafc] border-slate-200 text-slate-900"
      }`}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
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
            <PlayCircle size={14} />
            {isBoutique ? "The Couture Experience" : "Simple Process"}
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${isBoutique ? "text-foreground" : "text-slate-950"}`}>
            Your Journey to{" "}
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
              {isBoutique ? "Effortless Luxury" : "Better Shopping"}
            </span>
          </h2>
          <p className={`mt-3.5 text-sm sm:text-base leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-600"}`}>
            {isBoutique
              ? "Four seamless steps from selecting your bespoke couture piece to unboxing hand-finished elegance."
              : "Four simple steps from finding your favorite product to unboxing at your doorstep."}
          </p>
        </div>

        {/* Step Cards */}
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
                  {/* Left Column: Details */}
                  <div
                    className={`lg:col-span-7 ${
                      isEven ? "lg:order-2 text-center lg:text-left" : "text-center lg:text-left"
                    }`}
                  >
                    <div
                      className={`inline-block px-3 py-1 rounded-md border text-xs font-bold uppercase tracking-widest mb-3 shadow-xs ${
                        isBoutique
                          ? "bg-accent border-border text-foreground"
                          : isSports
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : isClothing
                          ? "bg-purple-50 border-purple-200 text-purple-800"
                          : "bg-sky-50 border-sky-200 text-sky-800"
                      }`}
                    >
                      Step {step.id}
                    </div>
                    <h3 className={`text-2xl sm:text-3xl font-extrabold mb-3 ${isBoutique ? "text-foreground" : "text-slate-950"}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed mb-5 max-w-xl mx-auto lg:mx-0 ${isBoutique ? "text-muted-foreground" : "text-slate-600"}`}>
                      {step.description}
                    </p>

                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {step.features.map((feat) => (
                        <span
                          key={feat}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium shadow-xs ${
                            isBoutique
                              ? "bg-card border-border text-foreground/90"
                              : "bg-white border-slate-200 text-slate-700"
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

                  {/* Right Column: Node Visual Icon */}
                  <div
                    className={`lg:col-span-5 flex justify-center ${
                      isEven ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center border-4 relative transition-transform duration-500 hover:scale-105 ${
                          isBoutique
                            ? "border-border shadow-md"
                            : "border-white shadow-xl"
                        }`}
                        style={{
                          background: step.gradient,
                          boxShadow: isBoutique
                            ? "0 10px 25px rgba(0,0,0,0.08)"
                            : `0 10px 30px ${step.color}35`,
                        }}
                      >
                        <StepIcon name={step.iconName} />

                        {/* Step Number Badge */}
                        <div
                          className={`absolute top-2 right-2 w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center text-xs sm:text-sm font-black shadow-md ${
                            isBoutique
                              ? "bg-card border-border text-foreground"
                              : "bg-white border-slate-200 text-slate-900"
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
                  <div className={`w-1 h-12 sm:h-16 my-4 rounded-full relative overflow-hidden ${isBoutique ? "bg-border" : "bg-slate-200"}`}>
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

        {/* Ready to Shop Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 md:mt-24 max-w-4xl mx-auto"
        >
          <div
            className={`relative overflow-hidden rounded-3xl p-8 md:p-12 text-center border shadow-sm ${
              isBoutique
                ? "bg-card border-border"
                : isSports
                ? "bg-white border-emerald-200"
                : isClothing
                ? "bg-white border-purple-200"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="relative z-10">
              <div className="inline-flex mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs border ${
                    isBoutique
                      ? "bg-accent border-border text-foreground"
                      : isSports
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : isClothing
                      ? "bg-purple-50 border-purple-200 text-purple-700"
                      : "bg-sky-50 border-sky-200 text-sky-700"
                  }`}
                >
                  <Sparkles size={28} />
                </div>
              </div>

              <h3 className={`text-3xl sm:text-4xl font-black mb-4 ${isBoutique ? "text-foreground" : "text-slate-950"}`}>
                {isBoutique ? "Ready to Wear Timeless Elegance?" : "Ready to Upgrade Your Experience?"}
              </h3>

              <p className={`text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-600"}`}>
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
                      : isSports
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : isClothing
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }`}
                >
                  <span>Browse Collection</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href={`/store/${subdomain}/cart`}
                  className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all border shadow-xs ${
                    isBoutique
                      ? "border-border bg-card text-foreground hover:bg-accent"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <ShoppingBag size={16} className={isBoutique ? "text-muted-foreground" : "text-slate-500"} />
                  <span>{isBoutique ? "View Bag" : "View Cart"}</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}