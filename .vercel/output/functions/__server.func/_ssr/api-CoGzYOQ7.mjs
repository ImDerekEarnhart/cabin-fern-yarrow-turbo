import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware, t as CAPABILITIES } from "./types-QmcJoNx7.mjs";
import { cn as _enum, dn as boolean, gn as object, un as array, vn as record, xn as unknown, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CoGzYOQ7.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var repoSchema = object({
	name: string().min(1).max(100),
	description: string().max(500).optional()
});
var intentSchema = object({
	pack: _enum([
		"basic",
		"networked",
		"code-execution",
		"action-taking",
		"high-risk"
	]),
	dataClass: _enum([
		"public",
		"internal",
		"confidential",
		"regulated"
	]),
	separateApprover: boolean().optional()
});
var manifestSchema = object({
	name: string().min(1).max(120),
	framework: string().max(80).optional(),
	description: string().max(1e3).optional(),
	artifactUri: string().max(500).optional(),
	capabilities: array(_enum(CAPABILITIES)).max(30),
	metadata: record(string(), string()).optional()
});
var getOverview_createServerFn_handler = createServerRpc({
	id: "8ad1a9ba9e41ad90bbdd91f16991de086c639cdfaacfe83c4089aa6e1fa21ad5",
	name: "getOverview",
	filename: "src/lib/gate/api.ts"
}, (opts) => getOverview.__executeServer(opts));
var getOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getOverview_createServerFn_handler, async ({ context }) => (await import("./service.server-DkVSGcn7.mjs")).getOverview(context.userId));
var listRepositories_createServerFn_handler = createServerRpc({
	id: "91b2c9ebcd1644604e78c11a7e5e120201b8765251ce7e84f5808427fdd5c408",
	name: "listRepositories",
	filename: "src/lib/gate/api.ts"
}, (opts) => listRepositories.__executeServer(opts));
var listRepositories = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listRepositories_createServerFn_handler, async ({ context }) => (await import("./service.server-DkVSGcn7.mjs")).listRepositories(context.userId));
var listCandidates_createServerFn_handler = createServerRpc({
	id: "0a03b52b104a34b3a8c75914d8c5d7103ee7bd42b0f29545e57bf1af7564e9fd",
	name: "listCandidates",
	filename: "src/lib/gate/api.ts"
}, (opts) => listCandidates.__executeServer(opts));
var listCandidates = createServerFn({ method: "GET" }).middleware([authMiddleware]).inputValidator((input = {}) => ({ repositoryId: input?.repositoryId?.slice(0, 100) })).handler(listCandidates_createServerFn_handler, async ({ data, context }) => (await import("./service.server-DkVSGcn7.mjs")).listCandidates(context.userId, data.repositoryId));
var listReceipts_createServerFn_handler = createServerRpc({
	id: "5e08ce00532f88aaf50bcb5409a78debf6ce48b35c2326020ae8d4786a70982b",
	name: "listReceipts",
	filename: "src/lib/gate/api.ts"
}, (opts) => listReceipts.__executeServer(opts));
var listReceipts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listReceipts_createServerFn_handler, async ({ context }) => (await import("./service.server-DkVSGcn7.mjs")).listReceipts(context.userId));
var listDiscoveries_createServerFn_handler = createServerRpc({
	id: "b04457e2dc8b69437c77b8ed124f40528cc52185455e51078029113bb064bbbc",
	name: "listDiscoveries",
	filename: "src/lib/gate/api.ts"
}, (opts) => listDiscoveries.__executeServer(opts));
var listDiscoveries = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listDiscoveries_createServerFn_handler, async ({ context }) => (await import("./service.server-DkVSGcn7.mjs")).listDiscoveries(context.userId));
var createRepository_createServerFn_handler = createServerRpc({
	id: "4dd70a66827c422d329ca8359d03f112298e62965c1a6b2a1b2cd12499ee28ad",
	name: "createRepository",
	filename: "src/lib/gate/api.ts"
}, (opts) => createRepository.__executeServer(opts));
var createRepository = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((input) => repoSchema.parse(input)).handler(createRepository_createServerFn_handler, async ({ data, context }) => (await import("./service.server-DkVSGcn7.mjs")).createRepository(context.userId, data));
var createCandidate_createServerFn_handler = createServerRpc({
	id: "e4f6dfec8d4b51e7ad23f1d92325b799d68c4ec224f5878adba915b428144059",
	name: "createCandidate",
	filename: "src/lib/gate/api.ts"
}, (opts) => createCandidate.__executeServer(opts));
var createCandidate = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((input) => object({
	repositoryId: string().min(1).max(100),
	version: string().min(1).max(80),
	artifactHash: string().regex(/^[a-fA-F0-9]{64}$/),
	manifest: manifestSchema,
	intent: intentSchema
}).parse(input)).handler(createCandidate_createServerFn_handler, async ({ data, context }) => (await import("./service.server-DkVSGcn7.mjs")).createCandidate(context.userId, data));
var proposeAdversarialChecks_createServerFn_handler = createServerRpc({
	id: "1be255e1b2d637ca87a16f3a7c0275754563b18318cc691fcf851714856a70dd",
	name: "proposeAdversarialChecks",
	filename: "src/lib/gate/api.ts"
}, (opts) => proposeAdversarialChecks.__executeServer(opts));
var proposeAdversarialChecks = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((input) => object({ candidateId: string().min(1).max(100) }).parse(input)).handler(proposeAdversarialChecks_createServerFn_handler, async ({ data, context }) => (await import("./service.server-DkVSGcn7.mjs")).proposeAdversarialChecks(context.userId, data.candidateId));
var getCandidate_createServerFn_handler = createServerRpc({
	id: "7f640bd9aa6e20a19459054671d6048222cd1c41902f704174a60dcab021e49c",
	name: "getCandidate",
	filename: "src/lib/gate/api.ts"
}, (opts) => getCandidate.__executeServer(opts));
var getCandidate = createServerFn({ method: "GET" }).middleware([authMiddleware]).inputValidator((input) => object({ candidateId: string().min(1).max(100) }).parse(input)).handler(getCandidate_createServerFn_handler, async ({ data, context }) => (await import("./service.server-DkVSGcn7.mjs")).getCandidate(context.userId, data.candidateId));
var recordEvidence_createServerFn_handler = createServerRpc({
	id: "412836c498732af0ed664475ee8c940d29741ab8a723c2d75a61c10939625140",
	name: "recordEvidence",
	filename: "src/lib/gate/api.ts"
}, (opts) => recordEvidence.__executeServer(opts));
var recordEvidence = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((input) => object({
	candidateId: string().min(1).max(100),
	requirementId: string().min(1).max(80),
	evidenceKind: _enum([
		"deterministic_test",
		"sandbox_run",
		"static_analysis",
		"llm_evaluation",
		"independent_verifier",
		"formal_proof",
		"human_approval"
	]),
	outcome: _enum([
		"pass",
		"fail",
		"inconclusive"
	]),
	source: string().min(1).max(160),
	payload: record(string(), unknown()).default({})
}).parse(input)).handler(recordEvidence_createServerFn_handler, async ({ data, context }) => (await import("./service.server-DkVSGcn7.mjs")).recordEvidence(context.userId, data.candidateId, data));
var decideRelease_createServerFn_handler = createServerRpc({
	id: "b84f66425f2d6031f9a00fd4faf8d44d678b2b2f21abb83d635a0a68298897a4",
	name: "decideRelease",
	filename: "src/lib/gate/api.ts"
}, (opts) => decideRelease.__executeServer(opts));
var decideRelease = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((input) => object({
	candidateId: string().min(1).max(100),
	expectedPolicyHash: string().regex(/^[a-fA-F0-9]{64}$/),
	confirmation: string().max(100)
}).parse(input)).handler(decideRelease_createServerFn_handler, async ({ data, context }) => (await import("./service.server-DkVSGcn7.mjs")).decideRelease(context.userId, data.candidateId, data.expectedPolicyHash, data.confirmation));
var createDiscovery_createServerFn_handler = createServerRpc({
	id: "cdb4ef21cd436ed3d23c49d36dbd8f61bf958b8bdcc3c89460dce2af09fbcc17",
	name: "createDiscovery",
	filename: "src/lib/gate/api.ts"
}, (opts) => createDiscovery.__executeServer(opts));
var createDiscovery = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((input) => object({
	repositoryId: string().min(1).max(100),
	parentId: string().max(100).optional(),
	branch: string().min(1).max(80),
	title: string().min(1).max(160),
	claim: string().min(1).max(6e3)
}).parse(input)).handler(createDiscovery_createServerFn_handler, async ({ data, context }) => (await import("./service.server-DkVSGcn7.mjs")).createDiscovery(context.userId, data));
var getReleaseAuthority_createServerFn_handler = createServerRpc({
	id: "f212385c54a37e811a3aa683bd6d8077b9ae8048f16305fda46fe91025f160d9",
	name: "getReleaseAuthority",
	filename: "src/lib/gate/api.ts"
}, (opts) => getReleaseAuthority.__executeServer(opts));
var getReleaseAuthority = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getReleaseAuthority_createServerFn_handler, async ({ context }) => (await import("./service.server-DkVSGcn7.mjs")).getPublicKey(context.userId));
var verifyReceipt_createServerFn_handler = createServerRpc({
	id: "1858f45dd3c4d58b38d091b8f9b7e942741311a69d6f389042651f1f28567622",
	name: "verifyReceipt",
	filename: "src/lib/gate/api.ts"
}, (opts) => verifyReceipt.__executeServer(opts));
var verifyReceipt = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator((input) => object({
	payload: unknown(),
	receiptHash: string().min(16),
	signature: string().min(16),
	publicKeyFingerprint: string().min(16)
}).parse(input)).handler(verifyReceipt_createServerFn_handler, async ({ data, context }) => (await import("./service.server-DkVSGcn7.mjs")).verifyReceiptDocument(context.userId, data));
//#endregion
export { createCandidate_createServerFn_handler, createDiscovery_createServerFn_handler, createRepository_createServerFn_handler, decideRelease_createServerFn_handler, getCandidate_createServerFn_handler, getOverview_createServerFn_handler, getReleaseAuthority_createServerFn_handler, listCandidates_createServerFn_handler, listDiscoveries_createServerFn_handler, listReceipts_createServerFn_handler, listRepositories_createServerFn_handler, proposeAdversarialChecks_createServerFn_handler, recordEvidence_createServerFn_handler, verifyReceipt_createServerFn_handler };
