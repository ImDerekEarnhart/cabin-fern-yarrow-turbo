import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileCheck2 } from "lucide-react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
          callbackURL: "/overview",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/overview",
        });
        if (err) throw new Error(err.message);
      }
      window.location.href = "/overview";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg border border-border-strong bg-bg-elevated">
            <FileCheck2 className="size-4" />
          </span>
          <span>
            <strong className="block text-sm">HodgeForm</strong>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Release authority</span>
          </span>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to the gate</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Release decisions require an authenticated operator. Models never sign receipts.
        </p>
        {authEnabled ? (
          <div className="mt-6 space-y-3">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => void signIn(p.providerId, { callbackURL: "/overview" })}
              >
                Continue with {p.label}
              </Button>
            ))}
            <div className="flex items-center gap-3 py-2 text-[11px] uppercase tracking-[0.16em] text-subtle">
              <span className="h-px flex-1 bg-border" />
              or email
              <span className="h-px flex-1 bg-border" />
            </div>
            <form onSubmit={(e) => void onEmail(e)} className="space-y-3">
              {mode === "signup" && (
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              )}
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@company.com"
              />
              <Input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {error && (
                <div className="rounded-lg border border-red-800/40 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Working…" : mode === "signup" ? "Create operator account" : "Sign in with email"}
              </Button>
            </form>
            <button
              type="button"
              className="w-full text-center text-xs text-muted hover:text-fg"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            >
              {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Create one"}
            </button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
        )}
      </div>
    </main>
  );
}
