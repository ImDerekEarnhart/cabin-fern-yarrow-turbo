import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Boxes, FileCheck2, GitBranch, LayoutDashboard, ReceiptText, ShieldCheck, Users } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/gates", label: "Gates", icon: ShieldCheck },
  { to: "/repositories", label: "Repositories", icon: Boxes },
  { to: "/discoveries", label: "Discoveries", icon: GitBranch },
  { to: "/receipts", label: "Receipts", icon: ReceiptText },
  { to: "/workspace", label: "Workspace", icon: Users },
] as const;

const BARE = new Set(["/", "/login", "/verify"]);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isPending } = useCurrentUserState();
  if (BARE.has(pathname)) return <>{children}</>;
  return (
    <div className="min-h-dvh bg-bg text-fg md:flex">
      <aside className="border-b border-border bg-bg/95 md:sticky md:top-0 md:flex md:h-dvh md:w-60 md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5 md:block">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg border border-border-strong bg-bg-elevated">
              <FileCheck2 className="size-4" />
            </span>
            <span>
              <strong className="block text-sm tracking-tight">HodgeForm</strong>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Trust Compiler</span>
            </span>
          </Link>
          <div className="hidden font-mono text-[9px] uppercase tracking-[0.15em] text-accent md:mt-4 md:block">
            Models propose · policy decides
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm transition",
                  active ? "bg-bg-subtle text-fg" : "text-muted hover:bg-bg-elevated hover:text-fg",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-border p-4 md:block">
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-bg-subtle" />
          ) : (
            <>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Link to="/login" className="text-xs text-muted">
                  Sign in
                </Link>
              </SignedOut>
            </>
          )}
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
