import { i as supabase, n as getCachedBackendJwt, t as exchangeForBackendJwt } from "./supabase-BS53gy35.js";
import { t as AuthGuard } from "./AuthGuard-C-UOBaXk.js";
import { UNSAFE_withComponentProps } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
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
var admin_default = UNSAFE_withComponentProps(function AdminRoute() {
	return /* @__PURE__ */ jsx(AuthGuard, { children: /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(AdminPage, {}) }) });
});
//#endregion
export { admin_default as default };
