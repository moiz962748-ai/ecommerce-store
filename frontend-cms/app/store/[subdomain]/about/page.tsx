'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Globe,
  Users,
  ArrowRight,
  Target,
  Heart,
  TrendingUp,
} from 'lucide-react';

const ABOUT_CONTENT: Record<
  string,
  {
    heroTag: string;
    heroHeadline: string;
    missionTag: string;
    missionTitle: string;
    missionParagraphs: string[];
    stat1: string;
    stat1Label: string;
    stat2: string;
    stat2Label: string;
    stat3: string;
    stat3Label: string;
    stat4: string;
    stat4Label: string;
    values: { title: string; desc: string; icon: any }[];
  }
> = {
  electronics: {
    heroTag: 'Our Story',
    heroHeadline: 'Powering Digital Workflows Across Pakistan',
    missionTag: 'Our Mission',
    missionTitle: 'Connecting Creators to Precision Gadgets & Computing Hardware',
    missionParagraphs: [
      'Our store was founded on a simple principle: every developer, gamer, and creative professional deserves direct access to authentic next-gen hardware without grey-market uncertainty.',
      'We partner directly with certified manufacturers to bring factory-sealed laptops, audiophile gear, and ergonomic accessories straight to your desk with dependable 12-month warranties.',
      'By streamlining imports and quality assurance, we make cutting-edge workstations easily accessible across all provinces in Pakistan.',
    ],
    stat1: '500+',
    stat1Label: 'Verified Tech Products',
    stat2: '100%',
    stat2Label: 'Original Guarantee',
    stat3: '50+',
    stat3Label: 'Cities Covered',
    stat4: '1,200+',
    stat4Label: 'Happy Customers',
    values: [
      { title: '100% Genuine', desc: 'No refurbished or grey-market items. Every device is sealed with serial warranty.', icon: ShieldCheck },
      { title: 'Rapid Dispatch', desc: 'Secure shock-proof bubble wrapping and 48-hour tracked delivery nationwide.', icon: Globe },
      { title: 'After-Sales Support', desc: 'Dedicated technical desk ready to guide setup and handle warranty claims.', icon: Users },
      { title: 'Honest Pricing', desc: 'Transparent prices with zero hidden customs or delivery surcharge fees.', icon: Award },
    ],
  },
  sports: {
    heroTag: 'Athletic Passion',
    heroHeadline: 'Fueling Peak Human Performance & Endurance',
    missionTag: 'Our Mission',
    missionTitle: 'Equipping Athletes with Professional Grade Training Gear',
    missionParagraphs: [
      'We believe athletic dedication deserves equipment that withstands the toughest workout sessions and marathon distances.',
      'From precision-cushioned carbon running footwear to cast-iron dumbbell sets, our catalog is curated and tested for durability and performance.',
      'Whether you train in a home studio or compete professionally, our mission is to deliver dependable gear right to your doorstep.',
    ],
    stat1: '350+',
    stat1Label: 'Pro Athletic Items',
    stat2: '48 Hr',
    stat2Label: 'Express Delivery',
    stat3: '50+',
    stat3Label: 'Cities Covered',
    stat4: '1,500+',
    stat4Label: 'Athletes Equipped',
    values: [
      { title: 'Athlete Tested', desc: 'Heavy-duty construction tested against rigorous endurance standards.', icon: ShieldCheck },
      { title: 'Doorstep Exchanges', desc: 'Free 7-day size and fit exchanges so you never compromise on comfort.', icon: Globe },
      { title: 'Endurance First', desc: 'Premium materials designed for sweat resistance, grip, and long life.', icon: Users },
      { title: 'Nationwide Delivery', desc: 'Fast, secure freight for heavy cast-iron sets and workout accessories.', icon: Award },
    ],
  },
  clothing: {
    heroTag: 'Fashion Craft',
    heroHeadline: 'Defining Modern Everyday Casual & Streetwear',
    missionTag: 'Our Mission',
    missionTitle: 'Crafting Timeless Silhouettes with Uncompromising Fabric',
    missionParagraphs: [
      'Fashion should feel as effortless as it looks. We set out to create apparel that balances structured streetwear cuts with breathable comfort.',
      'Every collection is spun from high-grade organic combed cotton and selvedge denim, tailored to maintain its drape across repeated laundry cycles.',
      'Our goal is to give you signature wardrobe staples that look sharp from morning coffee to evening events.',
    ],
    stat1: '1,200+',
    stat1Label: 'Curated Styles',
    stat2: '100%',
    stat2Label: 'Organic Cotton',
    stat3: '50+',
    stat3Label: 'Cities Covered',
    stat4: '2,000+',
    stat4Label: 'Satisfied Shoppers',
    values: [
      { title: 'Pure Cotton', desc: '240-280 GSM heavyweight fabrics that keep their form and soft handfeel.', icon: ShieldCheck },
      { title: 'Modern Silhouettes', desc: 'Drop-shoulder cuts, relaxed denim, and modern structured overcoats.', icon: Globe },
      { title: '7-Day Exchanges', desc: 'Hassle-free size adjustments with dedicated customer care support.', icon: Users },
      { title: 'Fair Quality', desc: 'Ethical sourcing and precision stitching designed to outlast fast fashion.', icon: Award },
    ],
  },
};

export default function StoreAboutPage() {
  const params = useParams();
  const subdomain = (params.subdomain as string) || '';

  const lowerSub = subdomain.toLowerCase();
  const isSports = lowerSub.includes('sport') || lowerSub.includes('fitness');
  const isClothing = lowerSub.includes('cloth') || lowerSub.includes('fashion') || lowerSub.includes('apparel');
  const configKey = isSports ? 'sports' : isClothing ? 'clothing' : 'electronics';

  const content = ABOUT_CONTENT[configKey] || ABOUT_CONTENT.electronics;

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
      {/* 1. Header Banner */}
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
            {content.heroTag}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            About{' '}
            <span
              className={`bg-gradient-to-r ${
                isSports
                  ? 'from-emerald-400 via-teal-400 to-green-300'
                  : isClothing
                  ? 'from-purple-400 via-fuchsia-400 to-pink-300'
                  : 'from-cyan-400 via-blue-400 to-indigo-300'
              } bg-clip-text text-transparent`}
            >
              Our Store
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {content.heroHeadline}
          </p>
        </div>
      </section>

      {/* 2. Mission Split Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Mission Description */}
          <div className="lg:col-span-7 space-y-5">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${
                isSports
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : isClothing
                  ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                  : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
              }`}
            >
              <Target size={12} />
              {content.missionTag}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {content.missionTitle}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {content.missionParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="pt-3">
              <Link
                href={`/store/${subdomain}/products`}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all ${
                  isSports
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                    : isClothing
                    ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/25'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
                }`}
              >
                Explore Catalog
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Glow Box */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="w-full h-80 sm:h-96 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden"
              style={{
                background: isSports
                  ? 'linear-gradient(135deg, #059669 0%, #10B981 50%, #14B8A6 100%)'
                  : isClothing
                  ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)'
                  : 'linear-gradient(135deg, #F59E0B 0%, #EA580C 50%, #3B82F6 100%)',
              }}
            >
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-4xl shadow-xl mb-4">
                🚀
              </div>
              <h3 className="text-2xl font-black text-white">Delivering Excellence</h3>
              <p className="text-xs text-white/90 mt-2 max-w-xs leading-relaxed">
                Direct fulfillment, authentic warranty protection, and dedicated customer support across Pakistan.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. 4-Box Stats Ribbon */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {[
            { val: content.stat1, label: content.stat1Label, icon: Sparkles },
            { val: content.stat2, label: content.stat2Label, icon: ShieldCheck },
            { val: content.stat3, label: content.stat3Label, icon: Globe },
            { val: content.stat4, label: content.stat4Label, icon: Users },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border backdrop-blur-xl text-center shadow-lg transition-all hover:-translate-y-1 ${
                  isSports
                    ? 'border-emerald-900/30 bg-slate-900/60'
                    : isClothing
                    ? 'border-purple-900/30 bg-slate-900/60'
                    : 'border-slate-800/80 bg-slate-900/60'
                }`}
              >
                <div
                  className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3 ${
                    isSports
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isClothing
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white">{s.val}</div>
                <div className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Core Values Bento Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 pb-28">
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
            <Heart size={13} />
            Our Values
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What Drives{' '}
            <span
              className={`bg-gradient-to-r ${
                isSports
                  ? 'from-emerald-400 via-teal-400 to-green-300'
                  : isClothing
                  ? 'from-purple-400 via-fuchsia-400 to-pink-300'
                  : 'from-cyan-400 via-blue-400 to-indigo-300'
              } bg-clip-text text-transparent`}
            >
              Us Forward
            </span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            These core principles guide our selection, pricing, and after-sales support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 shadow-xl ${
                  isSports
                    ? 'border-emerald-900/30 bg-slate-900/60 hover:border-emerald-500/40'
                    : isClothing
                    ? 'border-purple-900/30 bg-slate-900/60 hover:border-purple-500/40'
                    : 'border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5 ${
                    isSports
                      ? 'bg-emerald-600'
                      : isClothing
                      ? 'bg-purple-600'
                      : i === 0
                      ? 'bg-rose-500'
                      : i === 1
                      ? 'bg-blue-500'
                      : i === 2
                      ? 'bg-purple-500'
                      : 'bg-emerald-500'
                  }`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}