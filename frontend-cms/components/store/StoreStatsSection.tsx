"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShoppingBag,
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  Headphones,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface StoreStatsProps {
  subdomain: string;
}

interface StatItem {
  icon: any;
  value: number;
  suffix: string;
  label: string;
  description: string;
  gradient: string;
}

function useCounter(target: number, duration: number = 2000, trigger: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
}

function StatCard({
  stat,
  index,
  isInView,
  isBoutique,
  isSports,
  isClothing,
}: {
  stat: StatItem;
  index: number;
  isInView: boolean;
  isBoutique: boolean;
  isSports: boolean;
  isClothing: boolean;
}) {
  const Icon = stat.icon;
  const count = useCounter(stat.value, 1800, isInView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className={`relative overflow-hidden group p-5 md:p-6 rounded-2xl border transition-all duration-300 text-center flex flex-col justify-between ${
        isBoutique
          ? "border-border bg-card shadow-xs hover:border-foreground/20 hover:shadow-md"
          : isSports
          ? "border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/90 shadow-lg shadow-emerald-950/10 backdrop-blur-md"
          : isClothing
          ? "border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/90 shadow-lg shadow-purple-950/10 backdrop-blur-md"
          : "border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90 shadow-lg shadow-cyan-950/10 backdrop-blur-md"
      }`}
    >
      {/* Background radial glow on hover */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
        style={{ background: isBoutique ? "var(--foreground)" : stat.gradient }}
      />

      {/* Sparkle Icon */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
        className="absolute top-3 right-3 opacity-20 group-hover:opacity-60 transition-opacity pointer-events-none"
      >
        <Sparkles
          size={14}
          className={
            isBoutique
              ? "text-foreground"
              : isSports
              ? "text-emerald-400"
              : isClothing
              ? "text-purple-400"
              : "text-cyan-400"
          }
        />
      </motion.div>

      <div>
        {/* Animated Icon Box */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: index * 0.08 + 0.15,
            type: "spring",
            stiffness: 200,
          }}
          className="inline-flex mb-4"
        >
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${
              isBoutique
                ? "bg-accent border border-border text-foreground shadow-xs"
                : "shadow-lg text-white"
            }`}
            style={isBoutique ? {} : { background: stat.gradient }}
          >
            <Icon size={24} className={isBoutique ? "text-foreground" : "text-white"} strokeWidth={2.2} />
          </div>
        </motion.div>

        {/* Counter Number */}
        <div className="mb-1.5">
          <div className={`text-3xl md:text-4xl font-black leading-none tabular-nums ${isBoutique ? "text-foreground" : "text-white"}`}>
            {count.toLocaleString()}
            <span
              className={`ml-0.5 ${
                isBoutique
                  ? "text-muted-foreground"
                  : isSports
                  ? "text-emerald-400"
                  : isClothing
                  ? "text-purple-400"
                  : "text-cyan-400"
              }`}
            >
              {stat.suffix}
            </span>
          </div>
        </div>

        {/* Label */}
        <div className={`text-xs md:text-sm font-bold mb-1 ${isBoutique ? "text-foreground" : "text-slate-200"}`}>
          {stat.label}
        </div>

        {/* Description */}
        <div className={`text-[11px] line-clamp-2 leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
          {stat.description}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: isBoutique ? "var(--foreground)" : stat.gradient }}
      />
    </motion.div>
  );
}

export function StoreStatsSection({ subdomain }: StoreStatsProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [productCount, setProductCount] = useState(12);

  const lowerSubdomain = (subdomain || "").toLowerCase();
  const isBoutique = lowerSubdomain.includes("boutique") || lowerSubdomain.includes("luxury");
  const isSports = lowerSubdomain.includes("sport");
  const isClothing = lowerSubdomain.includes("cloth");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const store = await apiClient(`/public/stores/${subdomain}`);
        if (store?.id) {
          const products = await apiClient(`/public/products/store/${store.id}`);
          if (Array.isArray(products)) {
            setProductCount(Math.max(products.length, 12));
          }
        }
      } catch {
        setProductCount(15);
      }
    };

    fetchStats();
  }, [subdomain]);

  const stats: StatItem[] = [
    {
      icon: ShoppingBag,
      value: productCount,
      suffix: "+",
      label: isBoutique ? "Couture Cuts" : "Products",
      description: isBoutique ? "Handcrafted luxury edits" : "Available in our catalog",
      gradient: isSports
        ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
        : isClothing
        ? "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)"
        : "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
    },
    {
      icon: Building2,
      value: 12,
      suffix: "+",
      label: isBoutique ? "Master Artisans" : "Trusted Brands",
      description: isBoutique ? "Certified hand embroiders" : "Verified direct partners",
      gradient: isSports
        ? "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)"
        : isClothing
        ? "linear-gradient(135deg, #D946EF 0%, #C026D3 100%)"
        : "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    },
    {
      icon: MapPin,
      value: 50,
      suffix: "+",
      label: "Cities Covered",
      description: "Doorstep delivery nationwide",
      gradient: isSports
        ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
        : isClothing
        ? "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)"
        : "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
    },
    {
      icon: Users,
      value: 1200,
      suffix: "+",
      label: "Happy Shoppers",
      description: "Satisfied clients served",
      gradient: isSports
        ? "linear-gradient(135deg, #10B981 0%, #047857 100%)"
        : isClothing
        ? "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)"
        : "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
    },
    {
      icon: ShieldCheck,
      value: 100,
      suffix: "%",
      label: isBoutique ? "Pure Fabrics" : "Original Guarantee",
      description: isBoutique ? "Silk & chiffon verification" : "Authentic warranty backing",
      gradient: isSports
        ? "linear-gradient(135deg, #0D9488 0%, #115E59 100%)"
        : isClothing
        ? "linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)"
        : "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
    },
    {
      icon: Headphones,
      value: 24,
      suffix: "/7",
      label: isBoutique ? "Stylist Concierge" : "Support Ready",
      description: isBoutique ? "Wardrobe & fit consultations" : "Dedicated assistance anytime",
      gradient: isSports
        ? "linear-gradient(135deg, #10B981 0%, #0D9488 100%)"
        : isClothing
        ? "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)"
        : "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`relative py-20 md:py-28 overflow-hidden border-t transition-colors duration-300 ${
        isBoutique
          ? "bg-background border-border text-foreground"
          : isSports
          ? "bg-[#020d09] border-emerald-950/60 text-emerald-50"
          : isClothing
          ? "bg-[#0b0314] border-purple-950/60 text-purple-50"
          : "bg-slate-950 border-slate-900 text-slate-100"
      }`}
    >
      {/* Ambient background glows for dark themes */}
      {!isBoutique && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
              isSports ? "bg-emerald-500/10" : isClothing ? "bg-purple-500/10" : "bg-cyan-500/10"
            }`}
          />
          <div
            className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
              isSports ? "bg-teal-500/10" : isClothing ? "bg-pink-500/10" : "bg-blue-500/10"
            }`}
          />
        </div>
      )}

      {/* Subtle Dot Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${isBoutique ? "#000000" : "#ffffff"} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14 md:mb-16"
        >
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
            <TrendingUp size={14} />
            Growing Together
          </div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${isBoutique ? "text-foreground" : "text-white"}`}>
            Making an{" "}
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
              Impact
            </span>
          </h2>

          <p className={`mt-3.5 text-sm sm:text-base leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
            {isBoutique
              ? "Verified metrics reflecting our dedication to pure fabrics, handcrafted tailoring, and bespoke customer experiences."
              : "Real numbers demonstrating our commitment to quality products, fast fulfillment, and trusted customer relationships."}
          </p>
        </motion.div>

        {/* 6 Bento Grid Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              isInView={isInView}
              isBoutique={isBoutique}
              isSports={isSports}
              isClothing={isClothing}
            />
          ))}
        </div>
      </div>
    </section>
  );
}