import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Linkedin, Instagram, Youtube, MessageCircle } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { SectionKicker } from "./SectionKicker";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome.").max(100),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email("E-mail inválido.").max(255),
  whatsapp: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1, "Escreva uma mensagem.").max(2000),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

// TODO: trocar pelos links reais quando a MAM enviar (LinkedIn, Instagram, WhatsApp, YouTube)
const socials = [
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "WhatsApp", href: "#", Icon: MessageCircle },
  { label: "YouTube", href: "#", Icon: Youtube },
];

export function ContactCTA() {
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
      toast.success("Recebemos seu contato — em breve respondemos.");
      form.reset();
    } catch {
      toast.error("Falha de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contato" className="border-t border-border px-6 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn>
          <SectionKicker number="08" label="Próximo passo" />
        </FadeIn>

        <FadeIn delay={0.05}>
          <h2 className="mt-12 max-w-[22ch] font-display text-[clamp(2.5rem,7vw,6.25rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            Sua marca está pronta para a{" "}
            <span className="font-light italic text-mint-ink">próxima fase?</span>
          </h2>
        </FadeIn>

        <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-x-10">
          <FadeIn delay={0.1} className="md:col-span-5">
            <p className="max-w-[44ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              Descubra onde sua empresa está hoje e quais decisões precisam ser
              tomadas para seu próximo ciclo de crescimento. Conte um pouco
              sobre o seu momento — respondemos pessoalmente.
            </p>

            <a
              href="#contact-form"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 md:text-base"
            >
              Faça um diagnóstico da sua marca
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>

            <div className="mt-12">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Canais
              </div>
              <ul className="mt-5 flex flex-wrap items-center gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:contato@mambranding.com.br"
                className="mt-8 inline-block text-base text-foreground hover:text-mint-ink md:text-lg"
              >
                contato@mambranding.com.br
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="md:col-span-6 md:col-start-7">
            <form id="contact-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 scroll-mt-24">
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
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
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
