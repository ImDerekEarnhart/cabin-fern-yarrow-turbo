import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-BYBBHkuD.mjs";
import { m as FileCheck2 } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-T2e5wazg.mjs";
import { t as Input } from "./input-QZw97axO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-ByA-qSoF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			if (mode === "signup") {
				const { error: err } = await authClient.signUp.email({
					email,
					password,
					name: name || email.split("@")[0],
					callbackURL: "/overview"
				});
				if (err) throw new Error(err.message);
			} else {
				const { error: err } = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/overview"
				});
				if (err) throw new Error(err.message);
			}
			window.location.href = "/overview";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Authentication failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center px-5 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-8 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-8 place-items-center rounded-lg border border-border-strong bg-bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck2, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "block text-sm",
						children: "HodgeForm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[9px] uppercase tracking-[0.16em] text-muted",
						children: "Release authority"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Sign in to the gate"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-6 text-muted",
					children: "Release decisions require an authenticated operator. Models never sign receipts."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [
						GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							className: "w-full",
							onClick: () => void signIn(p.providerId, { callbackURL: "/overview" }),
							children: ["Continue with ", p.label]
						}, p.providerId)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 py-2 text-[11px] uppercase tracking-[0.16em] text-subtle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
								"or email",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => void onEmail(e),
							className: "space-y-3",
							children: [
								mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "operator@company.com"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									required: true,
									minLength: 8,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "Password"
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-red-800/40 bg-red-500/10 p-3 text-sm text-red-300",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full",
									disabled: busy,
									children: busy ? "Working…" : mode === "signup" ? "Create operator account" : "Sign in with email"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "w-full text-center text-xs text-muted hover:text-fg",
							onClick: () => setMode(mode === "signup" ? "signin" : "signup"),
							children: mode === "signup" ? "Already have an account? Sign in" : "Need an account? Create one"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Login as component };
