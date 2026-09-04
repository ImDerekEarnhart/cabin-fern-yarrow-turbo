import { randomBytes } from "node:crypto";
import { getSql } from "@/lib/db";
import { compilePolicy, evaluateRequirement } from "./policy";
import { adversarialProposals } from "./scan";
import { canonicalJson, requireUserKeys, sha256, signCanonical, verifyCanonical } from "./crypto.server";
import type {
  AgentManifest,
  Capability,
  CompiledPolicy,
  EvidenceKind,
  Independence,
  Outcome,
  PolicyIntent,
} from "./types";

function id(prefix: string) {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

function parseJson<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

type RepoRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
};

type CandidateRow = {
  id: string;
  repository_id: string;
  version: string;
  artifact_hash: string;
  manifest_json: string;
  status: string;
  risk: string;
  created_at: string;
};

type PlanRow = {
  id: string;
  candidate_id: string;
  policy_hash: string;
  compiled_policy_json: string;
};

type EvidenceRow = {
  id: string;
  candidate_id: string;
  requirement_id: string;
  evidence_kind: string;
  outcome: string;
  independence: string;
  source: string;
  payload_json: string;
  payload_hash: string;
  created_at: string;
};

type ReceiptRow = {
  id: string;
  candidate_id: string;
  repository_id: string;
  version: string;
  artifact_hash: string;
  verdict: string;
  receipt_json: string;
  receipt_hash: string;
  signer_id: string;
  signature_b64: string;
  public_key_fingerprint: string;
  created_at: string;
};

function independenceFor(kind: EvidenceKind, userId: string, createdBy: string): Independence {
  if (kind === "formal_proof") return "formal";
  if (kind === "independent_verifier") return userId === createdBy ? "same_team" : "independent";
  if (kind === "human_approval") return userId === createdBy ? "self" : "independent";
  return "self";
}

export async function getOverview(userId: string) {
  const sql = await getSql();
  const [repos] = await sql<{ n: number }>`select count(*)::int as n from repositories where user_id = ${userId}`;
  const [cands] = await sql<{ n: number }>`select count(*)::int as n from release_candidates where user_id = ${userId}`;
  const [released] = await sql<{ n: number }>`select count(*)::int as n from release_candidates where user_id = ${userId} and status = ${"released"}`;
  const [receipts] = await sql<{ n: number }>`select count(*)::int as n from release_receipts where user_id = ${userId}`;
  const latest = await sql<CandidateRow & { repository_name: string }>`
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
      receipts: receipts?.n ?? 0,
    },
    latest,
  };
}

export async function listRepositories(userId: string) {
  const sql = await getSql();
  return sql<RepoRow>`
    select id, name, slug, description, created_at
    from repositories
    where user_id = ${userId}
    order by created_at desc
  `;
}

export async function createRepository(userId: string, data: { name: string; description?: string }) {
  const sql = await getSql();
  const repoId = id("repo");
  const slug =
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "repo";
  await sql`
    insert into repositories (id, user_id, name, slug, description)
    values (${repoId}, ${userId}, ${data.name}, ${slug}, ${data.description ?? ""})
  `;
  return { id: repoId, slug };
}

export async function listCandidates(userId: string, repositoryId?: string) {
  const sql = await getSql();
  if (repositoryId) {
    return sql<CandidateRow & { repository_name: string }>`
      select c.*, r.name as repository_name
      from release_candidates c
      join repositories r on r.id = c.repository_id
      where c.user_id = ${userId} and c.repository_id = ${repositoryId}
      order by c.created_at desc
    `;
  }
  return sql<CandidateRow & { repository_name: string }>`
    select c.*, r.name as repository_name
    from release_candidates c
    join repositories r on r.id = c.repository_id
    where c.user_id = ${userId}
    order by c.created_at desc
  `;
}

export async function createCandidate(
  userId: string,
  data: {
    repositoryId: string;
    version: string;
    artifactHash: string;
    manifest: AgentManifest;
    intent: PolicyIntent;
  },
) {
  const sql = await getSql();
  const repos = await sql<{ id: string }>`
    select id from repositories where id = ${data.repositoryId} and user_id = ${userId}
  `;
  if (!repos[0]) throw new Error("Repository not found");
  const prior = await sql<{ manifest_json: string }>`
    select manifest_json from release_candidates
    where user_id = ${userId} and repository_id = ${data.repositoryId}
    order by created_at desc
    limit 1
  `;
  const previousCapabilities = prior[0]
    ? (parseJson<AgentManifest>(prior[0].manifest_json).capabilities ?? [])
    : [];
  const policy = compilePolicy({
    intent: data.intent,
    capabilities: data.manifest.capabilities,
    previousCapabilities,
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
  return { candidateId, policyHash, risk: policy.risk };
}

export async function getCandidate(userId: string, candidateId: string) {
  const sql = await getSql();
  const candidates = await sql<CandidateRow>`
    select * from release_candidates where id = ${candidateId} and user_id = ${userId}
  `;
  const candidate = candidates[0];
  if (!candidate) throw new Error("Candidate not found");
  const plans = await sql<PlanRow>`
    select * from gate_plans where candidate_id = ${candidateId} and user_id = ${userId}
  `;
  const plan = plans[0];
  if (!plan) throw new Error("Frozen policy missing");
  const evidence = await sql<EvidenceRow>`
    select * from evidence_receipts where candidate_id = ${candidateId} and user_id = ${userId}
    order by created_at asc
  `;
  const policy = parseJson<CompiledPolicy>(plan.compiled_policy_json);
  const verdicts = policy.requirements.map((requirement) => ({
    requirement,
    ...evaluateRequirement(
      requirement,
      evidence.map((e) => ({
        evidenceKind: e.evidence_kind,
        outcome: e.outcome,
        independence: e.independence as Independence,
      })),
    ),
  }));
  const receipts = await sql<ReceiptRow>`
    select * from release_receipts where candidate_id = ${candidateId} and user_id = ${userId}
    order by created_at desc
    limit 1
  `;
  return {
    candidate: { ...candidate, manifest_json: parseJson<AgentManifest>(candidate.manifest_json) },
    plan: { ...plan, compiled_policy_json: policy },
    evidence,
    verdicts,
    gateReady: verdicts.every((v) => v.status === "pass"),
    receipt: receipts[0] ?? null,
  };
}

export type CandidateDetails = Awaited<ReturnType<typeof getCandidate>>;

export async function recordEvidence(
  userId: string,
  candidateId: string,
  data: {
    requirementId: string;
    evidenceKind: EvidenceKind;
    outcome: Outcome;
    source: string;
    payload: Record<string, unknown>;
  },
) {
  const details = await getCandidate(userId, candidateId);
  if (details.candidate.status !== "frozen") throw new Error("Evidence can only be attached to a frozen candidate");
  const requirement = details.plan.compiled_policy_json.requirements.find((r) => r.id === data.requirementId);
  if (!requirement) throw new Error("Requirement is not part of the frozen policy");
  if (!requirement.allowedEvidence.includes(data.evidenceKind)) {
    throw new Error("Evidence kind is not admissible for this obligation");
  }
  if (data.evidenceKind === "formal_proof") {
    throw new Error("Formal proof evidence requires a registered proof-verifier adapter");
  }
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
  return { id: evId, independence };
}

export async function proposeAdversarialChecks(userId: string, candidateId: string) {
  const details = await getCandidate(userId, candidateId);
  const tests = adversarialProposals(details.plan.compiled_policy_json.requirements.map((r) => r.id));
  return {
    model: "deterministic-catalog",
    provider: "hodgeform-local",
    policyHash: details.plan.policy_hash,
    note: "Model output is a proposal only. It is never release authority.",
    tests,
  };
}

export async function decideRelease(
  userId: string,
  candidateId: string,
  expectedPolicyHash: string,
  confirmation: string,
) {
  const details = await getCandidate(userId, candidateId);
  if (details.candidate.status !== "frozen") throw new Error("Candidate is no longer frozen");
  if (details.plan.policy_hash !== expectedPolicyHash) throw new Error("Frozen policy hash mismatch");
  if (confirmation !== "I reviewed this exact frozen gate") {
    throw new Error("Confirmation phrase does not match the frozen approval phrase");
  }
  const missing = details.verdicts.filter((v) => v.status !== "pass");
  const verdict = missing.length === 0 ? "RELEASE" : "BLOCK";
  const payload = {
    schema: "hodgeform-release-receipt/1",
    verdict,
    candidate: {
      id: details.candidate.id,
      version: details.candidate.version,
      artifactHash: details.candidate.artifact_hash,
      risk: details.candidate.risk,
    },
    policyHash: details.plan.policy_hash,
    unsatisfied: missing.map((v) => ({ id: v.requirement.id, status: v.status })),
    invariant: "models_propose_evidence_policy_decides",
    boundary: "Exact configured gate only; never a universal certificate of safety or correctness.",
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
  return { verdict, receiptHash, receiptId };
}

export async function listReceipts(userId: string) {
  const sql = await getSql();
  return sql<ReceiptRow & { repository_name: string; repository_slug: string }>`
    select rr.*, r.name as repository_name, r.slug as repository_slug
    from release_receipts rr
    join repositories r on r.id = rr.repository_id
    where rr.user_id = ${userId}
    order by rr.created_at desc
  `;
}

export async function listDiscoveries(userId: string) {
  const sql = await getSql();
  return sql<{
    id: string;
    repository_id: string;
    parent_id: string | null;
    branch: string;
    title: string;
    claim: string;
    status: string;
    created_at: string;
    repository_name: string;
  }>`
    select d.*, r.name as repository_name
    from discovery_commits d
    join repositories r on r.id = d.repository_id
    where d.user_id = ${userId}
    order by d.created_at desc
  `;
}

export async function createDiscovery(
  userId: string,
  data: { repositoryId: string; parentId?: string; branch: string; title: string; claim: string },
) {
  const sql = await getSql();
  const repos = await sql<{ id: string }>`
    select id from repositories where id = ${data.repositoryId} and user_id = ${userId}
  `;
  if (!repos[0]) throw new Error("Repository not found");
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

export async function getPublicKey(userId: string) {
  const keys = await requireUserKeys(userId);
  return { publicPem: keys.public_pem, fingerprint: keys.fingerprint };
}

export async function verifyReceiptDocument(
  userId: string,
  document: {
    payload: unknown;
    receiptHash: string;
    signature: string;
    publicKeyFingerprint: string;
  },
) {
  const keys = await requireUserKeys(userId);
  const canonical = canonicalJson(document.payload);
  const hash = sha256(canonical);
  if (hash !== document.receiptHash) return { ok: false, reason: "Receipt hash mismatch" };
  if (document.publicKeyFingerprint !== keys.fingerprint) {
    return { ok: false, reason: "Public-key fingerprint does not match this workspace authority" };
  }
  if (!verifyCanonical(canonical, document.signature, keys.public_pem)) {
    return { ok: false, reason: "Ed25519 signature is invalid" };
  }
  const verdict = (document.payload as { verdict?: string })?.verdict;
  if (verdict === "BLOCK") return { ok: false, reason: "Receipt verdict is BLOCK", verdict };
  return { ok: true, verdict: verdict ?? "RELEASE" };
}
