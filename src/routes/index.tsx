import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileCheck2, GitCommitHorizontal, LockKeyhole, ShieldCheck } from "lucide-react";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { isPending } = useCurrentUserState();
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg border border-border-strong bg-bg-elevated">
            <FileCheck2 className="size-4" />
          </span>
          <span>
            <strong className="block text-sm tracking-tight">HodgeForm</strong>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Trust compiler</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/verify" className="hidden text-muted hover:text-fg sm:inline">
            Verify a receipt
          </Link>
          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-bg-subtle" />
          ) : (
            <>
              <SignedOut>
                <Link
                  to="/login"
                  className="inline-flex h-11 items-center rounded-lg border border-border px-4 text-sm hover:bg-bg-elevated"
                >
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/overview"
                  className="inline-flex h-11 items-center rounded-lg bg-fg px-4 text-sm font-medium text-bg"
                >
                  Open workspace
                </Link>
              </SignedIn>
            </>
          )}
        </div>
      </header>

      <section className="mt-16 max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Release authority for AI</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.05]">
          When an AI system changes, what evidence must exist before that change is trusted?
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted">
          Git tells you what changed. HodgeForm compiles the authority in the exact artifact into a frozen
          gate, admits only typed evidence, and emits a signed RELEASE or BLOCK receipt that CI can verify
          without trusting this dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SignedIn>
            <Link
              to="/gates"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-5 text-sm font-medium text-bg"
            >
              Open Gates <ArrowRight className="size-4" />
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              to="/login"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-5 text-sm font-medium text-bg"
            >
              Enter the gate <ArrowRight className="size-4" />
            </Link>
          </SignedOut>
          <Link
            to="/verify"
            className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm hover:bg-bg-elevated"
          >
            Verify a receipt
          </Link>
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-border bg-bg-elevated p-5 font-mono text-xs leading-6 text-muted md:p-8">
        <div className="text-accent">exact artifact</div>
        <div>→ semantic capability diff</div>
        <div>→ frozen gate policy</div>
        <div>→ admissible evidence</div>
        <div>→ human approval</div>
        <div className="text-fg">→ signed RELEASE / BLOCK receipt</div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: GitCommitHorizontal,
            title: "Bound to exact bytes",
            text: "A candidate is frozen to a SHA-256 digest. HodgeForm never invents the hash.",
          },
          {
            icon: LockKeyhole,
            title: "Policy decides",
            text: "An LLM may propose tests or find a counterexample. An LLM pass cannot satisfy a blocking obligation.",
          },
          {
            icon: ShieldCheck,
            title: "Offline-verifiable",
            text: "Receipts are Ed25519-signed. CI checks the signature against a separately pinned public key.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-xl border border-border bg-bg-elevated p-5">
            <Icon className="size-5 text-accent" />
            <h2 className="mt-4 text-sm font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </article>
        ))}
      </section>

      <p className="mt-16 max-w-2xl text-xs leading-5 text-subtle">
        A HodgeForm receipt records satisfaction of a declared gate at a declared scope. It is not a
        universal certificate of safety, compliance, or correctness.
      </p>
    </main>
  );
}
