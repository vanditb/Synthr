"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const generatorService_1 = require("../services/generatorService");
const lucide_react_1 = require("lucide-react");
const loadingMessages = [
    'Analyzing menu...',
    'Designing homepage...',
    'Writing restaurant copy...',
    'Optimizing layout...',
    'Adding finishing touches...'
];
const Preview = ({ details }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [html, setHtml] = (0, react_1.useState)('');
    const [request, setRequest] = (0, react_1.useState)('');
    const [isUpdating, setIsUpdating] = (0, react_1.useState)(false);
    const [viewMode, setViewMode] = (0, react_1.useState)('desktop');
    const [loadingMessageIndex, setLoadingMessageIndex] = (0, react_1.useState)(0);
    const [error, setError] = (0, react_1.useState)(null);
    const performGeneration = async (instruction) => {
        if (!details)
            return;
        setIsUpdating(true);
        setLoadingMessageIndex(0);
        setError(null);
        // Cycle through loading messages
        const messageInterval = setInterval(() => {
            setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
        }, 1200);
        try {
            console.log('Starting generation...');
            const result = await (0, generatorService_1.generateWebsiteHtml)(details, instruction);
            console.log('Generation complete, HTML length:', result?.length);
            setHtml(result);
            setError(null);
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error('Generation failed:', errorMsg);
            setError(errorMsg);
            setHtml('');
        }
        finally {
            clearInterval(messageInterval);
            setIsUpdating(false);
            setRequest('');
        }
    };
    (0, react_1.useEffect)(() => {
        if (!details) {
            navigate('/create');
            return;
        }
        performGeneration();
    }, [details, navigate]);
    const handleUpdate = () => {
        if (!details || !request.trim())
            return;
        performGeneration(request);
    };
    if (!details)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-screen flex-col md:flex-row overflow-hidden bg-slate-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "w-full md:flex-1 bg-slate-100 flex flex-col relative md:order-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-10", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/create'), className: "p-2 hover:bg-slate-100 rounded-lg text-slate-500 md:hidden", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 md:mx-auto", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setViewMode('desktop'), className: `p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${viewMode === 'desktop' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Monitor, { size: 18 }), " Desktop"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setViewMode('mobile'), className: `p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${viewMode === 'mobile' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Smartphone, { size: 18 }), " Mobile"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-hidden flex items-center justify-center p-4 sm:p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: `bg-white shadow-2xl transition-all duration-500 overflow-hidden relative ${viewMode === 'mobile'
                                ? 'w-[375px] h-[667px] rounded-[30px] border-[8px] border-slate-800'
                                : 'w-full h-full rounded-xl border border-slate-200'}`, children: [viewMode === 'mobile' && (0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20" }), isUpdating && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-slate-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "animate-spin mb-4 text-indigo-600", size: 48 }), (0, jsx_runtime_1.jsx)("p", { className: "font-bold text-xl animate-pulse", children: loadingMessages[loadingMessageIndex] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm opacity-70 mt-2", children: "This usually takes 15-30 seconds" })] })), error && !isUpdating && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-red-50 z-30 flex flex-col items-center justify-center p-8 overflow-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-md text-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-lg text-red-900 mb-3", children: "Generation Failed" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800 mb-4 break-words", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => performGeneration(), className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold", children: "Try Again" })] }) })), (0, jsx_runtime_1.jsx)("iframe", { title: "Website Preview", srcDoc: html, className: "w-full h-full border-0 bg-white", sandbox: "allow-scripts" }, html.length)] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "w-full md:w-[420px] flex flex-col border-l border-slate-200 bg-white z-10 shadow-xl md:order-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-slate-100 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/create'), className: "p-2 hover:bg-slate-100 rounded-full text-slate-500 hidden md:block", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 20 }) }), (0, jsx_runtime_1.jsx)("h1", { className: "font-bold text-slate-800", children: "AI Editor" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 p-6 overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2 text-indigo-800 font-semibold", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: "AI Assistant" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-indigo-900/70 leading-relaxed", children: "Your website is ready! Use the box below to make changes with AI. Try saying things like \"Make it darker\" or \"Add more food images\"." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-semibold text-slate-700", children: "Request Changes" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("textarea", { value: request, onChange: (e) => setRequest(e.target.value), onKeyDown: (e) => {
                                                    if (e.key === 'Enter' && e.ctrlKey && request.trim()) {
                                                        handleUpdate();
                                                    }
                                                }, placeholder: "e.g. Make it dark mode, add a pricing table, change colors to warmer tones...", className: "w-full p-4 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32 text-sm shadow-sm" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleUpdate, disabled: !request.trim() || isUpdating, className: "absolute bottom-3 right-3 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition", children: isUpdating ? (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "animate-spin", size: 16 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Send, { size: 16 }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 space-y-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider", children: "Quick Suggestions" }), [
                                        'Switch to dark mode',
                                        'Make it more upscale',
                                        'Add Chef\'s Special section',
                                        'Use warmer colors',
                                        'Make it minimal'
                                    ].map(suggestion => ((0, jsx_runtime_1.jsxs)("button", { disabled: isUpdating, onClick: () => setRequest(suggestion), className: "block w-full text-left px-4 py-3 rounded-lg border border-slate-100 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition disabled:opacity-50", children: ["\"", suggestion, "\""] }, suggestion)))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-t border-slate-100 bg-slate-50 space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { className: "w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-200", children: "Publish Website" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/create'), className: "w-full py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition", children: "Edit Details" })] })] })] }));
};
exports.Preview = Preview;
