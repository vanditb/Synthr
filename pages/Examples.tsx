import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BusinessDetails,
  BusinessType,
  RestaurantTone,
  WebsiteStyle,
} from '../types';

type ExamplePreset = {
  slug: string;
  typeLabel: string;
  heading: string;
  subheading: string;
  details: BusinessDetails;
  theme: {
    background: string;
    accent: string;
    accentSoft: string;
    surface: string;
    textMuted: string;
    image: string;
    buttonText: string;
    navItems: string[];
    layout: 'split' | 'editorial' | 'bold';
  };
};

type ExampleRecord = {
  slug: string;
  typeLabel: string;
  heading: string;
  subheading: string;
  html: string;
};

type ExampleSlot = {
  slug: string;
  typeLabel: string;
  heading: string;
  subheading: string;
  html: string;
};

const EXAMPLE_VIEWPORT_WIDTH = 1280;
const EXAMPLE_VIEWPORT_HEIGHT = 900;

const defaultHours = {
  Monday: '11:00 AM - 9:00 PM',
  Tuesday: '11:00 AM - 9:00 PM',
  Wednesday: '11:00 AM - 9:00 PM',
  Thursday: '11:00 AM - 10:00 PM',
  Friday: '11:00 AM - 10:00 PM',
  Saturday: '10:00 AM - 10:00 PM',
  Sunday: '10:00 AM - 8:00 PM',
};

const buildFallbackExampleHtml = (
  preset: Pick<ExamplePreset, 'heading' | 'typeLabel' | 'theme'>,
  details: BusinessDetails
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Manrope", system-ui, sans-serif;
        background: ${preset.theme.background};
        color: #fff;
      }
      .shell {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, ${preset.theme.accentSoft}, transparent 24%),
          linear-gradient(180deg, ${preset.theme.background}, #0e1015 42%, ${preset.theme.background});
      }
      .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 48px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        font-size: 14px;
        color: ${preset.theme.textMuted};
      }
      .nav-links {
        display: flex;
        gap: 28px;
      }
      .hero {
        display: grid;
        grid-template-columns: ${preset.theme.layout === 'bold' ? '0.92fr 1.08fr' : '1.05fr 0.95fr'};
        gap: 32px;
        padding: 54px 48px 36px;
        align-items: end;
      }
      .eyebrow {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: ${preset.theme.textMuted};
      }
      h1 {
        margin: 16px 0 0;
        font-size: ${preset.theme.layout === 'editorial' ? '72px' : '68px'};
        line-height: 0.95;
        letter-spacing: -0.06em;
      }
      .copy {
        margin-top: 22px;
        max-width: 560px;
        font-size: 18px;
        line-height: 1.8;
        color: ${preset.theme.textMuted};
      }
      .actions {
        display: flex;
        gap: 12px;
        margin-top: 28px;
      }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 14px 18px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 14px;
      }
      .button-primary {
        background: ${preset.theme.accent};
        color: ${preset.theme.layout === 'editorial' ? '#1c1305' : 'white'};
      }
      .button-secondary {
        border: 1px solid rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.8);
      }
      .visual {
        min-height: 420px;
        border: 1px solid rgba(255,255,255,0.08);
        overflow: hidden;
        background:
          linear-gradient(180deg, rgba(7,7,10,0.18), rgba(7,7,10,0.78)),
          url('${preset.theme.image}') center/cover;
        position: relative;
      }
      .visual-card {
        position: absolute;
        left: 24px;
        right: 24px;
        bottom: 24px;
        background: rgba(12,12,16,0.72);
        border: 1px solid rgba(255,255,255,0.08);
        padding: 20px;
        backdrop-filter: blur(16px);
      }
      .visual-card h2 {
        margin: 0;
        font-size: 32px;
        letter-spacing: -0.04em;
      }
      .section {
        padding: 36px 48px 56px;
      }
      .grid {
        display: grid;
        grid-template-columns: ${preset.theme.layout === 'editorial' ? '0.9fr 1.1fr' : '1fr 1fr'};
        gap: 18px;
      }
      .panel {
        border: 1px solid rgba(255,255,255,0.08);
        background: ${preset.theme.surface};
        padding: 22px;
      }
      .panel h3 {
        margin: 0 0 14px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: rgba(255,255,255,0.5);
      }
      .panel p {
        margin: 0;
        font-size: 16px;
        line-height: 1.75;
        color: ${preset.theme.textMuted};
      }
      .menu-item {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        padding: 14px 0;
        border-top: 1px solid rgba(255,255,255,0.08);
      }
      .menu-item:first-child {
        border-top: 0;
        padding-top: 0;
      }
      .menu-item strong {
        display: block;
        margin-bottom: 6px;
        font-size: 18px;
      }
      .menu-item span {
        white-space: nowrap;
        color: ${preset.theme.accent};
        font-weight: 700;
      }
      .highlight {
        margin-top: 20px;
        padding: 16px 18px;
        border-left: 3px solid ${preset.theme.accent};
        background: rgba(255,255,255,0.02);
        color: ${preset.theme.textMuted};
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <div class="nav">
        <strong>${details.name}</strong>
        <div class="nav-links">
          ${preset.theme.navItems.map((item) => `<span>${item}</span>`).join('')}
        </div>
      </div>
      <section class="hero">
        <div>
          <div class="eyebrow">${preset.typeLabel} · ${details.cuisineType}</div>
          <h1>${details.name}</h1>
          <p class="copy">${details.brand.summary}</p>
          <div class="actions">
            <div class="button button-primary">${preset.theme.buttonText}</div>
            <div class="button button-secondary">View menu</div>
          </div>
          ${
            preset.theme.layout === 'editorial'
              ? `<div class="highlight">${details.brand.story || details.brand.summary}</div>`
              : ''
          }
        </div>
        <div class="visual">
          <div class="visual-card">
            <h2>${preset.heading}</h2>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="grid">
          <div class="panel">
            <h3>Menu highlights</h3>
            ${details.menu
              .slice(0, 3)
              .map(
                (item) => `
                  <div class="menu-item">
                    <div>
                      <strong>${item.name}</strong>
                      <p>${item.description}</p>
                    </div>
                    <span>${item.price}</span>
                  </div>
                `
              )
              .join('')}
          </div>
          <div class="panel">
            <h3>${preset.theme.layout === 'bold' ? 'Order & visit' : 'Details'}</h3>
            <p>${details.location.address}, ${details.location.city}</p>
            <p style="margin-top: 12px;">${details.location.phone}</p>
            <p style="margin-top: 12px;">${details.ordering.enabled ? 'Online ordering available.' : 'Reservations and walk-ins welcome.'}</p>
          </div>
        </div>
      </section>
    </div>
  </body>
</html>`;

const examplePresets: ExamplePreset[] = [
  {
    slug: 'fine-dining',
    typeLabel: 'Fine Dining',
    heading: 'Atelier No. 9',
    subheading: 'A reservation-led site for a more polished dinner service.',
    details: {
      type: BusinessType.Restaurant,
      name: 'Atelier No. 9',
      cuisineType: 'Seasonal tasting menu',
      priceRange: '$$$',
      style: WebsiteStyle.Luxury,
      tone: RestaurantTone.Upscale,
      brand: {
        summary:
          'A refined neighborhood dining room serving a seasonal tasting menu with a strong wine program and private dining.',
        story:
          'Atelier No. 9 is built around quieter service, seasonal ingredients, and a reservation experience that feels personal from the first click.',
        heroPhrase: 'Seasonal tasting in a quieter room.',
        atmosphere: 'Candlelit, intimate, refined',
        audience: 'Date nights, celebrations, and private dining guests',
        keywords: ['seasonal', 'private dining', 'wine pairings'],
        heroFocus: 'Interior',
      },
      services: {
        dineIn: true,
        takeout: false,
        delivery: false,
        catering: false,
        privateDining: true,
      },
      primaryCta: 'reservations',
      menu: [
        {
          name: 'Spring Tasting',
          description: 'Seven courses with line-caught fish, garden vegetables, and cultured butter.',
          price: '$145',
          category: 'Tasting',
        },
        {
          name: 'Sommelier Pairing',
          description: 'Four pours chosen around the nightly menu.',
          price: '$68',
          category: 'Wine',
        },
        {
          name: 'Private Dining',
          description: 'A seated tasting menu for parties up to 16 guests.',
          price: 'By request',
          category: 'Events',
        },
      ],
      signatureDishes: ['Spring Tasting', 'Sommelier Pairing'],
      ordering: {
        enabled: false,
        provider: 'none',
        url: '',
      },
      reservations: {
        enabled: true,
        provider: 'opentable',
        url: 'https://www.opentable.com',
      },
      location: {
        city: 'New York',
        address: '22 Leroy St',
        phone: '(212) 555-1948',
        email: 'hello@atelierno9.com',
        googleMapsLink: 'https://maps.google.com',
        hours: defaultHours,
      },
      socialLinks: {
        instagram: '@atelierno9',
      },
      images: [],
      useStockImages: true,
      domainPreference: 'synthr-subdomain',
      menuSourceText: '',
      menuSourceImages: [],
      advanced: {
        neighborhood: 'West Village',
        awards: ['Wine Spectator'],
      },
    },
    theme: {
      background: '#0b0a0d',
      accent: '#f59e0b',
      accentSoft: 'rgba(245, 158, 11, 0.18)',
      surface: 'rgba(255,255,255,0.04)',
      textMuted: 'rgba(255,255,255,0.68)',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80',
      buttonText: 'Reserve now',
      navItems: ['Menu', 'Story', 'Reserve', 'Private Dining'],
      layout: 'editorial',
    },
  },
  {
    slug: 'cafe',
    typeLabel: 'Cafe',
    heading: 'Northline Cafe',
    subheading: 'A faster site built around hours, pickup, and repeat visits.',
    details: {
      type: BusinessType.Restaurant,
      name: 'Northline Cafe',
      cuisineType: 'Coffee, breakfast, and lunch',
      priceRange: '$$',
      style: WebsiteStyle.Clean,
      tone: RestaurantTone.Trendy,
      brand: {
        summary:
          'An all-day cafe serving espresso, breakfast sandwiches, and lunch with a strong pickup business.',
        story:
          'Northline Cafe is designed for daily regulars, quick stops, and an easy path from traffic to pickup orders.',
        heroPhrase: 'Coffee, breakfast, and lunch without the wait.',
        atmosphere: 'Bright, modern, neighborhood',
        audience: 'Daily regulars, remote workers, and morning foot traffic',
        keywords: ['pickup', 'espresso', 'breakfast'],
        heroFocus: 'Food',
      },
      services: {
        dineIn: true,
        takeout: true,
        delivery: false,
        catering: true,
        privateDining: false,
      },
      primaryCta: 'online-orders',
      menu: [
        {
          name: 'Maple Oat Latte',
          description: 'Espresso, oat milk, and a soft maple finish.',
          price: '$6',
          category: 'Drinks',
        },
        {
          name: 'Breakfast Biscuit',
          description: 'Egg, cheddar, and chili jam on a warm biscuit.',
          price: '$9',
          category: 'Breakfast',
        },
        {
          name: 'Turkey Pesto Melt',
          description: 'Roasted turkey, provolone, basil pesto, and tomato.',
          price: '$13',
          category: 'Lunch',
        },
      ],
      signatureDishes: ['Maple Oat Latte', 'Breakfast Biscuit'],
      ordering: {
        enabled: true,
        provider: 'toast',
        url: 'https://order.toasttab.com',
      },
      reservations: {
        enabled: false,
        provider: 'none',
        url: '',
      },
      location: {
        city: 'Austin',
        address: '1804 E 6th St',
        phone: '(512) 555-0112',
        email: 'hello@northlinecafe.com',
        googleMapsLink: 'https://maps.google.com',
        hours: {
          ...defaultHours,
          Monday: '6:30 AM - 4:00 PM',
          Tuesday: '6:30 AM - 4:00 PM',
          Wednesday: '6:30 AM - 4:00 PM',
          Thursday: '6:30 AM - 4:00 PM',
          Friday: '6:30 AM - 5:00 PM',
          Saturday: '7:00 AM - 5:00 PM',
          Sunday: '7:00 AM - 3:00 PM',
        },
      },
      socialLinks: {
        instagram: '@northlinecafe',
      },
      images: [],
      useStockImages: true,
      domainPreference: 'synthr-subdomain',
      menuSourceText: '',
      menuSourceImages: [],
      advanced: {
        weeklySpecials: 'Seasonal drinks rotate monthly.',
        dietaryAccommodations: ['vegetarian'],
      },
    },
    theme: {
      background: '#0a0c10',
      accent: '#fb923c',
      accentSoft: 'rgba(251, 146, 60, 0.15)',
      surface: 'rgba(255,255,255,0.03)',
      textMuted: 'rgba(255,255,255,0.7)',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
      buttonText: 'Order pickup',
      navItems: ['Menu', 'Hours', 'Pickup', 'Visit'],
      layout: 'split',
    },
  },
  {
    slug: 'pizzeria',
    typeLabel: 'Pizzeria',
    heading: 'Brick Alley Pizza',
    subheading: 'A direct-ordering site for fast menu scanning and local traffic.',
    details: {
      type: BusinessType.Restaurant,
      name: 'Brick Alley Pizza',
      cuisineType: 'New York-style pizza',
      priceRange: '$$',
      style: WebsiteStyle.Modern,
      tone: RestaurantTone.Casual,
      brand: {
        summary:
          'A neighborhood pizzeria focused on direct ordering, quick lunch traffic, and family dinner pickups.',
        story:
          'Brick Alley Pizza keeps the menu, location, and ordering path simple so nearby customers can decide fast.',
        heroPhrase: 'Pizza worth ordering direct.',
        atmosphere: 'Busy, local, casual',
        audience: 'Lunch traffic, families, and neighborhood regulars',
        keywords: ['direct ordering', 'slices', 'delivery'],
        heroFocus: 'Food',
      },
      services: {
        dineIn: true,
        takeout: true,
        delivery: true,
        catering: true,
        privateDining: false,
      },
      primaryCta: 'online-orders',
      menu: [
        {
          name: 'Pepperoni Pie',
          description: 'Cup-and-char pepperoni, mozzarella, and basil.',
          price: '$24',
          category: 'Pies',
        },
        {
          name: 'Lunch Slice Combo',
          description: 'Two slices and a fountain drink.',
          price: '$11',
          category: 'Lunch',
        },
        {
          name: 'Garlic Knots',
          description: 'Fresh-baked knots with parmesan and marinara.',
          price: '$8',
          category: 'Sides',
        },
      ],
      signatureDishes: ['Pepperoni Pie', 'Lunch Slice Combo'],
      ordering: {
        enabled: true,
        provider: 'custom',
        url: 'https://brickalleypizza.com/order',
      },
      reservations: {
        enabled: false,
        provider: 'none',
        url: '',
      },
      location: {
        city: 'Chicago',
        address: '901 N Damen Ave',
        phone: '(773) 555-0147',
        email: 'hi@brickalleypizza.com',
        googleMapsLink: 'https://maps.google.com',
        hours: {
          ...defaultHours,
          Friday: '11:00 AM - 11:00 PM',
          Saturday: '11:00 AM - 11:00 PM',
          Sunday: '11:00 AM - 10:00 PM',
        },
      },
      socialLinks: {
        instagram: '@brickalleypizza',
      },
      images: [],
      useStockImages: true,
      domainPreference: 'custom-domain',
      menuSourceText: '',
      menuSourceImages: [],
      advanced: {
        neighborhood: 'Wicker Park',
        weeklySpecials: 'Lunch specials Monday through Friday.',
      },
    },
    theme: {
      background: '#120b0a',
      accent: '#ef4444',
      accentSoft: 'rgba(239, 68, 68, 0.16)',
      surface: 'rgba(255,255,255,0.035)',
      textMuted: 'rgba(255,255,255,0.7)',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80',
      buttonText: 'Order direct',
      navItems: ['Menu', 'Order', 'Catering', 'Location'],
      layout: 'bold',
    },
  },
];

const buildInitialSlots = (): ExampleSlot[] =>
  examplePresets.map((preset) => ({
    slug: preset.slug,
    typeLabel: preset.typeLabel,
    heading: preset.heading,
    subheading: preset.subheading,
    html: buildFallbackExampleHtml(preset, preset.details),
  }));

export const Examples: React.FC = () => {
  const [examples, setExamples] = useState<ExampleSlot[]>(buildInitialSlots);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainPreviewRef = useRef<HTMLDivElement | null>(null);
  const [mainPreviewScale, setMainPreviewScale] = useState(0.8);

  useEffect(() => {
    if (activeIndex > examples.length - 1) {
      setActiveIndex(0);
      return;
    }
  }, [examples, activeIndex]);

  useEffect(() => {
    const node = mainPreviewRef.current;
    if (!node) return;

    const updateScale = () => {
      const { clientWidth, clientHeight } = node;
      if (!clientWidth || !clientHeight) return;
      const widthScale = clientWidth / EXAMPLE_VIEWPORT_WIDTH;
      const heightScale = clientHeight / EXAMPLE_VIEWPORT_HEIGHT;
      setMainPreviewScale(Math.min(widthScale, heightScale));
    };

    updateScale();

    const observer = new ResizeObserver(() => updateScale());
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const goToPrevious = () => {
    if (examples.length <= 1) return;
    setActiveIndex((prev) => (prev <= 0 ? examples.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (examples.length <= 1) return;
    setActiveIndex((prev) => (prev === examples.length - 1 ? 0 : prev + 1));
  };

  const previousIndex = examples.length <= 1 ? -1 : activeIndex <= 0 ? examples.length - 1 : activeIndex - 1;
  const nextIndex = examples.length <= 1 ? -1 : activeIndex === examples.length - 1 ? 0 : activeIndex + 1;

  return (
    <div className="bg-[#09090d] text-white">
      <section className="relative overflow-hidden px-4 pt-18 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.14),transparent_24%),linear-gradient(180deg,#09090d_0%,#0d0d12_48%,#09090d_100%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">Examples</p>
          <div className="mt-4 flex flex-col gap-6 border-b border-white/8 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
                See example websites built for different restaurants.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/62">
                Three distinct directions, each styled around a different kind of restaurant.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-10">
            <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-6">
              <div>
                {examples[activeIndex] && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200/90">
                      {examples[activeIndex].typeLabel}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                      {examples[activeIndex].heading}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/54">
                      {examples[activeIndex].subheading}
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={examples.length <= 1}
                  className="inline-flex h-11 w-11 items-center justify-center border border-white/10 text-white/72 transition hover:border-white/18 hover:text-white disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={examples.length <= 1}
                  className="inline-flex h-11 w-11 items-center justify-center border border-white/10 text-white/72 transition hover:border-white/18 hover:text-white disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden py-4">
                {previousIndex >= 0 && examples[previousIndex]?.html && (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(previousIndex)}
                    className="absolute left-0 top-1/2 z-0 hidden h-[360px] w-[22%] -translate-y-1/2 overflow-hidden border border-white/8 bg-[#0d0e13] opacity-20 blur-[1px] transition hover:opacity-30 xl:block"
                  >
                    <div className="flex h-full w-full items-start justify-center overflow-hidden bg-[#0b0c10]">
                      <iframe
                        title={`${examples[previousIndex].heading} preview`}
                        srcDoc={examples[previousIndex].html || ''}
                        loading="lazy"
                        className="border-0 bg-[#0b0c10] pointer-events-none"
                        style={{
                          width: `${EXAMPLE_VIEWPORT_WIDTH}px`,
                          height: `${EXAMPLE_VIEWPORT_HEIGHT}px`,
                          transform: 'scale(0.24)',
                          transformOrigin: 'top center',
                        }}
                      />
                    </div>
                  </button>
                )}

                {nextIndex >= 0 && examples[nextIndex]?.html && (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(nextIndex)}
                    className="absolute right-0 top-1/2 z-0 hidden h-[360px] w-[22%] -translate-y-1/2 overflow-hidden border border-white/8 bg-[#0d0e13] opacity-20 blur-[1px] transition hover:opacity-30 xl:block"
                  >
                    <div className="flex h-full w-full items-start justify-center overflow-hidden bg-[#0b0c10]">
                      <iframe
                        title={`${examples[nextIndex].heading} preview`}
                        srcDoc={examples[nextIndex].html || ''}
                        loading="lazy"
                        className="border-0 bg-[#0b0c10] pointer-events-none"
                        style={{
                          width: `${EXAMPLE_VIEWPORT_WIDTH}px`,
                          height: `${EXAMPLE_VIEWPORT_HEIGHT}px`,
                          transform: 'scale(0.24)',
                          transformOrigin: 'top center',
                        }}
                      />
                    </div>
                  </button>
                )}

                <article className="relative z-10 mx-auto w-full max-w-[1200px]">
                  <div className="overflow-hidden border border-white/10 bg-[#0d0e13] shadow-[0_30px_120px_rgba(0,0,0,0.26)]">
                    <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.02] px-4 py-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span className="ml-3 text-[11px] uppercase tracking-[0.18em] text-white/42">
                        Live generated output
                      </span>
                    </div>
                    <div
                      ref={mainPreviewRef}
                      className="aspect-[64/45] w-full overflow-hidden bg-[#0b0c10]"
                    >
                      {examples[activeIndex]?.html ? (
                        <div className="flex h-full w-full items-start justify-center overflow-hidden bg-[#0b0c10]">
                          <iframe
                            title={`${examples[activeIndex].heading} generated website`}
                            srcDoc={examples[activeIndex].html || ''}
                            loading="lazy"
                            className="border-0 bg-[#0b0c10]"
                            style={{
                              width: `${EXAMPLE_VIEWPORT_WIDTH}px`,
                              height: `${EXAMPLE_VIEWPORT_HEIGHT}px`,
                              transform: `scale(${mainPreviewScale})`,
                              transformOrigin: 'top center',
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 sm:pb-28">
        <div className="mx-auto max-w-5xl border-t border-white/8 pt-12 text-center">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Ready to make one for your restaurant?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(249,115,22,0.28)] transition hover:from-orange-400 hover:to-amber-400"
            >
              Create Website
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
