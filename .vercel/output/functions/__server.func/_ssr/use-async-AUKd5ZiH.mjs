import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as RedirectToSignIn, s as useCurrentUserState } from "./router-BK8s0lyL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-async-AUKd5ZiH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RequireUser({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[50vh] place-items-center p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-40 animate-pulse rounded-lg bg-bg-subtle" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function Page({ title, eyebrow, description, actions, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl p-5 md:p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-7 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: title
				}),
				description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-3xl text-sm leading-6 text-muted",
					children: description
				})
			] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0",
				children: actions
			})]
		}), children]
	});
}
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: `rounded-xl border border-border bg-bg-elevated ${className}`,
		children
	});
}
function CardHeader({ title, meta, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 border-b border-border px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-medium",
			children: title
		}), children] }), meta]
	});
}
function Empty({ title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-dashed border-border p-8 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-auto mt-2 max-w-md text-sm text-muted",
			children: text
		})]
	});
}
function useAsync(fn, deps = []) {
	const [data, setData] = (0, import_react.useState)(void 0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const reload = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError("");
		try {
			setData(await fn());
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			setLoading(false);
		}
	}, deps);
	(0, import_react.useEffect)(() => {
		reload();
	}, [reload]);
	return {
		data,
		loading,
		error,
		reload
	};
}
//#endregion
export { RequireUser as a, Page as i, CardHeader as n, useAsync as o, Empty as r, Card as t };
