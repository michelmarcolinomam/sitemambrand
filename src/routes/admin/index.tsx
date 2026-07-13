import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: CasesListPage,
});

type CaseRow = {
  id: string;
  slug: string;
  title: string;
  year: string;
  category: string;
  published: boolean;
  sort_order: number;
  cover_url: string | null;
};

function CasesListPage() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeService, setActiveService] = useState<"branding" | "rebranding">(
    "branding",
  );

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("cases")
      .select("id, slug, title, year, category, published, sort_order, cover_url")
      .eq("service", activeService)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar os cases.");
      return;
    }
    setCases(data ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeService]);

  async function togglePublish(row: CaseRow) {
    setBusyId(row.id);
    const { error } = await supabase
      .from("cases")
      .update({ published: !row.published })
      .eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao alterar publicação.");
      return;
    }
    toast.success(row.published ? "Case despublicado." : "Case publicado.");
    load();
  }

  async function move(row: CaseRow, direction: -1 | 1) {
    const index = cases.findIndex((c) => c.id === row.id);
    const target = cases[index + direction];
    if (!target) return;
    setBusyId(row.id);
    // Troca os sort_order dos dois cases.
    const results = await Promise.all([
      supabase.from("cases").update({ sort_order: target.sort_order }).eq("id", row.id),
      supabase.from("cases").update({ sort_order: row.sort_order }).eq("id", target.id),
    ]);
    setBusyId(null);
    if (results.some((r) => r.error)) {
      toast.error("Erro ao reordenar.");
      return;
    }
    load();
  }

  async function remove(row: CaseRow) {
    setBusyId(row.id);
    const { error } = await supabase.from("cases").delete().eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao excluir o case.");
      return;
    }
    toast.success("Case excluído.");
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">
            Cases do portfólio
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cada serviço tem seu próprio portfólio. Escolha o serviço abaixo para
            ver e cadastrar os cases que aparecem naquela tela.
          </p>
        </div>
        <Button asChild>
          <Link
            to="/admin/cases/$id"
            params={{ id: "novo" }}
            search={{ service: activeService }}
          >
            <Plus className="h-4 w-4" />
            Novo case
          </Link>
        </Button>
      </div>

      {/* Abas de serviço — cada tela de serviço tem seu portfólio separado. */}
      <div className="mt-6 inline-flex gap-1 border border-border bg-background p-1">
        {(["branding", "rebranding"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActiveService(s)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              activeService === s
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "branding" ? "Branding" : "Rebranding"}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : cases.length === 0 ? (
          <div className="border border-dashed border-border py-20 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum case ainda. Crie o primeiro.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-border border border-border bg-background">
            {cases.map((c, i) => (
              <li key={c.id} className="flex items-center gap-4 p-4">
                <div className="hidden h-16 w-14 shrink-0 overflow-hidden bg-mint sm:block">
                  {c.cover_url ? (
                    <img src={c.cover_url} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-display text-lg font-semibold">
                      {c.title}
                    </span>
                    {c.published ? (
                      <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-mint-ink">
                        No ar
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Rascunho
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    /cases/{c.slug} · {c.category || "sem categoria"} · {c.year || "—"}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Subir"
                    disabled={i === 0 || busyId === c.id}
                    onClick={() => move(c, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Descer"
                    disabled={i === cases.length - 1 || busyId === c.id}
                    onClick={() => move(c, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title={c.published ? "Despublicar" : "Publicar"}
                    disabled={busyId === c.id}
                    onClick={() => togglePublish(c)}
                  >
                    {c.published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  {c.published && (
                    <Button variant="ghost" size="icon" title="Ver página" asChild>
                      <a href={`/cases/${c.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" title="Editar" asChild>
                    <Link to="/admin/cases/$id" params={{ id: c.id }}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Excluir">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir “{c.title}”?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A página e todo o conteúdo deste case serão removidos. As
                          imagens permanecem no armazenamento. Esta ação não pode ser
                          desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(c)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
