import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal, Rise } from "./Reveal";

type Step = {
  number: string;
  title: string;
  duration: string;
  description: string;
  entregas: string[];
};

/**
 * Timeline de processo. Linha vertical à esquerda que SE DESENHA no scroll,
 * numerais gigantes colados a ela, e — por etapa — badge de duração + lista
 * de entregas. (Conteúdo rico + movimento.)
 */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 65%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.4,
  });

  return (
    <div ref={ref} className="relative mt-16 md:mt-24">
      {/* trilho + linha desenhada (desktop) */}
      <div
        aria-hidden
        className="absolute left-0 top-0 hidden h-full w-px bg-border md:block"
      >
        <motion.div
          style={{ scaleY: lineScale }}
          className="h-full w-full origin-top bg-foreground"
        />
      </div>

      <ol className="md:pl-12">
        {steps.map((step) => (
          <li
            key={step.number}
            className="relative border-t border-border py-12 md:py-16"
          >
            {/* nó sobre a linha, no topo da etapa */}
            <span
              aria-hidden
              className="absolute -left-[3px] top-12 hidden h-1.5 w-1.5 rounded-full bg-foreground md:top-16 md:block"
            />
            <div className="grid grid-cols-12 gap-6 md:gap-8">
              <div className="col-span-12 md:col-span-3">
                <span className="font-display text-[clamp(3rem,8vw,7rem)] font-semibold leading-none tracking-[-0.05em] text-foreground/[0.13]">
                  {step.number}
                </span>
              </div>

              <div className="col-span-12 md:col-span-9">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Reveal>
                    <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em] md:text-4xl">
                      {step.title}
                    </h3>
                  </Reveal>
                  <span className="rounded-full bg-muted px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {step.duration}
                  </span>
                </div>

                <div className="mt-6 grid gap-8 md:grid-cols-12 md:gap-6">
                  <Rise delay={0.06} className="md:col-span-7">
                    <p className="max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                      {step.description}
                    </p>
                  </Rise>

                  <div className="md:col-span-4 md:col-start-9">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Entregas
                    </div>
                    <ul className="mt-4 flex flex-col">
                      {step.entregas.map((e) => (
                        <li
                          key={e}
                          className="border-b border-border/60 py-2.5 text-sm text-foreground"
                        >
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
