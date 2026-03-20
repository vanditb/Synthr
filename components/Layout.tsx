import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isPreview = location.pathname === '/preview';
  const isMarketingDark = ['/', '/about', '/pricing', '/create'].includes(location.pathname);

  if (isPreview) {
    return <main className="h-screen w-screen overflow-hidden bg-gray-50">{children}</main>;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isMarketingDark ? 'bg-[#09090d] text-white' : 'bg-white text-stone-900'}`}>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md ${
          isMarketingDark
            ? 'border-b border-white/8 bg-[#09090d]/72'
            : 'border-b border-orange-200 bg-white/95 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-orange-600 to-amber-600 text-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <UtensilsCrossed size={20} fill="currentColor" />
            </div>
            <span className={`font-bold text-xl tracking-tight ${isMarketingDark ? 'text-white' : 'text-stone-900'}`}>Synthr</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/pricing"
              className={`text-sm font-semibold transition ${isMarketingDark ? 'text-white/68 hover:text-white' : 'text-stone-700 hover:text-stone-900'}`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold transition ${isMarketingDark ? 'text-white/68 hover:text-white' : 'text-stone-700 hover:text-stone-900'}`}
            >
              About
            </Link>
            {location.pathname !== '/create' && (
              <Link
                to="/create"
                className={`text-sm font-semibold text-white px-6 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 ${
                  isMarketingDark
                    ? 'border border-white/10 bg-white/[0.06] hover:bg-white/[0.10]'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg shadow-orange-200'
                }`}
              >
                Create Website
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        {children}
      </main>
      <footer
        className={`py-8 text-center text-sm ${
          isMarketingDark
            ? 'border-t border-white/8 bg-[#09090d] text-white/48'
            : 'border-t border-orange-100 bg-gradient-to-b from-white to-amber-50 text-stone-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
           <p>© {new Date().getFullYear()} Synthr. The AI website builder for restaurants. Built for busy kitchen owners.</p>
        </div>
      </footer>
    </div>
  );
};
