'use client';

import { Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

export default function StoreContactPage() {
  return (
    <main className="min-h-screen w-full transition-colors duration-300 pb-20">
      
      {/* 1. Header with Generous Padding */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 md:px-8 md:pt-14 md:pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-5">
          <MessageSquare size={13} className="text-emerald-400" />
          <span>WE'RE HERE TO HELP</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
          Get in <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
          Have a question about an order, warranty, sizing, or bulk inquiries? Send us a message and our support team will respond promptly.
        </p>
      </section>

      {/* 2. Contact Info Cards (Separated with clean top/bottom padding) */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md shadow-lg">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Email Us</p>
              <p className="text-sm font-bold">support@store.pk</p>
              <p className="text-[11px] text-slate-400">Response within 24 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md shadow-lg">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Location</p>
              <p className="text-sm font-bold">Islamabad & Lahore</p>
              <p className="text-[11px] text-slate-400">Nationwide Express Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md shadow-lg">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Office Hours</p>
              <p className="text-sm font-bold">Mon – Sat (9AM – 8PM)</p>
              <p className="text-[11px] text-slate-400">Sunday Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Message Form Section (Spaced Out) */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 md:px-8">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 md:p-12 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6">Send Us a Direct Message</h2>
          <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Muhammad Ali"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="ali@example.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Message</label>
              <textarea
                rows={4}
                placeholder="Write your inquiry here..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md"
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