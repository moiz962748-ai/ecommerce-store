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
  EyeOff,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Share2,
  MessageCircle
} from 'lucide-react';

const DEFAULT_STORES = [
  { name: 'Electronics Store', subdomain: 'electronics' },
  { name: 'Sports Store', subdomain: 'sports' },
  { name: 'Clothing Store', subdomain: 'clothing' },
];

export default function StoreCustomizerPage() {
  const [stores, setStores] = useState<any[]>(DEFAULT_STORES);
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('electronics');
  const [activeTab, setActiveTab] = useState<'branding' | 'announcement' | 'hero' | 'about' | 'contact' | 'social'>('branding');
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    social: {
      whatsapp: {
        enabled: true,
        phone: '+923001234567',
        defaultMessage: 'Hi! I need help with an order on your store.',
      },
      instagram: '',
      facebook: '',
      twitter: '',
      tiktok: '',
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
          social: {
            whatsapp: {
              enabled: config.social?.whatsapp?.enabled !== undefined ? config.social.whatsapp.enabled : true,
              phone: config.social?.whatsapp?.phone || '+923001234567',
              defaultMessage: config.social?.whatsapp?.defaultMessage || 'Hi! I have an inquiry regarding your products.',
            },
            instagram: config.social?.instagram || '',
            facebook: config.social?.facebook || '',
            twitter: config.social?.twitter || '',
            tiktok: config.social?.tiktok || '',
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

  // 3. Direct Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setMessage({ text: 'File size exceeds 3MB limit. Please upload a smaller image.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        logoUrl: base64String,
      }));
      setMessage({ text: 'Logo selected successfully!', type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  // 4. Save Handler
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
          social: formData.social,
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
    <div className="w-full max-w-full overflow-hidden space-y-5 px-1 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary shrink-0" />
            <span>Store Customizer</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Customize branding, promotional tickers, themes, WhatsApp chat, and social channels.
          </p>
        </div>

        {/* Top Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:flex sm:items-center sm:justify-between w-full">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold shadow-sm transition-all ${
              showPreview
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {showPreview ? <Eye className="h-4 w-4 shrink-0" /> : <EyeOff className="h-4 w-4 shrink-0" />}
            <span>{showPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>

          <div className="flex items-center gap-2 bg-card border rounded-lg p-1.5 shadow-sm w-full sm:w-auto min-w-0">
            <span className="text-xs font-semibold text-muted-foreground px-1 shrink-0">Store:</span>
            <select
              value={selectedSubdomain}
              onChange={(e) => setSelectedSubdomain(e.target.value)}
              className="bg-background border rounded-md px-2 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-full min-w-0 truncate"
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
          className={`p-3 sm:p-4 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span className="break-words">{message.text}</span>
        </div>
      )}

      {/* Responsive Grid Layout */}
      <div className={`grid grid-cols-1 ${showPreview ? 'xl:grid-cols-12' : 'max-w-4xl mx-auto'} gap-6 items-start transition-all w-full`}>
        
        {/* LEFT COLUMN: Controls Form */}
        <div className={`${showPreview ? 'xl:col-span-6' : 'w-full'} space-y-5 w-full min-w-0`}>
          
          {/* Scrollable Tabs Bar */}
          <div className="flex items-center gap-1.5 border-b pb-2 overflow-x-auto no-scrollbar w-full">
            {[
              { id: 'branding', label: 'Identity & Theme', icon: Sparkles },
              { id: 'announcement', label: 'Announcement', icon: Megaphone },
              { id: 'hero', label: 'Hero Banner', icon: Layout },
              { id: 'about', label: 'About Us', icon: FileText },
              { id: 'contact', label: 'Contact', icon: PhoneCall },
              { id: 'social', label: 'WhatsApp & Social', icon: Share2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              Loading {selectedSubdomain} configuration...
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5 w-full min-w-0">
              {/* TAB 1: BRANDING */}
              {activeTab === 'branding' && (
                <div className="bg-card text-card-foreground border rounded-xl p-4 sm:p-5 shadow-sm space-y-4 w-full">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold">Store Identity & Visual Theme</h2>
                    <p className="text-xs text-muted-foreground">Manage store title, direct logo upload, and theme style presets.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-background border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Store Logo
                      </label>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 rounded-xl border-2 border-dashed border-border bg-accent/20 w-full">
                        <div className="relative h-14 w-14 shrink-0 rounded-lg border bg-background flex items-center justify-center overflow-hidden shadow-sm">
                          {formData.logoUrl ? (
                            <img
                              src={formData.logoUrl}
                              alt="Store Logo Preview"
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                            onChange={handleImageUpload}
                            className="hidden"
                          />

                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-xs flex items-center gap-1.5 h-8"
                            >
                              <UploadCloud className="h-3.5 w-3.5" />
                              <span>Upload File</span>
                            </Button>

                            {formData.logoUrl && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFormData({ ...formData, logoUrl: '' })}
                                className="text-xs text-destructive hover:text-destructive flex items-center gap-1 h-8"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Remove</span>
                              </Button>
                            )}
                          </div>

                          <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                            PNG, JPG, WebP or SVG (Max 3MB).
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                          Or enter logo image URL:
                        </span>
                        <input
                          type="text"
                          placeholder="https://example.com/logo.png"
                          value={formData.logoUrl}
                          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                          className="w-full bg-background border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring truncate"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Theme Preset
                      </label>
                      <select
                        value={formData.theme}
                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
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
                <div className="bg-card text-card-foreground border rounded-xl p-4 sm:p-5 shadow-sm space-y-4 w-full">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold">Top Announcement Bar</h2>
                    <p className="text-xs text-muted-foreground">Show promo ticker and shipping alerts.</p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-accent/40">
                      <div>
                        <span className="text-xs font-bold block text-foreground">Enable Announcement</span>
                        <span className="text-[10px] text-muted-foreground">Show top promo banner.</span>
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
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Promo Message Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Free Nationwide Delivery over Rs. 3,000!"
                        value={formData.announcement.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            announcement: { ...formData.announcement, text: e.target.value },
                          })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Badge / Tag
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. LIMITED OFFER"
                          value={formData.announcement.badge}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              announcement: { ...formData.announcement, badge: e.target.value },
                            })
                          }
                          className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Redirect Link
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
                          className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HERO */}
              {activeTab === 'hero' && (
                <div className="bg-card text-card-foreground border rounded-xl p-4 sm:p-5 shadow-sm space-y-4 w-full">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold">Homepage Hero Banner</h2>
                    <p className="text-xs text-muted-foreground">Catch customer attention with personalized titles.</p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Badge / Eyebrow Text
                      </label>
                      <input
                        type="text"
                        value={formData.hero.eyebrow}
                        onChange={(e) =>
                          setFormData({ ...formData, hero: { ...formData.hero, eyebrow: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={formData.hero.headline}
                        onChange={(e) =>
                          setFormData({ ...formData, hero: { ...formData.hero, headline: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Primary CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.hero.buttonText}
                        onChange={(e) =>
                          setFormData({ ...formData, hero: { ...formData.hero, buttonText: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ABOUT */}
              {activeTab === 'about' && (
                <div className="bg-card text-card-foreground border rounded-xl p-4 sm:p-5 shadow-sm space-y-4 w-full">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold">About Us Page Content</h2>
                    <p className="text-xs text-muted-foreground">Share your brand story and mission statement.</p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Brand Story
                      </label>
                      <textarea
                        rows={3}
                        value={formData.about.story}
                        onChange={(e) =>
                          setFormData({ ...formData, about: { ...formData.about, story: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Mission Statement
                      </label>
                      <input
                        type="text"
                        value={formData.about.mission}
                        onChange={(e) =>
                          setFormData({ ...formData, about: { ...formData.about, mission: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CONTACT */}
              {activeTab === 'contact' && (
                <div className="bg-card text-card-foreground border rounded-xl p-4 sm:p-5 shadow-sm space-y-4 w-full">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold">Contact & Support Details</h2>
                    <p className="text-xs text-muted-foreground">Update customer care helpline and email.</p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={formData.contact.email}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Helpline / Phone
                      </label>
                      <input
                        type="text"
                        value={formData.contact.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Location / Address
                      </label>
                      <input
                        type="text"
                        value={formData.contact.address}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, address: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Office Hours
                      </label>
                      <input
                        type="text"
                        value={formData.contact.officeHours}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: { ...formData.contact, officeHours: e.target.value } })
                        }
                        className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: WHATSAPP & SOCIAL */}
              {activeTab === 'social' && (
                <div className="bg-card text-card-foreground border rounded-xl p-4 sm:p-5 shadow-sm space-y-4 w-full">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold">Floating WhatsApp & Social Media</h2>
                    <p className="text-xs text-muted-foreground">Setup customer WhatsApp floating chat button and brand social pages.</p>
                  </div>

                  <div className="space-y-4">
                    {/* WhatsApp Box */}
                    <div className="p-3.5 rounded-xl border bg-accent/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs font-bold text-foreground">Floating WhatsApp Chat Widget</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.social.whatsapp.enabled}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              social: {
                                ...formData.social,
                                whatsapp: { ...formData.social.whatsapp, enabled: e.target.checked },
                              },
                            })
                          }
                          className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            WhatsApp Number (with country code)
                          </label>
                          <input
                            type="text"
                            placeholder="+923001234567"
                            value={formData.social.whatsapp.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                social: {
                                  ...formData.social,
                                  whatsapp: { ...formData.social.whatsapp, phone: e.target.value },
                                },
                              })
                            }
                            className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Default Prefilled Message
                          </label>
                          <input
                            type="text"
                            placeholder="Hi! I need help with an order."
                            value={formData.social.whatsapp.defaultMessage}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                social: {
                                  ...formData.social,
                                  whatsapp: { ...formData.social.whatsapp, defaultMessage: e.target.value },
                                },
                              })
                            }
                            className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Instagram URL / Handle
                        </label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/yourstore"
                          value={formData.social.instagram}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              social: { ...formData.social, instagram: e.target.value },
                            })
                          }
                          className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Facebook URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://facebook.com/yourstore"
                          value={formData.social.facebook}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              social: { ...formData.social, facebook: e.target.value },
                            })
                          }
                          className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Twitter / X URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://x.com/yourstore"
                          value={formData.social.twitter}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              social: { ...formData.social, twitter: e.target.value },
                            })
                          }
                          className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          TikTok URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://tiktok.com/@yourstore"
                          value={formData.social.tiktok}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              social: { ...formData.social, tiktok: e.target.value },
                            })
                          }
                          className="w-full bg-background border rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <a
                  href={`/store/${selectedSubdomain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline py-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Live Store</span>
                </a>

                <Button type="submit" disabled={saving} className="w-full sm:w-auto h-10 text-xs sm:text-sm font-bold">
                  {saving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Live Iframe Preview */}
        {showPreview && (
          <div className="xl:col-span-6 sticky top-6 w-full min-w-0">
            <div className="bg-card border rounded-2xl p-3 sm:p-4 shadow-md space-y-3 w-full">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b pb-2.5 gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Preview
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono bg-accent px-1.5 py-0.5 rounded truncate max-w-[120px] sm:max-w-[200px]">
                    {previewPath}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-md text-xs transition-colors ${
                      previewDevice === 'desktop'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                    title="Desktop View"
                  >
                    <Monitor className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-md text-xs transition-colors ${
                      previewDevice === 'mobile'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                    title="Mobile View"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                  </button>

                  <div className="h-3 w-[1px] bg-border mx-0.5" />

                  <button
                    type="button"
                    onClick={handleRefreshPreview}
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-accent transition-colors"
                    title="Refresh Preview"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Iframe Viewport */}
              <div className="w-full flex justify-center items-center bg-muted/40 rounded-xl p-1.5 sm:p-4 min-h-[480px] sm:min-h-[600px] overflow-hidden border">
                <div
                  className={`transition-all duration-300 overflow-hidden bg-background rounded-lg shadow-xl border w-full ${
                    previewDevice === 'mobile'
                      ? 'max-w-[340px] sm:max-w-[375px] h-[520px] sm:h-[580px] ring-4 sm:ring-8 ring-slate-800 rounded-[28px]'
                      : 'w-full h-[520px] sm:h-[580px]'
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