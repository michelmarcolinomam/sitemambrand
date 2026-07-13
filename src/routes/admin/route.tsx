import { useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth, ADMIN_EMAIL } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  // Painel é privado: não deve ser indexado por buscadores.
  head: () => ({
    meta: [
      { title: "Painel — MAM Branding" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, isAdmin, session } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return <LoginScreen loggedInWrongUser={!!session} />;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}

function LoginScreen({ loggedInWrongUser }: { loggedInWrongUser: boolean }) {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error("E-mail ou senha incorretos.");
      return;
    }
    // O useAdminAuth reage à mudança de sessão e troca a tela sozinho.
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6 font-sans text-foreground antialiased">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-2xl font-semibold tracking-[-0.02em]">
            MAM · Painel
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesso restrito à administração do site.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 border border-border bg-background p-6 shadow-sm"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </Button>

          {loggedInWrongUser && (
            <p className="text-center text-xs text-muted-foreground">
              Você está logado com uma conta sem permissão.{" "}
              <button
                type="button"
                className="underline"
                onClick={() => supabase.auth.signOut()}
              >
                Sair
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
