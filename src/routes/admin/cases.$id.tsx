import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ImageField,
  SectionCard,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";
import { supabase } from "@/integrations/supabase/client";
import {
  defaultCaseContent,
  normalizeCaseContent,
  type CaseContent,
} from "@/lib/case-content";

export const Route = createFileRoute("/admin/cases/$id")({
  component: CaseEditorPage,
});

type Meta = {
  slug: string;
  title: string;
  year: string;
  category: string;
  descriptor: string;
  cover_url: string;
  seo_description: string;
  published: boolean;
};

const emptyMeta: Meta = {
  slug: "",
  title: "",
  year: "",
  category: "",
  descriptor: "",
  cover_url: "",
  seo_description: "",
  published: false,
};

function slugify(v: string) {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CaseEditorPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState<Meta>(emptyMeta);
  const [content, setContent] = useState<CaseContent>(defaultCaseContent());
  const [slugTouched, setSlugTouched] = useState(!isNew);

  // Pasta das imagens no bucket, baseada no slug (ou "rascunho" antes de nomear).
  const folder = useMemo(
    () => `cases/${meta.slug || "rascunho"}`,
    [meta.slug],
  );

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      setLoading(false);
      if (error || !data) {
        toast.error("Case não encontrado.");
        navigate({ to: "/admin" });
        return;
      }
      setMeta({
        slug: data.slug,
        title: data.title,
        year: data.year,
        category: data.category,
        descriptor: data.descriptor,
        cover_url: data.cover_url ?? "",
        seo_description: data.seo_description,
        published: data.published,
      });
      setContent(normalizeCaseContent(data.content));
    })();
  }, [id, isNew, navigate]);

  // Helpers de edição por seção — atualização imutável de um pedaço do content.
  function patch<K extends keyof CaseContent>(section: K, value: Partial<CaseContent[K]>) {
    setContent((c) => ({ ...c, [section]: { ...c[section], ...value } }));
  }

  function setMetaField<K extends keyof Meta>(key: K, value: Meta[K]) {
    setMeta((m) => ({ ...m, [key]: value }));
  }

  async function save() {
    if (!meta.title.trim()) {
      toast.error("Dê um título ao case.");
      return;
    }
    const slug = meta.slug || slugify(meta.title);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      toast.error("Endereço (slug) inválido. Use letras, números e hífens.");
      return;
    }

    setSaving(true);
    const payload = {
      slug,
      title: meta.title.trim(),
      year: meta.year.trim(),
      category: meta.category.trim(),
      descriptor: meta.descriptor.trim(),
      cover_url: meta.cover_url || null,
      seo_description: meta.seo_description.trim(),
      published: meta.published,
      content,
    };

    if (isNew) {
      const { data, error } = await supabase
        .from("cases")
        .insert(payload)
        .select("id")
        .single();
      setSaving(false);
      if (error) {
        toast.error(
          error.code === "23505"
            ? "Já existe um case com esse endereço (slug)."
            : "Erro ao salvar.",
        );
        return;
      }
      toast.success("Case criado.");
      navigate({ to: "/admin/cases/$id", params: { id: data.id } });
    } else {
      const { error } = await supabase.from("cases").update(payload).eq("id", id);
      setSaving(false);
      if (error) {
        toast.error(
          error.code === "23505"
            ? "Já existe um case com esse endereço (slug)."
            : "Erro ao salvar.",
        );
        return;
      }
      setMeta((m) => ({ ...m, slug }));
      toast.success("Alterações salvas.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Cabeçalho fixo com ações */}
      <div className="sticky top-[73px] z-10 -mx-6 mb-8 border-b border-border bg-background/85 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            {!isNew && meta.published && (
              <Button variant="outline" size="sm" asChild>
                <a href={`/cases/${meta.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Ver página
                </a>
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={meta.published}
                onCheckedChange={(v) => setMetaField("published", v)}
              />
              <Label htmlFor="published" className="text-sm">
                {meta.published ? "Publicado" : "Rascunho"}
              </Label>
            </div>
            <Button onClick={save} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">
        {isNew ? "Novo case" : meta.title || "Editar case"}
      </h1>

      <ImageStandards />

      <div className="mt-8 flex flex-col gap-6">
        {/* IDENTIFICAÇÃO / CARD */}
        <SectionCard
          kicker="—"
          title="Identificação e card"
          description="Estes campos formam o card na tela de Serviços / Branding e o topo da página do case."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              label="Título"
              value={meta.title}
              onChange={(v) => {
                setMetaField("title", v);
                if (!slugTouched) setMetaField("slug", slugify(v));
              }}
              placeholder="Black Herva"
            />
            <TextField
              label="Endereço (slug)"
              value={meta.slug}
              onChange={(v) => {
                setSlugTouched(true);
                setMetaField("slug", slugify(v));
              }}
              placeholder="black-herva"
              hint={`A página ficará em /cases/${meta.slug || "..."}`}
            />
            <TextField
              label="Ano / período"
              value={meta.year}
              onChange={(v) => setMetaField("year", v)}
              placeholder="2011–presente"
            />
            <TextField
              label="Categoria"
              value={meta.category}
              onChange={(v) => setMetaField("category", v)}
              placeholder="Erva-mate"
            />
            <TextField
              label="Descritor"
              value={meta.descriptor}
              onChange={(v) => setMetaField("descriptor", v)}
              placeholder="Branding desde a fundação"
            />
          </div>

          <ImageField
            label="Capa do card (retrato 4:5)"
            value={{ url: meta.cover_url, alt: `Case ${meta.title}` }}
            onChange={(v) => setMetaField("cover_url", v.url)}
            folder={folder}
            aspect="aspect-[4/5]"
            spec="1200 × 1500 px · 4:5 (retrato)"
            hint="Aparece no card da tela de branding. Sem capa, mostra “Em breve”."
          />

          <TextAreaField
            label="Descrição para o Google / redes (SEO)"
            value={meta.seo_description}
            onChange={(v) => setMetaField("seo_description", v)}
            rows={2}
          />
        </SectionCard>

        {/* HERO */}
        <SectionCard kicker="00" title="Abertura (hero)">
          <div className="grid gap-4 md:grid-cols-3">
            {content.hero.meta.map((tag, i) => (
              <TextField
                key={i}
                label={`Tag ${i + 1}`}
                value={tag}
                onChange={(v) => {
                  const next = [...content.hero.meta];
                  next[i] = v;
                  patch("hero", { meta: next });
                }}
              />
            ))}
          </div>
          <TextAreaField
            label="Texto de abertura"
            value={content.hero.lead}
            onChange={(v) => patch("hero", { lead: v })}
            rows={3}
          />
          <ImageField
            label="Imagem de abertura (16:9, largura total)"
            value={content.hero.image}
            onChange={(v) => patch("hero", { image: v })}
            folder={folder}
            spec="2400 × 1350 px · 16:9 (largura total da tela)"
          />
        </SectionCard>

        {/* 01 — DESAFIO */}
        <SectionCard kicker="01" title="O desafio">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Título (parte normal)"
              value={content.challenge.title}
              onChange={(v) => patch("challenge", { title: v })}
            />
            <TextField
              label="Título (parte em destaque itálico)"
              value={content.challenge.titleItalic}
              onChange={(v) => patch("challenge", { titleItalic: v })}
            />
          </div>
          <TextAreaField
            label="Parágrafo de abertura"
            value={content.challenge.lead}
            onChange={(v) => patch("challenge", { lead: v })}
          />
          <TextField
            label="Subtítulo"
            value={content.challenge.subtitle}
            onChange={(v) => patch("challenge", { subtitle: v })}
          />
          {content.challenge.paragraphs.map((p, i) => (
            <TextAreaField
              key={i}
              label={`Parágrafo ${i + 1}`}
              value={p}
              onChange={(v) => {
                const next = [...content.challenge.paragraphs];
                next[i] = v;
                patch("challenge", { paragraphs: next });
              }}
            />
          ))}
          <ImageField
            label="Imagem do desafio (retrato 4:5)"
            value={content.challenge.image}
            onChange={(v) => patch("challenge", { image: v })}
            folder={folder}
            aspect="aspect-[4/5]"
            spec="1200 × 1500 px · 4:5 (retrato)"
          />
        </SectionCard>

        {/* 02 — ESTRATÉGIA */}
        <SectionCard kicker="02" title="Estratégia">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Título (parte normal)"
              value={content.strategy.title}
              onChange={(v) => patch("strategy", { title: v })}
            />
            <TextField
              label="Título (destaque itálico)"
              value={content.strategy.titleItalic}
              onChange={(v) => patch("strategy", { titleItalic: v })}
            />
          </div>
          <TextAreaField
            label="Texto de abertura"
            value={content.strategy.lead}
            onChange={(v) => patch("strategy", { lead: v })}
          />
          <TextField
            label="Título da coluna de texto"
            value={content.strategy.columnTitle}
            onChange={(v) => patch("strategy", { columnTitle: v })}
          />
          {content.strategy.paragraphs.map((p, i) => (
            <TextAreaField
              key={i}
              label={`Parágrafo ${i + 1}`}
              value={p}
              onChange={(v) => {
                const next = [...content.strategy.paragraphs];
                next[i] = v;
                patch("strategy", { paragraphs: next });
              }}
            />
          ))}
          <div className="grid gap-6 md:grid-cols-2">
            {content.strategy.insights.map((ins, i) => (
              <div key={i} className="flex flex-col gap-3 border border-border p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Card {ins.number}
                </div>
                <TextField
                  label="Título"
                  value={ins.title}
                  onChange={(v) => {
                    const next = [...content.strategy.insights];
                    next[i] = { ...ins, title: v };
                    patch("strategy", { insights: next });
                  }}
                />
                <TextAreaField
                  label="Descrição"
                  value={ins.description}
                  onChange={(v) => {
                    const next = [...content.strategy.insights];
                    next[i] = { ...ins, description: v };
                    patch("strategy", { insights: next });
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 03 — IDENTIDADE */}
        <SectionCard
          kicker="03"
          title="Identidade visual"
          description="Galeria de imagens do sistema de marca."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Título (parte normal)"
              value={content.identity.title}
              onChange={(v) => patch("identity", { title: v })}
            />
            <TextField
              label="Título (destaque itálico)"
              value={content.identity.titleItalic}
              onChange={(v) => patch("identity", { titleItalic: v })}
            />
          </div>
          <TextAreaField
            label="Texto de abertura"
            value={content.identity.lead}
            onChange={(v) => patch("identity", { lead: v })}
          />
          <ImageField
            label="Imagem grande 1 (16:9)"
            value={content.identity.fullImage1}
            onChange={(v) => patch("identity", { fullImage1: v })}
            folder={folder}
            spec="2400 × 1350 px · 16:9 (largura total da tela)"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {content.identity.tiles.map((tile, i) => (
              <ImageField
                key={i}
                label={tile.label}
                value={tile}
                onChange={(v) => {
                  const next = [...content.identity.tiles];
                  next[i] = { ...v, label: tile.label };
                  patch("identity", { tiles: next });
                }}
                folder={folder}
                spec="1600 × 900 px · 16:9"
              />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.identity.squares.map((img, i) => (
              <ImageField
                key={i}
                label={`Quadrado ${i + 1} (1:1)`}
                value={img}
                onChange={(v) => {
                  const next = [...content.identity.squares];
                  next[i] = v;
                  patch("identity", { squares: next });
                }}
                folder={folder}
                aspect="aspect-square"
                spec="1200 × 1200 px · 1:1 (quadrado)"
              />
            ))}
          </div>
          <ImageField
            label="Imagem grande 2 (16:9)"
            value={content.identity.fullImage2}
            onChange={(v) => patch("identity", { fullImage2: v })}
            folder={folder}
            spec="2400 × 1350 px · 16:9 (largura total da tela)"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {content.identity.beforeAfter.map((img, i) => (
              <ImageField
                key={i}
                label={i === 0 ? "Antes" : "Depois"}
                value={img}
                onChange={(v) => {
                  const next = [...content.identity.beforeAfter];
                  next[i] = v;
                  patch("identity", { beforeAfter: next });
                }}
                folder={folder}
                aspect="aspect-[9/10]"
                spec="1200 × 1333 px · 9:10 (retrato)"
              />
            ))}
          </div>
          <ImageField
            label="Imagem grande 3 (16:9)"
            value={content.identity.fullImage3}
            onChange={(v) => patch("identity", { fullImage3: v })}
            folder={folder}
            spec="2400 × 1350 px · 16:9 (largura total da tela)"
          />
        </SectionCard>

        {/* 04 — APLICAÇÕES */}
        <SectionCard kicker="04" title="Aplicações / Pontos de contato">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Título (parte normal)"
              value={content.applications.title}
              onChange={(v) => patch("applications", { title: v })}
            />
            <TextField
              label="Título (destaque itálico)"
              value={content.applications.titleItalic}
              onChange={(v) => patch("applications", { titleItalic: v })}
            />
          </div>
          <TextAreaField
            label="Texto de abertura"
            value={content.applications.lead}
            onChange={(v) => patch("applications", { lead: v })}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.applications.images.map((img, i) => (
              <ImageField
                key={i}
                label={`Aplicação ${i + 1} (3:4)`}
                value={img}
                onChange={(v) => {
                  const next = [...content.applications.images];
                  next[i] = v;
                  patch("applications", { images: next });
                }}
                folder={folder}
                aspect="aspect-[3/4]"
                spec="1200 × 1600 px · 3:4 (retrato)"
              />
            ))}
          </div>
        </SectionCard>

        {/* 05 — EM MOVIMENTO */}
        <SectionCard
          kicker="05"
          title="Em movimento (vídeos)"
          description="O vídeo só carrega quando o visitante clica no play. Cole o ID do vídeo do YouTube (o trecho depois de watch?v= ou /shorts/)."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Título (parte normal)"
              value={content.motion.title}
              onChange={(v) => patch("motion", { title: v })}
            />
            <TextField
              label="Título (destaque itálico)"
              value={content.motion.titleItalic}
              onChange={(v) => patch("motion", { titleItalic: v })}
            />
          </div>
          <TextAreaField
            label="Texto de abertura"
            value={content.motion.lead}
            onChange={(v) => patch("motion", { lead: v })}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {content.motion.videos.map((v, i) => (
              <div key={i} className="flex flex-col gap-4 border border-border p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {v.vertical ? "Vídeo vertical (9:16)" : "Vídeo horizontal (16:9)"}
                </div>
                <TextField
                  label="ID do vídeo (YouTube)"
                  value={v.videoId}
                  onChange={(val) => {
                    const next = [...content.motion.videos];
                    next[i] = { ...v, videoId: val.trim() };
                    patch("motion", { videos: next });
                  }}
                  placeholder="dQw4w9WgXcQ"
                />
                <TextField
                  label="Legenda (tag)"
                  value={v.tag}
                  onChange={(val) => {
                    const next = [...content.motion.videos];
                    next[i] = { ...v, tag: val };
                    patch("motion", { videos: next });
                  }}
                  placeholder="Filme da marca — 01:20"
                />
                <ImageField
                  label="Capa do vídeo (poster)"
                  value={{ url: v.poster, alt: v.alt }}
                  onChange={(img) => {
                    const next = [...content.motion.videos];
                    next[i] = { ...v, poster: img.url, alt: img.alt };
                    patch("motion", { videos: next });
                  }}
                  folder={folder}
                  aspect={v.vertical ? "aspect-[9/16]" : "aspect-video"}
                  spec={
                    v.vertical
                      ? "1080 × 1920 px · 9:16 (vertical)"
                      : "1920 × 1080 px · 16:9 (horizontal)"
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 06 — RESULTADO */}
        <SectionCard kicker="06" title="Resultado">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Título (parte normal)"
              value={content.results.title}
              onChange={(v) => patch("results", { title: v })}
            />
            <TextField
              label="Título (destaque itálico)"
              value={content.results.titleItalic}
              onChange={(v) => patch("results", { titleItalic: v })}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {content.results.metrics.map((m, i) => (
              <div key={i} className="flex flex-col gap-3 border border-border p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Número {i + 1}
                </div>
                <TextField
                  label="Rótulo de cima"
                  value={m.kicker}
                  onChange={(v) => updateMetric(i, { kicker: v })}
                  placeholder="Crescimento"
                />
                <TextField
                  label="Valor exibido"
                  value={m.final}
                  onChange={(v) => updateMetric(i, { final: v })}
                  placeholder="+2.500%"
                />
                <TextField
                  label="Descrição"
                  value={m.label}
                  onChange={(v) => updateMetric(i, { label: v })}
                  placeholder="em vendas nos primeiros 5 anos"
                />
                <div className="flex flex-col gap-2 border-t border-border pt-3">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={m.value !== null}
                      onChange={(e) =>
                        updateMetric(i, {
                          value: e.target.checked
                            ? Number(String(m.final).replace(/\D/g, "")) || 0
                            : null,
                        })
                      }
                    />
                    Animar como contador (número sobe)
                  </label>
                  {m.value !== null && (
                    <div className="grid grid-cols-3 gap-2">
                      <TextField
                        label="Nº final"
                        value={String(m.value)}
                        onChange={(v) => updateMetric(i, { value: Number(v) || 0 })}
                      />
                      <TextField
                        label="Prefixo"
                        value={m.prefix}
                        onChange={(v) => updateMetric(i, { prefix: v })}
                      />
                      <TextField
                        label="Sufixo"
                        value={m.suffix}
                        onChange={(v) => updateMetric(i, { suffix: v })}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Depoimento
            </div>
            <TextAreaField
              label="Frase do cliente"
              value={content.results.testimonial.quote}
              onChange={(v) =>
                patch("results", {
                  testimonial: { ...content.results.testimonial, quote: v },
                })
              }
            />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <TextField
                label="Nome / empresa"
                value={content.results.testimonial.author}
                onChange={(v) =>
                  patch("results", {
                    testimonial: { ...content.results.testimonial, author: v },
                  })
                }
              />
              <TextField
                label="Cargo"
                value={content.results.testimonial.role}
                onChange={(v) =>
                  patch("results", {
                    testimonial: { ...content.results.testimonial, role: v },
                  })
                }
              />
            </div>
            <div className="mt-4">
              <ImageField
                label="Foto do depoente (1:1)"
                value={{
                  url: content.results.testimonial.photoUrl,
                  alt: content.results.testimonial.photoAlt,
                }}
                onChange={(img) =>
                  patch("results", {
                    testimonial: {
                      ...content.results.testimonial,
                      photoUrl: img.url,
                      photoAlt: img.alt,
                    },
                  })
                }
                folder={folder}
                aspect="aspect-square"
                spec="1000 × 1000 px · 1:1 (quadrado)"
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );

  function updateMetric(i: number, patchM: Partial<CaseContent["results"]["metrics"][number]>) {
    const next = [...content.results.metrics];
    next[i] = { ...next[i], ...patchM };
    patch("results", { metrics: next });
  }
}

/**
 * Informativo técnico das imagens do case — regras gerais + tabela de medidas.
 * Recolhível para não atrapalhar quem já conhece o padrão.
 */
function ImageStandards() {
  const [open, setOpen] = useState(true);

  const linhas: { local: string; medida: string; proporcao: string }[] = [
    { local: "Capa do card (portfólio)", medida: "1200 × 1500 px", proporcao: "4:5 retrato" },
    { local: "Abertura / imagens grandes 16:9", medida: "2400 × 1350 px", proporcao: "16:9 largura total" },
    { local: "Imagem do desafio", medida: "1200 × 1500 px", proporcao: "4:5 retrato" },
    { local: "Tiles (logo / paleta)", medida: "1600 × 900 px", proporcao: "16:9" },
    { local: "Quadrados da identidade", medida: "1200 × 1200 px", proporcao: "1:1 quadrado" },
    { local: "Antes / Depois", medida: "1200 × 1333 px", proporcao: "9:10 retrato" },
    { local: "Aplicações", medida: "1200 × 1600 px", proporcao: "3:4 retrato" },
    { local: "Poster de vídeo horizontal", medida: "1920 × 1080 px", proporcao: "16:9" },
    { local: "Poster de vídeo vertical", medida: "1080 × 1920 px", proporcao: "9:16" },
    { local: "Foto do depoente", medida: "1000 × 1000 px", proporcao: "1:1 quadrado" },
  ];

  return (
    <div className="mt-6 border border-mint-ink/25 bg-mint/40 p-5 md:p-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 text-left"
      >
        <ImageIcon className="h-4 w-4 text-mint-ink" aria-hidden />
        <span className="font-display text-lg font-semibold tracking-[-0.01em]">
          Padrão técnico das imagens
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Para o site ficar uniforme e nítido em telas de alta resolução, envie cada
            imagem já no tamanho recomendado abaixo. Cada campo repete a sua medida ideal
            logo acima da miniatura.
          </p>

          <ul className="grid gap-x-8 gap-y-1.5 text-sm text-foreground sm:grid-cols-2">
            <li>
              <span className="font-medium">Formato:</span> JPG ou WebP para fotos; PNG ou
              SVG para logos com fundo transparente.
            </li>
            <li>
              <span className="font-medium">Cor:</span> perfil sRGB.
            </li>
            <li>
              <span className="font-medium">Peso:</span> idealmente até ~500 KB por imagem
              (máximo 10 MB).
            </li>
            <li>
              <span className="font-medium">Resolução:</span> 72 dpi (padrão web) — o que
              importa é a medida em pixels, não o dpi.
            </li>
          </ul>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-mint-ink/25 text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Onde aparece</th>
                  <th className="py-2 pr-4 font-medium">Medida ideal</th>
                  <th className="py-2 font-medium">Proporção</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((l) => (
                  <tr key={l.local} className="border-b border-mint-ink/10">
                    <td className="py-2 pr-4">{l.local}</td>
                    <td className="py-2 pr-4 font-medium tabular-nums">{l.medida}</td>
                    <td className="py-2 text-muted-foreground">{l.proporcao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            Dica: manter a proporção exata evita cortes indesejados. Se a imagem tiver
            proporção diferente, o site corta pelo centro para preencher o espaço.
          </p>
        </div>
      )}
    </div>
  );
}
