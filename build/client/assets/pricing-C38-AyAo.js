import { UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", "light");
		return () => {
			document.documentElement.removeAttribute("data-theme");
		};
	}, []);
	const displayTiers = useMemo(() => tiers.map((tier) => ({
		...tier,
		displayPrice: formatPrice(isYearly ? tier.yearlyPrice : tier.monthlyPrice, isYearly)
	})), [isYearly]);
	return /* @__PURE__ */ jsxs("div", {
		className: "pricing-page",
		children: [/* @__PURE__ */ jsx("header", {
			className: "site-header pricing-header",
			children: /* @__PURE__ */ jsxs("nav", {
				className: "nav container pricing-nav",
				"aria-label": "Pricing navigation",
				children: [
					/* @__PURE__ */ jsx(Link, {
						className: "brand pricing-brand",
						to: "/",
						children: /* @__PURE__ */ jsx("img", {
							className: "coodra-logo-img",
							src: "/images/coodra-logo.png",
							alt: "Coodra"
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "nav-links pricing-links",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "/#how-it-works",
								children: "How it works"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/#decision",
								children: "Decision Engine"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/#proof",
								children: "Proof"
							}),
							/* @__PURE__ */ jsx(Link, {
								className: "is-active",
								to: "/pricing",
								children: "Pricing"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "nav-actions pricing-actions",
						children: [/* @__PURE__ */ jsx(Link, {
							className: "btn btn-ghost pricing-btn",
							to: "/login",
							children: "Sign in"
						}), /* @__PURE__ */ jsx(Link, {
							className: "btn btn-primary pricing-btn",
							to: "/signup",
							children: "Start Free"
						})]
					})
				]
			})
		}), /* @__PURE__ */ jsxs("main", {
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
var pricing_default = UNSAFE_withComponentProps(PricingPage);
//#endregion
export { pricing_default as default };
