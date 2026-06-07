import { FadeIn } from "./FadeIn";
import { SectionKicker } from "./SectionKicker";

const projects = [
  {
    year: "2024",
    client: "Indústria · Bens de consumo",
    title: "Reposicionar uma marca consolidada para um novo ciclo de mercado.",
    summary:
      "Após duas décadas de liderança regional, a marca enfrentava saturação. O diagnóstico revelou que o problema não era visibilidade, e sim percepção de valor. Reescrevemos a tese central e reorganizamos a comunicação ao redor de um único território estratégico.",
  },
  {
    year: "2023",
    client: "Serviços · B2B",
    title: "Construir a marca de uma operação que cresceu antes de existir como marca.",
    summary:
      "Empresa em forte expansão, sem narrativa unificada. Definimos posicionamento, arquitetura de marca e princípios de decisão para a liderança — fundação capaz de sustentar o crescimento sem perder identidade.",
  },
  {
    year: "2022",
    client: "Saúde · Rede nacional",
    title: "Diagnóstico de Ciclo de Marca para uma rede em estágio de platô.",
    summary:
      "A marca crescia em receita, mas perdia relevância simbólica. O Ciclo de Marca identificou um platô avançado e propôs movimentos de reestruturação de portfólio, comunicação e cultura — antes que o declínio se instalasse.",
  },
];

export function Projetos() {
  return (
    <section id="projetos" className="border-t border-border px-6 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn>
          <SectionKicker number="07" label="Cases narrados" />
          <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            Decisões antes de{" "}
            <span className="font-light italic text-mint-ink">entregáveis.</span>
          </h2>
        </FadeIn>

        <div className="mt-20 divide-y divide-border border-y border-border md:mt-28">
          {projects.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.05}>
              <article className="grid grid-cols-12 gap-6 py-14 md:py-20">
                <div className="col-span-12 md:col-span-3">
                  <div className="font-mono text-xs tabular-nums text-muted-foreground">
                    {p.year}
                  </div>
                  <div className="mt-2 text-sm font-medium text-foreground">{p.client}</div>
                </div>
                <div className="col-span-12 md:col-span-9">
                  <h3 className="font-display text-2xl font-semibold leading-snug tracking-[-0.025em] text-foreground md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                    {p.summary}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
