import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TextAreaField, TextField } from "@/components/admin/fields";
import { PieceImages } from "@/components/admin/PieceImages";
import { normalizarImagens, type PieceImage } from "@/lib/mosaico";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/galeria")({
  component: GaleriaPage,
});

type Peca = {
  id: string;
  kind: string;
  client: string;
  caption: string;
  images: PieceImage[];
  published: boolean;
  sort_order: number;
};

/**
 * Lista fechada de propósito: com texto livre o site acaba mostrando "rótulo",
 * "Rótulo" e "ROTULO" como três coisas. Para somar um tipo, basta incluir aqui.
 */
const TIPOS = [
  "Rótulo",
  "Embalagem",
  "Pote",
  "Lata",
  "Garrafa",
  "Sacaria",
  "Cartucho",
  "Caixa",
  "Display",
  "Kit",
];

function GaleriaPage() {
  const [rows, setRows] = useState<Peca[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);
  const [novoTipo, setNovoTipo] = useState(TIPOS[0]);
  const [novoCliente, setNovoCliente] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_pieces")
      .select("*")
      .eq("service", "rotulos")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar as peças.");
      return;
    }
    setRows((data ?? []).map((r) => ({ ...r, images: normalizarImagens(r.images) })) as Peca[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!novoCliente.trim()) {
      toast.error("Informe o cliente.");
      return;
    }
    setCriando(true);
    const nextOrder = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("gallery_pieces")
      .insert({
        kind: novoTipo,
        client: novoCliente.trim(),
        service: "rotulos",
        sort_order: nextOrder,
        published: false,
      })
      .select()
      .single();
    setCriando(false);
    if (error) {
      toast.error("Erro ao criar a peça.");
      return;
    }
    setNovoCliente("");
    toast.success("Peça criada. Agora suba as imagens.");
    await load();
    if (data) setOpenId(data.id);
  }

  async function salvar(row: Peca) {
    setBusyId(row.id);
    const { error } = await supabase
      .from("gallery_pieces")
      .update({
        kind: row.kind,
        client: row.client.trim(),
        caption: row.caption,
        images: row.images,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    setBusyId(null);
    if (error) toast.error("Erro ao salvar.");
    else toast.success("Salvo.");
  }

  async function togglePublish(row: Peca) {
    if (!row.published) {
      if (row.images.length === 0) {
        toast.error("Suba ao menos uma imagem antes de publicar.");
        return;
      }
      if (!row.kind) {
        toast.error("Escolha o tipo do material antes de publicar.");
        return;
      }
    }
    setBusyId(row.id);
    const { error } = await supabase
      .from("gallery_pieces")
      .update({ published: !row.published })
      .eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao alterar.");
      return;
    }
    load();
  }

  async function mover(row: Peca, d: -1 | 1) {
    const i = rows.findIndex((r) => r.id === row.id);
    const alvo = rows[i + d];
    if (!alvo) return;
    setBusyId(row.id);
    const res = await Promise.all([
      supabase.from("gallery_pieces").update({ sort_order: alvo.sort_order }).eq("id", row.id),
      supabase.from("gallery_pieces").update({ sort_order: row.sort_order }).eq("id", alvo.id),
    ]);
    setBusyId(null);
    if (res.some((r) => r.error)) {
      toast.error("Erro ao reordenar.");
      return;
    }
    load();
  }

  async function remover(row: Peca) {
    if (!confirm(`Excluir a peça de ${row.client}?`)) return;
    setBusyId(row.id);
    const { error } = await supabase.from("gallery_pieces").delete().eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao excluir.");
      return;
    }
    load();
  }

  function edit(id: string, patch: Partial<Peca>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const noAr = rows.filter((r) => r.published).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">
        Galeria — Rótulos e Embalagens
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Cada peça tem uma ficha — tipo do material, cliente e uma legenda — e um conjunto de
        imagens. A primeira imagem é a capa e define o formato da peça no mosaico; as outras viram
        carrossel. A página recompõe o mosaico sozinha a cada peça publicada.
      </p>

      <form
        onSubmit={add}
        className="mt-8 flex flex-col gap-3 border border-border bg-background p-4 md:flex-row md:items-end"
      >
        <div className="md:w-48">
          <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Tipo
          </label>
          <select
            value={novoTipo}
            onChange={(e) => setNovoTipo(e.target.value)}
            className="mt-1 h-9 w-full border border-input bg-background px-3 text-sm"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Cliente
          </label>
          <Input
            value={novoCliente}
            onChange={(e) => setNovoCliente(e.target.value)}
            placeholder="Black Erva"
          />
        </div>
        <Button type="submit" disabled={criando}>
          {criando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Criar peça
        </Button>
      </form>

      <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
        {rows.length} peça(s) · {noAr} no ar
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            Nenhuma peça ainda.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((row, i) => {
              const aberto = openId === row.id;
              const capa = row.images[0];
              return (
                <li key={row.id} className="border border-border bg-background">
                  <div className="flex flex-wrap items-center gap-3 p-3">
                    <div className="h-16 w-20 shrink-0 overflow-hidden bg-muted">
                      {capa ? (
                        <img src={capa.url} alt="" className="h-full w-full object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-wider text-muted-foreground">
                          sem imagem
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-lg font-semibold tracking-[-0.02em]">
                        {row.kind || "Sem tipo"}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span>{row.client || "sem cliente"}</span>
                        <span aria-hidden>·</span>
                        <span className="tabular-nums">
                          {row.images.length} {row.images.length === 1 ? "imagem" : "imagens"}
                        </span>
                        {!row.caption && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="text-destructive">sem legenda</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Switch
                        checked={row.published}
                        onCheckedChange={() => togglePublish(row)}
                        title="Visível no site"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Subir"
                        disabled={i === 0 || busyId === row.id}
                        onClick={() => mover(row, -1)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Descer"
                        disabled={i === rows.length - 1 || busyId === row.id}
                        onClick={() => mover(row, 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={aberto ? "Fechar" : "Editar"}
                        onClick={() => setOpenId(aberto ? null : row.id)}
                      >
                        {aberto ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Excluir"
                        disabled={busyId === row.id}
                        onClick={() => remover(row)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {aberto && (
                    <div className="flex flex-col gap-5 border-t border-border p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Tipo do material
                          </span>
                          <select
                            value={row.kind}
                            onChange={(e) => edit(row.id, { kind: e.target.value })}
                            className="h-9 w-full border border-input bg-background px-3 text-sm"
                          >
                            <option value="">— escolher —</option>
                            {TIPOS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>

                        <TextField
                          label="Cliente"
                          value={row.client}
                          onChange={(v) => edit(row.id, { client: v })}
                          placeholder="Black Erva"
                        />
                      </div>

                      <TextAreaField
                        label="Legenda"
                        value={row.caption}
                        onChange={(v) => edit(row.id, { caption: v })}
                        rows={2}
                        hint="Uma ou duas linhas: o que essa embalagem resolveu."
                      />

                      <PieceImages
                        value={row.images}
                        onChange={(images) => edit(row.id, { images })}
                        folder="galeria/pecas"
                      />

                      <div>
                        <Button disabled={busyId === row.id} onClick={() => salvar(row)}>
                          {busyId === row.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          Salvar
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
