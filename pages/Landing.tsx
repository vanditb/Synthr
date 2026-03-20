import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Globe,
  LayoutTemplate,
  MonitorSmartphone,
  RefreshCcw,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

type ShowcaseItem = {
  key: string;
  label: string;
  title: string;
  description: string;
  chips: string[];
  image: string;
  mobileImage: string;
  brand: string;
  accent: string;
  glow: string;
  siteTitle: string;
  nav: string[];
};

const showcaseItems: ShowcaseItem[] = [
  {
    key: 'fine-dining',
    label: 'Fine Dining',
    title: 'A fine dining site built for reservations.',
    description: 'Elegant menus, private dining details, and booking prompts that feel considered.',
    chips: ['Tasting Menu', 'Wine Pairings', 'Reservations'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
    brand: 'Atelier No. 9',
    accent: 'from-amber-300 via-orange-300 to-rose-300',
    glow: 'bg-orange-400/20',
    siteTitle: 'Atelier No. 9',
    nav: ['Menu', 'Story', 'Reserve'],
  },
  {
    key: 'cafe',
    label: 'Cafe',
    title: 'A cafe site designed for daily traffic.',
    description: 'Hours, pickup, and menu highlights stay visible for regulars and walk-ins.',
    chips: ['Breakfast', 'Pickup', 'Seasonal Drinks'],
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80',
    brand: 'Northline Cafe',
    accent: 'from-sky-300 via-cyan-300 to-teal-300',
    glow: 'bg-cyan-400/20',
    siteTitle: 'Northline Cafe',
    nav: ['Menu', 'Hours', 'Visit'],
  },
  {
    key: 'bakery',
    label: 'Bakery',
    title: 'A bakery site built for pickup and preorders.',
    description: 'Daily bakes, cake orders, and pickup windows are easy to browse fast.',
    chips: ['Daily Bakes', 'Cake Orders', 'Pickup'],
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    brand: 'Flour & Bloom',
    accent: 'from-rose-300 via-orange-200 to-amber-200',
    glow: 'bg-rose-400/20',
    siteTitle: 'Flour & Bloom',
    nav: ['Order', 'Cakes', 'Hours'],
  },
  {
    key: 'pizzeria',
    label: 'Pizzeria',
    title: 'A pizzeria site made for quick decisions.',
    description: 'Big menu moments, direct ordering, and clear location details help drive orders.',
    chips: ['Order Direct', 'Lunch Specials', 'Slices'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=900&q=80',
    brand: 'Brick Alley Pizza',
    accent: 'from-red-300 via-orange-300 to-amber-300',
    glow: 'bg-red-400/20',
    siteTitle: 'Brick Alley Pizza',
    nav: ['Menu', 'Order', 'Location'],
  },
  {
    key: 'cocktail-bar',
    label: 'Cocktail Bar',
    title: 'A cocktail bar site built for nights out.',
    description: 'Events, table bookings, and moody visuals make the evening plan feel real.',
    chips: ['Late Night', 'Private Tables', 'Live Sets'],
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80',
    brand: 'Velvet Hour',
    accent: 'from-fuchsia-300 via-violet-300 to-indigo-300',
    glow: 'bg-fuchsia-400/20',
    siteTitle: 'Velvet Hour',
    nav: ['Cocktails', 'Events', 'Reserve'],
  },
];

const capabilityPanels = [
  {
    title: 'Add your details',
    subtitle: 'Menu, hours, bookings, location.',
    icon: WandSparkles,
  },
  {
    title: 'Get a site back',
    subtitle: 'Real pages, not a rough draft.',
    icon: LayoutTemplate,
  },
  {
    title: 'Keep refining',
    subtitle: 'Edit sections, regenerate, publish.',
    icon: RefreshCcw,
  },
];

const capabilityCards = [
  {
    title: 'Copy written for your brand',
    body: 'Menus, story, and booking sections written in the style you choose.',
    icon: Sparkles,
  },
  {
    title: 'Menus and pages built for you',
    body: 'Hours, contact, ordering, and reservations are already structured.',
    icon: LayoutTemplate,
  },
  {
    title: 'Looks great on any screen',
    body: 'The site feels polished on desktop and mobile from the first pass.',
    icon: MonitorSmartphone,
  },
];

const workflowCards = [
  {
    title: 'Publish fast',
    description: 'Launch on a Synthr subdomain in a few clicks.',
    meta: 'marea.synthr.site',
  },
  {
    title: 'Bring your own domain',
    description: 'Connect your restaurant domain when you are ready.',
    meta: 'www.mareanyc.com',
  },
  {
    title: 'Keep improving',
    description: 'Update sections and regenerate layouts without rebuilding from scratch.',
    meta: '“Make it warmer and more reservation-focused”',
  },
];

const surfaceClass =
  'rounded-[30px] bg-white/[0.04] backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.30)]';

const BrowserFrame = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#101116] shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
    <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>
      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/48">
        {title}
      </span>
    </div>
    {children}
  </div>
);

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const active = showcaseItems[activeIndex];

  return (
    <div className="bg-[#09090d] text-white">
      <section className="relative overflow-hidden px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.20),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.12),transparent_22%),linear-gradient(180deg,#09090d_0%,#0d0d12_46%,#0a0a0f_100%)]" />
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute right-12 top-24 h-48 w-48 rounded-full bg-orange-300/8 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl">
            <h1 className="max-w-lg text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Build your restaurant website in minutes.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/62">
              Add your menu, hours, and brand. Synthr turns it into a polished site you can publish fast.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate('/create')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(249,115,22,0.28)] transition hover:from-orange-400 hover:to-amber-400"
              >
                Generate my site
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                View examples
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/58">
              {['No commissions', 'Custom domains', 'Menus, bookings, direct traffic'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-8 hidden h-36 w-36 rounded-full bg-orange-400/14 blur-3xl lg:block" />
            <div className="absolute -right-4 bottom-8 hidden h-36 w-36 rounded-full bg-amber-300/12 blur-3xl lg:block" />

            <BrowserFrame title="Synthr Preview">
              <div className="grid gap-4 p-4 lg:grid-cols-[1.05fr_0.95fr] lg:p-5">
                <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#121319]">
                  <div
                    className="relative h-[400px] bg-cover bg-center"
                    style={{
                      backgroundImage:
                        'linear-gradient(180deg,rgba(10,10,14,0.08),rgba(10,10,14,0.68)), url("https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1600&q=80")',
                    }}
                  >
                    <div className="flex items-center justify-between px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/60">
                      <span>Marea House</span>
                      <div className="flex gap-4">
                        <span>Menu</span>
                        <span>Story</span>
                        <span>Reserve</span>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="max-w-md rounded-[24px] bg-[#0c0d11]/70 p-5 backdrop-blur-xl">
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                          Coastal plates, candlelight tables, and reservations every night.
                        </h2>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {['Reserve now', 'View menu', 'Private dining'].map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs text-white/72"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3 border-t border-white/8 bg-[#0f1015] p-4 sm:grid-cols-3">
                    {[
                      'Signature menu',
                      'Private dining',
                      'Hours and location',
                    ].map((item) => (
                      <div key={item} className="rounded-2xl bg-white/[0.03] px-4 py-4 text-sm text-white/70">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[28px] bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">Business info</p>
                    <div className="mt-4 space-y-3">
                      {['Cuisine: Italian seafood', 'Tone: Refined', 'Style: Luxury', 'Pages: Home, Menu, Contact'].map((item) => (
                        <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/68">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">AI actions</p>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/72">
                        “Make it warmer and more reservation-focused.”
                      </div>
                      <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/8 p-4 text-sm text-emerald-100">
                        Updated hero, CTA placement, menu highlights, and mobile layout.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">Publish state</p>
                    <div className="mt-4 rounded-[24px] border border-orange-300/18 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">marea.synthr.site</p>
                          <p className="mt-1 text-xs text-white/52">Ready to go live</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-950">
                          Publish
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BrowserFrame>
          </div>
        </div>
      </section>

      <section id="showcase" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Showcase</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Built for every kind of restaurant.
            </h2>
          </div>

          <div className={`${surfaceClass} overflow-hidden`}>
            <div className="grid gap-0 lg:grid-cols-[0.24fr_0.28fr_0.48fr]">
              <div className="border-b border-white/8 p-3 lg:border-b-0 lg:border-r">
                <p className="px-3 pb-3 text-[11px] uppercase tracking-[0.2em] text-white/42">Restaurant type</p>
                <div className="grid gap-2">
                  {showcaseItems.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        aria-selected={isActive}
                        onClick={() => setActiveIndex(index)}
                        className={`rounded-[22px] border px-4 py-4 text-left transition ${
                          isActive
                            ? 'border-orange-300/28 bg-white/[0.08] text-white shadow-[0_12px_30px_rgba(249,115,22,0.10)]'
                            : 'border-white/8 bg-white/[0.02] text-white/52 hover:border-white/16 hover:bg-white/[0.04] hover:text-white/78'
                        }`}
                      >
                        <p className="text-base font-semibold">{item.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-b border-white/8 p-6 lg:border-b-0 lg:border-r lg:p-8">
                <div className="flex h-full flex-col">
                  <div>
                    <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">{active.title}</h3>
                    <div className="mt-5 flex flex-wrap gap-2">
                    {active.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70"
                      >
                        {chip}
                      </span>
                    ))}
                    </div>
                    <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">{active.description}</p>
                  </div>

                  <div className="mt-8 grid gap-3">
                    <div className="rounded-[24px] bg-white/[0.03] p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">Site focus</p>
                      <p className="mt-3 text-sm leading-6 text-white/72">
                        {active.label === 'Fine Dining' && 'Reservations, tasting menus, private dining.'}
                        {active.label === 'Cafe' && 'Hours, pickup, neighborhood traffic.'}
                        {active.label === 'Bakery' && 'Daily bakes, preorder flows, pickup.'}
                        {active.label === 'Pizzeria' && 'Direct ordering, menu scanning, location.'}
                        {active.label === 'Cocktail Bar' && 'Events, reservations, late-night traffic.'}
                      </p>
                    </div>
                    <div
                      className="h-36 rounded-[24px] bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(180deg,rgba(9,9,13,0.18),rgba(9,9,13,0.62)), url("${active.mobileImage}")`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 lg:p-6">
                <div className="relative">
                  <div className={`absolute -right-4 -top-2 h-28 w-28 rounded-full ${active.glow} blur-3xl`} />
                  <div className={`rounded-[30px] bg-gradient-to-br ${active.accent} p-[1px] transition-all duration-500`}>
                    <div className="rounded-[29px] bg-[#0f1015] p-4 lg:p-5">
                      <BrowserFrame title={active.brand}>
                        <div className="relative h-[430px] overflow-hidden bg-[#121319]">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                            style={{
                              backgroundImage: `linear-gradient(180deg,rgba(9,9,13,0.10),rgba(9,9,13,0.72)), url("${active.image}")`,
                            }}
                          />

                          <div className="relative flex items-center justify-between px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-white/58">
                            <span>{active.siteTitle}</span>
                            <div className="flex gap-4">
                              {active.nav.map((item) => (
                                <span key={item}>{item}</span>
                              ))}
                            </div>
                          </div>

                          <div className="relative flex h-full items-end p-5">
                            <div className="grid w-full gap-4 lg:grid-cols-[1fr_170px]">
                              <div className="rounded-[26px] bg-[#0b0c10]/70 p-5 backdrop-blur-xl">
                                <h4 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                  {active.label === 'Fine Dining' && 'A richer homepage for premium reservations.'}
                                  {active.label === 'Cafe' && 'A cleaner site for regulars and rush hours.'}
                                  {active.label === 'Bakery' && 'Daily bakes and cake orders, framed beautifully.'}
                                  {active.label === 'Pizzeria' && 'Menu-first pages built for direct orders.'}
                                  {active.label === 'Cocktail Bar' && 'Nightlife atmosphere with booking built in.'}
                                </h4>
                                <div className="mt-5 flex flex-wrap gap-2">
                                  {active.chips.slice(0, 3).map((chip) => (
                                    <span
                                      key={chip}
                                      className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs text-white/72"
                                    >
                                      {chip}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="mx-auto w-full max-w-[180px] lg:max-w-none">
                                <div className="rounded-[28px] border border-white/12 bg-[#0c0d11] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                                  <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#111217]">
                                    <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-white/15" />
                                  <div
                                    className="mt-3 h-[250px] bg-cover bg-center"
                                    style={{
                                      backgroundImage: `linear-gradient(180deg,rgba(9,9,13,0.05),rgba(9,9,13,0.60)), url("${active.mobileImage}")`,
                                    }}
                                  />
                                  <div className="border-t border-white/8 bg-white/[0.03] px-3 py-3 text-center text-xs text-white/58">
                                    Mobile preview
                                  </div>
                                </div>
                              </div>
                            </div>
                            </div>
                          </div>
                        </div>
                      </BrowserFrame>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-white/8 px-6 py-4">
              {showcaseItems.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  aria-label={`Go to ${item.label}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex ? 'w-10 bg-orange-300' : 'w-2.5 bg-white/20 hover:bg-white/42'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className={`${surfaceClass} overflow-hidden p-6 lg:p-8`}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Product view</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
                    Add your details. Get a site back.
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.48fr_0.52fr]">
                <div className="space-y-5">
                  {capabilityPanels.map((panel) => {
                    const Icon = panel.icon;
                    return (
                      <div key={panel.title} className="py-1">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-orange-200">
                          <Icon size={20} />
                        </div>
                        <h3 className="mt-5 text-xl font-semibold text-white">{panel.title}</h3>
                        <p className="mt-2 text-sm text-white/58">{panel.subtitle}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-[28px] border border-white/8 bg-[#111217] p-4">
                  <div className="rounded-[24px] bg-white/[0.03] p-4">
                    <div className="grid gap-3">
                      {['Restaurant name', 'Cuisine and price range', 'Menu items and hours', 'Style and tone'].map((row, index) => (
                        <div
                          key={row}
                          className={`rounded-2xl px-4 py-3 text-sm ${
                            index === 2
                              ? 'border border-orange-300/20 bg-orange-400/8 text-orange-100'
                              : 'bg-white/[0.03] text-white/66'
                            }`}
                        >
                          {row}
                        </div>
                      ))}
                    </div>
                    <div className="my-4 flex items-center justify-center">
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/48">
                        Generate with AI
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-[24px] border border-white/8">
                      <div
                        className="h-[270px] bg-cover bg-center"
                        style={{
                          backgroundImage:
                            'linear-gradient(180deg,rgba(9,9,13,0.12),rgba(9,9,13,0.72)), url("https://images.unsplash.com/photo-1552566626-52f8b29e368c?auto=format&fit=crop&w=1600&q=80")',
                        }}
                      >
                        <div className="flex h-full items-end p-4">
                          <div className="rounded-[22px] border border-white/12 bg-[#0b0c10]/68 p-4 backdrop-blur-xl">
                            <p className="mt-3 text-xl font-semibold text-white">
                              A publish-ready homepage, menu, story, and contact flow.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              {capabilityCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className={`${surfaceClass} overflow-hidden p-5`}>
                    <div className="grid gap-5 sm:grid-cols-[0.38fr_0.62fr] sm:items-center">
                      <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-orange-200">
                          <Icon size={18} />
                        </div>
                        <div className="mt-5 space-y-2">
                          <div className="h-2 rounded-full bg-white/12" />
                          <div className="h-2 w-4/5 rounded-full bg-white/10" />
                          <div className="h-16 rounded-[18px] border border-white/8 bg-white/[0.03]" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-white/60">{card.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Go live</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Generate it. Refine it. Publish it.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {workflowCards.map((card, index) => (
              <div key={card.title} className={`${surfaceClass} overflow-hidden p-5`}>
                <div className="rounded-[24px] bg-[#111217] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200/80">
                      0{index + 1}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/48">
                      Workflow
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{card.description}</p>
                  <div className="mt-6 rounded-[22px] border border-orange-300/16 bg-gradient-to-r from-orange-500/8 to-amber-500/8 p-4 text-sm text-white/74">
                    {card.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {['Launch faster', 'Own your website', 'Avoid commissions', 'Stop waiting on agencies'].map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/62"
              >
                <Check size={15} className="text-orange-200" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4 pb-24 sm:px-6 sm:pb-28">
        <div className="mx-auto max-w-5xl rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-8 py-12 text-center shadow-[0_30px_120px_rgba(0,0,0,0.32)] sm:px-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Start now</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Build your restaurant website today.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/60">
            Enter your info, generate the site, and go live when it feels ready.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(249,115,22,0.28)] transition hover:from-orange-400 hover:to-amber-400"
            >
              Generate my site
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Explore publishing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
