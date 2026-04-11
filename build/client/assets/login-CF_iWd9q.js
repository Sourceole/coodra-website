import { i as supabase, t as exchangeForBackendJwt } from "./supabase-BS53gy35.js";
import { UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (authError) {
			setError(authError.message);
			setLoading(false);
			return;
		}
		const exchanged = await exchangeForBackendJwt();
		if (!exchanged?.token || !exchanged?.exp) {
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
		const { error: recoverErr } = await supabase.auth.resetPasswordForEmail(recoverEmail, { redirectTo: `${window.location.origin}/reset-password` });
		if (recoverErr) {
			setRecoverError(recoverErr.message);
			setRecoverState("error");
			return;
		}
		setRecoverState("sent");
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
var login_default = UNSAFE_withComponentProps(LoginPage);
//#endregion
export { login_default as default };
