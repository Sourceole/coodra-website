import { i as supabase } from "./supabase-BS53gy35.js";
import { UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
		if (password.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		setLoading(true);
		const { error: updateError } = await supabase.auth.updateUser({ password });
		setLoading(false);
		if (updateError) {
			setError(updateError.message || "Could not update password.");
			return;
		}
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
var reset_password_default = UNSAFE_withComponentProps(ResetPasswordPage);
//#endregion
export { reset_password_default as default };
