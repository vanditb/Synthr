import React from 'react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="bg-white text-stone-900">
      <section className="px-4 pt-20 pb-16 sm:pt-28 sm:pb-20 border-b border-orange-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-orange-600 mb-4">
            About Synthr
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Grow your restaurant online without the extra work
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mb-8">
            Running a restaurant is already hard. Managing your online presence should not be.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold shadow-lg shadow-orange-200 hover:from-orange-700 hover:to-amber-700 transition"
          >
            Start growing your restaurant
          </Link>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16">
        <div className="max-w-5xl mx-auto grid gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3">The problem</h2>
            <ul className="space-y-3 text-stone-600">
              <li>Restaurant owners rely on third party apps that take high commissions.</li>
              <li>Many do not have a strong website.</li>
              <li>They miss customers searching online.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16 bg-amber-50">
        <div className="max-w-5xl mx-auto grid gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3">The solution</h2>
            <p className="text-stone-700 mb-5">
              Synthr helps restaurants turn their online presence into a growth engine.
            </p>
            <ul className="space-y-3 text-stone-600">
              <li>Launch a professional website in minutes.</li>
              <li>Showcase your menu.</li>
              <li>Get more direct orders.</li>
              <li>Avoid unnecessary fees.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16">
        <div className="max-w-5xl mx-auto grid gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Growth benefits</h2>
            <ul className="space-y-3 text-stone-600">
              <li>Get discovered by more local customers.</li>
              <li>Turn visitors into paying customers.</li>
              <li>Keep more of your revenue with no commissions.</li>
              <li>Build your brand instead of relying on third party platforms.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-3">Our mission</h2>
          <p className="text-stone-700 max-w-3xl">
            Our mission is simple. Help restaurants grow online, attract more customers, and take control of their business.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-3">Built with a simple idea</h2>
          <p className="text-stone-700 max-w-3xl">
            Synthr was started with a simple idea. Building a website should not be harder than running a restaurant.
            After seeing how many restaurants struggle with expensive developers and high commission platforms, we wanted
            to create something faster, simpler, and focused on growth.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20 border-t border-orange-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start growing your restaurant online today</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold shadow-lg shadow-orange-200 hover:from-orange-700 hover:to-amber-700 transition"
            >
              Get started
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition"
            >
              See examples
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
