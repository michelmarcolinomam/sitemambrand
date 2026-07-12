import { Reveal, Rise } from "./Reveal";

/**
 * Pilar — linha editorial com hover: um preenchimento mint “varre” de baixo,
 * o índice e o título deslizam. Pensado para a coluna que rola ao lado do
 * título sticky (seção 03).
 */
export function PillarCard({
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
    <div className="group relative overflow-hidden border-t border-border">
      {/* varredura mint no hover */}
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-mint transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
      />
      <div className="relative flex flex-col gap-4 py-10 md:flex-row md:items-baseline md:gap-10 md:py-12">
        <span className="font-mono text-xs tabular-nums text-muted-foreground transition-transform duration-500 group-hover:translate-x-1 md:w-16 md:shrink-0">
          {number}
        </span>
        <div className="md:flex-1">
          <Reveal delay={delay}>
            <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em] transition-transform duration-500 group-hover:translate-x-1 md:text-4xl">
              {title}
            </h3>
          </Reveal>
          <Rise delay={delay + 0.06}>
            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          </Rise>
        </div>
      </div>
    </div>
  );
}
