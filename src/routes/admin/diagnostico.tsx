import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mail, MessageCircle, Trash2, Tag } from "lucide-react";
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

export const Route = createFileRoute("/admin/diagnostico")({
  component: DiagnosticoPage,
});

type Dimension = { name: string; phase: string; score: number };

type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  whatsapp: string | null;
  phase: string | null;
  dimensions: Dimension[] | null;
  gclid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  landing_url: string | null;
  created_at: string;
};

const PHASE_STYLE: Record<string, string> = {
  Introdução: "bg-[#efe9f7] text-[#5f4b8b] border-[#d8cbe9]",
  Crescimento: "bg-[#e7f2e2] text-[#3a7a2f] border-[#c9e4bd]",
  Platô: "bg-[#faf1cf] text-[#8a6d00] border-[#ecdd9a]",
  Declínio: "bg-[#fbe4e0] text-[#a83224] border-[#f0c4bc]",
};

function DiagnosticoPage() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("diagnostic_leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar os leads do diagnóstico.");
      return;
    }
    setRows((data as Lead[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(row: Lead) {
    setBusyId(row.id);
    const { error } = await supabase
      .from("diagnostic_leads")
      .delete()
      .eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao excluir.");
      return;
    }
    toast.success("Lead removido.");
    load();
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const onlyDigits = (v: string) => v.replace(/\D/g, "");

  // Resumo legível da origem do lead
  function origin(l: Lead): { label: string; kind: "ads" | "utm" | "ref" | "direct" } {
    if (l.gclid) {
      const camp = l.utm_campaign ? ` · ${l.utm_campaign}` : "";
      return { label: `Google Ads${camp}`, kind: "ads" };
    }
    if (["meta", "facebook", "instagram", "fb", "ig"].includes((l.utm_source ?? "").toLowerCase())) {
      const camp = l.utm_campaign ? ` · ${l.utm_campaign}` : "";
      return { label: `Meta Ads${camp}`, kind: "ads" };
    }
    if (l.utm_source) {
      const parts = [l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean);
      return { label: parts.join(" / "), kind: "utm" };
    }
    if (l.referrer) {
      try {
        return { label: new URL(l.referrer).hostname, kind: "ref" };
      } catch {
        return { label: l.referrer, kind: "ref" };
      }
    }
    return { label: "Direto / sem origem", kind: "direct" };
  }

  const originStyle: Record<string, string> = {
    ads: "bg-foreground text-background",
    utm: "bg-accent text-foreground",
    ref: "bg-muted text-muted-foreground",
    direct: "bg-muted text-muted-foreground",
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">
        Leads do diagnóstico
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Quem concluiu o Diagnóstico de Ciclo de Marca — com a fase, as notas por
        dimensão e a origem de cada lead. Do mais recente para o mais antigo.
      </p>

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            Nenhum lead do diagnóstico ainda.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {rows.map((l) => {
              const o = origin(l);
              return (
                <li key={l.id} className="border border-border bg-background p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-lg font-semibold">
                          {l.name}
                        </span>
                        {l.company && (
                          <span className="text-sm text-muted-foreground">
                            · {l.company}
                          </span>
                        )}
                        {l.phase && (
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              PHASE_STYLE[l.phase] ??
                              "border-border bg-muted text-muted-foreground"
                            }`}
                          >
                            {l.phase}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <a
                          href={`mailto:${l.email}`}
                          className="inline-flex items-center gap-1.5 hover:text-foreground"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {l.email}
                        </a>
                        {l.whatsapp && (
                          <a
                            href={`https://wa.me/55${onlyDigits(l.whatsapp)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-foreground"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            {l.whatsapp}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {fmt(l.created_at)}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Excluir">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir este lead?</AlertDialogTitle>
                            <AlertDialogDescription>
                              O lead de {l.name} será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => remove(l)}
                              disabled={busyId === l.id}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Origem do lead */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Tag className="h-3.5 w-3.5" /> Origem:
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${originStyle[o.kind]}`}
                    >
                      {o.label}
                    </span>
                    {l.gclid && (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        gclid: {l.gclid.slice(0, 24)}
                        {l.gclid.length > 24 ? "…" : ""}
                      </span>
                    )}
                  </div>

                  {/* Notas por dimensão */}
                  {l.dimensions && l.dimensions.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {l.dimensions.map((d, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 text-xs text-muted-foreground"
                        >
                          <span className="truncate">{d.name}</span>
                          <span className="shrink-0 font-mono">
                            {d.score}% · {d.phase}
                          </span>
                        </div>
                      ))}
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
