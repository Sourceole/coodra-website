import { i as supabase, n as getCachedBackendJwt, t as exchangeForBackendJwt } from "./supabase-BS53gy35.js";
import { t as AuthGuard } from "./AuthGuard-C-UOBaXk.js";
import { UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//#region src/pages/Dashboard.tsx
var GLOBAL_THEME_KEY = "so_theme_last_v1";
var RC_ASSET_VERSION = "2026-04-11-retailer-copy-polish-1";
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
var dashboard_default = UNSAFE_withComponentProps(function DashboardRoute() {
	return /* @__PURE__ */ jsx(AuthGuard, { children: /* @__PURE__ */ jsx(Dashboard, {}) });
});
//#endregion
export { dashboard_default as default };
