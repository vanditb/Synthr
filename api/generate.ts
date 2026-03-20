import Groq from 'groq-sdk';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

type ImageAsset = {
  role: 'hero' | 'interior' | 'food' | 'dish' | 'dessert' | 'bar' | 'logo';
  url: string;
  alt: string;
};

const defaultStockImages: ImageAsset[] = [
  {
    role: 'hero',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80',
    alt: 'Elegant restaurant dining room',
  },
  {
    role: 'interior',
    url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80',
    alt: 'Warm, inviting restaurant interior',
  },
  {
    role: 'food',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80',
    alt: 'Plated signature entree',
  },
  {
    role: 'dish',
    url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1600&q=80',
    alt: 'Chef-prepared seasonal dish',
  },
  {
    role: 'dessert',
    url: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1600&q=80',
    alt: 'Dessert with fresh berries',
  },
  {
    role: 'bar',
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80',
    alt: 'Cocktails at the bar',
  },
];

const buildImageAssets = (
  images: { type: 'interior' | 'food' | 'logo'; data: string }[] | undefined,
  useStockImages: boolean,
  cuisineType?: string
): ImageAsset[] => {
  const assets: ImageAsset[] = [];
  const shouldRestrictFood = Boolean(cuisineType);

  if (images && images.length > 0) {
    for (const img of images) {
      if (!img?.data) continue;
      if (img.type === 'logo') {
        assets.push({ role: 'logo', url: img.data, alt: 'Restaurant logo' });
      }
      if (img.type === 'interior') {
        assets.push({ role: 'interior', url: img.data, alt: 'Restaurant interior' });
      }
      if (img.type === 'food') {
        assets.push({ role: 'food', url: img.data, alt: 'Signature dish' });
      }
    }
  }

  if (useStockImages) {
    for (const stock of defaultStockImages) {
      if (shouldRestrictFood && ['food', 'dish', 'dessert'].includes(stock.role)) {
        continue;
      }
      if (!assets.some((a) => a.role === stock.role)) {
        assets.push(stock);
      }
    }
  }

  return assets;
};

const formatMenuPrice = (price: unknown): string => {
  if (typeof price === 'number' && Number.isFinite(price)) {
    return `$${price.toFixed(2)}`;
  }

  const trimmed = String(price ?? '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('$') ? trimmed : `$${trimmed}`;
};

const ensureTailwindCdn = (html: string): string => {
  if (/cdn\.tailwindcss\.com/i.test(html)) return html;
  const cdnTag = '<script src="https://cdn.tailwindcss.com"></script>';
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (match) => `${match}\n  ${cdnTag}`);
  }
  return html.replace(/<html[^>]*>/i, (match) => `${match}\n<head>\n  ${cdnTag}\n</head>`);
};

const ensureDesignSafetyStyles = (html: string, style?: string): string => {
  if (/<style[^>]*data-synthr-safety/i.test(html)) return html;

  const styleKey = (style || '').toLowerCase();
  let fontLink =
    'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap';
  let bodyFont = "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";
  let headingFont = "'Playfair Display', 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";

  if (styleKey.includes('modern')) {
    fontLink =
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap';
    bodyFont = "'Sora', system-ui, -apple-system, 'Segoe UI', sans-serif";
    headingFont = "'Space Grotesk', 'Sora', system-ui, -apple-system, 'Segoe UI', sans-serif";
  } else if (styleKey.includes('casual')) {
    fontLink =
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Nunito:wght@300;400;600;700&display=swap';
    bodyFont = "'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif";
    headingFont = "'Poppins', 'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif";
  } else if (styleKey.includes('luxury')) {
    fontLink =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap';
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
    :root { color-scheme: light; }
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: ${bodyFont}; color: #0f172a; background-color: #f8fafc; }
    h1, h2, h3, h4, h5, h6 { font-family: ${headingFont}; letter-spacing: -0.02em; }
    img, video { max-width: 100%; height: auto; }
    body { overflow-x: hidden; }
    header { position: relative; }
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
  <section class="py-16 bg-white">
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
    imageAssets,
  } = opts;

  const heroImage = imageAssets.find((img) => img.role === 'hero')?.url || imageAssets[0]?.url || '';
  const heroAlt = imageAssets.find((img) => img.role === 'hero')?.alt || 'Restaurant hero image';
  const galleryImages = imageAssets.filter((img) => img.role !== 'logo').slice(0, 6);
  const summary =
    shortDescription ||
    description ||
    'A welcoming neighborhood restaurant serving dishes made with fresh, seasonal ingredients.';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${name} | ${cuisineType}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900">
    <header class="relative">
      <div class="absolute inset-0">
        ${heroImage ? `<img src="${heroImage}" alt="${heroAlt}" class="w-full h-full object-cover" />` : ''}
        <div class="absolute inset-0 bg-black/55"></div>
      </div>
      <div class="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <nav class="flex items-center justify-between text-white">
          <div class="text-2xl font-semibold tracking-wide">${name}</div>
          <div class="flex gap-6 text-sm font-semibold">
            <a href="#menu">Menu</a>
            <a href="#about">About</a>
            <a href="#location">Location</a>
            <a href="#reservations">Reservations</a>
          </div>
        </nav>
        <div class="mt-16 max-w-2xl">
          <p class="uppercase text-sm tracking-[0.3em] text-slate-100">Welcome to</p>
          <h1 class="text-5xl font-bold mt-4 mb-6">${name}</h1>
          <p class="text-lg text-slate-100 mb-8">${tagline}</p>
          <div class="flex flex-wrap gap-4">
            <a href="#ordering" class="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700">Order Now</a>
            <a href="#reservations" class="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20">Reserve</a>
          </div>
        </div>
      </div>
    </header>

    <section id="about" class="py-16 bg-white">
      <div class="max-w-5xl mx-auto px-6 grid gap-10 md:grid-cols-2">
        <div>
          <h2 class="text-3xl font-bold text-slate-900 mb-4">About ${name}</h2>
          <p class="text-slate-700 leading-relaxed">${summary}</p>
          ${aboutSection}
        </div>
        <div class="grid gap-4">
          ${galleryImages
            .slice(0, 2)
            .map(
              (img) => `
            <img src="${img.url}" alt="${img.alt}" class="rounded-2xl h-60 w-full object-cover" />
          `
            )
            .join('')}
        </div>
      </div>
    </section>

    <section id="menu" class="py-16 bg-slate-50">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-3xl font-bold text-slate-900 mb-8">Menu Highlights</h2>
        ${menuHTML || '<p class="text-slate-600">Our full menu is available in-store.</p>'}
      </div>
    </section>

    <section id="hours" class="py-16 bg-white">
      <div class="max-w-5xl mx-auto px-6 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Hours</h2>
          <div class="bg-slate-50 rounded-2xl p-6 shadow">
            ${hoursHTML || '<p class="text-slate-600">Hours updated weekly.</p>'}
          </div>
        </div>
        <div class="space-y-4">
          <h3 class="text-xl font-semibold text-slate-900">Visit Us</h3>
          <p class="text-slate-700">${address}, ${city}</p>
          <p class="text-slate-700">${neighborhood ? `${neighborhood} · ` : ''}${parking || ''}</p>
          <p class="text-slate-700">${phone} · ${email}</p>
          ${googleMapsLink ? `<a href="${googleMapsLink}" class="text-orange-600 font-semibold">Open in Google Maps</a>` : ''}
        </div>
      </div>
    </section>

    <section id="ordering" class="py-16 bg-orange-50">
      <div class="max-w-5xl mx-auto px-6">
        ${orderingSection || '<p class="text-slate-700">Online ordering is not available.</p>'}
      </div>
    </section>

    <section id="reservations" class="py-16 bg-white">
      <div class="max-w-5xl mx-auto px-6">
        ${reservationsSection || '<p class="text-slate-700">Reservations are not available.</p>'}
      </div>
    </section>

    ${cateringSection || ''}
    ${eventsSection || ''}

    <section id="location" class="py-16 bg-slate-900 text-slate-200">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-4">Find Us</h2>
        <p class="text-slate-300 mb-2">${address}, ${city}</p>
        <p class="text-slate-300">${phone} · ${email}</p>
        ${socialHTML}
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
  </body>
</html>`;
};

const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!process.env.GROQ_API_KEY) {
    res.status(500).json({ error: 'Missing GROQ_API_KEY in environment' });
    return;
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    const {
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
      dineIn,
      takeout,
      delivery,
      shortDescription,
      fullStory,
      yearFounded,
      founderName,
      menu,
      onlineOrdering,
      reservations,
      googleMapsLink,
      parking,
      neighborhood,
      socialLinks,
      hostEvents,
      eventTypes,
      weeklySpecials,
      cateringAvailable,
      cateringEmail,
      privateEventCapacity,
      images,
      useStockImages,
      customInstruction,
      existingHtml,
      assistantImage,
    } = req.body || {};

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
      <div class="mb-12">
        <h3 class="text-2xl font-serif font-bold text-slate-900 mb-6">${category}</h3>
        <div class="space-y-4">
          ${(items as any[])
            .map(
              (item) => `
            <div class="flex justify-between items-start pb-4 border-b border-slate-200">
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-slate-900">${item.name}</h4>
                <p class="text-slate-600 text-sm mt-1">${item.description}</p>
              </div>
              <span class="text-lg font-semibold text-slate-900 ml-4">${formatMenuPrice(item.displayPrice ?? item.price)}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
      )
      .join('');

    const hoursHTML = Object.entries(hours || {})
      .map(
        ([day, time]) => `
      <div class="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0">
        <span class="font-medium text-slate-700">${day}</span>
        <span class="text-slate-600">${time}</span>
      </div>
    `
      )
      .join('');

    let orderingSection = '';
    if (onlineOrdering?.acceptOrders) {
      const platformNames = onlineOrdering.platforms
        .map((p: string) => {
          if (p === 'doordash') return 'DoorDash';
          if (p === 'ubereats') return 'Uber Eats';
          return p.charAt(0).toUpperCase() + p.slice(1);
        })
        .join(', ');
      orderingSection = `
      <div class="py-8 border-t border-orange-100">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Order Online</h3>
        <p class="text-slate-600 mb-6">Available on: ${platformNames}</p>
        <a href="${onlineOrdering.customURL || '#'}" class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700">Order Now</a>
      </div>
      `;
    }

    let reservationsSection = '';
    if (reservations?.acceptReservations) {
      const platformNames = reservations.platforms.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
      reservationsSection = `
      <div class="py-8 border-t border-orange-100">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Make a Reservation</h3>
        <p class="text-slate-600 mb-6">Book your table on: ${platformNames}</p>
        <a href="${reservations.url || 'tel:' + phone}" class="inline-block px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700">Reserve Now</a>
      </div>
      `;
    }

    const aboutSection = fullStory
      ? `
      <section class="py-16 bg-orange-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <p class="text-slate-700 text-lg leading-relaxed mb-4">${fullStory}</p>
          ${founderName ? `<p class="text-slate-600">Founded by ${founderName}${yearFounded ? ` in ${yearFounded}` : ''}</p>` : ''}
        </div>
      </section>
    `
      : '';

    const cateringSection = cateringAvailable
      ? `
      <section class="py-16 bg-slate-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">🎂 Catering & Private Events</h2>
          <p class="text-slate-700 text-lg mb-6">Host your special event at ${name}. We offer catering for ${privateEventCapacity || '60'} guests.</p>
          <a href="mailto:${cateringEmail || email}" class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700">Inquire About Catering</a>
        </div>
      </section>
    `
      : '';

    const eventsSection =
      hostEvents && weeklySpecials
        ? `
      <section class="py-16 bg-amber-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">🎵 Events & Specials</h2>
          <p class="text-slate-700 text-lg whitespace-pre-line">${weeklySpecials}</p>
        </div>
      </section>
    `
        : '';

    const socialHTML =
      socialLinks && Object.values(socialLinks).some((v) => v)
        ? `
      <div class="flex gap-4 justify-center mt-6">
        ${socialLinks.instagram ? `<a href="https://instagram.com/${socialLinks.instagram}" class="text-orange-600 hover:text-orange-700 font-semibold">Instagram</a>` : ''}
        ${socialLinks.tiktok ? `<a href="https://tiktok.com/@${socialLinks.tiktok}" class="text-orange-600 hover:text-orange-700 font-semibold">TikTok</a>` : ''}
        ${socialLinks.yelp ? `<a href="${socialLinks.yelp}" class="text-orange-600 hover:text-orange-700 font-semibold">Yelp</a>` : ''}
      </div>
    `
        : '';

    const imageAssets = buildImageAssets(images, useStockImages, cuisineType);
    const imageInstructions =
      imageAssets.length > 0
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

    const prompt = hasEditContext
      ? `You are an AI website editor inside a live preview environment.

Your job is to EXECUTE the user's request immediately by editing ONLY the relevant section(s).
Preserve everything else: layout, colors, spacing, typography, and all other sections.
Do NOT regenerate or redesign the entire website.
Return the FULL updated HTML document (no markdown, no explanations).

If the request is about using an uploaded image or changing a background, do not alter any other sections.

USER_REQUEST:
${customInstruction}

EXISTING_HTML:
${existingHtml}
`
      : `Create a high-converting, professional restaurant website with the following details:

🏪 RESTAURANT INFO:
Name: ${name}
Cuisine: ${cuisineType}
Price Range: ${priceRange}
Tagline: ${tagline || 'Delicious cuisine, unforgettable experience'}
Address: ${address}, ${city}
Phone: ${phone}
Email: ${email}
${neighborhood ? 'Neighborhood: ' + neighborhood : ''}
${parking ? 'Parking: ' + parking : ''}

📋 ABOUT:
${shortDescription || description}
${fullStory && founderName ? `
Founded by ${founderName}${yearFounded ? ` in ${yearFounded}` : ''}.
${fullStory}` : ''}

BRAND DIRECTION:
Atmosphere: ${brand?.atmosphere || 'Not specified'}
Audience: ${brand?.audience || 'Not specified'}
Keywords: ${Array.isArray(brand?.keywords) && brand.keywords.length ? brand.keywords.join(', ') : 'Not specified'}
Hero focus: ${brand?.heroFocus || 'Not specified'}
Primary CTA: ${primaryCta || 'Not specified'}
Publishing intent: ${domainPreference || 'Not specified'}

🍽️ MENU:
${menu?.map((item: any) => `- ${item.name}: ${item.description} (${formatMenuPrice(item.displayPrice ?? item.price)})`).join('\n')}
${Array.isArray(signatureDishes) && signatureDishes.length ? `Signature dishes: ${signatureDishes.join(', ')}` : ''}

⏰ HOURS:
${Object.entries(hours || {}).map(([day, time]) => `${day}: ${time}`).join('\n')}

🛒 SERVICES:
${[dineIn && '✓ Dine-in', takeout && '✓ Takeout', delivery && '✓ Delivery'].filter(Boolean).join(', ')}
${[services?.catering && '✓ Catering', services?.privateDining && '✓ Private dining'].filter(Boolean).join(', ')}

📱 ONLINE ORDERING:
${onlineOrdering?.acceptOrders ? `Available on: ${onlineOrdering.platforms.join(', ')} - URL: ${onlineOrdering.customURL}` : 'Not available'}
${ordering?.enabled ? `Ordering provider: ${ordering.provider} - URL: ${ordering.url || 'Not provided'}` : ''}

📅 RESERVATIONS:
${reservations?.acceptReservations ? `Available on: ${reservations.platforms.join(', ')} - URL: ${reservations.url}` : 'Not available'}

🎂 CATERING:
${cateringAvailable ? `Available - Capacity: ${privateEventCapacity} guests - Email: ${cateringEmail}` : 'Not available'}

🎵 EVENTS:
${hostEvents && weeklySpecials ? weeklySpecials : 'No regular events'}

📱 SOCIAL:
${socialLinks?.instagram ? 'Instagram: ' + socialLinks.instagram + ' ' : ''}${socialLinks?.tiktok ? 'TikTok: ' + socialLinks.tiktok : ''}

Design Style: ${style} 
Tone: ${tone}

${customInstruction ? `⭐ SPECIAL REQUEST: "${customInstruction}"` : ''}
${imageInstructions}

REQUIREMENTS:
- Create a complete, valid HTML document (no markdown)
- Use Tailwind CSS via CDN
- Use the provided IMAGE ASSETS URLs. Ensure images are cuisine-appropriate and consistent.
- Mobile-responsive design
- Include: Hero, Navigation, About Us, Full Menu (organized by category), Hours, Location/Map, Reservation/Order CTAs, Social Links, Footer
- Typography must be consistent and professional (limit to 2 complementary fonts).
- Ensure strong contrast between text and background; if text sits on images, add a dark overlay or a solid background card.
- Avoid any overlapping elements; no absolute positioning for text blocks unless paired with safe padding and overlays.
- All buttons must be readable, aligned, and never overlap; use flex-wrap for button groups.
- Use clean spacing and alignment so sections feel organized and realistic.
- ${style === 'Luxury' ? 'Elegant, upscale, fine dining aesthetic with premium typography' : style === 'Modern' ? 'Clean, contemporary, minimalist design' : style === 'Casual' ? 'Friendly, inviting, approachable design' : 'Professional and polished'}
- ${tone === 'Traditional' ? 'Classic, timeless language' : tone === 'Trendy' ? 'Modern, fashionable voice' : tone === 'Upscale' ? 'Premium, sophisticated tone' : 'Warm, welcoming, family-friendly'}
- Prominent "Order Now" and "Reserve" buttons
- Fast-loading, optimal performance
- Professional footer with all contact information
- No empty sections or placeholder text. If a detail is missing, write tasteful, generic copy without inventing facts like address, phone, or prices.
- Menu MUST use only the provided items exactly as listed. Do not add, remove, or change any menu item.

Return ONLY raw HTML - no markdown code blocks, no explanations.`;

    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: groqModel,
      temperature: hasEditContext ? 0.3 : 1,
      max_tokens: 4096,
    });

    const html = response.choices[0]?.message?.content || '<html><body>Error generating preview.</body></html>';

    let cleanHtml = html;
    if (cleanHtml.includes('```html')) {
      cleanHtml = cleanHtml.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    }
    if (cleanHtml.includes('```')) {
      cleanHtml = cleanHtml.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '');
    }
    cleanHtml = cleanHtml.trim();

    cleanHtml = ensureTailwindCdn(cleanHtml);
    cleanHtml = ensureDesignSafetyStyles(cleanHtml, style);
    cleanHtml = normalizeOnPageLinks(cleanHtml);
    cleanHtml = ensureSmoothScrollScript(cleanHtml);
    cleanHtml = injectFallbackGallery(cleanHtml, imageAssets);
    cleanHtml = applyHeroBackground(cleanHtml, assistantImage, customInstruction);
    cleanHtml = enforceMenuSection(cleanHtml, menuHTML);

    const looksInvalid =
      cleanHtml.length < 1200 ||
      !/<body[^>]*>/i.test(cleanHtml) ||
      (!/<nav[^>]*>/i.test(cleanHtml) && !/<header[^>]*>/i.test(cleanHtml)) ||
      (!/<section[^>]*>/i.test(cleanHtml) && !/<img\s/i.test(cleanHtml));

    if (looksInvalid) {
      if (hasEditContext && typeof existingHtml === 'string' && existingHtml.length > 0) {
        cleanHtml = existingHtml;
      } else {
        cleanHtml = buildFallbackHtml({
          name,
          cuisineType,
          priceRange,
          tagline: tagline || 'Delicious cuisine, unforgettable experience',
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
          imageAssets,
        });
      }
    }

    res.status(200).json({ html: cleanHtml });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Failed to generate website', details: errorMessage });
  }
}
