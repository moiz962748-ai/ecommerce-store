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
      avatarColor: "bg-sky-50 text-sky-800 border border-sky-200",
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
      avatarColor: "bg-sky-50 text-sky-800 border border-sky-200",
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
      avatarColor: "bg-sky-50 text-sky-800 border border-sky-200",
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
      avatarColor: "bg-emerald-50 text-emerald-800 border border-emerald-200",
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
      avatarColor: "bg-emerald-50 text-emerald-800 border border-emerald-200",
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
      avatarColor: "bg-emerald-50 text-emerald-800 border border-emerald-200",
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
      avatarColor: "bg-purple-50 text-purple-800 border border-purple-200",
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
      avatarColor: "bg-purple-50 text-purple-800 border border-purple-200",
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
      avatarColor: "bg-purple-50 text-purple-800 border border-purple-200",
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
            <MessageSquare size={14} />
            {isBoutique ? "Client Experiences" : "Testimonials"}
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${isBoutique ? "text-foreground" : "text-slate-950"}`}>
            Loved by Verified{" "}
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
              Patrons
            </span>
          </h2>
          <p className={`mt-3.5 text-sm sm:text-base leading-relaxed ${isBoutique ? "text-muted-foreground" : "text-slate-600"}`}>
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
              className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 shadow-xs hover:-translate-y-1.5 ${
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
                {/* 5-Star Rating Row */}
                <div
                  className={`flex items-center gap-1 mb-4 ${
                    isBoutique
                      ? "text-foreground"
                      : isSports
                      ? "text-emerald-600"
                      : isClothing
                      ? "text-purple-600"
                      : "text-sky-600"
                  }`}
                >
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                  <span className={`text-xs font-bold ml-1.5 ${isBoutique ? "text-muted-foreground" : "text-slate-500"}`}>5.0</span>
                </div>

                {/* Review Text */}
                <p className={`text-sm leading-relaxed italic mb-5 ${isBoutique ? "text-foreground/90" : "text-slate-700"}`}>
                  "{t.comment}"
                </p>

                {/* Purchased Product Tag */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold border mb-6 shadow-xs ${
                    isBoutique
                      ? "bg-accent border-border text-foreground"
                      : isSports
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : isClothing
                      ? "bg-purple-50 border-purple-200 text-purple-800"
                      : "bg-sky-50 border-sky-200 text-sky-800"
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
                    : "border-slate-100"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                    isBoutique
                      ? "bg-accent border border-border text-foreground"
                      : t.avatarColor
                  }`}
                >
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isBoutique ? "text-foreground" : "text-slate-900"}`}>{t.name}</h4>
                  <p className={`text-xs ${isBoutique ? "text-muted-foreground" : "text-slate-500"}`}>
                    {t.role} • <span>{t.city}</span>
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
                    ? "border-emerald-200 bg-white"
                    : isClothing
                    ? "border-purple-200 bg-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div
                  className={`flex items-center gap-1 mb-3 ${
                    isBoutique
                      ? "text-foreground"
                      : isSports
                      ? "text-emerald-600"
                      : isClothing
                      ? "text-purple-600"
                      : "text-sky-600"
                  }`}
                >
                  {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                </div>

                <p className={`text-sm leading-relaxed italic mb-4 ${isBoutique ? "text-foreground/90" : "text-slate-700"}`}>
                  "{reviews[currentIndex].comment}"
                </p>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold border mb-6 ${
                    isBoutique
                      ? "bg-accent border-border text-foreground"
                      : isSports
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : isClothing
                      ? "bg-purple-50 border-purple-200 text-purple-800"
                      : "bg-sky-50 border-sky-200 text-sky-800"
                  }`}
                >
                  <CheckCircle2 size={12} />
                  <span>Ordered: {reviews[currentIndex].purchasedProduct}</span>
                </div>

                <div
                  className={`flex items-center gap-3 pt-4 border-t ${
                    isBoutique
                      ? "border-border"
                      : "border-slate-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isBoutique
                        ? "bg-accent border border-border text-foreground"
                        : reviews[currentIndex].avatarColor
                    }`}
                  >
                    {reviews[currentIndex].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isBoutique ? "text-foreground" : "text-slate-900"}`}>{reviews[currentIndex].name}</h4>
                    <p className={`text-xs ${isBoutique ? "text-muted-foreground" : "text-slate-500"}`}>
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
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shadow-xs ${
                isBoutique
                  ? "bg-card border-border text-foreground hover:bg-accent"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
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
                        ? "w-7 bg-emerald-600"
                        : isClothing
                        ? "w-7 bg-purple-600"
                        : "w-7 bg-sky-600"
                      : isBoutique
                      ? "w-2 bg-border"
                      : "w-2 bg-slate-200"
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
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shadow-xs ${
                isBoutique
                  ? "bg-card border-border text-foreground hover:bg-accent"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
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
              : "border-slate-200"
          }`}
        >
          <p className={`text-center text-xs font-bold uppercase tracking-widest mb-8 ${isBoutique ? "text-muted-foreground" : "text-slate-500"}`}>
            Trusted by Patrons Across Pakistan
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {TRUST_STATS.map((item) => (
              <div
                key={item.label}
                className={`text-center p-4 rounded-xl border shadow-xs ${
                  isBoutique
                    ? "border-border bg-card"
                    : isSports
                    ? "border-emerald-200 bg-white"
                    : isClothing
                    ? "border-purple-200 bg-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className={`text-2xl font-black ${isBoutique ? "text-foreground" : "text-slate-950"}`}>{item.value}</div>
                <div className={`text-xs font-medium mt-0.5 ${isBoutique ? "text-muted-foreground" : "text-slate-500"}`}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Review Share Prompt */}
        <div className="mt-14 text-center">
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs shadow-xs ${
              isBoutique
                ? "bg-card border-border text-foreground"
                : isSports
                ? "bg-white border-emerald-200 text-slate-700"
                : isClothing
                ? "bg-white border-purple-200 text-slate-700"
                : "bg-white border-slate-200 text-slate-700"
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
                  ? "text-emerald-700"
                  : isClothing
                  ? "text-purple-700"
                  : "text-sky-700"
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