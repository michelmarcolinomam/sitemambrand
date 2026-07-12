import type { ReactNode } from "react";
import { SectionKicker } from "@/components/SectionKicker";
import { Reveal, Rise } from "./Reveal";
import { Marquee } from "./Marquee";
import { ArrowLink } from "./ArrowLink";

/**
 * Hero de tela de serviço — editorial e cinético, sem excessos.
 * `title` aceita ReactNode (span itálico). `marqueeWords` alimenta a faixa.
 */
export function ServiceHero({
  id,
  number,
  label,
  title,
  lead,
  ctaLabel,
  ctaHref,
  marqueeWords,
}: {
  id?: string;
  number: string;
  label: string;
  title: ReactNode;
  lead: string;
  ctaLabel: string;
  ctaHref: string;
  marqueeWords: string[];
}) {
  return (
    <section id={id} className="relative scroll-mt-24">
      <div className="relative px-6 pt-36 pb-16 md:px-10 md:pt-52 md:pb-24">
        <div className="mx-auto max-w-[1400px]">
          <Rise>
            <SectionKicker number={number} label={label} />
          </Rise>

          <h1 className="mt-10 max-w-[16ch] font-display text-[clamp(2.75rem,6.5vw,5.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-foreground md:mt-14">
            <Reveal delay={0.08}>{title}</Reveal>
          </h1>

          <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
            <Rise delay={0.2} className="md:col-span-7 md:col-start-6">
              <p className="max-w-[56ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
                {lead}
              </p>
              <div className="mt-10">
                <ArrowLink href={ctaHref} size="lg">
                  {ctaLabel}
                </ArrowLink>
              </div>
            </Rise>
          </div>
        </div>
      </div>

      {/* Faixa cinética full-bleed — o visual do topo, dentro da tipografia. */}
      <div className="relative border-t border-border py-7 md:py-9">
        <Marquee words={marqueeWords} durationSec={38} />
      </div>
    </section>
  );
}
