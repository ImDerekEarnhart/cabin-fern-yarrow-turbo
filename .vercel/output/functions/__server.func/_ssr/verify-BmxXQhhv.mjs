import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as FileCheck2 } from "../_libs/lucide-react.mjs";
import { a as SignedOut, i as SignedIn } from "./router-BK8s0lyL.mjs";
import { t as Button } from "./button-T2e5wazg.mjs";
import { r as Textarea } from "./input-QZw97axO.mjs";
import { n as Status } from "./status-DCXX2ZF4.mjs";
import { m as verifyReceipt } from "./api-DF9_Wyjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-BmxXQhhv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Verify() {
	const [raw, setRaw] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		setResult(null);
		try {
			const doc = JSON.parse(raw);
			const out = await verifyReceipt({ data: {
				payload: doc.payload,
				receiptHash: doc.receiptHash,
				signature: doc.signature,
				publicKeyFingerprint: doc.publicKeyFingerprint
			} });
			setResult(out);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Verification failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-5 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mb-8 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-8 place-items-center rounded-lg border border-border-strong bg-bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck2, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "text-sm",
					children: "HodgeForm"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] uppercase tracking-[0.18em] text-accent",
				children: "Public verifier"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-3xl font-semibold tracking-tight",
				children: "Verify a signed receipt"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-6 text-muted",
				children: "Paste an exported HodgeForm receipt. Verification is fail-closed: hash mismatch, bad signature, wrong fingerprint, or a BLOCK verdict cannot be treated as a pass."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 rounded-xl border border-border bg-bg-elevated p-4 text-sm text-muted",
				children: [
					"Sign in so the receipt can be checked against this workspace's pinned public key.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-fg underline",
						children: "Sign in"
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedIn, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => void submit(e),
					className: "mt-8 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: raw,
						onChange: (e) => setRaw(e.target.value),
						className: "h-56 font-mono text-xs",
						placeholder: "{\"schema\":\"hodgeform-signed-release/1\", ...}"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || !raw.trim(),
						children: busy ? "Checking…" : "Verify receipt"
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-lg border border-red-800/40 bg-red-500/10 p-3 text-sm text-red-300",
					children: error
				}),
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl border border-border bg-bg-elevated p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: result.ok ? "pass" : "fail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: result.ok ? `Valid ${result.verdict} receipt under this workspace authority.` : result.reason
					})]
				})
			] })
		]
	});
}
//#endregion
export { Verify as component };
