import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Form, Link, Links, Meta, Navigate, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, useActionData, useLocation, useNavigate, useNavigation, useParams, useSearchParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region app/entry.server.tsx
var entry_server_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), streamTimeout + 1e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region src/lib/analytics.ts
var GA_MEASUREMENT_ID = void 0;
var initialized = false;
var isEnabled = () => typeof window !== "undefined" && Boolean(GA_MEASUREMENT_ID);
var ensureGtag = () => {
	if (!window.dataLayer) window.dataLayer = [];
	if (!window.gtag) window.gtag = function gtag(...args) {
		window.dataLayer?.push(args);
	};
};
var initAnalytics = () => {
	if (!isEnabled() || initialized || true) return;
	ensureGtag();
	window.gtag?.("js", /* @__PURE__ */ new Date());
	window.gtag?.("config", GA_MEASUREMENT_ID, { send_page_view: false });
	initialized = true;
};
var trackEvent = (eventName, params = {}) => {
	if (!isEnabled()) return;
	ensureGtag();
	window.gtag?.("event", eventName, params);
};
var trackPageView = (path, title) => {
	trackEvent("page_view", {
		page_path: path,
		page_title: title
	});
};
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	Layout: () => Layout,
	default: () => root_default,
	links: () => links,
	meta: () => meta$18
});
var SITE_URL = "https://www.coodra.com";
var organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	"@id": `${SITE_URL}/#organization`,
	name: "Coodra",
	url: SITE_URL,
	logo: `${SITE_URL}/images/coodra-logo.png`,
	email: "admin@coodra.com",
	sameAs: []
};
var websiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": `${SITE_URL}/#website`,
	url: SITE_URL,
	name: "Coodra",
	description: "Retail decision intelligence platform for sales, inventory, and demand.",
	inLanguage: "en",
	publisher: { "@id": `${SITE_URL}/#organization` }
};
var links = () => [
	{
		rel: "preload",
		href: "/fonts/bebas-neue-400.woff2",
		as: "font",
		type: "font/woff2",
		crossOrigin: "anonymous"
	},
	{
		rel: "preload",
		href: "/fonts/nunito-400.woff2",
		as: "font",
		type: "font/woff2",
		crossOrigin: "anonymous"
	},
	{
		rel: "preload",
		href: "/fonts/nunito-700.woff2",
		as: "font",
		type: "font/woff2",
		crossOrigin: "anonymous"
	},
	{
		rel: "icon",
		type: "image/png",
		href: "/favicon.png?v=4"
	},
	{
		rel: "shortcut icon",
		href: "/favicon.png?v=4"
	},
	{
		rel: "apple-touch-icon",
		href: "/favicon.png?v=4"
	}
];
var meta$18 = () => [
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
		content: "Coodra - Retail Decision Intelligence"
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
		content: "Coodra - Retail Decision Intelligence"
	},
	{
		name: "twitter:description",
		content: "AI-powered retail decision engine. Know what to reorder, replace, remove, and protect."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{ title: "Coodra - Retail Decision Intelligence" }
];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		"data-so-rc-theme": "light",
		style: { backgroundColor: "#f4f5f7" },
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
			null,
			/* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(organizationJsonLd) }
			}),
			/* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(websiteJsonLd) }
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", {
			"data-so-rc-theme": "light",
			style: { backgroundColor: "#f4f5f7" },
			children: [
				children,
				/* @__PURE__ */ jsx(ScrollRestoration, {}),
				/* @__PURE__ */ jsx(Scripts, {})
			]
		})]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	const location = useLocation();
	useEffect(() => {
		initAnalytics();
	}, []);
	useEffect(() => {
		trackPageView(`${location.pathname}${location.search || ""}`, document.title);
	}, [location.pathname, location.search]);
	useEffect(() => {
		if (!location.hash) return;
		const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
		if (hash === "top") {
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
			return;
		}
		const scrollToHashTarget = () => {
			const target = document.getElementById(hash);
			if (!target) return;
			target.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		};
		const raf1 = requestAnimationFrame(() => {
			requestAnimationFrame(scrollToHashTarget);
		});
		return () => cancelAnimationFrame(raf1);
	}, [location.pathname, location.hash]);
	useEffect(() => {
		if (location.pathname !== "/") return;
		let hasTracked = false;
		const onScroll = () => {
			if (hasTracked) return;
			const doc = document.documentElement;
			const maxScrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
			if (window.scrollY / maxScrollable * 100 >= 75) {
				hasTracked = true;
				trackEvent("scroll_depth_75", {
					page_path: location.pathname,
					percent_scrolled: 75
				});
			}
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, [location.pathname]);
	useEffect(() => {
		const onClick = (event) => {
			const cta = event.target?.closest("a, button");
			if (!cta) return;
			const isBrandedButton = cta.classList.contains("btn");
			const isTaggedCta = cta.hasAttribute("data-analytics-click");
			if (!isBrandedButton && !isTaggedCta) return;
			const text = (cta.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
			const href = cta instanceof HTMLAnchorElement ? cta.getAttribute("href") || "" : "";
			trackEvent("cta_click", {
				cta_text: text || "unknown",
				destination: href || "button",
				page_path: location.pathname
			});
		};
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, [location.pathname]);
	return /* @__PURE__ */ jsx(Outlet, {});
});
//#endregion
//#region src/pages/LandingPage.tsx
var integrationShowcaseItems = [
	{
		name: "Shopify",
		description: "Sync products, orders, and inventory in real time.",
		iconSrc: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg",
		className: "brand-shopify"
	},
	{
		name: "Square",
		description: "Unify in-store sales and catalog performance signals.",
		iconSrc: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/square.svg",
		className: "brand-square"
	},
	{
		name: "Lightspeed",
		description: "Connect POS sell-through and stock movement data.",
		iconSrc: "/images/integrations/lightspeed.png?v=20260410",
		className: "brand-lightspeed"
	},
	{
		name: "Clover",
		description: "Bring transaction and location trends into one view.",
		iconSrc: "/images/integrations/clover.png?v=20260410",
		className: "brand-clover"
	},
	{
		name: "Moneris",
		description: "Pull payment and sales snapshots into decision workflows.",
		iconSrc: "/images/integrations/moneris.png?v=20260410",
		className: "brand-moneris"
	}
];
var heroIncomingSignals = [
	{
		title: "POS",
		meta: "Live sell-through"
	},
	{
		title: "Inventory",
		meta: "Stock depth"
	},
	{
		title: "Demand",
		meta: "Forecast signal"
	}
];
var heroOutgoingDecisions = [
	{
		tag: "Priority 1",
		title: "Reorder 142 units"
	},
	{
		tag: "Priority 2",
		title: "Markdown 8 SKUs"
	},
	{
		tag: "Priority 3",
		title: "Hold 23 SKUs"
	}
];
function LandingPage() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [coreBoosted, setCoreBoosted] = useState(false);
	const [isLiteHero, setIsLiteHero] = useState(false);
	const radarRef = useRef(null);
	const handleIntegrationVisualMove = (event) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		event.currentTarget.style.setProperty("--mx", `${x}px`);
		event.currentTarget.style.setProperty("--my", `${y}px`);
	};
	const handleIntegrationVisualLeave = (event) => {
		event.currentTarget.style.setProperty("--mx", "50%");
		event.currentTarget.style.setProperty("--my", "50%");
	};
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", "light");
		const loadScript = () => {
			if (document.getElementById("landing-app-script")) return;
			const script = document.createElement("script");
			script.id = "landing-app-script";
			script.src = "/landing/app.js";
			script.defer = true;
			document.body.appendChild(script);
		};
		const scheduleScriptLoad = () => {
			const w = window;
			if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(loadScript, { timeout: 2400 });
			else window.setTimeout(loadScript, 1200);
		};
		if (document.readyState === "complete") scheduleScriptLoad();
		else window.addEventListener("load", scheduleScriptLoad, { once: true });
		return () => {
			window.removeEventListener("load", scheduleScriptLoad);
			document.documentElement.removeAttribute("data-theme");
		};
	}, []);
	useEffect(() => {
		const closeOnDesktop = () => {
			if (window.innerWidth > 760) setIsMobileMenuOpen(false);
		};
		const closeOnEscape = (event) => {
			if (event.key === "Escape") setIsMobileMenuOpen(false);
		};
		window.addEventListener("resize", closeOnDesktop, { passive: true });
		window.addEventListener("keydown", closeOnEscape);
		return () => {
			window.removeEventListener("resize", closeOnDesktop);
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, []);
	useEffect(() => {
		if (window.innerWidth <= 760) document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);
	useEffect(() => {
		const section = document.getElementById("proof");
		if (!section) return;
		let fired = false;
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!fired && entry.isIntersecting && entry.intersectionRatio >= .35) {
					fired = true;
					trackEvent("testimonial_section_visible", {
						page_path: "/",
						section_id: "proof"
					});
				}
			});
		}, { threshold: [.35] });
		observer.observe(section);
		return () => observer.disconnect();
	}, []);
	useEffect(() => {
		const checkLiteHero = () => {
			const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			const isNarrowViewport = window.matchMedia("(max-width: 900px)").matches;
			const connection = navigator.connection;
			const isSaveData = Boolean(connection?.saveData);
			setIsLiteHero(prefersReducedMotion || isNarrowViewport || isSaveData);
		};
		checkLiteHero();
		window.addEventListener("resize", checkLiteHero, { passive: true });
		return () => window.removeEventListener("resize", checkLiteHero);
	}, []);
	const closeMobileMenu = () => setIsMobileMenuOpen(false);
	const handleRadarMove = (event) => {
		const radarEl = radarRef.current;
		if (!radarEl) return;
		const coreEl = radarEl.querySelector(".hero-radar-core");
		if (!coreEl) return;
		const coreRect = coreEl.getBoundingClientRect();
		const coreX = coreRect.left + coreRect.width / 2;
		const coreY = coreRect.top + coreRect.height / 2;
		radarEl.querySelectorAll(".hero-signal-token").forEach((token) => {
			const rect = token.getBoundingClientRect();
			const tokenX = rect.left + rect.width / 2;
			const tokenY = rect.top + rect.height / 2;
			const pointerDx = event.clientX - tokenX;
			const pointerDy = event.clientY - tokenY;
			const influence = Math.max(0, 1 - Math.hypot(pointerDx, pointerDy) / 220);
			const toCoreX = coreX - tokenX;
			const toCoreY = coreY - tokenY;
			const toCoreDistance = Math.max(1, Math.hypot(toCoreX, toCoreY));
			const nx = toCoreX / toCoreDistance;
			const ny = toCoreY / toCoreDistance;
			const pull = 14 * influence;
			token.style.setProperty("--token-attract", influence.toFixed(3));
			token.style.setProperty("--token-tx", `${(nx * pull).toFixed(2)}px`);
			token.style.setProperty("--token-ty", `${(ny * pull).toFixed(2)}px`);
		});
	};
	const handleRadarLeave = () => {
		const radarEl = radarRef.current;
		if (!radarEl) return;
		radarEl.querySelectorAll(".hero-signal-token").forEach((token) => {
			token.style.setProperty("--token-attract", "0");
			token.style.setProperty("--token-tx", "0px");
			token.style.setProperty("--token-ty", "0px");
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `site-shell${isLiteHero ? " is-lite-hero" : ""}`,
		id: "top",
		children: [
			!isLiteHero ? /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("div", {
					className: "ambient ambient-a",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "ambient ambient-b",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "ambient ambient-c",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mesh-grid",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "noise-layer",
					"aria-hidden": "true"
				})
			] }) : null,
			/* @__PURE__ */ jsx("header", {
				className: "site-header",
				children: /* @__PURE__ */ jsxs("nav", {
					className: "nav nav-desktop container surface-glass",
					"aria-label": "Primary",
					children: [
						/* @__PURE__ */ jsx("a", {
							className: "brand",
							href: "#top",
							"aria-label": "Coodra home",
							children: /* @__PURE__ */ jsx("img", {
								src: "/images/coodra-logo.png",
								alt: "Coodra",
								className: "coodra-logo-img"
							})
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							className: `nav-toggle${isMobileMenuOpen ? " is-open" : ""}`,
							"aria-label": isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu",
							"aria-expanded": isMobileMenuOpen,
							"aria-controls": "mobile-nav-menu",
							onClick: () => setIsMobileMenuOpen((open) => !open),
							children: [
								/* @__PURE__ */ jsx("span", {}),
								/* @__PURE__ */ jsx("span", {}),
								/* @__PURE__ */ jsx("span", {})
							]
						}),
						/* @__PURE__ */ jsxs("ul", {
							className: "nav-links",
							children: [
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#how-it-works",
									children: "How it works"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#decision",
									children: "Decision Engine"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#proof",
									children: "Proof"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: "/pricing",
									children: "Pricing"
								}) })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "nav-actions",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/login",
								className: "btn btn-ghost",
								children: "Sign in"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/signup",
								className: "btn btn-primary",
								children: "Start Free"
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: `mobile-nav-overlay${isMobileMenuOpen ? " is-open" : ""}`,
							"aria-hidden": !isMobileMenuOpen,
							tabIndex: isMobileMenuOpen ? 0 : -1,
							onClick: closeMobileMenu
						}),
						/* @__PURE__ */ jsxs("div", {
							id: "mobile-nav-menu",
							className: `mobile-nav-menu nav-mobile surface-glass${isMobileMenuOpen ? " is-open" : ""}`,
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "mobile-nav-kicker",
									children: "Navigation"
								}),
								/* @__PURE__ */ jsxs("ul", {
									className: "mobile-nav-links",
									children: [
										/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
											href: "#how-it-works",
											onClick: closeMobileMenu,
											children: "How it works"
										}) }),
										/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
											href: "#decision",
											onClick: closeMobileMenu,
											children: "Decision Engine"
										}) }),
										/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
											href: "#proof",
											onClick: closeMobileMenu,
											children: "Proof"
										}) }),
										/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
											to: "/pricing",
											onClick: closeMobileMenu,
											children: "Pricing"
										}) })
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mobile-nav-actions",
									children: [/* @__PURE__ */ jsx(Link, {
										to: "/login",
										className: "btn btn-ghost",
										onClick: closeMobileMenu,
										children: "Sign in"
									}), /* @__PURE__ */ jsx(Link, {
										to: "/signup",
										className: "btn btn-primary",
										onClick: closeMobileMenu,
										children: "Start Free"
									})]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("main", { children: [
				/* @__PURE__ */ jsxs("section", {
					className: "hero container",
					"data-aos": "fade-up",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "hero-copy",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "eyebrow",
									children: "Built for retail teams of every size"
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "hero-headline",
									children: "Your store, on autopilot."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "hero-subhead",
									children: "Coodra reads sales, inventory, and demand in real time, then recommends the next best move to protect margin and cash flow."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "hero-actions",
									onMouseEnter: () => setCoreBoosted(true),
									onMouseLeave: () => setCoreBoosted(false),
									children: [/* @__PURE__ */ jsx(Link, {
										to: "/signup",
										className: "btn btn-primary",
										children: "Start Free"
									}), /* @__PURE__ */ jsx("a", {
										href: "#how-it-works",
										className: "btn btn-secondary",
										children: "See 3-step flow"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hero-radar",
							"aria-hidden": "true",
							ref: radarRef,
							onMouseMove: handleRadarMove,
							onMouseLeave: handleRadarLeave,
							children: [
								/* @__PURE__ */ jsxs("svg", {
									className: "hero-radar-flows",
									viewBox: "0 0 560 330",
									preserveAspectRatio: "none",
									children: [
										/* @__PURE__ */ jsx("path", {
											className: "hero-flow-path hero-flow-path--in",
											d: "M64 64 C 180 56, 220 105, 278 163"
										}),
										/* @__PURE__ */ jsx("path", {
											className: "hero-flow-path hero-flow-path--in",
											d: "M64 163 C 190 163, 214 163, 278 163"
										}),
										/* @__PURE__ */ jsx("path", {
											className: "hero-flow-path hero-flow-path--in",
											d: "M64 264 C 176 272, 224 220, 278 163"
										}),
										/* @__PURE__ */ jsx("path", {
											className: "hero-flow-path hero-flow-path--out",
											d: "M282 163 C 338 112, 380 73, 492 64"
										}),
										/* @__PURE__ */ jsx("path", {
											className: "hero-flow-path hero-flow-path--out",
											d: "M282 163 C 340 163, 384 163, 492 163"
										}),
										/* @__PURE__ */ jsx("path", {
											className: "hero-flow-path hero-flow-path--out",
											d: "M282 163 C 340 214, 382 256, 492 264"
										}),
										/* @__PURE__ */ jsx("circle", {
											className: "hero-flow-dot hero-flow-dot--a",
											r: "5"
										}),
										/* @__PURE__ */ jsx("circle", {
											className: "hero-flow-dot hero-flow-dot--b",
											r: "5"
										}),
										/* @__PURE__ */ jsx("circle", {
											className: "hero-flow-dot hero-flow-dot--c",
											r: "5"
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "hero-signal-tokens",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "hero-signal-token token-pos",
											children: "POS"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "hero-signal-token token-sku",
											children: "SKU"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "hero-signal-token token-margin",
											children: "Margin"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "hero-signal-token token-sellthrough",
											children: "Sell-through"
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "hero-radar-column hero-radar-column--incoming",
									children: heroIncomingSignals.map((signal) => /* @__PURE__ */ jsxs("article", {
										className: "hero-radar-card hero-radar-card--incoming",
										children: [/* @__PURE__ */ jsx("p", { children: signal.title }), /* @__PURE__ */ jsx("span", { children: signal.meta })]
									}, signal.title))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: `hero-radar-core${coreBoosted ? " is-boosted" : ""}`,
									children: [
										/* @__PURE__ */ jsx("span", { className: "hero-radar-ring hero-radar-ring--a" }),
										/* @__PURE__ */ jsx("span", { className: "hero-radar-ring hero-radar-ring--b" }),
										/* @__PURE__ */ jsx("span", { className: "hero-radar-ring hero-radar-ring--pulse" }),
										/* @__PURE__ */ jsx("img", {
											src: "/images/logo.png",
											alt: "",
											className: "hero-radar-logo"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "hero-radar-terminal",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "hero-radar-terminal-label",
													children: "Decision:"
												}),
												/* @__PURE__ */ jsx("span", {
													className: "hero-radar-terminal-line",
													children: "Reorder 142 units"
												}),
												/* @__PURE__ */ jsx("span", { className: "hero-radar-terminal-caret" })
											]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "hero-radar-column hero-radar-column--outgoing",
									children: heroOutgoingDecisions.map((decision) => /* @__PURE__ */ jsxs("article", {
										className: "hero-radar-card hero-radar-card--outgoing",
										children: [/* @__PURE__ */ jsx("p", { children: decision.tag }), /* @__PURE__ */ jsx("span", { children: decision.title })]
									}, decision.tag))
								})
							]
						}),
						!isLiteHero ? /* @__PURE__ */ jsx("div", {
							className: "hero-atmosphere",
							"aria-hidden": "true",
							children: /* @__PURE__ */ jsx("canvas", {
								id: "hero-particles",
								className: "hero-particles-canvas"
							})
						}) : null
					]
				}),
				/* @__PURE__ */ jsx("section", {
					id: "media-expand",
					className: "media-expand container",
					"aria-label": "Coodra product reel placeholder",
					"data-aos": "fade-up",
					"data-aos-delay": "100",
					children: /* @__PURE__ */ jsx("div", {
						className: "media-expand-stage",
						"data-reveal": "up",
						children: /* @__PURE__ */ jsx("div", {
							className: "media-expand-frame",
							"aria-hidden": "true",
							children: /* @__PURE__ */ jsx("div", {
								className: "media-expand-placeholder",
								children: /* @__PURE__ */ jsxs("div", {
									className: "media-expand-placeholder-inner",
									children: [/* @__PURE__ */ jsx("span", { className: "media-expand-play" }), /* @__PURE__ */ jsx("p", { children: "See Coodra in action" })]
								})
							})
						})
					})
				}),
				/* @__PURE__ */ jsx("section", {
					id: "how-it-works",
					className: "how-it-works container",
					"data-aos": "fade-up",
					"data-aos-delay": "150",
					children: /* @__PURE__ */ jsxs("div", {
						className: "how-scroll",
						"data-reveal": "up",
						children: [/* @__PURE__ */ jsxs("header", {
							className: "how-sticky-head",
							"data-reveal": "up",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "eyebrow",
									children: "How it works"
								}),
								/* @__PURE__ */ jsx("h2", { children: "Three steps from signal to action." }),
								/* @__PURE__ */ jsx("p", {
									className: "how-scroll-sub",
									children: "Connect your systems, review AI recommendations, and approve decisions in minutes."
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "how-scroll-track",
							"aria-label": "Three connected steps",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "how-flip-stage",
									children: /* @__PURE__ */ jsxs("article", {
										className: "how-pill-card how-flip-card",
										id: "howFlipCard",
										children: [
											/* @__PURE__ */ jsx("p", {
												className: "how-step-tag",
												id: "howFlipTag",
												children: "Step 1"
											}),
											/* @__PURE__ */ jsx("h3", {
												id: "howFlipTitle",
												children: "Connect your data"
											}),
											/* @__PURE__ */ jsx("p", {
												id: "howFlipBody",
												children: "Sync POS, catalog, and inventory data so Coodra sees what is happening now."
											})
										]
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "how-trigger-rail",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "how-trigger is-active",
											"data-how-step": "1",
											"data-tag": "Step 1",
											"data-title": "Connect your data",
											"data-body": "Sync POS, catalog, and inventory data so Coodra sees what is happening now."
										}),
										/* @__PURE__ */ jsx("div", {
											className: "how-trigger",
											"data-how-step": "2",
											"data-tag": "Step 2",
											"data-title": "Get ranked actions",
											"data-body": "Coodra scores demand shifts, margin pressure, and stock risk to prioritize what matters most."
										}),
										/* @__PURE__ */ jsx("div", {
											className: "how-trigger",
											"data-how-step": "3",
											"data-tag": "Step 3",
											"data-title": "Approve and move",
											"data-body": "Approve recommendations fast and keep your team focused on high-impact decisions."
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "how-mobile-list",
									"aria-label": "Three steps",
									children: [
										/* @__PURE__ */ jsxs("article", {
											className: "how-pill-card",
											children: [
												/* @__PURE__ */ jsx("p", {
													className: "how-step-tag",
													children: "Step 1"
												}),
												/* @__PURE__ */ jsx("h3", { children: "Connect your data" }),
												/* @__PURE__ */ jsx("p", { children: "Sync POS, catalog, and inventory data so Coodra sees what is happening now." })
											]
										}),
										/* @__PURE__ */ jsxs("article", {
											className: "how-pill-card",
											children: [
												/* @__PURE__ */ jsx("p", {
													className: "how-step-tag",
													children: "Step 2"
												}),
												/* @__PURE__ */ jsx("h3", { children: "Get ranked actions" }),
												/* @__PURE__ */ jsx("p", { children: "Coodra scores demand shifts, margin pressure, and stock risk to prioritize what matters most." })
											]
										}),
										/* @__PURE__ */ jsxs("article", {
											className: "how-pill-card",
											children: [
												/* @__PURE__ */ jsx("p", {
													className: "how-step-tag",
													children: "Step 3"
												}),
												/* @__PURE__ */ jsx("h3", { children: "Approve and move" }),
												/* @__PURE__ */ jsx("p", { children: "Approve recommendations fast and keep your team focused on high-impact decisions." })
											]
										})
									]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					id: "integrations",
					className: "integrations container",
					"data-aos": "fade-up",
					"data-aos-delay": "200",
					children: /* @__PURE__ */ jsxs("div", {
						className: "integrations-showcase",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "integrations-showcase-head",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "integrations-copy",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "eyebrow",
										children: "Integrations"
									}),
									/* @__PURE__ */ jsx("h2", { children: "Plug in your systems. Decide faster every day." }),
									/* @__PURE__ */ jsx("p", {
										className: "integrations-sub",
										children: "Connect the POS tools you already use, then let Coodra turn daily sales and inventory signals into clear next actions your team can approve."
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "integrations-illustration",
								"aria-hidden": "true",
								onMouseMove: handleIntegrationVisualMove,
								onMouseLeave: handleIntegrationVisualLeave,
								children: [
									/* @__PURE__ */ jsx("div", { className: "integrations-node-grid" }),
									/* @__PURE__ */ jsx("div", { className: "integrations-node-grid-highlight" }),
									/* @__PURE__ */ jsx("div", {
										className: "integrations-node-core",
										children: /* @__PURE__ */ jsx("img", {
											src: "/images/logo.png",
											alt: "Coodra icon"
										})
									}),
									/* @__PURE__ */ jsx("span", { className: "integrations-node-dot dot-a" }),
									/* @__PURE__ */ jsx("span", { className: "integrations-node-dot dot-b" }),
									/* @__PURE__ */ jsx("span", { className: "integrations-node-dot dot-c" })
								]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "integrations-list",
							"data-stagger": true,
							role: "list",
							"aria-label": "Coodra POS integrations",
							children: integrationShowcaseItems.map((item) => /* @__PURE__ */ jsxs("article", {
								className: "integration-row",
								role: "listitem",
								children: [/* @__PURE__ */ jsx("div", {
									className: `integration-logo ${item.className}`,
									children: /* @__PURE__ */ jsx("img", {
										src: item.iconSrc,
										alt: `${item.name} logo`
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "integration-text",
									children: [/* @__PURE__ */ jsx("h3", { children: item.name }), /* @__PURE__ */ jsx("p", { children: item.description })]
								})]
							}, item.name))
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					id: "decision",
					className: "decision-band container",
					"data-aos": "fade-up",
					"data-aos-delay": "250",
					children: /* @__PURE__ */ jsxs("div", {
						className: "decision-layout",
						children: [/* @__PURE__ */ jsxs("header", {
							className: "decision-copy",
							"data-reveal": "up",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "eyebrow",
									children: "Why teams switch to Coodra"
								}),
								/* @__PURE__ */ jsx("h2", { children: "Decisions that are fast, clear, and measurable." }),
								/* @__PURE__ */ jsx("p", { children: "Every recommendation includes confidence, reasoning, and expected impact so your team knows what to do next and why it matters." })
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "decision-stack-wrap",
							children: /* @__PURE__ */ jsxs("div", {
								className: "display-cards-stack decision-stack",
								"aria-label": "Coodra operating layers",
								children: [
									/* @__PURE__ */ jsxs("article", {
										className: "display-card decision-layer-1",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "display-card-top",
												children: [/* @__PURE__ */ jsx("span", {
													className: "display-icon",
													children: "A"
												}), /* @__PURE__ */ jsx("p", {
													className: "display-title",
													children: "Clear rationale"
												})]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "display-body",
												children: "See the exact data signals behind each recommendation."
											}),
											/* @__PURE__ */ jsx("p", {
												className: "display-date",
												children: "No black box"
											})
										]
									}),
									/* @__PURE__ */ jsxs("article", {
										className: "display-card decision-layer-2",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "display-card-top",
												children: [/* @__PURE__ */ jsx("span", {
													className: "display-icon",
													children: "B"
												}), /* @__PURE__ */ jsx("p", {
													className: "display-title",
													children: "Human approval"
												})]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "display-body",
												children: "Your team approves actions before anything changes."
											}),
											/* @__PURE__ */ jsx("p", {
												className: "display-date",
												children: "Always in control"
											})
										]
									}),
									/* @__PURE__ */ jsxs("article", {
										className: "display-card decision-layer-3",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "display-card-top",
												children: [/* @__PURE__ */ jsx("span", {
													className: "display-icon",
													children: "C"
												}), /* @__PURE__ */ jsx("p", {
													className: "display-title",
													children: "Measured outcomes"
												})]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "display-body",
												children: "Track what decisions improve sell-through, margin, and stock health."
											}),
											/* @__PURE__ */ jsx("p", {
												className: "display-date",
												children: "Impact you can prove"
											})
										]
									})
								]
							})
						})]
					})
				}),
				/* @__PURE__ */ jsxs("section", {
					id: "proof",
					className: "proof testimonials-section container",
					"data-aos": "fade-up",
					"data-aos-delay": "300",
					"data-reveal": "up",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "eyebrow",
							children: "Real business outcomes"
						}),
						/* @__PURE__ */ jsxs("h2", {
							className: "proof-title-lines",
							children: [/* @__PURE__ */ jsx("span", {
								className: "proof-title-line",
								children: "Teams move faster and"
							}), /* @__PURE__ */ jsx("span", {
								className: "proof-title-line",
								children: "miss fewer opportunities."
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "proof-subline",
							children: "See how retailers use Coodra to act earlier and protect revenue."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "testimonials-viewport",
							"data-reveal": "up",
							"aria-label": "Customer outcomes",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "testimonials-marquee",
									"data-marquee": true,
									children: [
										/* @__PURE__ */ jsxs("article", {
											className: "t-card",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "t-author",
												children: [/* @__PURE__ */ jsx("span", {
													className: "t-avatar",
													children: "SJ"
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", { children: "Sophie J." }), /* @__PURE__ */ jsx("small", { children: "Multi-location grocery" })] })]
											}), /* @__PURE__ */ jsx("blockquote", { children: "Coodra flagged stockout risk two days earlier. We recovered weekend sales before it hurt us." })]
										}),
										/* @__PURE__ */ jsxs("article", {
											className: "t-card",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "t-author",
												children: [/* @__PURE__ */ jsx("span", {
													className: "t-avatar",
													children: "ML"
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", { children: "Marcus L." }), /* @__PURE__ */ jsx("small", { children: "Specialty pet retail" })] })]
											}), /* @__PURE__ */ jsx("blockquote", { children: "Reorder recommendations are clearer than our old reports. My team moves in minutes now." })]
										}),
										/* @__PURE__ */ jsxs("article", {
											className: "t-card",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "t-author",
												children: [/* @__PURE__ */ jsx("span", {
													className: "t-avatar",
													children: "AG"
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", { children: "Ariana G." }), /* @__PURE__ */ jsx("small", { children: "Health & wellness" })] })]
											}), /* @__PURE__ */ jsx("blockquote", { children: "We stopped over-ordering low velocity SKUs and protected margin in the same month." })]
										}),
										/* @__PURE__ */ jsxs("article", {
											className: "t-card",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "t-author",
												children: [/* @__PURE__ */ jsx("span", {
													className: "t-avatar",
													children: "TR"
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", { children: "Tyler R." }), /* @__PURE__ */ jsx("small", { children: "Convenience stores" })] })]
											}), /* @__PURE__ */ jsx("blockquote", { children: "The why behind each suggestion made approvals easy for operators and owners." })]
										}),
										/* @__PURE__ */ jsxs("article", {
											className: "t-card",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "t-author",
												children: [/* @__PURE__ */ jsx("span", {
													className: "t-avatar",
													children: "EB"
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", { children: "Elena B." }), /* @__PURE__ */ jsx("small", { children: "Beauty retail" })] })]
											}), /* @__PURE__ */ jsx("blockquote", { children: "Coodra highlighted weak movers we kept missing. We corrected mix faster than ever." })]
										}),
										/* @__PURE__ */ jsxs("article", {
											className: "t-card",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "t-author",
												children: [/* @__PURE__ */ jsx("span", {
													className: "t-avatar",
													children: "DK"
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", { children: "David K." }), /* @__PURE__ */ jsx("small", { children: "Electronics chain" })] })]
											}), /* @__PURE__ */ jsx("blockquote", { children: "Signal quality is strong. It feels like an operator that never sleeps." })]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "testimonials-fade testimonials-fade-left",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "testimonials-fade testimonials-fade-right",
									"aria-hidden": "true"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					id: "cta",
					className: "cta container surface-contrast",
					"data-aos": "fade-up",
					"data-aos-delay": "350",
					"data-reveal": "up",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "Ready to make better retail decisions this week?" }),
						/* @__PURE__ */ jsx("p", { children: "Connect your data, review AI-ranked actions, and approve your first decision in minutes." }),
						/* @__PURE__ */ jsxs("div", {
							className: "cta-actions",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/signup",
								className: "btn btn-primary",
								children: "Start Free"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/pricing",
								className: "btn btn-secondary",
								children: "View Pricing"
							})]
						})
					]
				})
			] }),
			/* @__PURE__ */ jsxs("footer", {
				className: "site-footer premium-footer",
				children: [/* @__PURE__ */ jsx("div", {
					className: "footer-bg-gradient",
					"aria-hidden": "true"
				}), /* @__PURE__ */ jsxs("div", {
					className: "container footer-premium-inner",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "footer-grid",
						children: [
							/* @__PURE__ */ jsxs("section", {
								className: "footer-brand-col",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "footer-kicker",
										children: "Retail Decision Intelligence"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "footer-summary",
										children: "Coodra helps any retail business turn live data into high-confidence actions."
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "footer-socials",
										children: [
											/* @__PURE__ */ jsx("a", {
												href: "https://www.linkedin.com",
												target: "_blank",
												rel: "noreferrer",
												children: "in"
											}),
											/* @__PURE__ */ jsx("a", {
												href: "https://x.com",
												target: "_blank",
												rel: "noreferrer",
												children: "x"
											}),
											/* @__PURE__ */ jsx("a", {
												href: "https://www.youtube.com",
												target: "_blank",
												rel: "noreferrer",
												children: "yt"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "footer-link-col",
								children: [
									/* @__PURE__ */ jsx("h3", { children: "Product" }),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Decision Engine"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Performance Center"
									}),
									/* @__PURE__ */ jsx(Link, {
										to: "/integrations",
										children: "Integrations"
									}),
									/* @__PURE__ */ jsx(Link, {
										to: "/pricing",
										children: "Pricing"
									})
								]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "footer-link-col",
								children: [
									/* @__PURE__ */ jsx("h3", { children: "Solutions" }),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Grocery"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Convenience"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Specialty Retail"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Multi-store Ops"
									})
								]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "footer-link-col",
								children: [
									/* @__PURE__ */ jsx("h3", { children: "Resources" }),
									/* @__PURE__ */ jsx(Link, {
										to: "/blog",
										children: "Blog"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Docs"
									}),
									/* @__PURE__ */ jsx(Link, {
										to: "/case-studies",
										children: "Case Studies"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "API Status"
									}),
									/* @__PURE__ */ jsx(Link, {
										to: "/security",
										children: "Security"
									})
								]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "footer-link-col",
								children: [
									/* @__PURE__ */ jsx("h3", { children: "Company" }),
									/* @__PURE__ */ jsx(Link, {
										to: "/about",
										children: "About"
									}),
									/* @__PURE__ */ jsx(Link, {
										to: "/terms",
										children: "Terms"
									}),
									/* @__PURE__ */ jsx(Link, {
										to: "/privacy",
										children: "Privacy"
									}),
									/* @__PURE__ */ jsx(Link, {
										to: "/contact",
										children: "Contact"
									})
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "footer-bottom",
						children: [/* @__PURE__ */ jsx("p", { children: "© 2026 Coodra. All rights reserved." }), /* @__PURE__ */ jsx("img", {
							src: "/images/coodra-logo.png",
							alt: "Coodra",
							style: {
								height: 140,
								width: "auto",
								display: "block",
								opacity: .7
							}
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/routes/_index.tsx
var _index_exports = /* @__PURE__ */ __exportAll({
	default: () => _index_default,
	meta: () => meta$17
});
var meta$17 = () => [
	{ title: "Coodra - Retail Decision Intelligence" },
	{
		name: "description",
		content: "Coodra tracks sales, inventory, and demand signals in real time, then recommends exactly what to reorder, replace, remove, and protect so your retail team can act faster."
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/"
	},
	{
		property: "og:title",
		content: "Coodra - Retail Decision Intelligence"
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
		content: "Coodra - Retail Decision Intelligence"
	},
	{
		name: "twitter:description",
		content: "AI-powered retail decision engine. Know what to reorder, replace, remove, and protect."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	}
];
var _index_default = UNSAFE_withComponentProps(LandingPage);
//#endregion
//#region src/components/MarketingHeader.tsx
function MarketingHeader() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const sectionLinks = useMemo(() => {
		const prefix = location.pathname === "/" ? "" : "/";
		return {
			how: `${prefix}#how-it-works`,
			decision: `${prefix}#decision`,
			proof: `${prefix}#proof`
		};
	}, [location.pathname]);
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname, location.hash]);
	useEffect(() => {
		const closeOnDesktop = () => {
			if (window.innerWidth > 760) setIsMobileMenuOpen(false);
		};
		const closeOnEscape = (event) => {
			if (event.key === "Escape") setIsMobileMenuOpen(false);
		};
		window.addEventListener("resize", closeOnDesktop, { passive: true });
		window.addEventListener("keydown", closeOnEscape);
		return () => {
			window.removeEventListener("resize", closeOnDesktop);
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, []);
	useEffect(() => {
		const onScroll = () => {
			setIsScrolled(window.scrollY > 8);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	useEffect(() => {
		if (window.innerWidth <= 760) document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);
	const closeMobileMenu = () => setIsMobileMenuOpen(false);
	return /* @__PURE__ */ jsx("header", {
		className: `mh-site-header${isScrolled ? " is-scrolled" : ""}`,
		children: /* @__PURE__ */ jsxs("nav", {
			className: "mh-nav container",
			"aria-label": "Primary",
			children: [
				/* @__PURE__ */ jsx(Link, {
					className: "mh-brand",
					to: "/",
					"aria-label": "Coodra home",
					children: /* @__PURE__ */ jsx("img", {
						src: "/images/coodra-logo.png",
						alt: "Coodra",
						className: "coodra-logo-img"
					})
				}),
				/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: `mh-nav-toggle${isMobileMenuOpen ? " is-open" : ""}`,
					"aria-label": isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu",
					"aria-expanded": isMobileMenuOpen,
					"aria-controls": "mh-mobile-nav-menu",
					onClick: () => setIsMobileMenuOpen((open) => !open),
					children: [
						/* @__PURE__ */ jsx("span", {}),
						/* @__PURE__ */ jsx("span", {}),
						/* @__PURE__ */ jsx("span", {})
					]
				}),
				/* @__PURE__ */ jsxs("ul", {
					className: "mh-nav-links",
					children: [
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
							href: sectionLinks.how,
							children: "How it works"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
							href: sectionLinks.decision,
							children: "Decision Engine"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
							href: sectionLinks.proof,
							children: "Proof"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/pricing",
							children: "Pricing"
						}) })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mh-nav-actions",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/login",
						className: "mh-btn mh-btn-ghost",
						children: "Sign in"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/signup",
						className: "mh-btn mh-btn-primary",
						children: "Start Free"
					})]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: `mh-mobile-nav-overlay${isMobileMenuOpen ? " is-open" : ""}`,
					"aria-hidden": !isMobileMenuOpen,
					tabIndex: isMobileMenuOpen ? 0 : -1,
					onClick: closeMobileMenu
				}),
				/* @__PURE__ */ jsxs("div", {
					id: "mh-mobile-nav-menu",
					className: `mh-mobile-nav-menu${isMobileMenuOpen ? " is-open" : ""}`,
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "mh-mobile-nav-kicker",
							children: "Navigation"
						}),
						/* @__PURE__ */ jsxs("ul", {
							className: "mh-mobile-nav-links",
							children: [
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: sectionLinks.how,
									onClick: closeMobileMenu,
									children: "How it works"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: sectionLinks.decision,
									onClick: closeMobileMenu,
									children: "Decision Engine"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: sectionLinks.proof,
									onClick: closeMobileMenu,
									children: "Proof"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: "/pricing",
									onClick: closeMobileMenu,
									children: "Pricing"
								}) })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mh-mobile-nav-actions",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/login",
								className: "mh-btn mh-btn-ghost",
								onClick: closeMobileMenu,
								children: "Sign in"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/signup",
								className: "mh-btn mh-btn-primary",
								onClick: closeMobileMenu,
								children: "Start Free"
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/pages/AboutPage.tsx
var team = [
	{
		name: "Michael R.",
		title: "Founder & CEO",
		bio: "Leads product vision and retail strategy with a focus on practical, measurable outcomes.",
		linkedin: "https://www.linkedin.com"
	},
	{
		name: "Product Engineering",
		title: "Platform Team",
		bio: "Builds the decision engine, integrations, and approval flows used by daily retail operators.",
		linkedin: "https://www.linkedin.com"
	},
	{
		name: "Customer Operations",
		title: "Implementation Team",
		bio: "Helps stores connect systems, onboard quickly, and operationalize recommendations with confidence.",
		linkedin: "https://www.linkedin.com"
	}
];
function AboutPage() {
	return /* @__PURE__ */ jsx("div", {
		className: "legal-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "legal-page__container",
			children: [/* @__PURE__ */ jsx(MarketingHeader, {}), /* @__PURE__ */ jsxs("div", {
				className: "legal-page__shell",
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "legal-page__sidebar",
					children: [/* @__PURE__ */ jsx("p", {
						className: "legal-page__sidebarTitle",
						children: "Company"
					}), /* @__PURE__ */ jsxs("nav", {
						className: "legal-page__sidebarLinks",
						"aria-label": "Company pages",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/about",
								children: "About"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/contact",
								children: "Contact"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/integrations",
								children: "Integrations"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/security",
								children: "Security"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/privacy",
								children: "Privacy"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/terms",
								children: "Terms"
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("article", {
					className: "legal-page__card",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "legal-page__eyebrow",
							children: "Company"
						}),
						/* @__PURE__ */ jsx("h1", { children: "About Coodra" }),
						/* @__PURE__ */ jsx("p", { children: "Coodra exists because too many retail teams are overloaded with data but under-supported on decisions. We turn live sales, inventory, and demand signals into clear, ranked actions that operators can approve in minutes." }),
						/* @__PURE__ */ jsx("h2", { children: "Founding story" }),
						/* @__PURE__ */ jsx("p", { children: "We built Coodra to become the operational decision layer between a retail business and what customers need next. Instead of dashboards that require interpretation, we focus on direct recommendations teams can trust and act on quickly." }),
						/* @__PURE__ */ jsx("h2", { children: "What we believe" }),
						/* @__PURE__ */ jsxs("div", {
							className: "legal-page__grid",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "legal-page__tile",
									children: [/* @__PURE__ */ jsx("h3", { children: "Clear over complex" }), /* @__PURE__ */ jsx("p", { children: "A recommendation is only useful if teams can understand and approve it quickly." })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "legal-page__tile",
									children: [/* @__PURE__ */ jsx("h3", { children: "Human in control" }), /* @__PURE__ */ jsx("p", { children: "Coodra supports operators with decision intelligence; your team remains in charge." })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "legal-page__tile",
									children: [/* @__PURE__ */ jsx("h3", { children: "Measurable outcomes" }), /* @__PURE__ */ jsx("p", { children: "Every action should map to tangible improvements in sell-through, margin, and stock health." })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "legal-page__tile",
									children: [/* @__PURE__ */ jsx("h3", { children: "Practical speed" }), /* @__PURE__ */ jsx("p", { children: "Retail moves fast. Teams need useful answers now, not analysis after the opportunity is gone." })]
								})
							]
						}),
						/* @__PURE__ */ jsx("h2", { children: "Team" }),
						/* @__PURE__ */ jsx("div", {
							className: "legal-page__teamGrid",
							children: team.map((person) => /* @__PURE__ */ jsxs("article", {
								className: "legal-page__teamCard",
								children: [/* @__PURE__ */ jsx("div", {
									className: "legal-page__avatar",
									"aria-hidden": "true",
									children: person.name.slice(0, 1)
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("h3", { children: person.name }),
									/* @__PURE__ */ jsx("p", {
										className: "legal-page__teamRole",
										children: person.title
									}),
									/* @__PURE__ */ jsx("p", { children: person.bio }),
									/* @__PURE__ */ jsx("a", {
										href: person.linkedin,
										target: "_blank",
										rel: "noreferrer",
										children: "LinkedIn"
									})
								] })]
							}, person.name))
						}),
						/* @__PURE__ */ jsx("h2", { children: "Locations" }),
						/* @__PURE__ */ jsx("p", { children: "Serving retailers across Canada and the United States." }),
						/* @__PURE__ */ jsx("h2", { children: "Get in touch" }),
						/* @__PURE__ */ jsxs("p", { children: [
							"We'd love to hear from you. Reach us at ",
							/* @__PURE__ */ jsx("a", {
								href: "mailto:admin@coodra.com",
								children: "admin@coodra.com"
							}),
							"."
						] })
					]
				})]
			})]
		})
	});
}
//#endregion
//#region src/routes/about.tsx
var about_exports = /* @__PURE__ */ __exportAll({
	default: () => about_default,
	meta: () => meta$16
});
var meta$16 = () => [
	{ title: "About - Coodra" },
	{
		name: "description",
		content: "Learn how Coodra helps retail teams turn live data into clear, measurable actions."
	},
	{
		property: "og:title",
		content: "About - Coodra"
	},
	{
		property: "og:description",
		content: "Learn how Coodra helps retail teams turn live data into clear, measurable actions."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/about"
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
		content: "About - Coodra"
	},
	{
		name: "twitter:description",
		content: "Learn how Coodra helps retail teams turn live data into clear, measurable actions."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/about"
	}
];
var about_default = UNSAFE_withComponentProps(AboutPage);
//#endregion
//#region src/pages/ContactPage.tsx
function ContactPage() {
	const actionData = useActionData();
	const isSubmitting = useNavigation().state === "submitting";
	useEffect(() => {
		if (actionData?.ok) trackEvent("contact_form_submit", { page_path: "/contact" });
	}, [actionData?.ok]);
	return /* @__PURE__ */ jsx("div", {
		className: "legal-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "legal-page__container",
			children: [/* @__PURE__ */ jsx(MarketingHeader, {}), /* @__PURE__ */ jsxs("div", {
				className: "legal-page__shell",
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "legal-page__sidebar",
					children: [/* @__PURE__ */ jsx("p", {
						className: "legal-page__sidebarTitle",
						children: "Company"
					}), /* @__PURE__ */ jsxs("nav", {
						className: "legal-page__sidebarLinks",
						"aria-label": "Company pages",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/about",
								children: "About"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/contact",
								children: "Contact"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/integrations",
								children: "Integrations"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/security",
								children: "Security"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/privacy",
								children: "Privacy"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/terms",
								children: "Terms"
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("article", {
					className: "legal-page__card",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "legal-page__eyebrow",
							children: "Company"
						}),
						/* @__PURE__ */ jsx("h1", { children: "Contact" }),
						/* @__PURE__ */ jsxs("p", { children: [
							"Product questions, support issues, partnerships, or press requests. We reply within ",
							/* @__PURE__ */ jsx("strong", { children: "1 business day" }),
							"."
						] }),
						actionData?.ok ? /* @__PURE__ */ jsx("p", {
							className: "legal-page__highlight",
							children: actionData.message
						}) : null,
						/* @__PURE__ */ jsxs(Form, {
							method: "post",
							className: "legal-page__form",
							noValidate: true,
							children: [
								/* @__PURE__ */ jsxs("label", { children: [
									"Name",
									/* @__PURE__ */ jsx("input", {
										type: "text",
										name: "name",
										defaultValue: actionData?.values?.name || "",
										required: true
									}),
									actionData?.errors?.name ? /* @__PURE__ */ jsx("span", {
										className: "legal-page__error",
										children: actionData.errors.name
									}) : null
								] }),
								/* @__PURE__ */ jsxs("label", { children: [
									"Business name",
									/* @__PURE__ */ jsx("input", {
										type: "text",
										name: "businessName",
										defaultValue: actionData?.values?.businessName || "",
										required: true
									}),
									actionData?.errors?.businessName ? /* @__PURE__ */ jsx("span", {
										className: "legal-page__error",
										children: actionData.errors.businessName
									}) : null
								] }),
								/* @__PURE__ */ jsxs("label", { children: [
									"Email",
									/* @__PURE__ */ jsx("input", {
										type: "email",
										name: "email",
										defaultValue: actionData?.values?.email || "",
										required: true
									}),
									actionData?.errors?.email ? /* @__PURE__ */ jsx("span", {
										className: "legal-page__error",
										children: actionData.errors.email
									}) : null
								] }),
								/* @__PURE__ */ jsxs("label", { children: ["Subject", /* @__PURE__ */ jsxs("select", {
									name: "subject",
									defaultValue: actionData?.values?.subject || "Sales",
									required: true,
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "Sales",
											children: "Sales"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Support",
											children: "Support"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Partnership",
											children: "Partnership"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Press",
											children: "Press"
										})
									]
								})] }),
								/* @__PURE__ */ jsxs("label", { children: [
									"Message",
									/* @__PURE__ */ jsx("textarea", {
										name: "message",
										rows: 6,
										defaultValue: actionData?.values?.message || "",
										required: true
									}),
									actionData?.errors?.message ? /* @__PURE__ */ jsx("span", {
										className: "legal-page__error",
										children: actionData.errors.message
									}) : null
								] }),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "legal-page__submit",
									disabled: isSubmitting,
									children: isSubmitting ? "Sending..." : "Send message"
								})
							]
						}),
						/* @__PURE__ */ jsx("h2", { children: "Direct contact" }),
						/* @__PURE__ */ jsxs("p", { children: ["Email fallback: ", /* @__PURE__ */ jsx("a", {
							href: "mailto:admin@coodra.com",
							children: "admin@coodra.com"
						})] }),
						/* @__PURE__ */ jsx("p", { children: "Office coverage: Canada and United States" }),
						/* @__PURE__ */ jsx("h2", { children: "Social" }),
						/* @__PURE__ */ jsxs("div", {
							className: "legal-page__socials",
							children: [/* @__PURE__ */ jsx("a", {
								href: "#",
								"aria-label": "LinkedIn",
								children: "LinkedIn"
							}), /* @__PURE__ */ jsx("a", {
								href: "#",
								"aria-label": "X",
								children: "X"
							})]
						})
					]
				})]
			})]
		})
	});
}
//#endregion
//#region src/routes/contact.tsx
var contact_exports = /* @__PURE__ */ __exportAll({
	action: () => action,
	default: () => contact_default,
	meta: () => meta$15
});
var meta$15 = () => [
	{ title: "Contact - Coodra" },
	{
		name: "description",
		content: "Contact Coodra for support, privacy requests, partnerships, and product questions."
	},
	{
		property: "og:title",
		content: "Contact - Coodra"
	},
	{
		property: "og:description",
		content: "Contact Coodra for support, privacy requests, partnerships, and product questions."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/contact"
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
		content: "Contact - Coodra"
	},
	{
		name: "twitter:description",
		content: "Contact Coodra for support, privacy requests, partnerships, and product questions."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/contact"
	}
];
var isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
var escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
async function action({ request }) {
	const formData = await request.formData();
	const values = {
		name: String(formData.get("name") || "").trim(),
		businessName: String(formData.get("businessName") || "").trim(),
		email: String(formData.get("email") || "").trim(),
		subject: String(formData.get("subject") || "Sales").trim(),
		message: String(formData.get("message") || "").trim()
	};
	const errors = {};
	if (!values.name) errors.name = "Please enter your name.";
	if (!values.businessName) errors.businessName = "Please enter your business name.";
	if (!values.email || !isValidEmail(values.email)) errors.email = "Please enter a valid email.";
	if (!values.message || values.message.length < 8) errors.message = "Please enter a short message (8+ characters).";
	if (Object.keys(errors).length > 0) return {
		ok: false,
		message: "Please fix the highlighted fields and try again.",
		errors,
		values
	};
	const resendApiKey = process.env.RESEND_API_KEY;
	const fromEmail = process.env.CONTACT_FROM_EMAIL || "Coodra <onboarding@resend.dev>";
	const toEmail = process.env.CONTACT_TO_EMAIL || "admin@coodra.com";
	if (!resendApiKey) return {
		ok: false,
		message: "Contact delivery is not configured yet. Please email admin@coodra.com directly.",
		errors: {},
		values
	};
	const emailText = [
		"New contact request from coodra.com",
		`Name: ${values.name}`,
		`Business: ${values.businessName}`,
		`Email: ${values.email}`,
		`Subject: ${values.subject}`,
		"",
		"Message:",
		values.message
	].join("\n");
	const emailHtml = `
    <div style="font-family: 'Nunito', 'Segoe UI', sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">New contact request from coodra.com</h2>
      <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
      <p><strong>Business:</strong> ${escapeHtml(values.businessName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(values.subject)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(values.message)}</p>
    </div>
  `;
	if (!(await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${resendApiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			from: fromEmail,
			to: [toEmail],
			reply_to: values.email,
			subject: `[Coodra Contact] ${values.subject} - ${values.businessName}`,
			text: emailText,
			html: emailHtml
		})
	})).ok) return {
		ok: false,
		message: "We could not send your message right now. Please email admin@coodra.com directly.",
		errors: {},
		values
	};
	return {
		ok: true,
		message: "Thanks, your message was submitted. We'll reply within 1 business day.",
		errors: {},
		values: {
			name: "",
			businessName: "",
			email: "",
			subject: "Sales",
			message: ""
		}
	};
}
var contact_default = UNSAFE_withComponentProps(ContactPage);
//#endregion
//#region src/pages/IntegrationsPage.tsx
var integrations = [
	{
		name: "Shopify",
		logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg",
		summary: "Sync products, orders, and inventory in real time.",
		bullets: [
			"Catalog + product sync",
			"Orders + transactions sync",
			"Inventory + stock sync"
		]
	},
	{
		name: "Square",
		logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/square.svg",
		summary: "Unify in-store sales and catalog performance signals.",
		bullets: [
			"Catalog + modifiers sync",
			"Sales + payment signal sync",
			"Stock + location sync"
		]
	},
	{
		name: "Lightspeed",
		logo: "/images/integrations/lightspeed.png?v=20260410",
		summary: "Connect POS sell-through and stock movement data.",
		bullets: [
			"Items + variants sync",
			"Daily sell-through signal",
			"Store-level inventory sync"
		]
	},
	{
		name: "Clover",
		logo: "/images/integrations/clover.png?v=20260410",
		summary: "Bring transaction and location trends into one view.",
		bullets: [
			"Products + categories sync",
			"Order + payment signal sync",
			"Inventory + branch sync"
		]
	}
];
function IntegrationsPage() {
	return /* @__PURE__ */ jsx("div", {
		className: "exp-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "exp-page__container",
			children: [
				/* @__PURE__ */ jsx(MarketingHeader, {}),
				/* @__PURE__ */ jsxs("section", {
					className: "exp-hero motion-fade-up",
					"data-aos": "fade-up",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "exp-hero__eyebrow",
							children: "Integrations"
						}),
						/* @__PURE__ */ jsx("h1", { children: "Works with the tools you already run." }),
						/* @__PURE__ */ jsx("p", { children: "Connect your current POS stack and let Coodra transform live operational data into ranked, high-confidence retail actions." }),
						/* @__PURE__ */ jsxs("div", {
							className: "exp-hero__actions",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/contact",
								className: "exp-btn",
								children: "Start an integration review"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/security",
								className: "exp-btn exp-btn--ghost",
								children: "See data controls"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "exp-pipeline",
					"aria-label": "How integration works",
					children: [
						/* @__PURE__ */ jsxs("article", {
							className: "exp-pipeline__step",
							children: [/* @__PURE__ */ jsx("p", {
								className: "exp-pipeline__label",
								children: "Step 01"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: "Connect your systems in one pass." }), /* @__PURE__ */ jsx("p", { children: "We map POS, inventory, and transaction feeds into one clean operating model." })] })]
						}),
						/* @__PURE__ */ jsxs("article", {
							className: "exp-pipeline__step",
							children: [/* @__PURE__ */ jsx("p", {
								className: "exp-pipeline__label",
								children: "Step 02"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: "Normalize and score signal quality." }), /* @__PURE__ */ jsx("p", { children: "Coodra checks incoming feed reliability before recommendations are generated." })] })]
						}),
						/* @__PURE__ */ jsxs("article", {
							className: "exp-pipeline__step",
							children: [/* @__PURE__ */ jsx("p", {
								className: "exp-pipeline__label",
								children: "Step 03"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: "Push approved actions back to operations." }), /* @__PURE__ */ jsx("p", { children: "Teams can approve next moves with clear rationale and expected impact." })] })]
						})
					]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "exp-connector-band",
					"aria-label": "Connector coverage",
					children: integrations.map((item) => /* @__PURE__ */ jsxs("div", {
						className: "exp-connector",
						children: [/* @__PURE__ */ jsx("img", {
							src: item.logo,
							alt: "",
							"aria-hidden": "true"
						}), /* @__PURE__ */ jsx("span", { children: item.name })]
					}, `${item.name}-connector`))
				}),
				/* @__PURE__ */ jsx("section", {
					className: "integration-grid motion-stagger-grid",
					"aria-label": "Coodra POS integrations",
					children: integrations.map((item) => /* @__PURE__ */ jsxs("article", {
						className: "integration-card",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "integration-card__head",
							children: [/* @__PURE__ */ jsx("div", {
								className: "integration-card__logo",
								children: /* @__PURE__ */ jsx("img", {
									src: item.logo,
									alt: `${item.name} logo`
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: item.name }), /* @__PURE__ */ jsx("p", { children: item.summary })] })]
						}), /* @__PURE__ */ jsx("ul", { children: item.bullets.map((bullet) => /* @__PURE__ */ jsx("li", { children: bullet }, bullet)) })]
					}, item.name))
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "exp-cta motion-fade-up",
					"data-aos": "fade-up",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "Don't see your POS?" }),
						/* @__PURE__ */ jsx("p", { children: "We can still help. Tell us what you run and we'll map the cleanest path to connect." }),
						/* @__PURE__ */ jsxs("div", {
							className: "exp-cta__actions",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/contact",
								className: "exp-btn",
								children: "Contact us"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/case-studies",
								className: "exp-btn exp-btn--ghost",
								children: "View case studies"
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/integrations.tsx
var integrations_exports = /* @__PURE__ */ __exportAll({
	default: () => integrations_default,
	meta: () => meta$14
});
var meta$14 = () => [
	{ title: "POS Integrations - Coodra" },
	{
		name: "description",
		content: "Connect Shopify, Square, Lightspeed, and Clover to Coodra and turn live store data into clear daily retail actions."
	},
	{
		property: "og:title",
		content: "POS Integrations - Coodra"
	},
	{
		property: "og:description",
		content: "Connect Shopify, Square, Lightspeed, and Clover to Coodra and turn live store data into clear daily retail actions."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/integrations"
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
		content: "POS Integrations - Coodra"
	},
	{
		name: "twitter:description",
		content: "Connect Shopify, Square, Lightspeed, and Clover to Coodra and turn live store data into clear daily retail actions."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/integrations"
	}
];
var integrations_default = UNSAFE_withComponentProps(IntegrationsPage);
//#endregion
//#region src/pages/SecurityPage.tsx
var claims = [
	{
		claim: "Data encrypted at rest (AES-256)",
		evidence: "Architecture controls (available on request)",
		status: "Implemented"
	},
	{
		claim: "Data encrypted in transit (TLS 1.2+)",
		evidence: "Transport security policy and edge configuration",
		status: "Implemented"
	},
	{
		claim: "API keys scoped to least privilege",
		evidence: "Integration key policy documentation",
		status: "Implemented"
	},
	{
		claim: "GDPR alignment",
		evidence: "Privacy policy and DPA process",
		status: "In Progress"
	},
	{
		claim: "CCPA alignment",
		evidence: "Privacy rights workflow",
		status: "In Progress"
	},
	{
		claim: "Incident response SLA: 24 hours",
		evidence: "Response runbook (available on request)",
		status: "Implemented"
	},
	{
		claim: "Data residency: Canada + US",
		evidence: "Infrastructure region strategy",
		status: "Planned"
	}
];
function SecurityPage() {
	return /* @__PURE__ */ jsx("div", {
		className: "exp-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "exp-page__container",
			children: [
				/* @__PURE__ */ jsx(MarketingHeader, {}),
				/* @__PURE__ */ jsxs("section", {
					className: "exp-hero motion-fade-up",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "exp-hero__eyebrow",
							children: "Security"
						}),
						/* @__PURE__ */ jsx("h1", { children: "Your data. Locked down. Always." }),
						/* @__PURE__ */ jsx("p", { children: "Coodra is built with practical safeguards for retail operations teams. We prioritize data protection, operational reliability, and transparent controls." }),
						/* @__PURE__ */ jsx("div", {
							className: "exp-hero__actions",
							children: /* @__PURE__ */ jsx("a", {
								className: "exp-btn",
								href: "/security-summary.pdf",
								download: true,
								children: "Download security summary"
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "exp-pipeline",
					"aria-label": "Security operating model",
					children: [
						/* @__PURE__ */ jsxs("article", {
							className: "exp-pipeline__step",
							children: [/* @__PURE__ */ jsx("p", {
								className: "exp-pipeline__label",
								children: "Control"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: "Defense starts at integration boundaries." }), /* @__PURE__ */ jsx("p", { children: "Scoped credentials and explicit permission design reduce blast radius across retail systems." })] })]
						}),
						/* @__PURE__ */ jsxs("article", {
							className: "exp-pipeline__step",
							children: [/* @__PURE__ */ jsx("p", {
								className: "exp-pipeline__label",
								children: "Detection"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: "Operational telemetry is monitored continuously." }), /* @__PURE__ */ jsx("p", { children: "We track suspicious behavior and escalate with runbook-ready context." })] })]
						}),
						/* @__PURE__ */ jsxs("article", {
							className: "exp-pipeline__step",
							children: [/* @__PURE__ */ jsx("p", {
								className: "exp-pipeline__label",
								children: "Response"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: "Incidents move through a defined SLA workflow." }), /* @__PURE__ */ jsx("p", { children: "Teams receive status visibility and recovery actions without losing auditability." })] })]
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "security-matrix",
					"aria-label": "Security controls and status",
					children: [claims.map((row) => /* @__PURE__ */ jsxs("article", {
						className: "security-matrix__row",
						children: [
							/* @__PURE__ */ jsx("h3", { children: row.claim }),
							/* @__PURE__ */ jsx("p", { children: row.evidence }),
							/* @__PURE__ */ jsx("span", {
								className: `status-pill status-pill--${row.status.toLowerCase().replace(" ", "-")}`,
								children: row.status
							})
						]
					}, row.claim)), /* @__PURE__ */ jsxs("p", {
						className: "security-note",
						children: [
							"Need a deeper technical review? Email ",
							/* @__PURE__ */ jsx("a", {
								href: "mailto:admin@coodra.com",
								children: "admin@coodra.com"
							}),
							"."
						]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/security.tsx
var security_exports = /* @__PURE__ */ __exportAll({
	default: () => security_default,
	meta: () => meta$13
});
var meta$13 = () => [
	{ title: "Security - Coodra" },
	{
		name: "description",
		content: "Review Coodra security controls, implementation status, and operational safeguards for retail decision intelligence."
	},
	{
		property: "og:title",
		content: "Security - Coodra"
	},
	{
		property: "og:description",
		content: "Review Coodra security controls, implementation status, and operational safeguards for retail decision intelligence."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/security"
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
		content: "Security - Coodra"
	},
	{
		name: "twitter:description",
		content: "Review Coodra security controls, implementation status, and operational safeguards for retail decision intelligence."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/security"
	}
];
var security_default = UNSAFE_withComponentProps(SecurityPage);
//#endregion
//#region src/data/caseStudies.ts
var caseStudies = [{
	slug: "multi-location-grocery-margin-recovery",
	title: "Multi-location grocery margin recovery",
	industry: "Independent grocery",
	footprint: "4-store regional footprint, Ontario",
	challenge: "Planners were over-ordering low-velocity SKUs while fast movers ran out on peak days, compressing margin and causing avoidable stockouts.",
	approach: "Coodra ranked daily reorder, hold, and markdown actions from POS sell-through, margin contribution, and stock depth signals. Store leads approved the top actions each morning.",
	results: [
		{
			label: "Margin uplift",
			value: "+2.9%"
		},
		{
			label: "Stockout reduction",
			value: "-21%"
		},
		{
			label: "Planning hours saved per week",
			value: "11h"
		}
	],
	quote: "Instead of debating spreadsheets, we review ranked actions and move quickly with confidence.",
	quoteRole: "Operations lead, regional grocery retailer"
}, {
	slug: "specialty-retail-inventory-risk-control",
	title: "Specialty retail inventory risk control",
	industry: "Specialty hardgoods retail",
	footprint: "8-store mixed urban footprint, US",
	challenge: "The team lacked a consistent way to prioritize inventory risk, causing slow exits on weak movers and delayed transfers for high-demand locations.",
	approach: "Coodra surfaced ranked recommendations by priority with expected impact. Managers reviewed the top actions in one workflow and approved changes before afternoon replenishment.",
	results: [
		{
			label: "Slow-mover exposure reduction",
			value: "-18%"
		},
		{
			label: "Transfer speed improvement",
			value: "+32%"
		},
		{
			label: "Team decision cycle time",
			value: "-41%"
		}
	],
	quote: "The ranking and rationale gave our managers clarity. We shifted from reactive to proactive in weeks.",
	quoteRole: "Inventory manager, multi-store specialty retailer"
}];
var consentNotice = "Case studies currently use anonymized retailer profiles and illustrative metrics until written customer consent is finalized. Replace with approved customer data before public proof claims.";
function getCaseStudyBySlug(slug) {
	return caseStudies.find((study) => study.slug === slug);
}
//#endregion
//#region src/pages/CaseStudiesIndexPage.tsx
function CaseStudiesIndexPage() {
	return /* @__PURE__ */ jsx("div", {
		className: "case-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "case-page__container",
			children: [
				/* @__PURE__ */ jsx(MarketingHeader, {}),
				/* @__PURE__ */ jsxs("section", {
					className: "case-hero",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "case-hero__eyebrow",
							children: "Case Studies"
						}),
						/* @__PURE__ */ jsx("h1", { children: "How retail teams act faster with Coodra." }),
						/* @__PURE__ */ jsx("p", { children: "Two implementation-ready case study templates are live now so your team can evaluate challenge, approach, and measurable impact in one structure." })
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "case-consent",
					children: consentNotice
				}),
				/* @__PURE__ */ jsx("section", {
					className: "case-grid",
					"aria-label": "Case study list",
					children: caseStudies.map((study) => /* @__PURE__ */ jsxs("article", {
						className: "case-card",
						children: [
							/* @__PURE__ */ jsxs("p", {
								className: "case-card__meta",
								children: [
									study.industry,
									" - ",
									study.footprint
								]
							}),
							/* @__PURE__ */ jsx("h2", { children: study.title }),
							/* @__PURE__ */ jsx("p", { children: study.challenge }),
							/* @__PURE__ */ jsx("div", {
								className: "case-metrics",
								children: study.results.map((metric) => /* @__PURE__ */ jsxs("div", {
									className: "case-metric",
									children: [/* @__PURE__ */ jsx("strong", { children: metric.value }), /* @__PURE__ */ jsx("span", { children: metric.label })]
								}, metric.label))
							}),
							/* @__PURE__ */ jsx(Link, {
								to: `/case-studies/${study.slug}`,
								className: "case-card__link",
								children: "Read case study"
							})
						]
					}, study.slug))
				})
			]
		})
	});
}
//#endregion
//#region src/routes/case-studies.tsx
var case_studies_exports = /* @__PURE__ */ __exportAll({
	default: () => case_studies_default,
	meta: () => meta$12
});
var meta$12 = () => [
	{ title: "Case Studies - Coodra" },
	{
		name: "description",
		content: "See anonymized case study templates showing how Coodra helps retailers protect margin, reduce stock risk, and speed up decisions."
	},
	{
		property: "og:title",
		content: "Case Studies - Coodra"
	},
	{
		property: "og:description",
		content: "See anonymized case study templates showing how Coodra helps retailers protect margin, reduce stock risk, and speed up decisions."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/case-studies"
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
		content: "Case Studies - Coodra"
	},
	{
		name: "twitter:description",
		content: "See anonymized case study templates showing how Coodra helps retailers protect margin, reduce stock risk, and speed up decisions."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/case-studies"
	}
];
var case_studies_default = UNSAFE_withComponentProps(CaseStudiesIndexPage);
//#endregion
//#region src/pages/CaseStudyDetailPage.tsx
function CaseStudyDetailPage() {
	const { slug = "" } = useParams();
	const study = getCaseStudyBySlug(slug);
	if (!study) return /* @__PURE__ */ jsx("div", {
		className: "case-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "case-page__container",
			children: [/* @__PURE__ */ jsx(MarketingHeader, {}), /* @__PURE__ */ jsxs("article", {
				className: "case-article",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "case-crumbs",
						children: [
							"Home ",
							">",
							" Case Studies"
						]
					}),
					/* @__PURE__ */ jsx("h1", { children: "Case study not found" }),
					/* @__PURE__ */ jsx("p", { children: "We could not find the case study you requested." }),
					/* @__PURE__ */ jsx(Link, {
						to: "/case-studies",
						className: "case-back",
						children: "Return to case studies"
					})
				]
			})]
		})
	});
	const related = caseStudies.filter((item) => item.slug !== study.slug).slice(0, 1);
	return /* @__PURE__ */ jsx("div", {
		className: "case-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "case-page__container",
			children: [
				/* @__PURE__ */ jsx(MarketingHeader, {}),
				/* @__PURE__ */ jsx("p", {
					className: "case-consent",
					children: consentNotice
				}),
				/* @__PURE__ */ jsxs("article", {
					className: "case-article",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "case-crumbs",
							children: [
								"Home ",
								">",
								" Case Studies ",
								">",
								" ",
								study.title
							]
						}),
						/* @__PURE__ */ jsx("h1", { children: study.title }),
						/* @__PURE__ */ jsxs("p", {
							className: "case-article__sub",
							children: [
								study.industry,
								" - ",
								study.footprint
							]
						}),
						/* @__PURE__ */ jsx("h2", { children: "Challenge" }),
						/* @__PURE__ */ jsx("p", { children: study.challenge }),
						/* @__PURE__ */ jsx("h2", { children: "Approach" }),
						/* @__PURE__ */ jsx("p", { children: study.approach }),
						/* @__PURE__ */ jsx("h2", { children: "Results" }),
						/* @__PURE__ */ jsx("div", {
							className: "case-metrics",
							children: study.results.map((metric) => /* @__PURE__ */ jsxs("div", {
								className: "case-metric",
								children: [/* @__PURE__ */ jsx("strong", { children: metric.value }), /* @__PURE__ */ jsx("span", { children: metric.label })]
							}, metric.label))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "case-quote",
							children: [/* @__PURE__ */ jsxs("blockquote", { children: [
								"\"",
								study.quote,
								"\""
							] }), /* @__PURE__ */ jsx("cite", { children: study.quoteRole })]
						}),
						related.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("h2", { children: "Related case study" }), /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Link, {
							to: `/case-studies/${related[0].slug}`,
							children: related[0].title
						}) })] }) : null,
						/* @__PURE__ */ jsx(Link, {
							to: "/case-studies",
							className: "case-back",
							children: "Back to all case studies"
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/case-studies-slug.tsx
var case_studies_slug_exports = /* @__PURE__ */ __exportAll({
	default: () => case_studies_slug_default,
	meta: () => meta$11
});
var meta$11 = ({ params }) => {
	const study = getCaseStudyBySlug(params.slug || "");
	const title = study ? `${study.title} - Case Study - Coodra` : "Case Study - Coodra";
	const description = study ? `${study.industry} case study: ${study.challenge}` : "Retail case study from Coodra.";
	const url = study ? `https://www.coodra.com/case-studies/${study.slug}` : "https://www.coodra.com/case-studies";
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:image",
			content: "https://www.coodra.com/og-image.png"
		},
		{
			property: "og:url",
			content: url
		},
		{
			property: "og:type",
			content: "article"
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
			content: title
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: "https://www.coodra.com/og-image.png"
		},
		{
			name: "robots",
			content: "index, follow"
		},
		{
			tagName: "link",
			rel: "canonical",
			href: url
		}
	];
};
var case_studies_slug_default = UNSAFE_withComponentProps(CaseStudyDetailPage);
//#endregion
//#region src/data/blogPosts.ts
var blogPosts = [{
	slug: "inventory-mistakes-that-kill-margin",
	title: "5 inventory mistakes that kill margin (and how to catch them before they do)",
	excerpt: "A practical framework for spotting hidden inventory drag early and turning signals into high-confidence actions.",
	coverImage: "/images/blog/inventory-mistakes-infographic.webp",
	coverImageAlt: "Inventory mistakes infographic",
	category: "Inventory",
	readingTime: "7 min read",
	author: "Michael Shahid (CEO)",
	publishedAt: "April 13, 2026",
	content: [
		{
			type: "paragraph",
			text: "Every retailer has experienced it. You review your numbers at the end of the month and the margin looks worse than it should. Not because of pricing — but because of decisions made weeks earlier, when the signals were already there."
		},
		{
			type: "paragraph",
			text: "This is the quiet cost of inventory mismanagement. It does not show up as a dramatic loss. It shows up as slow weeks that should have been fast, stock that sat too long, and reorders placed on instinct instead of data."
		},
		{
			type: "paragraph",
			text: "These five mistakes are the most common. Coodra is built to catch all of them before they compound."
		},
		{
			type: "image",
			src: "/images/blog/inventory-mistakes-infographic.webp",
			alt: "Five inventory management mistakes that erode retail margin, with icons for each mistake",
			caption: "The five most compounding inventory mistakes in independent retail."
		},
		{
			type: "callout",
			text: "Mistake 1: Reordering the same quantities every cycle — regardless of actual demand"
		},
		{
			type: "paragraph",
			text: "Most independent retailers fall into a rhythm: reorder the same SKUs in the same quantities, on the same schedule. It is efficient. It feels safe. It is one of the most expensive habits in retail."
		},
		{
			type: "paragraph",
			text: "The problem is that demand changes. A product that sold 20 units a week six months ago might now sell 12. If you keep ordering for the old number, you will accumulate dead stock — capital locked up in inventory that sits and eventually forces a discounted clearance sale."
		},
		{
			type: "paragraph",
			text: "The same applies in reverse. A product that is climbing in velocity is a signal, not just a trend. Ignoring it means you run out at the worst moment: when customers are actively looking and you have nothing to offer."
		},
		{
			type: "paragraph",
			text: "Coodra surfaces your top sellers and flags when a fast-mover is trending upward before you accidentally reorder below the level that serves your customers. <a href=\"/integrations\">See how it works with your POS</a>."
		},
		{
			type: "callout",
			text: "Mistake 2: No safety stock for high-turn items"
		},
		{
			type: "paragraph",
			text: "Safety stock is not a luxury for enterprise retailers. For any SKU that sells consistently — especially a hero product or a category anchor — running with zero buffer is a known risk that most independent operators take anyway."
		},
		{
			type: "paragraph",
			text: "When a high-velocity item goes out of stock, you do not just lose that sale. You lose the next three sales while you wait for emergency replenishment. Emergency orders cost more, arrive slower, and often come in incomplete quantities."
		},
		{
			type: "paragraph",
			text: "A simple safety stock calculation for a consistent seller: multiply your average weekly velocity by two. That is your reorder threshold, not your reorder quantity. Use it to set a trigger, not a target."
		},
		{
			type: "paragraph",
			text: "Coodra flags low-inventory items against your sales velocity every week, so the safety stock conversation happens automatically — not in a manager's head. <a href=\"/integrations\">Connect your POS and get started</a>."
		},
		{
			type: "callout",
			text: "Mistake 3: Reacting to stockouts instead of preventing them"
		},
		{
			type: "paragraph",
			text: "By the time a retailer notices a stockout, the damage is done. The customer went somewhere else. The staff noted the gap. A reorder was placed — usually at a higher cost, with a longer lead time, and with less visibility into the rest of the order cycle."
		},
		{
			type: "paragraph",
			text: "Retailers who manage this well do not react to stockouts. They prevent them with a weekly review: look at what is approaching your reorder point, cross-reference with any known upcoming demand signals (season, promotion, local event), and place orders before the shelf is bare."
		},
		{
			type: "paragraph",
			text: "This takes 20 minutes a week. The alternative is spending those 20 minutes on the phone explaining to a customer why you do not have the product they came in for."
		},
		{
			type: "paragraph",
			text: "Coodra's weekly inventory review surfaces these signals in one view — which SKUs are approaching reorder point, which have been trending up, and which have enough buffer to wait. <a href=\"/integrations\">See the weekly review in action</a>."
		},
		{
			type: "callout",
			text: "Mistake 4: Mixing up products with similar names or UPCs"
		},
		{
			type: "paragraph",
			text: "A SKU called \"Large Silver Ring\" and another called \"Large Silver Band\" might look different in your system. In your staff's mind, they are the same thing. Mis-picks happen. Counts get confused. Returns get logged to the wrong SKU."
		},
		{
			type: "paragraph",
			text: "The result is a quiet bleed of inventory accuracy. You think you have 30 of one product. You have 20 of that product and 10 of another. The stock discrepancy does not surface until a manager notices a pattern of adjustments."
		},
		{
			type: "paragraph",
			text: "Fixing this requires a clean-up of your POS SKU names and a re-labeling of any physically ambiguous items. It is not exciting work. It is the kind of operational maintenance that separates retailers with reliable data from retailers who are always guessing."
		},
		{
			type: "paragraph",
			text: "Coodra's inventory reconciliation flags SKUs with anomalous movement — which is often the first sign of a mis-pick or count error compounding silently."
		},
		{
			type: "callout",
			text: "Mistake 5: Making purchasing decisions without knowing true cost per SKU"
		},
		{
			type: "paragraph",
			text: "Margin is not just the difference between your price and the supplier's invoice price. It includes freight, handling, shrinkage, and the cost of capital tied up in inventory. A product that appears to deliver a 35% margin might deliver 22% once all of those costs are accounted for."
		},
		{
			type: "paragraph",
			text: "If you are making reorder decisions on gross margin — or worse, on intuition — you are almost certainly misallocating capital. You are likely over-ordering on products that feel profitable but are not, while under-ordering on products that genuinely deliver strong net margin."
		},
		{
			type: "paragraph",
			text: "The fix is not complex. Know your landed cost per SKU. At minimum, know your freight-adjusted cost. If you do not have this broken out in your POS data, Coodra can help you surface it from your order history and start ranking SKUs by actual contribution margin rather than top-line revenue. <a href=\"/pricing\">See pricing and plans</a>."
		},
		{
			type: "paragraph",
			text: "These five mistakes are not unique to one type of retailer. The specifics vary — the pattern is the same across jewelry, grocery, pharmacy, and specialty retail."
		},
		{
			type: "paragraph",
			text: "The question is not whether these mistakes are happening in your store. The question is whether you have a system that catches them before they compound into margin damage you cannot recover in the same quarter."
		},
		{
			type: "paragraph",
			text: "Coodra reviews your sales, inventory, and demand signals every week and surfaces the five decisions most worth acting on — ranked by impact on your margin, not by urgency alone."
		},
		{
			type: "paragraph",
			text: "Start your free trial and see what your inventory data has been telling you."
		}
	]
}, {
	slug: "pos-data-trust-guide",
	title: "Shopify vs Square vs Lightspeed: which POS data should you trust for inventory decisions?",
	excerpt: "How to evaluate signal quality across POS platforms and avoid making critical inventory calls on noisy data.",
	coverImage: "/images/blog/erp-vs-pos-comparison.webp",
	coverImageAlt: "ERP versus POS planning comparison",
	category: "Industry Trends",
	readingTime: "8 min read",
	author: "Michael Shahid (CEO)",
	publishedAt: "April 13, 2026",
	content: [
		{
			type: "paragraph",
			text: "There is a persistent assumption in retail inventory planning that serious demand forecasting requires an ERP system. NetSuite, SAP, Epicor — serious planning requires serious software."
		},
		{
			type: "paragraph",
			text: "For a $3 million independent retailer running Shopify or Square, this assumption is not just wrong. It is actively harmful. It leads operators to either accept inadequate planning or take on a software investment that creates more operational overhead than the inventory problems it was supposed to solve."
		},
		{
			type: "paragraph",
			text: "The real question is not whether independent retailers can do demand forecasting. It is what level of demand forecasting actually moves the needle for a POS-connected store — and whether ERP-adjacent tools are the best way to get there."
		},
		{
			type: "paragraph",
			text: "This is what we have found working with retailers across grocery, pharmacy, jewelry, and specialty retail."
		},
		{
			type: "callout",
			text: "Why ERP-first thinking does not serve independent retailers"
		},
		{
			type: "paragraph",
			text: "ERP systems are built for companies with complex supply chains, multiple warehouse locations, and dedicated inventory planners. They assume a certain operational maturity: clean SKU-level data, regular cycle counts, a team member whose job is inventory management."
		},
		{
			type: "paragraph",
			text: "Most independent retailers do not have any of those things. They have a POS that logs every sale, a once-a-week check on what is running low, and an owner who is making purchasing decisions between customer interactions."
		},
		{
			type: "paragraph",
			text: "This is not a gap in the retailer's capability. It is a gap in the software market. The tools built for enterprise do not compress well for SMB use cases. You end up paying for modules you will never use, integrations that require IT support, and a learning curve that takes months before the first real planning insight arrives."
		},
		{
			type: "paragraph",
			text: "Coodra was built specifically for this gap — taking POS data from Shopify, Square, or Lightspeed and turning it into ranked, actionable recommendations without requiring a single ERP configuration. <a href=\"/integrations\">See which POS systems connect to Coodra</a>."
		},
		{
			type: "callout",
			text: "The POS-first demand signal: what your point of sale already knows"
		},
		{
			type: "paragraph",
			text: "Your POS already knows more about your demand patterns than most retailers realize. Every transaction is a data point. The velocity of each SKU, the day-of-week patterns, the seasonal curves, the co-purchasing relationships — it is all in your sales history."
		},
		{
			type: "paragraph",
			text: "The challenge is not data. It is signal extraction. Raw POS data tells you what sold. It does not tell you what is about to sell, what is about to run out, or which SKU is quietly becoming a faster mover than it was eight weeks ago."
		},
		{
			type: "paragraph",
			text: "What POS-first demand intelligence does is surface those signals automatically. Coodra pulls your last 90 days of sales and inventory data and generates a ranked list of inventory decisions — which SKUs to reorder now, which to hold, which to reduce. Updated weekly, based on fresh data from your POS."
		},
		{
			type: "image",
			src: "/images/blog/erp-vs-pos-comparison.webp",
			alt: "Comparison of ERP-first inventory planning vs POS-connected demand intelligence for independent retailers",
			caption: "Enterprise inventory planning requires months of setup. POS-direct intelligence goes live in a day."
		},
		{
			type: "callout",
			text: "What good demand forecasting actually looks like at independent scale"
		},
		{
			type: "paragraph",
			text: "For a 2-3 location retailer running Shopify or Square, good demand forecasting does not mean building an AI model. It means answering five questions every week:"
		},
		{
			type: "paragraph",
			text: "Which products am I running low on before they become a stockout?\nWhich products have I been over-ordering relative to their actual velocity?\nIs there a demand trend building on any of my hero SKUs before it shows up as a backorder?\nWhat should I reorder differently this week compared to last week, and why?\nWhich products are approaching the end of their seasonal cycle and need to be reduced or cleared?"
		},
		{
			type: "paragraph",
			text: "Answering these five questions from your POS data is what Coodra does every week. It does not require an ERP. It does not require a dedicated planner. It requires connecting your POS once and letting the recommendations come to you."
		},
		{
			type: "paragraph",
			text: "The five outputs are not theoretical. They map directly to margin protection. A missed stockout on your top seller costs you the sale and often the customer. An over-order on a slow-mover costs you the margin on the discounted clearance. Preventing both is what good demand intelligence delivers. <a href=\"/pricing\">See how Coodra pricing works</a>."
		},
		{
			type: "callout",
			text: "The \"no ERP required\" angle is not a compromise — it is a positioning"
		},
		{
			type: "paragraph",
			text: "Independent retailers who have looked at Coodra and asked \"why does this not need an ERP?\" are asking the right question from the wrong angle. The question is not why Coodra does not need an ERP. The question is why you would add an ERP to solve a problem your POS already has the data to help you solve."
		},
		{
			type: "paragraph",
			text: "The ERP market is built for complexity. Coodra is built for the retailer who wants the outcome — better inventory decisions, protected margin, less firefighting — without the overhead of enterprise software."
		},
		{
			type: "paragraph",
			text: "If you are running Shopify, Square, or Lightspeed and you are spending time wondering whether you need an ERP to do inventory planning justice, the honest answer is: probably not. <a href=\"/signup\">Connect your POS to Coodra</a> and see what your data has been telling you."
		}
	]
}];
function getBlogPostBySlug(slug) {
	return blogPosts.find((post) => post.slug === slug);
}
//#endregion
//#region src/pages/BlogIndexPage.tsx
function BlogIndexPage() {
	return /* @__PURE__ */ jsx("div", {
		className: "blog-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "blog-page__container",
			children: [
				/* @__PURE__ */ jsx(MarketingHeader, {}),
				/* @__PURE__ */ jsxs("section", {
					className: "blog-hero",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "blog-hero__eyebrow",
							children: "Blog"
						}),
						/* @__PURE__ */ jsx("h1", { children: "Retail decision insights for operators." }),
						/* @__PURE__ */ jsx("p", { children: "Actionable breakdowns on inventory, POS signal quality, and practical operating moves that improve margin and reduce stock risk." })
					]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "blog-grid",
					"aria-label": "Blog posts",
					children: blogPosts.map((post) => /* @__PURE__ */ jsx("article", {
						className: "blog-card-wrap",
						children: /* @__PURE__ */ jsxs(Link, {
							className: "blog-card",
							to: `/blog/${post.slug}`,
							"aria-label": `Read ${post.title}`,
							children: [/* @__PURE__ */ jsx("figure", {
								className: "blog-card__thumb",
								children: /* @__PURE__ */ jsx("img", {
									src: post.coverImage,
									alt: post.coverImageAlt,
									loading: "lazy"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "blog-card__body",
								children: [
									/* @__PURE__ */ jsxs("p", {
										className: "blog-card__meta",
										children: [
											post.category,
											" - ",
											post.readingTime
										]
									}),
									/* @__PURE__ */ jsx("h2", { children: post.title }),
									/* @__PURE__ */ jsx("p", { children: post.excerpt }),
									/* @__PURE__ */ jsx("span", {
										className: "blog-card__link",
										children: "Read article"
									})
								]
							})]
						})
					}, post.slug))
				})
			]
		})
	});
}
//#endregion
//#region src/routes/blog.tsx
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => blog_default,
	meta: () => meta$10
});
var meta$10 = () => [
	{ title: "Blog - Coodra" },
	{
		name: "description",
		content: "Retail decision intelligence articles on inventory, margin protection, POS signal quality, and faster store operations."
	},
	{
		property: "og:title",
		content: "Blog - Coodra"
	},
	{
		property: "og:description",
		content: "Retail decision intelligence articles on inventory, margin protection, POS signal quality, and faster store operations."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/blog"
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
		content: "Blog - Coodra"
	},
	{
		name: "twitter:description",
		content: "Retail decision intelligence articles on inventory, margin protection, POS signal quality, and faster store operations."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/blog"
	}
];
var blog_default = UNSAFE_withComponentProps(BlogIndexPage);
//#endregion
//#region src/pages/BlogPostPage.tsx
function BlogPostPage() {
	const { slug = "" } = useParams();
	const post = getBlogPostBySlug(slug);
	const [feedback, setFeedback] = useState(null);
	useEffect(() => {
		if (!post) return;
		const timer = window.setTimeout(() => {
			trackEvent("blog_article_read", {
				article_slug: post.slug,
				page_path: `/blog/${post.slug}`,
				seconds_on_page: 30
			});
		}, 3e4);
		return () => window.clearTimeout(timer);
	}, [post]);
	if (!post) return /* @__PURE__ */ jsx("div", {
		className: "blog-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "blog-page__container",
			children: [/* @__PURE__ */ jsx(MarketingHeader, {}), /* @__PURE__ */ jsxs("article", {
				className: "blog-article",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "blog-breadcrumbs",
						children: [
							"Home ",
							">",
							" Blog"
						]
					}),
					/* @__PURE__ */ jsx("h1", { children: "Article not found" }),
					/* @__PURE__ */ jsx("p", {
						className: "blog-article__lede",
						children: "We could not find this blog article."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "blog-cta",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/blog",
							children: "Back to blog"
						})
					})
				]
			})]
		})
	});
	const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);
	return /* @__PURE__ */ jsx("div", {
		className: "blog-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "blog-page__container",
			children: [/* @__PURE__ */ jsx(MarketingHeader, {}), /* @__PURE__ */ jsxs("article", {
				className: "blog-article",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "blog-breadcrumbs",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								children: "Home"
							}),
							" ",
							">",
							" ",
							/* @__PURE__ */ jsx(Link, {
								to: "/blog",
								children: "Blog"
							}),
							" ",
							">",
							" ",
							post.title
						]
					}),
					/* @__PURE__ */ jsx("h1", { children: post.title }),
					/* @__PURE__ */ jsxs("p", {
						className: "blog-article__meta",
						children: [
							post.category,
							" - ",
							post.readingTime,
							" - ",
							post.author,
							" - ",
							post.publishedAt
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "blog-article__lede",
						children: post.excerpt
					}),
					/* @__PURE__ */ jsx("div", {
						className: "blog-content",
						children: post.content.map((block, i) => {
							if (block.type === "paragraph") return /* @__PURE__ */ jsx("div", {
								className: "blog-content__paragraph",
								dangerouslySetInnerHTML: { __html: block.text }
							}, i);
							if (block.type === "image") return /* @__PURE__ */ jsxs("figure", {
								className: "blog-content__image",
								children: [/* @__PURE__ */ jsx("img", {
									src: block.src,
									alt: block.alt,
									loading: "lazy"
								}), block.caption && /* @__PURE__ */ jsx("figcaption", { children: block.caption })]
							}, i);
							if (block.type === "callout") return /* @__PURE__ */ jsx("div", {
								className: "blog-content__callout",
								children: block.text
							}, i);
							return null;
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "blog-helpful",
						children: [
							/* @__PURE__ */ jsx("p", { children: "Was this helpful?" }),
							/* @__PURE__ */ jsxs("div", {
								className: "blog-helpful__actions",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => {
										setFeedback("yes");
										trackEvent("blog_feedback", {
											article_slug: post.slug,
											helpful: true
										});
									},
									children: "Yes"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => {
										setFeedback("no");
										trackEvent("blog_feedback", {
											article_slug: post.slug,
											helpful: false
										});
									},
									children: "No"
								})]
							}),
							feedback ? /* @__PURE__ */ jsx("p", { children: "Thanks for the feedback." }) : null
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "blog-cta",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/signup",
							className: "btn",
							children: "Start Free"
						})
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "blog-related",
						children: [/* @__PURE__ */ jsx("h2", { children: "Related articles" }), /* @__PURE__ */ jsx("ul", { children: related.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: `/blog/${item.slug}`,
							children: item.title
						}) }, item.slug)) })]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/routes/blog-slug.tsx
var blog_slug_exports = /* @__PURE__ */ __exportAll({
	default: () => blog_slug_default,
	meta: () => meta$9
});
var meta$9 = ({ params }) => {
	const post = getBlogPostBySlug(params.slug || "");
	const title = post ? `${post.title} - Coodra Blog` : "Blog Article - Coodra";
	const description = post ? post.excerpt : "Retail decision intelligence article from Coodra.";
	const url = post ? `https://www.coodra.com/blog/${post.slug}` : "https://www.coodra.com/blog";
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:image",
			content: "https://www.coodra.com/og-image.png"
		},
		{
			property: "og:url",
			content: url
		},
		{
			property: "og:type",
			content: "article"
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
			content: title
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: "https://www.coodra.com/og-image.png"
		},
		{
			name: "robots",
			content: "index, follow"
		},
		{
			tagName: "link",
			rel: "canonical",
			href: url
		}
	];
};
var blog_slug_default = UNSAFE_withComponentProps(BlogPostPage);
//#endregion
//#region src/pages/PrivacyPage.tsx
function PrivacyPage() {
	return /* @__PURE__ */ jsx("div", {
		className: "legal-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "legal-page__container",
			children: [/* @__PURE__ */ jsx(MarketingHeader, {}), /* @__PURE__ */ jsxs("div", {
				className: "legal-page__shell",
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "legal-page__sidebar",
					children: [/* @__PURE__ */ jsx("p", {
						className: "legal-page__sidebarTitle",
						children: "On this page"
					}), /* @__PURE__ */ jsxs("nav", {
						className: "legal-page__sidebarLinks",
						"aria-label": "Privacy sections",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#info-collect",
								children: "Information we collect"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#how-use",
								children: "How we use information"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#consent-comms",
								children: "Consent and communications"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#service-providers",
								children: "Service providers"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#rights",
								children: "Your rights"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#contact",
								children: "Contact"
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("article", {
					className: "legal-page__card",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "legal-page__eyebrow",
							children: "Legal"
						}),
						/* @__PURE__ */ jsx("h1", { children: "Privacy Policy" }),
						/* @__PURE__ */ jsx("p", {
							className: "legal-page__updated",
							children: "Last updated: April 12, 2026"
						}),
						/* @__PURE__ */ jsxs("p", { children: [
							"This Privacy Policy explains how Coodra collects, uses, discloses, and protects personal information when you use our website and services. If you have questions, contact us at ",
							/* @__PURE__ */ jsx("a", {
								href: "mailto:admin@coodra.com",
								children: "admin@coodra.com"
							}),
							"."
						] }),
						/* @__PURE__ */ jsx("p", {
							className: "legal-page__highlight",
							children: "Coodra is designed for business users. We process retail operational data to provide decision support, while keeping people in control of final actions."
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "info-collect",
							children: [/* @__PURE__ */ jsx("h2", { children: "1. Information We Collect" }), /* @__PURE__ */ jsxs("ul", { children: [
								/* @__PURE__ */ jsx("li", { children: "Account data: name, business name, email, login credentials." }),
								/* @__PURE__ */ jsx("li", { children: "Business and platform data: POS, catalog, inventory, sales, and demand-related operational data you connect." }),
								/* @__PURE__ */ jsx("li", { children: "Usage and technical data: device/browser details, IP address, logs, and service diagnostics." }),
								/* @__PURE__ */ jsx("li", { children: "Communications: support requests, onboarding responses, and account emails." })
							] })]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "how-use",
							children: [/* @__PURE__ */ jsx("h2", { children: "2. How We Use Information" }), /* @__PURE__ */ jsxs("ul", { children: [
								/* @__PURE__ */ jsx("li", { children: "Provide, maintain, and improve Coodra services and recommendations." }),
								/* @__PURE__ */ jsx("li", { children: "Authenticate users, secure accounts, and prevent fraud/abuse." }),
								/* @__PURE__ */ jsx("li", { children: "Communicate product, support, security, billing, and policy updates." }),
								/* @__PURE__ */ jsx("li", { children: "Comply with legal obligations and enforce our Terms." })
							] })]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "consent-comms",
							children: [/* @__PURE__ */ jsx("h2", { children: "3. Consent and Communications (Canada/US)" }), /* @__PURE__ */ jsx("p", { children: "By creating an account, you consent to the collection and use described in this policy. Where required by law (including CASL in Canada and CAN-SPAM in the US), marketing emails are sent with required disclosures and an unsubscribe mechanism. You can opt out of non-essential marketing communications at any time." })]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "service-providers",
							children: [/* @__PURE__ */ jsx("h2", { children: "4. Disclosure to Service Providers" }), /* @__PURE__ */ jsx("p", { children: "We may share information with trusted processors and vendors who help us operate Coodra (for example hosting, authentication, analytics, support, and email delivery), under contractual confidentiality and data protection obligations." })]
						}),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "5. Data Retention" }), /* @__PURE__ */ jsx("p", { children: "We retain personal information only as long as needed for the purposes in this policy, to provide services, resolve disputes, enforce agreements, and meet legal requirements." })] }),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "6. Security" }), /* @__PURE__ */ jsx("p", { children: "We use administrative, technical, and organizational safeguards designed to protect data from unauthorized access, loss, misuse, or alteration. No method of transmission or storage is 100% secure." })] }),
						/* @__PURE__ */ jsxs("section", {
							id: "rights",
							children: [
								/* @__PURE__ */ jsx("h2", { children: "7. Your Rights" }),
								/* @__PURE__ */ jsxs("ul", { children: [
									/* @__PURE__ */ jsx("li", { children: "Access and correction rights for personal information we hold about you." }),
									/* @__PURE__ */ jsx("li", { children: "Withdraw consent (subject to legal/contractual limitations)." }),
									/* @__PURE__ */ jsx("li", { children: "Request deletion where applicable." }),
									/* @__PURE__ */ jsx("li", { children: "For certain US state residents (including California), rights may include: right to know categories/sources/uses of personal information, right to delete, right to correct, and right to non-discrimination for exercising privacy rights." })
								] }),
								/* @__PURE__ */ jsxs("p", { children: [
									"To submit a privacy request, email ",
									/* @__PURE__ */ jsx("a", {
										href: "mailto:admin@coodra.com",
										children: "admin@coodra.com"
									}),
									"."
								] })
							]
						}),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "8. International Data Transfers" }), /* @__PURE__ */ jsx("p", { children: "If you access Coodra from outside the country where data is processed, your information may be transferred across borders and handled under applicable legal safeguards." })] }),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "9. Children's Privacy" }), /* @__PURE__ */ jsx("p", { children: "Coodra is intended for business users and is not directed to children under 13. We do not knowingly collect personal information from children under 13." })] }),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "10. Policy Updates" }), /* @__PURE__ */ jsx("p", { children: "We may update this policy from time to time. Material updates will be posted on this page with a revised “Last updated” date." })] }),
						/* @__PURE__ */ jsxs("section", {
							id: "contact",
							children: [/* @__PURE__ */ jsx("h2", { children: "11. Contact" }), /* @__PURE__ */ jsxs("p", { children: ["Privacy questions and requests: ", /* @__PURE__ */ jsx("a", {
								href: "mailto:admin@coodra.com",
								children: "admin@coodra.com"
							})] })]
						})
					]
				})]
			})]
		})
	});
}
//#endregion
//#region src/routes/privacy.tsx
var privacy_exports = /* @__PURE__ */ __exportAll({
	default: () => privacy_default,
	meta: () => meta$8
});
var meta$8 = () => [
	{ title: "Privacy Policy — Coodra" },
	{
		name: "description",
		content: "Read how Coodra collects, uses, and protects personal information across Canada and the United States."
	},
	{
		property: "og:title",
		content: "Privacy Policy — Coodra"
	},
	{
		property: "og:description",
		content: "Read how Coodra collects, uses, and protects personal information across Canada and the United States."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/privacy"
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
		content: "Privacy Policy — Coodra"
	},
	{
		name: "twitter:description",
		content: "Read how Coodra collects, uses, and protects personal information across Canada and the United States."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/privacy"
	}
];
var privacy_default = UNSAFE_withComponentProps(PrivacyPage);
//#endregion
//#region src/pages/TermsPage.tsx
function TermsPage() {
	return /* @__PURE__ */ jsx("div", {
		className: "legal-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "legal-page__container",
			children: [/* @__PURE__ */ jsx(MarketingHeader, {}), /* @__PURE__ */ jsxs("div", {
				className: "legal-page__shell",
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "legal-page__sidebar",
					children: [/* @__PURE__ */ jsx("p", {
						className: "legal-page__sidebarTitle",
						children: "On this page"
					}), /* @__PURE__ */ jsxs("nav", {
						className: "legal-page__sidebarLinks",
						"aria-label": "Terms sections",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#eligibility",
								children: "Eligibility and accounts"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#service-scope",
								children: "Service scope"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#acceptable-use",
								children: "Acceptable use"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#billing",
								children: "Fees and billing"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#liability",
								children: "Liability"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#contact",
								children: "Contact"
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("article", {
					className: "legal-page__card",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "legal-page__eyebrow",
							children: "Legal"
						}),
						/* @__PURE__ */ jsx("h1", { children: "Terms and Conditions" }),
						/* @__PURE__ */ jsx("p", {
							className: "legal-page__updated",
							children: "Last updated: April 12, 2026"
						}),
						/* @__PURE__ */ jsxs("p", { children: [
							"These Terms and Conditions govern your access to and use of Coodra services. By creating an account or using Coodra, you agree to these Terms. If you do not agree, do not use the service. Contact us at ",
							/* @__PURE__ */ jsx("a", {
								href: "mailto:admin@coodra.com",
								children: "admin@coodra.com"
							}),
							"."
						] }),
						/* @__PURE__ */ jsx("p", {
							className: "legal-page__highlight",
							children: "Coodra provides decision support software. Final operational and purchasing decisions remain your responsibility."
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "eligibility",
							children: [/* @__PURE__ */ jsx("h2", { children: "1. Eligibility and Accounts" }), /* @__PURE__ */ jsxs("ul", { children: [
								/* @__PURE__ */ jsx("li", { children: "You must be authorized to bind your business organization to these Terms." }),
								/* @__PURE__ */ jsx("li", { children: "You are responsible for account credentials and all activity under your account." }),
								/* @__PURE__ */ jsx("li", { children: "You must provide accurate information and keep it up to date." })
							] })]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "service-scope",
							children: [/* @__PURE__ */ jsx("h2", { children: "2. Service Scope" }), /* @__PURE__ */ jsx("p", { children: "Coodra provides software and decision-support recommendations based on retail data signals. Recommendations are informational and do not replace independent business judgment." })]
						}),
						/* @__PURE__ */ jsxs("section", {
							id: "acceptable-use",
							children: [
								/* @__PURE__ */ jsx("h2", { children: "3. Acceptable Use" }),
								/* @__PURE__ */ jsx("p", { children: "You agree not to:" }),
								/* @__PURE__ */ jsxs("ul", { children: [
									/* @__PURE__ */ jsx("li", { children: "Use Coodra for unlawful, fraudulent, abusive, or deceptive purposes." }),
									/* @__PURE__ */ jsx("li", { children: "Attempt unauthorized access to systems, accounts, or data." }),
									/* @__PURE__ */ jsx("li", { children: "Interfere with platform security, integrity, or performance." }),
									/* @__PURE__ */ jsx("li", { children: "Reverse engineer or copy proprietary service components except as permitted by law." })
								] })
							]
						}),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "4. Data and Privacy" }), /* @__PURE__ */ jsxs("p", { children: [
							"Your use of Coodra is also governed by our ",
							/* @__PURE__ */ jsx(Link, {
								to: "/privacy",
								children: "Privacy Policy"
							}),
							". You represent that you have rights and authority to provide any business data you connect to Coodra."
						] })] }),
						/* @__PURE__ */ jsxs("section", {
							id: "billing",
							children: [/* @__PURE__ */ jsx("h2", { children: "5. Fees and Billing" }), /* @__PURE__ */ jsx("p", { children: "If you purchase paid features, fees and billing terms will be presented at checkout or in a separate order form. Unless stated otherwise, fees are non-refundable except where required by law." })]
						}),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "6. Intellectual Property" }), /* @__PURE__ */ jsxs("ul", { children: [/* @__PURE__ */ jsx("li", { children: "Coodra and its underlying software, models, and content are owned by Coodra or its licensors." }), /* @__PURE__ */ jsx("li", { children: "Subject to these Terms, we grant you a limited, non-exclusive, non-transferable right to use the service for your internal business use." })] })] }),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "7. Third-Party Services" }), /* @__PURE__ */ jsx("p", { children: "Coodra may connect with third-party systems (for example POS and commerce platforms). Your use of those services is governed by their own terms and privacy policies." })] }),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "8. Disclaimers" }), /* @__PURE__ */ jsx("p", { children: "Coodra is provided “as is” and “as available.” To the maximum extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement." })] }),
						/* @__PURE__ */ jsxs("section", {
							id: "liability",
							children: [/* @__PURE__ */ jsx("h2", { children: "9. Limitation of Liability" }), /* @__PURE__ */ jsx("p", { children: "To the maximum extent permitted by law, Coodra is not liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits, revenue, or data. Our aggregate liability is limited to the amounts paid to Coodra for the service in the twelve (12) months before the claim." })]
						}),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "10. Indemnity" }), /* @__PURE__ */ jsx("p", { children: "You agree to indemnify and hold Coodra harmless from claims, damages, and costs arising from your misuse of the service, violation of these Terms, or violation of applicable law." })] }),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "11. Suspension and Termination" }), /* @__PURE__ */ jsx("p", { children: "We may suspend or terminate access for material violations, security risk, or legal compliance reasons. You may stop using Coodra at any time." })] }),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "12. Governing Law" }), /* @__PURE__ */ jsx("p", { children: "These Terms are governed by the laws of Ontario, Canada and applicable federal laws of Canada, without regard to conflict of law principles, subject to mandatory consumer protection laws." })] }),
						/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", { children: "13. Changes to Terms" }), /* @__PURE__ */ jsx("p", { children: "We may update these Terms from time to time. Continued use after updates means you accept the revised Terms." })] }),
						/* @__PURE__ */ jsxs("section", {
							id: "contact",
							children: [/* @__PURE__ */ jsx("h2", { children: "14. Contact" }), /* @__PURE__ */ jsxs("p", { children: ["Questions about these Terms: ", /* @__PURE__ */ jsx("a", {
								href: "mailto:admin@coodra.com",
								children: "admin@coodra.com"
							})] })]
						})
					]
				})]
			})]
		})
	});
}
//#endregion
//#region src/routes/terms.tsx
var terms_exports = /* @__PURE__ */ __exportAll({
	default: () => terms_default,
	meta: () => meta$7
});
var meta$7 = () => [
	{ title: "Terms and Conditions — Coodra" },
	{
		name: "description",
		content: "Read Coodra terms and conditions for account use, data usage, service scope, and legal terms."
	},
	{
		property: "og:title",
		content: "Terms and Conditions — Coodra"
	},
	{
		property: "og:description",
		content: "Read Coodra terms and conditions for account use, data usage, service scope, and legal terms."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/terms"
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
		content: "Terms and Conditions — Coodra"
	},
	{
		name: "twitter:description",
		content: "Read Coodra terms and conditions for account use, data usage, service scope, and legal terms."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/terms"
	}
];
var terms_default = UNSAFE_withComponentProps(TermsPage);
//#endregion
//#region src/pages/PricingPage.tsx
var YEARLY_DISCOUNT_LABEL = "Save 18%";
var tiers = [
	{
		name: "Free",
		monthlyPrice: 0,
		yearlyPrice: 0,
		description: "Start free. No credit card. Connect your POS in 5 minutes.",
		cta: "Start Free",
		items: [
			"1 store",
			"500 products tracked",
			"75 AI decisions / month",
			"Reorder, replace, remove decisions",
			"Basic margin insights",
			"POS included: Shopify, Square, Lightspeed, Clover, Moneris",
			"1 team member"
		]
	},
	{
		name: "Starter",
		monthlyPrice: 79,
		yearlyPrice: 777,
		description: "For solo retailers ready to stop guessing and start knowing.",
		cta: "Choose Starter",
		items: [
			"Everything in Free",
			"2,500 products tracked",
			"500 AI decisions / month",
			"Category performance",
			"Export data",
			"POS included: Shopify, Square, Lightspeed, Clover, Moneris",
			"2 team members",
			"No per-seat fees"
		]
	},
	{
		name: "Growth",
		monthlyPrice: 199,
		yearlyPrice: 1957,
		description: "For retailers ready to let Coodra run full product strategy.",
		cta: "Choose Growth",
		popular: true,
		items: [
			"Everything in Starter",
			"5 stores",
			"10,000 products tracked",
			"Unlimited AI decisions",
			"Market signals and trend detection",
			"Inventory risk alerts",
			"POS included: Shopify, Square, Lightspeed, Clover, Moneris",
			"10 team members",
			"No per-seat fees"
		]
	},
	{
		name: "Pro",
		monthlyPrice: 349,
		yearlyPrice: 3434,
		description: "For growing retailers with multiple locations.",
		cta: "Choose Pro",
		items: [
			"Everything in Growth",
			"15 stores",
			"Unlimited products",
			"Priority support",
			"Custom alerts",
			"POS included: Shopify, Square, Lightspeed, Clover, Moneris",
			"25 team members",
			"No per-seat fees"
		]
	},
	{
		name: "Enterprise",
		monthlyPrice: "Custom",
		yearlyPrice: "Custom",
		description: "For large retail operations that need custom everything.",
		cta: "Talk to Sales",
		items: [
			"Everything in Pro",
			"Unlimited stores",
			"Dedicated CSM",
			"Custom integrations",
			"SLA",
			"API access",
			"Unlimited team members"
		]
	}
];
var features = [
	[
		"Stores",
		"1",
		"1",
		"5",
		"15",
		"Unlimited"
	],
	[
		"Products tracked",
		"500",
		"2,500",
		"10,000",
		"Unlimited",
		"Unlimited"
	],
	[
		"AI decisions / month",
		"75",
		"500",
		"Unlimited",
		"Unlimited",
		"Unlimited"
	],
	[
		"Team members",
		"1",
		"2",
		"10",
		"25",
		"Unlimited"
	],
	[
		"POS integrations included",
		"Yes",
		"Yes",
		"Yes",
		"Yes",
		"Yes"
	],
	[
		"Reorder / Replace / Remove",
		"Yes",
		"Yes",
		"Yes",
		"Yes",
		"Yes"
	],
	[
		"Category performance",
		"-",
		"Yes",
		"Yes",
		"Yes",
		"Yes"
	],
	[
		"Market signals",
		"-",
		"-",
		"Yes",
		"Yes",
		"Yes"
	],
	[
		"Trend detection",
		"-",
		"-",
		"Yes",
		"Yes",
		"Yes"
	],
	[
		"Inventory risk alerts",
		"-",
		"-",
		"Yes",
		"Yes",
		"Yes"
	],
	[
		"Priority support",
		"-",
		"-",
		"-",
		"Yes",
		"Yes"
	],
	[
		"Custom alerts",
		"-",
		"-",
		"-",
		"Yes",
		"Yes"
	],
	[
		"API access",
		"-",
		"-",
		"-",
		"-",
		"Yes"
	]
];
function formatPrice(value, yearly) {
	if (value === "Custom") return "Custom";
	return `$${value.toLocaleString()}${yearly ? "/year" : "/month"}`;
}
function PricingPage() {
	const [isYearly, setIsYearly] = useState(false);
	const toggleBillingPeriod = () => setIsYearly((prev) => !prev);
	const displayTiers = useMemo(() => tiers.map((tier) => ({
		...tier,
		displayPrice: formatPrice(isYearly ? tier.yearlyPrice : tier.monthlyPrice, isYearly)
	})), [isYearly]);
	return /* @__PURE__ */ jsxs("div", {
		className: "pricing-page",
		children: [/* @__PURE__ */ jsx(MarketingHeader, {}), /* @__PURE__ */ jsxs("main", {
			className: "container pricing-main",
			children: [
				/* @__PURE__ */ jsxs("section", {
					className: "pricing-hero",
					children: [
						/* @__PURE__ */ jsx("h1", { children: "Pricing that scales with your retail footprint" }),
						/* @__PURE__ */ jsx("p", { children: "Connect POS once, then let Coodra run smarter decisions every day." }),
						/* @__PURE__ */ jsxs("div", {
							className: "pricing-billing-switch",
							role: "tablist",
							"aria-label": "Billing period",
							onClick: toggleBillingPeriod,
							onKeyDown: (event) => {
								if (event.key === "Enter" || event.key === " ") {
									event.preventDefault();
									toggleBillingPeriod();
								}
							},
							tabIndex: 0,
							children: [
								/* @__PURE__ */ jsx("button", {
									type: "button",
									role: "tab",
									"aria-selected": !isYearly,
									className: `billing-option ${!isYearly ? "is-active" : ""}`,
									children: "Monthly"
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									role: "tab",
									"aria-selected": isYearly,
									className: `billing-option ${isYearly ? "is-active" : ""}`,
									children: ["Yearly ", /* @__PURE__ */ jsx("span", {
										className: "billing-discount",
										children: YEARLY_DISCOUNT_LABEL
									})]
								}),
								/* @__PURE__ */ jsx("span", {
									className: `billing-knob ${isYearly ? "is-yearly" : ""}`,
									"aria-hidden": "true"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "pricing-grid",
					children: displayTiers.map((tier) => /* @__PURE__ */ jsxs("article", {
						className: `price-card ${tier.popular ? "is-popular" : ""}`,
						children: [
							tier.popular ? /* @__PURE__ */ jsx("span", {
								className: "popular-badge",
								children: "Most Popular"
							}) : null,
							/* @__PURE__ */ jsx("p", {
								className: "tier-name",
								children: tier.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "tier-price",
								children: tier.displayPrice
							}),
							/* @__PURE__ */ jsx("p", {
								className: "tier-desc",
								children: tier.description
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "tier-list",
								children: tier.items.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item))
							}),
							/* @__PURE__ */ jsx(Link, {
								className: `btn pricing-btn ${tier.popular ? "btn-primary pricing-btn-primary" : "btn-ghost pricing-btn-ghost"}`,
								to: "/signup",
								children: tier.cta
							})
						]
					}, tier.name))
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "pricing-features-section",
					"aria-label": "Feature comparison section",
					children: [/* @__PURE__ */ jsxs("header", {
						className: "pricing-features-head",
						children: [/* @__PURE__ */ jsx("p", {
							className: "eyebrow",
							children: "Feature Breakdown"
						}), /* @__PURE__ */ jsx("h2", { children: "Every plan, side by side." })]
					}), /* @__PURE__ */ jsx("div", {
						className: "pricing-table-wrap",
						children: /* @__PURE__ */ jsxs("table", {
							className: "pricing-table",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", { children: "Feature" }),
								/* @__PURE__ */ jsx("th", { children: "Free" }),
								/* @__PURE__ */ jsx("th", { children: "Starter" }),
								/* @__PURE__ */ jsx("th", { children: "Growth" }),
								/* @__PURE__ */ jsx("th", { children: "Pro" }),
								/* @__PURE__ */ jsx("th", { children: "Enterprise" })
							] }) }), /* @__PURE__ */ jsx("tbody", { children: features.map((row) => /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", { children: row[0] }),
								/* @__PURE__ */ jsx("td", {
									className: row[1] === "Yes" ? "check-yes" : row[1] === "-" ? "check-dash" : "",
									children: row[1]
								}),
								/* @__PURE__ */ jsx("td", {
									className: row[2] === "Yes" ? "check-yes" : row[2] === "-" ? "check-dash" : "",
									children: row[2]
								}),
								/* @__PURE__ */ jsx("td", {
									className: row[3] === "Yes" ? "check-yes" : row[3] === "-" ? "check-dash" : "",
									children: row[3]
								}),
								/* @__PURE__ */ jsx("td", {
									className: row[4] === "Yes" ? "check-yes" : row[4] === "-" ? "check-dash" : "",
									children: row[4]
								}),
								/* @__PURE__ */ jsx("td", {
									className: row[5] === "Yes" ? "check-yes" : row[5] === "-" ? "check-dash" : "",
									children: row[5]
								})
							] }, row[0])) })]
						})
					})]
				})
			]
		})]
	});
}
//#endregion
//#region src/routes/pricing.tsx
var pricing_exports = /* @__PURE__ */ __exportAll({
	default: () => pricing_default,
	meta: () => meta$6
});
var meta$6 = () => [
	{ title: "Pricing — Coodra" },
	{
		name: "description",
		content: "Connect POS once, then let Coodra run smarter decisions every day. Pricing that scales with your retail footprint."
	},
	{
		property: "og:title",
		content: "Pricing — Coodra"
	},
	{
		property: "og:description",
		content: "Connect POS once, then let Coodra run smarter decisions every day. Pricing that scales with your retail footprint."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/pricing"
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
		content: "Pricing — Coodra"
	},
	{
		name: "twitter:description",
		content: "Connect POS once, then let Coodra run smarter decisions every day."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		tagName: "link",
		rel: "canonical",
		href: "https://www.coodra.com/pricing"
	}
];
var pricing_default = UNSAFE_withComponentProps(PricingPage);
//#endregion
//#region src/lib/supabase.ts
function getSupabase() {
	return null;
}
var supabase = new Proxy({}, { get(_target, prop) {
	const client = getSupabase();
	if (!client) return () => ({
		data: { session: null },
		error: null
	});
	const val = client[prop];
	return typeof val === "function" ? val.bind(client) : val;
} });
function getCachedBackendJwt() {
	try {
		const token = sessionStorage.getItem("backend_jwt") || "";
		const exp = Number(sessionStorage.getItem("backend_jwt_exp") || 0);
		const role = sessionStorage.getItem("backend_jwt_role") || "";
		const now = Math.floor(Date.now() / 1e3);
		if (!token || !exp) return null;
		if (exp - now < 120) return null;
		return {
			token,
			exp,
			role
		};
	} catch {
		return null;
	}
}
function resolveApiEndpoint$1(path) {
	const baseRaw = "https://api.coodra.com".trim().replace(/\/+$/, "");
	if (baseRaw.endsWith("/api")) return `${baseRaw}${path.startsWith("/") ? path : `/${path}`}`;
	return `${baseRaw}/api${path.startsWith("/") ? path : `/${path}`}`;
}
async function exchangeForBackendJwt() {
	const cached = getCachedBackendJwt();
	if (cached) return cached;
	const supabaseClient = getSupabase();
	if (!supabaseClient) return null;
	try {
		const { data: { session } } = await supabaseClient.auth.getSession();
		if (!session?.user) return null;
		const supabaseToken = session.access_token;
		const sessionEmail = session.user.email || "";
		const email = sessionEmail.trim().toLowerCase();
		async function attemptExchange() {
			const roleResolveUrl = resolveApiEndpoint$1(`/log?view=role_resolve&scope=retailer&email=${encodeURIComponent(email)}`);
			let res;
			try {
				res = await fetch(roleResolveUrl, {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${supabaseToken}`,
						"x-user-email": sessionEmail
					}
				});
			} catch {
				return null;
			}
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				console.warn("exchangeForBackendJwt: role_resolve failed", {
					status: res.status,
					error: err?.error || "unknown_error"
				});
				return null;
			}
			const data = await res.json();
			if (!data?.backend_jwt) return null;
			const rawExp = data.backend_jwt_expires_at;
			let exp = 0;
			if (typeof rawExp === "number" && Number.isFinite(rawExp)) exp = rawExp > 0xe8d4a51000 ? Math.floor(rawExp / 1e3) : Math.floor(rawExp);
			else if (typeof rawExp === "string" && rawExp.trim()) {
				const n = Number(rawExp);
				if (Number.isFinite(n) && n > 0) exp = n > 0xe8d4a51000 ? Math.floor(n / 1e3) : Math.floor(n);
				else {
					const ts = Date.parse(rawExp);
					exp = Number.isFinite(ts) ? Math.floor(ts / 1e3) : 0;
				}
			}
			const result = {
				token: data.backend_jwt,
				exp,
				role: data.role || ""
			};
			try {
				sessionStorage.setItem("backend_jwt", result.token);
				sessionStorage.setItem("backend_jwt_exp", String(result.exp));
				sessionStorage.setItem("backend_jwt_role", result.role || "");
			} catch {}
			return result;
		}
		for (let attempt = 0; attempt < 2; attempt++) {
			const result = await attemptExchange();
			if (result?.token) return result;
			if (attempt < 1) await new Promise((r) => setTimeout(r, 200));
		}
	} catch (e) {}
	return null;
}
//#endregion
//#region src/pages/LoginPage.tsx
var RECOMMENDATIONS = [
	{
		tag: "Reorder",
		text: "Royal Canin S/O - 14 units left",
		confidence: "High confidence"
	},
	{
		tag: "Replace",
		text: "Switch Brand B -> Brand A (+12% margin)",
		confidence: "High confidence"
	},
	{
		tag: "Remove",
		text: "Clear slow mover - zero sales, 90 days",
		confidence: "Medium confidence"
	},
	{
		tag: "Protect",
		text: "Top seller - auto-reorder enabled",
		confidence: "High confidence"
	}
];
function LiveWidget() {
	const [saleCount, setSaleCount] = useState(1847);
	const [stockLevel, setStockLevel] = useState(62);
	const [recIdx, setRecIdx] = useState(0);
	const [recVisible, setRecVisible] = useState(true);
	const saleRef = useRef(null);
	const recRef = useRef(null);
	useEffect(() => {
		saleRef.current = setInterval(() => {
			setSaleCount((n) => n + Math.floor(Math.random() * 3 + 1));
		}, 1400);
		return () => {
			if (saleRef.current) clearInterval(saleRef.current);
		};
	}, []);
	useEffect(() => {
		const id = setInterval(() => {
			setStockLevel((n) => {
				const next = n + (Math.random() > .5 ? 1 : -1);
				return Math.max(20, Math.min(95, next));
			});
		}, 800);
		return () => clearInterval(id);
	}, []);
	useEffect(() => {
		recRef.current = setTimeout(() => {
			setRecVisible(false);
			setTimeout(() => {
				setRecIdx((i) => (i + 1) % RECOMMENDATIONS.length);
				setRecVisible(true);
			}, 400);
		}, 3500);
		return () => {
			if (recRef.current) clearTimeout(recRef.current);
		};
	}, [recIdx]);
	const rec = RECOMMENDATIONS[recIdx];
	const stockColor = stockLevel > 70 ? "#2ED3B7" : stockLevel > 40 ? "#F59E0B" : "#EF4444";
	return /* @__PURE__ */ jsxs("div", {
		className: "live-widget",
		"aria-label": "Live Coodra workspace preview",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "live-widget__header",
				children: [/* @__PURE__ */ jsx("div", { className: "live-widget__pulse" }), /* @__PURE__ */ jsx("span", { children: "Live · Coodra Workspace" })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "live-widget__metrics",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "live-widget__metric",
					children: [/* @__PURE__ */ jsx("span", {
						className: "live-widget__metric-label",
						children: "Sales Today"
					}), /* @__PURE__ */ jsxs("span", {
						className: "live-widget__metric-value live-widget__sales",
						children: ["$", saleCount.toLocaleString()]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "live-widget__metric",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "live-widget__metric-label",
							children: "Stock Health"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "live-widget__bar-wrap",
							children: /* @__PURE__ */ jsx("div", {
								className: "live-widget__bar",
								style: {
									width: `${stockLevel}%`,
									background: stockColor
								}
							})
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "live-widget__metric-sub",
							children: [stockLevel, "% in stock"]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: `live-widget__rec ${recVisible ? "is-visible" : "is-hidden"}`,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "live-widget__rec-header",
						children: [/* @__PURE__ */ jsx("span", {
							className: "live-widget__rec-tag",
							children: rec.tag
						}), /* @__PURE__ */ jsx("span", {
							className: "live-widget__rec-conf",
							children: rec.confidence
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "live-widget__rec-text",
						children: rec.text
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "live-widget__rec-actions",
						children: [/* @__PURE__ */ jsx("button", {
							className: "live-widget__btn live-widget__btn--approve",
							children: "Approve"
						}), /* @__PURE__ */ jsxs("div", {
							className: "live-widget__rec-action-right",
							children: [/* @__PURE__ */ jsx("div", { className: "live-widget__pulse" }), /* @__PURE__ */ jsx("button", {
								className: "live-widget__btn live-widget__btn--dismiss",
								children: "Dismiss"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "live-widget__float live-widget__float--1",
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsxs("svg", {
					width: "14",
					height: "14",
					viewBox: "0 0 14 14",
					fill: "none",
					children: [
						/* @__PURE__ */ jsx("rect", {
							x: "1",
							y: "1",
							width: "5",
							height: "5",
							rx: "1",
							fill: "rgba(46,211,183,0.6)"
						}),
						/* @__PURE__ */ jsx("rect", {
							x: "8",
							y: "1",
							width: "5",
							height: "5",
							rx: "1",
							fill: "rgba(46,211,183,0.4)"
						}),
						/* @__PURE__ */ jsx("rect", {
							x: "1",
							y: "8",
							width: "5",
							height: "5",
							rx: "1",
							fill: "rgba(46,211,183,0.3)"
						}),
						/* @__PURE__ */ jsx("rect", {
							x: "8",
							y: "8",
							width: "5",
							height: "5",
							rx: "1",
							fill: "rgba(46,211,183,0.5)"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "live-widget__float live-widget__float--2",
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsx("svg", {
					width: "16",
					height: "10",
					viewBox: "0 0 16 10",
					fill: "none",
					children: /* @__PURE__ */ jsx("path", {
						d: "M1 9 L5 3 L9 6 L13 1 L15 2",
						stroke: "rgba(46,211,183,0.5)",
						strokeWidth: "1.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				})
			})
		]
	});
}
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showRecover, setShowRecover] = useState(false);
	const [recoverEmail, setRecoverEmail] = useState("");
	const [recoverState, setRecoverState] = useState("idle");
	const [recoverError, setRecoverError] = useState("");
	const [googleLoading, setGoogleLoading] = useState(false);
	useEffect(() => {
		let active = true;
		const init = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			if (!active || !session) return;
			const exchanged = await exchangeForBackendJwt();
			if (!active) return;
			if (exchanged?.token && exchanged?.exp) {
				try {
					sessionStorage.setItem("backend_jwt", exchanged.token);
					sessionStorage.setItem("backend_jwt_exp", String(exchanged.exp));
				} catch {}
				navigate("/dashboard", { replace: true });
				return;
			}
			await supabase.auth.signOut().catch(() => {});
			setError("Your session could not be verified. Please sign in again.");
		};
		init();
		return () => {
			active = false;
		};
	}, [navigate]);
	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		trackEvent("form_submit", {
			form_name: "login",
			form_state: "attempt"
		});
		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (authError) {
			trackEvent("form_submit", {
				form_name: "login",
				form_state: "error"
			});
			setError(authError.message);
			setLoading(false);
			return;
		}
		const exchanged = await exchangeForBackendJwt();
		if (!exchanged?.token || !exchanged?.exp) {
			trackEvent("form_submit", {
				form_name: "login",
				form_state: "error"
			});
			await supabase.auth.signOut().catch(() => {});
			setError("Sign-in succeeded, but your dashboard session could not be verified. Please try again.");
			setLoading(false);
			return;
		}
		try {
			sessionStorage.setItem("backend_jwt", exchanged.token);
			sessionStorage.setItem("backend_jwt_exp", String(exchanged.exp));
		} catch {}
		setLoading(false);
		trackEvent("form_submit", {
			form_name: "login",
			form_state: "success"
		});
		navigate("/dashboard");
	};
	const handleGoogleLogin = async () => {
		setGoogleLoading(true);
		const { error: oauthError } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: `${window.location.origin}/dashboard` }
		});
		if (oauthError) {
			setError(oauthError.message);
			setGoogleLoading(false);
		}
	};
	const handleRecover = async (e) => {
		e.preventDefault();
		setRecoverState("sending");
		setRecoverError("");
		trackEvent("form_submit", {
			form_name: "password_recovery",
			form_state: "attempt"
		});
		const { error: recoverErr } = await supabase.auth.resetPasswordForEmail(recoverEmail, { redirectTo: `${window.location.origin}/reset-password` });
		if (recoverErr) {
			trackEvent("form_submit", {
				form_name: "password_recovery",
				form_state: "error"
			});
			setRecoverError(recoverErr.message);
			setRecoverState("error");
			return;
		}
		setRecoverState("sent");
		trackEvent("form_submit", {
			form_name: "password_recovery",
			form_state: "success"
		});
	};
	return /* @__PURE__ */ jsx("div", {
		className: "login",
		children: /* @__PURE__ */ jsxs("div", {
			className: "login__layout",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "login__left",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ jsx("a", {
					className: "login__logo",
					href: "/",
					"aria-label": "Go to Coodra home",
					children: /* @__PURE__ */ jsx("img", {
						src: "/images/coodra-logo.png",
						alt: "Coodra",
						className: "coodra-logo-img"
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "login__intro",
					children: [
						/* @__PURE__ */ jsxs("h1", { children: [
							"Welcome back to",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", { children: "Coodra" })
						] }),
						/* @__PURE__ */ jsx("p", { children: "Log in and continue running smarter retail decisions." }),
						/* @__PURE__ */ jsx(LiveWidget, {})
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "login__panel",
				children: /* @__PURE__ */ jsxs("div", {
					className: "login__card",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "login__view",
						style: { display: showRecover ? "none" : void 0 },
						children: [
							/* @__PURE__ */ jsx("h1", {
								className: "login__title",
								children: "Log in"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "login__sub",
								children: "Use your account to continue to your retailer workspace."
							}),
							error && /* @__PURE__ */ jsx("div", {
								className: "login__errors",
								children: error
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleLogin,
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "login__field",
										children: [/* @__PURE__ */ jsx("label", {
											htmlFor: "login-email",
											children: "Email"
										}), /* @__PURE__ */ jsx("input", {
											id: "login-email",
											type: "email",
											value: email,
											onChange: (e) => setEmail(e.target.value),
											placeholder: "retailer@business.com",
											required: true,
											autoComplete: "email"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "login__field",
										children: [/* @__PURE__ */ jsx("label", {
											htmlFor: "login-pass",
											children: "Password"
										}), /* @__PURE__ */ jsx("input", {
											id: "login-pass",
											type: "password",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											placeholder: "Your password",
											required: true,
											autoComplete: "current-password"
										})]
									}),
									/* @__PURE__ */ jsx("button", {
										type: "submit",
										className: "login__btn",
										disabled: loading,
										children: loading ? "Signing in..." : "Log in"
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "login__divider",
								children: "or"
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "btn-google",
								onClick: handleGoogleLogin,
								disabled: googleLoading,
								children: [/* @__PURE__ */ jsxs("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 18 18",
									"aria-hidden": "true",
									children: [
										/* @__PURE__ */ jsx("path", {
											fill: "#4285F4",
											d: "M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
										}),
										/* @__PURE__ */ jsx("path", {
											fill: "#34A853",
											d: "M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
										}),
										/* @__PURE__ */ jsx("path", {
											fill: "#FBBC05",
											d: "M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
										}),
										/* @__PURE__ */ jsx("path", {
											fill: "#EA4335",
											d: "M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
										})
									]
								}), "Continue with Google"]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "login__btnGhost",
								onClick: () => setShowRecover(true),
								children: "Forgot password?"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "login__links",
								children: ["Need an account? ", /* @__PURE__ */ jsx(Link, {
									to: "/signup",
									children: "Start free"
								})]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "login__view",
						style: { display: showRecover ? void 0 : "none" },
						children: /* @__PURE__ */ jsxs("div", {
							className: "login__recover",
							style: { marginTop: 0 },
							id: "loginRecoverBox",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "login__recoverTitle",
									children: "Reset your password"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "login__recoverSub",
									children: "Enter your account email and we'll send a secure reset link."
								}),
								recoverState === "error" && /* @__PURE__ */ jsx("div", {
									className: "login__recoverMsg login__recoverMsg--err is-show",
									children: recoverError
								}),
								recoverState === "sent" && /* @__PURE__ */ jsx("div", {
									className: "login__recoverSuccess",
									children: "We sent a password reset email. Check your inbox and spam folder for the reset link."
								}),
								/* @__PURE__ */ jsxs("form", {
									onSubmit: handleRecover,
									children: [/* @__PURE__ */ jsxs("div", {
										className: "login__recoverFormRow login__field",
										children: [/* @__PURE__ */ jsx("label", {
											htmlFor: "recover-email",
											children: "Account email"
										}), /* @__PURE__ */ jsx("input", {
											id: "recover-email",
											type: "email",
											value: recoverEmail,
											onChange: (e) => setRecoverEmail(e.target.value),
											placeholder: "retailer@business.com",
											required: true,
											autoComplete: "email"
										})]
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										className: "login__btn",
										disabled: recoverState === "sending",
										children: recoverState === "sending" ? "Sending..." : "Send reset email"
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "login__backBtn",
									onClick: () => {
										setShowRecover(false);
										setRecoverState("idle");
										setRecoverError("");
									},
									children: "Back to login"
								})
							]
						})
					})]
				})
			})]
		})
	});
}
//#endregion
//#region src/routes/login.tsx
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => login_default,
	meta: () => meta$5
});
var meta$5 = () => [
	{ title: "Log in — Coodra" },
	{
		name: "description",
		content: "Log in to your Coodra account and continue running smarter retail decisions."
	},
	{
		property: "og:title",
		content: "Log in — Coodra"
	},
	{
		property: "og:description",
		content: "Log in to your Coodra account and continue running smarter retail decisions."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/login"
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
		content: "Log in — Coodra"
	},
	{
		name: "twitter:description",
		content: "Log in to your Coodra account and continue running smarter retail decisions."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		rel: "canonical",
		href: "https://www.coodra.com/login"
	}
];
var login_default = UNSAFE_withComponentProps(LoginPage);
//#endregion
//#region src/pages/SignupPage.tsx
function SignupPage() {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [acceptedLegal, setAcceptedLegal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [googleLoading, setGoogleLoading] = useState(false);
	const handleSignup = async (e) => {
		e.preventDefault();
		if (!acceptedLegal) {
			setError("Please accept the Privacy Policy and Terms and Conditions to continue.");
			return;
		}
		setLoading(true);
		setError("");
		trackEvent("form_submit", {
			form_name: "signup",
			form_state: "attempt"
		});
		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: { data: {
				first_name: firstName,
				last_name: lastName,
				business_name: businessName,
				name: `${firstName} ${lastName}`.trim()
			} }
		});
		if (authError) {
			trackEvent("form_submit", {
				form_name: "signup",
				form_state: "error"
			});
			setError(authError.message);
			setLoading(false);
			return;
		}
		try {
			fetch(resolveApiEndpoint$1("/log?action=partner_application_submit"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "partner_application_submit",
					application_type: "retailer",
					company_name: businessName,
					contact_name: `${firstName} ${lastName}`.trim(),
					email: email.toLowerCase(),
					source: "register_page",
					notes: "Self-serve signup"
				}),
				keepalive: true
			}).catch(() => {});
		} catch {}
		setLoading(false);
		if (data?.session) {
			trackEvent("form_submit", {
				form_name: "signup",
				form_state: "success"
			});
			navigate("/dashboard");
			return;
		}
		trackEvent("form_submit", {
			form_name: "signup",
			form_state: "success"
		});
		navigate(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
	};
	const handleGoogleSignup = async () => {
		setGoogleLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: `${window.location.origin}/dashboard` }
		});
		if (error) {
			setError(error.message);
			setGoogleLoading(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "signup",
		children: /* @__PURE__ */ jsxs("div", {
			className: "signup__layout",
			children: [/* @__PURE__ */ jsx("div", {
				className: "signup__showcase",
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsxs("div", {
					className: "signup__showcaseInner",
					children: [
						/* @__PURE__ */ jsx("a", {
							className: "signup__brand",
							href: "/",
							"aria-label": "Go to Coodra home",
							children: /* @__PURE__ */ jsx("img", {
								src: "/images/coodra-logo.png",
								alt: "Coodra",
								className: "coodra-logo-img"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "signup__heroCopy",
							children: [/* @__PURE__ */ jsxs("h1", { children: [
								"Run Retail",
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx("span", { children: "Decisions" })
							] }), /* @__PURE__ */ jsx("p", { children: "Coodra analyzes sales, inventory, and market context to decide what to reorder, replace, remove, and promote." })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "signup__cards",
							children: [
								/* @__PURE__ */ jsx("div", { className: "signup__dot signup__dot--1" }),
								/* @__PURE__ */ jsx("div", { className: "signup__dot signup__dot--2" }),
								/* @__PURE__ */ jsx("div", {
									className: "signup__visualCard signup__visualCard--main",
									children: /* @__PURE__ */ jsxs("div", {
										className: "signup__visualPad",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "signup__badgeRow",
												children: [/* @__PURE__ */ jsx("span", {
													className: "signup__vBadge",
													children: "Coodra Decision"
												}), /* @__PURE__ */ jsx("span", {
													className: "signup__vBadge",
													children: "Confidence: High"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "signup__vBlock",
												children: [
													"Replace Product A with Product B",
													/* @__PURE__ */ jsx("br", {}),
													"Projected margin improvement: +12%"
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "signup__typingWrap",
												children: [/* @__PURE__ */ jsx("span", { children: "Analyzing:" }), /* @__PURE__ */ jsx("span", {
													className: "signup__typing",
													children: "margin deltas, sell-through, demand shifts"
												})]
											})
										]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "signup__visualCard signup__visualCard--side",
									children: /* @__PURE__ */ jsxs("div", {
										className: "signup__visualPad",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "signup__vBadge",
												children: "Live Analysis"
											}),
											/* @__PURE__ */ jsx("div", { className: "signup__vLine signup__vLine--1" }),
											/* @__PURE__ */ jsx("div", { className: "signup__vLine signup__vLine--2" }),
											/* @__PURE__ */ jsx("div", { className: "signup__vLine signup__vLine--3" })
										]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "signup__visualCard signup__visualCard--mini",
									children: /* @__PURE__ */ jsxs("div", {
										className: "signup__visualPad",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "signup__vBadge",
												children: "Market Shift"
											}),
											/* @__PURE__ */ jsx("div", { className: "signup__vLine signup__vLine--1" }),
											/* @__PURE__ */ jsx("div", { className: "signup__vLine signup__vLine--3" })
										]
									})
								})
							]
						})
					]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "signup__panel",
				children: /* @__PURE__ */ jsxs("div", {
					className: "signup__card",
					children: [
						/* @__PURE__ */ jsx("h1", { children: "Create account" }),
						/* @__PURE__ */ jsx("p", { children: "Open your Coodra account and start running product decisions." }),
						error && /* @__PURE__ */ jsx("div", {
							className: "signup__errors",
							children: error
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleSignup,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "signup__grid",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "signup__field",
										children: [/* @__PURE__ */ jsx("label", {
											htmlFor: "reg-first",
											children: "First name"
										}), /* @__PURE__ */ jsx("input", {
											id: "reg-first",
											type: "text",
											value: firstName,
											onChange: (e) => setFirstName(e.target.value),
											placeholder: "Alex",
											required: true,
											autoComplete: "given-name"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "signup__field",
										children: [/* @__PURE__ */ jsx("label", {
											htmlFor: "reg-last",
											children: "Last name"
										}), /* @__PURE__ */ jsx("input", {
											id: "reg-last",
											type: "text",
											value: lastName,
											onChange: (e) => setLastName(e.target.value),
											placeholder: "Morgan",
											required: true,
											autoComplete: "family-name"
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "signup__field",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "reg-business",
										children: "Business name"
									}), /* @__PURE__ */ jsx("input", {
										id: "reg-business",
										type: "text",
										value: businessName,
										onChange: (e) => setBusinessName(e.target.value),
										placeholder: "My Retail Store",
										required: true,
										autoComplete: "organization"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "signup__field",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "reg-email",
										children: "Work email"
									}), /* @__PURE__ */ jsx("input", {
										id: "reg-email",
										type: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "retailer@business.com",
										required: true,
										autoComplete: "email"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "signup__field",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "reg-pass",
										children: "Password"
									}), /* @__PURE__ */ jsx("input", {
										id: "reg-pass",
										type: "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "Create a password",
										required: true,
										autoComplete: "new-password",
										minLength: 8
									})]
								}),
								/* @__PURE__ */ jsxs("label", {
									className: "signup__legalCheck",
									htmlFor: "reg-legal-accept",
									children: [/* @__PURE__ */ jsx("input", {
										id: "reg-legal-accept",
										type: "checkbox",
										checked: acceptedLegal,
										onChange: (e) => setAcceptedLegal(e.target.checked),
										required: true
									}), /* @__PURE__ */ jsxs("span", { children: [
										"I agree to the ",
										/* @__PURE__ */ jsx(Link, {
											to: "/privacy",
											children: "Privacy Policy"
										}),
										" and ",
										/* @__PURE__ */ jsx(Link, {
											to: "/terms",
											children: "Terms and Conditions"
										}),
										"."
									] })]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "signup__btn",
									disabled: loading,
									children: loading ? "Creating account..." : "Start Free"
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "signup__divider",
							children: "or"
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							className: "btn-google",
							onClick: handleGoogleSignup,
							disabled: googleLoading,
							children: [/* @__PURE__ */ jsxs("svg", {
								width: "18",
								height: "18",
								viewBox: "0 0 18 18",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ jsx("path", {
										fill: "#4285F4",
										d: "M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
									}),
									/* @__PURE__ */ jsx("path", {
										fill: "#34A853",
										d: "M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
									}),
									/* @__PURE__ */ jsx("path", {
										fill: "#FBBC05",
										d: "M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
									}),
									/* @__PURE__ */ jsx("path", {
										fill: "#EA4335",
										d: "M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
									})
								]
							}), "Continue with Google"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "signup__links",
							children: ["Already have an account? ", /* @__PURE__ */ jsx(Link, {
								to: "/login",
								children: "Log in"
							})]
						})
					]
				})
			})]
		})
	});
}
//#endregion
//#region src/routes/signup.tsx
var signup_exports = /* @__PURE__ */ __exportAll({
	default: () => signup_default,
	meta: () => meta$4
});
var meta$4 = () => [
	{ title: "Start free — Coodra" },
	{
		name: "description",
		content: "Open your Coodra account and start running product decisions. AI-powered retail decision intelligence for independent retailers."
	},
	{
		property: "og:title",
		content: "Start free — Coodra"
	},
	{
		property: "og:description",
		content: "Open your Coodra account and start running product decisions. AI-powered retail decision intelligence for independent retailers."
	},
	{
		property: "og:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		property: "og:url",
		content: "https://www.coodra.com/signup"
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
		content: "Start free — Coodra"
	},
	{
		name: "twitter:description",
		content: "Open your Coodra account and start running product decisions."
	},
	{
		name: "twitter:image",
		content: "https://www.coodra.com/og-image.png"
	},
	{
		name: "robots",
		content: "index, follow"
	},
	{
		rel: "canonical",
		href: "https://www.coodra.com/signup"
	}
];
var signup_default = UNSAFE_withComponentProps(SignupPage);
//#endregion
//#region src/pages/VerifyEmailPage.tsx
function VerifyEmailPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [status, setStatus] = useState("idle");
	const [message, setMessage] = useState("");
	const email = useMemo(() => (searchParams.get("email") || "").trim().toLowerCase(), [searchParams]);
	useEffect(() => {
		let active = true;
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!active) return;
			if (session) navigate("/dashboard", { replace: true });
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) navigate("/dashboard", { replace: true });
		});
		return () => {
			active = false;
			subscription.unsubscribe();
		};
	}, [navigate]);
	const resend = async () => {
		if (!email) {
			setStatus("error");
			setMessage("Missing email. Go back to sign up and try again.");
			return;
		}
		setStatus("sending");
		setMessage("");
		const { error } = await supabase.auth.resend({
			type: "signup",
			email,
			options: { emailRedirectTo: `${window.location.origin}/dashboard` }
		});
		if (error) {
			setStatus("error");
			setMessage(error.message || "Could not resend confirmation email.");
			return;
		}
		setStatus("sent");
		setMessage("Confirmation email sent. Check your inbox and spam folder.");
	};
	return /* @__PURE__ */ jsx("div", {
		className: "verify-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "verify-card",
			children: [
				/* @__PURE__ */ jsx("h1", { children: "Check your email" }),
				/* @__PURE__ */ jsxs("p", { children: [
					"We sent a confirmation link",
					email ? ` to ${email}` : "",
					". Once you confirm, this page will automatically take you to your dashboard."
				] }),
				message ? /* @__PURE__ */ jsx("div", {
					className: `verify-msg verify-msg--${status === "error" ? "error" : "ok"}`,
					children: message
				}) : null,
				/* @__PURE__ */ jsx("button", {
					className: "verify-btn",
					type: "button",
					onClick: resend,
					disabled: status === "sending",
					children: status === "sending" ? "Sending..." : "Resend confirmation email"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "verify-links",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/login",
						children: "Back to login"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/signup",
						children: "Use another email"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/verify-email.tsx
var verify_email_exports = /* @__PURE__ */ __exportAll({
	default: () => verify_email_default,
	meta: () => meta$3
});
var meta$3 = () => [
	{ title: "Check your email — Coodra" },
	{
		name: "description",
		content: "Check your email for a confirmation link to activate your Coodra account."
	},
	{
		name: "robots",
		content: "noindex"
	}
];
var verify_email_default = UNSAFE_withComponentProps(VerifyEmailPage);
//#endregion
//#region src/pages/ResetPasswordPage.tsx
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const submit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");
		trackEvent("form_submit", {
			form_name: "reset_password",
			form_state: "attempt"
		});
		if (password.length < 8) {
			trackEvent("form_submit", {
				form_name: "reset_password",
				form_state: "error"
			});
			setError("Password must be at least 8 characters.");
			return;
		}
		if (password !== confirmPassword) {
			trackEvent("form_submit", {
				form_name: "reset_password",
				form_state: "error"
			});
			setError("Passwords do not match.");
			return;
		}
		setLoading(true);
		const { error: updateError } = await supabase.auth.updateUser({ password });
		setLoading(false);
		if (updateError) {
			trackEvent("form_submit", {
				form_name: "reset_password",
				form_state: "error"
			});
			setError(updateError.message || "Could not update password.");
			return;
		}
		trackEvent("form_submit", {
			form_name: "reset_password",
			form_state: "success"
		});
		setMessage("Password updated. You can now log in.");
		setTimeout(() => navigate("/login", { replace: true }), 1e3);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "reset-page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "reset-card",
			children: [
				/* @__PURE__ */ jsx("h1", { children: "Set a new password" }),
				/* @__PURE__ */ jsx("p", { children: "Choose a secure password for your Coodra account." }),
				error ? /* @__PURE__ */ jsx("div", {
					className: "reset-msg reset-msg--error",
					children: error
				}) : null,
				message ? /* @__PURE__ */ jsx("div", {
					className: "reset-msg reset-msg--ok",
					children: message
				}) : null,
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "new-password",
							children: "New password"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "new-password",
							type: "password",
							minLength: 8,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true,
							autoComplete: "new-password"
						}),
						/* @__PURE__ */ jsx("label", {
							htmlFor: "confirm-password",
							children: "Confirm password"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "confirm-password",
							type: "password",
							minLength: 8,
							value: confirmPassword,
							onChange: (e) => setConfirmPassword(e.target.value),
							required: true,
							autoComplete: "new-password"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: loading,
							children: loading ? "Updating..." : "Update password"
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "reset-links",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/login",
						children: "Back to login"
					})
				})
			]
		})
	});
}
//#endregion
//#region src/routes/reset-password.tsx
var reset_password_exports = /* @__PURE__ */ __exportAll({
	default: () => reset_password_default,
	meta: () => meta$2
});
var meta$2 = () => [
	{ title: "Reset password — Coodra" },
	{
		name: "description",
		content: "Reset your Coodra account password."
	},
	{
		name: "robots",
		content: "noindex"
	}
];
var reset_password_default = UNSAFE_withComponentProps(ResetPasswordPage);
//#endregion
//#region src/components/AuthGuard.tsx
function AuthGuard({ children }) {
	const [loading, setLoading] = useState(true);
	const [hasSession, setHasSession] = useState(false);
	useEffect(() => {
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setHasSession(!!session);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data: { session } }) => {
			setHasSession(!!session);
			setLoading(false);
		});
		return () => {
			subscription.unsubscribe();
		};
	}, []);
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "auth-loading",
		children: /* @__PURE__ */ jsx("div", {
			className: "auth-spinner",
			"aria-label": "Loading"
		})
	});
	if (!hasSession) return /* @__PURE__ */ jsx(Navigate, {
		to: "/login",
		replace: true
	});
	return /* @__PURE__ */ jsx(Fragment, { children });
}
//#endregion
//#region src/pages/Dashboard.tsx
var GLOBAL_THEME_KEY = "so_theme_last_v1";
var RC_ASSET_VERSION = "2026-04-11-retailer-cart-guard-2";
function clearStoredJwt() {
	try {
		sessionStorage.removeItem("backend_jwt");
		sessionStorage.removeItem("backend_jwt_exp");
		sessionStorage.removeItem("backend_jwt_role");
	} catch {}
}
function normalizeTheme(value) {
	return String(value || "").trim().toLowerCase() === "dark" ? "dark" : "light";
}
function applyDocumentTheme(mode) {
	const light = mode === "light";
	document.documentElement.setAttribute("data-so-rc-theme", light ? "light" : "dark");
	document.body.setAttribute("data-so-rc-theme", light ? "light" : "dark");
	document.documentElement.style.backgroundColor = light ? "#f4f5f7" : "#0b1220";
	document.body.style.backgroundColor = light ? "#f4f5f7" : "#0b1220";
}
function userScopeFromIdentity(userId, email) {
	return String(userId || email || "anon").toLowerCase().replace(/[^a-z0-9_-]/g, "_");
}
function readThemeFromStorage(scope) {
	try {
		const scopedKey = scope ? `so_theme_v6_${scope}` : "";
		if (scopedKey) {
			const scopedRaw = localStorage.getItem(scopedKey);
			if (scopedRaw) return normalizeTheme(scopedRaw);
		}
		const globalRaw = localStorage.getItem(GLOBAL_THEME_KEY);
		if (globalRaw) return normalizeTheme(globalRaw);
	} catch {}
	return "light";
}
function Dashboard() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [bootTheme, setBootTheme] = useState(() => readThemeFromStorage());
	useEffect(() => {
		applyDocumentTheme(bootTheme);
	}, [bootTheme]);
	useEffect(() => {
		let cancelled = false;
		let scriptEl = null;
		const logoutHandler = async (event) => {
			if (!event.target?.closest("a[href=\"/account/logout\"]")) return;
			event.preventDefault();
			clearStoredJwt();
			try {
				await supabase.auth.signOut();
			} catch {}
			if (!cancelled) navigate("/login?logged_out=1", { replace: true });
		};
		document.addEventListener("click", logoutHandler, true);
		const init = async () => {
			try {
				const { data: { session } } = await supabase.auth.getSession();
				if (!session) {
					if (!cancelled) navigate("/login");
					return;
				}
				const templatePromise = fetch(`/wh-command-center.template.html?v=${RC_ASSET_VERSION}`).then((res) => {
					if (!res.ok) throw new Error("Could not load dashboard template");
					return res.text();
				});
				const cached = getCachedBackendJwt();
				let jwt = cached?.token || "";
				let exp = Number(cached?.exp || 0);
				let role = "";
				if (!jwt || !exp) {
					const exchanged = await exchangeForBackendJwt();
					jwt = exchanged?.token || "";
					exp = Number(exchanged?.exp || 0);
					role = exchanged?.role || "";
				}
				if (!jwt || !exp) {
					clearStoredJwt();
					if (!cancelled) navigate("/login");
					return;
				}
				sessionStorage.setItem("backend_jwt", jwt);
				sessionStorage.setItem("backend_jwt_exp", String(exp));
				const user = session.user;
				const resolvedTheme = readThemeFromStorage(userScopeFromIdentity(user.id || null, user.email || ""));
				setBootTheme(resolvedTheme);
				applyDocumentTheme(resolvedTheme);
				window.__SO_RC_BOOT__ = {
					userId: user.id || null,
					email: user.email || "",
					firstName: user.user_metadata?.first_name || user.user_metadata?.name?.split(" ")[0] || "",
					company: user.user_metadata?.business_name || user.email?.split("@")[0] || "Retailer",
					region: user.user_metadata?.region || "Unknown",
					backendJwt: jwt,
					backendJwtExp: exp,
					role
				};
				window.__COODRA_API_BASE__ = String("https://api.coodra.com").trim().replace(/\/+$/, "");
				const host = document.getElementById("soRcHost");
				if (!host) throw new Error("Dashboard host not found");
				applyDocumentTheme(resolvedTheme);
				const templateHtml = await templatePromise;
				if (cancelled) return;
				host.innerHTML = `<section id="so-rc-web" class="soRc soRc--booting" data-theme="${resolvedTheme}">${templateHtml}</section>`;
				scriptEl = document.createElement("script");
				scriptEl.src = `/wh-command-center.web.js?v=${RC_ASSET_VERSION}`;
				scriptEl.async = false;
				scriptEl.onload = () => {
					if (cancelled) return;
					window.__SO_RC_TEMPLATE_LOADED__ = true;
					setLoading(false);
				};
				scriptEl.onerror = () => {
					if (cancelled) return;
					setError("Dashboard script failed to load. Please refresh.");
					setLoading(false);
				};
				document.body.appendChild(scriptEl);
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : "Dashboard failed to initialize");
					setLoading(false);
				}
			}
		};
		init();
		return () => {
			cancelled = true;
			document.removeEventListener("click", logoutHandler, true);
			if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
		};
	}, [navigate]);
	return /* @__PURE__ */ jsxs("div", {
		className: "dashboard-shell",
		"data-loading": loading ? "1" : "0",
		"data-theme": bootTheme,
		children: [/* @__PURE__ */ jsx("div", {
			id: "soRcHost",
			className: "dashboard-host"
		}), error ? /* @__PURE__ */ jsx("div", {
			className: "dashboard-error",
			children: error
		}) : null]
	});
}
//#endregion
//#region src/routes/dashboard.tsx
var dashboard_exports = /* @__PURE__ */ __exportAll({
	default: () => dashboard_default,
	meta: () => meta$1
});
var meta$1 = () => [
	{ title: "Dashboard — Coodra" },
	{
		name: "description",
		content: "Your Coodra retail decision workspace. Review AI recommendations, approve actions, and track performance."
	},
	{
		name: "robots",
		content: "noindex, follow"
	}
];
var dashboard_default = UNSAFE_withComponentProps(function DashboardRoute() {
	return /* @__PURE__ */ jsx(AuthGuard, { children: /* @__PURE__ */ jsx(Dashboard, {}) });
});
//#endregion
//#region src/components/AdminGuard.tsx
function AdminGuard({ children }) {
	const cached = getCachedBackendJwt();
	const cachedRole = cached?.role || "";
	const [loading, setLoading] = useState(!cached);
	const [isAdmin, setIsAdmin] = useState(cachedRole === "admin");
	useEffect(() => {
		let cancelled = false;
		if (cachedRole === "admin") return;
		exchangeForBackendJwt().then((result) => {
			if (cancelled) return;
			setIsAdmin(result?.role === "admin");
			setLoading(false);
		}).catch(() => {
			if (cancelled) return;
			setIsAdmin(false);
			setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [cachedRole]);
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "auth-loading",
		children: /* @__PURE__ */ jsx("div", {
			className: "auth-spinner",
			"aria-label": "Loading"
		})
	});
	if (!isAdmin) return /* @__PURE__ */ jsx(Navigate, {
		to: "/",
		replace: true
	});
	return /* @__PURE__ */ jsx(Fragment, { children });
}
//#endregion
//#region src/pages/AdminPage.tsx
function resolveApiEndpoint(path) {
	const baseRaw = "https://api.coodra.com".trim().replace(/\/+$/, "");
	if (baseRaw.endsWith("/api")) return `${baseRaw}${path.startsWith("/") ? path : `/${path}`}`;
	return `${baseRaw}/api${path.startsWith("/") ? path : `/${path}`}`;
}
async function adminFetch(path, options = {}) {
	const token = (getCachedBackendJwt() || await exchangeForBackendJwt())?.token;
	const email = (await supabase.auth.getSession())?.data?.session?.user?.email || "";
	const hasBody = options.body !== void 0 && options.body !== null;
	const method = String(options.method || (hasBody ? "POST" : "GET")).toUpperCase();
	const defaultHeaders = {
		...token ? { Authorization: `Bearer ${token}` } : {},
		"x-user-email": email
	};
	if (hasBody && method !== "GET") defaultHeaders["Content-Type"] = "application/json";
	return await fetch(resolveApiEndpoint(path), {
		...options,
		method,
		headers: {
			...defaultHeaders,
			...options.headers || {}
		}
	});
}
function toNum(v, fallback = 0) {
	const n = Number(v);
	return Number.isFinite(n) ? n : fallback;
}
function monthLabel(monthKey) {
	const [y, m] = String(monthKey || "").split("-").map((x) => Number(x));
	if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return monthKey;
	return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "short" });
}
function AdminPage() {
	const [activeTab, setActiveTab] = useState("overview");
	return /* @__PURE__ */ jsxs("div", {
		className: "admin-shell",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "admin-sidebar",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "admin-sidebar-header",
				children: [/* @__PURE__ */ jsx("span", {
					className: "admin-logo",
					children: "Coodra"
				}), /* @__PURE__ */ jsx("span", {
					className: "admin-badge",
					children: "Admin"
				})]
			}), /* @__PURE__ */ jsxs("nav", {
				className: "admin-nav",
				children: [
					/* @__PURE__ */ jsx("button", {
						className: `admin-nav-item${activeTab === "overview" ? " active" : ""}`,
						onClick: () => setActiveTab("overview"),
						children: "Overview"
					}),
					/* @__PURE__ */ jsx("button", {
						className: `admin-nav-item${activeTab === "retailers" ? " active" : ""}`,
						onClick: () => setActiveTab("retailers"),
						children: "Retailers"
					}),
					/* @__PURE__ */ jsx("button", {
						className: `admin-nav-item${activeTab === "chats" ? " active" : ""}`,
						onClick: () => setActiveTab("chats"),
						children: "Chat History"
					}),
					/* @__PURE__ */ jsx("button", {
						className: `admin-nav-item${activeTab === "applications" ? " active" : ""}`,
						onClick: () => setActiveTab("applications"),
						children: "Applications"
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("main", {
			className: "admin-main",
			children: [
				activeTab === "overview" && /* @__PURE__ */ jsx(OverviewTab, {}),
				activeTab === "retailers" && /* @__PURE__ */ jsx(RetailersTab, {}),
				activeTab === "chats" && /* @__PURE__ */ jsx(ChatsTab, {}),
				activeTab === "applications" && /* @__PURE__ */ jsx(ApplicationsTab, {})
			]
		})]
	});
}
function OverviewTab() {
	const [payload, setPayload] = useState(null);
	const [error, setError] = useState("");
	const [revenueMode, setRevenueMode] = useState("mrr");
	const [revenueRange, setRevenueRange] = useState("12m");
	const [hoverMonthIdx, setHoverMonthIdx] = useState(-1);
	const monthlyRevenue = useMemo(() => {
		const revenueDaily = Array.isArray(payload?.revenue?.daily) ? payload.revenue.daily : [];
		const map = /* @__PURE__ */ new Map();
		for (const point of revenueDaily) {
			const month = String(point?.date || "").slice(0, 7);
			if (!month) continue;
			map.set(month, point);
		}
		const points = Array.from(map.entries()).map(([month, point]) => ({
			month,
			mrr: toNum(point.mrr),
			arr: toNum(point.arr),
			date: point.date
		}));
		const rangeCount = revenueRange === "3m" ? 3 : revenueRange === "6m" ? 6 : revenueRange === "12m" ? 12 : points.length;
		return points.slice(Math.max(0, points.length - rangeCount));
	}, [payload, revenueRange]);
	useEffect(() => {
		adminFetch("/log?view=admin_overview").then((r) => r.json()).then((d) => {
			if (d.ok) setPayload(d);
			else setError(d.error || "Failed to load");
		}).catch(() => setError("Network error"));
	}, []);
	if (error) return /* @__PURE__ */ jsx("div", {
		className: "admin-error",
		children: error
	});
	if (!payload) return /* @__PURE__ */ jsx("div", {
		className: "admin-loading",
		children: /* @__PURE__ */ jsx("div", { className: "admin-spinner" })
	});
	const stats = payload.stats;
	const planMix = Array.isArray(payload.plan_mix) ? payload.plan_mix : [];
	const maxPlan = Math.max(1, ...planMix.map((p) => toNum(p.count)));
	const paidCount = planMix.filter((p) => String(p.plan).toLowerCase() !== "free").reduce((sum, p) => sum + toNum(p.count), 0);
	const mrr = toNum(stats.mrr);
	const arr = mrr * 12;
	const arpa = paidCount > 0 ? mrr / paidCount : 0;
	const revenuePrimary = revenueMode === "mrr" ? mrr : arr;
	const revenuePrimaryLabel = revenueMode === "mrr" ? "Monthly recurring revenue" : "Annual recurring revenue";
	const revenueMax = Math.max(1, ...monthlyRevenue.map((p) => toNum(revenueMode === "mrr" ? p.mrr : p.arr)));
	const revenuePoints = monthlyRevenue.map((p, i) => {
		const x = monthlyRevenue.length <= 1 ? 0 : i / (monthlyRevenue.length - 1) * 100;
		const v = toNum(revenueMode === "mrr" ? p.mrr : p.arr);
		return {
			x,
			y: 100 - v / revenueMax * 100,
			value: v,
			month: p.month
		};
	});
	const revenuePolyline = revenuePoints.map((p) => `${p.x},${p.y}`).join(" ");
	const activeRevenueIdx = hoverMonthIdx >= 0 ? hoverMonthIdx : Math.max(0, revenuePoints.length - 1);
	const activeRevenuePoint = revenuePoints[activeRevenueIdx];
	const hourly = Array.isArray(payload.activity?.hourly_ai_decisions_utc) ? payload.activity.hourly_ai_decisions_utc : [];
	const maxHour = Math.max(1, ...hourly.map((h) => toNum(h.ai_decisions)));
	const topActive = Array.isArray(payload.top_active) ? payload.top_active.slice(0, 6) : [];
	const attention = payload.attention || {
		past_due: 0,
		trial_ending_7d: 0,
		no_activity_14d: 0
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "admin-overview",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "admin-overview-header",
				children: /* @__PURE__ */ jsx("h2", {
					className: "admin-page-title",
					children: "Executive Overview"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "admin-stat-grid",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "admin-stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "admin-stat-value",
							children: toNum(stats.totalRetailers).toLocaleString()
						}), /* @__PURE__ */ jsx("div", {
							className: "admin-stat-label",
							children: "Total Retailers"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "admin-stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "admin-stat-value",
							children: toNum(stats.activeRetailers).toLocaleString()
						}), /* @__PURE__ */ jsx("div", {
							className: "admin-stat-label",
							children: "Active"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "admin-stat-card",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "admin-stat-value",
							children: ["$", toNum(stats.mrr).toLocaleString()]
						}), /* @__PURE__ */ jsx("div", {
							className: "admin-stat-label",
							children: "MRR"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "admin-stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "admin-stat-value",
							children: toNum(stats.newThisMonth).toLocaleString()
						}), /* @__PURE__ */ jsx("div", {
							className: "admin-stat-label",
							children: "New This Month"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "admin-stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "admin-stat-value",
							children: toNum(stats.trialRetailers).toLocaleString()
						}), /* @__PURE__ */ jsx("div", {
							className: "admin-stat-label",
							children: "Trialing"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "admin-stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "admin-stat-value",
							children: toNum(stats.chatsToday).toLocaleString()
						}), /* @__PURE__ */ jsx("div", {
							className: "admin-stat-label",
							children: "Chats Today"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "admin-stat-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "admin-stat-value",
							children: toNum(stats.aiDecisionsToday).toLocaleString()
						}), /* @__PURE__ */ jsx("div", {
							className: "admin-stat-label",
							children: "AI Decisions Today"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "admin-insight-grid",
				children: [
					/* @__PURE__ */ jsxs("section", {
						className: "admin-panel admin-panel-revenue",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "admin-panel-head",
								children: [/* @__PURE__ */ jsx("h3", { children: "Revenue" }), /* @__PURE__ */ jsxs("div", {
									className: "admin-range-toggle",
									children: [/* @__PURE__ */ jsx("button", {
										className: `admin-range-btn${revenueMode === "mrr" ? " active" : ""}`,
										onClick: () => setRevenueMode("mrr"),
										children: "MRR"
									}), /* @__PURE__ */ jsx("button", {
										className: `admin-range-btn${revenueMode === "arr" ? " active" : ""}`,
										onClick: () => setRevenueMode("arr"),
										children: "ARR"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "admin-revenue-subhead",
								children: [/* @__PURE__ */ jsx("div", {
									className: "admin-range-toggle",
									children: [
										"3m",
										"6m",
										"12m",
										"all"
									].map((range) => /* @__PURE__ */ jsx("button", {
										className: `admin-range-btn${revenueRange === range ? " active" : ""}`,
										onClick: () => setRevenueRange(range),
										children: range.toUpperCase()
									}, range))
								}), activeRevenuePoint ? /* @__PURE__ */ jsxs("div", {
									className: "admin-revenue-hover-value",
									children: [/* @__PURE__ */ jsxs("span", { children: [
										monthLabel(activeRevenuePoint.month),
										" ",
										activeRevenuePoint.month.slice(0, 4)
									] }), /* @__PURE__ */ jsxs("strong", { children: ["$", toNum(activeRevenuePoint.value).toLocaleString()] })]
								}) : null]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "admin-revenue-main",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "admin-revenue-value",
									children: ["$", revenuePrimary.toLocaleString()]
								}), /* @__PURE__ */ jsx("div", {
									className: "admin-revenue-label",
									children: revenuePrimaryLabel
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "admin-revenue-grid",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "admin-revenue-item",
										children: [/* @__PURE__ */ jsx("span", { children: "Paid Accounts" }), /* @__PURE__ */ jsx("strong", { children: paidCount.toLocaleString() })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "admin-revenue-item",
										children: [/* @__PURE__ */ jsx("span", { children: "ARPA" }), /* @__PURE__ */ jsxs("strong", { children: ["$", Math.round(arpa).toLocaleString()] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "admin-revenue-item",
										children: [/* @__PURE__ */ jsx("span", { children: "Trialing" }), /* @__PURE__ */ jsx("strong", { children: toNum(stats.trialRetailers).toLocaleString() })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "admin-revenue-item",
										children: [/* @__PURE__ */ jsx("span", { children: "New This Month" }), /* @__PURE__ */ jsx("strong", { children: toNum(stats.newThisMonth).toLocaleString() })]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "admin-revenue-trend",
								onMouseMove: (e) => {
									const rect = e.currentTarget.getBoundingClientRect();
									const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / Math.max(1, rect.width)));
									setHoverMonthIdx(Math.round(ratio * Math.max(0, monthlyRevenue.length - 1)));
								},
								onMouseLeave: () => setHoverMonthIdx(-1),
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "admin-revenue-trend-head",
										children: [/* @__PURE__ */ jsxs("span", { children: [revenueMode.toUpperCase(), " trend"] }), /* @__PURE__ */ jsx("span", { children: "monthly" })]
									}),
									/* @__PURE__ */ jsxs("svg", {
										viewBox: "0 0 100 100",
										preserveAspectRatio: "none",
										className: "admin-revenue-trend-chart",
										children: [
											/* @__PURE__ */ jsx("polyline", {
												className: "line-grid",
												points: "0,100 100,100"
											}),
											/* @__PURE__ */ jsx("polyline", {
												className: "line-grid",
												points: "0,75 100,75"
											}),
											/* @__PURE__ */ jsx("polyline", {
												className: "line-grid",
												points: "0,50 100,50"
											}),
											/* @__PURE__ */ jsx("polyline", {
												className: "line-grid",
												points: "0,25 100,25"
											}),
											/* @__PURE__ */ jsx("polyline", {
												className: "line-revenue",
												points: revenuePolyline
											}),
											activeRevenuePoint ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("line", {
												className: "line-cursor",
												x1: activeRevenuePoint.x,
												x2: activeRevenuePoint.x,
												y1: 0,
												y2: 100
											}), /* @__PURE__ */ jsx("circle", {
												className: "line-dot",
												cx: activeRevenuePoint.x,
												cy: activeRevenuePoint.y,
												r: "1.45"
											})] }) : null
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "admin-revenue-months",
										children: monthlyRevenue.map((point, idx) => /* @__PURE__ */ jsx("span", {
											className: idx === activeRevenueIdx ? "active" : "",
											children: monthLabel(point.month)
										}, `${point.month}-${idx}`))
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "admin-panel",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "admin-panel-head",
							children: [/* @__PURE__ */ jsx("h3", { children: "Plan Mix" }), /* @__PURE__ */ jsx("span", { children: "Live distribution" })]
						}), /* @__PURE__ */ jsx("div", {
							className: "admin-planmix-list",
							children: planMix.map((p) => /* @__PURE__ */ jsxs("div", {
								className: "admin-planmix-row",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "plan-name",
										children: p.plan
									}),
									/* @__PURE__ */ jsx("div", {
										className: "plan-bar",
										children: /* @__PURE__ */ jsx("div", { style: { width: `${toNum(p.count) / maxPlan * 100}%` } })
									}),
									/* @__PURE__ */ jsx("span", {
										className: "plan-count",
										children: toNum(p.count).toLocaleString()
									})
								]
							}, p.plan))
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "admin-panel",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "admin-panel-head",
							children: [/* @__PURE__ */ jsx("h3", { children: "Attention Needed" }), /* @__PURE__ */ jsx("span", { children: "Revenue risk and churn" })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "admin-attention",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "attention-item",
									children: [/* @__PURE__ */ jsx("strong", { children: toNum(attention.past_due).toLocaleString() }), /* @__PURE__ */ jsx("span", { children: "Past due accounts" })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "attention-item",
									children: [/* @__PURE__ */ jsx("strong", { children: toNum(attention.trial_ending_7d).toLocaleString() }), /* @__PURE__ */ jsx("span", { children: "Trials ending in 7 days" })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "attention-item",
									children: [/* @__PURE__ */ jsx("strong", { children: toNum(attention.no_activity_14d).toLocaleString() }), /* @__PURE__ */ jsx("span", { children: "No activity in 14 days" })]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "admin-panel",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "admin-panel-head",
							children: [/* @__PURE__ */ jsx("h3", { children: "Peak Hours (UTC)" }), /* @__PURE__ */ jsx("span", { children: "AI decisions in last 24h" })]
						}), /* @__PURE__ */ jsx("div", {
							className: "admin-hourly",
							children: hourly.map((h) => /* @__PURE__ */ jsx("div", {
								className: "hour-bar",
								title: `${h.hour}:00 UTC - ${toNum(h.ai_decisions)} decisions`,
								children: /* @__PURE__ */ jsx("div", {
									className: "hour-fill",
									style: { height: `${toNum(h.ai_decisions) / maxHour * 100}%` }
								})
							}, h.hour))
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "admin-panel admin-top-active",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "admin-panel-head",
					children: [/* @__PURE__ */ jsx("h3", { children: "Most Active Retailers (30d)" }), /* @__PURE__ */ jsx("span", { children: "By chat thread volume" })]
				}), topActive.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "admin-empty-inline",
					children: "No activity data yet."
				}) : /* @__PURE__ */ jsx("div", {
					className: "admin-table-wrap",
					children: /* @__PURE__ */ jsxs("table", {
						className: "admin-table",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", { children: "Retailer" }),
							/* @__PURE__ */ jsx("th", { children: "Plan" }),
							/* @__PURE__ */ jsx("th", { children: "Chats (30d)" })
						] }) }), /* @__PURE__ */ jsx("tbody", { children: topActive.map((r) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", { children: r.email || r.user_id }),
							/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
								className: `admin-plan-badge plan-${r.plan_code}`,
								children: r.plan_code
							}) }),
							/* @__PURE__ */ jsx("td", { children: toNum(r.chat_count).toLocaleString() })
						] }, r.user_id)) })]
					})
				})]
			})
		]
	});
}
function RetailersTab() {
	const [retailers, setRetailers] = useState([]);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState("");
	const [planFilter, setPlanFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [page, setPage] = useState(0);
	const limit = 25;
	const [manageRetailer, setManageRetailer] = useState(null);
	const [managePlan, setManagePlan] = useState("");
	const [manageStatus, setManageStatus] = useState("");
	const [manageRole, setManageRole] = useState("retailer_user");
	const [saving, setSaving] = useState(false);
	const loadRetailers = useCallback((offset = 0) => {
		setLoading(true);
		const params = new URLSearchParams({
			limit: String(limit),
			offset: String(offset)
		});
		if (search) params.set("search", search);
		if (planFilter) params.set("plan_code", planFilter);
		if (statusFilter) params.set("status", statusFilter);
		adminFetch(`/log?view=admin_retailers&${params}`).then((r) => r.json()).then((d) => {
			if (d.ok) {
				setRetailers(Array.isArray(d.retailers) ? d.retailers : []);
				setTotal(toNum(d.total));
			} else setError(d.error || "Failed to load");
			setLoading(false);
		}).catch(() => {
			setError("Network error");
			setLoading(false);
		});
	}, [
		search,
		planFilter,
		statusFilter
	]);
	useEffect(() => {
		loadRetailers(page * limit);
	}, [
		loadRetailers,
		page,
		limit
	]);
	const openManage = (r) => {
		setManageRetailer(r);
		setManagePlan(r.plan_code);
		setManageStatus(r.status);
		setManageRole(r.role || "retailer_user");
	};
	const savePlan = async () => {
		if (!manageRetailer) return;
		setSaving(true);
		const planData = await (await adminFetch("/log?action=admin_set_plan", {
			method: "PATCH",
			body: JSON.stringify({
				user_id: manageRetailer.user_id,
				plan_code: managePlan,
				status: manageStatus
			})
		})).json().catch(() => ({}));
		if (!planData?.ok) {
			setSaving(false);
			alert(planData?.error || "Failed to update");
			return;
		}
		const d = await (await adminFetch("/log?action=admin_set_role", {
			method: "PATCH",
			body: JSON.stringify({
				user_id: manageRetailer.user_id,
				email: manageRetailer.email,
				role: manageRole
			})
		})).json().catch(() => ({}));
		setSaving(false);
		if (d.ok) {
			setManageRetailer(null);
			loadRetailers(page * limit);
		} else alert(d.error || "Failed to update");
	};
	const totalPages = Math.ceil(total / limit);
	return /* @__PURE__ */ jsxs("div", {
		className: "admin-retailers",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "admin-page-title",
				children: "Retailers"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "admin-toolbar",
				children: [
					/* @__PURE__ */ jsx("input", {
						className: "admin-search",
						placeholder: "Search email…",
						value: search,
						onChange: (e) => {
							setSearch(e.target.value);
							setPage(0);
						}
					}),
					/* @__PURE__ */ jsxs("select", {
						className: "admin-select",
						value: planFilter,
						onChange: (e) => {
							setPlanFilter(e.target.value);
							setPage(0);
						},
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "",
								children: "All Plans"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "free",
								children: "Free"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "starter",
								children: "Starter"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "growth",
								children: "Growth"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "enterprise",
								children: "Enterprise"
							})
						]
					}),
					/* @__PURE__ */ jsxs("select", {
						className: "admin-select",
						value: statusFilter,
						onChange: (e) => {
							setStatusFilter(e.target.value);
							setPage(0);
						},
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "",
								children: "All Statuses"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "trialing",
								children: "Trialing"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "past_due",
								children: "Past Due"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "canceled",
								children: "Canceled"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "paused",
								children: "Paused"
							})
						]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "admin-count",
						children: [toNum(total).toLocaleString(), " retailers"]
					})
				]
			}),
			error && /* @__PURE__ */ jsx("div", {
				className: "admin-error",
				children: error
			}),
			/* @__PURE__ */ jsx("div", {
				className: "admin-table-wrap",
				children: /* @__PURE__ */ jsxs("table", {
					className: "admin-table",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", { children: "Email" }),
						/* @__PURE__ */ jsx("th", { children: "Role" }),
						/* @__PURE__ */ jsx("th", { children: "Plan" }),
						/* @__PURE__ */ jsx("th", { children: "Status" }),
						/* @__PURE__ */ jsx("th", { children: "Period End" }),
						/* @__PURE__ */ jsx("th", { children: "Last Active" }),
						/* @__PURE__ */ jsx("th", { children: "Actions" })
					] }) }), /* @__PURE__ */ jsx("tbody", { children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 7,
						className: "admin-td-center",
						children: "Loading…"
					}) }) : retailers.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 7,
						className: "admin-td-center",
						children: "No retailers found"
					}) }) : retailers.map((r) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", { children: r.email }),
						/* @__PURE__ */ jsx("td", { children: r.role || "retailer_user" }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
							className: `admin-plan-badge plan-${r.plan_code}`,
							children: r.plan_code
						}) }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
							className: `admin-status-badge status-${r.status}`,
							children: r.status
						}) }),
						/* @__PURE__ */ jsx("td", { children: r.period_end ? new Date(r.period_end).toLocaleDateString() : "—" }),
						/* @__PURE__ */ jsx("td", { children: r.last_seen ? new Date(r.last_seen).toLocaleDateString() : "Never" }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("button", {
							className: "admin-btn admin-btn-sm",
							onClick: () => openManage(r),
							children: "Manage"
						}) })
					] }, r.user_id)) })]
				})
			}),
			totalPages > 1 && /* @__PURE__ */ jsxs("div", {
				className: "admin-pagination",
				children: [
					/* @__PURE__ */ jsx("button", {
						className: "admin-btn admin-btn-sm",
						disabled: page === 0,
						onClick: () => setPage((p) => p - 1),
						children: "Prev"
					}),
					/* @__PURE__ */ jsxs("span", { children: [
						"Page ",
						page + 1,
						" of ",
						totalPages
					] }),
					/* @__PURE__ */ jsx("button", {
						className: "admin-btn admin-btn-sm",
						disabled: page >= totalPages - 1,
						onClick: () => setPage((p) => p + 1),
						children: "Next"
					})
				]
			}),
			manageRetailer && /* @__PURE__ */ jsx("div", {
				className: "admin-modal-overlay",
				onClick: () => setManageRetailer(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "admin-modal",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsx("h3", { children: "Manage Retailer" }),
						/* @__PURE__ */ jsx("p", {
							className: "admin-modal-email",
							children: manageRetailer.email
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "admin-modal-field",
							children: [/* @__PURE__ */ jsx("label", { children: "Role" }), /* @__PURE__ */ jsxs("select", {
								className: "admin-select",
								value: manageRole,
								onChange: (e) => setManageRole(e.target.value),
								children: [/* @__PURE__ */ jsx("option", {
									value: "retailer_user",
									children: "Retailer"
								}), /* @__PURE__ */ jsx("option", {
									value: "admin",
									children: "Admin"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "admin-modal-field",
							children: [/* @__PURE__ */ jsx("label", { children: "Plan" }), /* @__PURE__ */ jsxs("select", {
								className: "admin-select",
								value: managePlan,
								onChange: (e) => setManagePlan(e.target.value),
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "free",
										children: "Free"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "starter",
										children: "Starter"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "growth",
										children: "Growth"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "enterprise",
										children: "Enterprise"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "admin-modal-field",
							children: [/* @__PURE__ */ jsx("label", { children: "Status" }), /* @__PURE__ */ jsxs("select", {
								className: "admin-select",
								value: manageStatus,
								onChange: (e) => setManageStatus(e.target.value),
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "trialing",
										children: "Trialing"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "past_due",
										children: "Past Due"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "canceled",
										children: "Canceled"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "paused",
										children: "Paused"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "admin-modal-actions",
							children: [/* @__PURE__ */ jsx("button", {
								className: "admin-btn",
								onClick: () => setManageRetailer(null),
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								className: "admin-btn admin-btn-primary",
								disabled: saving,
								onClick: savePlan,
								children: saving ? "Saving…" : "Save"
							})]
						})
					]
				})
			})
		]
	});
}
function ChatsTab() {
	const [retailers, setRetailers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState("");
	const [threads, setThreads] = useState([]);
	const [selectedThread, setSelectedThread] = useState(null);
	const [messages, setMessages] = useState([]);
	const [loadingR, setLoadingR] = useState(true);
	const [loadingT, setLoadingT] = useState(false);
	const [loadingM, setLoadingM] = useState(false);
	useEffect(() => {
		adminFetch(`/log?view=admin_retailers&${new URLSearchParams({ limit: "500" })}`).then((r) => r.json()).then((d) => {
			if (d.ok) setRetailers(Array.isArray(d.retailers) ? d.retailers : []);
			setLoadingR(false);
		}).catch(() => setLoadingR(false));
	}, []);
	useEffect(() => {
		if (!selectedUserId) return;
		setLoadingT(true);
		adminFetch(`/log?view=retailer_chats&user_id=${encodeURIComponent(selectedUserId)}&limit=50`).then((r) => r.json()).then((d) => {
			setThreads(d.chats || []);
			setLoadingT(false);
		}).catch(() => setLoadingT(false));
	}, [selectedUserId]);
	useEffect(() => {
		if (!selectedThread) return;
		setLoadingM(true);
		adminFetch(`/log?view=retailer_chat_messages&chat_id=${encodeURIComponent(selectedThread.id)}&limit=100`).then((r) => r.json()).then((d) => {
			setMessages(d.messages || []);
			setLoadingM(false);
		}).catch(() => setLoadingM(false));
	}, [selectedThread]);
	return /* @__PURE__ */ jsxs("div", {
		className: "admin-chats",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "admin-page-title",
			children: "Chat History"
		}), /* @__PURE__ */ jsxs("div", {
			className: "admin-chats-layout",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "admin-chats-sidebar",
				children: [
					/* @__PURE__ */ jsx("label", {
						className: "admin-chats-label",
						children: "Retailer"
					}),
					loadingR ? /* @__PURE__ */ jsx("div", {
						className: "admin-td-center",
						children: "Loading…"
					}) : /* @__PURE__ */ jsxs("select", {
						className: "admin-select admin-chat-retailer-select",
						value: selectedUserId,
						onChange: (e) => {
							setSelectedUserId(e.target.value);
							setSelectedThread(null);
							setThreads([]);
							setMessages([]);
						},
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Select retailer…"
						}), retailers.map((r) => /* @__PURE__ */ jsx("option", {
							value: r.user_id,
							children: r.email
						}, r.user_id))]
					}),
					loadingT ? /* @__PURE__ */ jsx("div", {
						className: "admin-td-center",
						children: "Loading…"
					}) : threads.length === 0 && selectedUserId ? /* @__PURE__ */ jsx("div", {
						className: "admin-td-center",
						children: "No chats"
					}) : /* @__PURE__ */ jsx("div", {
						className: "admin-thread-list",
						children: threads.map((t) => /* @__PURE__ */ jsxs("button", {
							className: `admin-thread-item${selectedThread?.id === t.id ? " active" : ""}`,
							onClick: () => {
								setSelectedThread(t);
								setMessages([]);
							},
							children: [/* @__PURE__ */ jsx("div", {
								className: "admin-thread-title",
								children: t.title || "(No title)"
							}), /* @__PURE__ */ jsx("div", {
								className: "admin-thread-date",
								children: t.last_message_at ? new Date(t.last_message_at).toLocaleDateString() : ""
							})]
						}, t.id))
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "admin-chat-messages",
				children: !selectedThread ? /* @__PURE__ */ jsx("div", {
					className: "admin-empty-state",
					children: "Select a retailer and thread to view messages"
				}) : loadingM ? /* @__PURE__ */ jsx("div", {
					className: "admin-td-center",
					children: "Loading…"
				}) : messages.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "admin-empty-state",
					children: "No messages"
				}) : /* @__PURE__ */ jsx("div", {
					className: "admin-message-list",
					children: messages.map((m) => /* @__PURE__ */ jsx("div", {
						className: `admin-message admin-message-${m.role}`,
						children: /* @__PURE__ */ jsxs("div", {
							className: "admin-message-bubble",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "admin-message-role",
									children: m.role === "assistant" ? "AI" : "User"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "admin-message-content",
									children: m.content
								}),
								/* @__PURE__ */ jsx("span", {
									className: "admin-message-time",
									children: new Date(m.created_at).toLocaleString()
								})
							]
						})
					}, m.id))
				})
			})]
		})]
	});
}
function ApplicationsTab() {
	const [statusFilter, setStatusFilter] = useState("pending");
	const [apps, setApps] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [page, setPage] = useState(0);
	const limit = 50;
	const [actioningId, setActioningId] = useState(null);
	const loadApps = useCallback((offset = 0) => {
		setLoading(true);
		adminFetch(`/log?view=admin_partner_applications&${new URLSearchParams({
			status: statusFilter,
			limit: String(limit),
			offset: String(offset)
		})}`).then((r) => r.json()).then((d) => {
			if (d.ok) {
				setApps(Array.isArray(d.applications) ? d.applications : []);
				setTotal(toNum(d.total));
			} else setError(d.error || "Failed to load");
			setLoading(false);
		}).catch(() => {
			setError("Network error");
			setLoading(false);
		});
	}, [statusFilter, limit]);
	useEffect(() => {
		loadApps(page * limit);
	}, [
		loadApps,
		page,
		limit
	]);
	const patchStatus = async (id, status, notes = "") => {
		setActioningId(id);
		const d = await (await adminFetch("/log?action=partner_application_status", {
			method: "PATCH",
			body: JSON.stringify({
				id,
				status,
				reviewed_by: "admin",
				decision_notes: notes
			})
		})).json();
		setActioningId(null);
		if (d.ok) loadApps(page * limit);
		else alert(d.error || "Failed to update");
	};
	const totalPages = Math.ceil(total / limit);
	return /* @__PURE__ */ jsxs("div", {
		className: "admin-applications",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "admin-page-title",
				children: "Partner Applications"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "admin-toolbar",
				children: [/* @__PURE__ */ jsx("div", {
					className: "admin-filter-tabs",
					children: [
						"pending",
						"approved",
						"rejected"
					].map((s) => /* @__PURE__ */ jsx("button", {
						className: `admin-filter-tab${statusFilter === s ? " active" : ""}`,
						onClick: () => {
							setStatusFilter(s);
							setPage(0);
						},
						children: s.charAt(0).toUpperCase() + s.slice(1)
					}, s))
				}), /* @__PURE__ */ jsxs("span", {
					className: "admin-count",
					children: [total, " total"]
				})]
			}),
			error && /* @__PURE__ */ jsx("div", {
				className: "admin-error",
				children: error
			}),
			/* @__PURE__ */ jsx("div", {
				className: "admin-table-wrap",
				children: /* @__PURE__ */ jsxs("table", {
					className: "admin-table",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", { children: "Company" }),
						/* @__PURE__ */ jsx("th", { children: "Contact" }),
						/* @__PURE__ */ jsx("th", { children: "Email" }),
						/* @__PURE__ */ jsx("th", { children: "Type" }),
						/* @__PURE__ */ jsx("th", { children: "Submitted" }),
						/* @__PURE__ */ jsx("th", { children: "Actions" })
					] }) }), /* @__PURE__ */ jsx("tbody", { children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 6,
						className: "admin-td-center",
						children: "Loading…"
					}) }) : apps.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", {
						colSpan: 6,
						className: "admin-td-center",
						children: [
							"No ",
							statusFilter,
							" applications"
						]
					}) }) : apps.map((a) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", { children: a.company_name }),
						/* @__PURE__ */ jsx("td", { children: a.contact_name }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("a", {
							href: `mailto:${a.email}`,
							children: a.email
						}) }),
						/* @__PURE__ */ jsx("td", { children: a.application_type }),
						/* @__PURE__ */ jsx("td", { children: new Date(a.created_at).toLocaleDateString() }),
						/* @__PURE__ */ jsxs("td", { children: [statusFilter === "pending" && /* @__PURE__ */ jsxs("div", {
							className: "admin-action-group",
							children: [/* @__PURE__ */ jsx("button", {
								className: "admin-btn admin-btn-approve",
								disabled: actioningId === a.id,
								onClick: () => patchStatus(a.id, "approved"),
								children: actioningId === a.id ? "…" : "Approve"
							}), /* @__PURE__ */ jsx("button", {
								className: "admin-btn admin-btn-reject",
								disabled: actioningId === a.id,
								onClick: () => patchStatus(a.id, "rejected"),
								children: actioningId === a.id ? "…" : "Reject"
							})]
						}), statusFilter !== "pending" && /* @__PURE__ */ jsxs("span", {
							className: "admin-reviewed-info",
							children: [
								a.reviewed_by ? `by ${a.reviewed_by}` : "",
								" ",
								a.reviewed_at ? new Date(a.reviewed_at).toLocaleDateString() : ""
							]
						})] })
					] }, a.id)) })]
				})
			}),
			totalPages > 1 && /* @__PURE__ */ jsxs("div", {
				className: "admin-pagination",
				children: [
					/* @__PURE__ */ jsx("button", {
						className: "admin-btn admin-btn-sm",
						disabled: page === 0,
						onClick: () => setPage((p) => p - 1),
						children: "Prev"
					}),
					/* @__PURE__ */ jsxs("span", { children: [
						"Page ",
						page + 1,
						" of ",
						totalPages
					] }),
					/* @__PURE__ */ jsx("button", {
						className: "admin-btn admin-btn-sm",
						disabled: page >= totalPages - 1,
						onClick: () => setPage((p) => p + 1),
						children: "Next"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/routes/admin.tsx
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => admin_default,
	meta: () => meta
});
var meta = () => [
	{ title: "Admin — Coodra" },
	{
		name: "description",
		content: "Coodra admin workspace."
	},
	{
		name: "robots",
		content: "noindex, follow"
	}
];
var admin_default = UNSAFE_withComponentProps(function AdminRoute() {
	return /* @__PURE__ */ jsx(AuthGuard, { children: /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(AdminPage, {}) }) });
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-mAYxrSFZ.js",
		"imports": ["/assets/jsx-runtime-t_dAR0Bw.js"],
		"css": ["/assets/entry-PTugdkvS.css"]
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-hNjFWjOd.js",
			"imports": ["/assets/jsx-runtime-t_dAR0Bw.js", "/assets/analytics-CeZ0m8CA.js"],
			"css": ["/assets/entry-PTugdkvS.css", "/assets/root-yJ-bckaV.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/_index": {
			"id": "../src/routes/_index",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/_index-CvdGuBi9.js",
			"imports": ["/assets/jsx-runtime-t_dAR0Bw.js", "/assets/analytics-CeZ0m8CA.js"],
			"css": ["/assets/_index-CdsIqc9m.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/about": {
			"id": "../src/routes/about",
			"parentId": "root",
			"path": "about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/about-DjsvgT6k.js",
			"imports": ["/assets/jsx-runtime-t_dAR0Bw.js", "/assets/MarketingHeader-C8J8FVV1.js"],
			"css": ["/assets/LegalPages-BLjAc2xx.css", "/assets/MarketingHeader-CHduNHgM.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/contact": {
			"id": "../src/routes/contact",
			"parentId": "root",
			"path": "contact",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/contact-Hn6sw8q-.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/MarketingHeader-C8J8FVV1.js",
				"/assets/analytics-CeZ0m8CA.js"
			],
			"css": ["/assets/LegalPages-BLjAc2xx.css", "/assets/MarketingHeader-CHduNHgM.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/integrations": {
			"id": "../src/routes/integrations",
			"parentId": "root",
			"path": "integrations",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/integrations-DOTeOcyf.js",
			"imports": ["/assets/jsx-runtime-t_dAR0Bw.js", "/assets/MarketingHeader-C8J8FVV1.js"],
			"css": ["/assets/ExpansionPages-ClUTrODv.css", "/assets/MarketingHeader-CHduNHgM.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/security": {
			"id": "../src/routes/security",
			"parentId": "root",
			"path": "security",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/security-BVvl8XLo.js",
			"imports": ["/assets/jsx-runtime-t_dAR0Bw.js", "/assets/MarketingHeader-C8J8FVV1.js"],
			"css": ["/assets/ExpansionPages-ClUTrODv.css", "/assets/MarketingHeader-CHduNHgM.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/case-studies": {
			"id": "../src/routes/case-studies",
			"parentId": "root",
			"path": "case-studies",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/case-studies-C-XDYeBG.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/MarketingHeader-C8J8FVV1.js",
				"/assets/CaseStudiesPage-C5JFNRkW.js"
			],
			"css": ["/assets/MarketingHeader-CHduNHgM.css", "/assets/CaseStudiesPage-C2Q2Y08N.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/case-studies-slug": {
			"id": "../src/routes/case-studies-slug",
			"parentId": "root",
			"path": "case-studies/:slug",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/case-studies-slug-DM2RoKeO.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/MarketingHeader-C8J8FVV1.js",
				"/assets/CaseStudiesPage-C5JFNRkW.js"
			],
			"css": ["/assets/MarketingHeader-CHduNHgM.css", "/assets/CaseStudiesPage-C2Q2Y08N.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/blog": {
			"id": "../src/routes/blog",
			"parentId": "root",
			"path": "blog",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/blog-B6Df17FS.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/MarketingHeader-C8J8FVV1.js",
				"/assets/BlogPages-mko9-3Tu.js"
			],
			"css": ["/assets/MarketingHeader-CHduNHgM.css", "/assets/BlogPages-BkZSWvKG.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/blog-slug": {
			"id": "../src/routes/blog-slug",
			"parentId": "root",
			"path": "blog/:slug",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/blog-slug-BzqdNjDu.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/MarketingHeader-C8J8FVV1.js",
				"/assets/BlogPages-mko9-3Tu.js",
				"/assets/analytics-CeZ0m8CA.js"
			],
			"css": ["/assets/MarketingHeader-CHduNHgM.css", "/assets/BlogPages-BkZSWvKG.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/privacy": {
			"id": "../src/routes/privacy",
			"parentId": "root",
			"path": "privacy",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/privacy-B13lkqHB.js",
			"imports": ["/assets/jsx-runtime-t_dAR0Bw.js", "/assets/MarketingHeader-C8J8FVV1.js"],
			"css": ["/assets/LegalPages-BLjAc2xx.css", "/assets/MarketingHeader-CHduNHgM.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/terms": {
			"id": "../src/routes/terms",
			"parentId": "root",
			"path": "terms",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/terms-rKqYWWrS.js",
			"imports": ["/assets/jsx-runtime-t_dAR0Bw.js", "/assets/MarketingHeader-C8J8FVV1.js"],
			"css": ["/assets/LegalPages-BLjAc2xx.css", "/assets/MarketingHeader-CHduNHgM.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/pricing": {
			"id": "../src/routes/pricing",
			"parentId": "root",
			"path": "pricing",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/pricing-DOav9eN8.js",
			"imports": ["/assets/jsx-runtime-t_dAR0Bw.js", "/assets/MarketingHeader-C8J8FVV1.js"],
			"css": ["/assets/pricing-DHC-VPdQ.css", "/assets/MarketingHeader-CHduNHgM.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/login": {
			"id": "../src/routes/login",
			"parentId": "root",
			"path": "login",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/login-0xR64un0.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/analytics-CeZ0m8CA.js",
				"/assets/supabase-BABodXm6.js"
			],
			"css": ["/assets/login-CC_5d4Lh.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/signup": {
			"id": "../src/routes/signup",
			"parentId": "root",
			"path": "signup",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/signup-CiaPtoJ2.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/analytics-CeZ0m8CA.js",
				"/assets/supabase-BABodXm6.js"
			],
			"css": ["/assets/signup-5nKGI-2w.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/verify-email": {
			"id": "../src/routes/verify-email",
			"parentId": "root",
			"path": "verify-email",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/verify-email-C-ORR6zJ.js",
			"imports": ["/assets/jsx-runtime-t_dAR0Bw.js", "/assets/supabase-BABodXm6.js"],
			"css": ["/assets/verify-email-CFqxRJUD.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/reset-password": {
			"id": "../src/routes/reset-password",
			"parentId": "root",
			"path": "reset-password",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/reset-password-C3CrMPAT.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/analytics-CeZ0m8CA.js",
				"/assets/supabase-BABodXm6.js"
			],
			"css": ["/assets/reset-password-CbMKCTjI.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/dashboard": {
			"id": "../src/routes/dashboard",
			"parentId": "root",
			"path": "dashboard",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/dashboard-BwGjtFWW.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/AuthGuard-DEv7urFW.js",
				"/assets/supabase-BABodXm6.js"
			],
			"css": ["/assets/dashboard-rJ7ZQsX9.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"../src/routes/admin": {
			"id": "../src/routes/admin",
			"parentId": "root",
			"path": "admin",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/admin-CMeYksfA.js",
			"imports": [
				"/assets/jsx-runtime-t_dAR0Bw.js",
				"/assets/AuthGuard-DEv7urFW.js",
				"/assets/supabase-BABodXm6.js"
			],
			"css": ["/assets/admin-DtVGxtuh.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-8bc70b8d.js",
	"version": "8bc70b8d",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"unstable_passThroughRequests": false,
	"unstable_subResourceIntegrity": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": true
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"../src/routes/_index": {
		id: "../src/routes/_index",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: _index_exports
	},
	"../src/routes/about": {
		id: "../src/routes/about",
		parentId: "root",
		path: "about",
		index: void 0,
		caseSensitive: void 0,
		module: about_exports
	},
	"../src/routes/contact": {
		id: "../src/routes/contact",
		parentId: "root",
		path: "contact",
		index: void 0,
		caseSensitive: void 0,
		module: contact_exports
	},
	"../src/routes/integrations": {
		id: "../src/routes/integrations",
		parentId: "root",
		path: "integrations",
		index: void 0,
		caseSensitive: void 0,
		module: integrations_exports
	},
	"../src/routes/security": {
		id: "../src/routes/security",
		parentId: "root",
		path: "security",
		index: void 0,
		caseSensitive: void 0,
		module: security_exports
	},
	"../src/routes/case-studies": {
		id: "../src/routes/case-studies",
		parentId: "root",
		path: "case-studies",
		index: void 0,
		caseSensitive: void 0,
		module: case_studies_exports
	},
	"../src/routes/case-studies-slug": {
		id: "../src/routes/case-studies-slug",
		parentId: "root",
		path: "case-studies/:slug",
		index: void 0,
		caseSensitive: void 0,
		module: case_studies_slug_exports
	},
	"../src/routes/blog": {
		id: "../src/routes/blog",
		parentId: "root",
		path: "blog",
		index: void 0,
		caseSensitive: void 0,
		module: blog_exports
	},
	"../src/routes/blog-slug": {
		id: "../src/routes/blog-slug",
		parentId: "root",
		path: "blog/:slug",
		index: void 0,
		caseSensitive: void 0,
		module: blog_slug_exports
	},
	"../src/routes/privacy": {
		id: "../src/routes/privacy",
		parentId: "root",
		path: "privacy",
		index: void 0,
		caseSensitive: void 0,
		module: privacy_exports
	},
	"../src/routes/terms": {
		id: "../src/routes/terms",
		parentId: "root",
		path: "terms",
		index: void 0,
		caseSensitive: void 0,
		module: terms_exports
	},
	"../src/routes/pricing": {
		id: "../src/routes/pricing",
		parentId: "root",
		path: "pricing",
		index: void 0,
		caseSensitive: void 0,
		module: pricing_exports
	},
	"../src/routes/login": {
		id: "../src/routes/login",
		parentId: "root",
		path: "login",
		index: void 0,
		caseSensitive: void 0,
		module: login_exports
	},
	"../src/routes/signup": {
		id: "../src/routes/signup",
		parentId: "root",
		path: "signup",
		index: void 0,
		caseSensitive: void 0,
		module: signup_exports
	},
	"../src/routes/verify-email": {
		id: "../src/routes/verify-email",
		parentId: "root",
		path: "verify-email",
		index: void 0,
		caseSensitive: void 0,
		module: verify_email_exports
	},
	"../src/routes/reset-password": {
		id: "../src/routes/reset-password",
		parentId: "root",
		path: "reset-password",
		index: void 0,
		caseSensitive: void 0,
		module: reset_password_exports
	},
	"../src/routes/dashboard": {
		id: "../src/routes/dashboard",
		parentId: "root",
		path: "dashboard",
		index: void 0,
		caseSensitive: void 0,
		module: dashboard_exports
	},
	"../src/routes/admin": {
		id: "../src/routes/admin",
		parentId: "root",
		path: "admin",
		index: void 0,
		caseSensitive: void 0,
		module: admin_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
