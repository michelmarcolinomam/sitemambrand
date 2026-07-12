import { FadeIn } from "./FadeIn";

export function Hero() {
  return (
    <section className="relative px-6 pt-36 pb-28 md:px-10 md:pt-52 md:pb-44">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            <span>MAM Branding</span>
            <span className="hidden h-px w-12 bg-current opacity-40 sm:inline-block" aria-hidden />
            <span>Inteligência estratégica para marcas</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mt-12 max-w-[20ch] font-display text-[clamp(2.75rem,7.5vw,7.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground md:mt-16">
            Toda marca cresce.{" "}
            <span className="font-light italic text-mint-ink">
              Poucas sabem o que fazer
            </span>{" "}
            em cada fase desse crescimento.
          </h1>
        </FadeIn>

        <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12">
          <FadeIn delay={0.2} className="md:col-span-6 md:col-start-7">
            <p className="max-w-[44ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              Há mais de 13 anos ajudamos empresas a identificar seu momento,
              reorganizar suas estratégias e construir marcas preparadas para
              crescer.
            </p>
            <a
              href="#contato"
              className="group mt-10 inline-flex items-center gap-3 text-sm font-medium text-foreground"
            >
              <span className="border-b border-foreground pb-1">Agendar Diagnóstico</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
