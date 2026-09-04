import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { CAPABILITIES } from "./types";

const repoSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});
const intentSchema = z.object({
  pack: z.enum(["basic", "networked", "code-execution", "action-taking", "high-risk"]),
  dataClass: z.enum(["public", "internal", "confidential", "regulated"]),
  separateApprover: z.boolean().optional(),
});
const manifestSchema = z.object({
  name: z.string().min(1).max(120),
  framework: z.string().max(80).optional(),
  description: z.string().max(1000).optional(),
  artifactUri: z.string().max(500).optional(),
  capabilities: z.array(z.enum(CAPABILITIES)).max(30),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const getOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => (await import("./service.server")).getOverview(context.userId));

export const listRepositories = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => (await import("./service.server")).listRepositories(context.userId));

export const listCandidates = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { repositoryId?: string } = {}) => ({
    repositoryId: input?.repositoryId?.slice(0, 100),
  }))
  .handler(async ({ data, context }) =>
    (await import("./service.server")).listCandidates(context.userId, data.repositoryId),
  );

export const listReceipts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => (await import("./service.server")).listReceipts(context.userId));

export const listDiscoveries = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => (await import("./service.server")).listDiscoveries(context.userId));

export const createRepository = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => repoSchema.parse(input))
  .handler(async ({ data, context }) =>
    (await import("./service.server")).createRepository(context.userId, data),
  );

export const createCandidate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        repositoryId: z.string().min(1).max(100),
        version: z.string().min(1).max(80),
        artifactHash: z.string().regex(/^[a-fA-F0-9]{64}$/),
        manifest: manifestSchema,
        intent: intentSchema,
      })
      .parse(input),
  )
  .handler(async ({ data, context }) =>
    (await import("./service.server")).createCandidate(context.userId, data),
  );

export const proposeAdversarialChecks = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ candidateId: z.string().min(1).max(100) }).parse(input))
  .handler(async ({ data, context }) =>
    (await import("./service.server")).proposeAdversarialChecks(context.userId, data.candidateId),
  );

export const getCandidate = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ candidateId: z.string().min(1).max(100) }).parse(input))
  .handler(async ({ data, context }) =>
    (await import("./service.server")).getCandidate(context.userId, data.candidateId),
  );

export const recordEvidence = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        candidateId: z.string().min(1).max(100),
        requirementId: z.string().min(1).max(80),
        evidenceKind: z.enum([
          "deterministic_test",
          "sandbox_run",
          "static_analysis",
          "llm_evaluation",
          "independent_verifier",
          "formal_proof",
          "human_approval",
        ]),
        outcome: z.enum(["pass", "fail", "inconclusive"]),
        source: z.string().min(1).max(160),
        payload: z.record(z.string(), z.unknown()).default({}),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) =>
    (await import("./service.server")).recordEvidence(context.userId, data.candidateId, data),
  );

export const decideRelease = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        candidateId: z.string().min(1).max(100),
        expectedPolicyHash: z.string().regex(/^[a-fA-F0-9]{64}$/),
        confirmation: z.string().max(100),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) =>
    (await import("./service.server")).decideRelease(
      context.userId,
      data.candidateId,
      data.expectedPolicyHash,
      data.confirmation,
    ),
  );

export const createDiscovery = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        repositoryId: z.string().min(1).max(100),
        parentId: z.string().max(100).optional(),
        branch: z.string().min(1).max(80),
        title: z.string().min(1).max(160),
        claim: z.string().min(1).max(6000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) =>
    (await import("./service.server")).createDiscovery(context.userId, data),
  );

export const getReleaseAuthority = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => (await import("./service.server")).getPublicKey(context.userId));

export const verifyReceipt = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        payload: z.unknown(),
        receiptHash: z.string().min(16),
        signature: z.string().min(16),
        publicKeyFingerprint: z.string().min(16),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) =>
    (await import("./service.server")).verifyReceiptDocument(context.userId, data),
  );
