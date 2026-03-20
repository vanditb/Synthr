import { BusinessDetails, MenuItem } from '../types';
import type { GenerationMeta } from '../lib/generation';

const ensureUrl = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const formatPriceForGenerator = (price: string) => {
  const trimmed = price.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('$') ? trimmed : `$${trimmed}`;
};

const parseNumericPrice = (price: string) => {
  const normalized = price.replace(/[^0-9.]/g, '');
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
};

const derivePages = (details: BusinessDetails) => {
  const pages = ['Home', 'Menu', 'About', 'Hours', 'Contact'];

  if (details.ordering.enabled) {
    pages.push('Order');
  }

  if (details.reservations.enabled) {
    pages.push('Reserve');
  }

  if (details.services.catering || details.services.privateDining) {
    pages.push('Events');
  }

  return pages;
};

const mapMenuItems = (menu: MenuItem[]) =>
  menu
    .filter((item) => item.name.trim())
    .map((item) => ({
      ...item,
      description: item.description.trim(),
      category: item.category.trim() || 'Featured',
      price: parseNumericPrice(item.price),
      displayPrice: formatPriceForGenerator(item.price),
    }));

const mapBusinessDetailsToGenerationPayload = (details: BusinessDetails) => {
  const mappedMenu = mapMenuItems(details.menu);
  const services = details.services;
  const orderingProvider =
    details.ordering.provider !== 'none' ? details.ordering.provider : details.ordering.enabled ? 'custom' : 'none';
  const reservationProvider =
    details.reservations.provider !== 'none'
      ? details.reservations.provider
      : details.reservations.enabled
        ? 'custom'
        : 'none';

  return {
    // Core
    name: details.name.trim(),
    type: details.type,
    style: details.style,
    tone: details.tone,
    cuisineType: details.cuisineType.trim(),
    priceRange: details.priceRange,
    pages: derivePages(details),

    // New structured fields
    brand: details.brand,
    primaryCta: details.primaryCta,
    menuSourceText: details.menuSourceText || '',
    menuSourceImages: details.menuSourceImages || [],
    signatureDishes: details.signatureDishes,
    services: details.services,
    ordering: {
      ...details.ordering,
      url: ensureUrl(details.ordering.url),
    },
    domainPreference: details.domainPreference,
    advanced: details.advanced,

    // Legacy-compatible fields used by the generator prompt/fallback logic
    city: details.location.city.trim(),
    address: details.location.address.trim(),
    phone: details.location.phone.trim(),
    email: details.location.email.trim(),
    hours: details.location.hours,
    tagline: details.brand.heroPhrase?.trim() || details.brand.summary.trim(),
    description: details.brand.summary.trim(),
    shortDescription: details.brand.summary.trim(),
    fullStory: details.brand.story?.trim() || '',
    dineIn: services.dineIn,
    takeout: services.takeout,
    delivery: services.delivery,
    menu: mappedMenu,
    onlineOrdering: {
      acceptOrders: details.ordering.enabled,
      platforms: details.ordering.enabled && orderingProvider !== 'none' ? [orderingProvider] : [],
      customURL: ensureUrl(details.ordering.url),
    },
    reservations: {
      acceptReservations: details.reservations.enabled,
      platforms: details.reservations.enabled && reservationProvider !== 'none' ? [reservationProvider] : [],
      url: ensureUrl(details.reservations.url),
    },
    googleMapsLink: ensureUrl(details.location.googleMapsLink),
    parking: details.advanced?.parking?.trim() || '',
    neighborhood: details.advanced?.neighborhood?.trim() || '',
    socialLinks: {
      ...details.socialLinks,
      googleReviews: ensureUrl(details.socialLinks.googleReviews),
      yelp: ensureUrl(details.socialLinks.yelp),
      facebook: ensureUrl(details.socialLinks.facebook),
    },
    hostEvents: Boolean(details.advanced?.weeklySpecials || services.privateDining),
    eventTypes: services.privateDining ? ['catering'] : [],
    weeklySpecials: details.advanced?.weeklySpecials?.trim() || '',
    cateringAvailable: services.catering || services.privateDining,
    cateringEmail: details.advanced?.cateringEmail?.trim() || details.location.email.trim(),
    privateEventCapacity: details.advanced?.privateEventCapacity,
    yearFounded: details.advanced?.yearFounded,
    founderName: details.advanced?.founderName?.trim() || '',
    images: details.images,
    useStockImages: details.useStockImages,
  };
};

/**
 * Calls the backend API to generate HTML for a website.
 */
export const generateWebsiteHtml = async (
  details: BusinessDetails,
  customInstruction?: string,
  existingHtml?: string,
  assistantImage?: string
): Promise<GenerationResult> => {
  try {
    console.log('Starting website generation...');
    let response: Response;
    try {
      const payload = mapBusinessDetailsToGenerationPayload(details);

      response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          customInstruction,
          existingHtml,
          assistantImage,
        }),
      });
    } catch (err) {
      const message =
        'Network error calling /api/generate. This usually means the backend is not running, ' +
        'or the app was started without the Vite proxy (use `npm run dev`, not `npm run client` or `npm run preview`).';
      console.error('Network error during fetch:', err);
      throw new Error(message);
    }

    console.log('API response status:', response.status);

    const rawText = await response.text();
    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (_err) {
      const hint = rawText?.slice(0, 120) || '';
      throw new Error(
        `API returned non-JSON (status ${response.status}). This usually means the backend isn't running or the dev server proxy wasn't used. First bytes: ${hint}`
      );
    }

    if (!response.ok) {
      console.error('API error:', data || rawText);
      const statusInfo = `${response.status} ${response.statusText || ''}`.trim();
      const details = data?.details || (rawText ? rawText.slice(0, 200) : '');
      const baseMessage = data?.error || 'Unknown error';
      const fallbackHint =
        response.status >= 500 && !details
          ? 'The local backend may not be running or may have crashed. Restart it with `npm run dev` or `npm run server`.'
          : '';
      throw new Error(
        `API error (${statusInfo}): ${baseMessage}${details ? ` - ${details}` : fallbackHint ? ` - ${fallbackHint}` : ''}`
      );
    }

    if (!data.html) {
      console.error('No HTML in response:', data);
      throw new Error('No HTML returned from API');
    }

    return {
      html: data.html,
      meta: data.meta,
    };
  } catch (error) {
    console.error('Generation error:', error);
    throw error;
  }
};
export interface GenerationResult {
  html: string;
  meta?: GenerationMeta;
}
