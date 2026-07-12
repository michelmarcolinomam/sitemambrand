import { Rise } from "./Reveal";

/**
 * Entregável — sem “caixa”: hairline no topo, numeral grande, e uma varredura
 * mint que sobe no hover (transform, suave — nada de animar height).
 */
export function DeliverableCard({
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
    <Rise delay={delay} className="h-full">
      <div className="group relative h-full overflow-hidden border-t border-foreground/20">
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 bg-mint transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
        />
        <div className="relative flex h-full flex-col pt-8">
          <span className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-foreground/15 transition-colors duration-500 group-hover:text-foreground/40">
            {number}
          </span>
          <h3 className="mt-6 font-display text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">
            {title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
      </div>
    </Rise>
  );
}
