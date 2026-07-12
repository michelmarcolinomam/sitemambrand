import { Reveal, Rise } from "./Reveal";

/**
 * Benefício/resultado — numeral gigante com reveal em máscara + um traço mint
 * que cresce no hover. Menos “bloco”, mais gesto.
 */
export function BenefitBlock({
  number,
  title,
  description,
  delay = 0,
}: {
  number: string;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <div className="group">
      <Reveal delay={delay}>
        <span className="font-display text-[clamp(3rem,7vw,5rem)] font-semibold leading-none tracking-[-0.04em] text-foreground/15 transition-colors duration-500 group-hover:text-mint-ink">
          {number}
        </span>
      </Reveal>
      <span
        aria-hidden
        className="mt-6 block h-px w-10 origin-left bg-mint-ink/40 transition-all duration-500 group-hover:w-20 group-hover:bg-mint-ink"
      />
      <Reveal delay={delay + 0.05}>
        <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-[-0.025em] md:text-3xl">
          {title}
        </h3>
      </Reveal>
      <Rise delay={delay + 0.1}>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      </Rise>
    </div>
  );
}
