export type StoreTag = 'electronics' | 'sports' | 'clothing' | 'default';

export function getStoreTag(subDomain: string): StoreTag {
  const s = subDomain.toLowerCase();
  if (s.includes('electronic')) return 'electronics';
  if (s.includes('sport')) return 'sports';
  if (s.includes('cloth')) return 'clothing';
  return 'default';
}

export const tagBorderClass: Record<StoreTag, string> = {
  electronics: 'border-l-tag-electronics',
  sports: 'border-l-tag-sports',
  clothing: 'border-l-tag-clothing',
  default: 'border-l-border',
};

export const tagDotClass: Record<StoreTag, string> = {
  electronics: 'bg-tag-electronics',
  sports: 'bg-tag-sports',
  clothing: 'bg-tag-clothing',
  default: 'bg-muted-foreground',
};

export const tagTextClass: Record<StoreTag, string> = {
  electronics: 'text-tag-electronics',
  sports: 'text-tag-sports',
  clothing: 'text-tag-clothing',
  default: 'text-muted-foreground',
};