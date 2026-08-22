"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface StoreTestimonialsProps {
  subdomain: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  avatarColor: string;
  rating: number;
  comment: string;
  purchasedProduct: string;
}

const STORE_TESTIMONIALS: Record<string, Testimonial[]> = {
  boutique: [
    {
      id: "t1",
      name: "Maham Tariq",
      role: "Bespoke Bride",
      city: "Lahore",
      avatarColor: "bg-stone-800 text-stone-100",
      rating: 5,
      comment:
        "The hand-embroidered raw silk pishwas was breathtaking. The stitching fit exactly to my custom measurements with flawless finish and timely delivery.",
      purchasedProduct: "Pure Raw Silk Pishwas",
    },
    {
      id: "t2",
      name: "Anum Siddiqui",
      role: "Stylist",
      city: "Karachi",
      avatarColor: "bg-zinc-800 text-zinc-100",
      rating: 5,
      comment:
        "Pure organza fabric with intricate zari detailing. The color vibrancy and drape look even richer in person than on screen. Truly luxury quality.",
      purchasedProduct: "Organza Festive Suit",
    },
    {
      id: "t3",
      name: "Hira Usman",
      role: "Fashion Editor",
      city: "Islamabad",
      avatarColor: "bg-neutral-800 text-neutral-100",
      rating: 5,
      comment:
        "Ordered the velvet embroidered shawl for festive season. The micro-velvet touch and scalloped border finish are pure perfection.",
      purchasedProduct: "Handcrafted Velvet Shawl",
    },
  ],
  electronics: [
    {
      id: "t1",
      name: "Ahmed Khan",
      role: "Frontend Developer",
      city: "Islamabad",
      avatarColor: "bg-cyan-600",
      rating: 5,
      comment:
        "The noise cancellation on the headphones is top tier. Received next-day delivery in Islamabad in brand new sealed packaging. 10/10 service!",
      purchasedProduct: "Sony WH-1000XM5",
    },
    {
      id: "t2",
      name: "Ayesha Malik",
      role: "UI/UX Designer",
      city: "Lahore",
      avatarColor: "bg-blue-600",
      rating: 5,
      comment:
        "Got my 4K creator monitor delivered with zero dead pixels. The color accuracy right out of the box makes video grading so effortless.",
      purchasedProduct: "Pro 4K Monitor",
    },
    {
      id: "t3",
      name: "Bilal Raza",
      role: "Software Architect",
      city: "Karachi",
      avatarColor: "bg-indigo-600",
      rating: 5,
      comment:
        "Authentic gadgets with real official warranty. Customer support guided me through spec comparison smoothly before checkout.",
      purchasedProduct: "M3 MacBook Air",
    },
  ],
  sports: [
    {
      id: "t1",
      name: "Hamza Sheikh",
      role: "Marathon Runner",
      city: "Faisalabad",
      avatarColor: "bg-emerald-600",
      rating: 5,
      comment:
        "The carbon plate running shoes improved my 10k pace drastically. Lightweight, responsive, and genuine quality build.",
      purchasedProduct: "Carbon Flow Runners",
    },
    {
      id: "t2",
      name: "Sadia Chaudhry",
      role: "Crossfit Coach",
      city: "Lahore",
      avatarColor: "bg-teal-600",
      rating: 5,
      comment:
        "Ordered adjustable dumbbells and gym mats for my home studio. Super heavy duty and durable iron grip. Highly recommended!",
      purchasedProduct: "Cast-Iron Dumbbell Set",
    },
    {
      id: "t3",
      name: "Usman Tariq",
      role: "Triathlete",
      city: "Rawalpindi",
      avatarColor: "bg-green-600",
      rating: 5,
      comment:
        "The insulated sports flask keeps water icy cold even through a 3-hour outdoor cycling route in peak summer heat.",
      purchasedProduct: "Thermal Insulated Gym Flask",
    },
  ],
  clothing: [
    {
      id: "t1",
      name: "Zainab Fatima",
      role: "Fashion Enthusiast",
      city: "Islamabad",
      avatarColor: "bg-purple-600",
      rating: 5,
      comment:
        "The heavy cotton texture of the oversized tee is immaculate. Has survived multiple laundry cycles without fading or shrinkage.",
      purchasedProduct: "Heavyweight Boxy Tee",
    },
    {
      id: "t2",
      name: "Danyal Mirza",
      role: "Creative Director",
      city: "Karachi",
      avatarColor: "bg-pink-600",
      rating: 5,
      comment:
        "Super clean tailored fit on the relaxed denim. The silhouette pairs perfectly with both chunky sneakers and boots.",
      purchasedProduct: "Relaxed Fit Selvedge Denim",
    },
    {
      id: "t3",
      name: "Mahnoor Noor",
      role: "Stylist",
      city: "Peshawar",
      avatarColor: "bg-fuchsia-600",
      rating: 5,
      comment:
        "Seamless doorstep delivery and packaging was premium. Fits true to the sizing chart with zero hassle exchanges.",
      purchasedProduct: "Minimalist Wool Coat",
    },
  ],
};

const TRUST_STATS = [
  { value: "1,200+", label: "Happy Shoppers", icon: "🛍️" },
  { value: "99.4%", label: "5-Star Rating", icon: "⭐" },
  { value: "48 Hr", label: "Express Dispatch", icon: "⚡" },
  { value: "< 1%", label: "Return Rate", icon: "🛡️" },
];

export function StoreTestimonials({ subdomain }: StoreTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const lowerSubdomain = (subdomain || "").toLowerCase();
  const isBoutique = lowerSubdomain.includes("boutique") || lowerSubdomain.includes("luxury");
  const isSports = lowerSubdomain.includes("sport");
  const isClothing = lowerSubdomain.includes("cloth");
  const configKey = isBoutique ? "boutique" : isSports ? "sports" : isClothing ? "clothing" : "electronics";

  const reviews = STORE_TESTIMONIALS[configKey] || STORE_TESTIMONIALS.electronics;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, reviews.length]);

  return (
    <section
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
      {/* Background Glows for dark themes */}
      {!isBoutique && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
              isSports ? "bg-emerald-500/10" : isClothing ? "bg-purple-500/10" : "bg-cyan-500/10"
            }`}
          />
          <div
            className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${
              isSports ? "bg-teal-500/10" : isClothing ? "bg-pink-500/10" : "bg-blue-500/10"
            }`}
          />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
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
            <MessageSquare size={14} />
            {isBoutique ? "Client Experiences" : "Testimonials"}
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${isBoutique ? "text-foreground" : "text-white"}`}>
            Loved by Verified{" "}
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
              Patrons
            </span>
          </h2>
          <p className={`mt-3.5 text-sm sm:text-base leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
            {isBoutique
              ? "Read honest words from clients across Pakistan who trust our atelier for pure fabrics, bespoke craftsmanship, and timely delivery."
              : "Real feedback from shoppers across Pakistan who trust our platform for quality, authenticity, and speed."}
          </p>
        </div>

        {/* Desktop 3-Card Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reviews.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
                isBoutique
                  ? "border-border bg-card shadow-xs hover:border-foreground/20 hover:shadow-md"
                  : isSports
                  ? "border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/90 shadow-xl backdrop-blur-md"
                  : isClothing
                  ? "border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/90 shadow-xl backdrop-blur-md"
                  : "border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90 shadow-xl backdrop-blur-md"
              }`}
            >
              <div>
                {/* 5-Star Rating Row */}
                <div
                  className={`flex items-center gap-1 mb-4 ${
                    isBoutique
                      ? "text-foreground"
                      : isSports
                      ? "text-emerald-400"
                      : isClothing
                      ? "text-purple-400"
                      : "text-cyan-400"
                  }`}
                >
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                  <span className={`text-xs font-bold ml-1.5 ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>5.0</span>
                </div>

                {/* Review Text */}
                <p className={`text-sm leading-relaxed italic mb-5 ${isBoutique ? "text-foreground/90" : "text-slate-300"}`}>
                  "{t.comment}"
                </p>

                {/* Purchased Product Tag */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold border mb-6 ${
                    isBoutique
                      ? "bg-accent border-border text-foreground"
                      : isSports
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : isClothing
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                      : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                  }`}
                >
                  <CheckCircle2 size={12} />
                  <span>Ordered: {t.purchasedProduct}</span>
                </div>
              </div>

              {/* User Avatar + Details */}
              <div
                className={`flex items-center gap-3 pt-4 border-t ${
                  isBoutique
                    ? "border-border"
                    : isSports
                    ? "border-emerald-950/80"
                    : isClothing
                    ? "border-purple-950/80"
                    : "border-slate-800/80"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                    isBoutique
                      ? "bg-accent border border-border text-foreground"
                      : `${t.avatarColor} text-white shadow-md`
                  }`}
                >
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isBoutique ? "text-foreground" : "text-white"}`}>{t.name}</h4>
                  <p className={`text-xs ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
                    {t.role} • <span className={isBoutique ? "text-muted-foreground/80" : "text-slate-500"}>{t.city}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel View */}
        <div className="md:hidden mb-12">
          <div className="min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl border p-6 shadow-xs ${
                  isBoutique
                    ? "border-border bg-card"
                    : isSports
                    ? "border-emerald-900/50 bg-slate-900/90 backdrop-blur-md shadow-xl"
                    : isClothing
                    ? "border-purple-900/50 bg-slate-900/90 backdrop-blur-md shadow-xl"
                    : "border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl"
                }`}
              >
                <div
                  className={`flex items-center gap-1 mb-3 ${
                    isBoutique
                      ? "text-foreground"
                      : isSports
                      ? "text-emerald-400"
                      : isClothing
                      ? "text-purple-400"
                      : "text-cyan-400"
                  }`}
                >
                  {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                </div>

                <p className={`text-sm leading-relaxed italic mb-4 ${isBoutique ? "text-foreground/90" : "text-slate-300"}`}>
                  "{reviews[currentIndex].comment}"
                </p>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold border mb-6 ${
                    isBoutique
                      ? "bg-accent border-border text-foreground"
                      : isSports
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : isClothing
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                      : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                  }`}
                >
                  <CheckCircle2 size={12} />
                  <span>Ordered: {reviews[currentIndex].purchasedProduct}</span>
                </div>

                <div
                  className={`flex items-center gap-3 pt-4 border-t ${
                    isBoutique
                      ? "border-border"
                      : isSports
                      ? "border-emerald-950"
                      : isClothing
                      ? "border-purple-950"
                      : "border-slate-800"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isBoutique
                        ? "bg-accent border border-border text-foreground"
                        : `${reviews[currentIndex].avatarColor} text-white`
                    }`}
                  >
                    {reviews[currentIndex].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isBoutique ? "text-foreground" : "text-white"}`}>{reviews[currentIndex].name}</h4>
                    <p className={`text-xs ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
                      {reviews[currentIndex].role} • {reviews[currentIndex].city}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Arrows & Dots */}
          <div className="flex items-center justify-between mt-5">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
              }}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                isBoutique
                  ? "bg-card border-border text-foreground hover:bg-accent"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === i
                      ? isBoutique
                        ? "w-7 bg-primary"
                        : isSports
                        ? "w-7 bg-emerald-500"
                        : isClothing
                        ? "w-7 bg-purple-500"
                        : "w-7 bg-cyan-500"
                      : isBoutique
                      ? "w-2 bg-border"
                      : "w-2 bg-slate-800"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex((prev) => (prev + 1) % reviews.length);
              }}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                isBoutique
                  ? "bg-card border-border text-foreground hover:bg-accent"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Trust Stats Bar */}
        <div
          className={`pt-12 md:pt-16 border-t ${
            isBoutique
              ? "border-border"
              : isSports
              ? "border-emerald-950/80"
              : isClothing
              ? "border-purple-950/80"
              : "border-slate-900"
          }`}
        >
          <p className={`text-center text-xs font-bold uppercase tracking-widest mb-8 ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>
            Trusted by Patrons Across Pakistan
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {TRUST_STATS.map((item) => (
              <div
                key={item.label}
                className={`text-center p-4 rounded-xl border ${
                  isBoutique
                    ? "border-border bg-card shadow-xs"
                    : isSports
                    ? "border-emerald-900/30 bg-slate-900/40 backdrop-blur-sm"
                    : isClothing
                    ? "border-purple-900/30 bg-slate-900/40 backdrop-blur-sm"
                    : "border-slate-900 bg-slate-900/40 backdrop-blur-sm"
                }`}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className={`text-2xl font-black ${isBoutique ? "text-foreground" : "text-white"}`}>{item.value}</div>
                <div className={`text-xs font-medium mt-0.5 ${isBoutique ? "text-muted-foreground" : "text-slate-400"}`}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Review Share Prompt */}
        <div className="mt-14 text-center">
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs ${
              isBoutique
                ? "bg-card border-border text-foreground shadow-xs"
                : isSports
                ? "bg-slate-900/80 border-emerald-900/50 text-slate-300"
                : isClothing
                ? "bg-slate-900/80 border-purple-900/50 text-slate-300"
                : "bg-slate-900/80 border-slate-800 text-slate-300"
            }`}
          >
            <span>💬</span>
            <span>Have feedback about your order?</span>
            <Link
              href={`/store/${subdomain}#contact`}
              className={`font-bold hover:underline ${
                isBoutique
                  ? "text-foreground"
                  : isSports
                  ? "text-emerald-400"
                  : isClothing
                  ? "text-purple-400"
                  : "text-cyan-400"
              }`}
            >
              Share your review →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}