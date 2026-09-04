import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RequireUser, i as Page, o as useAsync, r as Empty, t as Card } from "./use-async-AUKd5ZiH.mjs";
import { t as Button } from "./button-T2e5wazg.mjs";
import { r as Textarea, t as Input } from "./input-QZw97axO.mjs";
import { d as listRepositories, r as createRepository } from "./api-DF9_Wyjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/repositories-B4THbGue.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Repositories() {
	const list = useAsync(() => listRepositories());
	const [name, setName] = (0, import_react.useState)("support-agent");
	const [description, setDescription] = (0, import_react.useState)("Production customer-support agent");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			await createRepository({ data: {
				name,
				description
			} });
			await list.reload();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create repository");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		eyebrow: "Artifact inventory",
		title: "Repositories",
		description: "A repository holds versions of an AI artifact and the discovery commits made about it.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void submit(e),
				className: "grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							className: "h-11 py-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						children: busy ? "Creating…" : "Create repository"
					})
				]
			}), error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-red-300",
				children: error
			})]
		}), list.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: list.data.map((repo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: repo.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-mono text-[11px] text-muted",
						children: repo.slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-6 text-muted",
						children: repo.description || "No description"
					})
				]
			}, repo.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No repositories",
			text: "Create a repository to freeze release candidates against."
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireUser, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repositories, {}) });
//#endregion
export { SplitComponent as component };
