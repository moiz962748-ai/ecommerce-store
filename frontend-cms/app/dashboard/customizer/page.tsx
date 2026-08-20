'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Palette, 
  Layout, 
  FileText, 
  PhoneCall, 
  Megaphone,
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Smartphone,
  Monitor,
  RotateCw,
  Eye,
  EyeOff
} from 'lucide-react';

const DEFAULT_STORES = [
  { name: 'Electronics Store', subdomain: 'electronics' },
  { name: 'Sports Store', subdomain: 'sports' },
  { name: 'Clothing Store', subdomain: 'clothing' },
];

export default function StoreCustomizerPage() {
  const [stores, setStores] = useState<any[]>(DEFAULT_STORES);
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('electronics');
  const [activeTab, setActiveTab] = useState<'branding' | 'announcement' | 'hero' | 'about' | 'contact'>('branding');
  const [showPreview, setShowPreview] = useState<boolean>(true); // Default open with toggle button
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    theme: 'electronics',
    announcement: {
      enabled: true,
      text: 'Free Express Nationwide Delivery on all orders over Rs. 3,000!',
      badge: 'LIMITED OFFER',
      link: '/products',
    },
    hero: {
      eyebrow: '',
      headline: '',
      buttonText: '',
    },
    about: {
      story: '',
      mission: '',
    },
    contact: {
      email: '',
      phone: '',
      address: '',
      officeHours: '',
    },
  });

  // 1. Fetch stores from backend
  useEffect(() => {
    async function fetchStores() {
      try {
        const token = getStoredToken();
        const data = await apiClient('/stores', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const storeList = Array.isArray(data) ? data : data?.data || [];
        if (storeList.length > 0) {
          const normalized = storeList.map((s: any) => ({
            name: s.name,
            subdomain: s.subdomain || s.subDomain || s.id,
          }));
          setStores(normalized);
          if (!selectedSubdomain) {
            setSelectedSubdomain(normalized[0].subdomain);
          }
        }
      } catch {
        // Fallback to default stores
      }
    }
    fetchStores();
  }, []);

  // 2. Load store configuration
  useEffect(() => {
    if (!selectedSubdomain) return;

    async function loadStoreConfig() {
      setLoading(true);
      try {
        const store = await apiClient(`/public/stores/${selectedSubdomain}`);
        const config = store?.templateConfig || {};

        setFormData({
          name: store?.name || (selectedSubdomain === 'electronics' ? 'Electronics Store' : selectedSubdomain === 'sports' ? 'Sports Store' : 'Clothing Store'),
          logoUrl: store?.logoUrl || '',
          theme: config.theme || selectedSubdomain,
          announcement: {
            enabled: config.announcement?.enabled !== undefined ? config.announcement.enabled : true,
            text: config.announcement?.text || (selectedSubdomain === 'sports' ? '⚡ Free Workout Guide with orders over Rs. 4,000!' : selectedSubdomain === 'clothing' ? '✨ Flat 20% Off on New Season Arrivals | Code: TREND20' : '⚡ Free Express Nationwide Delivery on orders over Rs. 3,000!'),
            badge: config.announcement?.badge || 'PROMO',
            link: config.announcement?.link || `/store/${selectedSubdomain}/products`,
          },
          hero: {
            eyebrow: config.hero?.eyebrow || (selectedSubdomain === 'sports' ? 'Peak Athletic Performance' : selectedSubdomain === 'clothing' ? 'Curated Fashion & Apparel' : 'Next-Gen Tech Essentials'),
            headline: config.hero?.headline || (selectedSubdomain === 'sports' ? 'Elevate Your Fitness Journey' : selectedSubdomain === 'clothing' ? 'Define Your Signature Style' : 'Discover Smart Modern Technology'),
            buttonText: config.hero?.buttonText || 'Browse All Products',
          },
          about: {
            story: config.about?.story || 'Powering modern e-commerce experiences across Pakistan with verified authenticity, direct brand warranty, and seamless doorstep delivery.',
            mission: config.about?.mission || 'Committed to superior quality, 100% genuine products, and trusted customer care.',
          },
          contact: {
            email: config.contact?.email || 'support@store.pk',
            phone: config.contact?.phone || '+92 300 1234567',
            address: config.contact?.address || 'Islamabad & Lahore, Pakistan',
            officeHours: config.contact?.officeHours || 'Mon – Sat (9AM – 8PM)',
          },
        });

        setPreviewKey(Date.now());
      } catch (err) {
        console.error('Error loading config:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStoreConfig();
  }, [selectedSubdomain]);

  // 3. Save Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubdomain) return;

    setSaving(true);
    setMessage(null);

    try {
      const token = getStoredToken();
      const payload = {
        name: formData.name,
        logoUrl: formData.logoUrl,
        templateConfig: {
          theme: formData.theme,
          announcement: formData.announcement,
          hero: formData.hero,
          about: formData.about,
          contact: formData.contact,
        },
      };

      await apiClient(`/stores/customizer/${selectedSubdomain}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      setMessage({ text: `Settings saved successfully for ${formData.name}!`, type: 'success' });
      setPreviewKey(Date.now());
    } catch (err: any) {
      setMessage({ text: err?.message || 'Failed to update store settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshPreview = () => {
    setPreviewKey(Date.now());
  };

  const previewPath = activeTab === 'about' 
    ? `/store/${selectedSubdomain}/about` 
    : activeTab === 'contact' 
    ? `/store/${selectedSubdomain}/contact` 
    : `/store/${selectedSubdomain}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Palette className="h-7 w-7 text-primary" />
            Store Customizer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize branding, promotional tickers, storefront themes, and page content.
          </p>
        </div>

        {/* Top Controls: Preview Toggle & Store Selector */}
        <div className="flex items-center gap-3">
          {/* Live Preview Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${
              showPreview
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>

          {/* Store Selector */}
          <div className="flex items-center gap-2 bg-card border rounded-lg p-1.5 shadow-sm">
            <span className="text-xs font-semibold text-muted-foreground px-1">Store:</span>
            <select
              value={selectedSubdomain}
              onChange={(e) => setSelectedSubdomain(e.target.value)}
              className="bg-background border rounded-md px-3 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {stores.map((s) => (
                <option key={s.subdomain} value={s.subdomain}>
                  {s.name} ({s.subdomain})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alert Notifications */}
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2.5 border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Responsive Grid Layout */}
      <div className={`grid grid-cols-1 ${showPreview ? 'xl:grid-cols-12' : 'max-w-4xl mx-auto'} gap-6 items-start transition-all`}>
        
        {/* LEFT COLUMN: Controls Form */}
        <div className={`${showPreview ? 'xl:col-span-6' : 'w-full'} space-y-6`}>
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b pb-2">
            {[
              { id: 'branding', label: 'Identity & Theme', icon: Sparkles },
              { id: 'announcement', label: 'Announcement Bar', icon: Megaphone },
              { id: 'hero', label: 'Hero Banner', icon: Layout },
              { id: 'about', label: 'About Us', icon: FileText },
              { id: 'contact', label: 'Contact Details', icon: PhoneCall },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              Loading {selectedSubdomain} configuration...
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* TAB 1: BRANDING */}
              {activeTab === 'branding' && (
                <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-base font-semibold">Store Identity & Visual Theme</h2>
                    <p className="text-xs text-muted-foreground">Manage store title, logo URL, and theme style presets.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Logo Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/logo.png"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Theme Preset
                      </label>
                      <select
                        value={formData.theme}
                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="electronics">Electronics (Cyan & Blue Tech Theme)</option>
                        <option value="sports">Sports & Gym (Emerald & Forest Green Theme)</option>
                        <option value="clothing">Apparel & Fashion (Purple & Magenta Theme)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ANNOUNCEMENT BAR */}
              {activeTab === 'announcement' && (
                <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-base font-semibold">Top Announcement Bar / Promotional Ticker</h2>
                    <p className="text-xs text-muted-foreground">Show promotional discounts, coupon codes, or shipping alerts at top of your store.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-accent/40">
                      <div>
                        <span className="text-xs font-bold block text-foreground">Enable Announcement Bar</span>
                        <span className="text-[11px] text-muted-foreground">Show or hide the top promo banner for this store.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.announcement.enabled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            announcement: { ...formData.announcement, enabled: e.target.checked },
                          })
                        }
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Promo Message Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Free Express Nationwide Delivery on all orders over Rs. 3,000!"
                        value={formData.announcement.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            announcement: { ...formData.announcement, text: e.target.value },
                          })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Badge / Tag
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. LIMITED OFFER, SALE, CODE: TECH20"
                          value={formData.announcement.badge}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              announcement: { ...formData.announcement, badge: e.target.value },
                            })
                          }
                          className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Optional Redirect Link
                        </label>
                        <input
                          type="text"
                          placeholder={`/store/${selectedSubdomain}/products`}
                          value={formData.announcement.link}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              announcement: { ...formData.announcement, link: e.target.value },
                            })
                          }
                          className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HERO */}
              {activeTab === 'hero' && (
                <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-base font-semibold">Homepage Hero Banner</h2>
                    <p className="text-xs text-muted-foreground">Catch customer attention with personalized titles and badge texts.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Badge / Eyebrow Text
                      </label>
                      <input
                        type="text"
                        value={formData.hero.eyebrow}
                        onChange={(e) =>
                          setFormData({ ...formData, hero: { ...formData.hero, eyebrow: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={formData.hero.headline}
                        onChange={(e) =>
                          setFormData({ ...formData, hero: { ...formData.hero, headline: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Primary CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.hero.buttonText}
                        onChange={(e) =>
                          setFormData({ ...formData, hero: { ...formData.hero, buttonText: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ABOUT */}
              {activeTab === 'about' && (
                <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-base font-semibold">About Us Page Content</h2>
                    <p className="text-xs text-muted-foreground">Share your brand story and mission statement with shoppers.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Brand Story
                      </label>
                      <textarea
                        rows={4}
                        value={formData.about.story}
                        onChange={(e) =>
                          setFormData({ ...formData, about: { ...formData.about, story: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Mission Statement
                      </label>
                      <input
                        type="text"
                        value={formData.about.mission}
                        onChange={(e) =>
                          setFormData({ ...formData, about: { ...formData.about, mission: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CONTACT */}
              {activeTab === 'contact' && (
                <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-base font-semibold">Contact & Support Details</h2>
                    <p className="text-xs text-muted-foreground">Update customer care helpline, email address and store timings.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={formData.contact.email}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Helpline / Phone
                      </label>
                      <input
                        type="text"
                        value={formData.contact.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Location / Address
                      </label>
                      <input
                        type="text"
                        value={formData.contact.address}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, address: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Office Hours
                      </label>
                      <input
                        type="text"
                        value={formData.contact.officeHours}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, officeHours: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <a
                  href={`/store/${selectedSubdomain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Live Store
                </a>

                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Live Iframe Preview (Conditionally Rendered) */}
        {showPreview && (
          <div className="xl:col-span-6 sticky top-6">
            <div className="bg-card border rounded-2xl p-4 shadow-md space-y-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Preview
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono bg-accent px-2 py-0.5 rounded">
                    {previewPath}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                      previewDevice === 'desktop'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    title="Desktop View"
                  >
                    <Monitor className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                      previewDevice === 'mobile'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    title="Mobile View"
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>

                  <div className="h-4 w-[1px] bg-border mx-1" />

                  <button
                    type="button"
                    onClick={handleRefreshPreview}
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    title="Refresh Preview"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Iframe Viewport */}
              <div className="w-full flex justify-center items-center bg-muted/40 rounded-xl p-2 sm:p-4 min-h-[620px] overflow-hidden border">
                <div
                  className={`transition-all duration-300 overflow-hidden bg-background rounded-lg shadow-xl border ${
                    previewDevice === 'mobile'
                      ? 'w-[375px] h-[600px] ring-8 ring-slate-800 rounded-[36px]'
                      : 'w-full h-[600px]'
                  }`}
                >
                  <iframe
                    ref={iframeRef}
                    key={`${previewPath}-${previewKey}`}
                    src={previewPath}
                    className="w-full h-full border-0"
                    title="Store Live Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}