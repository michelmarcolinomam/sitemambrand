import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "@/lib/admin-auth";

/** Moldura das telas internas do painel: topo com navegação e sair. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/admin", label: "Cases", exact: true },
    { to: "/admin/projetos", label: "Carrossel", exact: false },
    { to: "/admin/contatos", label: "Contatos", exact: false },
    { to: "/admin/diagnostico", label: "Diagnóstico", exact: false },
  ];

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-muted/30 font-sans text-foreground antialiased">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg font-semibold tracking-[-0.02em]">
              MAM · Painel
            </span>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive(n.to, n.exact)
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {ADMIN_EMAIL}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Navegação mobile */}
        <nav className="flex items-center gap-1 border-t border-border px-4 py-2 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive(n.to, n.exact)
                  ? "bg-foreground text-background"
                  : "text-muted-foreground"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8 md:py-12">{children}</main>
    </div>
  );
}
