import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { uploadSiteImage } from "@/components/admin/fields";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/galeria")({
  component: GaleriaPage,
});

type Size = "auto" | "larga" | "grande";

type Peca = {
  id: string;
  image_url: string;
  alt: string;
  size: Size;
  client: string;
  published: boolean;
  sort_order: number;
};

/** Serviços com mosaico próprio. Somar aqui quando /logos ou /sites existirem. */
const SERVICES = [{ key: "rotulos", label: "Rótulos e Embalagens" }];

const TAMANHOS: { key: Size; label: string; dica: string }[] = [
  { key: "auto", label: "Normal", dica: "O sistema encaixa" },
  { key: "larga", label: "Larga", dica: "Ocupa 2 colunas" },
  { key: "grande", label: "Grande", dica: "Ocupa 2 × 2" },
];

function GaleriaPage() {
  const [rows, setRows] = useState<Peca[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<{ feitas: number; total: number } | null>(null);
  const [service] = useState(SERVICES[0].key);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_pieces")
      .select("*")
      .eq("service", service)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar as peças.");
      return;
    }
    setRows((data ?? []) as Peca[]);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  /** Sobe em lote: as imagens entram no fim do mosaico, na ordem escolhida. */
  async function subirLote(files: FileList | null) {
    if (!files || files.length === 0) return;
    const lista = Array.from(files);
    setUploading({ feitas: 0, total: lista.length });

    let ordem = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
    const novas: { image_url: string; service: string; sort_order: number }[] = [];
    let falhas = 0;

    // Sequencial: o Storage engasga com muitos uploads simultâneos.
    for (let i = 0; i < lista.length; i++) {
      try {
        const url = await uploadSiteImage(lista[i], "galeria/pecas");
        novas.push({ image_url: url, service, sort_order: ordem++ });
      } catch {
        falhas += 1;
      }
      setUploading({ feitas: i + 1, total: lista.length });
    }

    if (novas.length) {
      const { error } = await supabase.from("gallery_pieces").insert(novas);
      if (error) toast.error("As imagens subiram, mas falhou ao gravar no banco.");
      else toast.success(`${novas.length} peça(s) no mosaico.`);
    }
    if (falhas) toast.error(`${falhas} imagem(ns) falharam no envio.`);

    setUploading(null);
    if (inputRef.current) inputRef.current.value = "";
    load();
  }

  async function trocarTamanho(row: Peca, size: Size) {
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, size } : r)));
    const { error } = await supabase
      .from("gallery_pieces")
      .update({ size, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) {
      toast.error("Erro ao mudar o tamanho.");
      load();
    }
  }

  async function salvarTexto(row: Peca) {
    setBusyId(row.id);
    const { error } = await supabase
      .from("gallery_pieces")
      .update({ alt: row.alt, client: row.client, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    setBusyId(null);
    if (error) toast.error("Erro ao salvar.");
    else toast.success("Salvo.");
  }

  async function togglePublish(row: Peca) {
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

  async function mover(row: Peca, direcao: -1 | 1) {
    const i = rows.findIndex((r) => r.id === row.id);
    const alvo = rows[i + direcao];
    if (!alvo) return;
    setBusyId(row.id);
    const results = await Promise.all([
      supabase.from("gallery_pieces").update({ sort_order: alvo.sort_order }).eq("id", row.id),
      supabase.from("gallery_pieces").update({ sort_order: row.sort_order }).eq("id", alvo.id),
    ]);
    setBusyId(null);
    if (results.some((r) => r.error)) {
      toast.error("Erro ao reordenar.");
      return;
    }
    load();
  }

  async function remover(row: Peca) {
    if (!confirm("Tirar esta peça do mosaico?")) return;
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

  const publicadas = rows.filter((r) => r.published).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">
        Galeria — Rótulos e Embalagens
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        O mosaico de <code className="text-foreground">/rotulos-e-embalagens</code>. Uma peça é uma
        imagem — sem projeto e sem ficha. Suba quantas quiser de uma vez; elas entram no fim e você
        reordena aqui.
      </p>

      <div className="mt-8 flex flex-col gap-3 border border-border bg-background p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => subirLote(e.target.files)}
          />
          <Button disabled={uploading !== null} onClick={() => inputRef.current?.click()}>
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {uploading ? `Enviando ${uploading.feitas} de ${uploading.total}…` : "Subir imagens"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Dá para selecionar várias de uma vez.
          </p>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
          {rows.length} peça(s) · {publicadas} no ar
        </span>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            O mosaico está vazio. Suba as primeiras imagens acima.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row, i) => (
              <li key={row.id} className="flex gap-3 border border-border bg-background p-3">
                <div className="h-28 w-24 shrink-0 overflow-hidden bg-muted">
                  <img src={row.image_url} alt={row.alt} className="h-full w-full object-cover" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="inline-flex border border-border">
                    {TAMANHOS.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        title={t.dica}
                        onClick={() => trocarTamanho(row, t.key)}
                        className={`flex-1 px-2 py-1 text-xs transition-colors ${
                          row.size === t.key
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <Input
                    value={row.alt}
                    placeholder="Descrição da imagem"
                    onChange={(e) => edit(row.id, { alt: e.target.value })}
                    onBlur={() => salvarTexto(row)}
                    className="h-8 text-xs"
                  />
                  <Input
                    value={row.client}
                    placeholder="Cliente (só seu — não aparece no site)"
                    onChange={(e) => edit(row.id, { client: e.target.value })}
                    onBlur={() => salvarTexto(row)}
                    className="h-8 text-xs"
                  />

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Mover para trás"
                        disabled={i === 0 || busyId === row.id}
                        onClick={() => mover(row, -1)}
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Mover para frente"
                        disabled={i === rows.length - 1 || busyId === row.id}
                        onClick={() => mover(row, 1)}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={row.published}
                        onCheckedChange={() => togglePublish(row)}
                        title="Visível no site"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Excluir"
                        disabled={busyId === row.id}
                        onClick={() => remover(row)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
