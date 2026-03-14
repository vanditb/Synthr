"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Layout_1 = require("./components/Layout");
const Landing_1 = require("./pages/Landing");
const Builder_1 = require("./pages/Builder");
const Preview_1 = require("./pages/Preview");
function App() {
    const [businessDetails, setBusinessDetails] = (0, react_1.useState)(null);
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.HashRouter, { children: (0, jsx_runtime_1.jsx)(Layout_1.Layout, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(Landing_1.Landing, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/create", element: (0, jsx_runtime_1.jsx)(Builder_1.Builder, { setDetails: setBusinessDetails }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/preview", element: (0, jsx_runtime_1.jsx)(Preview_1.Preview, { details: businessDetails }) })] }) }) }));
}
exports.default = App;
