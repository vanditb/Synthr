type ImageRole = 'hero' | 'interior' | 'food' | 'dish' | 'dessert' | 'bar' | 'logo';

type ImageAsset = {
  role: ImageRole;
  url: string;
  alt: string;
};

type GenerationMenuItem = {
  name?: string;
  description?: string;
  price?: unknown;
  displayPrice?: string;
  category?: string;
  dietary?: string[];
};

export type GenerationContentPlan = {
  heroSupport?: string;
  heroHighlights?: string[];
  storyHeading?: string;
  storyBody?: string;
  storyFacts?: string[];
  menuHeading?: string;
  menuIntro?: string;
  menuItemDescriptions?: Array<{
    name?: string;
    description?: string;
  }>;
  experienceHeading?: string;
  experienceBody?: string;
  reserveHeading?: string;
  reserveBody?: string;
  orderHeading?: string;
  orderBody?: string;
  visitHeading?: string;
  visitBody?: string;
  footerTagline?: string;
};

type GenerationPayload = {
  name?: string;
  type?: string;
  style?: string;
  tone?: string;
  cuisineType?: string;
  priceRange?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  tagline?: string;
  hours?: Record<string, string>;
  pages?: string[];
  description?: string;
  brand?: {
    summary?: string;
    story?: string;
    atmosphere?: string;
    audience?: string;
    keywords?: string[];
    heroFocus?: string;
  };
  primaryCta?: string;
  signatureDishes?: string[];
  services?: {
    dineIn?: boolean;
    takeout?: boolean;
    delivery?: boolean;
    catering?: boolean;
    privateDining?: boolean;
  };
  ordering?: {
    enabled?: boolean;
    provider?: string;
    url?: string;
  };
  domainPreference?: string;
  advanced?: {
    founderName?: string;
    yearFounded?: number;
    neighborhood?: string;
    parking?: string;
    weeklySpecials?: string;
    awards?: string[];
    dietaryAccommodations?: string[];
    cateringEmail?: string;
    privateEventCapacity?: number;
  };
  dineIn?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  shortDescription?: string;
  fullStory?: string;
  yearFounded?: number;
  founderName?: string;
  menu?: GenerationMenuItem[];
  menuSourceText?: string;
  menuSourceImages?: string[];
  onlineOrdering?: {
    acceptOrders?: boolean;
    platforms?: string[];
    customURL?: string;
  };
  reservations?: {
    acceptReservations?: boolean;
    platforms?: string[];
    url?: string;
  };
  googleMapsLink?: string;
  parking?: string;
  neighborhood?: string;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    yelp?: string;
    googleReviews?: string;
    facebook?: string;
  };
  hostEvents?: boolean;
  eventTypes?: string[];
  weeklySpecials?: string;
  cateringAvailable?: boolean;
  cateringEmail?: string;
  privateEventCapacity?: number;
  images?: Array<{ type: 'interior' | 'food' | 'logo'; data: string }>;
  useStockImages?: boolean;
  customInstruction?: string;
  existingHtml?: string;
  assistantImage?: string;
  contentPlan?: GenerationContentPlan;
};

export type GenerationMeta = {
  source: 'model' | 'fallback' | 'existing';
  validationIssues: string[];
  modelValidationIssues?: string[];
  finalHtmlValidationIssues?: string[];
};

export const GENERATION_SYSTEM_PROMPT = `You are a senior restaurant website designer and front-end engineer.
Return only complete HTML documents.
Use the user's data exactly where facts are provided.
Do not invent menu items, addresses, phone numbers, hours, or reservation platforms.
Prefer strong visual hierarchy, clear CTAs, semantic HTML, and mobile-safe layouts.
Avoid filler marketing language and repetitive section structures.`;

export const GENERATION_CONTENT_PLAN_SYSTEM_PROMPT = `You are a senior restaurant brand strategist and hospitality copywriter.
Return JSON only.
Write concise, premium, restaurant-specific copy that feels believable and human.
Use the provided facts exactly where given.
Do not invent menu items, addresses, phone numbers, hours, reservation platforms, reviews, or awards.
Keep copy grounded in hospitality language, not startup or generic marketing language.`;

const cuisineImagePools: Record<string, Record<ImageRole, ImageAsset[]>> = {
  italian: {
    hero: [
      { role: 'hero', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80', alt: 'Italian restaurant interior' },
      { role: 'hero', url: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1600&q=80', alt: 'Cozy trattoria ambiance' },
    ],
    interior: [
      { role: 'interior', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80', alt: 'Elegant dining room' },
      { role: 'interior', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1600&q=80', alt: 'Modern restaurant seating' },
    ],
    food: [
      { role: 'food', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80', alt: 'Italian pasta dish' },
      { role: 'food', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80', alt: 'Pizza with fresh ingredients' },
    ],
    dish: [
      { role: 'dish', url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1600&q=80', alt: 'Handmade pasta' },
      { role: 'dish', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80', alt: 'Signature pasta plate' },
    ],
    dessert: [
      { role: 'dessert', url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1600&q=80', alt: 'Tiramisu dessert' },
      { role: 'dessert', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1600&q=80', alt: 'Chocolate dessert' },
    ],
    bar: [
      { role: 'bar', url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80', alt: 'Cocktail bar' },
    ],
    logo: [],
  },
  indian: {
    hero: [
      { role: 'hero', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1600&q=80', alt: 'Indian dishes on a table' },
      { role: 'hero', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1600&q=80', alt: 'Warm Indian restaurant setting' },
    ],
    interior: [
      { role: 'interior', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80', alt: 'Warm dining room lighting' },
    ],
    food: [
      { role: 'food', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=80', alt: 'Indian curry spread' },
      { role: 'food', url: 'https://images.unsplash.com/photo-1596797038530-2c107aaedc16?auto=format&fit=crop&w=1600&q=80', alt: 'Tandoori dish' },
    ],
    dish: [
      { role: 'dish', url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1600&q=80', alt: 'Paneer dish' },
    ],
    dessert: [
      { role: 'dessert', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1600&q=80', alt: 'Indian dessert' },
    ],
    bar: [
      { role: 'bar', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80', alt: 'Cocktail bar' },
    ],
    logo: [],
  },
  japanese: {
    hero: [
      { role: 'hero', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80', alt: 'Japanese cuisine spread' },
      { role: 'hero', url: 'https://images.unsplash.com/photo-1542528180-1c2803fa048c?auto=format&fit=crop&w=1600&q=80', alt: 'Minimal Japanese dining' },
    ],
    interior: [
      { role: 'interior', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1600&q=80', alt: 'Modern restaurant interior' },
    ],
    food: [
      { role: 'food', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80', alt: 'Ramen bowl' },
      { role: 'food', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80', alt: 'Sushi assortment' },
    ],
    dish: [
      { role: 'dish', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80', alt: 'Sushi plate' },
    ],
    dessert: [],
    bar: [
      { role: 'bar', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80', alt: 'Bar drinks' },
    ],
    logo: [],
  },
  cafe: {
    hero: [
      { role: 'hero', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80', alt: 'Cafe counter' },
      { role: 'hero', url: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1600&q=80', alt: 'Coffee shop seating' },
    ],
    interior: [
      { role: 'interior', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80', alt: 'Cafe interior' },
    ],
    food: [
      { role: 'food', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80', alt: 'Coffee and pastry' },
      { role: 'food', url: 'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1600&q=80', alt: 'Breakfast plate' },
    ],
    dish: [],
    dessert: [],
    bar: [],
    logo: [],
  },
  pizzeria: {
    hero: [
      { role: 'hero', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80', alt: 'Pizza close-up' },
      { role: 'hero', url: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1600&q=80', alt: 'Pizza on table' },
    ],
    interior: [
      { role: 'interior', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80', alt: 'Neighborhood pizzeria interior' },
    ],
    food: [
      { role: 'food', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80', alt: 'Pepperoni pizza' },
    ],
    dish: [
      { role: 'dish', url: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1600&q=80', alt: 'Pizza slices' },
    ],
    dessert: [],
    bar: [],
    logo: [],
  },
};

const defaultStockImagePool: Record<ImageRole, ImageAsset[]> = {
  hero: [
    { role: 'hero', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80', alt: 'Elegant restaurant dining room' },
    { role: 'hero', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80', alt: 'Beautifully plated dishes on a table' },
  ],
  interior: [
    { role: 'interior', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80', alt: 'Warm, inviting restaurant interior' },
  ],
  food: [
    { role: 'food', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80', alt: 'Plated signature entree' },
  ],
  dish: [
    { role: 'dish', url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1600&q=80', alt: 'Chef-prepared seasonal dish' },
  ],
  dessert: [
    { role: 'dessert', url: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1600&q=80', alt: 'Dessert with berries' },
  ],
  bar: [
    { role: 'bar', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80', alt: 'Cocktails at the bar' },
  ],
  logo: [],
};

const hashString = (value: string): number => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
};

const pickDeterministic = <T,>(items: T[], seed: number): T => items[Math.abs(seed) % items.length];

const getCuisinePool = (cuisineType?: string): Record<ImageRole, ImageAsset[]> => {
  const key = (cuisineType || '').toLowerCase();
  if (key.includes('italian')) return cuisineImagePools.italian;
  if (key.includes('japanese')) return cuisineImagePools.japanese;
  if (key.includes('indian')) return cuisineImagePools.indian;
  if (key.includes('cafe') || key.includes('coffee')) return cuisineImagePools.cafe;
  if (key.includes('pizza') || key.includes('pizzeria')) return cuisineImagePools.pizzeria;
  return defaultStockImagePool;
};

const formatMenuPrice = (price: unknown): string => {
  if (typeof price === 'number' && Number.isFinite(price)) {
    return `$${price.toFixed(2)}`;
  }

  const trimmed = String(price ?? '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('$') ? trimmed : `$${trimmed}`;
};

const buildImageAssets = (
  images: GenerationPayload['images'],
  useStockImages: boolean | undefined,
  cuisineType?: string,
  name?: string,
  style?: string
): ImageAsset[] => {
  const assets: ImageAsset[] = [];
  const seen = new Set<string>();

  if (images?.length) {
    for (const img of images) {
      if (!img?.data || seen.has(img.data)) continue;
      seen.add(img.data);
      if (img.type === 'logo') assets.push({ role: 'logo', url: img.data, alt: 'Restaurant logo' });
      if (img.type === 'interior') assets.push({ role: 'interior', url: img.data, alt: 'Restaurant interior' });
      if (img.type === 'food') assets.push({ role: 'food', url: img.data, alt: 'Signature dish' });
    }
  }

  if (!useStockImages) return assets;

  const pool = getCuisinePool(cuisineType);
  const seed = hashString(`${name || ''}:${cuisineType || ''}:${style || ''}`);
  const flattenedPool = Object.values(pool).flat();
  let cursor = 0;
  while (assets.length < 8 && flattenedPool.length > 0) {
    const candidate = pickDeterministic(flattenedPool, seed + cursor);
    cursor += 1;
    if (candidate?.url && !seen.has(candidate.url)) {
      seen.add(candidate.url);
      assets.push(candidate);
    }
    if (cursor > 40) break;
  }
  return assets;
};

type CuratedMenuItem = {
  name: string;
  description: string;
  price: string;
  category: string;
  dietary: string[];
  featured: boolean;
};

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const stripTags = (value: unknown): string =>
  String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeCopy = (value: unknown): string =>
  stripTags(value)
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

const truncateCopy = (value: string, maxLength: number): string => {
  const clean = normalizeCopy(value);
  if (clean.length <= maxLength) return clean;
  const next = clean.slice(0, maxLength).replace(/\s+\S*$/, '');
  return `${next.trim()}...`;
};

const formatSentence = (value: string): string => {
  const clean = normalizeCopy(value);
  if (!clean) return '';
  const sentence = clean.charAt(0).toUpperCase() + clean.slice(1);
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
};

const formatLabel = (value: string): string => {
  const clean = normalizeCopy(value);
  if (!clean) return '';
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

const formatHeading = (value: string): string => normalizeCopy(value).replace(/[.!?]+$/g, '').trim();

const isGenericPlannedCopy = (value: string): boolean =>
  /(our story|our menu|our [a-z]+\s+kitchen|reservations?$|reserve( your)? table|book( your)? table|order( online| now| takeout)?|visit( us)?|dine with us|contact us|welcome to|indulge in|unforgettable|crafted with love|experience the|join us for)/i.test(
    normalizeCopy(value)
  );

const preferPlannedCopy = (plannedValue: string | undefined, fallbackValue: string, allowGeneric = false): string => {
  const clean = normalizeCopy(plannedValue);
  if (!clean) return fallbackValue;
  if (!allowGeneric && isGenericPlannedCopy(clean)) return fallbackValue;
  return clean;
};

const normalizePlanList = (value: unknown, maxItems = 4, maxLength = 90): string[] =>
  Array.isArray(value)
    ? dedupeStrings(
        value
          .map((entry) => truncateCopy(normalizeCopy(entry), maxLength))
          .filter(Boolean)
          .slice(0, maxItems)
      )
    : [];

export const normalizeGenerationContentPlan = (value: unknown): GenerationContentPlan => {
  const plan = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const menuItemDescriptions = Array.isArray(plan.menuItemDescriptions)
    ? plan.menuItemDescriptions
        .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === 'object')
        .map((entry) => ({
          name: formatLabel(truncateCopy(normalizeCopy(entry.name), 80)),
          description: formatSentence(truncateCopy(normalizeCopy(entry.description), 170)),
        }))
        .filter((entry) => entry.name && entry.description)
        .slice(0, 14)
    : [];

  return {
    heroSupport: formatSentence(truncateCopy(normalizeCopy(plan.heroSupport), 170)),
    heroHighlights: normalizePlanList(plan.heroHighlights, 4, 80),
    storyHeading: formatHeading(truncateCopy(normalizeCopy(plan.storyHeading), 90)),
    storyBody: formatSentence(truncateCopy(normalizeCopy(plan.storyBody), 340)),
    storyFacts: normalizePlanList(plan.storyFacts, 4, 80),
    menuHeading: formatHeading(truncateCopy(normalizeCopy(plan.menuHeading), 110)),
    menuIntro: formatSentence(truncateCopy(normalizeCopy(plan.menuIntro), 260)),
    menuItemDescriptions,
    experienceHeading: formatHeading(truncateCopy(normalizeCopy(plan.experienceHeading), 100)),
    experienceBody: formatSentence(truncateCopy(normalizeCopy(plan.experienceBody), 300)),
    reserveHeading: formatHeading(truncateCopy(normalizeCopy(plan.reserveHeading), 100)),
    reserveBody: formatSentence(truncateCopy(normalizeCopy(plan.reserveBody), 260)),
    orderHeading: formatHeading(truncateCopy(normalizeCopy(plan.orderHeading), 100)),
    orderBody: formatSentence(truncateCopy(normalizeCopy(plan.orderBody), 240)),
    visitHeading: formatHeading(truncateCopy(normalizeCopy(plan.visitHeading), 100)),
    visitBody: formatSentence(truncateCopy(normalizeCopy(plan.visitBody), 260)),
    footerTagline: formatSentence(truncateCopy(normalizeCopy(plan.footerTagline), 180)),
  };
};

export const parseGenerationContentPlan = (raw: string): GenerationContentPlan => {
  const source = String(raw || '').trim();
  if (!source) return {};

  const withoutFences = source.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  const candidateStrings = [withoutFences];
  const objectMatch = withoutFences.match(/\{[\s\S]*\}/);
  if (objectMatch?.[0] && objectMatch[0] !== withoutFences) {
    candidateStrings.push(objectMatch[0]);
  }

  for (const candidate of candidateStrings) {
    try {
      return normalizeGenerationContentPlan(JSON.parse(candidate));
    } catch (_error) {
      continue;
    }
  }

  return {};
};

const slugify = (value: string): string =>
  normalizeCopy(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';

const safeHref = (value: unknown, fallback = '#'): string => {
  const href = String(value ?? '').trim();
  if (!href) return fallback;
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return escapeHtml(href);
  return fallback;
};

const dedupeStrings = (items: Array<string | undefined | null>): string[] => {
  const seen = new Set<string>();
  return items
    .map((item) => normalizeCopy(item))
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const formatProviderLabel = (value?: string): string => {
  const provider = normalizeCopy(value);
  if (!provider) return '';
  const lower = provider.toLowerCase();
  if (lower === 'opentable') return 'OpenTable';
  if (lower === 'ubereats') return 'Uber Eats';
  if (lower === 'doordash') return 'DoorDash';
  if (lower === 'resy') return 'Resy';
  if (lower === 'toast') return 'Toast';
  if (lower === 'square') return 'Square';
  return provider.charAt(0).toUpperCase() + provider.slice(1);
};

const formatSocialHref = (platform: 'instagram' | 'tiktok', value?: string): string => {
  const clean = normalizeCopy(value);
  if (!clean) return '';
  if (/^https?:\/\//i.test(clean)) return clean;
  if (platform === 'instagram') return `https://instagram.com/${clean.replace(/^@/, '')}`;
  return `https://tiktok.com/@${clean.replace(/^@/, '')}`;
};

const isLikelyCategoryHeading = (line: string): boolean => {
  if (!line) return false;
  if (/\$\s*\d/.test(line)) return false;
  if (line.length > 32) return false;
  if (/[.!?]/.test(line)) return false;
  const words = line.split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 4) return false;
  return words.every((word) => /^[A-Z][A-Za-z&'/-]*$/.test(word) || /^[A-Z]{2,}$/.test(word));
};

const parseMenuSourceText = (rawText?: string): GenerationMenuItem[] => {
  const source = String(rawText || '').replace(/\r/g, '\n');
  if (!source.trim()) return [];

  const lines = source
    .split('\n')
    .map((line) => normalizeCopy(line.replace(/^[•*\-]+\s*/, '')))
    .filter(Boolean);

  const parsed: GenerationMenuItem[] = [];
  let currentCategory = 'Featured';

  for (const line of lines) {
    if (isLikelyCategoryHeading(line)) {
      currentCategory = line;
      continue;
    }

    const priceMatch = line.match(/^(.*?)(?:\s+[-–|]\s+|\s{2,})?(\$?\d+(?:\.\d{1,2})?)$/);
    if (priceMatch) {
      const name = normalizeCopy(priceMatch[1]);
      const price = formatMenuPrice(priceMatch[2]);
      if (name) {
        parsed.push({
          name,
          price,
          displayPrice: price,
          description: '',
          category: currentCategory,
          dietary: [],
        });
      }
      continue;
    }

    const lastItem = parsed[parsed.length - 1];
    if (lastItem && !lastItem.description) {
      lastItem.description = line;
      continue;
    }

    if (line.length <= 56) {
      parsed.push({
        name: line,
        price: '',
        displayPrice: '',
        description: '',
        category: currentCategory,
        dietary: [],
      });
    }
  }

  return parsed.filter((item) => normalizeCopy(item.name));
};

const getMenuDescriptionOverride = (payload: GenerationPayload, itemName: string): string => {
  const plan = normalizeGenerationContentPlan(payload.contentPlan);
  const key = normalizeCopy(itemName).toLowerCase();
  const match = (plan.menuItemDescriptions || []).find((entry) => normalizeCopy(entry.name).toLowerCase() === key);
  return formatSentence(match?.description || '');
};

const buildMenuDescription = (
  payload: GenerationPayload,
  item: { name?: string; description?: string; category?: string; dietary?: string[] },
  cuisineType?: string
): string => {
  const override = item.name ? getMenuDescriptionOverride(payload, item.name) : '';
  if (override) return override;

  const base = formatSentence(item.description || '');
  if (base) return base;

  const parts = dedupeStrings([
    item.category ? `${formatLabel(item.category)} favorite` : '',
    Array.isArray(item.dietary) && item.dietary.length ? `${item.dietary.join(' and ')} option` : '',
    cuisineType ? `${normalizeCopy(cuisineType)} staple` : '',
  ]);

  return formatSentence(parts.slice(0, 2).join(', '));
};

const buildCuratedMenuItems = (payload: GenerationPayload): CuratedMenuItem[] => {
  const structuredItems = (payload.menu || []).map((item) => ({
    name: normalizeCopy(item.name),
    description: buildMenuDescription(payload, item, payload.cuisineType),
    price: formatMenuPrice(item.displayPrice ?? item.price),
    category: normalizeCopy(item.category) || 'Featured',
    dietary: Array.isArray(item.dietary) ? item.dietary.map((entry) => normalizeCopy(entry)).filter(Boolean) : [],
  }));

  const parsedItems = parseMenuSourceText(payload.menuSourceText).map((item) => ({
    name: normalizeCopy(item.name),
    description: buildMenuDescription(payload, item, payload.cuisineType),
    price: formatMenuPrice(item.displayPrice ?? item.price),
    category: normalizeCopy(item.category) || 'Featured',
    dietary: Array.isArray(item.dietary) ? item.dietary.map((entry) => normalizeCopy(entry)).filter(Boolean) : [],
  }));

  const featuredSet = new Set((payload.signatureDishes || []).map((dish) => normalizeCopy(dish).toLowerCase()));
  const seen = new Set<string>();

  return [...structuredItems, ...parsedItems]
    .filter((item) => item.name)
    .filter((item) => {
      const key = `${item.name.toLowerCase()}|${item.category.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item, index) => ({
      ...item,
      description: item.description || '',
      featured: featuredSet.has(item.name.toLowerCase()) || index < 3,
    }))
    .slice(0, 14);
};

type LayoutVariant = 'editorial-luxe' | 'modern-minimal' | 'warm-neighborhood' | 'bold-upscale';
type HeroVariant = 'immersive-overlay' | 'split-story' | 'reservation-card' | 'stacked-marquee';
type MenuVariant = 'editorial-list' | 'two-column-panels' | 'striped-showcase' | 'compact-grid';
type NavPattern = 'floating-glass' | 'inline-minimal' | 'solid-bar' | 'wordmark-left';
type ImageTreatment = 'cinematic' | 'soft-natural' | 'high-contrast' | 'editorial-collage';

type DesignSystem = {
  seed: number;
  variant: LayoutVariant;
  palette: {
    canvas: string;
    canvasAlt: string;
    surface: string;
    surfaceAlt: string;
    accent: string;
    accentStrong: string;
    accentSoft: string;
    ink: string;
    muted: string;
    border: string;
    footer: string;
    heroOverlay: string;
  };
  typography: {
    fontLink: string;
    bodyFamily: string;
    headingFamily: string;
    heroSize: string;
    headingSize: string;
  };
  spacing: {
    section: string;
    container: string;
    rhythm: string;
  };
  radius: {
    panel: string;
    media: string;
    button: string;
  };
  shadows: {
    soft: string;
    card: string;
    hero: string;
  };
  borders: {
    hairline: string;
    panel: string;
  };
  cta: {
    primary: string;
    secondary: string;
  };
  nav: {
    shell: string;
    link: string;
  };
  hero: {
    variant: HeroVariant;
    height: string;
    contentWidth: string;
  };
  menu: {
    variant: MenuVariant;
  };
  layout: {
    navPattern: NavPattern;
    imageTreatment: ImageTreatment;
    sectionOrder: string[];
  };
};

const getSeedFromPayload = (payload: GenerationPayload) =>
  hashString(
    [
      payload.name || '',
      payload.cuisineType || '',
      payload.style || '',
      payload.tone || '',
      payload.priceRange || '',
      payload.primaryCta || '',
    ].join('|')
  );

const chooseLayoutVariant = (payload: GenerationPayload, seed: number): LayoutVariant => {
  const styleKey = (payload.style || '').toLowerCase();
  const toneKey = (payload.tone || '').toLowerCase();
  const cuisineKey = (payload.cuisineType || '').toLowerCase();

  if (styleKey.includes('luxury') || toneKey.includes('upscale')) return 'editorial-luxe';
  if (styleKey.includes('clean') || cuisineKey.includes('cafe') || cuisineKey.includes('coffee')) return 'modern-minimal';
  if (styleKey.includes('casual') || toneKey.includes('family') || toneKey.includes('traditional')) return 'warm-neighborhood';
  if (cuisineKey.includes('pizza') || toneKey.includes('trendy')) return 'bold-upscale';

  const variants: LayoutVariant[] = ['editorial-luxe', 'modern-minimal', 'warm-neighborhood', 'bold-upscale'];
  return pickDeterministic(variants, seed);
};

const chooseHeroVariant = (payload: GenerationPayload, variant: LayoutVariant, seed: number): HeroVariant => {
  if (payload.primaryCta === 'reservations') return variant === 'editorial-luxe' ? 'reservation-card' : 'split-story';
  if (payload.primaryCta === 'online-orders') return 'stacked-marquee';
  const map: Record<LayoutVariant, HeroVariant[]> = {
    'editorial-luxe': ['immersive-overlay', 'reservation-card'],
    'modern-minimal': ['split-story', 'immersive-overlay'],
    'warm-neighborhood': ['split-story', 'stacked-marquee'],
    'bold-upscale': ['stacked-marquee', 'immersive-overlay'],
  };
  return pickDeterministic(map[variant], seed + 11);
};

const chooseMenuLayout = (payload: GenerationPayload, variant: LayoutVariant, seed: number): MenuVariant => {
  const cuisineKey = (payload.cuisineType || '').toLowerCase();
  if (cuisineKey.includes('pizza') || cuisineKey.includes('cafe')) return 'striped-showcase';
  const map: Record<LayoutVariant, MenuVariant[]> = {
    'editorial-luxe': ['editorial-list', 'two-column-panels'],
    'modern-minimal': ['two-column-panels', 'compact-grid'],
    'warm-neighborhood': ['striped-showcase', 'two-column-panels'],
    'bold-upscale': ['striped-showcase', 'compact-grid'],
  };
  return pickDeterministic(map[variant], seed + 17);
};

const chooseNavPattern = (variant: LayoutVariant, seed: number): NavPattern =>
  pickDeterministic(
    {
      'editorial-luxe': ['floating-glass', 'wordmark-left'],
      'modern-minimal': ['inline-minimal', 'wordmark-left'],
      'warm-neighborhood': ['solid-bar', 'wordmark-left'],
      'bold-upscale': ['floating-glass', 'solid-bar'],
    }[variant] as NavPattern[],
    seed + 23
  );

const chooseImageTreatment = (variant: LayoutVariant, seed: number): ImageTreatment =>
  pickDeterministic(
    {
      'editorial-luxe': ['cinematic', 'editorial-collage'],
      'modern-minimal': ['soft-natural', 'cinematic'],
      'warm-neighborhood': ['soft-natural', 'editorial-collage'],
      'bold-upscale': ['high-contrast', 'cinematic'],
    }[variant] as ImageTreatment[],
    seed + 31
  );

const chooseSectionOrder = (payload: GenerationPayload, variant: LayoutVariant, seed: number): string[] => {
  const primaryCta = payload.primaryCta || 'reservations';
  const base = ['about', 'menu', 'experience', 'hours', 'reserve', 'order', 'contact'];

  if (primaryCta === 'online-orders') {
    return ['menu', 'about', 'experience', 'order', 'hours', 'reserve', 'contact'];
  }

  if ((payload.cuisineType || '').toLowerCase().includes('cafe')) {
    return ['menu', 'about', 'hours', 'experience', 'order', 'contact', 'reserve'];
  }

  if (variant === 'editorial-luxe') {
    return ['about', 'experience', 'menu', 'reserve', 'hours', 'order', 'contact'];
  }

  if (variant === 'bold-upscale' && seed % 2 === 0) {
    return ['menu', 'experience', 'about', 'order', 'hours', 'reserve', 'contact'];
  }

  return base;
};

const getTypographyPairing = (variant: LayoutVariant, style?: string) => {
  const styleKey = (style || '').toLowerCase();
  if (variant === 'editorial-luxe' || styleKey.includes('luxury')) {
    return {
      fontLink:
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap',
      bodyFamily: "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif",
      headingFamily: "'Cormorant Garamond', 'Manrope', serif",
      heroSize: 'clamp(3.5rem, 7vw, 6.5rem)',
      headingSize: 'clamp(2.2rem, 4vw, 3.6rem)',
    };
  }
  if (variant === 'modern-minimal') {
    return {
      fontLink:
        'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap',
      bodyFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
      headingFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
      heroSize: 'clamp(3rem, 6vw, 5.2rem)',
      headingSize: 'clamp(2rem, 3.5vw, 3rem)',
    };
  }
  if (variant === 'warm-neighborhood') {
    return {
      fontLink:
        'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700&display=swap',
      bodyFamily: "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif",
      headingFamily: "'Fraunces', 'Manrope', serif",
      heroSize: 'clamp(3rem, 6vw, 5.5rem)',
      headingSize: 'clamp(2rem, 3.8vw, 3.2rem)',
    };
  }
  return {
    fontLink:
      'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap',
    bodyFamily: "'Sora', system-ui, -apple-system, 'Segoe UI', sans-serif",
    headingFamily: "'Space Grotesk', 'Sora', system-ui, sans-serif",
    heroSize: 'clamp(3.1rem, 6.4vw, 5.8rem)',
    headingSize: 'clamp(2rem, 3.8vw, 3.3rem)',
  };
};

const getDesignSystem = (payload: GenerationPayload): DesignSystem => {
  const seed = getSeedFromPayload(payload);
  const variant = chooseLayoutVariant(payload, seed);
  const palette = getThemePalette(payload.cuisineType, payload.style, payload.tone, variant);
  const typography = getTypographyPairing(variant, payload.style);
  const heroVariant = chooseHeroVariant(payload, variant, seed);
  const menuVariant = chooseMenuLayout(payload, variant, seed);
  const navPattern = chooseNavPattern(variant, seed);
  const imageTreatment = chooseImageTreatment(variant, seed);
  const sectionOrder = chooseSectionOrder(payload, variant, seed);
  const upscale = payload.priceRange === '$$$';

  return {
    seed,
    variant,
    palette,
    typography,
    spacing: {
      section: upscale ? 'py-24 md:py-32' : 'py-20 md:py-24',
      container: 'px-6 sm:px-8 lg:px-10',
      rhythm: upscale ? 'space-y-10' : 'space-y-8',
    },
    radius: {
      panel: upscale ? '28px' : '24px',
      media: upscale ? '32px' : '26px',
      button: '999px',
    },
    shadows: {
      soft: '0 18px 50px -36px rgba(15, 23, 42, 0.34)',
      card: variant === 'editorial-luxe' ? '0 30px 90px -42px rgba(15, 23, 42, 0.38)' : '0 24px 70px -42px rgba(15, 23, 42, 0.26)',
      hero: '0 45px 120px -56px rgba(15, 23, 42, 0.55)',
    },
    borders: {
      hairline: `1px solid ${palette.border}`,
      panel: `1px solid ${palette.border}`,
    },
    cta: {
      primary: `background:${palette.accentStrong}; color:white; border:1px solid transparent;`,
      secondary: `background:transparent; color:${palette.ink}; border:1px solid ${palette.border};`,
    },
    nav: {
      shell:
        navPattern === 'floating-glass'
          ? `background:rgba(22,19,17,0.58); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border:1px solid rgba(255,255,255,0.14); box-shadow:${variant === 'editorial-luxe' ? '0 18px 40px -28px rgba(15,23,42,0.42)' : '0 14px 36px -28px rgba(15,23,42,0.34)'};`
          : navPattern === 'solid-bar'
            ? `background:rgba(22,19,17,0.72); border:1px solid rgba(255,255,255,0.14);`
            : 'background:rgba(22,19,17,0.52); border:1px solid rgba(255,255,255,0.12); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);',
      link: 'color:rgba(255,255,255,0.94);',
    },
    hero: {
      variant: heroVariant,
      height: heroVariant === 'stacked-marquee' ? 'min-height:88vh;' : 'min-height:78vh;',
      contentWidth: heroVariant === 'immersive-overlay' ? 'max-width: 50rem;' : 'max-width: 40rem;',
    },
    menu: {
      variant: menuVariant,
    },
    layout: {
      navPattern,
      imageTreatment,
      sectionOrder,
    },
  };
};

const getThemePalette = (cuisineType?: string, style?: string, tone?: string, variant?: LayoutVariant) => {
  const cuisine = (cuisineType || '').toLowerCase();
  const styleKey = (style || '').toLowerCase();
  const toneKey = (tone || '').toLowerCase();

  if (cuisine.includes('indian')) {
    return {
      canvas: '#fff7ef',
      canvasAlt: '#fff1e5',
      surface: '#fffaf4',
      surfaceAlt: '#fff0de',
      accent: '#c86c15',
      accentStrong: '#af4d0d',
      accentSoft: '#f6c999',
      ink: '#3f210d',
      muted: '#81573d',
      border: 'rgba(140, 87, 34, 0.16)',
      footer: '#26150d',
      heroOverlay: 'rgba(38, 21, 13, 0.54)',
    };
  }
  if (cuisine.includes('italian')) {
    return {
      canvas: '#fbf5ef',
      canvasAlt: '#f7ede2',
      surface: '#fffaf6',
      surfaceAlt: '#f8efe8',
      accent: '#9f2f21',
      accentStrong: '#7d1f16',
      accentSoft: '#f0c5b8',
      ink: '#342019',
      muted: '#725449',
      border: 'rgba(111, 72, 60, 0.14)',
      footer: '#1c1513',
      heroOverlay: 'rgba(28, 21, 19, 0.46)',
    };
  }
  if (cuisine.includes('japanese')) {
    return {
      canvas: '#f7f8fb',
      canvasAlt: '#eff2f8',
      surface: '#ffffff',
      surfaceAlt: '#eef2f7',
      accent: '#234bb9',
      accentStrong: '#173785',
      accentSoft: '#c5d6ff',
      ink: '#17233d',
      muted: '#4b5b80',
      border: 'rgba(35, 75, 185, 0.14)',
      footer: '#101827',
      heroOverlay: 'rgba(16, 24, 39, 0.52)',
    };
  }
  if (cuisine.includes('cafe') || cuisine.includes('coffee')) {
    return {
      canvas: '#fcfaf6',
      canvasAlt: '#f4eee4',
      surface: '#fffdf9',
      surfaceAlt: '#efe7da',
      accent: '#8c5a2d',
      accentStrong: '#6f4220',
      accentSoft: '#e9d2b7',
      ink: '#2a2018',
      muted: '#6b5848',
      border: 'rgba(92, 67, 45, 0.15)',
      footer: '#18130f',
      heroOverlay: 'rgba(24, 19, 15, 0.42)',
    };
  }
  if (cuisine.includes('pizza')) {
    return {
      canvas: '#fff6ef',
      canvasAlt: '#ffe7dd',
      surface: '#fffdfa',
      surfaceAlt: '#ffece1',
      accent: '#c94422',
      accentStrong: '#a72d12',
      accentSoft: '#ffc48e',
      ink: '#34180f',
      muted: '#7f4b38',
      border: 'rgba(157, 69, 39, 0.15)',
      footer: '#21110d',
      heroOverlay: 'rgba(33, 17, 13, 0.48)',
    };
  }
  if (styleKey.includes('luxury') || toneKey.includes('upscale')) {
    return {
      canvas: '#fbf8f2',
      canvasAlt: '#f2ece2',
      surface: '#fffdfa',
      surfaceAlt: '#f7f1e7',
      accent: '#9d7228',
      accentStrong: '#7f5a18',
      accentSoft: '#ead29a',
      ink: '#2a2118',
      muted: '#5f5141',
      border: 'rgba(114, 90, 53, 0.14)',
      footer: '#161311',
      heroOverlay: 'rgba(22, 19, 17, 0.56)',
    };
  }
  if (styleKey.includes('casual')) {
    return {
      canvas: '#fff9f1',
      canvasAlt: '#fff0dd',
      surface: '#fffdf8',
      surfaceAlt: '#f8ead6',
      accent: '#c55b1d',
      accentStrong: '#a44712',
      accentSoft: '#ffc48e',
      ink: '#3a2415',
      muted: '#775843',
      border: 'rgba(138, 87, 53, 0.16)',
      footer: '#1b1410',
      heroOverlay: 'rgba(27, 20, 16, 0.44)',
    };
  }
  if (variant === 'bold-upscale') {
    return {
      canvas: '#fcf8f5',
      canvasAlt: '#f7eee8',
      surface: '#fffdfb',
      surfaceAlt: '#f8ede7',
      accent: '#b44432',
      accentStrong: '#8f2d1f',
      accentSoft: '#f2c2b5',
      ink: '#241a17',
      muted: '#6c564f',
      border: 'rgba(132, 75, 64, 0.14)',
      footer: '#151111',
      heroOverlay: 'rgba(21, 17, 17, 0.52)',
    };
  }
  return {
    canvas: '#faf8f5',
    canvasAlt: '#f1f2f4',
    surface: '#ffffff',
    surfaceAlt: '#f6f7f8',
    accent: '#a4562a',
    accentStrong: '#843f18',
    accentSoft: '#f0c9ae',
    ink: '#1f2937',
    muted: '#617184',
    border: 'rgba(59, 70, 85, 0.12)',
    footer: '#131820',
    heroOverlay: 'rgba(19, 24, 32, 0.46)',
  };
};

const ensureTailwindCdn = (html: string): string => {
  let next = html.replace(
    /<link[^>]+href=["']https:\/\/cdn\.tailwindcss\.com["'][^>]*>/gi,
    ''
  );

  if (/<script[^>]+src=["']https:\/\/cdn\.tailwindcss\.com["'][^>]*><\/script>/i.test(next)) {
    return next;
  }

  const cdnTag = '<script src="https://cdn.tailwindcss.com"></script>';
  if (/<head[^>]*>/i.test(next)) {
    return next.replace(/<head[^>]*>/i, (match) => `${match}\n  ${cdnTag}`);
  }
  return next.replace(/<html[^>]*>/i, (match) => `${match}\n<head>\n  ${cdnTag}\n</head>`);
};

const stripManagedAssets = (html: string): string =>
  html
    .replace(/<style[^>]*data-synthr-safety[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*data-synthr-scroll[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]+src=["']https?:\/\/cdn\.tailwindcss\.com["'][^>]*><\/script>\s*/gi, '')
    .replace(/<link[^>]+href=["']https?:\/\/cdn\.jsdelivr\.net\/npm\/tailwindcss[^"']*["'][^>]*>\s*/gi, '')
    .replace(/<link[^>]+href=["']https?:\/\/fonts\.googleapis\.com\/css2\?[^"']*["'][^>]*>\s*/gi, '')
    .replace(/<link[^>]+href=["']https?:\/\/fonts\.googleapis\.com["'][^>]*>\s*/gi, '')
    .replace(/<link[^>]+href=["']https?:\/\/fonts\.gstatic\.com["'][^>]*>\s*/gi, '')
    .replace(/<link[^>]+rel=["']preconnect["'][^>]+fonts\.googleapis\.com[^>]*>\s*/gi, '')
    .replace(/<link[^>]+rel=["']preconnect["'][^>]+fonts\.gstatic\.com[^>]*>\s*/gi, '');

const ensureSeoMeta = (html: string, payload: GenerationPayload): string => {
  const name = payload.name || 'Restaurant';
  const cuisine = payload.cuisineType || 'Restaurant';
  const summary = payload.brand?.summary || payload.shortDescription || payload.description || `${name} serves ${cuisine} cuisine.`;
  const description = summary.replace(/\s+/g, ' ').trim().slice(0, 155);
  const titleTag = `<title>${name} | ${cuisine}</title>`;
  const metaTag = `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`;

  let next = html;
  if (!/<title>/i.test(next)) {
    next = next.replace(/<head[^>]*>/i, (match) => `${match}\n  ${titleTag}`);
  }
  if (!/name=["']description["']/i.test(next)) {
    next = next.replace(/<head[^>]*>/i, (match) => `${match}\n  ${metaTag}`);
  }
  return next;
};

const ensureHtmlDocument = (html: string): string => {
  const trimmed = html.trim();
  if (!trimmed) {
    return '<!DOCTYPE html><html lang="en"><head></head><body></body></html>';
  }

  if (/<html[\s>]/i.test(trimmed) && /<body[\s>]/i.test(trimmed)) {
    return trimmed;
  }

  if (/<body[\s>]/i.test(trimmed)) {
    return `<!DOCTYPE html><html lang="en"><head></head>${trimmed.replace(/<!DOCTYPE[^>]*>/i, '')}</html>`;
  }

  return `<!DOCTYPE html><html lang="en"><head></head><body>${trimmed.replace(/<!DOCTYPE[^>]*>/i, '')}</body></html>`;
};

const ensureDesignSafetyStyles = (html: string, style?: string, cuisineType?: string, tone?: string): string => {
  if (/<style[^>]*data-synthr-safety/i.test(html)) return html;

  const design = getDesignSystem({ style, cuisineType, tone });

  const fontTags = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${design.typography.fontLink}" rel="stylesheet">`;

  const viewportTag = /<meta[^>]+name=["']viewport["']/i.test(html)
    ? ''
    : '\n  <meta name="viewport" content="width=device-width, initial-scale=1" />';

  const safetyStyle = `
  <style data-synthr-safety>
    :root {
      color-scheme: light;
      --synthr-canvas: ${design.palette.canvas};
      --synthr-canvas-alt: ${design.palette.canvasAlt};
      --synthr-surface: ${design.palette.surface};
      --synthr-surface-alt: ${design.palette.surfaceAlt};
      --synthr-accent: ${design.palette.accent};
      --synthr-accent-strong: ${design.palette.accentStrong};
      --synthr-accent-soft: ${design.palette.accentSoft};
      --synthr-ink: ${design.palette.ink};
      --synthr-muted: ${design.palette.muted};
      --synthr-border: ${design.palette.border};
      --synthr-footer: ${design.palette.footer};
      --synthr-radius-panel: ${design.radius.panel};
      --synthr-radius-media: ${design.radius.media};
      --synthr-radius-button: ${design.radius.button};
      --synthr-shadow-soft: ${design.shadows.soft};
      --synthr-shadow-card: ${design.shadows.card};
      --synthr-shadow-hero: ${design.shadows.hero};
      --synthr-hero-size: ${design.typography.heroSize};
      --synthr-heading-size: ${design.typography.headingSize};
    }
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: ${design.typography.bodyFamily};
      color: var(--synthr-ink);
      background:
        radial-gradient(circle at top left, color-mix(in srgb, var(--synthr-accent-soft) 28%, transparent), transparent 28%),
        linear-gradient(180deg, var(--synthr-canvas), var(--synthr-canvas-alt));
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      line-height: 1.6;
    }
    h1, h2, h3, h4, h5, h6 { font-family: ${design.typography.headingFamily}; letter-spacing: -0.03em; line-height: 0.98; }
    h1 { font-size: var(--synthr-hero-size); }
    h2 { font-size: var(--synthr-heading-size); }
    p, li, span, label, small { color: inherit; }
    img, video { max-width: 100%; height: auto; }
    img { display: block; }
    input, select, textarea, button { font: inherit; }
    input, select, textarea { width: 100%; min-height: 3.25rem; }
    a, button { max-width: 100%; text-underline-offset: 0.16em; }
    :focus-visible { outline: 2px solid var(--synthr-accent); outline-offset: 3px; }
    main, section, header, footer, nav { width: 100%; }
    section, header, footer { position: relative; }
    nav { flex-wrap: wrap; row-gap: 0.5rem; }
    a:not([class*="bg-"]) { color: var(--synthr-accent); text-decoration-color: color-mix(in srgb, var(--synthr-accent) 35%, transparent); }
    [data-synthr-nav] {
      position: sticky;
      top: 1rem;
      z-index: 40;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      background: rgba(20, 16, 15, 0.6);
      border: 1px solid rgba(255,255,255,0.14);
      box-shadow: 0 16px 40px -30px rgba(15, 23, 42, 0.32);
      color: rgba(255,255,255,0.94);
      transition: background 180ms ease, box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease;
    }
    [data-synthr-nav].is-scrolled {
      background: rgba(20, 16, 15, 0.82);
      border-color: rgba(255,255,255,0.16);
      box-shadow: 0 24px 48px -30px rgba(15, 23, 42, 0.42);
    }
    [data-synthr-nav] a:not(.synthr-button-primary):not(.synthr-button-secondary) {
      color: rgba(255,255,255,0.92);
      text-decoration-color: transparent;
    }
    [data-synthr-nav] a:not(.synthr-button-primary):not(.synthr-button-secondary):hover {
      opacity: 0.72;
    }
    [data-synthr-nav] .synthr-button-primary {
      background: rgba(255,255,255,0.96);
      color: var(--synthr-footer);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 18px 30px -24px rgba(15, 23, 42, 0.42);
    }
    [data-synthr-nav] .synthr-button-primary:hover {
      background: white;
      color: var(--synthr-footer);
    }
    button, [role="button"], a[class*="bg-"], a[class*="inline-flex"] { transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease; }
    button:hover, [role="button"]:hover, a[class*="bg-"]:hover, a[class*="inline-flex"]:hover { transform: translateY(-1px); }
    .synthr-surface { background: var(--synthr-surface); border: 1px solid var(--synthr-border); box-shadow: var(--synthr-shadow-soft); border-radius: var(--synthr-radius-panel); }
    .synthr-surface-alt { background: var(--synthr-surface-alt); border: 1px solid var(--synthr-border); border-radius: var(--synthr-radius-panel); }
    .synthr-divider { border-color: var(--synthr-border); }
    .synthr-eyebrow { letter-spacing: 0.32em; text-transform: uppercase; color: var(--synthr-muted); font-size: 0.76rem; font-weight: 700; }
    .synthr-button-primary, .synthr-button-secondary { min-height: 3rem; padding-inline: 1.5rem; font-weight: 600; }
    .synthr-button-primary { background: var(--synthr-accent-strong); color: white; border-radius: var(--synthr-radius-button); box-shadow: var(--synthr-shadow-soft); }
    .synthr-button-primary:hover { box-shadow: var(--synthr-shadow-card); }
    .synthr-button-secondary { background: var(--synthr-surface); color: var(--synthr-ink) !important; border: 1px solid var(--synthr-border); border-radius: var(--synthr-radius-button); box-shadow: 0 12px 26px -24px rgba(15, 23, 42, 0.18); }
    .synthr-button-secondary:hover { background: color-mix(in srgb, var(--synthr-accent-soft) 18%, white); color: var(--synthr-ink) !important; }
    .synthr-media { border-radius: var(--synthr-radius-media); overflow: hidden; box-shadow: var(--synthr-shadow-card); }
    .synthr-dark-surface, footer { color: rgba(255,255,255,0.92); }
    .synthr-dark-surface a, footer a { color: white; }
    .synthr-dark-surface .synthr-button-secondary, footer .synthr-button-secondary {
      background: rgba(255,255,255,0.1);
      color: white;
      border-color: rgba(255,255,255,0.16);
    }
    .synthr-dark-surface .synthr-eyebrow, footer .synthr-eyebrow { color: rgba(255,255,255,0.64); }
    @media (max-width: 768px) {
      h1 { line-height: 1.02; }
      body { background-size: 180% auto; }
      .synthr-button-primary, .synthr-button-secondary { width: 100%; justify-content: center; }
      [data-synthr-nav] { top: 0.75rem; }
    }
  </style>`;

  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (match) => `${match}\n  ${fontTags}${viewportTag}\n  ${safetyStyle}`);
  }
  return html.replace(/<html[^>]*>/i, (match) => `${match}\n<head>\n  ${fontTags}${viewportTag}\n  ${safetyStyle}\n</head>`);
};

const ensureSmoothScrollScript = (html: string): string => {
  if (/data-synthr-scroll/i.test(html)) return html;
  const script = `
  <script data-synthr-scroll>
    (function () {
      const nav = document.querySelector('[data-synthr-nav]');
      const aliasMap = [
        { pattern: /(home|top|start)/i, target: '#home' },
        { pattern: /(about|story)/i, target: '#about' },
        { pattern: /(menu|food|dishes)/i, target: '#menu' },
        { pattern: /(featured)/i, target: '#featured' },
        { pattern: /(experience|gallery|atmosphere)/i, target: '#experience' },
        { pattern: /(hours|schedule)/i, target: '#hours' },
        { pattern: /(order|ordering|pickup|delivery)/i, target: '#order' },
        { pattern: /(reserve|reservation|book|booking)/i, target: '#reserve' },
        { pattern: /(contact|location|visit|find)/i, target: '#contact' },
      ];

      const normalizeTarget = (href, text) => {
        const raw = String(href || '').trim();
        const label = String(text || '').trim();
        if (!raw && !label) return '#home';
        if (/^(mailto:|tel:|javascript:)/i.test(raw)) return null;
        const combined = raw.replace(/^https?:\\/\\/[^/]+/i, '').replace(/^\\//, '').replace(/\\.html?$/i, '') + ' ' + label;
        const alias = aliasMap.find((entry) => entry.pattern.test(combined));
        if (alias) return alias.target;
        if (raw.startsWith('#')) return raw;
        if (/^(https?:)/i.test(raw)) return null;
        return '#home';
      };

      const syncNavState = () => {
        if (!nav) return;
        nav.classList.toggle('is-scrolled', window.scrollY > 18);
      };

      const syncLink = (link) => {
        const href = link.getAttribute('href') || '';
        const target = normalizeTarget(href, link.textContent || '');
        if (target && target.startsWith('#')) {
          link.setAttribute('href', target);
        }
      };

      document.querySelectorAll('a[href]').forEach(syncLink);
      syncNavState();
      window.addEventListener('scroll', syncNavState, { passive: true });

      document.addEventListener('click', (event) => {
        const link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
        if (!link) return;

        const href = link.getAttribute('href') || '';
        const targetSelector = normalizeTarget(href, link.textContent || '');
        if (!targetSelector) return;

        if (targetSelector.startsWith('#')) {
          event.preventDefault();
          const target = document.querySelector(targetSelector) || document.querySelector('#home');
          if (target && target.scrollIntoView) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }, true);
    })();
  </script>`;

  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${script}\n</body>`);
  }
  return `${html}\n${script}`;
};

const normalizeOnPageLinks = (html: string): string => {
  const aliasMap: Array<{ pattern: RegExp; target: string }> = [
    { pattern: /(home|top|start)/i, target: '#home' },
    { pattern: /(about|story)/i, target: '#about' },
    { pattern: /(menu|food|dishes)/i, target: '#menu' },
    { pattern: /(featured)/i, target: '#featured' },
    { pattern: /(experience|gallery|atmosphere)/i, target: '#experience' },
    { pattern: /(hours|schedule)/i, target: '#hours' },
    { pattern: /(order|ordering|pickup|delivery)/i, target: '#order' },
    { pattern: /(reserve|reservation|book|booking)/i, target: '#reserve' },
    { pattern: /(contact|location|visit|find)/i, target: '#contact' },
  ];

  const normalizeHash = (value: string) => {
    const clean = value
      .trim()
      .replace(/^https?:\/\/[^/]+/i, '')
      .replace(/^\/+/, '')
      .replace(/\.html?$/i, '')
      .replace(/^#/, '');
    if (!clean) return '#home';
    const alias = aliasMap.find((entry) => entry.pattern.test(clean));
    return alias?.target || `#${clean}`;
  };

  return html.replace(/<a\b([^>]*?)href=(["'])([^"']+)\2([^>]*)>([\s\S]*?)<\/a>/gi, (match, before, quote, href, after, inner) => {
    const rawHref = String(href || '').trim();
    if (!rawHref) return match;
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(rawHref)) return match;

    const textContent = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const candidate = rawHref.startsWith('#') ? rawHref : `${rawHref} ${textContent}`;
    const target = normalizeHash(candidate);
    return `<a${before}href=${quote}${target}${quote}${after}>${inner}</a>`;
  });
};

const ensureRequiredAnchorTargets = (html: string): string => {
  const requiredIds = ['home', 'about', 'menu', 'featured', 'experience', 'hours', 'order', 'reserve', 'contact'];
  const missingIds = requiredIds.filter((id) => !new RegExp(`id=["']${id}["']`, 'i').test(html));

  let nextHtml = html;
  if (!/id=["']home["']/i.test(nextHtml)) {
    if (/<body[^>]*>/i.test(nextHtml)) {
      nextHtml = nextHtml.replace(
        /<body([^>]*)>/i,
        `<body$1>\n<div id="home" aria-hidden="true" style="position:relative;top:-1px;height:0;overflow:hidden"></div>`
      );
    }
  }

  const fallbackAnchors = missingIds
    .filter((id) => id !== 'home')
    .map(
      (id) =>
        `<div id="${id}" aria-hidden="true" style="position:relative;top:-88px;height:0;overflow:hidden"></div>`
    )
    .join('');

  if (fallbackAnchors) {
    if (/<\/body>/i.test(nextHtml)) {
      nextHtml = nextHtml.replace(/<\/body>/i, `${fallbackAnchors}\n</body>`);
    } else {
      nextHtml += fallbackAnchors;
    }
  }

  return nextHtml;
};

const applyHeroBackground = (html: string, imageUrl?: string, instruction?: string): string => {
  if (!imageUrl) return html;
  const instructionText = (instruction || '').toLowerCase();
  const wantsBackground =
    instructionText.length === 0 || /background|hero|landing|banner|header|cover/.test(instructionText);
  if (!wantsBackground) return html;

  const applyToTag = (tag: string, attrs: string) => {
    let updatedAttrs = attrs;
    if (/class=/.test(updatedAttrs)) {
      updatedAttrs = updatedAttrs.replace(/class=["']([^"']*)["']/i, (_match, cls) => `class="${cls} bg-cover bg-center"`);
    } else {
      updatedAttrs = `${updatedAttrs} class="bg-cover bg-center"`;
    }

    if (/style=/.test(updatedAttrs)) {
      updatedAttrs = updatedAttrs.replace(
        /style=["']([^"']*)["']/i,
        (_match, style) =>
          `style="${style}; background-image: url('${imageUrl}'); background-size: cover; background-position: center; background-color: rgba(0,0,0,0.52); background-blend-mode: multiply;"`
      );
    } else {
      updatedAttrs = `${updatedAttrs} style="background-image: url('${imageUrl}'); background-size: cover; background-position: center; background-color: rgba(0,0,0,0.52); background-blend-mode: multiply;"`;
    }

    return `<${tag}${updatedAttrs}>`;
  };

  const homeMatch = html.match(/<(section|header|div)([^>]*\sid=["']home["'][^>]*)>/i);
  if (homeMatch) return html.replace(homeMatch[0], applyToTag(homeMatch[1], homeMatch[2]));

  const headerMatch = html.match(/<(header)([^>]*)>/i);
  if (headerMatch) return html.replace(headerMatch[0], applyToTag(headerMatch[1], headerMatch[2]));

  return html;
};

const injectFallbackGallery = (html: string, assets: ImageAsset[]): string => {
  if (assets.length === 0) return html;
  if (/<img\s/i.test(html) || /background-image\s*:/i.test(html)) return html;

  const gallery = `
  <section id="experience" class="py-16 bg-white">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-slate-900 mb-8">Gallery</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${assets
          .slice(0, 6)
          .map(
            (img) => `
          <div class="overflow-hidden rounded-2xl shadow">
            <img src="${img.url}" alt="${img.alt}" class="w-full h-64 object-cover" loading="lazy" />
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </section>`;

  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${gallery}\n</body>`);
  }
  return `${html}\n${gallery}`;
};

const buildHeroSupport = (payload: GenerationPayload, name: string, cuisineType: string): string => {
  const candidates = dedupeStrings([
    payload.tagline && normalizeCopy(payload.tagline).toLowerCase() !== name.toLowerCase() ? payload.tagline : '',
    payload.brand?.summary,
    payload.shortDescription,
    payload.description,
    payload.brand?.atmosphere && cuisineType
      ? `${payload.brand.atmosphere}. ${cuisineType} cooking with a more deliberate pace.`
      : '',
  ]);

  return formatSentence(truncateCopy(candidates[0] || `${name} is a restaurant with clear atmosphere, strong food, and an easy next step for guests.`, 170));
};

const buildStoryCopy = (payload: GenerationPayload, summary: string): string => {
  const candidates = dedupeStrings([
    payload.fullStory,
    payload.brand?.story,
    payload.brand?.atmosphere && payload.brand?.audience
      ? `${payload.brand.atmosphere}. A room made for ${payload.brand.audience}.`
      : '',
    summary,
  ]);

  return formatSentence(truncateCopy(candidates[0] || summary, 340));
};

const buildSectionSequence = (payload: GenerationPayload, options: { showExperience: boolean; showOrder: boolean; showReserve: boolean }) => {
  const sequence = ['about', 'menu'];

  if (options.showExperience) sequence.push('experience');
  if (payload.primaryCta === 'online-orders' && options.showOrder) sequence.push('order');
  if (options.showReserve) sequence.push('reserve');
  if (payload.primaryCta !== 'online-orders' && options.showOrder) sequence.push('order');
  sequence.push('hours');

  return sequence;
};

const buildSections = (payload: GenerationPayload) => {
  const contentPlan = normalizeGenerationContentPlan(payload.contentPlan);
  const name = normalizeCopy(payload.name) || 'Restaurant';
  const cuisineType = normalizeCopy(payload.cuisineType) || 'Restaurant';
  const priceRange = normalizeCopy(payload.priceRange) || '$$';
  const city = normalizeCopy(payload.city);
  const address = normalizeCopy(payload.address);
  const phone = normalizeCopy(payload.phone);
  const email = normalizeCopy(payload.email);
  const neighborhood = normalizeCopy(payload.advanced?.neighborhood || payload.neighborhood);
  const parking = normalizeCopy(payload.advanced?.parking || payload.parking);
  const awards = dedupeStrings(payload.advanced?.awards || []);
  const dietaryAccommodations = dedupeStrings(payload.advanced?.dietaryAccommodations || []);
  const summary = formatSentence(
    truncateCopy(
      normalizeCopy(payload.brand?.summary || payload.shortDescription || payload.description) ||
        `A ${cuisineType.toLowerCase()} restaurant serving guests in ${city || 'the neighborhood'}.`,
      180
    )
  );
  const story = preferPlannedCopy(contentPlan.storyBody, buildStoryCopy(payload, summary));
  const heroSupport = preferPlannedCopy(contentPlan.heroSupport, buildHeroSupport(payload, name, cuisineType));
  const imageAssets = buildImageAssets(payload.images, payload.useStockImages !== false, payload.cuisineType, payload.name, payload.style);
  const curatedMenu = buildCuratedMenuItems(payload);
  const menuByCategory = curatedMenu.reduce<Record<string, CuratedMenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
  const featuredMenu = curatedMenu.filter((item) => item.featured).slice(0, 3);
  const heroImage = imageAssets.find((img) => img.role === 'hero') || imageAssets[0];
  const interiorImage = imageAssets.find((img) => img.role === 'interior') || imageAssets[1] || heroImage;
  const foodImages = imageAssets.filter((img) => ['food', 'dish', 'dessert'].includes(img.role));
  const galleryImages = imageAssets.filter((img) => img.role !== 'logo');
  const logo = imageAssets.find((img) => img.role === 'logo');
  const hoursEntries = Object.entries(payload.hours || {})
    .filter(([, value]) => normalizeCopy(value))
    .map(([day, value]) => ({ day: escapeHtml(day), value: escapeHtml(normalizeCopy(value) || 'Closed') }));

  const showOrder = Boolean(payload.onlineOrdering?.acceptOrders || payload.ordering?.enabled || payload.takeout || payload.delivery);
  const showReserve = Boolean(payload.reservations?.acceptReservations || payload.primaryCta === 'reservations');
  const showExperience = galleryImages.length >= 3 || story.length > 160 || Boolean(payload.hostEvents && payload.weeklySpecials);

  const orderProvider =
    formatProviderLabel(payload.onlineOrdering?.platforms?.[0]) || formatProviderLabel(payload.ordering?.provider) || '';
  const reserveProvider = formatProviderLabel(payload.reservations?.platforms?.[0]);
  const weeklySpecials = formatSentence(truncateCopy(normalizeCopy(payload.weeklySpecials || payload.advanced?.weeklySpecials), 220));

  const socialLinks = [
    payload.socialLinks?.instagram ? { label: 'Instagram', href: formatSocialHref('instagram', payload.socialLinks.instagram) } : null,
    payload.socialLinks?.tiktok ? { label: 'TikTok', href: formatSocialHref('tiktok', payload.socialLinks.tiktok) } : null,
    payload.socialLinks?.googleReviews ? { label: 'Google Reviews', href: normalizeCopy(payload.socialLinks.googleReviews) } : null,
    payload.socialLinks?.yelp ? { label: 'Yelp', href: normalizeCopy(payload.socialLinks.yelp) } : null,
    payload.socialLinks?.facebook ? { label: 'Facebook', href: normalizeCopy(payload.socialLinks.facebook) } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  const storyFacts = dedupeStrings([
    ...(contentPlan.storyFacts || []),
    neighborhood ? `In ${neighborhood}` : city ? `Serving ${city}` : '',
    payload.founderName || payload.yearFounded
      ? `Founded${payload.founderName ? ` by ${payload.founderName}` : ''}${payload.yearFounded ? ` in ${payload.yearFounded}` : ''}`
      : '',
    awards[0] ? `Recognized by ${awards[0]}` : '',
    dietaryAccommodations.length ? `${dietaryAccommodations.slice(0, 2).join(' and ')} available` : '',
  ]).slice(0, 4);

  const heroHighlights = dedupeStrings([
    ...(contentPlan.heroHighlights || []),
    payload.brand?.atmosphere,
    featuredMenu[0] ? `Known for ${featuredMenu[0].name}` : '',
    payload.brand?.audience ? `Good for ${payload.brand.audience}` : '',
    showReserve ? `${reserveProvider || 'Reservations'} available` : '',
  ]).slice(0, 4);
  const orderLabel = orderProvider ? `Order on ${orderProvider}` : 'Start an order';
  const orderSecondaryLabel = showReserve ? 'Takeout and pickup available' : 'Pickup and takeout available';
  const reserveLabel = reserveProvider ? `Book on ${reserveProvider}` : phone ? 'Call to reserve' : 'Request a table';
  const reserveUrl = payload.reservations?.url || (phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '');
  const orderUrl = payload.onlineOrdering?.customURL || payload.ordering?.url || '';

  const menuHeading = preferPlannedCopy(
    contentPlan.menuHeading,
    curatedMenu.length
      ? `A menu shaped around ${featuredMenu[0]?.name || 'house favorites'} and dishes guests come back for`
      : 'A concise menu with the right signatures up front'
  );
  const menuIntro = preferPlannedCopy(
    contentPlan.menuIntro,
    curatedMenu.length
      ? `${name} keeps the menu focused on ${dedupeStrings([
          featuredMenu[0]?.name,
          featuredMenu[1]?.name,
          cuisineType ? `${cuisineType.toLowerCase()} staples` : '',
        ])
          .slice(0, 3)
          .join(', ')}, so the page reads like a real restaurant rather than a long list.`
      : 'Add a few real items or paste menu text to turn this into a fuller signature-menu presentation.'
  );
  const storyHeadingFallback = neighborhood ? `${name} is rooted in ${neighborhood}` : 'A room built around pace, warmth, and return visits';
  const rawStoryHeading = preferPlannedCopy(contentPlan.storyHeading, storyHeadingFallback);
  const storyHeading = normalizeCopy(rawStoryHeading).toLowerCase() === name.toLowerCase() ? storyHeadingFallback : rawStoryHeading;
  const experienceHeading = preferPlannedCopy(
    contentPlan.experienceHeading,
    weeklySpecials ? 'The room keeps people staying a little longer' : 'The space should sell the night as much as the food'
  );
  const experienceBody = preferPlannedCopy(
    contentPlan.experienceBody,
    weeklySpecials ||
      formatSentence(
      dedupeStrings([
        payload.brand?.story,
        payload.brand?.atmosphere,
        payload.brand?.audience ? `Designed for ${payload.brand.audience}` : '',
        summary,
      ]).join('. ')
    )
  );
  const reserveHeading = preferPlannedCopy(
    contentPlan.reserveHeading,
    showReserve ? 'Reserve ahead for the smoothest table and the best pace to the evening' : 'Make the next step feel easy before guests commit'
  );
  const reserveBody = preferPlannedCopy(
    contentPlan.reserveBody,
    showReserve
      ? `Booking is straightforward here, with one clear path to a confirmed table and the essentials close by.`
      : `If reservations are handled manually today, keep the call or email path clear, direct, and easy to trust.`
  );
  const orderHeading = preferPlannedCopy(
    contentPlan.orderHeading,
    showReserve ? 'Takeout and pickup should feel like part of the brand, not an afterthought' : 'Ordering should start with the same confidence as walking in'
  );
  const orderBody = preferPlannedCopy(
    contentPlan.orderBody,
    showOrder
      ? `${orderLabel} keeps ordering direct while the rest of the page still does the work of selling the menu.`
      : 'When online ordering is not connected yet, use this space to point people to the next best action without clutter.'
  );
  const visitHeadingFallback = 'Hours, location, and the details people check before they commit';
  const rawVisitHeading = preferPlannedCopy(contentPlan.visitHeading, visitHeadingFallback);
  const visitHeading = normalizeCopy(rawVisitHeading).toLowerCase() === name.toLowerCase() ? visitHeadingFallback : rawVisitHeading;
  const visitBody = preferPlannedCopy(
    contentPlan.visitBody,
    dedupeStrings([
      address ? `${address}${city ? `, ${city}` : ''}` : '',
      neighborhood ? `In ${neighborhood}` : '',
      parking ? `Parking: ${parking}` : '',
    ]).join('. ') ||
      'Keep the practical information clean, readable, and close to the final CTA.',
    true
  );
  const footerTagline = preferPlannedCopy(contentPlan.footerTagline, summary, true);

  return {
    contentPlan,
    name,
    cuisineType,
    priceRange,
    city,
    address,
    phone,
    email,
    summary,
    story,
    neighborhood,
    parking,
    awards,
    dietaryAccommodations,
    heroSupport,
    heroEyebrow: dedupeStrings([cuisineType, priceRange, city]).join(' · '),
    heroHighlights,
    menuByCategory: Object.entries(menuByCategory),
    featuredMenu,
    curatedMenu,
    hoursEntries,
    socialLinks,
    imageAssets,
    heroImage,
    interiorImage,
    foodImages,
    galleryImages,
    logo,
    showOrder,
    showReserve,
    showExperience,
    orderLabel,
    orderSecondaryLabel,
    orderUrl,
    reserveLabel,
    reserveUrl,
    googleMapsLink: normalizeCopy(payload.googleMapsLink),
    weeklySpecials,
    storyFacts,
    sectionOrder: buildSectionSequence(payload, { showExperience, showOrder, showReserve }),
    eventsEmail: normalizeCopy(payload.cateringEmail || payload.advanced?.cateringEmail || email),
    privateEventCapacity: payload.privateEventCapacity || payload.advanced?.privateEventCapacity,
    storyHeading,
    menuHeading,
    menuIntro,
    experienceHeading,
    experienceBody,
    reserveHeading,
    reserveBody,
    orderHeading,
    orderBody,
    visitHeading,
    visitBody,
    footerTagline,
  };
};

const buildFallbackHtml = (payload: GenerationPayload): string => {
  const design = getDesignSystem(payload);
  const sections = buildSections(payload);
  const {
    name,
    cuisineType,
    priceRange,
    city,
    address,
    phone,
    email,
    summary,
    story,
    neighborhood,
    parking,
    awards,
    dietaryAccommodations,
    heroSupport,
    heroEyebrow,
    heroHighlights,
    menuByCategory,
    featuredMenu,
    curatedMenu,
    hoursEntries,
    socialLinks,
    heroImage,
    interiorImage,
    foodImages,
    galleryImages,
    logo,
    showOrder,
    showReserve,
    showExperience,
    orderLabel,
    orderSecondaryLabel,
    orderUrl,
    reserveLabel,
    reserveUrl,
    googleMapsLink,
    weeklySpecials,
    storyFacts,
    sectionOrder,
    eventsEmail,
    privateEventCapacity,
    storyHeading,
    menuHeading,
    menuIntro,
    experienceHeading,
    experienceBody,
    reserveHeading,
    reserveBody,
    orderHeading,
    orderBody,
    visitHeading,
    visitBody,
    footerTagline,
  } = sections;

  const navLinks = [
    ['#about', 'Story'],
    ['#menu', 'Menu'],
    showExperience ? ['#experience', 'Atmosphere'] : null,
    showReserve ? ['#reserve', 'Reservations'] : null,
    ['#hours', 'Visit'],
  ].filter(Boolean) as Array<[string, string]>;

  const primaryHref = showReserve ? '#reserve' : showOrder ? '#order' : '#hours';
  const primaryLabel = showReserve ? 'Reserve a table' : showOrder ? 'Order online' : 'Plan your visit';
  const secondaryHref = showReserve && showOrder ? '#order' : '#menu';
  const secondaryLabel = showReserve && showOrder ? 'See takeout options' : 'See the menu';

  const renderNav = () => `
    <nav data-synthr-nav class="sticky top-4 z-30 rounded-[999px] px-4 py-3 md:px-5" style="${design.nav.shell}">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <a href="#home" class="inline-flex items-center gap-3 font-semibold tracking-tight" style="${design.nav.link}">
          ${logo ? `<img src="${escapeHtml(logo.url)}" alt="${escapeHtml(logo.alt)}" class="h-10 w-10 rounded-full object-cover" />` : ''}
          <span>${escapeHtml(name)}</span>
        </a>
        <div class="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm" style="${design.nav.link}">
          ${navLinks.map(([href, label]) => `<a href="${href}" class="transition hover:opacity-65">${label}</a>`).join('')}
          <a href="${primaryHref}" class="inline-flex items-center justify-center px-4 py-2 synthr-button-primary">${primaryLabel}</a>
        </div>
      </div>
    </nav>`;

  const renderHero = () => `
    <header id="home" class="pt-6 pb-14 md:pt-8 md:pb-20">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        ${renderNav()}
        <div class="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="relative min-h-[34rem] overflow-hidden synthr-media" style="border-radius:${design.radius.media};box-shadow:${design.shadows.hero}">
            ${heroImage ? `<img src="${escapeHtml(heroImage.url)}" alt="${escapeHtml(heroImage.alt)}" class="absolute inset-0 h-full w-full object-cover" />` : ''}
            <div class="absolute inset-0" style="background:linear-gradient(180deg, rgba(15,23,42,0.08), ${design.palette.heroOverlay})"></div>
            <div class="relative z-10 flex h-full flex-col justify-end p-7 md:p-10 lg:p-14 text-white">
              <p class="synthr-eyebrow" style="color:rgba(255,255,255,0.76)">${escapeHtml(heroEyebrow)}</p>
              <h1 class="mt-4 max-w-[10ch] text-white">${escapeHtml(name)}</h1>
              <p class="mt-4 max-w-2xl text-base leading-7 text-white/82 md:text-lg md:leading-8">${escapeHtml(heroSupport)}</p>
              <div class="mt-8 flex flex-wrap gap-3">
                <a href="${primaryHref}" class="inline-flex items-center justify-center px-6 py-3 synthr-button-primary">${primaryLabel}</a>
                <a href="${secondaryHref}" class="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur">${secondaryLabel}</a>
              </div>
              <div class="mt-8 flex flex-wrap gap-3">
                ${heroHighlights
                  .map(
                    (highlight) =>
                      `<span class="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white/82 backdrop-blur">${escapeHtml(highlight)}</span>`
                  )
                  .join('')}
              </div>
            </div>
          </div>
          <div class="grid gap-4 self-end">
            <div class="synthr-surface p-6 md:p-7">
              <p class="synthr-eyebrow">Why it feels distinct</p>
              <h2 class="mt-4 text-[2rem] leading-none">${escapeHtml(
                featuredMenu[0]?.name ? `Start with ${featuredMenu[0].name}` : `Built around ${cuisineType.toLowerCase()} hospitality`
              )}</h2>
              <p class="mt-4 leading-7" style="color:${design.palette.muted}">${escapeHtml(summary)}</p>
              <div class="mt-6 grid gap-3">
                ${storyFacts
                  .map(
                    (fact) =>
                      `<div class="rounded-[20px] px-4 py-3 text-sm" style="background:${design.palette.surfaceAlt};color:${design.palette.muted}">${escapeHtml(fact)}</div>`
                  )
                  .join('')}
              </div>
            </div>
            <div class="synthr-surface-alt p-6 md:p-7">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="synthr-eyebrow">${showReserve ? 'Reservations' : 'Visit details'}</p>
                  <p class="mt-3 text-lg font-semibold">${showReserve ? escapeHtml(reserveLabel) : escapeHtml(city || address || 'Get the details before you go.')}</p>
                </div>
                <span class="rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]" style="background:${design.palette.accentSoft};color:${design.palette.ink}">
                  ${escapeHtml(priceRange)}
                </span>
              </div>
              <div class="mt-5 flex flex-wrap gap-3">
                ${showReserve ? `<a href="#reserve" class="inline-flex items-center justify-center px-5 py-3 synthr-button-secondary">Book now</a>` : ''}
                ${showOrder ? `<a href="#order" class="inline-flex items-center justify-center px-5 py-3 synthr-button-secondary">Order takeout</a>` : ''}
                ${!showReserve && !showOrder ? `<a href="#hours" class="inline-flex items-center justify-center px-5 py-3 synthr-button-secondary">See hours</a>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>`;

  const renderAbout = () => `
    <section id="about" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p class="synthr-eyebrow">Story</p>
            <h2 class="mt-4">${escapeHtml(storyHeading)}</h2>
            <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">${escapeHtml(story)}</p>
            <div class="mt-8 grid gap-3 sm:grid-cols-2">
              ${storyFacts
                .map(
                  (fact) =>
                    `<div class="rounded-[22px] px-4 py-4" style="background:${design.palette.surfaceAlt};border:${design.borders.hairline}">
                      <span class="text-sm" style="color:${design.palette.muted}">${escapeHtml(fact)}</span>
                    </div>`
                )
                .join('')}
              ${awards.slice(1, 3)
                .map(
                  (award) =>
                    `<div class="rounded-[22px] px-4 py-4" style="background:${design.palette.surfaceAlt};border:${design.borders.hairline}">
                      <span class="text-sm" style="color:${design.palette.muted}">${escapeHtml(award)}</span>
                    </div>`
                )
                .join('')}
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
            ${
              interiorImage
                ? `<div class="synthr-media md:row-span-2" style="border-radius:${design.radius.media}">
                    <img src="${escapeHtml(interiorImage.url)}" alt="${escapeHtml(interiorImage.alt)}" class="h-[23rem] w-full object-cover md:h-full" loading="lazy" />
                  </div>`
                : ''
            }
            ${
              foodImages[0]
                ? `<div class="synthr-media" style="border-radius:${design.radius.media}">
                    <img src="${escapeHtml(foodImages[0].url)}" alt="${escapeHtml(foodImages[0].alt)}" class="h-[16rem] w-full object-cover" loading="lazy" />
                  </div>`
                : ''
            }
            <div class="synthr-surface p-6 md:p-7">
              <p class="synthr-eyebrow">At the table</p>
              <p class="mt-4 text-lg leading-8" style="color:${design.palette.muted}">
                ${escapeHtml(
                  dedupeStrings([
                    payload.brand?.atmosphere,
                    payload.brand?.audience ? `A fit for ${payload.brand.audience}` : '',
                    parking ? `Parking: ${parking}` : '',
                    dietaryAccommodations.length ? `${dietaryAccommodations.join(', ')} available` : '',
                  ]).join('. ') || summary
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const renderMenu = () => `
    <section id="menu" class="${design.spacing.section}">
      <div id="featured" class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p class="synthr-eyebrow">Menu</p>
            <h2 class="mt-4">${escapeHtml(menuHeading)}</h2>
            <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">
              ${escapeHtml(menuIntro)}
            </p>
            ${
              featuredMenu.length
                ? `<ol class="mt-8 space-y-4">
                    ${featuredMenu
                      .map(
                        (item, index) => `
                          <li class="grid grid-cols-[auto_1fr] gap-4">
                            <span class="text-sm font-semibold" style="color:${design.palette.accentStrong}">0${index + 1}</span>
                            <div>
                              <p class="font-semibold">${escapeHtml(item.name)}${item.price ? ` <span style="color:${design.palette.muted}">${escapeHtml(item.price)}</span>` : ''}</p>
                              <p class="mt-1 text-sm leading-7" style="color:${design.palette.muted}">${escapeHtml(
                                dedupeStrings([
                                  item.category,
                                  item.dietary.length ? item.dietary.join(' · ') : '',
                                ]).join(' · ') || 'House favorite'
                              )}</p>
                            </div>
                          </li>`
                      )
                      .join('')}
                  </ol>`
                : ''
            }
            <div class="mt-8 flex flex-wrap gap-3">
              ${showReserve ? `<a href="#reserve" class="inline-flex items-center justify-center px-5 py-3 synthr-button-secondary">Reserve before you come</a>` : ''}
              ${showOrder ? `<a href="#order" class="inline-flex items-center justify-center px-5 py-3 synthr-button-secondary">${escapeHtml(orderSecondaryLabel)}</a>` : ''}
            </div>
          </div>
          <div class="space-y-6">
            ${
              foodImages.slice(0, 2).length
                ? `<div class="grid gap-4 sm:grid-cols-2">
                    ${foodImages
                      .slice(0, 2)
                      .map(
                        (img, index) => `
                          <div class="synthr-media" style="border-radius:${design.radius.media}">
                            <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt)}" class="w-full object-cover ${index === 0 ? 'h-[16rem] sm:h-[20rem]' : 'h-[16rem]'}" loading="lazy" />
                          </div>`
                      )
                      .join('')}
                  </div>`
                : ''
            }
            ${
              menuByCategory.length
                ? `<div class="grid gap-5 md:grid-cols-2">
                    ${menuByCategory
                      .map(
                        ([category, items]) => `
                          <article class="synthr-surface p-6 md:p-7">
                            <div class="flex items-center justify-between gap-4">
                              <h3 class="text-[1.65rem]">${escapeHtml(category)}</h3>
                              <span class="text-xs uppercase tracking-[0.24em]" style="color:${design.palette.muted}">${items.length} items</span>
                            </div>
                            <div class="mt-5 space-y-5">
                              ${items
                                .slice(0, 4)
                                .map(
                                  (item) => `
                                    <div class="grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
                                      <div>
                                        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                                          <h4 class="text-lg font-semibold">${escapeHtml(item.name)}</h4>
                                          ${
                                            item.dietary.length
                                              ? `<span class="text-[11px] uppercase tracking-[0.24em]" style="color:${design.palette.muted}">${escapeHtml(
                                                  item.dietary.join(' · ')
                                                )}</span>`
                                              : ''
                                          }
                                        </div>
                                        ${item.description ? `<p class="mt-1 text-sm leading-7" style="color:${design.palette.muted}">${escapeHtml(item.description)}</p>` : ''}
                                      </div>
                                      ${item.price ? `<div class="text-base font-semibold">${escapeHtml(item.price)}</div>` : ''}
                                    </div>`
                                )
                                .join('')}
                            </div>
                          </article>`
                      )
                      .join('')}
                  </div>`
                : `<div class="synthr-surface p-8">
                    <p class="synthr-eyebrow">Menu coming soon</p>
                    <p class="mt-4 text-lg leading-8" style="color:${design.palette.muted}">Paste menu text or add a few real items in the builder to turn this into a full featured menu section.</p>
                  </div>`
            }
          </div>
        </div>
      </div>
    </section>`;

  const renderExperience = () => `
    <section id="experience" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="grid gap-4 sm:grid-cols-2">
            ${galleryImages
              .slice(0, 3)
              .map(
                (img, index) => `
                  <div class="synthr-media ${index === 0 ? 'sm:col-span-2' : ''}" style="border-radius:${design.radius.media}">
                    <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt)}" class="w-full object-cover ${index === 0 ? 'h-[20rem] md:h-[28rem]' : 'h-[16rem]'}" loading="lazy" />
                  </div>`
              )
              .join('')}
          </div>
          <div class="self-center">
            <p class="synthr-eyebrow">Atmosphere</p>
            <h2 class="mt-4">${escapeHtml(experienceHeading)}</h2>
            <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">
              ${escapeHtml(experienceBody)}
            </p>
            ${
              payload.hostEvents || privateEventCapacity
                ? `<div class="mt-8 rounded-[24px] p-6" style="background:${design.palette.surfaceAlt};border:${design.borders.hairline}">
                    <p class="synthr-eyebrow">Events</p>
                    <p class="mt-3 text-base leading-7" style="color:${design.palette.muted}">
                      ${escapeHtml(
                        privateEventCapacity
                          ? `Private events for up to ${privateEventCapacity} guests.`
                          : 'Event and catering inquiries are available on request.'
                      )}
                    </p>
                    ${
                      eventsEmail
                        ? `<a href="mailto:${escapeHtml(eventsEmail)}" class="mt-4 inline-flex items-center justify-center px-5 py-3 synthr-button-secondary">Inquire about events</a>`
                        : ''
                    }
                  </div>`
                : ''
            }
          </div>
        </div>
      </div>
    </section>`;

  const renderReserve = () => `
    <section id="reserve" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div class="overflow-hidden rounded-[${design.radius.media}] p-8 md:p-10 synthr-dark-surface" style="background:${design.palette.footer};box-shadow:${design.shadows.card}">
            <p class="synthr-eyebrow" style="color:rgba(255,255,255,0.6)">Reservations</p>
            <h2 class="mt-4 text-white">${escapeHtml(reserveHeading)}</h2>
            <p class="mt-5 max-w-2xl text-lg leading-8 text-white/76">${escapeHtml(reserveBody)}</p>
            <div class="mt-8 grid gap-3 text-sm text-white/76">
              <div class="rounded-[22px] border border-white/12 bg-white/6 px-4 py-3">${escapeHtml(city ? `${city}${neighborhood ? `, ${neighborhood}` : ''}` : 'Restaurant location')}</div>
              <div class="rounded-[22px] border border-white/12 bg-white/6 px-4 py-3">${escapeHtml(
                hoursEntries[0]?.value ? `Today’s flow starts from posted hours.` : 'Share live hours as soon as they are available.'
              )}</div>
              ${showOrder ? `<div class="rounded-[22px] border border-white/12 bg-white/6 px-4 py-3">${escapeHtml(orderSecondaryLabel)}</div>` : ''}
            </div>
          </div>
          <form class="synthr-surface p-6 md:p-8" aria-label="Reservation details">
            <p class="synthr-eyebrow">Plan your table</p>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <label class="grid gap-2">
                <span class="text-sm font-medium">Date</span>
                <input type="date" class="rounded-[18px] border px-4 py-3" style="border-color:${design.palette.border};background:${design.palette.surfaceAlt}" />
              </label>
              <label class="grid gap-2">
                <span class="text-sm font-medium">Time</span>
                <input type="time" class="rounded-[18px] border px-4 py-3" style="border-color:${design.palette.border};background:${design.palette.surfaceAlt}" />
              </label>
              <label class="grid gap-2">
                <span class="text-sm font-medium">Party size</span>
                <select class="rounded-[18px] border px-4 py-3" style="border-color:${design.palette.border};background:${design.palette.surfaceAlt}">
                  <option>2 guests</option>
                  <option>4 guests</option>
                  <option>6 guests</option>
                  <option>8+ guests</option>
                </select>
              </label>
              <label class="grid gap-2">
                <span class="text-sm font-medium">Name</span>
                <input type="text" placeholder="Guest name" class="rounded-[18px] border px-4 py-3" style="border-color:${design.palette.border};background:${design.palette.surfaceAlt}" />
              </label>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <a href="${safeHref(reserveUrl, '#hours')}" class="inline-flex items-center justify-center px-6 py-3 synthr-button-primary">${escapeHtml(
                showReserve ? reserveLabel : 'Contact the restaurant'
              )}</a>
              ${showOrder ? `<a href="#order" class="inline-flex items-center justify-center px-6 py-3 synthr-button-secondary">Takeout instead</a>` : ''}
            </div>
            <p class="mt-4 text-sm leading-6" style="color:${design.palette.muted}">
              ${escapeHtml(
                showReserve
                  ? `${reserveLabel} is the primary conversion path here, while the rest of the page supports trust and decision-making.`
                  : 'If reservations are handled manually today, keep the call or email path clear and friction-free.'
              )}
            </p>
          </form>
        </div>
      </div>
    </section>`;

  const renderOrder = () => `
    <section id="order" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="synthr-surface p-8 md:p-10">
          <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p class="synthr-eyebrow">Ordering</p>
              <h2 class="mt-4">${escapeHtml(orderHeading)}</h2>
              <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">
                ${escapeHtml(orderBody)}
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              ${showOrder ? `<a href="${safeHref(orderUrl, '#hours')}" class="inline-flex items-center justify-center px-6 py-3 synthr-button-primary">${escapeHtml(orderLabel)}</a>` : ''}
              <a href="#menu" class="inline-flex items-center justify-center px-6 py-3 synthr-button-secondary">Browse menu highlights</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const renderVisit = () => `
    <section id="hours" class="${design.spacing.section}">
      <div id="contact" aria-hidden="true" style="position:relative;top:-88px;height:0;overflow:hidden"></div>
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p class="synthr-eyebrow">Visit</p>
            <h2 class="mt-4">${escapeHtml(visitHeading)}</h2>
            <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">
              ${escapeHtml(visitBody)}
            </p>
            ${
              socialLinks.length
                ? `<div class="mt-6 flex flex-wrap gap-3">
                    ${socialLinks
                      .map(
                        (link) =>
                          `<a href="${safeHref(link.href)}" class="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm" style="border-color:${design.palette.border};color:${design.palette.ink}">${link.label}</a>`
                      )
                      .join('')}
                  </div>`
                : ''
            }
          </div>
          <div class="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
            <div class="synthr-surface p-6 md:p-7">
              <p class="synthr-eyebrow">Contact</p>
              <div class="mt-5 space-y-4">
                <div>
                  <p class="text-sm" style="color:${design.palette.muted}">Address</p>
                  <p class="mt-1 text-lg">${escapeHtml(address || city || 'Address available soon')}</p>
                  ${city && address ? `<p class="text-sm" style="color:${design.palette.muted}">${escapeHtml(city)}</p>` : ''}
                </div>
                ${phone ? `<div><p class="text-sm" style="color:${design.palette.muted}">Phone</p><a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ''))}" class="mt-1 inline-flex text-lg">${escapeHtml(phone)}</a></div>` : ''}
                ${email ? `<div><p class="text-sm" style="color:${design.palette.muted}">Email</p><a href="mailto:${escapeHtml(email)}" class="mt-1 inline-flex text-lg">${escapeHtml(email)}</a></div>` : ''}
                ${googleMapsLink ? `<a href="${safeHref(googleMapsLink)}" class="inline-flex items-center justify-center px-5 py-3 synthr-button-secondary">Open in Google Maps</a>` : ''}
              </div>
            </div>
            <div class="synthr-surface p-6 md:p-7">
              <p class="synthr-eyebrow">Hours</p>
              <div class="mt-5 space-y-3">
                ${
                  hoursEntries.length
                    ? hoursEntries
                        .map(
                          ({ day, value }) => `
                            <div class="flex items-center justify-between gap-4 rounded-[18px] px-4 py-3" style="background:${design.palette.surfaceAlt}">
                              <span>${day}</span>
                              <span style="color:${design.palette.muted}">${value}</span>
                            </div>`
                        )
                        .join('')
                    : `<div class="rounded-[18px] px-4 py-4" style="background:${design.palette.surfaceAlt};color:${design.palette.muted}">Hours available on request.</div>`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const renderFooter = () => `
    <footer class="pt-14 pb-10 synthr-dark-surface" style="background:${design.palette.footer}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-10 lg:grid-cols-[1.15fr_0.6fr_0.75fr]">
          <div>
            <p class="synthr-eyebrow" style="color:rgba(255,255,255,0.54)">Footer</p>
            <h2 class="mt-4 text-white">${escapeHtml(name)}</h2>
            <p class="mt-4 max-w-xl text-white/68">${escapeHtml(footerTagline)}</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-white">Explore</p>
            <div class="mt-4 flex flex-col gap-3 text-white/68">
              ${navLinks.map(([href, label]) => `<a href="${href}" class="transition hover:text-white">${label}</a>`).join('')}
            </div>
          </div>
          <div class="text-white/68">
            <p class="text-sm font-semibold text-white">Visit</p>
            <p class="mt-4">${escapeHtml(address)}${city ? `<br />${escapeHtml(city)}` : ''}</p>
            ${phone ? `<p class="mt-3"><a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ''))}" class="hover:text-white">${escapeHtml(phone)}</a></p>` : ''}
            ${email ? `<p class="mt-2"><a href="mailto:${escapeHtml(email)}" class="hover:text-white">${escapeHtml(email)}</a></p>` : ''}
          </div>
        </div>
        <div class="mt-10 flex flex-col gap-3 border-t pt-6 text-sm text-white/44 md:flex-row md:items-center md:justify-between" style="border-color:rgba(255,255,255,0.12)">
          <p>© ${new Date().getFullYear()} ${escapeHtml(name)}</p>
          <p>${escapeHtml([cuisineType, priceRange, city].filter(Boolean).join(' · '))}</p>
        </div>
      </div>
    </footer>`;

  const sectionMarkup: Record<string, string> = {
    about: renderAbout(),
    menu: renderMenu(),
    experience: showExperience ? renderExperience() : '',
    reserve: showReserve ? renderReserve() : '',
    order: showOrder ? renderOrder() : '',
    hours: renderVisit(),
  };

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(name)} | ${escapeHtml(cuisineType)}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body style="background:${design.palette.canvas}; color:${design.palette.ink}">
    ${renderHero()}
    <main>
      ${sectionOrder.map((key) => sectionMarkup[key] || '').join('\n')}
    </main>
    ${renderFooter()}
  </body>
</html>`;
};

const genericPhrases = [
  /welcome to our restaurant/gi,
  /unforgettable dining experience/gi,
  /crafted with care/gi,
  /something for everyone/gi,
  /taste the difference/gi,
  /perfect place for/gi,
  /memorable experience/gi,
  /world-class/gi,
];

const extractTextContent = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getSectionSlice = (html: string, id: string): string => {
  const match = html.match(new RegExp(`<section[^>]*id=["']${id}["'][^>]*>[\\s\\S]*?<\\/section>`, 'i'));
  if (match?.[0]) return match[0];
  const headerMatch = id === 'home' ? html.match(/<header[^>]*id=["']home["'][^>]*>[\s\S]*?<\/header>/i) : null;
  return headerMatch?.[0] || '';
};

const countRepeatedPhrases = (text: string): number => {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(the|and|for|with|from|that|this|your|our|are|was|were|into|about)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = normalized.split(' ').filter(Boolean);
  const counts = new Map<string, number>();

  for (let index = 0; index < words.length - 3; index += 1) {
    const phrase = words.slice(index, index + 4).join(' ');
    if (phrase.length < 18) continue;
    counts.set(phrase, (counts.get(phrase) || 0) + 1);
  }

  return [...counts.values()].filter((count) => count >= 3).length;
};

const buildVisualDirection = (payload: GenerationPayload) => {
  const design = getDesignSystem(payload);
  const sections = buildSections(payload);
  const directives: string[] = [
    `Design system variant: ${design.variant}.`,
    `Hero variant: ${design.hero.variant}.`,
    `Menu layout: ${design.menu.variant}.`,
    `Navigation pattern: ${design.layout.navPattern}.`,
    `Image treatment: ${design.layout.imageTreatment}.`,
    `Preferred section sequence: ${sections.sectionOrder.join(' -> ')}.`,
    'Make the site feel expensive, restaurant-specific, and hand-shaped rather than like a default Tailwind landing page.',
    'Use 5 to 7 strong sections total, not a long stack of weak ones.',
    'Use stronger composition: asymmetric sections, mixed content density, and at least one large image-led moment.',
    'Avoid repeating identical card grids from section to section or boxing every block the same way.',
    'Use cleaner editorial pacing with larger headlines, quieter supporting copy, and more deliberate whitespace.',
    'The menu should feel curated and appetizing, not dumped into generic cards.',
    'Combine hours, location, and contact into one clean visit moment instead of scattering them.',
    'The nav and footer should feel custom to the chosen direction, not like a generic SaaS header.',
    'Use soft dividers, nuanced shadows, and layered surfaces only where they actually help.',
    'Do not generate fake testimonials, fake awards, or generic experience sections with empty claims.',
    'Do not create giant white panel sections with one centered heading, one paragraph, and a random image dropped underneath.',
    'Do not make the hero just a restaurant name on top of a photo. It needs supporting copy and CTA hierarchy.',
    'Do not create isolated bright orange CTA bars with a single button and no surrounding context.',
    'Do not use centered contact stacks with plain links as the main contact experience.',
    'Choose images that match the section purpose. Avoid random cocktail or bar photos in story sections unless the bar program is explicitly part of the brand.',
  ];

  if (design.variant === 'editorial-luxe') {
    directives.push('Lean into elegant typography, darker hero drama, and a more editorial reservation-led presentation.');
  } else if (design.variant === 'modern-minimal') {
    directives.push('Lean into clarity, whitespace, refined restraint, and premium minimalism.');
  } else if (design.variant === 'warm-neighborhood') {
    directives.push('Lean into warmth, hospitality, and a more personal, local feel without becoming rustic or cluttered.');
  } else {
    directives.push('Lean into bolder contrast, stronger CTA hierarchy, and more energetic food-forward presentation.');
  }

  return directives.map((line) => `- ${line}`).join('\n');
};

const collectHtmlIssues = (html: string): string[] => {
  const issues: string[] = [];
  const textContent = extractTextContent(html);
  const sectionCount = (html.match(/<section\b/gi) || []).length;
  const imageCount = (html.match(/<img\b/gi) || []).length + (html.match(/background-image\s*:/gi) || []).length;
  const heroSlice = getSectionSlice(html, 'home');
  const menuSlice = getSectionSlice(html, 'menu');
  const reserveSlice = getSectionSlice(html, 'reserve');
  const hoursSlice = getSectionSlice(html, 'hours');
  const navSlice = html.match(/<nav\b[\s\S]*?<\/nav>/i)?.[0] || '';
  const footerSlice = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] || '';
  const heroWordCount = extractTextContent(heroSlice).split(/\s+/).filter(Boolean).length;
  const heroButtonCount = (heroSlice.match(/<(a|button)\b/gi) || []).length;
  const menuItemSignals = (menuSlice.match(/<h4\b|<li\b|<article\b/gi) || []).length;
  const menuDescriptionSignals = (menuSlice.match(/<p\b/gi) || []).length;
  const reserveInteractiveCount = (reserveSlice.match(/<(a|button|input|select|textarea)\b/gi) || []).length;
  const repeatedHalfLayoutCount = (html.match(/w-full\s+lg:w-1\/2|lg:grid-cols-\[0\.5|lg:grid-cols-\[1fr_1fr|flex\s+flex-wrap\s+justify-center/gi) || []).length;
  const hasLegacyTailwindStylesheet = /cdn\.jsdelivr\.net\/npm\/tailwindcss/i.test(html);
  const hasDuplicateTailwindRuntime = (html.match(/cdn\.tailwindcss\.com/gi) || []).length > 1 || hasLegacyTailwindStylesheet;
  const centeredUtilitySectionCount = (html.match(/text-center/gi) || []).length;

  if (html.length < 1200) issues.push('too-short');
  if (!/<body[^>]*>/i.test(html)) issues.push('missing-body');
  if (!/<script[^>]+src=["']https:\/\/cdn\.tailwindcss\.com["'][^>]*><\/script>/i.test(html)) {
    issues.push('missing-tailwind-script');
  }
  if (!/<nav[^>]*>/i.test(html) && !/<header[^>]*>/i.test(html)) issues.push('missing-navigation');
  if (!/<section[^>]*>/i.test(html)) issues.push('missing-sections');
  if (!/<footer\b/i.test(html)) issues.push('missing-footer');
  const h1Matches = html.match(/<h1\b/gi) || [];
  if (h1Matches.length === 0) issues.push('missing-h1');
  if (h1Matches.length > 1) issues.push('multiple-h1');
  if (!/(Reserve|Book|Order|Menu|Visit)/i.test(heroSlice || html)) issues.push('weak-cta');
  if (/lorem ipsum|placeholder/gi.test(textContent)) issues.push('placeholder-copy');
  const genericHits = genericPhrases.reduce((count, regex) => count + ((html.match(regex) || []).length), 0);
  if (genericHits >= 2) issues.push('generic-copy');
  if (sectionCount > 7) issues.push('too-many-sections');
  if (imageCount < 2) issues.push('weak-image-treatment');
  if (!heroSlice || !/<h1\b/i.test(heroSlice) || !/(<img\b|background-image\s*:)/i.test(heroSlice)) issues.push('weak-hero');
  if (heroWordCount < 16 || heroButtonCount < 1) issues.push('weak-hero-hierarchy');
  if ((menuSlice.match(/\$/g) || []).length < 2 && menuItemSignals < 3) issues.push('weak-menu');
  if (menuDescriptionSignals < 2) issues.push('weak-menu-descriptions');
  if (
    reserveSlice &&
    (!/(<input\b|<select\b|Reserve|Book|OpenTable|Resy|tel:|mailto:)/i.test(reserveSlice) || reserveInteractiveCount < 2)
  ) {
    issues.push('weak-reservation');
  }
  if (hoursSlice && !/(tel:|mailto:|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\d{1,2}:\d{2})/i.test(hoursSlice)) {
    issues.push('weak-visit-info');
  }
  if (hasDuplicateTailwindRuntime) issues.push('duplicate-tailwind-runtime');
  if (repeatedHalfLayoutCount >= 4) issues.push('repetitive-split-layouts');
  if (centeredUtilitySectionCount >= 4 && /(Leave a Review|Instagram|Order Online|Contact Us)/i.test(textContent)) issues.push('weak-contact-composition');
  if ((navSlice.match(/<a\b/gi) || []).length >= 8 && (footerSlice.match(/<a\b/gi) || []).length >= 6) issues.push('duplicate-nav-footer');
  return issues;
};

const getFatalIssues = (issues: string[]) =>
  issues.filter((issue) =>
    [
      'too-short',
      'missing-body',
      'missing-navigation',
      'missing-sections',
      'missing-h1',
      'missing-footer',
      'weak-hero',
      'weak-hero-hierarchy',
      'weak-menu',
      'weak-menu-descriptions',
      'weak-reservation',
      'weak-visit-info',
      'weak-image-treatment',
      'duplicate-tailwind-runtime',
      'weak-contact-composition',
    ].includes(issue)
  );

export const buildGenerationContentPlanPrompt = (payload: GenerationPayload): string => {
  const sections = buildSections(payload);
  const {
    brand,
    primaryCta,
    services,
    ordering,
    advanced,
    shortDescription,
    description,
    fullStory,
    founderName,
    yearFounded,
    menu,
    signatureDishes,
    menuSourceText,
    tone,
    style,
    onlineOrdering,
    reservations,
  } = payload;

  return `Create a structured content plan for a premium restaurant website.

Return valid JSON only with these optional keys:
- heroSupport: string
- heroHighlights: string[]
- storyHeading: string
- storyBody: string
- storyFacts: string[]
- menuHeading: string
- menuIntro: string
- menuItemDescriptions: [{ "name": string, "description": string }]
- experienceHeading: string
- experienceBody: string
- reserveHeading: string
- reserveBody: string
- orderHeading: string
- orderBody: string
- visitHeading: string
- visitBody: string
- footerTagline: string

Business details:
- Name: ${sections.name}
- Cuisine: ${sections.cuisineType}
- Price range: ${sections.priceRange}
- Address: ${sections.address}, ${sections.city}
- Phone: ${sections.phone}
- Email: ${sections.email}
- Summary: ${brand?.summary || shortDescription || description || sections.summary}
${fullStory ? `- Story: ${fullStory}` : ''}
${founderName ? `- Founder: ${founderName}${yearFounded ? ` (${yearFounded})` : ''}` : ''}
${brand?.atmosphere ? `- Atmosphere: ${brand.atmosphere}` : ''}
${brand?.audience ? `- Audience: ${brand.audience}` : ''}
${advanced?.neighborhood ? `- Neighborhood: ${advanced.neighborhood}` : payload.neighborhood ? `- Neighborhood: ${payload.neighborhood}` : ''}
${advanced?.parking ? `- Parking: ${advanced.parking}` : payload.parking ? `- Parking: ${payload.parking}` : ''}
${primaryCta ? `- Primary CTA: ${primaryCta}` : ''}

Services:
- Dine-in: ${Boolean(payload.dineIn ?? services?.dineIn) ? 'yes' : 'no'}
- Takeout: ${Boolean(payload.takeout ?? services?.takeout) ? 'yes' : 'no'}
- Delivery: ${Boolean(payload.delivery ?? services?.delivery) ? 'yes' : 'no'}
- Catering: ${Boolean(services?.catering || payload.cateringAvailable) ? 'yes' : 'no'}
- Private dining: ${Boolean(services?.privateDining) ? 'yes' : 'no'}

Reservations:
- ${reservations?.acceptReservations ? `${reservations.platforms?.join(', ') || 'enabled'} (${reservations.url || 'URL not provided'})` : payload.reservations?.acceptReservations ? `${payload.reservations.platforms?.join(', ') || 'enabled'} (${payload.reservations.url || 'URL not provided'})` : 'not enabled'}

Ordering:
- ${onlineOrdering?.acceptOrders ? `${onlineOrdering.platforms?.join(', ') || 'enabled'} (${onlineOrdering.customURL || 'URL not provided'})` : ordering?.enabled ? `${ordering.provider || 'enabled'} (${ordering.url || 'URL not provided'})` : 'not enabled'}

Menu items:
${(menu || [])
  .map((item) => `- ${item.name}: ${item.description || 'No description'} (${formatMenuPrice(item.displayPrice ?? item.price) || 'No price'}) [${item.category || 'Featured'}]`)
  .join('\n')}
${signatureDishes?.length ? `Signature dishes: ${signatureDishes.join(', ')}` : ''}
${menuSourceText ? `Raw pasted menu text:\n${menuSourceText}` : ''}

Rules:
- Keep every line restaurant-specific, polished, and believable.
- Do not talk about websites, layouts, sections, landing pages, cards, UX, or design strategy.
- Do not invent facts, menu items, addresses, phone numbers, hours, reservation platforms, reviews, or awards.
- Menu description rewrites must stay grounded in the provided item name and source description. Do not add unsupported ingredients or claims.
- Prefer fewer, stronger ideas over filler.
- Hero support should be one short sentence.
- Headings should be concise and brand-forward.
- Avoid generic headings like "Our Story", "Our Menu", "Reservations", "Order Online", or "Visit Us".
- Avoid generic phrases like "indulge in", "unforgettable", "crafted with love", "experience the", or "join us for".
- If a field would be weak or repetitive, omit it instead of padding it.
- Make the language feel like a real hospitality brand, not AI marketing copy.

Art direction:
- Style: ${style || 'Modern'}
- Tone: ${tone || 'Warm and welcoming'}
- Section sequence target: ${sections.sectionOrder.join(' -> ')}`;
};

export const renderPremiumRestaurantHtml = (payload: GenerationPayload): string => buildFallbackHtml(payload);

export const buildGenerationPrompt = (payload: GenerationPayload): string => {
  const sections = buildSections(payload);
  const design = getDesignSystem(payload);
  const {
    customInstruction,
    existingHtml,
    brand,
    primaryCta,
    services,
    ordering,
    domainPreference,
    advanced,
    shortDescription,
    description,
    fullStory,
    founderName,
    yearFounded,
    menu,
    signatureDishes,
    menuSourceText,
    menuSourceImages,
    tone,
    style,
    onlineOrdering,
    reservations,
    socialLinks,
  } = payload;
  const imageAssets = sections.imageAssets || [];

  const hasEditContext = Boolean(customInstruction && existingHtml);

  if (hasEditContext) {
    return `You are editing an existing generated restaurant website inside a live preview.

Apply the user's request immediately.
Update only the relevant section or sections.
Preserve the rest of the site, including layout, colors, spacing, fonts, and all unaffected content.
Return the full updated HTML document only.

Rules:
- Do not redesign the whole site unless the user explicitly asks.
- Do not remove working sections unless the user asked.
- If the request references an uploaded image, use it directly where requested.
- Keep internal navigation working with on-page anchors.
- Never use relative page routes, root paths, or .html files for navigation.
- Keep text readable against every background.
- Preserve the existing theme direction, section hierarchy, and CTA logic unless the user explicitly asks to redesign them.
- Keep the page feeling like a premium restaurant brand website, not a generic landing page.
- Avoid filler copy, duplicate sections, weak stacked text blocks, or repeating the same card pattern everywhere.
- Do not invent factual details, testimonials, awards, menu items, addresses, or reservation providers.

User request:
${customInstruction}

Existing HTML:
${existingHtml}`;
  }

  return `Create a complete, premium restaurant website in raw HTML using Tailwind CSS CDN.

Business details:
- Name: ${sections.name}
- Cuisine: ${sections.cuisineType}
- Price range: ${sections.priceRange}
- Address: ${sections.address}, ${sections.city}
- Phone: ${sections.phone}
- Email: ${sections.email}
- Summary: ${brand?.summary || shortDescription || description || sections.summary}
${fullStory ? `- Story: ${fullStory}` : ''}
${founderName ? `- Founder: ${founderName}${yearFounded ? ` (${yearFounded})` : ''}` : ''}
${brand?.atmosphere ? `- Atmosphere: ${brand.atmosphere}` : ''}
${brand?.audience ? `- Audience: ${brand.audience}` : ''}
${brand?.heroFocus ? `- Homepage focus: ${brand.heroFocus}` : ''}
${Array.isArray(brand?.keywords) && brand.keywords.length ? `- Brand keywords: ${brand.keywords.join(', ')}` : ''}
${primaryCta ? `- Primary CTA: ${primaryCta}` : ''}
${domainPreference ? `- Publishing intent: ${domainPreference}` : ''}
${advanced?.weeklySpecials ? `- Weekly specials: ${advanced.weeklySpecials}` : ''}

Services:
- Dine-in: ${Boolean(payload.dineIn ?? services?.dineIn) ? 'yes' : 'no'}
- Takeout: ${Boolean(payload.takeout ?? services?.takeout) ? 'yes' : 'no'}
- Delivery: ${Boolean(payload.delivery ?? services?.delivery) ? 'yes' : 'no'}
- Catering: ${Boolean(services?.catering || payload.cateringAvailable) ? 'yes' : 'no'}
- Private dining: ${Boolean(services?.privateDining) ? 'yes' : 'no'}

Ordering and reservations:
- Online ordering: ${onlineOrdering?.acceptOrders ? `${onlineOrdering.platforms?.join(', ') || 'enabled'} (${onlineOrdering.customURL || 'URL not provided'})` : ordering?.enabled ? `${ordering.provider || 'enabled'} (${ordering.url || 'URL not provided'})` : 'no'}
- Reservations: ${reservations?.acceptReservations ? `${reservations.platforms?.join(', ') || 'enabled'} (${reservations.url || 'URL not provided'})` : 'no'}

Menu:
${(menu || []).map((item) => `- ${item.name}: ${item.description} (${formatMenuPrice(item.displayPrice ?? item.price)}) [${item.category || 'Featured'}]`).join('\n')}
${signatureDishes?.length ? `Signature dishes: ${signatureDishes.join(', ')}` : ''}
${menuSourceText ? `Raw pasted menu text:\n${menuSourceText}` : ''}
${menuSourceImages?.length ? `Menu image count: ${menuSourceImages.length}` : ''}

Hours:
${Object.entries(payload.hours || {}).map(([day, time]) => `${day}: ${time}`).join('\n')}

Social:
${socialLinks?.instagram ? `Instagram: ${socialLinks.instagram}` : ''}
${socialLinks?.tiktok ? `TikTok: ${socialLinks.tiktok}` : ''}
${socialLinks?.googleReviews ? `Google reviews: ${socialLinks.googleReviews}` : ''}

Image assets:
${imageAssets.length
  ? imageAssets.map((img) => `- ${img.role}: ${img.url} (alt: ${img.alt})`).join('\n')
  : '- No image assets available. Do not invent image URLs.'}

Non-negotiable rules:
- Return only raw HTML. No markdown.
- Use the user's facts exactly where provided.
- Do not invent menu items, addresses, phone numbers, hours, reservation platforms, or awards.
- Use only the provided menu items or the raw pasted menu text if supplied.
- Use only the provided image asset URLs when adding images.
- Do not invent, fetch, or hallucinate image URLs.
- Use semantic HTML.
- Use Tailwind CDN.
- Internal navigation must use valid in-page anchors only.
- Header navigation must use only in-page anchors like #home, #about, #menu, #hours, #order, #reserve, and #contact.
- Never use /about, /menu, index.html, or full-site URLs for navigation.
- The site must be mobile responsive.
- Keep text readable against every background.
- Use one elegant heading font and one clean body font only.
- Use a restrained palette and a clear CTA hierarchy.
- Use proper heading order, visible focus states, and labeled form fields where forms exist.
- Do not create fake reviews, fake testimonials, fake awards, or filler social proof.
- Do not create duplicate sections or repeat the same idea in multiple sections.
- Prefer 5 to 7 strong sections total, including hero and footer.
- Do not include duplicate Tailwind imports, legacy Tailwind stylesheet links, or duplicate Synthr safety assets.

Art direction:
- Style: ${style || 'Modern'}
- Tone: ${tone || 'Warm and welcoming'}
- Layout variant: ${design.variant}
- Hero variant: ${design.hero.variant}
- Menu layout: ${design.menu.variant}
- Navigation pattern: ${design.layout.navPattern}
- Image treatment: ${design.layout.imageTreatment}
- Section sequence target: ${sections.sectionOrder.join(' -> ')}
- The page flow should feel intentional: brand + atmosphere -> menu appeal -> reservation or ordering -> visit details.
- Build a visually striking hero with the restaurant name, one short supporting line, one clear primary CTA, and at most one secondary CTA.
- Use cleaner, more editorial section layouts with stronger hierarchy, whitespace, and image composition.
- Avoid plain stacked containers, repetitive card grids, and generic text-then-image patterns.
- Avoid giant centered white cards, full-width filler bands, and disconnected utility sections.
- The about/story section should feel atmospheric and editorial, not like a paragraph dump.
- The menu must feel designed, scan-friendly, and appetizing even if there are only a few items.
- Reservations should feel serious and polished. If reservations are enabled, build a dedicated reservation section with clear inputs or booking details and one strong submit path.
- Ordering should only appear if relevant, and it should feel integrated into the brand rather than like a leftover button block.
- Combine hours, location, and contact into one refined visit section instead of scattering them.
- Include at least one large image-led moment that feels premium.
- Use the provided image assets intentionally: one strong hero image and a few supporting images with varied aspect ratios.
- Match image role to section role. Avoid random cocktail shots in about/story unless the venue is explicitly bar-led.
- Desktop should feel polished and expansive, while mobile should collapse cleanly with intentional spacing and tap targets.
- Use tasteful microinteractions only if they can be expressed in simple CSS and do not harm readability.
- Keep copy short, specific, and rooted in hospitality language, not startup marketing language.

Visual direction:
${buildVisualDirection(payload)}`;
};

export const finalizeGeneratedHtml = (payload: GenerationPayload, rawHtml: string): { html: string; meta: GenerationMeta } => {
  const hasEditContext = Boolean(payload.customInstruction && payload.existingHtml);
  const sections = buildSections(payload);

  const prepareHtml = (html: string): string => {
    let nextHtml = html || '<html><body>Error generating preview.</body></html>';
    if (nextHtml.includes('```html')) nextHtml = nextHtml.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    if (nextHtml.includes('```')) nextHtml = nextHtml.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '');
    nextHtml = ensureHtmlDocument(nextHtml.trim());
    nextHtml = stripManagedAssets(nextHtml);
    nextHtml = ensureTailwindCdn(nextHtml);
    nextHtml = ensureSeoMeta(nextHtml, payload);
    nextHtml = ensureDesignSafetyStyles(nextHtml, payload.style, payload.cuisineType, payload.tone);
    nextHtml = normalizeOnPageLinks(nextHtml);
    nextHtml = ensureRequiredAnchorTargets(nextHtml);
    nextHtml = ensureSmoothScrollScript(nextHtml);
    nextHtml = injectFallbackGallery(nextHtml, sections.imageAssets);
    nextHtml = applyHeroBackground(nextHtml, payload.assistantImage, payload.customInstruction);
    return nextHtml;
  };

  const preparedModelHtml = prepareHtml(rawHtml);
  const modelIssues = collectHtmlIssues(preparedModelHtml);
  const fatalIssues = getFatalIssues(modelIssues);
  const qualityIssueCount = modelIssues.filter((issue) => ['generic-copy', 'duplicate-copy', 'too-many-sections', 'weak-cta'].includes(issue)).length;
  let cleanHtml = preparedModelHtml;
  let source: GenerationMeta['source'] = 'model';

  if (fatalIssues.length > 0 || qualityIssueCount >= 2) {
    if (hasEditContext && typeof payload.existingHtml === 'string' && payload.existingHtml.length > 0) {
      cleanHtml = prepareHtml(payload.existingHtml);
      source = 'existing';
    } else {
      cleanHtml = prepareHtml(renderPremiumRestaurantHtml(payload));
      source = 'fallback';
    }
  }

  const finalIssues = collectHtmlIssues(cleanHtml);

  return {
    html: cleanHtml,
    meta: {
      source,
      validationIssues: finalIssues,
      modelValidationIssues: modelIssues,
      finalHtmlValidationIssues: finalIssues,
    },
  };
};
