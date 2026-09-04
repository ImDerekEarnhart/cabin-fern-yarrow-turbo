import { createFileRoute } from "@tanstack/react-router";
import { RequireUser } from "@/components/require-user";
import { Page, Card, CardHeader } from "@/components/page";
import { Hash } from "@/components/status";
import { getReleaseAuthority } from "@/lib/gate/api";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/workspace")({
  component: () => (
    <RequireUser>
      <Workspace />
    </RequireUser>
  ),
});

function Workspace() {
  const user = useCurrentUser();
  const keys = useAsync(() => getReleaseAuthority());
  return (
    <Page
      eyebrow="Operator identity"
      title="Workspace"
      description="This preview workspace is operator-owned. Receipts are signed with a workspace Ed25519 key generated on first use. Pin the fingerprint in CI separately from this dashboard."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.13em] text-subtle">Operator</div>
          <div className="mt-3 text-sm">{user?.displayName ?? "Signed-in operator"}</div>
          <div className="mt-1 text-xs text-muted">{user?.primaryEmail ?? user?.id}</div>
        </Card>
        <Card className="p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.13em] text-subtle">Release authority</div>
          <div className="mt-3 text-sm">Ed25519 workspace signer</div>
          <div className="mt-1 text-xs text-muted">
            Fingerprint {keys.data ? <Hash value={keys.data.fingerprint} chars={20} /> : "generating…"}
          </div>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader title="Pinned public key" />
        <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-5 text-muted">
          {keys.data?.publicPem ?? "Loading signing material…"}
        </pre>
      </Card>
      <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">
        CI tokens must never be able to perform human release approval. Record evidence from automation; decide
        releases here.
      </p>
    </Page>
  );
}
