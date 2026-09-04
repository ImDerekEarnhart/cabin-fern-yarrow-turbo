import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Download, i as SquareTerminal, p as Fingerprint } from "../_libs/lucide-react.mjs";
import { a as RequireUser, i as Page, n as CardHeader, o as useAsync, r as Empty, t as Card } from "./use-async-AUKd5ZiH.mjs";
import { t as Button } from "./button-T2e5wazg.mjs";
import { n as Status, t as Hash } from "./status-DCXX2ZF4.mjs";
import { u as listReceipts } from "./api-DF9_Wyjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipts-BKAOSlWm.js
var import_jsx_runtime = require_jsx_runtime();
function Receipts() {
	const { data, error } = useAsync(() => listReceipts());
	function download(r) {
		const doc = {
			schema: "hodgeform-signed-release/1",
			payload: JSON.parse(r.receipt_json),
			receiptHash: r.receipt_hash,
			signerId: r.signer_id,
			signature: r.signature_b64,
			publicKeyFingerprint: r.public_key_fingerprint
		};
		const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `hodgeform-${r.repository_slug}-${r.version}-${r.verdict.toLowerCase()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		eyebrow: "Offline-verifiable trust",
		title: "Release receipts",
		description: "A receipt is a signed statement about an exact artifact under an exact frozen gate. CI verifies it against a pinned Ed25519 public key — without trusting this dashboard.",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 rounded-lg border border-red-800/40 bg-red-500/10 p-3 text-sm text-red-300",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					title: "CI contract",
					meta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareTerminal, { className: "size-4 text-subtle" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 p-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] uppercase tracking-[0.13em] text-subtle",
						children: "Verify"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "mt-2 block rounded-lg border border-border bg-bg p-3 text-xs text-accent",
						children: "Paste the exported JSON on the public verifier page"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] uppercase tracking-[0.13em] text-subtle",
						children: "Enforcement"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6 text-muted",
						children: "Verification fails closed on a tampered signature, mismatched receipt hash, untrusted key, or BLOCK verdict."
					})] })]
				})]
			}),
			data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: r.verdict }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-medium",
							children: [
								r.repository_name,
								" · ",
								r.version
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap gap-4 text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["receipt ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
								value: r.receipt_hash,
								chars: 18
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["artifact ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { value: r.artifact_hash })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { value: r.public_key_fingerprint })]
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => download(r),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), "Export receipt"]
					})]
				}) }, r.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "No signed decisions yet",
				text: "When a frozen gate is decided, HodgeForm keeps the evidence trail and emits a portable signed RELEASE or BLOCK receipt."
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireUser, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipts, {}) });
//#endregion
export { SplitComponent as component };
