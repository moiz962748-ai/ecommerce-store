'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS_DATA: Record<string, FaqItem[]> = {
  electronics: [
    {
      q: 'Are all electronic gadgets 100% genuine and authentic?',
      a: 'Yes, every product listed on our store comes directly from certified brand distributors with authentic serial numbers and official manufacturer warranty cards.',
    },
    {
      q: 'What is your warranty claim process?',
      a: 'We offer an upfront 12-month warranty. If you experience any technical or hardware defects, contact our helpline with your Order ID for immediate pick-and-repair support.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD) across Pakistan?',
      a: 'Yes, we provide Cash on Delivery (COD) to all major and remote cities across Pakistan with tracked express courier handling.',
    },
    {
      q: 'Can I request a custom hardware or workstation spec?',
      a: 'Certainly! Reach out to us via the contact form with your exact specification requirements and our hardware engineers will assist you.',
    },
  ],
  sports: [
    {
      q: 'How do I choose the correct shoe or apparel size?',
      a: 'Each product page includes an exact measurement chart in UK/US sizes. In case of sizing issues, we provide free 7-day doorstep size exchanges.',
    },
    {
      q: 'Are dumbbells and heavy iron equipment shipped safely?',
      a: 'Yes, all heavy gym gear and cast-iron plates are bubble-wrapped in reinforced shock-proof freight packaging to prevent damage during transit.',
    },
    {
      q: 'How long does express dispatch take?',
      a: 'Orders placed before 4:00 PM are dispatched the same day. Standard delivery time is 24 to 48 hours for major cities.',
    },
    {
      q: 'Do you provide bulk discounts for gym studios or teams?',
      a: 'Yes, we provide wholesale rates for athletic academies, gyms, and sports clubs. Message us directly through this form.',
    },
  ],
  clothing: [
    {
      q: 'What fabrics do you use for your apparel?',
      a: 'Our streetwear and daily basics are constructed with premium 240-280 GSM 100% combed organic cotton to ensure durability and zero shrink.',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer a hassle-free 7-day doorstep return and size exchange policy provided items are unworn and retain their original tags.',
    },
    {
      q: 'Do your colors fade after washing?',
      a: 'No, all our fabric dyes undergo colorfast quality checks to withstand regular cold machine cycles without bleeding or pilling.',
    },
    {
      q: 'How can I track my package once dispatched?',
      a: 'You will receive an automated tracking code via SMS and email as soon as the rider picks up your package.',
    },
  ],
};

export default function StoreContactPage() {
  const params = useParams();
  const subdomain = (params.subdomain as string) || '';

  const lowerSub = subdomain.toLowerCase();
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');
  const configKey = isSports ? 'sports' : isClothing ? 'clothing' : 'electronics';

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const faqs = FAQS_DATA[configKey] || FAQS_DATA.electronics;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isSports
          ? 'bg-[#020d09] text-emerald-50 selection:bg-emerald-500 selection:text-slate-950'
          : isClothing
          ? 'bg-[#0b0314] text-purple-50 selection:bg-purple-500 selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
      }`}
    >
      {/* 1. Hero Title Banner */}
      <section className="relative overflow-hidden py-16 md:py-24 text-center">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[140px] pointer-events-none opacity-20 ${
            isSports ? 'bg-emerald-500' : isClothing ? 'bg-purple-500' : 'bg-cyan-500'
          }`}
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 z-10">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${
              isSports
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : isClothing
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
            }`}
          >
            <Sparkles size={13} />
            We&apos;re Here to Help
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Get in{' '}
            <span
              className={`bg-gradient-to-r ${
                isSports
                  ? 'from-emerald-400 via-teal-400 to-green-300'
                  : isClothing
                  ? 'from-purple-400 via-fuchsia-400 to-pink-300'
                  : 'from-cyan-400 via-blue-400 to-indigo-300'
              } bg-clip-text text-transparent`}
            >
              Touch
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have a question about an order, warranty, sizing, or bulk inquiries? Send us a message and our support team will respond promptly.
          </p>
        </div>
      </section>

      {/* 2. Top Info Cards Strip */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div
            className={`p-6 rounded-3xl border backdrop-blur-xl flex items-center gap-4 transition-all hover:-translate-y-1 shadow-lg ${
              isSports
                ? 'border-emerald-900/30 bg-slate-900/60'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60'
                : 'border-slate-800/80 bg-slate-900/60'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                isSports ? 'bg-emerald-600' : isClothing ? 'bg-purple-600' : 'bg-cyan-600'
              }`}
            >
              <Mail size={22} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">Email Us</p>
              <p className="text-sm font-bold text-white mt-0.5">support@{subdomain}.pk</p>
              <p className="text-xs text-slate-400">Response within 24 hours</p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className={`p-6 rounded-3xl border backdrop-blur-xl flex items-center gap-4 transition-all hover:-translate-y-1 shadow-lg ${
              isSports
                ? 'border-emerald-900/30 bg-slate-900/60'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60'
                : 'border-slate-800/80 bg-slate-900/60'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                isSports ? 'bg-teal-600' : isClothing ? 'bg-pink-600' : 'bg-blue-600'
              }`}
            >
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">Location</p>
              <p className="text-sm font-bold text-white mt-0.5">Islamabad &amp; Lahore</p>
              <p className="text-xs text-slate-400">Nationwide Express Delivery</p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className={`p-6 rounded-3xl border backdrop-blur-xl flex items-center gap-4 transition-all hover:-translate-y-1 shadow-lg ${
              isSports
                ? 'border-emerald-900/30 bg-slate-900/60'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60'
                : 'border-slate-800/80 bg-slate-900/60'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                isSports ? 'bg-green-600' : isClothing ? 'bg-rose-600' : 'bg-indigo-600'
              }`}
            >
              <Clock size={22} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">Office Hours</p>
              <p className="text-sm font-bold text-white mt-0.5">Mon - Sat (9AM - 8PM)</p>
              <p className="text-xs text-slate-400">Sunday Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Form & Side Cards Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Send us a Message Form (8 cols) */}
          <div
            className={`lg:col-span-8 p-6 md:p-10 rounded-3xl border backdrop-blur-xl shadow-2xl ${
              isSports
                ? 'border-emerald-900/30 bg-slate-900/60'
                : isClothing
                ? 'border-purple-900/30 bg-slate-900/60'
                : 'border-slate-800/80 bg-slate-900/60'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Send us a Message</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-8">
              Fill in the form below and we will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ahmed Khan"
                  className={`w-full h-12 rounded-xl border bg-slate-950/80 px-4 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                    isSports
                      ? 'border-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : isClothing
                      ? 'border-purple-950 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`w-full h-12 rounded-xl border bg-slate-950/80 px-4 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                    isSports
                      ? 'border-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : isClothing
                      ? 'border-purple-950 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full h-12 rounded-xl border bg-slate-950/80 px-4 text-sm text-white focus:outline-none transition-all ${
                    isSports
                      ? 'border-emerald-950 focus:border-emerald-500'
                      : isClothing
                      ? 'border-purple-950 focus:border-purple-500'
                      : 'border-slate-800 focus:border-cyan-500'
                  }`}
                >
                  <option value="" className="bg-slate-950">Select a subject</option>
                  <option value="order_inquiry" className="bg-slate-950">Order Status &amp; Tracking</option>
                  <option value="exchange" className="bg-slate-950">Return or Exchange Request</option>
                  <option value="bulk" className="bg-slate-950">Custom / Bulk Order Inquiry</option>
                  <option value="other" className="bg-slate-950">General Inquiry</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Your Message *
                  </label>
                  <span className="text-[11px] text-slate-500">{formData.message.length}/1000</span>
                </div>
                <textarea
                  rows={5}
                  required
                  maxLength={1000}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  className={`w-full rounded-xl border bg-slate-950/80 p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                    isSports
                      ? 'border-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : isClothing
                      ? 'border-purple-950 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isSports
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
                }`}
              >
                <Send size={16} />
                Send Message
              </button>

              {submitted && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Your message has been sent successfully! Our team will contact you within 24 hours.
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: Quick Response & Direct Info Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Orange/Theme Quick Response Banner */}
            <div
              className="p-6 rounded-3xl shadow-xl text-slate-950 relative overflow-hidden"
              style={{
                background: isSports
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : isClothing
                  ? 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)'
                  : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-black text-white">Quick Response</h3>
              <p className="text-xs text-white/90 mt-2 leading-relaxed">
                We prioritize urgent queries and reply to all tickets within 24 hours. For active order cancellations, email us directly.
              </p>
            </div>

            {/* Direct Contact Methods */}
            <div
              className={`p-6 rounded-3xl border backdrop-blur-xl space-y-4 ${
                isSports
                  ? 'border-emerald-900/30 bg-slate-900/60'
                  : isClothing
                  ? 'border-purple-900/30 bg-slate-900/60'
                  : 'border-slate-800/80 bg-slate-900/60'
              }`}
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Direct Channels
              </h4>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Email</p>
                  <p className="text-xs font-bold text-white">support@{subdomain}.pk</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">WhatsApp Helpline</p>
                  <p className="text-xs font-bold text-white">+92 300 0000000</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions (Accordion) */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-28">
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-3 ${
              isSports
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : isClothing
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
            }`}
          >
            <HelpCircle size={13} />
            FAQ
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked{' '}
            <span
              className={`bg-gradient-to-r ${
                isSports
                  ? 'from-emerald-400 via-teal-400 to-green-300'
                  : isClothing
                  ? 'from-purple-400 via-fuchsia-400 to-pink-300'
                  : 'from-amber-400 via-orange-400 to-rose-400'
              } bg-clip-text text-transparent`}
            >
              Questions
            </span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Everything you need to know about purchasing, warranty, and dispatch.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isSports
                    ? 'border-emerald-900/40 bg-slate-900/70'
                    : isClothing
                    ? 'border-purple-900/40 bg-slate-900/70'
                    : 'border-slate-800/80 bg-slate-900/70'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? isSports
                          ? 'bg-emerald-500 text-slate-950 rotate-180'
                          : isClothing
                          ? 'bg-purple-600 text-white rotate-180'
                          : 'bg-amber-400 text-slate-950 rotate-180'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}