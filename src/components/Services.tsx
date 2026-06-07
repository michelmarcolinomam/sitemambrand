import { FadeIn } from "./FadeIn";
import { SectionKicker } from "./SectionKicker";

const services = [
  {
    number: "01",
    name: "Branding",
    desc: "Construção estratégica de marcas — posicionamento, narrativa, identidade e sistema de expressão.",
  },
  {
    number: "02",
    name: "Rebranding",
    desc: "Reposicionamento e evolução de marcas que precisam responder a um novo momento de mercado.",
  },
  {
    number: "03",
    name: "Consulting",
    desc: "Inteligência estratégica para empresas com equipes internas que precisam de direção e clareza.",
  },
  {
    number: "04",
    name: "Ciclo de Marca",
    desc: "Diagnóstico proprietário que identifica o estágio da marca e define os próximos movimentos.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="border-t border-border px-6 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn>
          <SectionKicker number="04" label="Como ajudamos" />
          <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            Quatro frentes,{" "}
            <span className="font-light italic text-mint-ink">uma única lógica:</span>{" "}
            decidir antes de executar.
          </h2>
        </FadeIn>

        <ul className="mt-20 divide-y divide-border border-y border-border md:mt-28">
          {services.map((s, i) => (
            <FadeIn key={s.name} delay={i * 0.05}>
              <li className="group grid grid-cols-12 items-baseline gap-4 py-10 md:py-14">
                <span className="col-span-2 font-mono text-xs tabular-nums text-muted-foreground md:col-span-1">
                  {s.number}
                </span>
                <h3 className="col-span-10 font-display text-3xl font-semibold leading-tight tracking-[-0.025em] md:col-span-4 md:text-5xl">
                  {s.name}
                </h3>
                <p className="col-span-12 text-base leading-relaxed text-muted-foreground md:col-span-5 md:col-start-6 md:text-lg">
                  {s.desc}
                </p>
                <a
                  href="#contato"
                  className="col-span-12 inline-flex items-center gap-2 text-sm font-medium text-foreground md:col-span-2 md:justify-end"
                >
                  <span className="border-b border-foreground/40 pb-0.5 transition-colors group-hover:border-foreground">
                    Saber mais
                  </span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
