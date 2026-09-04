
export const CAPABILITIES = [
  "network.outbound",
  "filesystem.read",
  "filesystem.write",
  "shell.execute",
  "database.read",
  "database.write",
  "external_action.send_message",
  "external_action.email",
  "payment.execute",
  "secrets.read",
  "data.pii",
  "data.phi",
] as const;
export type Capability = (typeof CAPABILITIES)[number];
export type Risk = "low" | "medium" | "high" | "critical";
export type EvidenceKind = "deterministic_test" | "sandbox_run" | "static_analysis" | "llm_evaluation" | "independent_verifier" | "formal_proof" | "human_approval";
export type Independence = "self" | "same_team" | "independent" | "formal";
export type Outcome = "pass" | "fail" | "inconclusive";

export type Requirement = {
  id: string;
  title: string;
  reason: string;
  allowedEvidence: EvidenceKind[];
  minimumIndependence: Independence;
  blocking: boolean;
  source: "baseline" | "pack" | "capability" | "semantic_diff" | "organization";
};

export type PolicyIntent = {
  pack: "basic" | "networked" | "code-execution" | "action-taking" | "high-risk";
  dataClass: "public" | "internal" | "confidential" | "regulated";
  separateApprover?: boolean;
};

export type AgentManifest = {
  name: string;
  framework?: string;
  description?: string;
  artifactUri?: string;
  capabilities: Capability[];
  metadata?: Record<string, string>;
};

export type CompiledPolicy = {
  schema: "hodgeform-gate-policy/1";
  pack: PolicyIntent["pack"];
  packVersion: number;
  organizationPacks: PolicyIntent["pack"][];
  risk: Risk;
  dataClass: PolicyIntent["dataClass"];
  capabilities: Capability[];
  addedCapabilities: Capability[];
  requirements: Requirement[];
  approval: { required: boolean; separateFromCreator: boolean; phrase: string };
  invariant: "models_propose_evidence_policy_decides";
};

export type EvidenceInput = {
  requirementId: string;
  evidenceKind: EvidenceKind;
  outcome: Outcome;
  source: string;
  payload: Record<string, unknown>;
};
