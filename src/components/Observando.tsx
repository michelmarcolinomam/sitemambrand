import { FadeIn } from "./FadeIn";
import { SectionKicker } from "./SectionKicker";

const learnings = [
  "Marca não é o que a empresa diz que é — é o que o mercado entende, decide e repete.",
  "Crescimento sustentado é consequência de clareza, não de volume de execução.",
  "Toda marca tem um ciclo. Reconhecer a fase certa é metade da estratégia.",
];

export function Observando() {
  return (
    <section className="border-t border-border bg-mint px-6 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[900px]">
        <FadeIn>
          <SectionKicker number="05" label="13 anos observando marcas" />
        </FadeIn>

        <FadeIn delay={0.05}>
          <h2 className="mt-10 font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Mais de uma década acompanhando organizações em todos os estágios
            de crescimento ensina algo que metodologia nenhuma substitui:{" "}
            <span className="font-light italic text-foreground/55">
              perspectiva.
            </span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-16 space-y-6 text-lg leading-relaxed text-foreground/75 md:text-xl">
            <p>
              Vimos marcas nascerem com fundação sólida e marcas escalarem
              sobre o vazio. Vimos lideranças confundirem execução com
              estratégia, e outras tantas reconstruírem o sentido do negócio a
              partir de uma única decisão certa.
            </p>
            <p>
              Essa observação consistente, ao longo de mais de 13 anos, é o
              que sustenta a forma como a MAM pensa, diagnostica e direciona
              marcas hoje.
            </p>
          </div>
        </FadeIn>

        <div className="mt-20 space-y-12 border-t border-foreground/15 pt-12 md:mt-28">
          {learnings.map((q, i) => (
            <FadeIn key={q} delay={i * 0.05}>
              <figure className="grid grid-cols-12 gap-4">
                <span className="col-span-2 font-mono text-xs tabular-nums text-foreground/55 md:col-span-1">
                  0{i + 1}
                </span>
                <blockquote className="col-span-10 font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-foreground md:col-span-11 md:text-3xl">
                  “{q}”
                </blockquote>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
