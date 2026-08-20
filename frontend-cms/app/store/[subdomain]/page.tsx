import { StoreHeroSection } from "@/components/store/StoreHeroSection";
import { StoreStatsSection } from "@/components/store/StoreStatsSection";
import { StoreCategoriesSection } from "@/components/store/StoreCategoriesSection";
import { StoreFeaturedProducts } from "@/components/store/StoreFeaturedProducts";
import { StoreRecentlyViewed } from "@/components/store/StoreRecentlyViewed";
import { StoreHowItWorks } from "@/components/store/StoreHowItWorks";
import { StoreTestimonials } from "@/components/store/StoreTestimonials";
import { apiClient } from "@/lib/api-client";

export default async function StoreHomePage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  let storeData: any = null;
  let storeDisplayName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

  try {
    storeData = await apiClient(`/public/stores/${subdomain}`);
    if (storeData?.name) {
      storeDisplayName = storeData.name;
    }
  } catch {
    // Fallback if store fetch fails
  }

  const templateConfig = storeData?.templateConfig || {};
  const selectedTheme = templateConfig.theme || "";

  const sub = subdomain.toLowerCase();
  const isSports = selectedTheme === "sports" || sub.includes("sport");
  const isClothing = selectedTheme === "clothing" || sub.includes("cloth");

  // Dynamic Root Wrapper Styles for themes
  const rootThemeClass = isSports
    ? "bg-[#020d09] text-emerald-50 selection:bg-emerald-500 selection:text-slate-950"
    : isClothing
    ? "bg-[#0b0314] text-purple-50 selection:bg-purple-500 selection:text-white"
    : "bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950";

  return (
    <main className={`min-h-screen transition-colors duration-300 ${rootThemeClass}`}>
      {/* 1. Hero Section */}
      <StoreHeroSection
        subdomain={subdomain}
        storeName={storeDisplayName}
        heroConfig={templateConfig.hero}
      />

      {/* 2. Impact Counter Numbers */}
      <StoreStatsSection subdomain={subdomain} />

      {/* 3. Product Categories Grid */}
      <StoreCategoriesSection subdomain={subdomain} />

      {/* 4. Hand-Picked Featured Catalog */}
      <StoreFeaturedProducts subdomain={subdomain} />

      {/* 5. Recently Viewed (Local Cache) */}
      <StoreRecentlyViewed subdomain={subdomain} />

      {/* 6. 4-Step Connected Timeline */}
      <StoreHowItWorks subdomain={subdomain} />

      {/* 7. Verified Reviews & Trust Stats */}
      <StoreTestimonials subdomain={subdomain} />
    </main>
  );
}