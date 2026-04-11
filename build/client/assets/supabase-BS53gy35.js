import { createClient } from "@supabase/supabase-js";
//#region src/lib/supabase.ts
var supabaseUrl = void 0;
var supabaseAnonKey = void 0;
throw new Error("Missing Supabase environment variables");
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
function resolveApiEndpoint(path) {
	const baseRaw = "https://api.coodra.com".trim().replace(/\/+$/, "");
	if (baseRaw.endsWith("/api")) return `${baseRaw}${path.startsWith("/") ? path : `/${path}`}`;
	return `${baseRaw}/api${path.startsWith("/") ? path : `/${path}`}`;
}
async function exchangeForBackendJwt() {
	const cached = getCachedBackendJwt();
	if (cached) return cached;
	const { data: { session } } = await supabase.auth.getSession();
	if (!session?.user) return null;
	const supabaseToken = session.access_token;
	const sessionEmail = session.user.email || "";
	const email = sessionEmail.trim().toLowerCase();
	async function attemptExchange() {
		const roleResolveUrl = resolveApiEndpoint(`/log?view=role_resolve&scope=retailer&email=${encodeURIComponent(email)}`);
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
	return null;
}
//#endregion
export { supabase as i, getCachedBackendJwt as n, resolveApiEndpoint as r, exchangeForBackendJwt as t };
var supabase;
