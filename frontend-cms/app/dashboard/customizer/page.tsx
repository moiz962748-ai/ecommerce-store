'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { getStoredToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Layout, FileText, PhoneCall, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

const DEFAULT_STORES = [
  { name: 'Electronics Store', subdomain: 'electronics' },
  { name: 'Sports Store', subdomain: 'sports' },
  { name: 'Clothing Store', subdomain: 'clothing' },
];

export default function StoreCustomizerPage() {
  const [stores, setStores] = useState<any[]>(DEFAULT_STORES);
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('electronics');
  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'about' | 'contact'>('branding');
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    theme: 'electronics',
    primaryColor: '#06b6d4',
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
          primaryColor: config.primaryColor || (selectedSubdomain === 'sports' ? '#10b981' : selectedSubdomain === 'clothing' ? '#a855f7' : '#06b6d4'),
          hero: {
            eyebrow: config.hero?.eyebrow || (selectedSubdomain === 'sports' ? 'Peak Athletic Gear' : selectedSubdomain === 'clothing' ? 'Modern Trendwear' : 'Next-Gen Tech Essentials'),
            headline: config.hero?.headline || (selectedSubdomain === 'sports' ? 'Elevate Your Fitness Journey' : selectedSubdomain === 'clothing' ? 'Define Your Signature Style' : 'Discover Smart Modern Technology'),
            buttonText: config.hero?.buttonText || 'Browse All Products',
          },
          about: {
            story: config.about?.story || 'Delivering premium verified products across Pakistan with express tracking and support.',
            mission: config.about?.mission || 'Committed to superior quality, 100% genuine products, and trusted customer care.',
          },
          contact: {
            email: config.contact?.email || 'support@store.pk',
            phone: config.contact?.phone || '+92 300 1234567',
            address: config.contact?.address || 'Islamabad & Lahore, Pakistan',
            officeHours: config.contact?.officeHours || 'Mon – Sat (9AM – 8PM)',
          },
        });
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
          primaryColor: formData.primaryColor,
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
    } catch (err: any) {
      setMessage({ text: err?.message || 'Failed to update store settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Palette className="h-7 w-7 text-primary" />
            Store Customizer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize branding, storefront theme, and page content.
          </p>
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-3 bg-card border rounded-lg p-1.5 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground px-2">Store:</span>
          <select
            value={selectedSubdomain}
            onChange={(e) => setSelectedSubdomain(e.target.value)}
            className="bg-background border rounded-md px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {stores.map((s) => (
              <option key={s.subdomain} value={s.subdomain}>
                {s.name} ({s.subdomain})
              </option>
            ))}
          </select>
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b pb-2">
        {[
          { id: 'branding', label: 'Identity & Theme', icon: Sparkles },
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
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

      {/* Loading state or Form */}
      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Loading {selectedSubdomain} configuration...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: BRANDING */}
          {activeTab === 'branding' && (
            <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-semibold">Store Identity & Visual Theme</h2>
                <p className="text-xs text-muted-foreground">Manage your store title, logo and main accent colors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
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

                <div>
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Theme Preset
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full bg-background border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="electronics">Electronics (Cyan Theme)</option>
                    <option value="sports">Sports & Gym (Emerald Theme)</option>
                    <option value="clothing">Apparel & Fashion (Purple Theme)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="h-10 w-16 bg-background border rounded-md cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono text-muted-foreground">{formData.primaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO */}
          {activeTab === 'hero' && (
            <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm space-y-6">
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

          {/* TAB 3: ABOUT */}
          {activeTab === 'about' && (
            <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm space-y-6">
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

          {/* TAB 4: CONTACT */}
          {activeTab === 'contact' && (
            <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-semibold">Contact & Support Details</h2>
                <p className="text-xs text-muted-foreground">Update customer care helpline, email address and store timings.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4">
            <a
              href={`/store/${selectedSubdomain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              View Live Store ({selectedSubdomain})
            </a>

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}