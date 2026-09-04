import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./router-BK8s0lyL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-QZw97axO.js
var import_jsx_runtime = require_jsx_runtime();
var field = "h-11 w-full rounded-lg border border-border bg-bg px-3 text-sm text-fg outline-none ring-accent/40 placeholder:text-subtle focus:ring-2";
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn(field, className),
		...props
	});
}
function Select({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn(field, className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn(field, "h-28 py-2", className),
		...props
	});
}
//#endregion
export { Select as n, Textarea as r, Input as t };
