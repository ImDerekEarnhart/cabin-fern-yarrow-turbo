import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShieldCheck, d as GitCommitHorizontal, l as LockKeyhole, m as FileCheck2, y as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as SignedOut, i as SignedIn, s as useCurrentUserState } from "./router-BK8s0lyL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CoiAYaDJ.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { isPending } = useCurrentUserState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-5 py-10 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-8 place-items-center rounded-lg border border-border-strong bg-bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck2, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "block text-sm tracking-tight",
						children: "HodgeForm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[9px] uppercase tracking-[0.18em] text-muted",
						children: "Trust compiler"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/verify",
						className: "hidden text-muted hover:text-fg sm:inline",
						children: "Verify a receipt"
					}), isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-24 animate-pulse rounded-lg bg-bg-subtle" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "inline-flex h-11 items-center rounded-lg border border-border px-4 text-sm hover:bg-bg-elevated",
						children: "Sign in"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/overview",
						className: "inline-flex h-11 items-center rounded-lg bg-fg px-4 text-sm font-medium text-bg",
						children: "Open workspace"
					}) })] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.18em] text-accent",
						children: "Release authority for AI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.05]",
						children: "When an AI system changes, what evidence must exist before that change is trusted?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-2xl text-base leading-7 text-muted",
						children: "Git tells you what changed. HodgeForm compiles the authority in the exact artifact into a frozen gate, admits only typed evidence, and emits a signed RELEASE or BLOCK receipt that CI can verify without trusting this dashboard."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/gates",
								className: "inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-5 text-sm font-medium text-bg",
								children: ["Open Gates ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/login",
								className: "inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-5 text-sm font-medium text-bg",
								children: ["Enter the gate ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/verify",
								className: "inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm hover:bg-bg-elevated",
								children: "Verify a receipt"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 rounded-xl border border-border bg-bg-elevated p-5 font-mono text-xs leading-6 text-muted md:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-accent",
						children: "exact artifact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "→ semantic capability diff" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "→ frozen gate policy" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "→ admissible evidence" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "→ human approval" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-fg",
						children: "→ signed RELEASE / BLOCK receipt"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-10 grid gap-4 md:grid-cols-3",
				children: [
					{
						icon: GitCommitHorizontal,
						title: "Bound to exact bytes",
						text: "A candidate is frozen to a SHA-256 digest. HodgeForm never invents the hash."
					},
					{
						icon: LockKeyhole,
						title: "Policy decides",
						text: "An LLM may propose tests or find a counterexample. An LLM pass cannot satisfy a blocking obligation."
					},
					{
						icon: ShieldCheck,
						title: "Offline-verifiable",
						text: "Receipts are Ed25519-signed. CI checks the signature against a separately pinned public key."
					}
				].map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-bg-elevated p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-accent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-sm font-medium",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-6 text-muted",
							children: text
						})
					]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-16 max-w-2xl text-xs leading-5 text-subtle",
				children: "A HodgeForm receipt records satisfaction of a declared gate at a declared scope. It is not a universal certificate of safety, compliance, or correctness."
			})
		]
	});
}
//#endregion
export { Home as component };
