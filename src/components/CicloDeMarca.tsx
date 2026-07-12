import { FadeIn } from "./FadeIn";
import { SectionKicker } from "./SectionKicker";

const phases = [
  { label: "Introdução", desc: "Construir fundação, identidade e narrativa." },
  { label: "Crescimento", desc: "Acelerar com consistência e posicionamento." },
  { label: "Platô", desc: "Reler o mercado e renovar a relevância." },
  { label: "Declínio", desc: "Diagnosticar causas e decidir o próximo passo." },
  { label: "Reestruturação", desc: "Reposicionar para o próximo ciclo." },
];

const points = [
  { x: 60, y: 72 },
  { x: 280, y: 28 },
  { x: 500, y: 30 },
  { x: 720, y: 74 },
  { x: 940, y: 20 },
];

function buildPath() {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx1 = prev.x + (curr.x - prev.x) / 2;
    const cx2 = prev.x + (curr.x - prev.x) / 2;
    d += ` C ${cx1} ${prev.y}, ${cx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export function CicloDeMarca() {
  return (
    <section id="ciclo" className="border-t border-border bg-mint px-6 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn>
          <SectionKicker number="03" label="Metodologia proprietária" />
        </FadeIn>

        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <FadeIn delay={0.05} className="md:col-span-7">
            <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              Ciclo de Marca.{" "}
              <span className="font-light italic text-foreground/55">
                Cada fase exige uma decisão diferente.
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15} className="md:col-span-4 md:col-start-9">
            <p className="text-base leading-relaxed text-foreground/70 md:text-lg">
              Um diagnóstico que identifica o estágio atual da marca e define
              os movimentos estratégicos necessários para o próximo nível de
              crescimento.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="mt-20 md:mt-28">
          <div className="overflow-x-auto">
            <svg
              viewBox="0 0 1000 120"
              className="w-full min-w-[720px]"
              fill="none"
              aria-hidden
            >
              <path
                d={buildPath()}
                stroke="currentColor"
                strokeWidth="1.25"
                className="text-foreground/70"
              />
              {points.map((p) => (
                <circle
                  key={p.x}
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  className="fill-mint stroke-foreground"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>

          <ol className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-14 md:grid-cols-5 md:gap-x-8">
            {phases.map((phase, i) => (
              <li key={phase.label}>
                <div className="font-mono text-xs tabular-nums text-foreground/55">
                  0{i + 1}
                </div>
                <div className="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
                  {phase.label}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {phase.desc}
                </p>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  );
}
