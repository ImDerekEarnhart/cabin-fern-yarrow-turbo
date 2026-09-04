import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RequireUser, i as Page, o as useAsync, r as Empty, t as Card } from "./use-async-AUKd5ZiH.mjs";
import { t as Button } from "./button-T2e5wazg.mjs";
import { n as Select, r as Textarea, t as Input } from "./input-QZw97axO.mjs";
import { n as Status } from "./status-DCXX2ZF4.mjs";
import { d as listRepositories, l as listDiscoveries, n as createDiscovery } from "./api-DF9_Wyjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discoveries-Cjw4yJ9U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Discoveries() {
	const discoveries = useAsync(() => listDiscoveries());
	const repos = useAsync(() => listRepositories());
	const [repositoryId, setRepositoryId] = (0, import_react.useState)("");
	const [branch, setBranch] = (0, import_react.useState)("main");
	const [title, setTitle] = (0, import_react.useState)("");
	const [claim, setClaim] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await createDiscovery({ data: {
				repositoryId: repositoryId || repos.data?.[0]?.id || "",
				branch,
				title,
				claim
			} });
			setTitle("");
			setClaim("");
			await discoveries.reload();
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		eyebrow: "Machine-generated knowledge",
		title: "Discoveries",
		description: "The same primitives can version claims: branch them, challenge them, and bind them to exact evidence.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void submit(e),
				className: "grid gap-3 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Repository"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: repositoryId,
							onChange: (e) => setRepositoryId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select repository"
							}), (repos.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r.id,
								children: r.name
							}, r.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Branch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: branch,
							onChange: (e) => setBranch(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Claim"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: claim,
							onChange: (e) => setClaim(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || !(repositoryId || repos.data?.[0]),
						children: "Commit discovery"
					}) })
				]
			})
		}), discoveries.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: discoveries.data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: d.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: d.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-muted",
						children: [
							d.repository_name,
							" · ",
							d.branch
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-6 text-muted",
						children: d.claim
					})
				]
			}, d.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No discoveries yet",
			text: "Record a claim bound to a repository. Promotion still requires a gate."
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireUser, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Discoveries, {}) });
//#endregion
export { SplitComponent as component };
