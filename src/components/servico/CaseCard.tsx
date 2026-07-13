import { Rise } from "./Reveal";

/**
 * Card de case — formato retrato (4:5), editorial e estático.
 * Capa (aspect 4:5) vem do painel admin; sem capa, placeholder mint "Em breve".
 * `href` aponta para /cases/[slug].
 */
export function CaseCard({
  title,
  year,
  category,
  descriptor,
  href,
  image,
  delay = 0,
}: {
  title: string;
  year: string;
  category: string;
  descriptor: string;
  href: string;
  image?: string | null;
  delay?: number;
}) {
  return (
    <Rise delay={delay} className="h-full">
      <a href={href} className="group flex h-full flex-col">
        {image ? (
          <div className="aspect-[4/5] w-full overflow-hidden bg-mint">
            <img
              src={image}
              alt={`Case ${title}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center bg-mint">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Em breve
            </span>
          </div>
        )}

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
            {title}
          </h3>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {year}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{category}</span>
          <span aria-hidden>·</span>
          <span>{descriptor}</span>
        </div>
      </a>
    </Rise>
  );
}
