import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CAPABILITIES } from "./types-QmcJoNx7.mjs";
import { _ as ChevronRight, c as Plus, g as CircleCheck, l as LockKeyhole, o as ShieldAlert } from "../_libs/lucide-react.mjs";
import { a as RequireUser, i as Page, n as CardHeader, o as useAsync, r as Empty, t as Card } from "./use-async-AUKd5ZiH.mjs";
import { t as Button } from "./button-T2e5wazg.mjs";
import { n as Select, r as Textarea, t as Input } from "./input-QZw97axO.mjs";
import { n as Status, t as Hash } from "./status-DCXX2ZF4.mjs";
import { a as getCandidate, c as listCandidates, d as listRepositories, f as proposeAdversarialChecks, i as decideRelease, p as recordEvidence, t as createCandidate } from "./api-DF9_Wyjz.mjs";
import { a as scanSource, i as recommendPack } from "./scan-DDCI6OWY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gates-CW0a0OyA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function sha256Hex(text) {
	const bytes = new TextEncoder().encode(text);
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function Gates() {
	const candidates = useAsync(() => listCandidates({ data: {} }));
	const repos = useAsync(() => listRepositories());
	const [showNew, setShowNew] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		eyebrow: "Semantic change control",
		title: "Gates",
		description: "Freeze an exact AI artifact. HodgeForm compiles capability changes into evidence obligations and refuses release until the frozen policy is satisfied.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => setShowNew(!showNew),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New candidate"]
		}),
		children: [
			showNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewCandidate, {
				repos: repos.data ?? [],
				onCreated: async (id) => {
					setShowNew(false);
					setSelected(id);
					await candidates.reload();
				}
			}),
			candidates.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { text: candidates.error }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-[0.72fr_1.28fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					title: "Release candidates",
					meta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: candidates.data?.length ?? 0
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[72dvh] divide-y divide-border overflow-y-auto",
					children: candidates.data?.length ? candidates.data.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSelected(c.id),
						className: `flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-bg-subtle ${selected === c.id ? "bg-bg-subtle" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-sm font-medium",
								children: [
									c.repository_name,
									" · ",
									c.version
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { value: c.artifact_hash }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted",
									children: c.risk
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: c.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3 text-subtle" })]
						})]
					}, c.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
							title: "No frozen candidates",
							text: "Create an exact artifact candidate and HodgeForm will compile its release obligations."
						})
					})
				})] }), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateInspector, {
					candidateId: selected,
					onChanged: candidates.reload
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "grid min-h-96 place-items-center p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "mx-auto size-8 text-subtle" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 text-lg font-semibold",
								children: "Select a gate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-6 text-muted",
								children: "Inspect the immutable policy lock, semantic capability diff, admissible evidence, and release decision."
							})
						]
					})
				})]
			})
		]
	});
}
function NewCandidate({ repos, onCreated }) {
	const [repoId, setRepoId] = (0, import_react.useState)(repos[0]?.id ?? "");
	const [version, setVersion] = (0, import_react.useState)("v1");
	const [name, setName] = (0, import_react.useState)("Customer support agent");
	const [framework, setFramework] = (0, import_react.useState)("MCP / custom");
	const [source, setSource] = (0, import_react.useState)("fetch(\"https://api.example.com/tickets\");\n");
	const [hash, setHash] = (0, import_react.useState)("");
	const [pack, setPack] = (0, import_react.useState)("auto");
	const [dataClass, setDataClass] = (0, import_react.useState)("internal");
	const [caps, setCaps] = (0, import_react.useState)(["network.outbound"]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!repoId && repos[0]?.id) setRepoId(repos[0].id);
	}, [repos, repoId]);
	async function hashSource() {
		const digest = await sha256Hex(source);
		setHash(digest);
		const detected = scanSource(source);
		if (detected.length) setCaps(detected);
	}
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			const recommended = recommendPack(caps);
			await onCreated((await createCandidate({ data: {
				repositoryId: repoId,
				version,
				artifactHash: hash,
				manifest: {
					name,
					framework,
					capabilities: caps
				},
				intent: {
					pack: pack === "auto" ? recommended : pack,
					dataClass
				}
			} })).candidateId);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to freeze candidate");
		} finally {
			setBusy(false);
		}
	}
	if (!repos.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mb-6 p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Create a repository before freezing a release candidate."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			title: "Freeze release candidate",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: "The gate policy is compiled server-side once and content-hashed before evidence collection starts."
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => void submit(e),
			className: "grid gap-4 p-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Repository"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: repoId,
						onChange: (e) => setRepoId(e.target.value),
						children: repos.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r.id,
							children: r.name
						}, r.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Version"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: version,
						onChange: (e) => setVersion(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Agent name"
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
						children: "Framework"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: framework,
						onChange: (e) => setFramework(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Policy pack"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: pack,
						onChange: (e) => setPack(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "auto",
								children: "Auto (recommended from authority)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "basic",
								children: "Basic"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "networked",
								children: "Networked agent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "code-execution",
								children: "Code execution"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "action-taking",
								children: "Action taking"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "high-risk",
								children: "High risk"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Data class"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: dataClass,
						onChange: (e) => setDataClass(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "public",
								children: "Public"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "internal",
								children: "Internal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "confidential",
								children: "Confidential"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "regulated",
								children: "Regulated"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "space-y-1 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Artifact source (hashed locally — bytes never leave this browser until you freeze)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: source,
							onChange: (e) => setSource(e.target.value),
							className: "font-mono text-xs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							size: "sm",
							onClick: () => void hashSource(),
							children: "Hash source and detect capabilities"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-xs text-muted",
						children: "Capabilities"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
						children: CAPABILITIES.map((cap) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 rounded-lg border border-border bg-bg px-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: caps.includes(cap),
								onChange: (e) => setCaps(e.target.checked ? [...caps, cap] : caps.filter((c) => c !== cap))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: cap
							})]
						}, cap))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Artifact SHA-256"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: hash,
						onChange: (e) => setHash(e.target.value.trim()),
						pattern: "[a-fA-F0-9]{64}",
						required: true,
						placeholder: "64-hex SHA-256 of the exact artifact bytes"
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { text: error })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						children: busy ? "Freezing…" : "Compile and freeze gate"
					})
				})
			]
		})]
	});
}
function CandidateInspector({ candidateId, onChanged }) {
	const details = useAsync(() => getCandidate({ data: { candidateId } }), [candidateId]);
	const [requirementId, setRequirementId] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("deterministic_test");
	const [outcome, setOutcome] = (0, import_react.useState)("pass");
	const [source, setSource] = (0, import_react.useState)("ci.verifier");
	const [payload, setPayload] = (0, import_react.useState)("{\"note\":\"Attach exact test output, digest, or verifier result here.\"}");
	const [confirmation, setConfirmation] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [redTeam, setRedTeam] = (0, import_react.useState)(null);
	const firstMissing = (0, import_react.useMemo)(() => details.data?.verdicts?.find((v) => v.status !== "pass")?.requirement?.id ?? details.data?.verdicts?.[0]?.requirement?.id ?? "", [details.data]);
	(0, import_react.useEffect)(() => {
		setRequirementId(firstMissing);
	}, [firstMissing]);
	const requirement = details.data?.verdicts?.find((v) => v.requirement.id === requirementId)?.requirement;
	(0, import_react.useEffect)(() => {
		if (requirement?.allowedEvidence?.length && !requirement.allowedEvidence.includes(kind)) setKind(requirement.allowedEvidence[0]);
	}, [requirement, kind]);
	async function suggestTests() {
		setBusy(true);
		setError("");
		try {
			setRedTeam(await proposeAdversarialChecks({ data: { candidateId } }));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to generate red-team suggestions");
		} finally {
			setBusy(false);
		}
	}
	async function addEvidence(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			await recordEvidence({ data: {
				candidateId,
				requirementId,
				evidenceKind: kind,
				outcome,
				source,
				payload: JSON.parse(payload || "{}")
			} });
			await details.reload();
			await onChanged();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to record evidence");
		} finally {
			setBusy(false);
		}
	}
	async function decide() {
		setBusy(true);
		setError("");
		try {
			await decideRelease({ data: {
				candidateId,
				expectedPolicyHash: details.data.plan.policy_hash,
				confirmation
			} });
			setConfirmation("");
			await details.reload();
			await onChanged();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Decision failed");
		} finally {
			setBusy(false);
		}
	}
	if (details.loading || !details.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-6 text-sm text-muted",
		children: "Loading frozen gate…"
	});
	if (details.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { text: details.error });
	const d = details.data;
	const p = d.plan.compiled_policy_json;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] uppercase tracking-[0.13em] text-subtle",
					children: "Proposal-only red team"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "HodgeForm can propose falsification tests against this exact frozen policy. Suggestions are never release authority."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					onClick: () => void suggestTests(),
					disabled: busy,
					children: "Propose tests"
				})]
			}), redTeam && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 text-xs text-muted",
					children: [
						redTeam.model,
						" · ",
						redTeam.provider,
						" · policy ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { value: redTeam.policyHash })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: redTeam.tests.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-bg p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-medium",
								children: [
									t.requirementId,
									" · ",
									t.title
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-5 text-muted",
								children: t.testIdea
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-red-300",
								children: ["Failure signal: ", t.failureSignal]
							})
						]
					}, t.requirementId))
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					title: `${d.candidate.manifest_json.name} · ${d.candidate.version}`,
					meta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: d.candidate.status })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 p-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Artifact",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
								value: d.candidate.artifact_hash,
								chars: 16
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Frozen policy",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
								value: d.plan.policy_hash,
								chars: 16
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Risk",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize",
								children: d.candidate.risk
							})
						})
					]
				}),
				p.addedCapabilities?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border bg-amber-500/5 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-medium text-amber-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4" }), "Semantic authority expanded"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: p.addedCapabilities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
							className: "rounded bg-bg px-2 py-1 font-mono text-[11px] text-amber-200",
							children: ["+ ", c]
						}, c))
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				title: "Compiled evidence obligations",
				meta: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted",
					children: [
						d.verdicts.filter((v) => v.status === "pass").length,
						"/",
						d.verdicts.length,
						" satisfied"
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: d.verdicts.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 px-4 py-3 md:grid-cols-[110px_1fr_auto] md:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[11px] text-muted",
							children: v.requirement.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm",
								children: v.requirement.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs leading-5 text-muted",
								children: v.requirement.reason
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 font-mono text-[10px] text-subtle",
								children: [
									"admissible: ",
									v.requirement.allowedEvidence.join(", "),
									" · min independence:",
									" ",
									v.requirement.minimumIndependence
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: v.status })
					]
				}, v.requirement.id))
			})] }),
			d.candidate.status === "frozen" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				title: "Attach evidence",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: "Evidence is typed, scoped, hashed, and append-only. LLM PASS results never satisfy a blocking obligation alone."
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void addEvidence(e),
				className: "grid gap-3 p-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Requirement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: requirementId,
							onChange: (e) => setRequirementId(e.target.value),
							children: d.verdicts.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: v.requirement.id,
								children: [
									v.requirement.id,
									" · ",
									v.requirement.title
								]
							}, v.requirement.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Evidence kind"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: kind,
							onChange: (e) => setKind(e.target.value),
							children: (requirement?.allowedEvidence ?? []).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: k }, k))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Outcome"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: outcome,
							onChange: (e) => setOutcome(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pass",
									children: "pass"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "fail",
									children: "fail"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "inconclusive",
									children: "inconclusive"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Verifier source"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: source,
							onChange: (e) => setSource(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Evidence payload (JSON)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: payload,
							onChange: (e) => setPayload(e.target.value),
							className: "font-mono text-xs"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							disabled: busy,
							children: "Record evidence receipt"
						})
					})
				]
			})] }),
			d.evidence.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { title: "Evidence ledger" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: d.evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-muted",
								children: e.requirement_id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs",
								children: e.evidence_kind
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-[11px] text-subtle",
							children: [
								e.source,
								" · ",
								e.independence,
								" · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { value: e.payload_hash })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: e.outcome })]
				}, e.id))
			})] }),
			d.candidate.status === "frozen" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				title: "Request release decision",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: "This freezes the evidence snapshot. Missing or failed obligations produce a signed BLOCK receipt; satisfied gates produce RELEASE."
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `rounded-lg border p-3 text-sm ${d.gateReady ? "border-emerald-800/50 bg-emerald-500/5 text-emerald-200" : "border-amber-800/50 bg-amber-500/5 text-amber-200"}`,
						children: d.gateReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }), "All configured obligations currently satisfied."]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [d.verdicts.filter((v) => v.status !== "pass").length, " obligation(s) are still missing or failed. Requesting a decision now will produce BLOCK."] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: confirmation,
						onChange: (e) => setConfirmation(e.target.value),
						placeholder: "I reviewed this exact frozen gate"
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBox, { text: error }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void decide(),
						disabled: busy || confirmation !== "I reviewed this exact frozen gate",
						children: busy ? "Deciding…" : "Sign release decision"
					})
				]
			})] }),
			d.receipt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				title: "Signed release receipt",
				meta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: d.receipt.verdict })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 p-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Receipt hash",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
							value: d.receipt.receipt_hash,
							chars: 20
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Signer",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.receipt.signer_id })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Public-key fingerprint",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
							value: d.receipt.public_key_fingerprint,
							chars: 20
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Boundary",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Exact configured gate only; never universal safety."
						})
					})
				]
			})] })
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-mono text-[10px] uppercase tracking-[0.13em] text-subtle",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 text-sm",
		children: value
	})] });
}
function ErrorBox({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-red-800/40 bg-red-500/10 p-3 text-sm text-red-300",
		children: text
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireUser, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gates, {}) });
//#endregion
export { SplitComponent as component };
