import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function RequireUser({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <div className="grid min-h-[50vh] place-items-center p-8">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-bg-subtle" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <>{children}</>;
}
