'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Mail, MapPin, Clock, Phone, Send, MessageSquare } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

const THEME_STYLES: Record<string, {
  bg: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  accentGradient: string;
  cardBorder: string;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  inputBorder: string;
  inputFocus: string;
  buttonBg: string;
  buttonText: string;
}> = {
  boutique: {
    bg: 'bg-background text-foreground',
    badgeBorder: 'border-border',
    badgeBg: 'bg-card shadow-xs',
    badgeText: 'text-foreground',
    accentGradient: 'from-foreground via-foreground/90 to-foreground/75',
    cardBorder: 'border-border shadow-xs hover:border-foreground/20 hover:shadow-md',
    cardBg: 'bg-card',
    iconBg: 'bg-accent border border-border',
    iconColor: 'text-foreground',
    inputBorder: 'border-input bg-card text-foreground placeholder:text-muted-foreground',
    inputFocus: 'focus:ring-1 focus:ring-ring focus:outline-none',
    buttonBg: 'bg-primary hover:opacity-90',
    buttonText: 'text-primary-foreground',
  },
  electronics: {
    bg: 'bg-[#f8fafc] text-slate-900',
    badgeBorder: 'border-sky-200',
    badgeBg: 'bg-sky-50 shadow-xs',
    badgeText: 'text-sky-800',
    accentGradient: 'from-sky-700 via-blue-700 to-indigo-700',
    cardBorder: 'border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md',
    cardBg: 'bg-white',
    iconBg: 'bg-sky-50 border border-sky-100',
    iconColor: 'text-sky-700',
    inputBorder: 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400',
    inputFocus: 'focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-none',
    buttonBg: 'bg-sky-600 hover:bg-sky-700',
    buttonText: 'text-white',
  },
  sports: {
    bg: 'bg-[#f8fafc] text-slate-900',
    badgeBorder: 'border-emerald-200',
    badgeBg: 'bg-emerald-50 shadow-xs',
    badgeText: 'text-emerald-800',
    accentGradient: 'from-emerald-700 via-teal-700 to-green-700',
    cardBorder: 'border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-md',
    cardBg: 'bg-white',
    iconBg: 'bg-emerald-50 border border-emerald-100',
    iconColor: 'text-emerald-700',
    inputBorder: 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400',
    inputFocus: 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    buttonText: 'text-white',
  },
  clothing: {
    bg: 'bg-[#f8fafc] text-slate-900',
    badgeBorder: 'border-purple-200',
    badgeBg: 'bg-purple-50 shadow-xs',
    badgeText: 'text-purple-800',
    accentGradient: 'from-purple-700 via-fuchsia-700 to-pink-700',
    cardBorder: 'border-purple-100 shadow-xs hover:border-purple-300 hover:shadow-md',
    cardBg: 'bg-white',
    iconBg: 'bg-purple-50 border border-purple-100',
    iconColor: 'text-purple-700',
    inputBorder: 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400',
    inputFocus: 'focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none',
    buttonBg: 'bg-purple-600 hover:bg-purple-700',
    buttonText: 'text-white',
  },
};

export default function StoreContactPage() {
  const params = useParams();
  const subdomain = (params?.subdomain as string) || '';

  const lowerSubdomain = subdomain.toLowerCase();
  const isBoutique = lowerSubdomain.includes('boutique') || lowerSubdomain.includes('luxury');
  const [storeTheme, setStoreTheme] = useState<string>(
    isBoutique ? 'boutique' : lowerSubdomain.includes('sport') ? 'sports' : lowerSubdomain.includes('cloth') ? 'clothing' : 'electronics'
  );

  const [contactData, setContactData] = useState({
    email: 'atelier@store.pk',
    phone: '',
    address: 'Islamabad & Lahore, Pakistan',
    officeHours: 'Mon – Sat (10AM – 8PM)',
  });

  useEffect(() => {
    if (!subdomain) return;

    async function fetchContactDetails() {
      try {
        const store = await apiClient(`/public/stores/${subdomain}`);

        const configuredTheme = store?.templateConfig?.theme;
        if (configuredTheme && THEME_STYLES[configuredTheme]) {
          setStoreTheme(configuredTheme);
        } else if (isBoutique) {
          setStoreTheme('boutique');
        }

        const contact = store?.templateConfig?.contact;
        if (contact) {
          setContactData({
            email: contact.email || (isBoutique ? 'concierge@boutique.pk' : 'support@store.pk'),
            phone: contact.phone || '',
            address: contact.address || 'Islamabad & Lahore, Pakistan',
            officeHours: contact.officeHours || 'Mon – Sat (10AM – 8PM)',
          });
        }
      } catch {
        // Fallback default values
      }
    }

    fetchContactDetails();
  }, [subdomain, isBoutique]);

  const currentTheme = THEME_STYLES[storeTheme] || THEME_STYLES.boutique;

  return (
    <main className={`min-h-screen w-full transition-colors duration-500 pb-20 ${currentTheme.bg}`}>
      {/* 1. Header */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 md:px-8 md:pt-16 md:pb-12 text-center">
        <div className={`inline-flex items-center gap-2 rounded-full border ${currentTheme.badgeBorder} ${currentTheme.badgeBg} px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-5 ${currentTheme.badgeText}`}>
          <MessageSquare size={13} />
          <span>{isBoutique ? 'ATELIER CONCIERGE' : "WE'RE HERE TO HELP"}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-slate-950">
          Get in{' '}
          <span className={isBoutique ? 'text-foreground underline decoration-border underline-offset-8' : `bg-gradient-to-r ${currentTheme.accentGradient} bg-clip-text text-transparent`}>
            Touch
          </span>
        </h1>
        <p className={`mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed ${isBoutique ? 'text-muted-foreground' : 'text-slate-600'}`}>
          {isBoutique
            ? 'Have an inquiry regarding bespoke custom stitching, bridal appointments, or private viewings? Connect directly with our stylist consultants.'
            : 'Have a question about an order, warranty, sizing, or bulk inquiries? Send us a message and our support team will respond promptly.'}
        </p>
      </section>

      {/* 2. Info Cards */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
        <div className={`grid grid-cols-1 gap-6 ${contactData.phone ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
          <div className={`flex items-center gap-4 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-6 transition-all`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <Mail size={20} />
            </div>
            <div>
              <p className={`text-[10px] uppercase font-bold tracking-widest ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Email Us</p>
              <p className="text-sm font-bold text-slate-950">{contactData.email}</p>
              <p className={`text-[11px] ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Response within 24 hours</p>
            </div>
          </div>

          {contactData.phone && (
            <div className={`flex items-center gap-4 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-6 transition-all`}>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
                <Phone size={20} />
              </div>
              <div>
                <p className={`text-[10px] uppercase font-bold tracking-widest ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Call Us</p>
                <p className="text-sm font-bold text-slate-950">{contactData.phone}</p>
                <p className={`text-[11px] ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Direct helpline</p>
              </div>
            </div>
          )}

          <div className={`flex items-center gap-4 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-6 transition-all`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <MapPin size={20} />
            </div>
            <div>
              <p className={`text-[10px] uppercase font-bold tracking-widest ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Location</p>
              <p className="text-sm font-bold text-slate-950">{contactData.address}</p>
              <p className={`text-[11px] ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Nationwide Express Delivery</p>
            </div>
          </div>

          <div className={`flex items-center gap-4 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-6 transition-all`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <Clock size={20} />
            </div>
            <div>
              <p className={`text-[10px] uppercase font-bold tracking-widest ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Studio Hours</p>
              <p className="text-sm font-bold text-slate-950">{contactData.officeHours}</p>
              <p className={`text-[11px] ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>Customer Support Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Form */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 md:px-8">
        <div className={`rounded-3xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-8 md:p-12`}>
          <h2 className="text-2xl font-bold mb-6 text-slate-950">{isBoutique ? 'Inquire with Stylist' : 'Send Us a Direct Message'}</h2>
          <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isBoutique ? 'text-foreground/80' : 'text-slate-700'}`}>Your Name</label>
              <input
                type="text"
                placeholder="Abdul Moiz"
                className={`w-full rounded-xl border ${currentTheme.inputBorder} px-4 py-3 text-sm transition-all ${currentTheme.inputFocus}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isBoutique ? 'text-foreground/80' : 'text-slate-700'}`}>Email Address</label>
              <input
                type="email"
                placeholder="client@example.com"
                className={`w-full rounded-xl border ${currentTheme.inputBorder} px-4 py-3 text-sm transition-all ${currentTheme.inputFocus}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isBoutique ? 'text-foreground/80' : 'text-slate-700'}`}>Your Message / Query</label>
              <textarea
                rows={4}
                placeholder="How can our support team assist you today?"
                className={`w-full rounded-xl border ${currentTheme.inputBorder} px-4 py-3 text-sm transition-all ${currentTheme.inputFocus}`}
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-xl ${currentTheme.buttonBg} px-6 py-3 text-xs font-bold ${currentTheme.buttonText} transition-all shadow-sm`}
              >
                <Send size={14} />
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}