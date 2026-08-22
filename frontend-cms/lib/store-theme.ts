export type StoreTheme = 'electronics' | 'sports' | 'clothing' | 'boutique' | 'default';

export function getStoreTheme(subDomain: string): StoreTheme {
  const s = (subDomain || '').toLowerCase();
  if (s.includes('boutique') || s.includes('luxury') || s.includes('pret')) return 'boutique';
  if (s.includes('electronic') || s.includes('tech')) return 'electronics';
  if (s.includes('sport') || s.includes('fit')) return 'sports';
  if (s.includes('cloth') || s.includes('apparel')) return 'clothing';
  return 'default';
}