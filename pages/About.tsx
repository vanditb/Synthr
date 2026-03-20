import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-[#09090d] text-white">
      <section className="relative overflow-hidden px-4 pt-20 pb-18 sm:px-6 sm:pt-28 sm:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_28%),linear-gradient(180deg,#09090d_0%,#0d0d12_45%,#09090d_100%)]" />
        <div className="absolute left-16 top-16 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute right-20 top-20 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">About Synthr</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
            Grow your restaurant online without the extra work.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
            Running a restaurant is already hard. Managing your online presence should not be.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(249,115,22,0.28)] transition hover:from-orange-400 hover:to-amber-400"
            >
              Start growing your restaurant
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

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">The problem</h2>
          <div className="mt-6 space-y-4 text-lg leading-8 text-white/64">
            <p>Restaurant owners rely on third-party apps that take high commissions.</p>
            <p>Many still do not have a strong website of their own.</p>
            <p>That means they miss customers who are searching online and ready to decide.</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">What Synthr does</h2>
          <div className="mt-6 space-y-4 text-lg leading-8 text-white/64">
            <p>Synthr helps restaurants turn their online presence into a growth engine.</p>
            <p>Launch a professional website in minutes, showcase your menu, get more direct orders, and avoid unnecessary fees.</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">Why it matters</h2>
          <div className="mt-6 space-y-4 text-lg leading-8 text-white/64">
            <p>Get discovered by more local customers.</p>
            <p>Turn visitors into paying customers.</p>
            <p>Keep more of your revenue with no commissions.</p>
            <p>Build your brand instead of relying on third-party platforms.</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">Our mission</h2>
          <p className="mt-6 text-lg leading-8 text-white/64">
            Our mission is simple. Help restaurants grow online, attract more customers, and take control of their business.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">Built with a simple idea</h2>
          <div className="mt-6 space-y-4 text-lg leading-8 text-white/64">
            <p>Synthr was started with a simple idea. Building a website should not be harder than running a restaurant.</p>
            <p>After seeing how many restaurants struggle with expensive developers and high commission platforms, we wanted to create something faster, simpler, and focused on growth.</p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6 pb-24 sm:px-6 sm:pb-28">
        <div className="mx-auto max-w-5xl rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-8 py-12 text-center shadow-[0_30px_120px_rgba(0,0,0,0.32)] sm:px-12 sm:py-16">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Start growing your restaurant online today.
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(249,115,22,0.28)] transition hover:from-orange-400 hover:to-amber-400"
            >
              Get started
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              See examples
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
