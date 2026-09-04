import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-50",
        size === "sm" ? "h-9 px-3 text-xs" : "h-11 px-4 text-sm",
        variant === "primary"
          ? "bg-fg text-bg hover:opacity-90"
          : "border border-border bg-bg text-fg hover:bg-bg-subtle",
        className,
      )}
      {...props}
    />
  );
}
