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
          ? "bg-[#f4fbf7] border-emerald-200/80 text-slate-900"
          : isClothing
          ? "bg-[#faf7fc] border-purple-200/80 text-slate-900"
          : "bg-[#f8fafc] border-slate-200 text-slate-900"
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
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                isBoutique
                  ? "bg-accent border border-border text-foreground"
                  : isSports
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : isClothing
                  ? "bg-purple-50 border border-purple-200 text-purple-700"
                  : "bg-sky-50 border border-sky-200 text-sky-700"
              }`}
            >
              <Clock size={18} />
            </div>

            <div>
              <h2 className={`text-xl md:text-2xl font-black ${isBoutique ? "text-foreground" : "text-slate-950"}`}>
                Recently{" "}
                <span
                  className={
                    isBoutique
                      ? "text-foreground/90 underline decoration-border underline-offset-4"
                      : isSports
                      ? "text-emerald-700 underline decoration-emerald-300 underline-offset-4"
                      : isClothing
                      ? "text-purple-700 underline decoration-purple-300 underline-offset-4"
                      : "text-sky-700 underline decoration-sky-300 underline-offset-4"
                  }
                >
                  Viewed
                </span>
              </h2>
              <p className={`text-xs mt-0.5 ${isBoutique ? "text-muted-foreground" : "text-slate-500"}`}>
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
                  : "text-slate-400 hover:text-rose-600"
              }`}
            >
              <Trash2 size={13} />
              Clear history
            </button>

            <Link
              href={`/store/${subdomain}/products`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                isBoutique
                  ? "border-border bg-card text-foreground hover:bg-accent"
                  : isSports
                  ? "border-emerald-200 bg-white text-slate-800 hover:border-emerald-400 hover:text-emerald-700"
                  : isClothing
                  ? "border-purple-200 bg-white text-slate-800 hover:border-purple-400 hover:text-purple-700"
                  : "border-slate-200 bg-white text-slate-800 hover:border-sky-400 hover:text-sky-700"
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
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 shadow-xs ${
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
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${
                      isBoutique
                        ? "bg-accent border-border text-foreground/80"
                        : isSports
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : isClothing
                        ? "bg-purple-50 text-purple-800 border-purple-200"
                        : "bg-sky-50 text-sky-800 border-sky-200"
                    }`}
                  >
                    {prod.category || "Viewed"}
                  </span>
                  <span className={`text-[11px] ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>Recent</span>
                </div>

                <h3
                  className={`text-base font-bold transition-colors line-clamp-1 ${
                    isBoutique
                      ? "text-foreground group-hover:text-foreground/80"
                      : isSports
                      ? "text-slate-900 group-hover:text-emerald-700"
                      : isClothing
                      ? "text-slate-900 group-hover:text-purple-700"
                      : "text-slate-900 group-hover:text-sky-700"
                  }`}
                >
                  {prod.name}
                </h3>
              </div>

              <div
                className={`mt-5 pt-4 border-t flex items-center justify-between ${
                  isBoutique
                    ? "border-border"
                    : "border-slate-100"
                }`}
              >
                <div>
                  <span className={`text-[10px] uppercase tracking-widest block font-medium ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
                    Price
                  </span>
                  <span className={`text-sm font-black ${isBoutique ? "text-foreground" : "text-slate-950"}`}>
                    Rs. {Number(prod.price).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/store/${subdomain}/products/${prod.id}`}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors shadow-xs ${
                      isBoutique
                        ? "bg-card border-border text-foreground hover:bg-accent"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
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
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : isClothing
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-sky-600 hover:bg-sky-700 text-white"
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