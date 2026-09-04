import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as useCurrentUser } from "./router-BK8s0lyL.mjs";
import { a as RequireUser, i as Page, n as CardHeader, o as useAsync, t as Card } from "./use-async-AUKd5ZiH.mjs";
import { t as Hash } from "./status-DCXX2ZF4.mjs";
import { s as getReleaseAuthority } from "./api-DF9_Wyjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-B-WWyL19.js
var import_jsx_runtime = require_jsx_runtime();
function Workspace() {
	const user = useCurrentUser();
	const keys = useAsync(() => getReleaseAuthority());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		eyebrow: "Operator identity",
		title: "Workspace",
		description: "This preview workspace is operator-owned. Receipts are signed with a workspace Ed25519 key generated on first use. Pin the fingerprint in CI separately from this dashboard.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-[0.13em] text-subtle",
							children: "Operator"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-sm",
							children: user?.displayName ?? "Signed-in operator"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted",
							children: user?.primaryEmail ?? user?.id
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-[0.13em] text-subtle",
							children: "Release authority"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-sm",
							children: "Ed25519 workspace signer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted",
							children: ["Fingerprint ", keys.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
								value: keys.data.fingerprint,
								chars: 20
							}) : "generating…"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { title: "Pinned public key" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto p-4 font-mono text-[11px] leading-5 text-muted",
					children: keys.data?.publicPem ?? "Loading signing material…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-2xl text-sm leading-6 text-muted",
				children: "CI tokens must never be able to perform human release approval. Record evidence from automation; decide releases here."
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireUser, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, {}) });
//#endregion
export { SplitComponent as component };
