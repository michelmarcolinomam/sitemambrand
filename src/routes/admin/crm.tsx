import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Loader2,
  Mail,
  MessageCircle,
  StickyNote,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/admin/crm")({
  component: CrmPage,
});

/** Funil do Michel. Renomear o label aqui reflete no painel (a key vai pro banco). */
const STAGES = [
  { key: "novo", label: "Novo", accent: "#6b6b6b" },
  { key: "apresentacao", label: "Apresentação", accent: "#2f6bb0" },
  { key: "reuniao", label: "Reunião", accent: "#7c6aab" },
  { key: "proposta", label: "Proposta", accent: "#8a6d00" },
  { key: "fechado", label: "Fechado", accent: "#3a7a2f" },
  { key: "perdido", label: "Perdido", accent: "#a83224" },
] as const;

type StageKey = (typeof STAGES)[number]["key"];
const KNOWN_STAGES = new Set<string>(STAGES.map((s) => s.key));
const stageOf = (s: string): StageKey =>
  (KNOWN_STAGES.has(s) ? s : "novo") as StageKey;

/** Serviços da MAM que o cliente pode querer. */
const SERVICES = [
  "Branding",
  "Rebranding",
  "Logo / Identidade visual",
  "Site",
  "Rótulo / Embalagem",
  "Consultoria de marketing",
  "Audiovisual",
  "Outro",
];

const PERIODS = [
  { key: "30d", label: "Últimos 30 dias" },
  { key: "mes", label: "Este mês" },
  { key: "mespassado", label: "Mês passado" },
  { key: "ano", label: "Este ano" },
  { key: "tudo", label: "Tudo" },
] as const;
type PeriodKey = (typeof PERIODS)[number]["key"];

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
  dimensions: { name: string; phase: string; score: number }[] | null;
  gclid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  created_at: string;
  crm_status: string;
  crm_notes: string | null;
  crm_services: string[];
  crm_value: number | null;
  crm_presented_at: string | null;
  crm_proposal_at: string | null;
  crm_closed_at: string | null;
};

const PHASE_STYLE: Record<string, string> = {
  Introdução: "bg-[#efe9f7] text-[#5f4b8b] border-[#d8cbe9]",
  Crescimento: "bg-[#e7f2e2] text-[#3a7a2f] border-[#c9e4bd]",
  Platô: "bg-[#faf1cf] text-[#8a6d00] border-[#ecdd9a]",
  Declínio: "bg-[#fbe4e0] text-[#a83224] border-[#f0c4bc]",
};

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(v);

type CrmPatch = {
  crm_status?: string;
  crm_notes?: string | null;
  crm_services?: string[];
  crm_value?: number | null;
  crm_presented_at?: string | null;
  crm_proposal_at?: string | null;
  crm_closed_at?: string | null;
  name?: string;
  company?: string | null;
  whatsapp?: string | null;
};

function CrmPage() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodKey>("mes");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const crmCols =
      "crm_status,crm_notes,crm_services,crm_value,crm_presented_at,crm_proposal_at,crm_closed_at";
    const [diag, cont] = await Promise.all([
      supabase
        .from("diagnostic_leads")
        .select(
          `id,name,company,email,whatsapp,phase,dimensions,gclid,utm_source,utm_medium,utm_campaign,referrer,created_at,${crmCols}`,
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("contacts")
        .select(`id,name,company,email,whatsapp,message,created_at,${crmCols}`)
        .order("created_at", { ascending: false }),
    ]);
    setLoading(false);
    if (diag.error || cont.error) {
      toast.error("Não foi possível carregar os leads.");
      return;
    }

    const svc = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
    const num = (v: unknown): number | null =>
      v === null || v === undefined ? null : Number(v);

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
        dimensions: (d.dimensions as Lead["dimensions"]) ?? null,
        gclid: d.gclid,
        utm_source: d.utm_source,
        utm_medium: d.utm_medium,
        utm_campaign: d.utm_campaign,
        referrer: d.referrer,
        created_at: d.created_at,
        crm_status: d.crm_status,
        crm_notes: d.crm_notes,
        crm_services: svc(d.crm_services),
        crm_value: num(d.crm_value),
        crm_presented_at: d.crm_presented_at,
        crm_proposal_at: d.crm_proposal_at,
        crm_closed_at: d.crm_closed_at,
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
        dimensions: null,
        gclid: null,
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        referrer: null,
        created_at: c.created_at,
        crm_status: c.crm_status,
        crm_notes: c.crm_notes,
        crm_services: svc(c.crm_services),
        crm_value: num(c.crm_value),
        crm_presented_at: c.crm_presented_at,
        crm_proposal_at: c.crm_proposal_at,
        crm_closed_at: c.crm_closed_at,
      })),
    ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    setRows(leads);
  }

  useEffect(() => {
    load();
  }, []);

  async function patch(l: Lead, fields: CrmPatch) {
    const before = rows;
    setRows((rs) => rs.map((r) => (r.id === l.id ? { ...r, ...fields } : r)));
    const payload = { ...fields, crm_updated_at: new Date().toISOString() };
    const q =
      l.source === "diagnostico"
        ? supabase.from("diagnostic_leads").update(payload).eq("id", l.id)
        : supabase.from("contacts").update(payload).eq("id", l.id);
    const { error } = await q;
    if (error) {
      toast.error("Não consegui salvar. Tente de novo.");
      setRows(before);
    }
  }

  function moveStage(l: Lead, next: StageKey) {
    const closing = next === "fechado" || next === "perdido";
    patch(l, {
      crm_status: next,
      crm_closed_at: closing ? new Date().toISOString() : null,
    });
  }

  const byStage = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    for (const s of STAGES) map[s.key] = [];
    for (const l of rows) map[stageOf(l.crm_status)].push(l);
    return map;
  }, [rows]);

  const range = useMemo(() => periodRange(period), [period]);
  const inRange = (iso: string | null) =>
    !!iso &&
    (!range.start || iso >= range.start) &&
    (!range.end || iso <= range.end);

  const metrics = useMemo(() => {
    let apres = 0,
      prop = 0,
      valorProp = 0,
      fechN = 0,
      fechV = 0,
      perdN = 0,
      perdV = 0;
    for (const l of rows) {
      if (inRange(l.crm_presented_at)) apres++;
      if (inRange(l.crm_proposal_at)) {
        prop++;
        valorProp += l.crm_value ?? 0;
      }
      if (l.crm_status === "fechado" && inRange(l.crm_closed_at)) {
        fechN++;
        fechV += l.crm_value ?? 0;
      }
      if (l.crm_status === "perdido" && inRange(l.crm_closed_at)) {
        perdN++;
        perdV += l.crm_value ?? 0;
      }
    }
    return { apres, prop, valorProp, fechN, fechV, perdN, perdV };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, range]);

  const total = rows.length;
  const selected = rows.find((r) => r.id === selectedId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">
            CRM · Funil de leads
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Todo lead que chega pelo site num funil só. Clique no card para ver e
            editar os detalhes. {total} no total.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="period" className="text-xs text-muted-foreground">
            Período dos números
          </Label>
          <div className="relative">
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodKey)}
              className="appearance-none rounded-sm border border-border bg-background py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {PERIODS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Painel de números */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Metric label="Apresentações enviadas" value={String(metrics.apres)} />
        <Metric label="Propostas enviadas" value={String(metrics.prop)} />
        <Metric label="Valor em proposta" value={brl(metrics.valorProp)} />
        <Metric
          label="Fechado"
          value={brl(metrics.fechV)}
          sub={`${metrics.fechN} negócio(s)`}
          tone="#3a7a2f"
        />
        <Metric
          label="Perdido"
          value={brl(metrics.perdV)}
          sub={`${metrics.perdN} negócio(s)`}
          tone="#a83224"
        />
      </div>

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
            <div key={s.key} className="flex w-[280px] shrink-0 flex-col gap-3">
              <div
                className="flex items-center justify-between border-b-2 pb-2"
                style={{ borderColor: s.accent }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: s.accent }}
                >
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
                  <BoardCard
                    key={l.id}
                    lead={l}
                    onOpen={() => setSelectedId(l.id)}
                    onStage={(next) => moveStage(l, next)}
                  />
                ))
              )}
            </div>
          ))}
        </div>
      )}

      <Sheet
        open={!!selected}
        onOpenChange={(o) => !o && setSelectedId(null)}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-md"
        >
          {selected && (
            <LeadDetail
              key={selected.id}
              lead={selected}
              onPatch={(fields) => patch(selected, fields)}
              onMove={(next) => moveStage(selected, next)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}) {
  return (
    <div className="rounded-md bg-muted/60 p-3">
      <div className="text-[11px] font-medium text-muted-foreground">
        {label}
      </div>
      <div
        className="mt-1 font-display text-xl font-semibold"
        style={tone ? { color: tone } : undefined}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function BoardCard({
  lead: l,
  onOpen,
  onStage,
}: {
  lead: Lead;
  onOpen: () => void;
  onStage: (next: StageKey) => void;
}) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div
      onClick={onOpen}
      className="cursor-pointer rounded-sm border border-border bg-background p-4 transition-colors hover:border-foreground/30"
    >
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

      {(l.crm_value || l.crm_services.length > 0) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {l.crm_value ? (
            <span className="rounded-sm bg-[#e7f2e2] px-1.5 py-0.5 text-[11px] font-semibold text-[#3a7a2f]">
              {brl(l.crm_value)}
            </span>
          ) : null}
          {l.crm_services.slice(0, 2).map((s) => (
            <span
              key={s}
              className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
          {l.crm_services.length > 2 && (
            <span className="text-[11px] text-muted-foreground">
              +{l.crm_services.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
        <span>{originOf(l)}</span>
        <span>· {relTime(l.created_at)}</span>
        {l.crm_presented_at && (
          <span className="inline-flex items-center gap-0.5 text-[#2f6bb0]">
            <Check className="h-3 w-3" />apres.
          </span>
        )}
        {l.crm_proposal_at && (
          <span className="inline-flex items-center gap-0.5 text-[#8a6d00]">
            <Check className="h-3 w-3" />prop.
          </span>
        )}
        {l.crm_notes && <StickyNote className="h-3 w-3" />}
      </div>

      <div className="mt-3 flex items-center gap-2" onClick={stop}>
        {(l.whatsapp ?? "").replace(/\D/g, "") && (
          <a
            href={waHref(l)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-[#25D366] px-2.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        )}
        <div className="relative">
          <select
            aria-label="Mover etapa"
            value={stageOf(l.crm_status)}
            onChange={(e) => onStage(e.target.value as StageKey)}
            className="appearance-none rounded-sm border border-border bg-background py-1.5 pl-2.5 pr-7 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function LeadDetail({
  lead: l,
  onPatch,
  onMove,
}: {
  lead: Lead;
  onPatch: (fields: CrmPatch) => void;
  onMove: (next: StageKey) => void;
}) {
  const [name, setName] = useState(l.name);
  const [company, setCompany] = useState(l.company ?? "");
  const [whatsapp, setWhatsapp] = useState(l.whatsapp ?? "");
  const [valueStr, setValueStr] = useState(
    l.crm_value != null ? String(l.crm_value) : "",
  );
  const [notes, setNotes] = useState(l.crm_notes ?? "");
  const services = l.crm_services;

  const toggleService = (s: string) => {
    const next = services.includes(s)
      ? services.filter((x) => x !== s)
      : [...services, s];
    onPatch({ crm_services: next });
  };

  const toggleFlag = (field: "crm_presented_at" | "crm_proposal_at") => {
    onPatch({ [field]: l[field] ? null : new Date().toISOString() });
  };

  return (
    <div>
      <SheetHeader>
        <SheetTitle className="font-display text-xl">Detalhes do lead</SheetTitle>
      </SheetHeader>

      <div className="mt-4 flex flex-col gap-5">
        {/* Etapa */}
        <div className="relative">
          <Label className="mb-1.5 block text-xs text-muted-foreground">
            Etapa
          </Label>
          <select
            value={stageOf(l.crm_status)}
            onChange={(e) => onMove(e.target.value as StageKey)}
            className="w-full appearance-none rounded-sm border border-border bg-background py-2 pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Dados do cliente */}
        <div className="flex flex-col gap-3">
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Nome
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() =>
                name.trim() && name !== l.name && onPatch({ name: name.trim() })
              }
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Empresa
            </Label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onBlur={() =>
                company !== (l.company ?? "") &&
                onPatch({ company: company.trim() || null })
              }
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              WhatsApp
            </Label>
            <Input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              onBlur={() =>
                whatsapp !== (l.whatsapp ?? "") &&
                onPatch({ whatsapp: whatsapp.trim() || null })
              }
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a
              href={`mailto:${l.email}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {l.email}
            </a>
            {(l.whatsapp ?? "").replace(/\D/g, "") && (
              <a
                href={waHref({ ...l, name, phase: l.phase })}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-[#1a8a48] hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                Chamar no WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Serviços */}
        <div>
          <Label className="mb-2 block text-xs text-muted-foreground">
            Serviços de interesse
          </Label>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => {
              const on = services.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    on
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/40"
                  }`}
                >
                  {on && <Check className="h-3 w-3" />}
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Valor */}
        <div>
          <Label className="mb-1.5 block text-xs text-muted-foreground">
            Valor do negócio (R$)
          </Label>
          <Input
            inputMode="numeric"
            placeholder="Ex.: 8000"
            value={valueStr}
            onChange={(e) =>
              setValueStr(e.target.value.replace(/[^\d.,]/g, ""))
            }
            onBlur={() => {
              const parsed = valueStr
                ? Number(valueStr.replace(/\./g, "").replace(",", "."))
                : null;
              const clean = parsed != null && !isNaN(parsed) ? parsed : null;
              if (clean !== l.crm_value) onPatch({ crm_value: clean });
            }}
          />
        </div>

        {/* Marcos do fluxo */}
        <div className="flex flex-col gap-2 rounded-md bg-muted/50 p-3">
          <FlagRow
            label="Apresentação da empresa enviada"
            on={!!l.crm_presented_at}
            at={l.crm_presented_at}
            onToggle={() => toggleFlag("crm_presented_at")}
          />
          <FlagRow
            label="Proposta enviada"
            on={!!l.crm_proposal_at}
            at={l.crm_proposal_at}
            onToggle={() => toggleFlag("crm_proposal_at")}
          />
        </div>

        {/* Anotações */}
        <div>
          <Label className="mb-1.5 block text-xs text-muted-foreground">
            Anotações
          </Label>
          <Textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() =>
              notes.trim() !== (l.crm_notes ?? "") &&
              onPatch({ crm_notes: notes.trim() || null })
            }
            placeholder="Ex.: reunião marcada dia 25; pediu proposta de rebranding…"
          />
        </div>

        {/* Contexto do lead (só leitura) */}
        <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
          <div className="mb-2 font-medium text-foreground">Origem e contexto</div>
          <div>Origem: {originOf(l)}</div>
          <div>Chegou: {new Date(l.created_at).toLocaleString("pt-BR")}</div>
          {l.message && <div className="mt-1">Mensagem: “{l.message}”</div>}
          {l.phase && (
            <div className="mt-1">Fase do diagnóstico: {l.phase}</div>
          )}
          {l.dimensions && l.dimensions.length > 0 && (
            <div className="mt-2 grid grid-cols-1 gap-1">
              {l.dimensions.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <span>{d.name}</span>
                  <span className="font-mono">
                    {d.score}% · {d.phase}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FlagRow({
  label,
  on,
  at,
  onToggle,
}: {
  label: string;
  on: boolean;
  at: string | null;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2.5 text-left text-sm"
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
          on
            ? "border-foreground bg-foreground text-background"
            : "border-border"
        }`}
      >
        {on ? <Check className="h-3.5 w-3.5" /> : <X className="h-3 w-3 text-transparent" />}
      </span>
      <span>
        {label}
        {on && at && (
          <span className="ml-1 text-xs text-muted-foreground">
            · {new Date(at).toLocaleDateString("pt-BR")}
          </span>
        )}
      </span>
    </button>
  );
}

function waHref(l: {
  name: string;
  whatsapp: string | null;
  source: Source;
  phase: string | null;
}): string {
  const first = l.name.split(" ")[0];
  const msg =
    l.source === "diagnostico" && l.phase
      ? `Oi ${first}! Aqui é o Michel, da MAM Brand. Vi que você concluiu o Diagnóstico de Ciclo de Marca e o resultado apontou a fase ${l.phase} pra sua marca. Posso te mostrar o que isso significa na prática — e o próximo passo?`
      : `Oi ${first}! Aqui é o Michel, da MAM Brand. Recebi seu contato pelo site e queria conversar com você.`;
  const digits = (l.whatsapp ?? "").replace(/\D/g, "");
  return `https://wa.me/55${digits}?text=${encodeURIComponent(msg)}`;
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

function periodRange(p: PeriodKey): { start: string | null; end: string | null } {
  const now = new Date();
  const iso = (d: Date) => d.toISOString();
  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  if (p === "tudo") return { start: null, end: null };
  if (p === "30d") {
    const s = new Date(now);
    s.setDate(s.getDate() - 30);
    return { start: iso(startOfDay(s)), end: null };
  }
  if (p === "mes") {
    return { start: iso(new Date(now.getFullYear(), now.getMonth(), 1)), end: null };
  }
  if (p === "mespassado") {
    return {
      start: iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      end: iso(new Date(now.getFullYear(), now.getMonth(), 1)),
    };
  }
  // ano
  return { start: iso(new Date(now.getFullYear(), 0, 1)), end: null };
}

function relTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `há ${d} d`;
  return new Date(isoStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}
