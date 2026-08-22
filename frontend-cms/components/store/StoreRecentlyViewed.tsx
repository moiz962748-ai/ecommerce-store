"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Trash2, ShoppingBag, Eye } from "lucide-react";

interface StoreRecentlyViewedProps {
  subdomain: string;
}

interface ViewedProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  subdomain?: string;
}

export function StoreRecentlyViewed({ subdomain }: StoreRecentlyViewedProps) {
  const [items, setItems] = useState<ViewedProduct[]>([]);
  const storageKey = `recently_viewed_${subdomain}`;

  const lowerSub = (subdomain || "").toLowerCase();
  const isBoutique = lowerSub.includes("boutique") || lowerSub.includes("luxury");
  const isSports = lowerSub.includes("sport");
  const isClothing = lowerSub.includes("cloth");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.slice(0, 3));
        }
      }
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  const clearHistory = () => {
    try {
      localStorage.removeItem(storageKey);
      setItems([]);
    } catch {}
  };

  if (items.length < 2) return null;

  return (
    <section
      className={`relative py-14 md:py-20 border-t transition-colors duration-300 ${
        isBoutique
          ? "bg-background border-border text-foreground"
          : isSports
          ? "bg-[#020d09] border-emerald-950/60 text-emerald-50"
          : isClothing
          ? "bg-[#0b0314] border-purple-950/60 text-purple-50"
          : "bg-slate-950 border-slate-900 text-slate-100"
      }`}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b ${
            isBoutique
              ? "border-border"
              : isSports
              ? "border-emerald-900/40"
              : isClothing
              ? "border-purple-900/40"
              : "border-slate-800/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isBoutique
                  ? "bg-accent border border-border text-foreground shadow-xs"
                  : isSports
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20 text-slate-950"
                  : isClothing
                  ? "bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/20 text-white"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20 text-slate-950"
              }`}
            >
              <Clock size={18} />
            </div>

            <div>
              <h2 className={`text-xl md:text-2xl font-black ${isBoutique ? "text-foreground" : "text-white"}`}>
                Recently{" "}
                <span
                  className={
                    isBoutique
                      ? "text-foreground/90 underline decoration-border underline-offset-4"
                      : `bg-gradient-to-r ${
                          isSports
                            ? "from-emerald-400 via-teal-400 to-green-300"
                            : isClothing
                            ? "from-purple-400 via-fuchsia-400 to-pink-300"
                            : "from-cyan-400 via-blue-400 to-indigo-300"
                        } bg-clip-text text-transparent`
                  }
                >
                  Viewed
                </span>
              </h2>
              <p className={`text-xs mt-0.5 ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
                {isBoutique ? "Pick up where you left off in our collection" : "Continue exploring where you left off"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearHistory}
              className={`inline-flex items-center gap-1 text-xs transition-colors ${
                isBoutique
                  ? "text-muted-foreground hover:text-destructive"
                  : "text-slate-400 hover:text-rose-400"
              }`}
            >
              <Trash2 size={13} />
              Clear history
            </button>

            <Link
              href={`/store/${subdomain}/products`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                isBoutique
                  ? "border-border bg-card text-foreground hover:bg-accent shadow-xs"
                  : isSports
                  ? "border-emerald-900/50 bg-slate-900/80 text-emerald-300 hover:bg-emerald-950/60 hover:border-emerald-500/40"
                  : isClothing
                  ? "border-purple-900/50 bg-slate-900/80 text-purple-300 hover:bg-purple-950/60 hover:border-purple-500/40"
                  : "border-slate-800 bg-slate-900/80 text-cyan-300 hover:bg-slate-800 hover:border-cyan-500/40"
              }`}
            >
              <span>{isBoutique ? "View Catalog" : "Browse All"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Recently Viewed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((prod, index) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                isBoutique
                  ? "border-border bg-card shadow-xs hover:border-foreground/20 hover:shadow-md"
                  : isSports
                  ? "border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/90 shadow-lg"
                  : isClothing
                  ? "border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/90 shadow-lg"
                  : "border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90 shadow-lg"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isBoutique
                        ? "bg-accent border-border text-foreground/80"
                        : isSports
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : isClothing
                        ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                        : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                    }`}
                  >
                    {prod.category || "Viewed"}
                  </span>
                  <span className={`text-[11px] ${isBoutique ? "text-muted-foreground" : "text-slate-500"}`}>Recent</span>
                </div>

                <h3
                  className={`text-base font-bold transition-colors line-clamp-1 ${
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
              </div>

              <div
                className={`mt-5 pt-4 border-t flex items-center justify-between ${
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
                  <span className={`text-sm font-black ${isBoutique ? "text-foreground" : "text-white"}`}>
                    Rs. {Number(prod.price).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/store/${subdomain}/products/${prod.id}`}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                      isBoutique
                        ? "bg-card border-border text-foreground hover:bg-accent"
                        : "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <Eye size={14} />
                  </Link>

                  <Link
                    href={`/store/${subdomain}/products/${prod.id}`}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                      isBoutique
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : isSports
                        ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                        : isClothing
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                    }`}
                  >
                    <ShoppingBag size={13} />
                    <span>View</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}