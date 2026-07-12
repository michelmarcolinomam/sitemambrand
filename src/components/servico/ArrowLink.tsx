import type { ReactNode } from "react";

/**
 * Link/CTA com seta e sublinhado mint que “varre” da esquerda no hover.
 * `variant="pill"` para a CTA sólida (near-black), `variant="ghost"` sobre fundo escuro.
 */
export function ArrowLink({
  href,
  children,
  variant = "underline",
  size = "md",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "underline" | "pill" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const text =
    size === "lg" ? "text-base md:text-lg" : size === "sm" ? "text-sm" : "text-sm md:text-base";

  if (variant === "pill") {
    return (
      <a
        href={href}
        className={`group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 font-medium text-background transition-transform duration-300 hover:-translate-y-0.5 ${text} ${className ?? ""}`}
      >
        {children}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </a>
    );
  }

  const base = variant === "ghost" ? "text-background" : "text-foreground";
  const underline = variant === "ghost" ? "bg-background" : "bg-mint-ink";

  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 font-medium ${base} ${text} ${className ?? ""}`}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 ${underline}`}
        />
        <span
          aria-hidden
          className={`absolute -bottom-1 left-0 h-px w-full origin-left opacity-30 ${underline}`}
        />
      </span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
        →
      </span>
    </a>
  );
}
