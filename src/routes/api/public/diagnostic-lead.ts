import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
// O lead vai para o gestor (seção Comercial), não para o banco do site.
import { enviarLeadAoGestor } from "@/lib/gestor-leads.server";

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

        // Mesmo id → parcial (preenchimento) e conclusão caem na MESMA linha
        // do gestor. Na segunda vez, campo vazio não apaga o que já estava, e
        // a etapa do funil nunca é tocada.
        const error = await enviarLeadAoGestor({
          tipo: "diagnostico",
          id,
          nome: d.name,
          empresa: nn(d.company),
          email: d.email,
          whatsapp: nn(d.whatsapp),
          fase: nn(d.phase),
          dimensoes: d.dimensions ?? null,
          gclid: nn(d.gclid),
          utm_source: nn(d.utm_source),
          utm_medium: nn(d.utm_medium),
          utm_campaign: nn(d.utm_campaign),
          utm_term: nn(d.utm_term),
          utm_content: nn(d.utm_content),
          referrer: nn(d.referrer),
          landing_url: nn(d.landing_url),
        });

        if (error) {
          console.error("[diagnostic-lead] envio ao gestor falhou", error);
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
