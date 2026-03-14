"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const lucide_react_1 = require("lucide-react");
const Layout = ({ children }) => {
    const location = (0, react_router_dom_1.useLocation)();
    const isPreview = location.pathname === '/preview';
    if (isPreview) {
        return (0, jsx_runtime_1.jsx)("main", { className: "h-screen w-screen overflow-hidden bg-gray-50", children: children });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen flex flex-col bg-white text-stone-900 font-sans", children: [(0, jsx_runtime_1.jsx)("nav", { className: "border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "flex items-center gap-2 group", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-br from-orange-600 to-amber-600 text-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.UtensilsCrossed, { size: 20, fill: "currentColor" }) }), (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-xl tracking-tight text-stone-900", children: "Synthr" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-4", children: location.pathname !== '/create' && ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/create", className: "bg-gradient-to-r from-orange-600 to-amber-600 text-sm font-semibold text-white px-6 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-200", children: "Create Website" })) })] }) }), (0, jsx_runtime_1.jsx)("main", { className: "flex-grow", children: children }), (0, jsx_runtime_1.jsx)("footer", { className: "border-t border-orange-100 py-8 text-center text-stone-600 text-sm bg-gradient-to-b from-white to-amber-50", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4", children: (0, jsx_runtime_1.jsxs)("p", { children: ["\u00A9 ", new Date().getFullYear(), " Synthr. The AI website builder for restaurants. Built for busy kitchen owners."] }) }) })] }));
};
exports.Layout = Layout;
