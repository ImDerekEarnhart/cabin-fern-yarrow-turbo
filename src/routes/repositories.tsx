import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RequireUser } from "@/components/require-user";
import { Page, Card, Empty } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createRepository, listRepositories } from "@/lib/gate/api";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/repositories")({
  component: () => (
    <RequireUser>
      <Repositories />
    </RequireUser>
  ),
});

function Repositories() {
  const list = useAsync(() => listRepositories());
  const [name, setName] = useState("support-agent");
  const [description, setDescription] = useState("Production customer-support agent");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await createRepository({ data: { name, description } });
      await list.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create repository");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page
      eyebrow="Artifact inventory"
      title="Repositories"
      description="A repository holds versions of an AI artifact and the discovery commits made about it."
    >
      <Card className="mb-6 p-4">
        <form onSubmit={(e) => void submit(e)} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="space-y-1">
            <span className="text-xs text-muted">Name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-muted">Description</span>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-11 py-2" />
          </label>
          <Button disabled={busy}>{busy ? "Creating…" : "Create repository"}</Button>
        </form>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </Card>
      {list.data?.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {list.data.map((repo) => (
            <Card key={repo.id} className="p-4">
              <div className="text-sm font-medium">{repo.name}</div>
              <div className="mt-1 font-mono text-[11px] text-muted">{repo.slug}</div>
              <p className="mt-3 text-sm leading-6 text-muted">{repo.description || "No description"}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Empty title="No repositories" text="Create a repository to freeze release candidates against." />
      )}
    </Page>
  );
}
