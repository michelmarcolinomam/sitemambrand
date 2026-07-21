import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Loader2,
  Mail,
  MessageCircle,
  StickyNote,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/crm")({
  component: CrmPage,
});

/** Etapas do funil. Renomear aqui reflete no painel inteiro (a chave vai pro banco). */
const STAGES = [
  { key: "novo", label: "Novo", accent: "#6b6b6b" },
  { key: "contatado", label: "Contatado", accent: "#2f6bb0" },
  { key: "negociando", label: "Negociando", accent: "#8a6d00" },
  { key: "ganho", label: "Ganho", accent: "#3a7a2f" },
  { key: "perdido", label: "Perdido", accent: "#a83224" },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

const KNOWN_STAGES = new Set<string>(STAGES.map((s) => s.key));

type Source = "diagnostico" | "contato";

type Lead = {
  id: string;
  source: Source;
  name: string;
  company: string | null;
  email: string;
  whatsapp: string | null;
  phase: string | null;
  message: string | null;
  gclid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  created_at: string;
  crm_status: string;
  crm_notes: string | null;
};

const PHASE_STYLE: Record<string, string> = {
  Introdução: "bg-[#efe9f7] text-[#5f4b8b] border-[#d8cbe9]",
  Crescimento: "bg-[#e7f2e2] text-[#3a7a2f] border-[#c9e4bd]",
  Platô: "bg-[#faf1cf] text-[#8a6d00] border-[#ecdd9a]",
  Declínio: "bg-[#fbe4e0] text-[#a83224] border-[#f0c4bc]",
};

function CrmPage() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [diag, cont] = await Promise.all([
      supabase
        .from("diagnostic_leads")
        .select(
          "id,name,company,email,whatsapp,phase,gclid,utm_source,utm_medium,utm_campaign,referrer,created_at,crm_status,crm_notes",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("contacts")
        .select(
          "id,name,company,email,whatsapp,message,created_at,crm_status,crm_notes",
        )
        .order("created_at", { ascending: false }),
    ]);
    setLoading(false);

    if (diag.error || cont.error) {
      toast.error("Não foi possível carregar os leads.");
      return;
    }

    const leads: Lead[] = [
      ...(diag.data ?? []).map((d) => ({
        id: d.id,
        source: "diagnostico" as const,
        name: d.name,
        company: d.company,
        email: d.email,
        whatsapp: d.whatsapp,
        phase: d.phase,
        message: null,
        gclid: d.gclid,
        utm_source: d.utm_source,
        utm_medium: d.utm_medium,
        utm_campaign: d.utm_campaign,
        referrer: d.referrer,
        created_at: d.created_at,
        crm_status: d.crm_status,
        crm_notes: d.crm_notes,
      })),
      ...(cont.data ?? []).map((c) => ({
        id: c.id,
        source: "contato" as const,
        name: c.name,
        company: c.company,
        email: c.email,
        whatsapp: c.whatsapp,
        phase: null,
        message: c.message,
        gclid: null,
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        referrer: null,
        created_at: c.created_at,
        crm_status: c.crm_status,
        crm_notes: c.crm_notes,
      })),
    ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    setRows(leads);
  }

  useEffect(() => {
    load();
  }, []);

  const tableOf = (l: Lead) =>
    l.source === "diagnostico" ? "diagnostic_leads" : "contacts";

  async function setStage(l: Lead, next: StageKey) {
    const prev = l.crm_status;
    setRows((rs) =>
      rs.map((r) => (r.id === l.id ? { ...r, crm_status: next } : r)),
    );
    const { error } = await supabase
      .from(tableOf(l))
      .update({ crm_status: next, crm_updated_at: new Date().toISOString() })
      .eq("id", l.id);
    if (error) {
      toast.error("Não consegui mover o lead. Tente de novo.");
      setRows((rs) =>
        rs.map((r) => (r.id === l.id ? { ...r, crm_status: prev } : r)),
      );
    }
  }

  async function saveNotes(l: Lead, notes: string) {
    if ((l.crm_notes ?? "") === notes) return;
    setRows((rs) =>
      rs.map((r) => (r.id === l.id ? { ...r, crm_notes: notes } : r)),
    );
    const { error } = await supabase
      .from(tableOf(l))
      .update({
        crm_notes: notes || null,
        crm_updated_at: new Date().toISOString(),
      })
      .eq("id", l.id);
    if (error) toast.error("Não consegui salvar a anotação.");
    else toast.success("Anotação salva.");
  }

  // Agrupa por etapa; status desconhecido cai em "Novo".
  const byStage = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    for (const s of STAGES) map[s.key] = [];
    for (const l of rows) {
      const key = KNOWN_STAGES.has(l.crm_status) ? l.crm_status : "novo";
      map[key].push(l);
    }
    return map;
  }, [rows]);

  const total = rows.length;
  const abertos = rows.filter(
    (r) => r.crm_status !== "ganho" && r.crm_status !== "perdido",
  ).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">
        CRM · Funil de leads
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Todo lead que chega pelo site — do diagnóstico e do formulário de contato
        — num funil só. Mova cada card pela etapa, chame no WhatsApp e anote o
        andamento. {total} no total · {abertos} em aberto.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : total === 0 ? (
        <div className="mt-8 border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Nenhum lead ainda. Quando alguém enviar o diagnóstico ou o formulário
          de contato, aparece aqui.
        </div>
      ) : (
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((s) => (
            <div
              key={s.key}
              className="flex w-[300px] shrink-0 flex-col gap-3"
            >
              <div className="flex items-center justify-between border-b-2 pb-2" style={{ borderColor: s.accent }}>
                <span className="text-sm font-semibold" style={{ color: s.accent }}>
                  {s.label}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  {byStage[s.key].length}
                </span>
              </div>

              {byStage[s.key].length === 0 ? (
                <div className="rounded-sm border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                  Vazio
                </div>
              ) : (
                byStage[s.key].map((l) => (
                  <LeadCard
                    key={l.id}
                    lead={l}
                    onStage={(next) => setStage(l, next)}
                    onSaveNotes={(notes) => saveNotes(l, notes)}
                  />
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadCard({
  lead: l,
  onStage,
  onSaveNotes,
}: {
  lead: Lead;
  onStage: (next: StageKey) => void;
  onSaveNotes: (notes: string) => void;
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [draft, setDraft] = useState(l.crm_notes ?? "");

  const first = l.name.split(" ")[0];
  const waMsg =
    l.source === "diagnostico" && l.phase
      ? `Oi ${first}! Aqui é o Michel, da MAM Brand. Vi que você concluiu o Diagnóstico de Ciclo de Marca e o resultado apontou a fase ${l.phase} pra sua marca. Posso te mostrar o que isso significa na prática — e o próximo passo?`
      : `Oi ${first}! Aqui é o Michel, da MAM Brand. Recebi seu contato pelo site e queria conversar com você.`;
  const waDigits = (l.whatsapp ?? "").replace(/\D/g, "");
  const waHref = `https://wa.me/55${waDigits}?text=${encodeURIComponent(waMsg)}`;

  const origin = originOf(l);

  return (
    <div className="rounded-sm border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-display text-base font-semibold">
            {l.name}
          </div>
          {l.company && (
            <div className="truncate text-xs text-muted-foreground">
              {l.company}
            </div>
          )}
        </div>
        {l.source === "diagnostico" && l.phase ? (
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
              PHASE_STYLE[l.phase] ??
              "border-border bg-muted text-muted-foreground"
            }`}
          >
            {l.phase}
          </span>
        ) : (
          <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            Contato
          </span>
        )}
      </div>

      <div className="mt-2 text-[11px] text-muted-foreground">
        {origin} · {relTime(l.created_at)}
      </div>

      {l.message && (
        <p className="mt-2 line-clamp-3 rounded-sm bg-muted/60 p-2 text-xs text-muted-foreground">
          “{l.message}”
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        {waDigits && (
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-[#25D366] px-2.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        )}
        <a
          href={`mailto:${l.email}`}
          title={l.email}
          className="inline-flex items-center justify-center rounded-sm border border-border px-2.5 py-1.5 text-muted-foreground hover:text-foreground"
        >
          <Mail className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mt-3">
        <label className="sr-only" htmlFor={`stage-${l.id}`}>
          Etapa do lead
        </label>
        <div className="relative">
          <select
            id={`stage-${l.id}`}
            value={KNOWN_STAGES.has(l.crm_status) ? l.crm_status : "novo"}
            onChange={(e) => onStage(e.target.value as StageKey)}
            className="w-full appearance-none rounded-sm border border-border bg-background py-1.5 pl-2.5 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                Mover para: {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowNotes((v) => !v)}
        className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
      >
        <StickyNote className="h-3.5 w-3.5" />
        {l.crm_notes ? "Anotação" : "Adicionar anotação"}
        {l.crm_notes && !showNotes && (
          <span className="ml-1 truncate text-muted-foreground/80">
            · {l.crm_notes.slice(0, 24)}
            {l.crm_notes.length > 24 ? "…" : ""}
          </span>
        )}
      </button>

      {showNotes && (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => onSaveNotes(draft.trim())}
          placeholder="Ex.: ligou dia 20, pediu proposta de rebranding…"
          rows={3}
          className="mt-1.5 w-full resize-y rounded-sm border border-border bg-background p-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  );
}

function originOf(l: Lead): string {
  if (l.source === "contato") return "Formulário de contato";
  if (l.gclid)
    return l.utm_campaign ? `Google Ads · ${l.utm_campaign}` : "Google Ads";
  if (l.utm_source)
    return [l.utm_source, l.utm_medium].filter(Boolean).join(" / ");
  if (l.referrer) {
    try {
      return new URL(l.referrer).hostname;
    } catch {
      return l.referrer;
    }
  }
  return "Direto";
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `há ${d} d`;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}
