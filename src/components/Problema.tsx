import { FadeIn } from "./FadeIn";
import { SectionKicker } from "./SectionKicker";

const points = [
  "Crescem sem posicionamento.",
  "Investem sem direcionamento.",
  "Executam sem clareza.",
  "Permanecem estagnadas sem perceber.",
];

export function Problema() {
  return (
    <section id="problema" className="border-t border-border px-6 py-28 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-12 md:gap-12">
        <FadeIn className="md:col-span-5">
          <SectionKicker number="02" label="A tese" />
          <h2 className="mt-10 font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            A maioria das marcas{" "}
            <span className="font-light italic text-mint-ink">cresce sem direção.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} className="md:col-span-6 md:col-start-7">
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            Quando o crescimento acontece sem clareza estratégica, o esforço
            vira ruído. Marcas avançam, mas perdem a capacidade de decidir.
          </p>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {points.map((p, i) => (
              <li key={p} className="flex items-baseline gap-6 py-6">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  0{i + 1}
                </span>
                <span className="font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-foreground md:text-3xl">
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
