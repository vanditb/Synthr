// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import {
  buildGenerationPrompt as buildSharedGenerationPrompt,
  finalizeGeneratedHtml as finalizeSharedGeneratedHtml,
  GENERATION_SYSTEM_PROMPT,
} from "./lib/generation";
import { canUseBackupGroq, generateWithBackupGroq } from "./lib/backupModel";

dotenv.config();

console.log("⚡ Starting server");

const app = express();
app.use(cors());
// Allow larger payloads for base64 images in the request body.
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

type ImageAsset = {
  role: 'hero' | 'interior' | 'food' | 'dish' | 'dessert' | 'bar' | 'logo';
  url: string;
  alt: string;
};

const cuisineImagePools: Record<string, Record<ImageAsset['role'], ImageAsset[]>> = {
  italian: {
    hero: [
      { role: 'hero', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80', alt: 'Italian restaurant interior' },
      { role: 'hero', url: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1600&q=80', alt: 'Cozy trattoria ambiance' }
    ],
    interior: [
      { role: 'interior', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80', alt: 'Elegant dining room' },
      { role: 'interior', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1600&q=80', alt: 'Modern restaurant seating' }
    ],
    food: [
      { role: 'food', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80', alt: 'Italian pasta dish' },
      { role: 'food', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80', alt: 'Pizza with fresh ingredients' }
    ],
    dish: [
      { role: 'dish', url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1600&q=80', alt: 'Handmade pasta' },
      { role: 'dish', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80', alt: 'Signature pasta plate' }
    ],
    dessert: [
      { role: 'dessert', url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1600&q=80', alt: 'Tiramisu dessert' },
      { role: 'dessert', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1600&q=80', alt: 'Chocolate dessert' }
    ],
    bar: [
      { role: 'bar', url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80', alt: 'Cocktail bar' },
      { role: 'bar', url: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1600&q=80', alt: 'Wine and cocktails' }
    ],
    logo: []
  },
  japanese: {
    hero: [
      { role: 'hero', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80', alt: 'Japanese cuisine spread' },
      { role: 'hero', url: 'https://images.unsplash.com/photo-1542528180-1c2803fa048c?auto=format&fit=crop&w=1600&q=80', alt: 'Minimalist Japanese dining' }
    ],
    interior: [
      { role: 'interior', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1600&q=80', alt: 'Modern restaurant interior' },
      { role: 'interior', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80', alt: 'Warm dining room lighting' }
    ],
    food: [
      { role: 'food', url: 'https://images.unsplash.com/photo-1546069901-5f1a4c5b4b10?auto=format&fit=crop&w=1600&q=80', alt: 'Sushi assortment' },
      { role: 'food', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80', alt: 'Ramen bowl' }
    ],
    dish: [
      { role: 'dish', url: 'https://images.unsplash.com/photo-1546069901-5f1a4c5b4b10?auto=format&fit=crop&w=1600&q=80', alt: 'Sushi plate' },
      { role: 'dish', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80', alt: 'Signature Japanese dish' }
    ],
    dessert: [
      { role: 'dessert', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1600&q=80', alt: 'Sweet dessert' },
      { role: 'dessert', url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1600&q=80', alt: 'Dessert plate' }
    ],
    bar: [
      { role: 'bar', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80', alt: 'Cocktail bar' },
      { role: 'bar', url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80', alt: 'Bar drinks' }
    ],
    logo: []
  }
};

const defaultStockImagePool: Record<ImageAsset['role'], ImageAsset[]> = {
  hero: [
    { role: 'hero', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80', alt: 'Elegant restaurant dining room' },
    { role: 'hero', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80', alt: 'Beautifully plated dishes on a table' }
  ],
  interior: [
    { role: 'interior', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80', alt: 'Warm, inviting restaurant interior' },
    { role: 'interior', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1600&q=80', alt: 'Modern restaurant seating' }
  ],
  food: [
    { role: 'food', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80', alt: 'Plated signature entree' },
    { role: 'food', url: 'https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=1600&q=80', alt: 'Seasonal plate with fresh ingredients' }
  ],
  dish: [
    { role: 'dish', url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1600&q=80', alt: 'Chef-prepared seasonal dish' },
    { role: 'dish', url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1600&q=80', alt: 'Fresh seafood plate' }
  ],
  dessert: [
    { role: 'dessert', url: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1600&q=80', alt: 'Dessert with fresh berries' },
    { role: 'dessert', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1600&q=80', alt: 'Chocolate dessert' }
  ],
  bar: [
    { role: 'bar', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80', alt: 'Cocktails at the bar' },
    { role: 'bar', url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80', alt: 'Bartender preparing drinks' }
  ],
  logo: []
};

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

type ImageQuery = { role: ImageAsset['role']; query: string };

const sanitizeQuery = (value: string): string =>
  value.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();

const buildSearchQueries = (
  cuisineType: string | undefined,
  menu: { name?: string; description?: string }[] | undefined,
  style?: string
): ImageQuery[] => {
  const cuisine = sanitizeQuery(cuisineType || 'restaurant');
  const styleHint = sanitizeQuery(style || '');
  const menuItems = (menu || [])
    .map((item) => sanitizeQuery(item?.name || ''))
    .filter(Boolean)
    .slice(0, 4);

  const queries: ImageQuery[] = [
    { role: 'hero', query: `${cuisine} restaurant hero ${styleHint} interior` },
    { role: 'interior', query: `${cuisine} restaurant interior warm lighting` },
    { role: 'interior', query: `${cuisine} chef kitchen plating` },
    { role: 'bar', query: `${cuisine} cocktail bar atmosphere` },
    { role: 'dessert', query: `${cuisine} dessert plated` }
  ];

  menuItems.forEach((item, idx) => {
    const role: ImageAsset['role'] = idx % 2 === 0 ? 'food' : 'dish';
    queries.push({ role, query: `${cuisine} ${item} food photography` });
  });

  return queries;
};

const searchPexels = async (query: string, perPage: number): Promise<ImageAsset[]> => {
  if (!PEXELS_API_KEY) return [];
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.photos || [])
    .map((item: any) => ({
      role: 'food',
      url: item?.src?.large2x || item?.src?.large,
      alt: item?.alt || query
    }))
    .filter((img: ImageAsset) => Boolean(img.url));
};

const collectApiImages = async (queries: ImageQuery[]): Promise<ImageAsset[]> => {
  const results: ImageAsset[] = [];
  const seen = new Set<string>();
  for (const query of queries) {
    let candidates: ImageAsset[] = [];
    try {
      candidates = await searchPexels(query.query, 6);
    } catch (_err) {
      candidates = [];
    }
    const picked = candidates.find((img) => img.url && !seen.has(img.url));
    if (picked?.url) {
      seen.add(picked.url);
      results.push({ ...picked, role: query.role });
    }
  }
  return results;
};

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

const pickDeterministic = <T,>(items: T[], seed: number): T => items[Math.abs(seed) % items.length];

const formatMenuPrice = (price: unknown): string => {
  if (typeof price === 'number' && Number.isFinite(price)) {
    return `$${price.toFixed(2)}`;
  }

  const trimmed = String(price ?? '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('$') ? trimmed : `$${trimmed}`;
};

const hasCuisinePool = (cuisineType?: string): boolean => {
  const key = (cuisineType || '').toLowerCase();
  return key.includes('italian') || key.includes('japanese');
};

const getCuisinePool = (cuisineType: string | undefined): Record<ImageAsset['role'], ImageAsset[]> => {
  const key = (cuisineType || '').toLowerCase();
  if (key.includes('italian')) return cuisineImagePools.italian;
  if (key.includes('japanese')) return cuisineImagePools.japanese;
  return defaultStockImagePool;
};

const buildImageAssets = async (
  images: { type: 'interior' | 'food' | 'logo'; data: string }[] | undefined,
  useStockImages: boolean,
  cuisineType?: string,
  name?: string,
  menu?: { name?: string; description?: string }[],
  style?: string
): Promise<ImageAsset[]> => {
  const assets: ImageAsset[] = [];
  const seen = new Set<string>();

  if (images && images.length > 0) {
    for (const img of images) {
      if (!img?.data) continue;
      if (img.type === 'logo' && !seen.has(img.data)) {
        seen.add(img.data);
        assets.push({ role: 'logo', url: img.data, alt: 'Restaurant logo' });
      }
      if (img.type === 'interior' && !seen.has(img.data)) {
        seen.add(img.data);
        assets.push({ role: 'interior', url: img.data, alt: 'Restaurant interior' });
      }
      if (img.type === 'food' && !seen.has(img.data)) {
        seen.add(img.data);
        assets.push({ role: 'food', url: img.data, alt: 'Signature dish' });
      }
    }
  }

  if (useStockImages || assets.length < 6) {
    const poolByCuisine = getCuisinePool(cuisineType);
    const queries = buildSearchQueries(cuisineType, menu, style);
    const apiImages = await collectApiImages(queries);
    apiImages.forEach((img) => {
      if (img.url && !seen.has(img.url)) {
        seen.add(img.url);
        assets.push(img);
      }
    });

    const seed = hashString(`${name || ''}:${cuisineType || ''}:${style || ''}`);
    const flattenedPoolAll = (Object.values(poolByCuisine) as ImageAsset[][]).flat();
    const shouldRestrictFood = Boolean(cuisineType && !hasCuisinePool(cuisineType));
    const flattenedPool = shouldRestrictFood
      ? flattenedPoolAll.filter((img) => ['hero', 'interior', 'bar', 'logo'].includes(img.role))
      : flattenedPoolAll;
    let cursor = 0;
    while (assets.length < 8 && flattenedPool.length > 0) {
      const fallback = pickDeterministic(flattenedPool, seed + cursor);
      cursor += 1;
      if (fallback?.url && !seen.has(fallback.url)) {
        seen.add(fallback.url);
        assets.push(fallback);
      }
    }
  }

  return assets;
};

const ensureTailwindCdn = (html: string): string => {
  if (/cdn\\.tailwindcss\\.com/i.test(html)) return html;
  const cdnTag = '<script src=\"https://cdn.tailwindcss.com\"></script>';
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (match) => `${match}\n  ${cdnTag}`);
  }
  return html.replace(/<html[^>]*>/i, (match) => `${match}\n<head>\n  ${cdnTag}\n</head>`);
};

const getThemePalette = (cuisineType?: string, style?: string, tone?: string) => {
  const cuisine = (cuisineType || '').toLowerCase();
  const styleKey = (style || '').toLowerCase();
  const toneKey = (tone || '').toLowerCase();

  if (cuisine.includes('indian')) {
    return { body: '#fff8f1', surface: '#fff1e4', accent: '#c2410c', accentSoft: '#fed7aa', ink: '#431407' };
  }
  if (cuisine.includes('italian')) {
    return { body: '#fffaf5', surface: '#fef2f2', accent: '#b91c1c', accentSoft: '#fecaca', ink: '#3f1d1d' };
  }
  if (cuisine.includes('japanese')) {
    return { body: '#f8fafc', surface: '#eef2ff', accent: '#1d4ed8', accentSoft: '#bfdbfe', ink: '#172554' };
  }
  if (styleKey.includes('luxury') || toneKey.includes('upscale')) {
    return { body: '#fcfaf7', surface: '#f5efe5', accent: '#9a6700', accentSoft: '#f5d48f', ink: '#2b2115' };
  }
  if (styleKey.includes('casual')) {
    return { body: '#fffaf0', surface: '#ffedd5', accent: '#c2410c', accentSoft: '#fdba74', ink: '#431407' };
  }
  return { body: '#fffaf5', surface: '#f8fafc', accent: '#c2410c', accentSoft: '#fed7aa', ink: '#1f2937' };
};

const ensureDesignSafetyStyles = (html: string, style?: string, cuisineType?: string, tone?: string): string => {
  if (/<style[^>]*data-synthr-safety/i.test(html)) return html;

  const styleKey = (style || '').toLowerCase();
  const palette = getThemePalette(cuisineType, style, tone);
  let fontLink = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap';
  let bodyFont = "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";
  let headingFont = "'Playfair Display', 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";

  if (styleKey.includes('modern')) {
    fontLink = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap';
    bodyFont = "'Sora', system-ui, -apple-system, 'Segoe UI', sans-serif";
    headingFont = "'Space Grotesk', 'Sora', system-ui, -apple-system, 'Segoe UI', sans-serif";
  } else if (styleKey.includes('casual')) {
    fontLink = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Nunito:wght@300;400;600;700&display=swap';
    bodyFont = "'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif";
    headingFont = "'Poppins', 'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif";
  } else if (styleKey.includes('luxury')) {
    fontLink = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap';
    bodyFont = "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";
    headingFont = "'Cormorant Garamond', 'Manrope', serif";
  }

  const fontTags = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontLink}" rel="stylesheet">`;

  const viewportTag = /<meta[^>]+name=["']viewport["']/i.test(html)
    ? ''
    : '\n  <meta name="viewport" content="width=device-width, initial-scale=1" />';

  const safetyStyle = `
  <style data-synthr-safety>
    :root {
      color-scheme: light;
      --synthr-body: ${palette.body};
      --synthr-surface: ${palette.surface};
      --synthr-accent: ${palette.accent};
      --synthr-accent-soft: ${palette.accentSoft};
      --synthr-ink: ${palette.ink};
    }
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: ${bodyFont}; color: var(--synthr-ink); background-color: var(--synthr-body); }
    h1, h2, h3, h4, h5, h6 { font-family: ${headingFont}; letter-spacing: -0.02em; }
    img, video { max-width: 100%; height: auto; }
    body { overflow-x: hidden; }
    section:not([style*="background-image"]) { position: relative; }
    section:not([style*="background-image"]):nth-of-type(odd) { background: linear-gradient(180deg, var(--synthr-surface), #ffffff) !important; }
    section:not([style*="background-image"]):nth-of-type(even) { background: #ffffff !important; }
    section:not([style*="background-image"]) h1,
    section:not([style*="background-image"]) h2,
    section:not([style*="background-image"]) h3,
    section:not([style*="background-image"]) h4,
    section:not([style*="background-image"]) h5,
    section:not([style*="background-image"]) h6,
    section:not([style*="background-image"]) p,
    section:not([style*="background-image"]) li,
    section:not([style*="background-image"]) span,
    section:not([style*="background-image"]) label { color: var(--synthr-ink) !important; text-shadow: none !important; }
    .bg-white, .bg-slate-50, .bg-orange-50, .bg-amber-50 { color: var(--synthr-ink) !important; }
    .bg-white h1, .bg-white h2, .bg-white h3, .bg-white h4, .bg-white p, .bg-white span,
    .bg-slate-50 h1, .bg-slate-50 h2, .bg-slate-50 h3, .bg-slate-50 h4, .bg-slate-50 p, .bg-slate-50 span,
    .bg-orange-50 h1, .bg-orange-50 h2, .bg-orange-50 h3, .bg-orange-50 h4, .bg-orange-50 p, .bg-orange-50 span,
    .bg-amber-50 h1, .bg-amber-50 h2, .bg-amber-50 h3, .bg-amber-50 h4, .bg-amber-50 p, .bg-amber-50 span { color: var(--synthr-ink) !important; text-shadow: none !important; }
    header { position: relative; }
    header nav {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(8px);
      background: rgba(15, 23, 42, 0.6);
    }
    header::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      pointer-events: none;
    }
    header > * { position: relative; }
    header h1, header h2, header p, header a, header span, header nav {
      color: #f8fafc;
      text-shadow: 0 2px 16px rgba(15, 23, 42, 0.55);
    }
    *[style*="background-image"] { position: relative; color: #f8fafc; }
    *[style*="background-image"]::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      pointer-events: none;
    }
    *[style*="background-image"] > * { position: relative; }
    a, button { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; max-width: 100%; }
    nav { flex-wrap: wrap; row-gap: 0.5rem; }
    a:not([class*="bg-"]) { color: var(--synthr-accent); }
    button, a[class*="bg-amber"], a[class*="bg-orange"] { box-shadow: 0 10px 30px -20px var(--synthr-accent); }
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
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      link.addEventListener('click', (e) => {
        const target = document.querySelector(href);
        if (!target) {
          const fallback = document.querySelector('#home') || document.body;
          e.preventDefault();
          fallback.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
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
    const clean = value.trim().replace(/^#/, '');
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

const enforceMenuSection = (html: string, menuHTML: string): string => {
  if (!menuHTML || !menuHTML.trim()) return html;
  const section = `
  <section id="menu" class="py-16 bg-white">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-slate-900 mb-8">Menu</h2>
      <div class="space-y-10">
        ${menuHTML}
      </div>
    </div>
  </section>
  `;

  const menuSectionMatch = html.match(/<section[^>]*id=["']menu["'][^>]*>[\s\S]*?<\/section>/i);
  if (menuSectionMatch) {
    return html.replace(menuSectionMatch[0], section);
  }
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${section}\n</body>`);
  }
  return `${html}\n${section}`;
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
      updatedAttrs = updatedAttrs.replace(
        /class=["']([^"']*)["']/i,
        (_match, cls) => `class="${cls} bg-cover bg-center"`
      );
    } else {
      updatedAttrs = `${updatedAttrs} class="bg-cover bg-center"`;
    }

    if (/style=/.test(updatedAttrs)) {
      updatedAttrs = updatedAttrs.replace(
        /style=["']([^"']*)["']/i,
        (_match, style) =>
          `style="${style}; background-image: url('${imageUrl}'); background-size: cover; background-position: center; background-color: rgba(0,0,0,0.5); background-blend-mode: multiply;"`
      );
    } else {
      updatedAttrs = `${updatedAttrs} style="background-image: url('${imageUrl}'); background-size: cover; background-position: center; background-color: rgba(0,0,0,0.5); background-blend-mode: multiply;"`;
    }

    return `<${tag}${updatedAttrs}>`;
  };

  const homeMatch = html.match(/<(section|header|div)([^>]*\sid=["']home["'][^>]*)>/i);
  if (homeMatch) {
    return html.replace(homeMatch[0], applyToTag(homeMatch[1], homeMatch[2]));
  }

  const headerMatch = html.match(/<(header)([^>]*)>/i);
  if (headerMatch) {
    return html.replace(headerMatch[0], applyToTag(headerMatch[1], headerMatch[2]));
  }

  return html;
};

const injectFallbackGallery = (html: string, assets: ImageAsset[]): string => {
  if (assets.length === 0) return html;
  if (/<img\s/i.test(html) || /background-image\s*:/i.test(html)) return html;

  const gallery = `
  <section class=\"py-16 bg-white\">
    <div class=\"max-w-6xl mx-auto px-4\">
      <h2 class=\"text-3xl font-bold text-slate-900 mb-8\">Gallery</h2>
      <div class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6\">
        ${assets.slice(0, 6).map((img) => `
          <div class=\"overflow-hidden rounded-2xl shadow\">
            <img src=\"${img.url}\" alt=\"${img.alt}\" class=\"w-full h-64 object-cover\" loading=\"lazy\" />
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;

  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${gallery}\n</body>`);
  }
  return `${html}\n${gallery}`;
};

const buildFallbackHtml = (opts: {
  name: string;
  cuisineType: string;
  priceRange: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  neighborhood?: string;
  parking?: string;
  shortDescription?: string;
  description?: string;
  menuHTML: string;
  hoursHTML: string;
  orderingSection: string;
  reservationsSection: string;
  aboutSection: string;
  cateringSection: string;
  eventsSection: string;
  socialHTML: string;
  googleMapsLink?: string;
  imageAssets: ImageAsset[];
}): string => {
  const {
    name,
    cuisineType,
    priceRange,
    tagline,
    address,
    city,
    phone,
    email,
    neighborhood,
    parking,
    shortDescription,
    description,
    menuHTML,
    hoursHTML,
    orderingSection,
    reservationsSection,
    aboutSection,
    cateringSection,
    eventsSection,
    socialHTML,
    googleMapsLink,
    imageAssets
  } = opts;

  const heroImage = imageAssets.find((img) => img.role === 'hero')?.url || imageAssets[0]?.url || '';
  const heroAlt = imageAssets.find((img) => img.role === 'hero')?.alt || 'Restaurant hero image';
  const galleryImages = imageAssets.filter((img) => img.role !== 'logo');
  const safeImages = galleryImages.length > 0 ? galleryImages : imageAssets;
  const getImage = (idx: number, fallbackAlt: string) =>
    safeImages[idx] || safeImages[0] || { url: heroImage, alt: fallbackAlt };
  const primaryButton = 'px-6 py-3 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-all duration-300 shadow-lg';
  const secondaryButton = 'px-6 py-3 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition-all duration-300';
  const summary = shortDescription || description || 'A welcoming neighborhood restaurant serving dishes made with fresh, seasonal ingredients.';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${name} | ${cuisineType}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900">
    <header id="home" class="relative">
      <div class="absolute inset-0">
        ${heroImage ? `<img src="${heroImage}" alt="${heroAlt}" class="w-full h-full object-cover" />` : ''}
        <div class="absolute inset-0 bg-black/55"></div>
      </div>
      <div class="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <nav class="flex items-center justify-between text-white sticky top-0 z-40 bg-slate-900/60 backdrop-blur border-b border-white/10 px-4 py-3 rounded-2xl shadow-lg">
          <div class="text-2xl font-semibold tracking-wide">${name}</div>
          <div class="hidden md:flex items-center gap-6 text-sm uppercase tracking-wider">
            <a href="#home" class="hover:text-amber-200">Home</a>
            <a href="#about" class="hover:text-amber-200">About</a>
            <a href="#menu" class="hover:text-amber-200">Menu</a>
            <a href="#featured" class="hover:text-amber-200">Featured</a>
            <a href="#experience" class="hover:text-amber-200">Experience</a>
            <a href="#hours" class="hover:text-amber-200">Hours</a>
            <a href="#order" class="hover:text-amber-200">Order</a>
            <a href="#reserve" class="hover:text-amber-200">Reserve</a>
            <a href="#contact" class="hover:text-amber-200">Contact</a>
          </div>
          <div class="flex items-center gap-3">
            <a href="#reserve" class="px-4 py-2 rounded-full border border-white/40 text-sm hover:bg-white/20 transition-all duration-300">Reserve</a>
            <a href="#order" class="px-4 py-2 rounded-full bg-amber-500 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition-all duration-300 shadow-lg">Order Now</a>
          </div>
        </nav>
        <div class="mt-20 max-w-2xl text-white">
          <p class="text-sm uppercase tracking-[0.3em] text-amber-200">${cuisineType} · ${priceRange}</p>
          <h1 class="text-5xl font-bold leading-tight mt-4">${tagline}</h1>
          <p class="mt-6 text-lg text-white/85">${summary}</p>
          <div class="mt-8 flex flex-wrap gap-4">
            <a href="#order" class="${primaryButton}">Order Online</a>
            <a href="#reserve" class="${secondaryButton}">Reserve a Table</a>
          </div>
        </div>
      </div>
    </header>

    <section id="about" class="py-16">
      <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <p class="text-sm uppercase tracking-[0.3em] text-amber-600">Our Story</p>
          <h2 class="text-3xl font-bold mt-3">${name}</h2>
          <p class="mt-4 text-slate-600 leading-relaxed">${summary}</p>
          <div class="mt-6 grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
            ${neighborhood ? `<div class="bg-slate-50 rounded-xl p-4">Neighborhood: ${neighborhood}</div>` : ''}
            ${parking ? `<div class="bg-slate-50 rounded-xl p-4">Parking: ${parking}</div>` : ''}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          ${[getImage(1, 'Restaurant interior'), getImage(2, 'Dining room'), getImage(3, 'Chef plating'), getImage(4, 'Signature dish')].map((img) => `
            <div class="overflow-hidden rounded-2xl shadow-lg">
              <img src="${img.url}" alt="${img.alt}" class="w-full h-56 object-cover" loading="lazy" />
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    ${aboutSection}

    <section id="menu" class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex items-center justify-between gap-6 mb-8">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-amber-600">Menu</p>
            <h2 class="text-3xl font-bold mt-2">Seasonal Favorites</h2>
          </div>
          <div class="hidden md:block text-sm text-slate-500">Ask about chef specials and fresh catches.</div>
        </div>
        <div class="grid lg:grid-cols-2 gap-8">
          ${menuHTML || '<div class="bg-slate-50 rounded-2xl p-6 shadow-lg"><p class="text-slate-600">Menu details coming soon.</p></div>'}
        </div>
      </div>
    </section>

    <section id="featured" class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex items-center justify-between gap-6 mb-8">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-amber-600">Featured</p>
            <h2 class="text-3xl font-bold mt-2">Signature Dishes</h2>
          </div>
          <div class="text-sm text-slate-500">Chef-driven selections crafted daily.</div>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          ${[getImage(5, 'Featured dish'), getImage(6, 'Signature plate'), getImage(7, 'Chef special')].map((img, idx) => `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="grid grid-rows-[1fr_auto] h-full">
                <img src="${img.url}" alt="${img.alt}" class="w-full h-48 object-cover" loading="lazy" />
                <div class="p-5">
                  <h3 class="text-xl font-semibold">Chef Special ${idx + 1}</h3>
                  <p class="mt-2 text-slate-600">Seasonal ingredients, plated with care and a modern twist.</p>
                  <button class="mt-4 w-full py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-all duration-300">Order This</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="experience" class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
        <div class="grid grid-cols-2 gap-4 order-2 lg:order-1">
          ${[getImage(8, 'Dining atmosphere'), getImage(9, 'Restaurant interior')].map((img) => `
            <div class="overflow-hidden rounded-2xl shadow-lg">
              <img src="${img.url}" alt="${img.alt}" class="w-full h-56 object-cover" loading="lazy" />
            </div>
          `).join('')}
        </div>
        <div class="order-1 lg:order-2 bg-white rounded-2xl shadow-lg p-8">
          <p class="text-sm uppercase tracking-[0.3em] text-amber-600">Experience</p>
          <h2 class="text-3xl font-bold mt-2">Warm, memorable dining</h2>
          <p class="mt-4 text-slate-600">From the first sip to the final bite, we curate an atmosphere that feels elevated yet welcoming.</p>
          <div class="mt-6 grid gap-4">
            <div class="bg-slate-50 rounded-xl p-4 shadow">
              <p class="font-semibold">“Absolutely unforgettable.”</p>
              <p class="text-sm text-slate-600 mt-1">The ambiance and flavors were perfectly balanced.</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-4 shadow">
              <p class="font-semibold">“Best meal in the neighborhood.”</p>
              <p class="text-sm text-slate-600 mt-1">Service, plating, and taste were all top-tier.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="hours" class="py-16">
      <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <p class="text-sm uppercase tracking-[0.3em] text-amber-600">Hours</p>
          <h2 class="text-3xl font-bold mt-2">Visit Us</h2>
          <div class="mt-6 space-y-2">${hoursHTML || '<div class="bg-slate-50 rounded-xl p-4 text-slate-600">Hours available upon request.</div>'}</div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <p class="text-sm uppercase tracking-[0.3em] text-amber-600">Location</p>
          <h3 class="text-2xl font-bold mt-2">${address}, ${city}</h3>
          <p class="mt-4 text-slate-600">${phone}</p>
          <p class="text-slate-600">${email}</p>
          ${googleMapsLink ? `<a href="${googleMapsLink}" class="inline-block mt-6 text-amber-700 font-semibold">View on Google Maps</a>` : ''}
        </div>
      </div>
    </section>

    <section id="order" class="py-16">
      <div class="max-w-6xl mx-auto px-6">
        ${orderingSection || `
        <div class="p-8 bg-amber-50 rounded-2xl">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 class="text-2xl font-bold mb-2">Order Online</h3>
              <p class="text-slate-600">Choose your favorites and place a mock order.</p>
            </div>
            <a href="tel:${phone}" class="px-6 py-3 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-all duration-300 shadow-lg">Call ${phone}</a>
          </div>
          <div class="mt-8 grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl p-5 shadow">
              <p class="text-sm uppercase tracking-wider text-slate-500 mb-4">Popular Items</p>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-slate-700">House Special</span>
                  <button class="px-3 py-1 rounded-full bg-slate-100 text-sm hover:bg-slate-200 transition-all duration-300">Add</button>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-700">Chef’s Pasta</span>
                  <button class="px-3 py-1 rounded-full bg-slate-100 text-sm hover:bg-slate-200 transition-all duration-300">Add</button>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-700">Seasonal Salad</span>
                  <button class="px-3 py-1 rounded-full bg-slate-100 text-sm hover:bg-slate-200 transition-all duration-300">Add</button>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl p-5 shadow">
              <p class="text-sm uppercase tracking-wider text-slate-500 mb-4">Order Details</p>
              <div class="grid gap-3">
                <input class="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Name" />
                <input class="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Phone or Email" />
                <select class="w-full border border-slate-200 rounded-lg px-3 py-2">
                  <option>Pickup</option>
                  <option>Delivery</option>
                </select>
                <button class="w-full py-2 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-all duration-300 shadow-lg">Place Mock Order</button>
              </div>
            </div>
          </div>
        </div>
        `}
      </div>
    </section>

    <section id="reserve" class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        ${reservationsSection || `
        <div class="p-8 bg-slate-100 rounded-2xl">
          <h3 class="text-2xl font-bold mb-2">Reserve a Table</h3>
          <p class="text-slate-600 mb-6">Pick a date and time to reserve your table.</p>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl p-4 shadow">
              <div class="text-sm uppercase tracking-wider text-slate-500 mb-3">Select Date</div>
              <div class="grid grid-cols-7 gap-2 text-center text-xs text-slate-600">
                ${['S','M','T','W','T','F','S'].map(d => `<div class="font-semibold text-slate-500">${d}</div>`).join('')}
                ${Array.from({ length: 28 }).map((_, i) => `<div class="py-2 rounded-lg ${i === 10 ? 'bg-amber-500 text-white' : 'bg-slate-100'}">${i + 1}</div>`).join('')}
              </div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow">
              <div class="text-sm uppercase tracking-wider text-slate-500 mb-3">Select Time</div>
              <div class="grid grid-cols-3 gap-2">
                ${['5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'].map(t => `<button class="py-2 rounded-lg border border-slate-200 text-sm hover:bg-amber-50 transition-all duration-300">${t}</button>`).join('')}
              </div>
              <div class="mt-4 grid gap-3">
                <select class="w-full border border-slate-200 rounded-lg px-3 py-2">
                  <option>Party size</option>
                  ${[1,2,3,4,5,6,7,8].map(n => `<option>${n} guests</option>`).join('')}
                </select>
                <input class="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Name" />
                <input class="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Phone or Email" />
                <button class="w-full py-2 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-all duration-300 shadow-lg">Confirm Reservation</button>
              </div>
            </div>
          </div>
        </div>
        `}
      </div>
    </section>

    ${eventsSection}
    ${cateringSection}

    <section id="contact" class="py-16">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <p class="text-sm uppercase tracking-[0.3em] text-amber-600">Contact</p>
        <h2 class="text-3xl font-bold mt-2">Get in touch</h2>
        <p class="mt-4 text-slate-600">Questions, catering, or special requests? We would love to hear from you.</p>
        <div class="mt-8 grid sm:grid-cols-2 gap-6 text-left">
          <div class="bg-white rounded-2xl p-6 shadow">
            <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Restaurant</p>
            <h3 class="text-xl font-semibold mt-2">${name}</h3>
            <p class="mt-3 text-slate-600">${address}, ${city}</p>
            ${neighborhood ? `<p class="text-slate-600">Neighborhood: ${neighborhood}</p>` : ''}
            ${parking ? `<p class="text-slate-600">Parking: ${parking}</p>` : ''}
          </div>
          <div class="bg-white rounded-2xl p-6 shadow">
            <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Contact</p>
            ${founderName ? `<p class="mt-2 text-slate-700">Owner: <span class="font-semibold">${founderName}</span></p>` : ''}
            <p class="mt-2 text-slate-700">Phone: <a href="tel:${phone}" class="text-amber-700 font-semibold">${phone}</a></p>
            <p class="text-slate-700">Email: <a href="mailto:${email}" class="text-amber-700 font-semibold">${email}</a></p>
          </div>
        </div>
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="tel:${phone}" class="px-6 py-3 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-all duration-300 shadow-lg">Call ${phone}</a>
          <a href="mailto:${email}" class="px-6 py-3 rounded-xl border border-amber-300 text-amber-700 font-semibold hover:bg-amber-50 transition-all duration-300">Email ${email}</a>
        </div>
      </div>
    </section>

    <footer class="py-10 bg-slate-900 text-slate-200">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h3 class="text-2xl font-semibold">${name}</h3>
        <p class="mt-2 text-slate-400">${address}, ${city}</p>
        <p class="text-slate-400">${phone} · ${email}</p>
        ${socialHTML}
        <p class="mt-6 text-xs text-slate-500">© ${new Date().getFullYear()} ${name}. All rights reserved.</p>
      </div>
    </footer>
    <script data-synthr-scroll>
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
          const target = document.querySelector(link.getAttribute('href'));
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    </script>
  </body>
</html>`;
};

// Initialize Groq AI
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is missing. Check your .env file.");
}

app.get("/", (_req: express.Request, res: express.Response) => {
  console.log("GET / called"); // logs when endpoint is hit
  res.send("✅ Server is alive");
});

app.get("/api/health", (_req: express.Request, res: express.Response) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// API endpoint for generating HTML
app.post("/api/generate", async (req: express.Request, res: express.Response) => {
  try {
    console.log('📨 Received /api/generate request');
    const {
      // Basic Info
      name,
      type,
      style,
      tone,
      cuisineType,
      priceRange,
      city,
      address,
      phone,
      email,
      tagline,
      hours,
      pages,
      description,
      brand,
      primaryCta,
      signatureDishes,
      services,
      ordering,
      domainPreference,
      advanced,
      
      // Services
      dineIn,
      takeout,
      delivery,
      
      // About
      shortDescription,
      fullStory,
      yearFounded,
      founderName,
      
      // Menu
      menu,
      menuSourceText,
      menuSourceImages,
      
      // Ordering & Reservations
      onlineOrdering,
      reservations,
      
      // Location
      googleMapsLink,
      parking,
      neighborhood,
      
      // Social
      socialLinks,
      
      // Events & Catering
      hostEvents,
      eventTypes,
      weeklySpecials,
      cateringAvailable,
      cateringEmail,
      privateEventCapacity,
      
      // Settings
      images,
      useStockImages,
      customInstruction,
      existingHtml,
      assistantImage
    } = req.body;

    // Build menu section HTML
    const menuByCategory: Record<string, any[]> = {};
    menu?.forEach((item: any) => {
      if (!menuByCategory[item.category]) {
        menuByCategory[item.category] = [];
      }
      menuByCategory[item.category].push(item);
    });

    const menuHTML = Object.entries(menuByCategory)
      .map(
        ([category, items]) => `
      <div class="bg-slate-50 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-slate-900">${category}</h3>
          <span class="text-xs uppercase tracking-[0.2em] text-amber-600">Chef’s Picks</span>
        </div>
        <div class="grid gap-4">
          ${(items as any[])
            .map(
              (item) => `
            <div class="flex items-start justify-between gap-4 bg-white rounded-xl p-4 shadow">
              <div class="flex-1">
                <h4 class="text-base font-semibold text-slate-900">${item.name}</h4>
                <p class="text-slate-600 text-sm mt-1">${item.description}</p>
              </div>
              <span class="text-base font-semibold text-amber-600">${formatMenuPrice(item.displayPrice ?? item.price)}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("");

    // Build hours section
    const hoursHTML = Object.entries(hours || {})
      .map(
        ([day, time]) => `
      <div class="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0">
        <span class="font-medium text-slate-700">${day}</span>
        <span class="text-slate-600">${time}</span>
      </div>
    `
      )
      .join("");

    // Build online ordering buttons
    let orderingSection = '';
    if (onlineOrdering?.acceptOrders) {
      const platformNames = onlineOrdering.platforms.map((p: string) => {
        if (p === 'doordash') return 'DoorDash';
        if (p === 'ubereats') return 'Uber Eats';
        return p.charAt(0).toUpperCase() + p.slice(1);
      }).join(', ');
      orderingSection = `
      <div class="py-8 border-t border-orange-100">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Order Online</h3>
        <p class="text-slate-600 mb-6">Available on: ${platformNames}</p>
        <a href="${onlineOrdering.customURL || '#order'}" class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700">Order Now</a>
      </div>
      `;
    }

    // Build reservations section
    let reservationsSection = '';
    if (reservations?.acceptReservations) {
      const platformNames = reservations.platforms.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
      reservationsSection = `
      <div class="py-8 border-t border-orange-100">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Make a Reservation</h3>
        <p class="text-slate-600 mb-6">Book your table on: ${platformNames}</p>
        <a href="${reservations.url || '#reserve'}" class="inline-block px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700">Reserve Now</a>
      </div>
      `;
    }

    // Build about section
    const aboutSection = fullStory ? `
      <section class="py-16 bg-orange-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <p class="text-slate-700 text-lg leading-relaxed mb-4">${fullStory}</p>
          ${founderName ? `<p class="text-slate-600">Founded by ${founderName}${yearFounded ? ` in ${yearFounded}` : ''}</p>` : ''}
        </div>
      </section>
    ` : '';

    // Build catering section
    const cateringSection = cateringAvailable ? `
      <section class="py-16 bg-slate-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">🎂 Catering & Private Events</h2>
          <p class="text-slate-700 text-lg mb-6">Host your special event at ${name}. We offer catering for ${privateEventCapacity || '60'} guests.</p>
          <a href="mailto:${cateringEmail || email}" class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700">Inquire About Catering</a>
        </div>
      </section>
    ` : '';

    // Build events section
    const eventsSection = hostEvents && weeklySpecials ? `
      <section class="py-16 bg-amber-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">🎵 Events & Specials</h2>
          <p class="text-slate-700 text-lg whitespace-pre-line">${weeklySpecials}</p>
        </div>
      </section>
    ` : '';

    // Build social links HTML
    const socialHTML = socialLinks && Object.values(socialLinks).some(v => v) ? `
      <div class="flex gap-4 justify-center mt-6">
        ${socialLinks.instagram ? `<a href="https://instagram.com/${socialLinks.instagram}" class="text-orange-600 hover:text-orange-700 font-semibold">Instagram</a>` : ''}
        ${socialLinks.tiktok ? `<a href="https://tiktok.com/@${socialLinks.tiktok}" class="text-orange-600 hover:text-orange-700 font-semibold">TikTok</a>` : ''}
        ${socialLinks.yelp ? `<a href="${socialLinks.yelp}" class="text-orange-600 hover:text-orange-700 font-semibold">Yelp</a>` : ''}
      </div>
    ` : '';

    const imageAssets = await buildImageAssets(images, useStockImages, cuisineType, name, menu, style);
    const imageInstructions = imageAssets.length > 0
      ? `
🖼️ IMAGE ASSETS (use these exact URLs, do not invent new ones):
${imageAssets.map((img) => `- ${img.role.toUpperCase()}: ${img.url} (alt: ${img.alt})`).join('\n')}

IMAGE RULES:
- Images must match the cuisine and theme. Do not use unrelated food photos.
- Use ONLY the provided image assets. Do not invent or fetch new URLs.
- Keep image usage consistent across hero, menu, and gallery.
`
      : '';

    const hasEditContext = Boolean(customInstruction && existingHtml);

    const prompt = buildSharedGenerationPrompt(req.body);

    let rawHtml = "<html><body>Error generating preview.</body></html>";

    try {
      console.log('🤖 Calling Groq API...');
      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: GENERATION_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        model: groqModel,
        temperature: hasEditContext ? 0.3 : 1,
        max_tokens: 4096,
      });
      console.log('✅ Groq response received');
      rawHtml = response.choices[0]?.message?.content || rawHtml;
    } catch (primaryError) {
      const primaryMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);
      console.error('⚠️ Groq generation failed:', primaryMessage);

      if (!canUseBackupGroq()) {
        throw primaryError;
      }

      console.log('🟡 Trying backup Groq key...');
      rawHtml = await generateWithBackupGroq({
        systemPrompt: GENERATION_SYSTEM_PROMPT,
        userPrompt: prompt,
        temperature: hasEditContext ? 0.3 : 1,
        maxTokens: 4096,
      });
      console.log('✅ Backup Groq response received');
    }
    console.log('📝 Raw HTML length:', rawHtml.length);

    const finalized = finalizeSharedGeneratedHtml(req.body, rawHtml);
    console.log('🧹 Final HTML length:', finalized.html.length, 'source:', finalized.meta.source);

    res.json(finalized);
    console.log('✅ Response sent successfully');
  } catch (error) {
    console.error("❌ Generation error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    try {
      const fallback = finalizeSharedGeneratedHtml(req.body, '');
      res.status(200).json({
        ...fallback,
        meta: {
          ...fallback.meta,
          source: 'fallback',
          validationIssues: [...fallback.meta.validationIssues, `upstream-error:${errorMessage}`],
        },
      });
    } catch (_fallbackError) {
      res.status(500).json({ error: "Failed to generate website", details: errorMessage });
    }
  }
});

app.post("/api/assistant", async (req: express.Request, res: express.Response) => {
  try {
    const { messages, details, imageData } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid payload", details: "messages must be an array" });
    }

    const sanitizedMessages = messages
      .filter((msg: any) => msg && typeof msg.content === "string")
      .slice(-12)
      .map((msg: any) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content.trim(),
      }))
      .filter((msg: any) => msg.content.length > 0);

    const context = details
      ? `Business context:\nName: ${details.name || "Unknown"}\nType: ${details.type || "Unknown"}\nCuisine: ${details.cuisineType || "Not specified"}\nStyle: ${details.style || "Not specified"}\nTone: ${details.tone || "Not specified"}\nCity: ${details.location?.city || "Not specified"}\nBrand summary: ${details.brand?.summary || "Not specified"}\nPrimary CTA: ${details.primaryCta || "Not specified"}`
      : "Business context: Not provided.";

    const systemPrompt = `You are an AI website editor inside a live preview environment.\nFor every user request, execute the change immediately and then respond with a short confirmation.\nDo not ask follow-up questions unless absolutely necessary.\nDo not provide suggestions or options unless the user explicitly asks.\nKeep replies under 1-2 sentences, direct, and action-based.\nIf an image is attached and the user references it, assume it should be applied to the requested section with a dark overlay and full-width cover.\nDo not claim to have performed actions you did not do.`;

    const imageNote = imageData ? "An image was attached to the latest message." : "";

    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: context },
        ...(imageNote ? [{ role: "system", content: imageNote }] : []),
        ...sanitizedMessages,
      ],
      model: groqModel,
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply = response.choices[0]?.message?.content?.trim() || "";
    res.json({ reply });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: "Failed to generate assistant reply", details: errorMessage });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
