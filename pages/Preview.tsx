import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessDetails } from '../types';
import { generateWebsiteHtml } from '../services/generatorService';
import { requestAssistantResponse } from '../services/assistantService';
import { ArrowLeft, Send, Sparkles, RefreshCw, Smartphone, Monitor, Loader2, Upload, X } from 'lucide-react';

export const Preview: React.FC<{ details: BusinessDetails | null }> = ({ details }) => {
  const navigate = useNavigate();
  const [html, setHtml] = useState<string>('');
  const [request, setRequest] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { id: string; role: 'user' | 'assistant'; content: string; imageUrl?: string }[]
  >([
    {
      id: 'assistant-welcome',
      role: 'assistant',
      content:
        'Hi! Tell me what you want to change and I will update the preview. You can ask for layout tweaks, tone changes, new sections, or a more modern look.',
    },
  ]);
  const [pendingImage, setPendingImage] = useState<{ name: string; dataUrl: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [publishSubmitted, setPublishSubmitted] = useState(false);
  const [publishForm, setPublishForm] = useState({ name: '', email: '', business: '' });
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const performGeneration = async (instruction?: string, assistantImage?: string | null) => {
    if (!details) return;
    setIsUpdating(true);
    setError(null);

    try {
      console.log('Starting generation...');
      const result = await generateWebsiteHtml(details, instruction, html, assistantImage || undefined);
      console.log('Generation complete, HTML length:', result?.length);
      setHtml(result);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Generation failed:', errorMsg);
      setError(errorMsg);
      setHtml('');
    } finally {
      setIsUpdating(false);
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isAssistantTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPendingImage(null);
      setUploadError('Please upload a valid image file.');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setPendingImage(null);
      setUploadError('Please choose an image under 6MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        setUploadError('Unable to read that image. Try another file.');
        return;
      }
      setPendingImage({ name: file.name, dataUrl });
      setUploadError(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendMessage = async () => {
    if (!details) return;
    const trimmed = request.trim();
    if (!trimmed && !pendingImage) return;

    const imageData = pendingImage?.dataUrl;
    const effectiveInstruction =
      trimmed ||
      (imageData
        ? 'Use the uploaded image as the hero background with a dark overlay for readability. Keep all other sections unchanged.'
        : '');
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: trimmed || 'Shared an image to use on the page.',
      imageUrl: imageData,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setRequest('');
    setPendingImage(null);
    setIsAssistantTyping(true);
    setIsSending(true);

    const assistantPromise = requestAssistantResponse({
      messages: nextMessages
        .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
        .slice(-8)
        .map((msg) => ({ role: msg.role, content: msg.content })),
      details,
      imageData: imageData ?? null,
    });

    const updatePromise = effectiveInstruction
      ? performGeneration(effectiveInstruction, imageData)
      : Promise.resolve();

    try {
      const [assistantResult] = await Promise.allSettled([assistantPromise, updatePromise]);
      const assistantReply = assistantResult.status === 'fulfilled' ? assistantResult.value : '';
      const replyText =
        assistantReply ||
        'I have queued the update. If you want anything else adjusted, tell me the section or style to change.';
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', content: replyText },
      ]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: `I ran into a problem responding just now. ${errorMsg}`,
        },
      ]);
    } finally {
      setIsAssistantTyping(false);
      setIsSending(false);
    }
  };

  const openPublishModal = () => {
    setPublishForm({ name: '', email: '', business: '' });
    setPublishSubmitted(false);
    setIsPublishOpen(true);
  };

  const handlePublishSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!publishForm.name.trim() || !publishForm.email.trim()) return;
    setPublishSubmitted(true);
  };

  if (!details) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 text-slate-600">
        Preparing your preview...
      </div>
    );
  }

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
            {viewMode === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
            )}

            {isUpdating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-slate-600">
                <Loader2 className="animate-spin mb-4 text-indigo-600" size={48} />
                <p className="font-bold text-xl">
                  Updating preview
                  <span className="inline-flex ml-2">
                    <span className="animate-pulse" style={{ animationDelay: '0ms' }}>
                      .
                    </span>
                    <span className="animate-pulse" style={{ animationDelay: '150ms' }}>
                      .
                    </span>
                    <span className="animate-pulse" style={{ animationDelay: '300ms' }}>
                      .
                    </span>
                  </span>
                </p>
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
          <div className="flex items-center gap-2 text-indigo-800 font-semibold mb-4">
            <Sparkles size={16} />
            <span>AI Assistant</span>
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="Uploaded preview"
                      className="w-full max-w-[220px] rounded-xl mb-3 border border-slate-200"
                    />
                  )}
                  {message.content}
                </div>
              </div>
            ))}

            {isAssistantTyping && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm bg-slate-100 text-slate-700 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={14} />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Suggestions</p>
            {[
              'Improve the menu layout with cards',
              'Make the hero section more dramatic',
              'Add a chef spotlight section',
              'Switch to warmer colors',
              'Make it minimal and modern',
            ].map((suggestion) => (
              <button
                key={suggestion}
                disabled={isUpdating || isAssistantTyping}
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
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</label>
            {pendingImage && (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                <img
                  src={pendingImage.dataUrl}
                  alt="Pending upload"
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                />
                <div className="flex-1 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">{pendingImage.name}</p>
                  <p>Ready to send with your message.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingImage(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="relative">
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSendMessage();
                  }
                }}
                placeholder="Describe your changes or ask for help..."
                className="w-full p-4 pl-12 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-28 text-sm shadow-sm bg-white"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 left-3 p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 bg-white"
                disabled={isAssistantTyping}
              >
                <Upload size={16} />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={(!request.trim() && !pendingImage) || isAssistantTyping || isSending}
                className="absolute bottom-3 right-3 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isAssistantTyping || isSending ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <Send size={16} />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
            {uploadError && <p className="text-xs text-rose-600">{uploadError}</p>}
          </div>

          <button
            onClick={openPublishModal}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
          >
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

      {isPublishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Publish Your Website</h2>
              <button
                onClick={() => setIsPublishOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
                aria-label="Close publish modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {!publishSubmitted ? (
                <>
                  <p className="text-sm text-slate-600">To publish your website, please contact our team.</p>
                  <form className="space-y-4" onSubmit={handlePublishSubmit}>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600">Name *</label>
                      <input
                        type="text"
                        required
                        value={publishForm.name}
                        onChange={(e) => setPublishForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600">Email *</label>
                      <input
                        type="email"
                        required
                        value={publishForm.email}
                        onChange={(e) => setPublishForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="you@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600">Business Name (Optional)</label>
                      <input
                        type="text"
                        value={publishForm.business}
                        onChange={(e) => setPublishForm((prev) => ({ ...prev, business: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Business name"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
                    >
                      Request Access
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-3 py-6">
                  <h3 className="text-lg font-semibold text-slate-800">Thanks! We'll reach out soon.</h3>
                  <p className="text-sm text-slate-600">
                    Our team will review your request and contact you with next steps.
                  </p>
                  <button
                    onClick={() => setIsPublishOpen(false)}
                    className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
