import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';

const comparisonRows = [
  { feature: 'Generate website', free: true, pro: true },
  { feature: 'Download HTML', free: true, pro: true },
  { feature: 'Use your own domain', free: true, pro: true },
  { feature: 'Hosted publish with Vercel', free: false, pro: true },
  { feature: 'Remove branding', free: true, pro: true },
  { feature: '24/7 support', free: true, pro: true },
];

const faqs = [
  {
    question: 'Do I need coding experience?',
    answer: 'No. Synthr builds your site from your restaurant details, so you can launch without touching code.',
  },
  {
    question: 'Can I use my own domain?',
    answer: 'Yes. You can use your own domain on both plans. Pro also gives you a simpler hosted path when you want to go live faster.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. You can upgrade, downgrade, or cancel whenever you need to.',
  },
  {
    question: 'How fast can I launch my site?',
    answer: 'Most restaurants can generate a site in minutes and publish as soon as they are ready.',
  },
  {
    question: 'Does Synthr take commissions?',
    answer: 'No. Synthr does not take a cut of your revenue.',
  },
];

const surfaceClass =
  'rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.30)]';

const PlanFeature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3 text-sm text-white/68">
    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.08] text-orange-200">
      <Check size={14} />
    </span>
    <span>{children}</span>
  </li>
);

export const Pricing: React.FC = () => {
  return (
    <div className="bg-[#09090d] text-white">
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_28%),linear-gradient(180deg,#09090d_0%,#0d0d12_46%,#09090d_100%)]" />
        <div className="absolute left-1/2 top-14 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Pricing</p>
          <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
            Simple pricing to grow your restaurant online.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/62">
            Launch your website, get more customers, and keep more of your revenue.
          </p>
          <p className="mt-3 text-sm font-medium text-white/46">
            Start free, get traction, and upgrade only when going live is easier.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <article className={`${surfaceClass} p-8`}>
            <div className="flex min-h-full flex-col">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200/78">Free</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">Free</span>
                </div>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
                  Get started, launch fast, and build traction on your own terms.
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                <PlanFeature>Generate AI website</PlanFeature>
                <PlanFeature>Live preview</PlanFeature>
                <PlanFeature>Download HTML</PlanFeature>
                <PlanFeature>Use your own domain</PlanFeature>
                <PlanFeature>No Synthr branding</PlanFeature>
                <PlanFeature>24/7 support</PlanFeature>
              </ul>

              <div className="mt-10 pt-2">
                <Link
                  to="/create"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  Get started
                </Link>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[32px] border border-orange-300/18 bg-[linear-gradient(180deg,rgba(249,115,22,0.12),rgba(255,255,255,0.04))] p-8 shadow-[0_30px_120px_rgba(249,115,22,0.18)] sm:p-10">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/80 to-transparent" />
            <div className="flex min-h-full flex-col">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-100">Pro</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-white">$15</span>
                  <span className="pb-1 text-sm text-white/56">/month</span>
                </div>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/64">
                  Go live faster with hosted publishing and simple editing when you are ready.
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                <PlanFeature>Publish your website</PlanFeature>
                <PlanFeature>Free hosting with Vercel or use your own domain</PlanFeature>
                <PlanFeature>No Synthr branding</PlanFeature>
                <PlanFeature>Basic editing</PlanFeature>
                <PlanFeature>24/7 support</PlanFeature>
              </ul>

              <div className="mt-10 pt-2">
                <Link
                  to="/create"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(249,115,22,0.28)] transition hover:from-orange-400 hover:to-amber-400"
                >
                  Publish my site
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className={`${surfaceClass} mx-auto max-w-5xl p-6 sm:p-8`}>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Compare plans</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">
                Choose the plan that fits how you want to launch.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/52">
              Free is enough to start fast and get your site out there. Pro is there when you want hosted publishing and a smoother path to going live.
            </p>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/10">
            <div className="grid grid-cols-[1.3fr_0.7fr_0.7fr] bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white/54 sm:px-6">
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center">Pro</span>
            </div>
            {comparisonRows.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[1.3fr_0.7fr_0.7fr] items-center px-4 py-4 text-sm sm:px-6 ${index !== comparisonRows.length - 1 ? 'border-t border-white/8' : ''}`}
              >
                <span className="pr-4 font-medium text-white/84">{row.feature}</span>
                <span className="flex justify-center">
                  {row.free ? <Check size={18} className="text-emerald-300" /> : <X size={18} className="text-white/24" />}
                </span>
                <span className="flex justify-center">
                  {row.pro ? <Check size={18} className="text-emerald-300" /> : <X size={18} className="text-white/24" />}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-orange-300/14 bg-gradient-to-r from-orange-500/10 to-amber-500/8 px-8 py-10 text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
            Stop losing money to commissions.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/62">
            With Synthr, you own your website and your customers. No third-party platforms taking a cut of your revenue.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Everything you need to know</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className={`${surfaceClass} p-6`}>
                <h3 className="text-base font-semibold text-white">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-4xl rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-8 py-12 text-center shadow-[0_30px_120px_rgba(0,0,0,0.32)]">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white">
            Start growing your restaurant today.
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/create"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(249,115,22,0.28)] transition hover:from-orange-400 hover:to-amber-400 sm:w-auto"
            >
              Get started for free
            </Link>
            <Link
              to="/create"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.05] sm:w-auto"
            >
              Publish with Pro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
