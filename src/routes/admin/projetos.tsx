import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/projetos")({
  component: ProjetosPage,
});

type Projeto = {
  id: string;
  title: string;
  year: string;
  category: string;
  published: boolean;
  sort_order: number;
};

function ProjetosPage() {
  const [rows, setRows] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [novo, setNovo] = useState({ title: "", year: "", category: "" });

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar os projetos.");
      return;
    }
    setRows(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!novo.title.trim()) {
      toast.error("Informe ao menos o nome do projeto.");
      return;
    }
    setCreating(true);
    const nextOrder = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
    const { error } = await supabase.from("portfolio_projects").insert({
      title: novo.title.trim(),
      year: novo.year.trim(),
      category: novo.category.trim(),
      sort_order: nextOrder,
    });
    setCreating(false);
    if (error) {
      toast.error("Erro ao adicionar.");
      return;
    }
    setNovo({ title: "", year: "", category: "" });
    toast.success("Projeto adicionado.");
    load();
  }

  async function saveRow(row: Projeto) {
    setBusyId(row.id);
    const { error } = await supabase
      .from("portfolio_projects")
      .update({ title: row.title, year: row.year, category: row.category })
      .eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao salvar.");
      return;
    }
    toast.success("Salvo.");
  }

  async function togglePublish(row: Projeto) {
    setBusyId(row.id);
    const { error } = await supabase
      .from("portfolio_projects")
      .update({ published: !row.published })
      .eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao alterar.");
      return;
    }
    load();
  }

  async function move(row: Projeto, direction: -1 | 1) {
    const index = rows.findIndex((r) => r.id === row.id);
    const target = rows[index + direction];
    if (!target) return;
    setBusyId(row.id);
    const results = await Promise.all([
      supabase
        .from("portfolio_projects")
        .update({ sort_order: target.sort_order })
        .eq("id", row.id),
      supabase
        .from("portfolio_projects")
        .update({ sort_order: row.sort_order })
        .eq("id", target.id),
    ]);
    setBusyId(null);
    if (results.some((r) => r.error)) {
      toast.error("Erro ao reordenar.");
      return;
    }
    load();
  }

  async function remove(row: Projeto) {
    setBusyId(row.id);
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao excluir.");
      return;
    }
    load();
  }

  function edit(id: string, patch: Partial<Projeto>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">
        Carrossel “Mais projetos”
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        A faixa de projetos que passa na tela de Serviços / Branding. São itens
        simples (nome, ano, categoria) — sem página própria. Para um projeto com
        página completa, use a aba Cases.
      </p>

      {/* Adicionar */}
      <form
        onSubmit={add}
        className="mt-8 flex flex-col gap-3 border border-border bg-background p-4 md:flex-row md:items-end"
      >
        <div className="flex-1">
          <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Nome
          </label>
          <Input
            value={novo.title}
            onChange={(e) => setNovo({ ...novo, title: e.target.value })}
            placeholder="Cliente A"
          />
        </div>
        <div className="w-full md:w-28">
          <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Ano
          </label>
          <Input
            value={novo.year}
            onChange={(e) => setNovo({ ...novo, year: e.target.value })}
            placeholder="2023"
          />
        </div>
        <div className="flex-1">
          <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Categoria
          </label>
          <Input
            value={novo.category}
            onChange={(e) => setNovo({ ...novo, category: e.target.value })}
            placeholder="Alimentos · Branding"
          />
        </div>
        <Button type="submit" disabled={creating}>
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Adicionar
        </Button>
      </form>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            Nenhum projeto no carrossel ainda.
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-border border border-border bg-background">
            {rows.map((row, i) => (
              <li key={row.id} className="flex flex-wrap items-end gap-3 p-4">
                <div className="flex flex-1 flex-wrap gap-3">
                  <Input
                    className="flex-1"
                    value={row.title}
                    onChange={(e) => edit(row.id, { title: e.target.value })}
                  />
                  <Input
                    className="w-24"
                    value={row.year}
                    onChange={(e) => edit(row.id, { year: e.target.value })}
                  />
                  <Input
                    className="flex-1"
                    value={row.category}
                    onChange={(e) => edit(row.id, { category: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <div className="mr-1 flex items-center gap-1.5" title="Visível no site">
                    <Switch
                      checked={row.published}
                      onCheckedChange={() => togglePublish(row)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Subir"
                    disabled={i === 0 || busyId === row.id}
                    onClick={() => move(row, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Descer"
                    disabled={i === rows.length - 1 || busyId === row.id}
                    onClick={() => move(row, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Salvar alterações"
                    disabled={busyId === row.id}
                    onClick={() => saveRow(row)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Excluir"
                    disabled={busyId === row.id}
                    onClick={() => remove(row)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
