import { i as supabase } from "./supabase-BS53gy35.js";
import { Fragment, jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
export { AuthGuard as t };
