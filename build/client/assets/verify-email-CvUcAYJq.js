import { i as supabase } from "./supabase-BS53gy35.js";
import { UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
var verify_email_default = UNSAFE_withComponentProps(VerifyEmailPage);
//#endregion
export { verify_email_default as default };
