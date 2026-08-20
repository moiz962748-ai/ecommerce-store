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
  electronics: {
    bg: 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950',
    badgeBorder: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-400',
    accentGradient: 'from-cyan-400 via-blue-400 to-indigo-400',
    cardBorder: 'border-slate-800/80',
    cardBg: 'bg-slate-900/60',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    inputBorder: 'border-slate-800 bg-slate-950/80',
    inputFocus: 'focus:border-cyan-500',
    buttonBg: 'bg-cyan-500 hover:bg-cyan-400',
    buttonText: 'text-slate-950',
  },
  sports: {
    bg: 'bg-[#020d09] text-emerald-50 selection:bg-emerald-500 selection:text-slate-950',
    badgeBorder: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    accentGradient: 'from-emerald-400 via-teal-400 to-green-300',
    cardBorder: 'border-emerald-950/80',
    cardBg: 'bg-[#061a14]/60',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    inputBorder: 'border-emerald-950 bg-[#03120d]/90',
    inputFocus: 'focus:border-emerald-500',
    buttonBg: 'bg-emerald-500 hover:bg-emerald-400',
    buttonText: 'text-slate-950',
  },
  clothing: {
    bg: 'bg-[#0b0314] text-purple-50 selection:bg-purple-500 selection:text-white',
    badgeBorder: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-400',
    accentGradient: 'from-purple-400 via-fuchsia-400 to-pink-300',
    cardBorder: 'border-purple-950/80',
    cardBg: 'bg-[#1a0a26]/60',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    inputBorder: 'border-purple-950 bg-[#12051d]/90',
    inputFocus: 'focus:border-purple-500',
    buttonBg: 'bg-purple-600 hover:bg-purple-500',
    buttonText: 'text-white',
  },
};

export default function StoreContactPage() {
  const params = useParams();
  const subdomain = (params?.subdomain as string) || '';

  const lowerSubdomain = subdomain.toLowerCase();
  const [storeTheme, setStoreTheme] = useState<string>(
    lowerSubdomain.includes('sport') ? 'sports' : lowerSubdomain.includes('cloth') ? 'clothing' : 'electronics'
  );

  const [contactData, setContactData] = useState({
    email: 'support@store.pk',
    phone: '',
    address: 'Islamabad & Lahore, Pakistan',
    officeHours: 'Mon – Sat (9AM – 8PM)',
  });

  useEffect(() => {
    if (!subdomain) return;

    async function fetchContactDetails() {
      try {
        const store = await apiClient(`/public/stores/${subdomain}`);
        
        const configuredTheme = store?.templateConfig?.theme;
        if (configuredTheme && THEME_STYLES[configuredTheme]) {
          setStoreTheme(configuredTheme);
        }

        const contact = store?.templateConfig?.contact;
        if (contact) {
          setContactData({
            email: contact.email || 'support@store.pk',
            phone: contact.phone || '',
            address: contact.address || 'Islamabad & Lahore, Pakistan',
            officeHours: contact.officeHours || 'Mon – Sat (9AM – 8PM)',
          });
        }
      } catch {
        // Fallback default values
      }
    }

    fetchContactDetails();
  }, [subdomain]);

  const currentTheme = THEME_STYLES[storeTheme] || THEME_STYLES.electronics;

  return (
    <main className={`min-h-screen w-full transition-colors duration-500 pb-20 ${currentTheme.bg}`}>
      
      {/* 1. Header */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 md:px-8 md:pt-16 md:pb-12 text-center">
        <div className={`inline-flex items-center gap-2 rounded-full border ${currentTheme.badgeBorder} ${currentTheme.badgeBg} px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-5 ${currentTheme.badgeText}`}>
          <MessageSquare size={13} />
          <span>WE'RE HERE TO HELP</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
          Get in <span className={`bg-gradient-to-r ${currentTheme.accentGradient} bg-clip-text text-transparent`}>Touch</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
          Have a question about an order, warranty, sizing, or bulk inquiries? Send us a message and our support team will respond promptly.
        </p>
      </section>

      {/* 2. Info Cards */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
        <div className={`grid grid-cols-1 gap-6 ${contactData.phone ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
          <div className={`flex items-center gap-4 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-6 backdrop-blur-md shadow-lg`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Email Us</p>
              <p className="text-sm font-bold">{contactData.email}</p>
              <p className="text-[11px] text-slate-400">Response within 24 hours</p>
            </div>
          </div>

          {contactData.phone && (
            <div className={`flex items-center gap-4 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-6 backdrop-blur-md shadow-lg`}>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Call Us</p>
                <p className="text-sm font-bold">{contactData.phone}</p>
                <p className="text-[11px] text-slate-400">Direct helpline</p>
              </div>
            </div>
          )}

          <div className={`flex items-center gap-4 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-6 backdrop-blur-md shadow-lg`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Location</p>
              <p className="text-sm font-bold">{contactData.address}</p>
              <p className="text-[11px] text-slate-400">Nationwide Express Delivery</p>
            </div>
          </div>

          <div className={`flex items-center gap-4 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-6 backdrop-blur-md shadow-lg`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor}`}>
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Office Hours</p>
              <p className="text-sm font-bold">{contactData.officeHours}</p>
              <p className="text-[11px] text-slate-400">Support Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Form */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 md:px-8">
        <div className={`rounded-3xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-8 md:p-12 shadow-xl backdrop-blur-md`}>
          <h2 className="text-2xl font-bold mb-6">Send Us a Direct Message</h2>
          <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Muhammad Ali"
                className={`w-full rounded-xl border ${currentTheme.inputBorder} px-4 py-3 text-sm focus:outline-none ${currentTheme.inputFocus}`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="ali@example.com"
                className={`w-full rounded-xl border ${currentTheme.inputBorder} px-4 py-3 text-sm focus:outline-none ${currentTheme.inputFocus}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Message</label>
              <textarea
                rows={4}
                placeholder="Write your inquiry here..."
                className={`w-full rounded-xl border ${currentTheme.inputBorder} px-4 py-3 text-sm focus:outline-none ${currentTheme.inputFocus}`}
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-xl ${currentTheme.buttonBg} px-6 py-3 text-xs font-bold ${currentTheme.buttonText} transition-all shadow-md`}
              >
                <Send size={14} />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </section>

    </main>
  );
}