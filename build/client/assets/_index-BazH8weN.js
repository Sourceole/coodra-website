import { UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
var heroRotatingPhrases = [
	"Retail Decisions",
	"Profitable Actions",
	"Clear Priorities",
	"Faster Execution"
];
var heroGridCells = Array.from({ length: 140 }, (_, index) => ({
	index,
	delay: index % 14 * 45 + Math.floor(index / 14) * 36,
	accent: index % 17 === 0 || index % 29 === 0
}));
function LandingPage() {
	const [phraseIndex, setPhraseIndex] = useState(0);
	const [typedPhrase, setTypedPhrase] = useState("");
	const [typingPhase, setTypingPhase] = useState("typing");
	const [cursorVisible, setCursorVisible] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", loadScript);
		else loadScript();
		return () => {
			document.documentElement.removeAttribute("data-theme");
		};
	}, []);
	useEffect(() => {
		const id = window.setInterval(() => {
			setCursorVisible((visible) => !visible);
		}, 520);
		return () => window.clearInterval(id);
	}, []);
	useEffect(() => {
		const phrase = heroRotatingPhrases[phraseIndex];
		let timeout = 0;
		if (typingPhase === "typing") if (typedPhrase.length < phrase.length) timeout = window.setTimeout(() => {
			setTypedPhrase(phrase.slice(0, typedPhrase.length + 1));
		}, 58);
		else timeout = window.setTimeout(() => {
			setTypingPhase("holding");
		}, 900);
		else if (typingPhase === "holding") timeout = window.setTimeout(() => {
			setTypingPhase("deleting");
		}, 850);
		else if (typedPhrase.length > 0) timeout = window.setTimeout(() => {
			setTypedPhrase(phrase.slice(0, typedPhrase.length - 1));
		}, 36);
		else timeout = window.setTimeout(() => {
			setPhraseIndex((current) => (current + 1) % heroRotatingPhrases.length);
			setTypingPhase("typing");
		}, 240);
		return () => window.clearTimeout(timeout);
	}, [
		phraseIndex,
		typedPhrase,
		typingPhase
	]);
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
	const closeMobileMenu = () => setIsMobileMenuOpen(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "site-shell",
		id: "top",
		children: [
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
			}),
			/* @__PURE__ */ jsx("header", {
				className: "site-header",
				children: /* @__PURE__ */ jsxs("nav", {
					className: "nav container",
					"aria-label": "Primary",
					children: [
						/* @__PURE__ */ jsx("a", {
							className: "brand",
							href: "/#top",
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
									href: "/#how-it-works",
									children: "How it works"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "/#decision",
									children: "Decision Engine"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "/#proof",
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
						/* @__PURE__ */ jsxs("div", {
							id: "mobile-nav-menu",
							className: `mobile-nav-menu${isMobileMenuOpen ? " is-open" : ""}`,
							children: [/* @__PURE__ */ jsxs("ul", {
								className: "mobile-nav-links",
								children: [
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "/#how-it-works",
										onClick: closeMobileMenu,
										children: "How it works"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "/#decision",
										onClick: closeMobileMenu,
										children: "Decision Engine"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "/#proof",
										onClick: closeMobileMenu,
										children: "Proof"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
										to: "/pricing",
										onClick: closeMobileMenu,
										children: "Pricing"
									}) })
								]
							}), /* @__PURE__ */ jsxs("div", {
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
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("main", { children: [
				/* @__PURE__ */ jsxs("section", {
					className: "hero container",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "hero-data-grid",
							"aria-hidden": "true",
							children: heroGridCells.map((cell) => /* @__PURE__ */ jsx("span", {
								className: `hero-data-grid-cell${cell.accent ? " is-accent" : ""}`,
								style: { "--cell-delay": `${cell.delay}ms` }
							}, cell.index))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hero-copy",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "eyebrow",
									children: "Built for retail teams of every size"
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "hero-main-line",
									children: "Turn live store data into"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "hero-rotate-wrap",
									"aria-live": "polite",
									"aria-atomic": "true",
									children: /* @__PURE__ */ jsxs("span", {
										className: "hero-rotate-text",
										children: [typedPhrase, /* @__PURE__ */ jsx("span", {
											className: `hero-caret${cursorVisible ? " is-visible" : ""}`,
											"aria-hidden": "true",
											children: "|"
										})]
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "hero-subhead",
									children: "Coodra tracks sales, inventory, and demand signals in real time, then recommends exactly what to reorder, replace, remove, and protect so your team can act fast."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "hero-actions",
									children: [/* @__PURE__ */ jsx(Link, {
										to: "/signup",
										className: "btn btn-primary",
										children: "Start Free"
									}), /* @__PURE__ */ jsx("a", {
										href: "/#how-it-works",
										className: "btn btn-secondary",
										children: "See 3-step flow"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "hero-atmosphere",
							"aria-hidden": "true",
							children: /* @__PURE__ */ jsx("canvas", {
								id: "hero-particles",
								className: "hero-particles-canvas"
							})
						})
					]
				}),
				/* @__PURE__ */ jsx("section", {
					id: "media-expand",
					className: "media-expand container",
					"aria-label": "Coodra product reel placeholder",
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
					children: /* @__PURE__ */ jsxs("div", {
						className: "how-scroll",
						children: [/* @__PURE__ */ jsxs("header", {
							className: "how-sticky-head",
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
					children: /* @__PURE__ */ jsxs("div", {
						className: "decision-layout",
						children: [/* @__PURE__ */ jsxs("header", {
							className: "decision-copy",
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
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "eyebrow",
							children: "Real business outcomes"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Teams move faster and miss fewer opportunities." }),
						/* @__PURE__ */ jsx("p", {
							className: "proof-subline",
							children: "See how retailers use Coodra to act earlier and protect revenue."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "testimonials-viewport",
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
					className: "cta container",
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
								to: "/login",
								className: "btn btn-secondary",
								children: "Book a Demo"
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
												href: "#",
												"aria-label": "LinkedIn",
												children: "in"
											}),
											/* @__PURE__ */ jsx("a", {
												href: "#",
												"aria-label": "X",
												children: "x"
											}),
											/* @__PURE__ */ jsx("a", {
												href: "#",
												"aria-label": "YouTube",
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
									/* @__PURE__ */ jsx("a", {
										href: "#",
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
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Docs"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Case Studies"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "API Status"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Security"
									})
								]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "footer-link-col",
								children: [
									/* @__PURE__ */ jsx("h3", { children: "Company" }),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "About"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Careers"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										children: "Privacy"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
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
var _index_default = UNSAFE_withComponentProps(LandingPage);
//#endregion
export { _index_default as default };
