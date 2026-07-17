import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { trackLead } from "@/lib/tracking";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome.").max(100),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email("E-mail inválido.").max(255),
  whatsapp: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1, "Escreva uma mensagem.").max(2000),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

/**
 * Formulário de contato — mesma lógica/endpoint do ContactCTA da home
 * (/api/public/contact + validação zod), isolado para a tela de serviço.
 */
export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Revise os campos destacados.");
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        toast.error("Não foi possível enviar agora. Tente novamente em instantes.");
        return;
      }
      trackLead("contato_servico");
      toast.success("Recebemos seu contato — em breve respondemos.");
      form.reset();
    } catch {
      toast.error("Falha de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      noValidate
      className="flex scroll-mt-24 flex-col gap-6"
    >
      <Field
        id="name"
        label="Nome"
        required
        error={errors.name}
        inputProps={{ type: "text", autoComplete: "name", maxLength: 100 }}
      />
      <Field
        id="company"
        label="Empresa"
        error={errors.company}
        inputProps={{ type: "text", autoComplete: "organization", maxLength: 120 }}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          id="email"
          label="E-mail"
          required
          error={errors.email}
          inputProps={{ type: "email", autoComplete: "email", maxLength: 255 }}
        />
        <Field
          id="whatsapp"
          label="WhatsApp"
          error={errors.whatsapp}
          inputProps={{ type: "tel", autoComplete: "tel", maxLength: 30 }}
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          Mensagem<span className="ml-1 text-foreground">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={2000}
          className="mt-3 w-full resize-y border-0 border-b border-border bg-transparent px-0 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground md:text-lg"
          placeholder="Conte sobre seu momento e o que você está buscando."
        />
        {errors.message && (
          <p className="mt-2 text-xs text-destructive">{errors.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center gap-3 text-base font-medium text-foreground transition-opacity disabled:opacity-50 md:text-lg"
        >
          <span className="border-b border-foreground pb-1">
            {submitting ? "Enviando…" : "Enviar mensagem"}
          </span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  inputProps,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
      >
        {label}
        {required && <span className="ml-1 text-foreground">*</span>}
      </label>
      <input
        id={id}
        name={id}
        required={required}
        {...inputProps}
        className="mt-3 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground md:text-lg"
      />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
