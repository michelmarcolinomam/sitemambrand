/**
 * Faixa marquee infinita (CSS puro — seguro no SSR).
 * Duas cópias idênticas lado a lado; a régua anima translateX(-50%) → loop
 * sem emenda. `words` alterna preenchido/contornado (Fraunces).
 */
export function Marquee({
  words,
  reverse = false,
  invert = false,
  durationSec = 36,
  className,
}: {
  words: string[];
  reverse?: boolean;
  invert?: boolean;
  durationSec?: number;
  className?: string;
}) {
  const strokeClass = invert ? "text-stroke-invert" : "text-stroke";
  const dotColor = invert ? "bg-background/40" : "bg-mint-ink/50";

  // Repete a lista para garantir que UMA cópia já preencha telas largas
  // (evita “vão” à direita antes do loop).
  const filled = [...words, ...words, ...words];

  const Group = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <div aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center">
      {filled.map((w, i) => (
        <span key={`${w}-${i}`} className="flex shrink-0 items-center">
          <span
            className={`font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold uppercase leading-none tracking-[-0.02em] ${
              i % 2 === 1 ? strokeClass : ""
            }`}
          >
            {w}
          </span>
          <span
            className={`mx-[0.6em] inline-block h-[0.4em] w-[0.4em] shrink-0 rounded-full ${dotColor}`}
            aria-hidden
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`group relative flex w-full overflow-hidden ${className ?? ""}`}>
      <div
        className={`flex w-max shrink-0 items-center will-change-transform group-hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
        style={{
          animation: `${reverse ? "marquee-x-reverse" : "marquee-x"} ${durationSec}s linear infinite`,
        }}
      >
        <Group />
        <Group ariaHidden />
      </div>
    </div>
  );
}
