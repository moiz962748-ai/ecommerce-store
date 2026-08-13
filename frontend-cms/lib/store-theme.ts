export type StoreTheme = 'electronics' | 'sports' | 'clothing' | 'default';

export function getStoreTheme(subDomain: string): StoreTheme {
  const s = subDomain.toLowerCase();
  if (s.includes('electronic')) return 'electronics';
  if (s.includes('sport')) return 'sports';
  if (s.includes('cloth')) return 'clothing';
  return 'default';
}