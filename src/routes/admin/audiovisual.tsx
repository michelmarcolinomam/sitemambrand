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
import { ImageField, TextAreaField, TextField } from "@/components/admin/fields";
import { VideoField } from "@/components/admin/VideoField";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/audiovisual")({
  component: AudiovisualPage,
});

type Section = "conteudo" | "filme";
type Format = "vertical" | "horizontal";

type Video = {
  id: string;
  client: string;
  objective: string;
  channel: string;
  format: Format;
  duration: string;
  video_url: string | null;
  youtube_id: string | null;
  cover_url: string | null;
  cover_alt: string;
  preview_seconds: number;
  section: Section;
  published: boolean;
  sort_order: number;
};

const SECTIONS: { key: Section; label: string; hint: string }[] = [
  {
    key: "conteudo",
    label: "Conteúdo de marca",
    hint: "Peças verticais de ritmo curto — Reels e Stories.",
  },
  {
    key: "filme",
    label: "Filme e campanha",
    hint: "Vídeos de argumento: apresentação, bastidor e mídia paga.",
  },
];

/**
 * Aceita a URL inteira do YouTube (watch, youtu.be, shorts, embed) e devolve só
 * o código do vídeo — ninguém precisa caçar o ID no meio do endereço.
 */
function extractYoutubeId(input: string): string {
  const v = input.trim();
  if (!v) return "";
  if (!/[/?.]/.test(v)) return v; // já é o ID puro
  const m = v.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : v;
}

function AudiovisualPage() {
  const [rows, setRows] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [novo, setNovo] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [section, setSection] = useState<Section>("conteudo");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("section", section)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar os vídeos.");
      return;
    }
    setRows((data ?? []) as Video[]);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!novo.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    setCreating(true);
    const nextOrder = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("videos")
      .insert({
        client: novo.trim(),
        section,
        sort_order: nextOrder,
        format: section === "filme" ? "horizontal" : "vertical",
      })
      .select()
      .single();
    setCreating(false);
    if (error) {
      toast.error("Erro ao adicionar.");
      return;
    }
    setNovo("");
    toast.success("Vídeo criado. Preencha os dados abaixo.");
    await load();
    if (data) setOpenId(data.id);
  }

  async function saveRow(row: Video) {
    if (!row.client.trim()) {
      toast.error("O cliente não pode ficar vazio.");
      return;
    }
    setBusyId(row.id);
    const youtubeId = row.youtube_id ? extractYoutubeId(row.youtube_id) : null;
    const { error } = await supabase
      .from("videos")
      .update({
        client: row.client.trim(),
        objective: row.objective,
        channel: row.channel,
        format: row.format,
        duration: row.duration,
        video_url: row.video_url,
        youtube_id: youtubeId || null,
        cover_url: row.cover_url,
        cover_alt: row.cover_alt,
        preview_seconds: row.preview_seconds,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao salvar.");
      return;
    }
    // reflete na tela o ID já extraído da URL colada
    if (youtubeId !== row.youtube_id) edit(row.id, { youtube_id: youtubeId || null });
    toast.success("Salvo.");
  }

  async function togglePublish(row: Video) {
    if (!row.published && !row.video_url && !row.youtube_id) {
      toast.error("Envie o vídeo antes de publicar.");
      return;
    }
    setBusyId(row.id);
    const { error } = await supabase
      .from("videos")
      .update({ published: !row.published })
      .eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao alterar.");
      return;
    }
    load();
  }

  async function move(row: Video, direction: -1 | 1) {
    const index = rows.findIndex((r) => r.id === row.id);
    const target = rows[index + direction];
    if (!target) return;
    setBusyId(row.id);
    const results = await Promise.all([
      supabase.from("videos").update({ sort_order: target.sort_order }).eq("id", row.id),
      supabase.from("videos").update({ sort_order: row.sort_order }).eq("id", target.id),
    ]);
    setBusyId(null);
    if (results.some((r) => r.error)) {
      toast.error("Erro ao reordenar.");
      return;
    }
    load();
  }

  async function remove(row: Video) {
    if (!confirm(`Excluir "${row.client}"? Isso não pode ser desfeito.`)) return;
    setBusyId(row.id);
    const { error } = await supabase.from("videos").delete().eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao excluir.");
      return;
    }
    toast.success("Excluído.");
    load();
  }

  function edit(id: string, patch: Partial<Video>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const activeHint = SECTIONS.find((s) => s.key === section)?.hint;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">Audiovisual</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        As peças de vídeo da página <code className="text-foreground">/audiovisual</code>. Cada
        vídeo tem uma capa (a imagem parada) e o arquivo em si. O card da página toca os primeiros
        segundos sem som; no clique, abre o vídeo inteiro.
      </p>

      {/* Seções da página pública */}
      <div className="mt-6 inline-flex gap-1 border border-border bg-background p-1">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => {
              setSection(s.key);
              setOpenId(null);
            }}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              section === s.key
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {activeHint && <p className="mt-3 text-sm text-muted-foreground">{activeHint}</p>}

      {/* Adicionar */}
      <form
        onSubmit={add}
        className="mt-8 flex flex-col gap-3 border border-border bg-background p-4 md:flex-row md:items-end"
      >
        <div className="flex-1">
          <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Cliente
          </label>
          <Input
            value={novo}
            onChange={(e) => setNovo(e.target.value)}
            placeholder="Canan Home Decor"
          />
        </div>
        <Button type="submit" disabled={creating}>
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Adicionar vídeo
        </Button>
      </form>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            Nenhum vídeo nesta seção ainda.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((row, i) => {
              const open = openId === row.id;
              return (
                <li key={row.id} className="border border-border bg-background">
                  {/* Cabeçalho compacto */}
                  <div className="flex flex-wrap items-center gap-3 p-3">
                    <div className="h-16 w-12 shrink-0 overflow-hidden bg-muted">
                      {row.cover_url ? (
                        <img src={row.cover_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-wider text-muted-foreground">
                          sem capa
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-lg font-semibold tracking-[-0.02em]">
                        {row.client || "Sem nome"}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span>{row.channel || "sem canal"}</span>
                        <span aria-hidden>·</span>
                        <span>{row.format === "vertical" ? "9:16" : "16:9"}</span>
                        {row.duration && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="tabular-nums">{row.duration}</span>
                          </>
                        )}
                        {!row.video_url && !row.youtube_id && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="text-destructive">sem vídeo</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="mr-1 flex items-center" title="Visível no site">
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
                        title={open ? "Fechar" : "Editar"}
                        onClick={() => setOpenId(open ? null : row.id)}
                      >
                        {open ? (
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
                        onClick={() => remove(row)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* Edição */}
                  {open && (
                    <div className="grid gap-6 border-t border-border p-4 md:grid-cols-2">
                      <div className="flex flex-col gap-4">
                        <VideoField
                          label="Vídeo"
                          value={row.video_url ?? ""}
                          onChange={(url) => edit(row.id, { video_url: url || null })}
                          folder="audiovisual/videos"
                          format={row.format}
                        />
                        <ImageField
                          label="Capa"
                          value={{ url: row.cover_url ?? "", alt: row.cover_alt }}
                          onChange={(v) =>
                            edit(row.id, { cover_url: v.url || null, cover_alt: v.alt })
                          }
                          folder="audiovisual/capas"
                          aspect={row.format === "vertical" ? "aspect-[9/16]" : "aspect-video"}
                          spec={
                            row.format === "vertical"
                              ? "1080 × 1920 px · 9:16"
                              : "1920 × 1080 px · 16:9"
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-4">
                        <TextField
                          label="Cliente"
                          value={row.client}
                          onChange={(v) => edit(row.id, { client: v })}
                          placeholder="Canan Home Decor"
                        />
                        <TextAreaField
                          label="Objetivo"
                          value={row.objective}
                          onChange={(v) => edit(row.id, { objective: v })}
                          rows={3}
                          hint="Uma ou duas linhas: o que esse vídeo tinha que resolver."
                        />
                        <TextField
                          label="Canal"
                          value={row.channel}
                          onChange={(v) => edit(row.id, { channel: v })}
                          placeholder="Instagram · Reels"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <TextField
                            label="Duração"
                            value={row.duration}
                            onChange={(v) => edit(row.id, { duration: v })}
                            placeholder="32s"
                          />
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                              Formato
                            </span>
                            <div className="inline-flex border border-border">
                              {(["vertical", "horizontal"] as const).map((f) => (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => edit(row.id, { format: f })}
                                  className={`flex-1 px-3 py-2 text-sm transition-colors ${
                                    row.format === f
                                      ? "bg-foreground text-background"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {f === "vertical" ? "9:16" : "16:9"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            Prévia no card (segundos)
                          </span>
                          <Input
                            type="number"
                            min={2}
                            max={30}
                            value={row.preview_seconds}
                            onChange={(e) =>
                              edit(row.id, {
                                preview_seconds: Number(e.target.value) || 8,
                              })
                            }
                            className="w-28"
                          />
                          <p className="text-xs text-muted-foreground">
                            Quanto o card toca em loop, sem som, antes do clique.
                          </p>
                        </div>

                        <TextField
                          label="YouTube (opcional)"
                          value={row.youtube_id ?? ""}
                          onChange={(v) => edit(row.id, { youtube_id: v || null })}
                          placeholder="deixe vazio"
                          hint="Só se um dia o vídeo completo passar a vir do YouTube. Pode colar a URL inteira."
                        />

                        <div>
                          <Button disabled={busyId === row.id} onClick={() => saveRow(row)}>
                            {busyId === row.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            Salvar
                          </Button>
                        </div>
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
