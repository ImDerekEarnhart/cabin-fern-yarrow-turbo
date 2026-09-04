import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShieldCheck, d as GitCommitHorizontal, m as FileCheck2, t as Waypoints, y as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as RequireUser, i as Page, n as CardHeader, o as useAsync, r as Empty, t as Card } from "./use-async-AUKd5ZiH.mjs";
import { n as Status, t as Hash } from "./status-DCXX2ZF4.mjs";
import { o as getOverview } from "./api-DF9_Wyjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/overview-CMbsoi39.js
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
	const { data, loading, error } = useAsync(() => getOverview());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		eyebrow: "Release authority",
		title: "Trust what ships",
		description: "Git tells you what changed. HodgeForm determines what evidence that change requires before consequential AI work can become trusted.",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 rounded-lg border border-red-800/40 bg-red-500/10 p-3 text-sm text-red-300",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					[
						"Repositories",
						data?.counts.repositories ?? 0,
						Waypoints
					],
					[
						"Candidates",
						data?.counts.candidates ?? 0,
						GitCommitHorizontal
					],
					[
						"Released",
						data?.counts.released ?? 0,
						ShieldCheck
					],
					[
						"Receipts",
						data?.counts.receipts ?? 0,
						FileCheck2
					]
				].map(([label, value, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-subtle" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 text-3xl font-semibold tabular-nums",
						children: loading ? "—" : value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					title: "Latest release candidates",
					meta: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/gates",
						className: "flex items-center gap-1 text-xs text-muted hover:text-fg",
						children: ["Open Gates ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: data?.latest?.length ? data.latest.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-sm font-medium",
								children: [
									item.repository_name,
									" · ",
									item.version
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-2 text-xs text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { value: item.artifact_hash }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.risk, " risk"] })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: item.status })]
					}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
							title: "No candidates yet",
							text: "Create a repository, freeze an exact agent version, then satisfy its compiled evidence obligations."
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { title: "The invariant" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-sm leading-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: "Models"
								}),
								" propose evidence.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: "Evidence"
								}),
								" establishes scoped facts.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: "Policy"
								}),
								" decides."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-6 text-muted",
							children: "A probabilistic judge may discover a counterexample and block a release. It can never be the sole reason a blocking obligation passes."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-border bg-bg p-3 font-mono text-[11px] text-muted",
							children: "artifact hash → policy lock → admissible evidence → independent approval → signed receipt"
						})
					]
				})] })]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireUser, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}) });
//#endregion
export { SplitComponent as component };
