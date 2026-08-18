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
  const isSports = lowerSubdomain.includes("sport");
  const isClothing = lowerSubdomain.includes("cloth");
  const configKey = isSports ? "sports" : isClothing ? "clothing" : "electronics";

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
        isSports
          ? "bg-[#020d09] border-emerald-950/60 text-emerald-50"
          : isClothing
          ? "bg-[#0b0314] border-purple-950/60 text-purple-50"
          : "bg-slate-950 border-slate-900 text-slate-100"
      }`}
    >
      {/* Background Glows */}
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4 ${
              isSports
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : isClothing
                ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
            }`}
          >
            <MessageSquare size={14} />
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Loved by Verified{" "}
            <span
              className={`bg-gradient-to-r ${
                isSports
                  ? "from-emerald-400 via-teal-400 to-green-300"
                  : isClothing
                  ? "from-purple-400 via-fuchsia-400 to-pink-300"
                  : "from-cyan-400 via-blue-400 to-indigo-300"
              } bg-clip-text text-transparent`}
            >
              Customers
            </span>
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-400 leading-relaxed">
            Real feedback from shoppers across Pakistan who trust our platform for quality, authenticity, and speed.
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
              className={`relative flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 shadow-xl ${
                isSports
                  ? "border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/90"
                  : isClothing
                  ? "border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900/90"
                  : "border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90"
              }`}
            >
              <div>
                {/* 5-Star Rating Row */}
                <div
                  className={`flex items-center gap-1 mb-4 ${
                    isSports ? "text-emerald-400" : isClothing ? "text-purple-400" : "text-cyan-400"
                  }`}
                >
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                  <span className="text-xs font-bold text-slate-400 ml-1.5">5.0</span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-slate-300 leading-relaxed italic mb-5">
                  "{t.comment}"
                </p>

                {/* Purchased Product Tag */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold border mb-6 ${
                    isSports
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : isClothing
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                      : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                  }`}
                >
                  <CheckCircle2 size={12} />
                  <span>Bought: {t.purchasedProduct}</span>
                </div>
              </div>

              {/* User Avatar + Details */}
              <div
                className={`flex items-center gap-3 pt-4 border-t ${
                  isSports
                    ? "border-emerald-950/80"
                    : isClothing
                    ? "border-purple-950/80"
                    : "border-slate-800/80"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${t.avatarColor} flex items-center justify-center font-bold text-white text-xs shadow-md`}
                >
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400">
                    {t.role} • <span className="text-slate-500">{t.city}</span>
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
                className={`rounded-2xl border p-6 backdrop-blur-md shadow-xl ${
                  isSports
                    ? "border-emerald-900/50 bg-slate-900/90"
                    : isClothing
                    ? "border-purple-900/50 bg-slate-900/90"
                    : "border-slate-800 bg-slate-900/90"
                }`}
              >
                <div
                  className={`flex items-center gap-1 mb-3 ${
                    isSports ? "text-emerald-400" : isClothing ? "text-purple-400" : "text-cyan-400"
                  }`}
                >
                  {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic mb-4">
                  "{reviews[currentIndex].comment}"
                </p>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold border mb-6 ${
                    isSports
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : isClothing
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                      : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                  }`}
                >
                  <CheckCircle2 size={12} />
                  <span>Bought: {reviews[currentIndex].purchasedProduct}</span>
                </div>

                <div
                  className={`flex items-center gap-3 pt-4 border-t ${
                    isSports
                      ? "border-emerald-950"
                      : isClothing
                      ? "border-purple-950"
                      : "border-slate-800"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${reviews[currentIndex].avatarColor} flex items-center justify-center font-bold text-white text-xs`}
                  >
                    {reviews[currentIndex].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{reviews[currentIndex].name}</h4>
                    <p className="text-xs text-slate-400">
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
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
              }}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === i
                      ? isSports
                        ? "w-7 bg-emerald-500"
                        : isClothing
                        ? "w-7 bg-purple-500"
                        : "w-7 bg-cyan-500"
                      : "w-2 bg-slate-800"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex((prev) => (prev + 1) % reviews.length);
              }}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Trust Stats Bar */}
        <div
          className={`pt-12 md:pt-16 border-t ${
            isSports
              ? "border-emerald-950/80"
              : isClothing
              ? "border-purple-950/80"
              : "border-slate-900"
          }`}
        >
          <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
            Trusted by Shoppers Across Pakistan
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {TRUST_STATS.map((item) => (
              <div
                key={item.label}
                className={`text-center p-4 rounded-xl border backdrop-blur-sm ${
                  isSports
                    ? "border-emerald-900/30 bg-slate-900/40"
                    : isClothing
                    ? "border-purple-900/30 bg-slate-900/40"
                    : "border-slate-900 bg-slate-900/40"
                }`}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-2xl font-black text-white">{item.value}</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Review Share Prompt */}
        <div className="mt-14 text-center">
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs text-slate-300 ${
              isSports
                ? "bg-slate-900/80 border-emerald-900/50"
                : isClothing
                ? "bg-slate-900/80 border-purple-900/50"
                : "bg-slate-900/80 border-slate-800"
            }`}
          >
            <span>💬</span>
            <span>Have feedback about your order?</span>
            <Link
              href={`/store/${subdomain}#contact`}
              className={`font-bold hover:underline ${
                isSports
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