import { i as supabase, r as resolveApiEndpoint } from "./supabase-BS53gy35.js";
import { UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//#region src/pages/SignupPage.tsx
function SignupPage() {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [googleLoading, setGoogleLoading] = useState(false);
	const handleSignup = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
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
			setError(authError.message);
			setLoading(false);
			return;
		}
		try {
			fetch(resolveApiEndpoint("/log?action=partner_application_submit"), {
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
			navigate("/dashboard");
			return;
		}
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
var signup_default = UNSAFE_withComponentProps(SignupPage);
//#endregion
export { signup_default as default };
