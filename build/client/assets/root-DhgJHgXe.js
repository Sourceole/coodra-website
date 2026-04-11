import { Links, Meta, Outlet, Scripts, ScrollRestoration, UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/root.tsx
var links = () => [
	{
		rel: "icon",
		type: "image/png",
		href: "/favicon.png?v=3"
	},
	{
		rel: "shortcut icon",
		href: "/favicon.png?v=3"
	},
	{
		rel: "apple-touch-icon",
		href: "/favicon.png?v=3"
	}
];
var meta = () => [
	{
		name: "description",
		content: "Coodra tracks sales, inventory, and demand signals in real time, then recommends exactly what to reorder, replace, remove, and protect so your retail team can act faster."
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		property: "og:title",
		content: "Coodra — Retail Decision Intelligence"
	},
	{
		property: "og:description",
		content: "AI-powered retail decision engine. Know what to reorder, replace, remove, and protect. Built for Shopify, Square, Lightspeed, and Clover."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/"
	},
	{
		property: "og:type",
		content: "website"
	},
	{
		property: "og:site_name",
		content: "Coodra"
	},
	{
		name: "twitter:card",
		content: "summary_large_image"
	},
	{
		name: "twitter:title",
		content: "Coodra — Retail Decision Intelligence"
	},
	{
		name: "twitter:description",
		content: "AI-powered retail decision engine. Know what to reorder, replace, remove, and protect."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{ title: "Coodra — Retail Decision Intelligence" }
];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "theme-color",
				content: "#0b1220"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "canonical",
				href: "https://www.coodra.com/"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {}),
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var raw=localStorage.getItem('so_theme_last_v1')||'';var mode=String(raw).trim().toLowerCase()==='dark'?'dark':'light';var bg=mode==='dark'?'#0b1220':'#f4f5f7';document.documentElement.setAttribute('data-so-rc-theme',mode);document.documentElement.style.backgroundColor=bg;if(document.body){document.body.setAttribute('data-so-rc-theme',mode);document.body.style.backgroundColor=bg;}}catch(_){}})();` } })
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
//#endregion
export { Layout, root_default as default, links, meta };
