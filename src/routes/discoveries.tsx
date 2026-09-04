import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RequireUser } from "@/components/require-user";
import { Page, Card, Empty } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Status } from "@/components/status";
import { createDiscovery, listDiscoveries, listRepositories } from "@/lib/gate/api";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/discoveries")({
  component: () => (
    <RequireUser>
      <Discoveries />
    </RequireUser>
  ),
});

function Discoveries() {
  const discoveries = useAsync(() => listDiscoveries());
  const repos = useAsync(() => listRepositories());
  const [repositoryId, setRepositoryId] = useState("");
  const [branch, setBranch] = useState("main");
  const [title, setTitle] = useState("");
  const [claim, setClaim] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createDiscovery({
        data: { repositoryId: repositoryId || repos.data?.[0]?.id || "", branch, title, claim },
      });
      setTitle("");
      setClaim("");
      await discoveries.reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page
      eyebrow="Machine-generated knowledge"
      title="Discoveries"
      description="The same primitives can version claims: branch them, challenge them, and bind them to exact evidence."
    >
      <Card className="mb-6 p-4">
        <form onSubmit={(e) => void submit(e)} className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs text-muted">Repository</span>
            <Select value={repositoryId} onChange={(e) => setRepositoryId(e.target.value)}>
              <option value="">Select repository</option>
              {(repos.data ?? []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="space-y-1">
            <span className="text-xs text-muted">Branch</span>
            <Input value={branch} onChange={(e) => setBranch(e.target.value)} required />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs text-muted">Title</span>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs text-muted">Claim</span>
            <Textarea value={claim} onChange={(e) => setClaim(e.target.value)} required />
          </label>
          <div>
            <Button disabled={busy || !(repositoryId || repos.data?.[0])}>Commit discovery</Button>
          </div>
        </form>
      </Card>
      {discoveries.data?.length ? (
        <div className="space-y-3">
          {discoveries.data.map((d) => (
            <Card key={d.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">{d.title}</div>
                <Status value={d.status} />
              </div>
              <div className="mt-1 text-xs text-muted">
                {d.repository_name} · {d.branch}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{d.claim}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Empty title="No discoveries yet" text="Record a claim bound to a repository. Promotion still requires a gate." />
      )}
    </Page>
  );
}
