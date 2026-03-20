type ImageRole = 'hero' | 'interior' | 'food' | 'dish' | 'dessert' | 'bar' | 'logo';

type ImageAsset = {
  role: ImageRole;
  url: string;
  alt: string;
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
  menu?: Array<{
    name?: string;
    description?: string;
    price?: unknown;
    displayPrice?: string;
    category?: string;
    dietary?: string[];
  }>;
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
};

export type GenerationMeta = {
  source: 'model' | 'fallback' | 'existing';
  validationIssues: string[];
};

export const GENERATION_SYSTEM_PROMPT = `You are a senior restaurant website designer and front-end engineer.
Return only complete HTML documents.
Use the user's data exactly where facts are provided.
Do not invent menu items, addresses, phone numbers, hours, or reservation platforms.
Prefer strong visual hierarchy, clear CTAs, semantic HTML, and mobile-safe layouts.
Avoid filler marketing language and repetitive section structures.`;

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
          ? `background:rgba(255,255,255,0.78); backdrop-filter: blur(16px); border:1px solid ${palette.border}; box-shadow:${variant === 'editorial-luxe' ? '0 18px 40px -28px rgba(15,23,42,0.24)' : '0 14px 36px -28px rgba(15,23,42,0.18)'};`
          : navPattern === 'solid-bar'
            ? `background:${palette.surface}; border:1px solid ${palette.border};`
            : 'background:transparent;',
      link: `color:${palette.ink};`,
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
  if (/cdn\.tailwindcss\.com/i.test(html)) return html;
  const cdnTag = '<script src="https://cdn.tailwindcss.com"></script>';
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (match) => `${match}\n  ${cdnTag}`);
  }
  return html.replace(/<html[^>]*>/i, (match) => `${match}\n<head>\n  ${cdnTag}\n</head>`);
};

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
    }
    h1, h2, h3, h4, h5, h6 { font-family: ${design.typography.headingFamily}; letter-spacing: -0.03em; line-height: 0.98; }
    h1 { font-size: var(--synthr-hero-size); }
    h2 { font-size: var(--synthr-heading-size); }
    p, li, span, label, small { color: inherit; }
    img, video { max-width: 100%; height: auto; }
    input, select, textarea, button { font: inherit; }
    a, button { max-width: 100%; }
    :focus-visible { outline: 2px solid var(--synthr-accent); outline-offset: 3px; }
    main, section, header, footer, nav { width: 100%; }
    section, header, footer { position: relative; }
    nav { flex-wrap: wrap; row-gap: 0.5rem; }
    a:not([class*="bg-"]) { color: var(--synthr-accent); text-decoration-color: color-mix(in srgb, var(--synthr-accent) 35%, transparent); }
    button, [role="button"], a[class*="bg-"], a[class*="inline-flex"] { transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease; }
    button:hover, [role="button"]:hover, a[class*="bg-"]:hover, a[class*="inline-flex"]:hover { transform: translateY(-1px); }
    .synthr-surface { background: var(--synthr-surface); border: 1px solid var(--synthr-border); box-shadow: var(--synthr-shadow-soft); border-radius: var(--synthr-radius-panel); }
    .synthr-surface-alt { background: var(--synthr-surface-alt); border: 1px solid var(--synthr-border); border-radius: var(--synthr-radius-panel); }
    .synthr-divider { border-color: var(--synthr-border); }
    .synthr-eyebrow { letter-spacing: 0.32em; text-transform: uppercase; color: var(--synthr-muted); font-size: 0.76rem; }
    .synthr-button-primary { background: var(--synthr-accent-strong); color: white; border-radius: var(--synthr-radius-button); box-shadow: var(--synthr-shadow-soft); }
    .synthr-button-secondary { background: transparent; color: var(--synthr-ink); border: 1px solid var(--synthr-border); border-radius: var(--synthr-radius-button); }
    .synthr-media { border-radius: var(--synthr-radius-media); overflow: hidden; box-shadow: var(--synthr-shadow-card); }
    .synthr-dark-surface, footer { color: rgba(255,255,255,0.92); }
    .synthr-dark-surface a, footer a { color: white; }
    @media (max-width: 768px) {
      h1 { line-height: 1.02; }
      body { background-size: 180% auto; }
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

      const syncLink = (link) => {
        const href = link.getAttribute('href') || '';
        const target = normalizeTarget(href, link.textContent || '');
        if (target && target.startsWith('#')) {
          link.setAttribute('href', target);
        }
      };

      document.querySelectorAll('a[href]').forEach(syncLink);

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

      const luminance = (value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
      };

      const parseColor = (value) => {
        if (!value) return null;
        const match = value.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/i);
        if (!match) return null;
        return [Number(match[1]), Number(match[2]), Number(match[3])];
      };

      const findBackground = (element) => {
        let current = element;
        while (current && current !== document.body) {
          const styles = window.getComputedStyle(current);
          const color = parseColor(styles.backgroundColor);
          if (color && styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent') {
            return color;
          }
          current = current.parentElement;
        }
        return [248, 250, 252];
      };

      const fixContrast = () => {
        const nodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li, a, small, strong, em, label, button');
        nodes.forEach((node) => {
          if (node.closest('[style*="background-image"]')) return;
          const styles = window.getComputedStyle(node);
          const textColor = parseColor(styles.color);
          const backgroundColor = findBackground(node);
          if (!textColor || !backgroundColor) return;

          const textLum = 0.2126 * luminance(textColor[0]) + 0.7152 * luminance(textColor[1]) + 0.0722 * luminance(textColor[2]);
          const bgLum = 0.2126 * luminance(backgroundColor[0]) + 0.7152 * luminance(backgroundColor[1]) + 0.0722 * luminance(backgroundColor[2]);
          const contrast = (Math.max(textLum, bgLum) + 0.05) / (Math.min(textLum, bgLum) + 0.05);

          if (contrast < 3.8) {
            const backgroundIsLight = bgLum > 0.55;
            node.style.setProperty('color', backgroundIsLight ? '#0f172a' : '#f8fafc', 'important');
            node.style.setProperty('text-shadow', backgroundIsLight ? 'none' : '0 2px 16px rgba(15,23,42,0.55)', 'important');
          }
        });
      };

      if (document.readyState === 'complete') {
        fixContrast();
      } else {
        window.addEventListener('load', fixContrast, { once: true });
      }
      window.setTimeout(fixContrast, 120);
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

const buildSections = (payload: GenerationPayload) => {
  const {
    name = 'Restaurant',
    cuisineType = 'Restaurant',
    priceRange = '$$',
    city = '',
    address = '',
    phone = '',
    email = '',
    tagline,
    hours,
    description,
    brand,
    menu,
    onlineOrdering,
    reservations,
    googleMapsLink,
    parking,
    neighborhood,
    socialLinks,
    hostEvents,
    weeklySpecials,
    cateringAvailable,
    cateringEmail,
    privateEventCapacity,
    shortDescription,
    fullStory,
    yearFounded,
    founderName,
    images,
    useStockImages,
    style,
  } = payload;

  const menuByCategory: Record<string, GenerationPayload['menu']> = {};
  (menu || []).forEach((item) => {
    const category = item?.category || 'Featured';
    if (!menuByCategory[category]) menuByCategory[category] = [];
    menuByCategory[category]?.push(item);
  });

  const menuHTML = Object.entries(menuByCategory)
    .map(
      ([category, items]) => `
      <div class="bg-slate-50 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-slate-900">${category}</h3>
        </div>
        <div class="grid gap-4">
          ${(items || [])
            .map(
              (item) => `
            <div class="flex items-start justify-between gap-4 bg-white rounded-xl p-4 shadow">
              <div class="flex-1">
                <h4 class="text-base font-semibold text-slate-900">${item?.name || ''}</h4>
                <p class="text-slate-600 text-sm mt-1">${item?.description || ''}</p>
              </div>
              <span class="text-base font-semibold text-amber-600">${formatMenuPrice(item?.displayPrice ?? item?.price)}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>`
    )
    .join('');

  const hoursHTML = Object.entries(hours || {})
    .map(
      ([day, time]) => `
      <div class="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0">
        <span class="font-medium text-slate-700">${day}</span>
        <span class="text-slate-600">${time || 'Closed'}</span>
      </div>`
    )
    .join('');

  let orderingSection = '';
  if (onlineOrdering?.acceptOrders) {
    const platformNames = (onlineOrdering.platforms || [])
      .map((platform) => {
        if (platform === 'doordash') return 'DoorDash';
        if (platform === 'ubereats') return 'Uber Eats';
        return platform.charAt(0).toUpperCase() + platform.slice(1);
      })
      .join(', ');
    orderingSection = `
      <div class="p-8 bg-amber-50 rounded-2xl shadow-lg">
        <h3 class="text-2xl font-bold text-slate-900 mb-3">Order Online</h3>
        <p class="text-slate-600 mb-6">${platformNames ? `Available on ${platformNames}.` : 'Order online directly from the restaurant.'}</p>
        <a href="${onlineOrdering.customURL || '#order'}" class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700">Order Now</a>
      </div>`;
  }

  let reservationsSection = '';
  if (reservations?.acceptReservations) {
    const platformNames = (reservations.platforms || []).map((platform) => platform.charAt(0).toUpperCase() + platform.slice(1)).join(', ');
    reservationsSection = `
      <div class="p-8 bg-slate-100 rounded-2xl shadow-lg">
        <h3 class="text-2xl font-bold text-slate-900 mb-3">Reserve a Table</h3>
        <p class="text-slate-600 mb-6">${platformNames ? `Book on ${platformNames}.` : 'Reserve directly with the restaurant.'}</p>
        <a href="${reservations.url || '#reserve'}" class="inline-block px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700">Reserve Now</a>
      </div>`;
  }

  const aboutSection = fullStory
    ? `
      <section id="about" class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <p class="text-slate-700 text-lg leading-relaxed mb-4">${fullStory}</p>
          ${founderName ? `<p class="text-slate-600">Founded by ${founderName}${yearFounded ? ` in ${yearFounded}` : ''}</p>` : ''}
        </div>
      </section>`
    : '';

  const cateringSection = cateringAvailable
    ? `
      <section id="events" class="py-16 bg-slate-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Catering & Private Events</h2>
          <p class="text-slate-700 text-lg mb-6">Host your event at ${name}. We can accommodate ${privateEventCapacity || 'up to 60'} guests.</p>
          <a href="mailto:${cateringEmail || email}" class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700">Inquire Now</a>
        </div>
      </section>`
    : '';

  const eventsSection = hostEvents && weeklySpecials
    ? `
      <section id="experience" class="py-16 bg-amber-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Events & Specials</h2>
          <p class="text-slate-700 text-lg whitespace-pre-line">${weeklySpecials}</p>
        </div>
      </section>`
    : '';

  const socialHTML =
    socialLinks && Object.values(socialLinks).some(Boolean)
      ? `
      <div class="flex gap-4 justify-center mt-6">
        ${socialLinks.instagram ? `<a href="https://instagram.com/${socialLinks.instagram}" class="text-orange-600 hover:text-orange-700 font-semibold">Instagram</a>` : ''}
        ${socialLinks.tiktok ? `<a href="https://tiktok.com/@${socialLinks.tiktok}" class="text-orange-600 hover:text-orange-700 font-semibold">TikTok</a>` : ''}
        ${socialLinks.yelp ? `<a href="${socialLinks.yelp}" class="text-orange-600 hover:text-orange-700 font-semibold">Yelp</a>` : ''}
        ${socialLinks.googleReviews ? `<a href="${socialLinks.googleReviews}" class="text-orange-600 hover:text-orange-700 font-semibold">Google Reviews</a>` : ''}
      </div>`
      : '';

  const imageAssets = buildImageAssets(images, useStockImages !== false, cuisineType, name, style);
  const summary =
    shortDescription || description || brand?.summary || `A welcoming ${cuisineType.toLowerCase()} restaurant serving guests in ${city || 'your neighborhood'}.`;

  return {
    name,
    cuisineType,
    priceRange,
    city,
    address,
    phone,
    email,
    tagline: tagline || `${name} serves ${cuisineType.toLowerCase()} food with warmth and care.`,
    neighborhood,
    parking,
    menuHTML,
    hoursHTML,
    orderingSection,
    reservationsSection,
    aboutSection,
    cateringSection,
    eventsSection,
    socialHTML,
    summary,
    googleMapsLink,
    imageAssets,
  };
};

const buildFallbackHtml = (payload: GenerationPayload): string => {
  const sections = buildSections(payload);
  const design = getDesignSystem(payload);
  const {
    name,
    cuisineType,
    priceRange,
    city,
    address,
    phone,
    email,
    tagline,
    neighborhood,
    parking,
    summary,
    googleMapsLink,
    imageAssets,
  } = sections;

  const menuItems = (payload.menu || []).filter((item) => item?.name);
  const groupedMenu = menuItems.reduce<Record<string, typeof menuItems>>((acc, item) => {
    const category = item?.category || 'Featured';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const heroImage = imageAssets.find((img) => img.role === 'hero') || imageAssets[0];
  const interiorImage = imageAssets.find((img) => img.role === 'interior') || imageAssets[1] || heroImage;
  const foodImages = imageAssets.filter((img) => img.role === 'food' || img.role === 'dish' || img.role === 'dessert');
  const galleryImages = imageAssets.filter((img) => img.role !== 'logo').slice(0, 5);
  const logo = imageAssets.find((img) => img.role === 'logo');

  const navLinks = [
    ['#about', 'About'],
    ['#menu', 'Menu'],
    ['#experience', 'Experience'],
    ['#hours', 'Hours'],
    ['#order', 'Order'],
    ['#reserve', 'Reserve'],
    ['#contact', 'Contact'],
  ];

  const heroEyebrow = `${cuisineType} · ${priceRange}${city ? ` · ${city}` : ''}`;
  const showOrder = Boolean(payload.onlineOrdering?.acceptOrders || payload.ordering?.enabled || payload.takeout || payload.delivery);
  const showReserve = Boolean(payload.reservations?.acceptReservations);

  const renderPrimaryButtons = () => `
    <div class="mt-10 flex flex-wrap gap-3">
      ${showOrder ? `<a href="#order" class="inline-flex items-center justify-center px-6 py-3 synthr-button-primary" style="${design.cta.primary}">Order online</a>` : ''}
      ${showReserve ? `<a href="#reserve" class="inline-flex items-center justify-center px-6 py-3 synthr-button-secondary" style="${design.cta.secondary}">Reserve a table</a>` : ''}
      ${!showOrder && !showReserve ? `<a href="#contact" class="inline-flex items-center justify-center px-6 py-3 synthr-button-primary" style="${design.cta.primary}">Plan your visit</a>` : ''}
    </div>`;

  const renderHero = () => {
    if (design.hero.variant === 'split-story') {
      return `
      <header id="home" class="${design.spacing.section}" style="${design.hero.height}">
        <div class="max-w-7xl mx-auto ${design.spacing.container}">
          ${renderNav()}
          <div class="mt-12 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div style="${design.hero.contentWidth}">
              <p class="synthr-eyebrow">${heroEyebrow}</p>
              <h1 class="mt-5">${tagline}</h1>
              <p class="mt-6 text-lg leading-8" style="color:${design.palette.muted}">${summary}</p>
              ${renderPrimaryButtons()}
            </div>
            <div class="synthr-media" style="border-radius:${design.radius.media}">
              ${heroImage ? `<img src="${heroImage.url}" alt="${heroImage.alt}" class="h-[36rem] w-full object-cover" />` : ''}
            </div>
          </div>
        </div>
      </header>`;
    }

    if (design.hero.variant === 'reservation-card') {
      return `
      <header id="home" class="${design.spacing.section}" style="${design.hero.height}">
        <div class="max-w-7xl mx-auto ${design.spacing.container}">
          ${renderNav()}
          <div class="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div class="relative overflow-hidden synthr-media" style="min-height:34rem;border-radius:${design.radius.media};box-shadow:${design.shadows.hero}">
              ${heroImage ? `<img src="${heroImage.url}" alt="${heroImage.alt}" class="absolute inset-0 h-full w-full object-cover" />` : ''}
              <div class="absolute inset-0" style="background:${design.palette.heroOverlay}"></div>
              <div class="relative z-10 flex h-full flex-col justify-end p-8 md:p-12 text-white">
                <p class="synthr-eyebrow" style="color:rgba(255,255,255,0.72)">${heroEyebrow}</p>
                <h1 class="mt-5" style="max-width:12ch">${tagline}</h1>
                <p class="mt-5 max-w-2xl text-lg leading-8 text-white/82">${summary}</p>
                ${renderPrimaryButtons()}
              </div>
            </div>
            <div class="synthr-surface self-end p-6 md:p-8">
              <p class="synthr-eyebrow">Reservations</p>
              <h2 class="mt-4 text-4xl">Built for a smoother booking flow.</h2>
              <p class="mt-5 leading-7" style="color:${design.palette.muted}">Clear hours, location details, and premium table-booking cues help guests decide faster.</p>
              <div class="mt-8 space-y-3 text-sm" style="color:${design.palette.muted}">
                <div class="flex items-center justify-between rounded-full px-4 py-3" style="background:${design.palette.surfaceAlt}">
                  <span>Address</span>
                  <span style="color:${design.palette.ink}">${city || 'Visit us'}</span>
                </div>
                <div class="flex items-center justify-between rounded-full px-4 py-3" style="background:${design.palette.surfaceAlt}">
                  <span>Reservations</span>
                  <span style="color:${design.palette.ink}">${showReserve ? 'Available' : 'Call to book'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>`;
    }

    if (design.hero.variant === 'stacked-marquee') {
      return `
      <header id="home" class="${design.spacing.section}" style="${design.hero.height}">
        <div class="max-w-7xl mx-auto ${design.spacing.container}">
          ${renderNav()}
          <div class="mt-12 grid gap-6">
            <div class="relative overflow-hidden synthr-media p-8 md:p-12 lg:p-16" style="min-height:40rem;background:${design.palette.footer};border-radius:${design.radius.media};box-shadow:${design.shadows.hero}">
              ${heroImage ? `<img src="${heroImage.url}" alt="${heroImage.alt}" class="absolute inset-0 h-full w-full object-cover opacity-55" />` : ''}
              <div class="absolute inset-0" style="background:linear-gradient(135deg, ${design.palette.heroOverlay}, rgba(15,23,42,0.12))"></div>
              <div class="relative z-10 max-w-3xl text-white">
                <p class="synthr-eyebrow" style="color:rgba(255,255,255,0.74)">${heroEyebrow}</p>
                <h1 class="mt-5" style="max-width:10ch">${tagline}</h1>
                <p class="mt-5 max-w-2xl text-lg leading-8 text-white/82">${summary}</p>
                ${renderPrimaryButtons()}
              </div>
              <div class="relative z-10 mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
                <div class="rounded-[999px] bg-white/12 px-4 py-3 text-sm text-white/82 backdrop-blur">Direct traffic-ready</div>
                <div class="rounded-[999px] bg-white/12 px-4 py-3 text-sm text-white/82 backdrop-blur">Mobile-first layout</div>
                <div class="rounded-[999px] bg-white/12 px-4 py-3 text-sm text-white/82 backdrop-blur">Clear menu hierarchy</div>
              </div>
            </div>
          </div>
        </div>
      </header>`;
    }

    return `
    <header id="home" class="${design.spacing.section}" style="${design.hero.height}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        ${renderNav()}
        <div class="relative mt-12 overflow-hidden synthr-media" style="min-height:42rem;border-radius:${design.radius.media};box-shadow:${design.shadows.hero}">
          ${heroImage ? `<img src="${heroImage.url}" alt="${heroImage.alt}" class="absolute inset-0 h-full w-full object-cover" />` : ''}
          <div class="absolute inset-0" style="background:linear-gradient(180deg, rgba(15,23,42,0.12), ${design.palette.heroOverlay})"></div>
          <div class="relative z-10 flex h-full items-end p-8 md:p-12 lg:p-16">
            <div style="${design.hero.contentWidth}; color:white">
              <p class="synthr-eyebrow" style="color:rgba(255,255,255,0.74)">${heroEyebrow}</p>
              <h1 class="mt-5" style="max-width:10ch">${tagline}</h1>
              <p class="mt-5 max-w-2xl text-lg leading-8 text-white/82">${summary}</p>
              ${renderPrimaryButtons()}
            </div>
          </div>
        </div>
      </div>
    </header>`;
  };

  const renderNav = () => `
    <nav class="flex items-center justify-between gap-6 rounded-[999px] px-4 py-3" style="${design.nav.shell}">
      <a href="#home" class="inline-flex items-center gap-3 font-semibold tracking-tight" style="${design.nav.link}">
        ${logo ? `<img src="${logo.url}" alt="${name} logo" class="h-10 w-10 rounded-full object-cover" />` : ''}
        <span>${name}</span>
      </a>
      <div class="hidden md:flex items-center gap-5 text-sm" style="${design.nav.link}">
        ${navLinks.map(([href, label]) => `<a href="${href}" class="transition hover:opacity-65">${label}</a>`).join('')}
      </div>
    </nav>`;

  const renderAbout = () => `
    <section id="about" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p class="synthr-eyebrow">About</p>
            <h2 class="mt-4">${name}, shaped by ${cuisineType.toLowerCase()} traditions.</h2>
            <p class="mt-6 text-lg leading-8" style="color:${design.palette.muted}">${summary}</p>
            <div class="mt-8 flex flex-wrap gap-3 text-sm" style="color:${design.palette.muted}">
              ${neighborhood ? `<span class="rounded-full px-4 py-2" style="background:${design.palette.surfaceAlt}">Neighborhood: ${neighborhood}</span>` : ''}
              ${parking ? `<span class="rounded-full px-4 py-2" style="background:${design.palette.surfaceAlt}">Parking: ${parking}</span>` : ''}
              <span class="rounded-full px-4 py-2" style="background:${design.palette.surfaceAlt}">${priceRange} price point</span>
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            ${[interiorImage, galleryImages[1] || galleryImages[0]].filter(Boolean).map((img, index) => `
              <div class="synthr-media" style="border-radius:${design.radius.media}">
                <img src="${img?.url}" alt="${img?.alt}" class="w-full ${index === 0 ? 'h-[26rem]' : 'h-[18rem] md:h-[26rem]'} object-cover" />
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>`;

  const renderMenu = () => {
    if (!menuItems.length) {
      return `
      <section id="menu" class="${design.spacing.section}">
        <div class="max-w-7xl mx-auto ${design.spacing.container}">
          <div class="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p class="synthr-eyebrow">Menu</p>
              <h2 class="mt-4">The menu is being refined right now.</h2>
              <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">We can still highlight the space, the story, and the best way to book or order while the full menu is finalized.</p>
            </div>
            <div class="synthr-surface p-8">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-[24px] p-6" style="background:${design.palette.surfaceAlt}">
                  <p class="synthr-eyebrow">Coming soon</p>
                  <p class="mt-4 text-lg" style="color:${design.palette.muted}">Menu details will be added here with real items only.</p>
                </div>
                ${foodImages.slice(0, 1).map((img) => `<div class="synthr-media"><img src="${img.url}" alt="${img.alt}" class="h-[16rem] w-full object-cover" /></div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>`;
    }

    const categories = Object.entries(groupedMenu);
    const categoryBlocks =
      design.menu.variant === 'editorial-list'
        ? categories
            .map(
              ([category, items]) => `
          <div class="border-t pt-6" style="border-color:${design.palette.border}">
            <div class="mb-5 flex items-end justify-between gap-4">
              <h3 class="text-2xl">${category}</h3>
              <span class="text-sm" style="color:${design.palette.muted}">${items.length} items</span>
            </div>
            <div class="space-y-5">
              ${items
                .map(
                  (item) => `
                <div class="grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
                  <div>
                    <div class="flex items-center gap-3">
                      <h4 class="text-lg font-semibold">${item?.name || ''}</h4>
                      ${item?.dietary?.length ? `<span class="text-xs uppercase tracking-[0.24em]" style="color:${design.palette.muted}">${item.dietary.join(' · ')}</span>` : ''}
                    </div>
                    <p class="mt-1 leading-7" style="color:${design.palette.muted}">${item?.description || ''}</p>
                  </div>
                  <div class="text-base font-semibold">${formatMenuPrice(item?.displayPrice ?? item?.price)}</div>
                </div>`
                )
                .join('')}
            </div>
          </div>`
            )
            .join('')
        : categories
            .map(
              ([category, items]) => `
          <div class="synthr-surface p-6">
            <div class="mb-4 flex items-center justify-between gap-4">
              <h3 class="text-2xl">${category}</h3>
              <span class="text-sm" style="color:${design.palette.muted}">${items.length} items</span>
            </div>
            <div class="space-y-4">
              ${items
                .map(
                  (item) => `
                <div class="rounded-[24px] p-4" style="background:${design.palette.surfaceAlt}">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h4 class="text-lg font-semibold">${item?.name || ''}</h4>
                      <p class="mt-1 text-sm leading-7" style="color:${design.palette.muted}">${item?.description || ''}</p>
                    </div>
                    <div class="text-base font-semibold">${formatMenuPrice(item?.displayPrice ?? item?.price)}</div>
                  </div>
                </div>`
                )
                .join('')}
            </div>
          </div>`
            )
            .join('');

    return `
    <section id="menu" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p class="synthr-eyebrow">Menu</p>
            <h2 class="mt-4">${design.menu.variant === 'editorial-list' ? 'Real menu highlights, presented with clarity.' : 'A menu built around what people decide on fast.'}</h2>
            <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">Every item below comes directly from the restaurant details you entered. No invented dishes, no filler.</p>
          </div>
          <div class="${design.menu.variant === 'editorial-list' ? 'space-y-2' : 'grid gap-6 md:grid-cols-2'}">
            ${categoryBlocks}
          </div>
        </div>
      </div>
    </section>`;
  };

  const renderExperience = () => `
    <section id="experience" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="grid gap-6 md:grid-cols-2">
            ${galleryImages.slice(0, 3).map((img, index) => `
              <div class="synthr-media ${index === 0 ? 'md:col-span-2' : ''}" style="border-radius:${design.radius.media}">
                <img src="${img.url}" alt="${img.alt}" class="w-full ${index === 0 ? 'h-[28rem]' : 'h-[18rem]'} object-cover" />
              </div>
            `).join('')}
          </div>
          <div class="self-center">
            <p class="synthr-eyebrow">Experience</p>
            <h2 class="mt-4">${design.variant === 'editorial-luxe' ? 'A stronger first impression, beyond the menu.' : 'A site that sells the room, not just the dishes.'}</h2>
            <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">${payload.fullStory || payload.brand?.story || `${name} is built around a clear sense of place, strong presentation, and simple ways for guests to take the next step.`}</p>
          </div>
        </div>
      </div>
    </section>`;

  const renderHours = () => {
    const hoursEntries = Object.entries(payload.hours || {}).filter(([, value]) => value);
    return `
    <section id="hours" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div class="synthr-surface p-8">
            <p class="synthr-eyebrow">Hours</p>
            <h2 class="mt-4">Plan your visit.</h2>
            <div class="mt-8 space-y-3">
              ${
                hoursEntries.length
                  ? hoursEntries
                      .map(
                        ([day, time]) => `
                    <div class="flex items-center justify-between gap-4 rounded-[20px] px-4 py-3" style="background:${design.palette.surfaceAlt}">
                      <span>${day}</span>
                      <span style="color:${design.palette.muted}">${time}</span>
                    </div>`
                      )
                      .join('')
                  : `<div class="rounded-[20px] px-4 py-4" style="background:${design.palette.surfaceAlt};color:${design.palette.muted}">Hours available on request.</div>`
              }
            </div>
          </div>
          <div class="synthr-surface p-8">
            <p class="synthr-eyebrow">Location</p>
            <h2 class="mt-4">${address}${city ? `, ${city}` : ''}</h2>
            <div class="mt-6 space-y-2 text-lg" style="color:${design.palette.muted}">
              <p>${phone || 'Call for details'}</p>
              <p>${email || ''}</p>
            </div>
            ${googleMapsLink ? `<a href="${googleMapsLink}" class="inline-flex items-center gap-2 mt-8" style="color:${design.palette.accentStrong}">Open in Google Maps</a>` : ''}
          </div>
        </div>
      </div>
    </section>`;
  };

  const renderOrder = () => `
    <section id="order" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="synthr-surface p-8 md:p-10">
          <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p class="synthr-eyebrow">Ordering</p>
              <h2 class="mt-4">Keep direct orders easy to start.</h2>
              <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">
                ${
                  payload.onlineOrdering?.acceptOrders
                    ? `Available ${payload.onlineOrdering.platforms?.length ? `on ${payload.onlineOrdering.platforms.join(', ')}` : 'online'} with a clear call to action.`
                    : `Call ${phone || 'the restaurant'} to place an order or check availability.`
                }
              </p>
            </div>
            <div>
              <a href="${payload.onlineOrdering?.customURL || '#contact'}" class="inline-flex items-center justify-center px-6 py-3 synthr-button-primary" style="${design.cta.primary}">
                ${payload.onlineOrdering?.acceptOrders ? 'Start an order' : 'Contact the restaurant'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const renderReserve = () => `
    <section id="reserve" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="overflow-hidden rounded-[${design.radius.media}] p-8 md:p-10 synthr-dark-surface" style="background:${design.palette.footer};box-shadow:${design.shadows.card}">
          <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p class="synthr-eyebrow" style="color:rgba(255,255,255,0.6)">Reservations</p>
              <h2 class="mt-4 text-white">${showReserve ? 'Reserve a table with a premium booking flow.' : 'Reach out directly for reservations and event inquiries.'}</h2>
              <p class="mt-5 max-w-2xl text-lg leading-8 text-white/76">${showReserve ? 'Built for restaurants that want bookings to feel easy, clear, and worth following through on.' : 'This section can be turned into a booking experience as soon as reservation details are ready.'}</p>
            </div>
            <div>
              <a href="${payload.reservations?.url || '#contact'}" class="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/18 bg-white text-slate-900 shadow-lg">
                ${showReserve ? 'Book now' : 'Get in touch'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const renderContact = () => `
    <section id="contact" class="${design.spacing.section}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="synthr-eyebrow">Contact</p>
            <h2 class="mt-4">Everything guests need in one place.</h2>
            <p class="mt-5 text-lg leading-8" style="color:${design.palette.muted}">Location, booking, and ordering details should feel effortless to find.</p>
          </div>
          <div class="grid gap-6 md:grid-cols-2">
            <div class="synthr-surface p-6">
              <h3 class="text-xl">${name}</h3>
              <p class="mt-4 leading-7" style="color:${design.palette.muted}">${address}${city ? `, ${city}` : ''}</p>
              ${neighborhood ? `<p class="mt-2 leading-7" style="color:${design.palette.muted}">Neighborhood: ${neighborhood}</p>` : ''}
              ${parking ? `<p class="mt-2 leading-7" style="color:${design.palette.muted}">Parking: ${parking}</p>` : ''}
            </div>
            <div class="synthr-surface p-6">
              <p>Phone: <a href="tel:${phone}" style="color:${design.palette.accentStrong}">${phone}</a></p>
              <p class="mt-3">Email: <a href="mailto:${email}" style="color:${design.palette.accentStrong}">${email}</a></p>
              ${
                payload.socialLinks && Object.values(payload.socialLinks).some(Boolean)
                  ? `<div class="mt-6 flex flex-wrap gap-3 text-sm">
                      ${payload.socialLinks.instagram ? `<a href="https://instagram.com/${payload.socialLinks.instagram}">Instagram</a>` : ''}
                      ${payload.socialLinks.tiktok ? `<a href="https://tiktok.com/@${payload.socialLinks.tiktok}">TikTok</a>` : ''}
                      ${payload.socialLinks.googleReviews ? `<a href="${payload.socialLinks.googleReviews}">Google Reviews</a>` : ''}
                      ${payload.socialLinks.yelp ? `<a href="${payload.socialLinks.yelp}">Yelp</a>` : ''}
                    </div>`
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const sectionMarkup: Record<string, string> = {
    about: renderAbout(),
    menu: renderMenu(),
    experience: renderExperience(),
    hours: renderHours(),
    order: renderOrder(),
    reserve: renderReserve(),
    contact: renderContact(),
  };

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${name} | ${cuisineType}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body style="background:${design.palette.canvas}; color:${design.palette.ink}">
    ${renderHero()}
    <main>
      ${design.layout.sectionOrder.map((key) => sectionMarkup[key] || '').join('\n')}
    </main>
    <footer class="py-12 synthr-dark-surface" style="background:${design.palette.footer}">
      <div class="max-w-7xl mx-auto ${design.spacing.container}">
        <div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p class="synthr-eyebrow" style="color:rgba(255,255,255,0.54)">Footer</p>
            <h3 class="mt-4 text-3xl text-white">${name}</h3>
            <p class="mt-4 max-w-xl text-white/68">${summary}</p>
          </div>
          <div class="text-sm text-white/60 md:text-right">
            <p>${address}${city ? `, ${city}` : ''}</p>
            <p class="mt-2">${phone}${email ? ` · ${email}` : ''}</p>
            <p class="mt-5">© ${new Date().getFullYear()} ${name}</p>
          </div>
        </div>
      </div>
    </footer>
  </body>
</html>`;
};

const genericPhrases = [
  /welcome to our restaurant/gi,
  /unforgettable dining experience/gi,
  /crafted with care/gi,
  /something for everyone/gi,
  /taste the difference/gi,
];

const buildVisualDirection = (payload: GenerationPayload) => {
  const design = getDesignSystem(payload);
  const directives: string[] = [
    `Design system variant: ${design.variant}.`,
    `Hero variant: ${design.hero.variant}.`,
    `Menu layout: ${design.menu.variant}.`,
    `Navigation pattern: ${design.layout.navPattern}.`,
    `Image treatment: ${design.layout.imageTreatment}.`,
    `Section rhythm: ${design.layout.sectionOrder.join(' -> ')}.`,
    'Make the site feel expensive, restaurant-specific, and hand-shaped rather than like a default Tailwind landing page.',
    'Use stronger composition: asymmetric sections, mixed content density, and at least one large image-led moment.',
    'Avoid repeating identical card grids from section to section.',
    'Use cleaner editorial pacing with larger headlines, quieter supporting copy, and more deliberate whitespace.',
    'The menu should feel designed, not dumped into generic cards.',
    'The nav and footer should feel custom to the chosen direction, not like a generic SaaS header.',
    'Use soft dividers, nuanced shadows, and layered surfaces only where they actually help.',
    'Do not over-box every section.',
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
  if (html.length < 700) issues.push('too-short');
  if (!/<body[^>]*>/i.test(html)) issues.push('missing-body');
  if (!/<nav[^>]*>/i.test(html) && !/<header[^>]*>/i.test(html)) issues.push('missing-navigation');
  if (!/<section[^>]*>/i.test(html)) issues.push('missing-sections');
  if (!/id=["']home["']/i.test(html)) issues.push('missing-home');
  if (!/id=["']about["']/i.test(html)) issues.push('missing-about');
  if (!/id=["']menu["']/i.test(html)) issues.push('missing-menu');
  if (!/id=["']hours["']/i.test(html)) issues.push('missing-hours');
  if (!/id=["']order["']/i.test(html)) issues.push('missing-order');
  if (!/id=["']reserve["']/i.test(html)) issues.push('missing-reserve');
  if (!/id=["']contact["']/i.test(html)) issues.push('missing-contact');
  const h1Matches = html.match(/<h1\b/gi) || [];
  if (h1Matches.length === 0) issues.push('missing-h1');
  if (h1Matches.length > 1) issues.push('multiple-h1');
  if (!/(Order Now|Reserve|Book Now|View Menu)/i.test(html)) issues.push('weak-cta');
  if (/lorem ipsum|placeholder/gi.test(html)) issues.push('placeholder-copy');
  const genericHits = genericPhrases.reduce((count, regex) => count + ((html.match(regex) || []).length), 0);
  if (genericHits >= 3) issues.push('generic-copy');
  return issues;
};

const getFatalIssues = (issues: string[]) =>
  issues.filter((issue) =>
    ['too-short', 'missing-body', 'missing-navigation', 'missing-sections', 'missing-h1'].includes(issue)
  );

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
- Do not redesign the whole site.
- Do not remove working sections unless the user asked.
- If the request references an uploaded image, use it directly where requested.
- Keep internal navigation working with on-page anchors.
- Never use relative page routes, root paths, or .html files for navigation.
- Keep text readable against every background.
- Preserve the existing theme direction and layout character unless the user explicitly asks to redesign them.

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
- Use only the provided menu items.
- Use only the provided image asset URLs when adding images.
- Do not invent, fetch, or hallucinate image URLs.
- Use semantic HTML.
- Use Tailwind CDN.
- Internal navigation must use valid in-page anchors only.
- Header navigation must use only in-page anchors like #home, #about, #menu, #hours, #order, #reserve, and #contact.
- Never use /about, /menu, index.html, or full-site URLs for navigation.
- The site must be mobile responsive.
- Keep text readable against every background.

Art direction:
- Style: ${style || 'Modern'}
- Tone: ${tone || 'Warm and welcoming'}
- Layout variant: ${design.variant}
- Hero variant: ${design.hero.variant}
- Menu layout: ${design.menu.variant}
- Navigation pattern: ${design.layout.navPattern}
- Image treatment: ${design.layout.imageTreatment}
- Section sequence target: ${design.layout.sectionOrder.join(' -> ')}
- Create a visually striking hero with premium typography and better image composition.
- Use cleaner, more editorial section layouts with stronger hierarchy and spacing.
- Use less repetitive card-grid structure and more intentional mixed-density composition.
- Let the site feel like a high-end restaurant website, not a generic SaaS template.
- Use layered surfaces, soft shadows, subtle dividers, and refined CTA hierarchy.
- Use asymmetric or split layouts where appropriate.
- Include at least one large image-led section that feels premium.
- Use the provided image assets intentionally: one strong hero image and a few supporting images with varied aspect ratios.
- Give the menu a more designed presentation with clear pricing and spacing.
- Desktop should feel polished and expansive, while mobile should collapse cleanly.
- Use tasteful microinteractions only if they can be expressed in simple CSS and do not harm readability.
- Keep copy short, specific, and restaurant-facing, not startup-marketing language.
- Do not create duplicate sections.

Visual direction:
${buildVisualDirection(payload)}`;
};

export const finalizeGeneratedHtml = (payload: GenerationPayload, rawHtml: string): { html: string; meta: GenerationMeta } => {
  const hasEditContext = Boolean(payload.customInstruction && payload.existingHtml);
  const sections = buildSections(payload);

  let cleanHtml = rawHtml || '<html><body>Error generating preview.</body></html>';
  if (cleanHtml.includes('```html')) cleanHtml = cleanHtml.replace(/```html\n?/g, '').replace(/```\n?/g, '');
  if (cleanHtml.includes('```')) cleanHtml = cleanHtml.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '');
  cleanHtml = ensureHtmlDocument(cleanHtml.trim());

  cleanHtml = ensureTailwindCdn(cleanHtml);
  cleanHtml = ensureSeoMeta(cleanHtml, payload);
  cleanHtml = ensureDesignSafetyStyles(cleanHtml, payload.style, payload.cuisineType, payload.tone);
  cleanHtml = normalizeOnPageLinks(cleanHtml);
  cleanHtml = ensureRequiredAnchorTargets(cleanHtml);
  cleanHtml = ensureSmoothScrollScript(cleanHtml);
  cleanHtml = injectFallbackGallery(cleanHtml, sections.imageAssets);
  cleanHtml = applyHeroBackground(cleanHtml, payload.assistantImage, payload.customInstruction);

  const issues = collectHtmlIssues(cleanHtml);
  const fatalIssues = getFatalIssues(issues);
  let source: GenerationMeta['source'] = 'model';

  if (fatalIssues.length > 0) {
    if (hasEditContext && typeof payload.existingHtml === 'string' && payload.existingHtml.length > 0) {
      cleanHtml = payload.existingHtml;
      source = 'existing';
    } else {
      cleanHtml = buildFallbackHtml(payload);
      source = 'fallback';
    }
  }

  return {
    html: cleanHtml,
    meta: {
      source,
      validationIssues: issues,
    },
  };
};
