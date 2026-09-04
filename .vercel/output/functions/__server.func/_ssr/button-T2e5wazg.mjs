import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./router-BK8s0lyL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-T2e5wazg.js
var import_jsx_runtime = require_jsx_runtime();
function Button({ className, variant = "primary", size = "md", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-50", size === "sm" ? "h-9 px-3 text-xs" : "h-11 px-4 text-sm", variant === "primary" ? "bg-fg text-bg hover:opacity-90" : "border border-border bg-bg text-fg hover:bg-bg-subtle", className),
		...props
	});
}
//#endregion
export { Button as t };
