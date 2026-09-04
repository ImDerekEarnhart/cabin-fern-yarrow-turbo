import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, LockKeyhole, Plus, ShieldAlert } from "lucide-react";
import { RequireUser } from "@/components/require-user";
import { Page, Card, CardHeader, Empty } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Status, Hash } from "@/components/status";
import { CAPABILITIES, type Capability } from "@/lib/gate/types";
import { APPROVAL_PHRASE } from "@/lib/gate/policy";
import { recommendPack, scanSource } from "@/lib/gate/scan";
import { sha256Hex } from "@/lib/hash-client";
import {
  createCandidate,
  getCandidate,
  listCandidates,
  listRepositories,
  proposeAdversarialChecks,
  recordEvidence,
  decideRelease,
} from "@/lib/gate/api";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/gates")({
  component: () => (
    <RequireUser>
      <Gates />
    </RequireUser>
  ),
});

function Gates() {
  const candidates = useAsync(() => listCandidates({ data: {} }));
  const repos = useAsync(() => listRepositories());
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <Page
      eyebrow="Semantic change control"
      title="Gates"
      description="Freeze an exact AI artifact. HodgeForm compiles capability changes into evidence obligations and refuses release until the frozen policy is satisfied."
      actions={
        <Button onClick={() => setShowNew(!showNew)}>
          <Plus className="size-4" />
          New candidate
        </Button>
      }
    >
      {showNew && (
        <NewCandidate
          repos={repos.data ?? []}
          onCreated={async (id) => {
            setShowNew(false);
            setSelected(id);
            await candidates.reload();
          }}
        />
      )}
      {candidates.error && <ErrorBox text={candidates.error} />}
      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <Card>
          <CardHeader
            title="Release candidates"
            meta={<span className="text-xs text-muted">{candidates.data?.length ?? 0}</span>}
          />
          <div className="max-h-[72dvh] divide-y divide-border overflow-y-auto">
            {candidates.data?.length ? (
              candidates.data.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c.id)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-bg-subtle ${selected === c.id ? "bg-bg-subtle" : ""}`}
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {c.repository_name} · {c.version}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Hash value={c.artifact_hash} />
                      <span className="text-[11px] text-muted">{c.risk}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Status value={c.status} />
                    <ChevronRight className="size-3 text-subtle" />
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4">
                <Empty
                  title="No frozen candidates"
                  text="Create an exact artifact candidate and HodgeForm will compile its release obligations."
                />
              </div>
            )}
          </div>
        </Card>
        {selected ? (
          <CandidateInspector candidateId={selected} onChanged={candidates.reload} />
        ) : (
          <Card className="grid min-h-96 place-items-center p-8">
            <div className="max-w-md text-center">
              <LockKeyhole className="mx-auto size-8 text-subtle" />
              <h2 className="mt-4 text-lg font-semibold">Select a gate</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Inspect the immutable policy lock, semantic capability diff, admissible evidence, and release decision.
              </p>
            </div>
          </Card>
        )}
      </div>
    </Page>
  );
}

function NewCandidate({
  repos,
  onCreated,
}: {
  repos: Awaited<ReturnType<typeof listRepositories>>;
  onCreated: (id: string) => Promise<void>;
}) {
  const [repoId, setRepoId] = useState(repos[0]?.id ?? "");
  const [version, setVersion] = useState("v1");
  const [name, setName] = useState("Customer support agent");
  const [framework, setFramework] = useState("MCP / custom");
  const [source, setSource] = useState(
    'fetch("https://api.example.com/tickets");\n',
  );
  const [hash, setHash] = useState("");
  const [pack, setPack] = useState("auto");
  const [dataClass, setDataClass] = useState("internal");
  const [caps, setCaps] = useState<Capability[]>(["network.outbound"]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!repoId && repos[0]?.id) setRepoId(repos[0].id);
  }, [repos, repoId]);

  async function hashSource() {
    const digest = await sha256Hex(source);
    setHash(digest);
    const detected = scanSource(source);
    if (detected.length) setCaps(detected);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const recommended = recommendPack(caps);
      const resolvedPack = pack === "auto" ? recommended : pack;
      const result = await createCandidate({
        data: {
          repositoryId: repoId,
          version,
          artifactHash: hash,
          manifest: { name, framework, capabilities: caps },
          intent: { pack: resolvedPack as never, dataClass: dataClass as never },
        },
      });
      await onCreated(result.candidateId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to freeze candidate");
    } finally {
      setBusy(false);
    }
  }

  if (!repos.length) {
    return (
      <Card className="mb-6 p-5">
        <p className="text-sm text-muted">Create a repository before freezing a release candidate.</p>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader title="Freeze release candidate">
        <p className="mt-1 text-xs text-muted">
          The gate policy is compiled server-side once and content-hashed before evidence collection starts.
        </p>
      </CardHeader>
      <form onSubmit={(e) => void submit(e)} className="grid gap-4 p-4 lg:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs text-muted">Repository</span>
          <Select value={repoId} onChange={(e) => setRepoId(e.target.value)}>
            {repos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted">Version</span>
          <Input value={version} onChange={(e) => setVersion(e.target.value)} required />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted">Agent name</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted">Framework</span>
          <Input value={framework} onChange={(e) => setFramework(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted">Policy pack</span>
          <Select value={pack} onChange={(e) => setPack(e.target.value)}>
            <option value="auto">Auto (recommended from authority)</option>
            <option value="basic">Basic</option>
            <option value="networked">Networked agent</option>
            <option value="code-execution">Code execution</option>
            <option value="action-taking">Action taking</option>
            <option value="high-risk">High risk</option>
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted">Data class</span>
          <Select value={dataClass} onChange={(e) => setDataClass(e.target.value)}>
            <option value="public">Public</option>
            <option value="internal">Internal</option>
            <option value="confidential">Confidential</option>
            <option value="regulated">Regulated</option>
          </Select>
        </label>
        <label className="space-y-1 lg:col-span-2">
          <span className="text-xs text-muted">Artifact source (hashed locally — bytes never leave this browser until you freeze)</span>
          <Textarea value={source} onChange={(e) => setSource(e.target.value)} className="font-mono text-xs" />
          <Button type="button" variant="secondary" size="sm" onClick={() => void hashSource()}>
            Hash source and detect capabilities
          </Button>
        </label>
        <div className="lg:col-span-2">
          <div className="mb-2 text-xs text-muted">Capabilities</div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <label key={cap} className="flex h-11 items-center gap-2 rounded-lg border border-border bg-bg px-3 text-xs">
                <input
                  type="checkbox"
                  checked={caps.includes(cap)}
                  onChange={(e) => setCaps(e.target.checked ? [...caps, cap] : caps.filter((c) => c !== cap))}
                />
                <span className="font-mono">{cap}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-muted">Artifact SHA-256</span>
          </div>
          <Input
            value={hash}
            onChange={(e) => setHash(e.target.value.trim())}
            pattern="[a-fA-F0-9]{64}"
            required
            placeholder="64-hex SHA-256 of the exact artifact bytes"
          />
        </div>
        {error && (
          <div className="lg:col-span-2">
            <ErrorBox text={error} />
          </div>
        )}
        <div className="lg:col-span-2">
          <Button disabled={busy}>{busy ? "Freezing…" : "Compile and freeze gate"}</Button>
        </div>
      </form>
    </Card>
  );
}

function CandidateInspector({ candidateId, onChanged }: { candidateId: string; onChanged: () => Promise<void> }) {
  const details = useAsync(() => getCandidate({ data: { candidateId } }), [candidateId]);
  const [requirementId, setRequirementId] = useState("");
  const [kind, setKind] = useState("deterministic_test");
  const [outcome, setOutcome] = useState("pass");
  const [source, setSource] = useState("ci.verifier");
  const [payload, setPayload] = useState('{"note":"Attach exact test output, digest, or verifier result here."}');
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [redTeam, setRedTeam] = useState<{
    model: string;
    provider: string;
    policyHash: string;
    tests: Array<{ requirementId: string; title: string; testIdea: string; failureSignal: string }>;
  } | null>(null);

  const firstMissing = useMemo(
    () =>
      details.data?.verdicts?.find((v) => v.status !== "pass")?.requirement?.id ??
      details.data?.verdicts?.[0]?.requirement?.id ??
      "",
    [details.data],
  );
  useEffect(() => {
    setRequirementId(firstMissing);
  }, [firstMissing]);
  const requirement = details.data?.verdicts?.find((v) => v.requirement.id === requirementId)?.requirement;
  useEffect(() => {
    if (requirement?.allowedEvidence?.length && !requirement.allowedEvidence.includes(kind as never)) {
      setKind(requirement.allowedEvidence[0]);
    }
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

  async function addEvidence(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await recordEvidence({
        data: {
          candidateId,
          requirementId,
          evidenceKind: kind as never,
          outcome: outcome as never,
          source,
          payload: JSON.parse(payload || "{}") as Record<string, unknown>,
        },
      });
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
      await decideRelease({
        data: {
          candidateId,
          expectedPolicyHash: details.data!.plan.policy_hash,
          confirmation,
        },
      });
      setConfirmation("");
      await details.reload();
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decision failed");
    } finally {
      setBusy(false);
    }
  }

  if (details.loading || !details.data) return <Card className="p-6 text-sm text-muted">Loading frozen gate…</Card>;
  if (details.error) return <ErrorBox text={details.error} />;
  const d = details.data;
  const p = d.plan.compiled_policy_json;
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-4 p-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.13em] text-subtle">Proposal-only red team</div>
            <p className="mt-2 text-sm text-muted">
              HodgeForm can propose falsification tests against this exact frozen policy. Suggestions are never release
              authority.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => void suggestTests()} disabled={busy}>
            Propose tests
          </Button>
        </div>
        {redTeam && (
          <div className="border-t border-border p-4">
            <div className="mb-3 text-xs text-muted">
              {redTeam.model} · {redTeam.provider} · policy <Hash value={redTeam.policyHash} />
            </div>
            <div className="space-y-2">
              {redTeam.tests.map((t) => (
                <div key={t.requirementId} className="rounded-lg border border-border bg-bg p-3">
                  <div className="text-xs font-medium">
                    {t.requirementId} · {t.title}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted">{t.testIdea}</p>
                  <p className="mt-1 text-[11px] text-red-300">Failure signal: {t.failureSignal}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      <Card>
        <CardHeader title={`${d.candidate.manifest_json.name} · ${d.candidate.version}`} meta={<Status value={d.candidate.status} />} />
        <div className="grid gap-4 p-4 md:grid-cols-3">
          <Metric label="Artifact" value={<Hash value={d.candidate.artifact_hash} chars={16} />} />
          <Metric label="Frozen policy" value={<Hash value={d.plan.policy_hash} chars={16} />} />
          <Metric label="Risk" value={<span className="capitalize">{d.candidate.risk}</span>} />
        </div>
        {p.addedCapabilities?.length > 0 && (
          <div className="border-t border-border bg-amber-500/5 px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <ShieldAlert className="size-4" />
              Semantic authority expanded
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.addedCapabilities.map((c) => (
                <code key={c} className="rounded bg-bg px-2 py-1 font-mono text-[11px] text-amber-200">
                  + {c}
                </code>
              ))}
            </div>
          </div>
        )}
      </Card>
      <Card>
        <CardHeader
          title="Compiled evidence obligations"
          meta={
            <span className="text-xs text-muted">
              {d.verdicts.filter((v) => v.status === "pass").length}/{d.verdicts.length} satisfied
            </span>
          }
        />
        <div className="divide-y divide-border">
          {d.verdicts.map((v) => (
            <div key={v.requirement.id} className="grid gap-2 px-4 py-3 md:grid-cols-[110px_1fr_auto] md:items-center">
              <div className="font-mono text-[11px] text-muted">{v.requirement.id}</div>
              <div>
                <div className="text-sm">{v.requirement.title}</div>
                <div className="mt-1 text-xs leading-5 text-muted">{v.requirement.reason}</div>
                <div className="mt-1 font-mono text-[10px] text-subtle">
                  admissible: {v.requirement.allowedEvidence.join(", ")} · min independence:{" "}
                  {v.requirement.minimumIndependence}
                </div>
              </div>
              <Status value={v.status} />
            </div>
          ))}
        </div>
      </Card>
      {d.candidate.status === "frozen" && (
        <Card>
          <CardHeader title="Attach evidence">
            <p className="mt-1 text-xs text-muted">
              Evidence is typed, scoped, hashed, and append-only. LLM PASS results never satisfy a blocking obligation
              alone.
            </p>
          </CardHeader>
          <form onSubmit={(e) => void addEvidence(e)} className="grid gap-3 p-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs text-muted">Requirement</span>
              <Select value={requirementId} onChange={(e) => setRequirementId(e.target.value)}>
                {d.verdicts.map((v) => (
                  <option key={v.requirement.id} value={v.requirement.id}>
                    {v.requirement.id} · {v.requirement.title}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted">Evidence kind</span>
              <Select value={kind} onChange={(e) => setKind(e.target.value)}>
                {(requirement?.allowedEvidence ?? []).map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted">Outcome</span>
              <Select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                <option value="pass">pass</option>
                <option value="fail">fail</option>
                <option value="inconclusive">inconclusive</option>
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted">Verifier source</span>
              <Input value={source} onChange={(e) => setSource(e.target.value)} required />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-xs text-muted">Evidence payload (JSON)</span>
              <Textarea value={payload} onChange={(e) => setPayload(e.target.value)} className="font-mono text-xs" />
            </label>
            <div className="md:col-span-2">
              <Button variant="secondary" disabled={busy}>
                Record evidence receipt
              </Button>
            </div>
          </form>
        </Card>
      )}
      {d.evidence.length > 0 && (
        <Card>
          <CardHeader title="Evidence ledger" />
          <div className="divide-y divide-border">
            {d.evidence.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted">{e.requirement_id}</span>
                    <span className="text-xs">{e.evidence_kind}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-subtle">
                    {e.source} · {e.independence} · <Hash value={e.payload_hash} />
                  </div>
                </div>
                <Status value={e.outcome} />
              </div>
            ))}
          </div>
        </Card>
      )}
      {d.candidate.status === "frozen" && (
        <Card>
          <CardHeader title="Request release decision">
            <p className="mt-1 text-xs text-muted">
              This freezes the evidence snapshot. Missing or failed obligations produce a signed BLOCK receipt;
              satisfied gates produce RELEASE.
            </p>
          </CardHeader>
          <div className="space-y-3 p-4">
            <div
              className={`rounded-lg border p-3 text-sm ${d.gateReady ? "border-emerald-800/50 bg-emerald-500/5 text-emerald-200" : "border-amber-800/50 bg-amber-500/5 text-amber-200"}`}
            >
              {d.gateReady ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  All configured obligations currently satisfied.
                </span>
              ) : (
                <span>
                  {d.verdicts.filter((v) => v.status !== "pass").length} obligation(s) are still missing or failed.
                  Requesting a decision now will produce BLOCK.
                </span>
              )}
            </div>
            <Input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder={APPROVAL_PHRASE} />
            {error && <ErrorBox text={error} />}
            <Button onClick={() => void decide()} disabled={busy || confirmation !== APPROVAL_PHRASE}>
              {busy ? "Deciding…" : "Sign release decision"}
            </Button>
          </div>
        </Card>
      )}
      {d.receipt && (
        <Card>
          <CardHeader title="Signed release receipt" meta={<Status value={d.receipt.verdict} />} />
          <div className="grid gap-3 p-4 md:grid-cols-2">
            <Metric label="Receipt hash" value={<Hash value={d.receipt.receipt_hash} chars={20} />} />
            <Metric label="Signer" value={<span>{d.receipt.signer_id}</span>} />
            <Metric label="Public-key fingerprint" value={<Hash value={d.receipt.public_key_fingerprint} chars={20} />} />
            <Metric
              label="Boundary"
              value={<span className="text-xs text-muted">Exact configured gate only; never universal safety.</span>}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.13em] text-subtle">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

function ErrorBox({ text }: { text: string }) {
  return <div className="rounded-lg border border-red-800/40 bg-red-500/10 p-3 text-sm text-red-300">{text}</div>;
}
