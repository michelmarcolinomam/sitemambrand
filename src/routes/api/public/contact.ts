import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
// Chave pública basta aqui: a RLS de `contacts` só permite INSERT validado.
import { supabase } from "@/integrations/supabase/client";

// Campos de origem (gclid/UTM/referrer) — opcionais, capturados pelo site.
const origem = z.string().trim().max(500).nullish();

const contactSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome.").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido.").max(255),
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Escreva uma mensagem.").max(2000),
  gclid: origem,
  utm_source: origem,
  utm_medium: origem,
  utm_campaign: origem,
  utm_term: origem,
  utm_content: origem,
  referrer: origem,
  landing_url: origem,
});

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON." }, { status: 400 });
        }

        const parsed = contactSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: "Validação falhou.", issues: parsed.error.flatten() },
            { status: 400 },
          );
        }

        const d = parsed.data;

        const { error } = await supabase.from("contacts").insert({
          name: d.name,
          company: d.company || null,
          email: d.email,
          whatsapp: d.whatsapp || null,
          message: d.message,
          gclid: d.gclid ?? null,
          utm_source: d.utm_source ?? null,
          utm_medium: d.utm_medium ?? null,
          utm_campaign: d.utm_campaign ?? null,
          utm_term: d.utm_term ?? null,
          utm_content: d.utm_content ?? null,
          referrer: d.referrer ?? null,
          landing_url: d.landing_url ?? null,
        });

        if (error) {
          console.error("[contact] insert failed", error.message);
          return Response.json(
            { error: "Não foi possível registrar seu contato agora." },
            { status: 500 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
