import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isPreview = location.pathname === '/preview';

  if (isPreview) {
    return <main className="h-screen w-screen overflow-hidden bg-gray-50">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 font-sans">
      <nav className="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-orange-600 to-amber-600 text-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <UtensilsCrossed size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-stone-900">Synthr</span>
          </Link>
          <div className="flex gap-4">
             {location.pathname !== '/create' && (
                <Link 
                  to="/create" 
                  className="bg-gradient-to-r from-orange-600 to-amber-600 text-sm font-semibold text-white px-6 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-200"
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
      <footer className="border-t border-orange-100 py-8 text-center text-stone-600 text-sm bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
           <p>© {new Date().getFullYear()} Synthr. The AI website builder for restaurants. Built for busy kitchen owners.</p>
        </div>
      </footer>
    </div>
  );
};