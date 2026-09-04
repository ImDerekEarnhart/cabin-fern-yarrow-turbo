import { r as getSql } from "./db-CLe4g2Rd.mjs";
import { n as compilePolicy, r as evaluateRequirement, t as adversarialProposals } from "./scan-DDCI6OWY.mjs";
import { createHash, generateKeyPairSync, randomBytes, sign, verify } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/service.server-DkVSGcn7.js
function sha256(input) {
	return createHash("sha256").update(input).digest("hex");
}
function canonicalJson(value) {
	if (value === null || typeof value !== "object") return JSON.stringify(value);
	if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
	const obj = value;
	return `{${Object.keys(obj).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(obj[k])}`).join(",")}}`;
}
async function requireUserKeys(userId) {
	const sql = await getSql();
	const existing = await sql`
    select public_pem, private_pem, fingerprint from release_keys where user_id = ${userId}
  `;
	if (existing[0]) return existing[0];
	const { publicKey, privateKey } = generateKeyPairSync("ed25519");
	const publicPem = publicKey.export({
		type: "spki",
		format: "pem"
	}).toString();
	const privatePem = privateKey.export({
		type: "pkcs8",
		format: "pem"
	}).toString();
	const fingerprint = sha256(publicKey.export({
		type: "spki",
		format: "der"
	}));
	await sql`
    insert into release_keys (user_id, public_pem, private_pem, fingerprint)
    values (${userId}, ${publicPem}, ${privatePem}, ${fingerprint})
  `;
	return {
		public_pem: publicPem,
		private_pem: privatePem,
		fingerprint
	};
}
function signCanonical(canonical, privatePem) {
	return sign(null, Buffer.from(canonical), privatePem).toString("base64");
}
function verifyCanonical(canonical, signatureB64, publicPem) {
	try {
		return verify(null, Buffer.from(canonical), publicPem, Buffer.from(signatureB64, "base64"));
	} catch {
		return false;
	}
}
function id(prefix) {
	return `${prefix}_${randomBytes(8).toString("hex")}`;
}
function parseJson(raw) {
	return JSON.parse(raw);
}
function independenceFor(kind, userId, createdBy) {
	if (kind === "formal_proof") return "formal";
	if (kind === "independent_verifier") return userId === createdBy ? "same_team" : "independent";
	if (kind === "human_approval") return userId === createdBy ? "self" : "independent";
	return "self";
}
async function getOverview(userId) {
	const sql = await getSql();
	const [repos] = await sql`select count(*)::int as n from repositories where user_id = ${userId}`;
	const [cands] = await sql`select count(*)::int as n from release_candidates where user_id = ${userId}`;
	const [released] = await sql`select count(*)::int as n from release_candidates where user_id = ${userId} and status = ${"released"}`;
	const [receipts] = await sql`select count(*)::int as n from release_receipts where user_id = ${userId}`;
	const latest = await sql`
    select c.*, r.name as repository_name
    from release_candidates c
    join repositories r on r.id = c.repository_id
    where c.user_id = ${userId}
    order by c.created_at desc
    limit 6
  `;
	return {
		counts: {
			repositories: repos?.n ?? 0,
			candidates: cands?.n ?? 0,
			released: released?.n ?? 0,
			receipts: receipts?.n ?? 0
		},
		latest
	};
}
async function listRepositories(userId) {
	return (await getSql())`
    select id, name, slug, description, created_at
    from repositories
    where user_id = ${userId}
    order by created_at desc
  `;
}
async function createRepository(userId, data) {
	const sql = await getSql();
	const repoId = id("repo");
	const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "repo";
	await sql`
    insert into repositories (id, user_id, name, slug, description)
    values (${repoId}, ${userId}, ${data.name}, ${slug}, ${data.description ?? ""})
  `;
	return {
		id: repoId,
		slug
	};
}
async function listCandidates(userId, repositoryId) {
	const sql = await getSql();
	if (repositoryId) return sql`
      select c.*, r.name as repository_name
      from release_candidates c
      join repositories r on r.id = c.repository_id
      where c.user_id = ${userId} and c.repository_id = ${repositoryId}
      order by c.created_at desc
    `;
	return sql`
    select c.*, r.name as repository_name
    from release_candidates c
    join repositories r on r.id = c.repository_id
    where c.user_id = ${userId}
    order by c.created_at desc
  `;
}
async function createCandidate(userId, data) {
	const sql = await getSql();
	if (!(await sql`
    select id from repositories where id = ${data.repositoryId} and user_id = ${userId}
  `)[0]) throw new Error("Repository not found");
	const prior = await sql`
    select manifest_json from release_candidates
    where user_id = ${userId} and repository_id = ${data.repositoryId}
    order by created_at desc
    limit 1
  `;
	const previousCapabilities = prior[0] ? parseJson(prior[0].manifest_json).capabilities ?? [] : [];
	const policy = compilePolicy({
		intent: data.intent,
		capabilities: data.manifest.capabilities,
		previousCapabilities
	});
	const policyHash = sha256(canonicalJson(policy));
	const candidateId = id("cand");
	const planId = id("plan");
	await sql`
    insert into release_candidates (id, user_id, repository_id, version, artifact_hash, manifest_json, status, risk)
    values (
      ${candidateId}, ${userId}, ${data.repositoryId}, ${data.version},
      ${data.artifactHash.toLowerCase()}, ${JSON.stringify(data.manifest)}, ${"frozen"}, ${policy.risk}
    )
  `;
	await sql`
    insert into gate_plans (id, user_id, candidate_id, policy_hash, compiled_policy_json)
    values (${planId}, ${userId}, ${candidateId}, ${policyHash}, ${JSON.stringify(policy)})
  `;
	return {
		candidateId,
		policyHash,
		risk: policy.risk
	};
}
async function getCandidate(userId, candidateId) {
	const sql = await getSql();
	const candidate = (await sql`
    select * from release_candidates where id = ${candidateId} and user_id = ${userId}
  `)[0];
	if (!candidate) throw new Error("Candidate not found");
	const plan = (await sql`
    select * from gate_plans where candidate_id = ${candidateId} and user_id = ${userId}
  `)[0];
	if (!plan) throw new Error("Frozen policy missing");
	const evidence = await sql`
    select * from evidence_receipts where candidate_id = ${candidateId} and user_id = ${userId}
    order by created_at asc
  `;
	const policy = parseJson(plan.compiled_policy_json);
	const verdicts = policy.requirements.map((requirement) => ({
		requirement,
		...evaluateRequirement(requirement, evidence.map((e) => ({
			evidenceKind: e.evidence_kind,
			outcome: e.outcome,
			independence: e.independence
		})))
	}));
	const receipts = await sql`
    select * from release_receipts where candidate_id = ${candidateId} and user_id = ${userId}
    order by created_at desc
    limit 1
  `;
	return {
		candidate: {
			...candidate,
			manifest_json: parseJson(candidate.manifest_json)
		},
		plan: {
			...plan,
			compiled_policy_json: policy
		},
		evidence,
		verdicts,
		gateReady: verdicts.every((v) => v.status === "pass"),
		receipt: receipts[0] ?? null
	};
}
async function recordEvidence(userId, candidateId, data) {
	const details = await getCandidate(userId, candidateId);
	if (details.candidate.status !== "frozen") throw new Error("Evidence can only be attached to a frozen candidate");
	const requirement = details.plan.compiled_policy_json.requirements.find((r) => r.id === data.requirementId);
	if (!requirement) throw new Error("Requirement is not part of the frozen policy");
	if (!requirement.allowedEvidence.includes(data.evidenceKind)) throw new Error("Evidence kind is not admissible for this obligation");
	if (data.evidenceKind === "formal_proof") throw new Error("Formal proof evidence requires a registered proof-verifier adapter");
	const independence = independenceFor(data.evidenceKind, userId, userId);
	const payload = JSON.stringify(data.payload ?? {});
	const sql = await getSql();
	const evId = id("ev");
	await sql`
    insert into evidence_receipts (
      id, user_id, candidate_id, requirement_id, evidence_kind, outcome, independence, source, payload_json, payload_hash
    ) values (
      ${evId}, ${userId}, ${candidateId}, ${data.requirementId}, ${data.evidenceKind}, ${data.outcome},
      ${independence}, ${data.source}, ${payload}, ${sha256(payload)}
    )
  `;
	return {
		id: evId,
		independence
	};
}
async function proposeAdversarialChecks(userId, candidateId) {
	const details = await getCandidate(userId, candidateId);
	const tests = adversarialProposals(details.plan.compiled_policy_json.requirements.map((r) => r.id));
	return {
		model: "deterministic-catalog",
		provider: "hodgeform-local",
		policyHash: details.plan.policy_hash,
		note: "Model output is a proposal only. It is never release authority.",
		tests
	};
}
async function decideRelease(userId, candidateId, expectedPolicyHash, confirmation) {
	const details = await getCandidate(userId, candidateId);
	if (details.candidate.status !== "frozen") throw new Error("Candidate is no longer frozen");
	if (details.plan.policy_hash !== expectedPolicyHash) throw new Error("Frozen policy hash mismatch");
	if (confirmation !== "I reviewed this exact frozen gate") throw new Error("Confirmation phrase does not match the frozen approval phrase");
	const missing = details.verdicts.filter((v) => v.status !== "pass");
	const verdict = missing.length === 0 ? "RELEASE" : "BLOCK";
	const payload = {
		schema: "hodgeform-release-receipt/1",
		verdict,
		candidate: {
			id: details.candidate.id,
			version: details.candidate.version,
			artifactHash: details.candidate.artifact_hash,
			risk: details.candidate.risk
		},
		policyHash: details.plan.policy_hash,
		unsatisfied: missing.map((v) => ({
			id: v.requirement.id,
			status: v.status
		})),
		invariant: "models_propose_evidence_policy_decides",
		boundary: "Exact configured gate only; never a universal certificate of safety or correctness."
	};
	const canonical = canonicalJson(payload);
	const receiptHash = sha256(canonical);
	const keys = await requireUserKeys(userId);
	const signature = signCanonical(canonical, keys.private_pem);
	const sql = await getSql();
	const receiptId = id("rcpt");
	await sql`
    insert into release_receipts (
      id, user_id, candidate_id, repository_id, version, artifact_hash, verdict,
      receipt_json, receipt_hash, signer_id, signature_b64, public_key_fingerprint
    ) values (
      ${receiptId}, ${userId}, ${candidateId}, ${details.candidate.repository_id},
      ${details.candidate.version}, ${details.candidate.artifact_hash}, ${verdict},
      ${JSON.stringify(payload)}, ${receiptHash}, ${"workspace-release-authority"},
      ${signature}, ${keys.fingerprint}
    )
  `;
	await sql`
    update release_candidates
    set status = ${verdict === "RELEASE" ? "released" : "blocked"}
    where id = ${candidateId} and user_id = ${userId}
  `;
	return {
		verdict,
		receiptHash,
		receiptId
	};
}
async function listReceipts(userId) {
	return (await getSql())`
    select rr.*, r.name as repository_name, r.slug as repository_slug
    from release_receipts rr
    join repositories r on r.id = rr.repository_id
    where rr.user_id = ${userId}
    order by rr.created_at desc
  `;
}
async function listDiscoveries(userId) {
	return (await getSql())`
    select d.*, r.name as repository_name
    from discovery_commits d
    join repositories r on r.id = d.repository_id
    where d.user_id = ${userId}
    order by d.created_at desc
  `;
}
async function createDiscovery(userId, data) {
	const sql = await getSql();
	if (!(await sql`
    select id from repositories where id = ${data.repositoryId} and user_id = ${userId}
  `)[0]) throw new Error("Repository not found");
	const discId = id("disc");
	await sql`
    insert into discovery_commits (id, user_id, repository_id, parent_id, branch, title, claim, status)
    values (
      ${discId}, ${userId}, ${data.repositoryId}, ${data.parentId ?? null},
      ${data.branch}, ${data.title}, ${data.claim}, ${"proposed"}
    )
  `;
	return { id: discId };
}
async function getPublicKey(userId) {
	const keys = await requireUserKeys(userId);
	return {
		publicPem: keys.public_pem,
		fingerprint: keys.fingerprint
	};
}
async function verifyReceiptDocument(userId, document) {
	const keys = await requireUserKeys(userId);
	const canonical = canonicalJson(document.payload);
	if (sha256(canonical) !== document.receiptHash) return {
		ok: false,
		reason: "Receipt hash mismatch"
	};
	if (document.publicKeyFingerprint !== keys.fingerprint) return {
		ok: false,
		reason: "Public-key fingerprint does not match this workspace authority"
	};
	if (!verifyCanonical(canonical, document.signature, keys.public_pem)) return {
		ok: false,
		reason: "Ed25519 signature is invalid"
	};
	const verdict = document.payload?.verdict;
	if (verdict === "BLOCK") return {
		ok: false,
		reason: "Receipt verdict is BLOCK",
		verdict
	};
	return {
		ok: true,
		verdict: verdict ?? "RELEASE"
	};
}
//#endregion
export { createCandidate, createDiscovery, createRepository, decideRelease, getCandidate, getOverview, getPublicKey, listCandidates, listDiscoveries, listReceipts, listRepositories, proposeAdversarialChecks, recordEvidence, verifyReceiptDocument };
