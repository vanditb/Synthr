import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed, Clock, Sparkles } from 'lucide-react';

const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text.split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2;
    }, 80);

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    const timer = setTimeout(scramble, 500);
    return () => clearTimeout(timer);
  }, [scramble]);

  return <span>{displayText || ' '}</span>;
};

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section with Restaurant Background */}
      <section className="relative px-4 pt-20 pb-32 sm:pt-32 sm:pb-40 overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100">
        
        {/* Premium Restaurant Background Image */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1552566626-52f8b29e368c?w=1200&h=800&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>

        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-60"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-40 h-40 bg-orange-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-amber-300 rounded-full filter blur-3xl opacity-15"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-4 py-2 mb-8 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Restaurant AI</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-stone-900 mb-8 leading-[1.1] font-serif">
            Your restaurant, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              online in <ScrambleText text="seconds." />
            </span>
          </h1>
          
          <p className="text-xl text-stone-700 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Create a stunning restaurant website with your menu, hours, and photos. No coding required. AI-powered design that sells.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/create')}
              className="w-full sm:w-auto px-8 py-4 text-white rounded-xl font-semibold text-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transition-all hover:scale-[1.05] active:scale-95 shadow-xl shadow-orange-200 flex items-center justify-center gap-2 group"
            >
              Create My Restaurant Website 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/90 backdrop-blur-sm text-stone-900 border border-stone-300 rounded-xl font-semibold text-lg hover:bg-white transition-all flex items-center justify-center shadow-lg">
              See Examples
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-stone-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock size={16} className="text-orange-600" />
              </div>
              <span><span className="font-bold text-stone-900">5 minutes</span> to launch</span>
            </div>
            <div className="h-6 w-px bg-stone-300 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <UtensilsCrossed size={16} className="text-amber-600" />
              </div>
              <span>Perfect for <span className="font-bold text-stone-900">any cuisine</span></span>
            </div>
            <div className="h-6 w-px bg-stone-300 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-orange-600" />
              </div>
              <span>Powered by <span className="font-bold text-stone-900">AI</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Restaurant Focused */}
      <section className="py-24 bg-gradient-to-b from-white to-amber-50 border-t border-orange-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Why restaurants choose Synthr</h2>
            <p className="text-lg text-stone-600">Built specifically for busy restaurant owners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                <UtensilsCrossed size={32} />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">Menu Management</h3>
              <p className="text-stone-600 leading-relaxed">Add your entire menu with prices and descriptions. AI automatically organizes it beautifully by category.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-6 text-amber-600">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">Smart Hours & Services</h3>
              <p className="text-stone-600 leading-relaxed">Display your hours, services (dine-in, takeout, delivery), and contact info prominently. Customers find you instantly.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">AI-Powered Design</h3>
              <p className="text-stone-600 leading-relaxed">Tell the AI to redesign your site. Change colors, layout, tone, and more with simple text commands.</p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-12 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 text-center font-serif">No setup. No hosting. No headaches.</h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">5 min</div>
                <p className="text-orange-100">To launch your site</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">0 $</div>
                <p className="text-orange-100">Hidden fees or charges</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">∞</div>
                <p className="text-orange-100">Design changes with AI</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">📱</div>
                <p className="text-orange-100">Mobile optimized</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-stone-900 mb-6 font-serif">Ready to go online?</h2>
          <p className="text-xl text-stone-600 mb-12">Start building your restaurant website right now. It takes less time than your lunch rush.</p>
          <button 
            onClick={() => navigate('/create')}
            className="px-10 py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-700 transition-all hover:scale-[1.05] active:scale-95 shadow-xl shadow-orange-200 inline-flex items-center gap-2"
          >
            Create Your Website Now
            <ArrowRight size={22} />
          </button>
        </div>
      </section>
    </div>
  );
};