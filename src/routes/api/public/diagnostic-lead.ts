import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
// Chave pública basta: a RLS de `diagnostic_leads` só permite INSERT validado.
import { supabase } from "@/integrations/supabase/client";

const str = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const dimensionSchema = z.object({
  name: z.string().max(120),
  phase: z.string().max(40),
  score: z.number().min(0).max(100),
});

const leadSchema = z.object({
  // id gerado no cliente (uuid): permite gravar parcial no preenchimento
  // e completar a mesma linha na conclusão.
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Informe o nome.").max(100),
  company: str(120),
  email: z.string().trim().email("E-mail inválido.").max(255),
  whatsapp: str(30),
  phase: str(40),
  dimensions: z.array(dimensionSchema).max(20).optional(),
  // Atribuição / origem
  gclid: str(200),
  utm_source: str(150),
  utm_medium: str(150),
  utm_campaign: str(200),
  utm_term: str(200),
  utm_content: str(200),
  referrer: str(500),
  landing_url: str(500),
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/diagnostic-lead")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS }),

      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json(
            { error: "Invalid JSON." },
            { status: 400, headers: CORS },
          );
        }

        const parsed = leadSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: "Validação falhou.", issues: parsed.error.flatten() },
            { status: 400, headers: CORS },
          );
        }

        const d = parsed.data;
        const nn = (v: string | undefined) => (v && v.length ? v : null);
        const id = d.id ?? crypto.randomUUID();

        // Grava/atualiza via função com privilégio elevado (server-side).
        // Mesmo id → parcial (preenchimento) e conclusão caem na MESMA linha.
        const { error } = await supabase.rpc("save_diagnostic_lead", {
          p_id: id,
          p_name: d.name,
          p_company: nn(d.company),
          p_email: d.email,
          p_whatsapp: nn(d.whatsapp),
          p_phase: nn(d.phase),
          p_dimensions: d.dimensions ?? null,
          p_gclid: nn(d.gclid),
          p_utm_source: nn(d.utm_source),
          p_utm_medium: nn(d.utm_medium),
          p_utm_campaign: nn(d.utm_campaign),
          p_utm_term: nn(d.utm_term),
          p_utm_content: nn(d.utm_content),
          p_referrer: nn(d.referrer),
          p_landing_url: nn(d.landing_url),
        });

        if (error) {
          console.error("[diagnostic-lead] insert failed", error.message);
          return Response.json(
            { error: "Não foi possível registrar o lead agora." },
            { status: 500, headers: CORS },
          );
        }

        return Response.json({ ok: true }, { headers: CORS });
      },
    },
  },
});
