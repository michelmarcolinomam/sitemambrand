import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome.").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido.").max(255),
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Escreva uma mensagem.").max(2000),
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

        const { name, company, email, whatsapp, message } = parsed.data;

        const { error } = await supabaseAdmin.from("contacts").insert({
          name,
          company: company || null,
          email,
          whatsapp: whatsapp || null,
          message,
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
