import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessDetails } from '../types';
import { generateWebsiteHtml } from '../services/generatorService';
import { ArrowLeft, Send, Sparkles, RefreshCw, Smartphone, Monitor, Loader2 } from 'lucide-react';

const loadingMessages = [
  'Analyzing menu...',
  'Designing homepage...',
  'Writing restaurant copy...',
  'Optimizing layout...',
  'Adding finishing touches...'
];

export const Preview: React.FC<{ details: BusinessDetails | null }> = ({ details }) => {
  const navigate = useNavigate();
  const [html, setHtml] = useState<string>('');
  const [request, setRequest] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const performGeneration = async (instruction?: string) => {
    if (!details) return;
    setIsUpdating(true);
    setLoadingMessageIndex(0);
    setError(null);

    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 1200);

    try {
      console.log('Starting generation...');
      const result = await generateWebsiteHtml(details, instruction);
      console.log('Generation complete, HTML length:', result?.length);
      setHtml(result);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Generation failed:', errorMsg);
      setError(errorMsg);
      setHtml('');
    } finally {
      clearInterval(messageInterval);
      setIsUpdating(false);
      setRequest('');
    }
  };

  useEffect(() => {
    if (!details) {
      navigate('/create');
      return;
    }
    performGeneration();
  }, [details, navigate]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => {
      const next = mq.matches ? 'mobile' : 'desktop';
      setViewMode(next);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleUpdate = () => {
    if (!details || !request.trim()) return;
    performGeneration(request);
  };

  if (!details) return null;

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-slate-50">
      
      {/* LEFT PANEL: Preview */}
      <div className="w-full md:flex-1 bg-slate-100 flex flex-col relative md:order-2">
        
        {/* Device Toggle Toolbar */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-10">
          <button 
            onClick={() => navigate('/create')} 
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 md:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-4 md:mx-auto">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${viewMode === 'desktop' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Monitor size={18} /> Desktop
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${viewMode === 'mobile' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Smartphone size={18} /> Mobile
            </button>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-4 sm:p-8">
          <div 
            className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden relative ${
              viewMode === 'mobile' 
                ? 'w-[375px] h-[667px] rounded-[30px] border-[8px] border-slate-800' 
                : 'w-full h-full rounded-xl border border-slate-200'
            }`}
          >
            {/* Notch for mobile view */}
            {viewMode === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>}
            
            {isUpdating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-slate-600">
                <Loader2 className="animate-spin mb-4 text-indigo-600" size={48} />
                <p className="font-bold text-xl animate-pulse">{loadingMessages[loadingMessageIndex]}</p>
                <p className="text-sm opacity-70 mt-2">This usually takes 15-30 seconds</p>
              </div>
            )}

            {error && !isUpdating && (
              <div className="absolute inset-0 bg-red-50 z-30 flex flex-col items-center justify-center p-8 overflow-auto">
                <div className="max-w-md text-center">
                  <h3 className="font-bold text-lg text-red-900 mb-3">Generation Failed</h3>
                  <p className="text-sm text-red-800 mb-4 break-words">{error}</p>
                  <button
                    onClick={() => performGeneration()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            <iframe
              key={html.length}
              title="Website Preview"
              srcDoc={html}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: AI Editor */}
      <div className="w-full md:w-[420px] flex flex-col border-l border-slate-200 bg-white z-10 shadow-xl md:order-1">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <button onClick={() => navigate('/create')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hidden md:block">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-slate-800">AI Editor</h1>
        </div>

        {/* Chat / Request Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2 text-indigo-800 font-semibold">
              <Sparkles size={16} />
              <span>AI Assistant</span>
            </div>
            <p className="text-sm text-indigo-900/70 leading-relaxed">
              Your website is ready! Use the box below to make changes with AI. Try saying things like "Make it darker" or "Add more food images".
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Request Changes</label>
            <div className="relative">
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey && request.trim()) {
                    handleUpdate();
                  }
                }}
                placeholder="e.g. Make it dark mode, add a pricing table, change colors to warmer tones..."
                className="w-full p-4 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32 text-sm shadow-sm"
              />
              <button 
                onClick={handleUpdate}
                disabled={!request.trim() || isUpdating}
                className="absolute bottom-3 right-3 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isUpdating ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Suggestions</p>
            {[
              'Switch to dark mode',
              'Make it more upscale',
              'Add Chef\'s Special section',
              'Use warmer colors',
              'Make it minimal'
            ].map(suggestion => (
              <button
                key={suggestion}
                disabled={isUpdating}
                onClick={() => setRequest(suggestion)}
                className="block w-full text-left px-4 py-3 rounded-lg border border-slate-100 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition disabled:opacity-50"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
          <button className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
            Publish Website
          </button>
          <button
            onClick={() => navigate('/create')}
            className="w-full py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
          >
            Edit Details
          </button>
        </div>
      </div>

    </div>
  );
};
