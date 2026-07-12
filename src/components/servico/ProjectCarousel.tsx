import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export type Projeto = {
  title: string;
  year: string;
  category: string;
  href?: string;
};

/**
 * Carrossel de projetos — card central em foco, vizinhos "espiando" nas laterais.
 * Projetos ilimitados. Contador NN / total + setas circulares (padrão embla).
 */
export function ProjectCarousel({ projetos }: { projetos: Projeto[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const total = projetos.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {projetos.map((p, i) => (
            <div
              key={`${p.title}-${i}`}
              className="min-w-0 flex-[0_0_80%] pl-4 sm:flex-[0_0_54%] lg:flex-[0_0_42%] xl:flex-[0_0_36%] md:pl-6"
            >
              <ProjetoCard projeto={p} index={i} active={i === selected} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div className="font-mono text-sm tabular-nums tracking-[0.1em] text-muted-foreground">
          <span className="text-foreground">{pad(selected + 1)}</span>
          <span className="mx-1">/</span>
          {pad(total)}
        </div>
        <div className="flex items-center gap-3">
          <CarouselButton label="Projeto anterior" onClick={() => emblaApi?.scrollPrev()}>
            ←
          </CarouselButton>
          <CarouselButton label="Próximo projeto" onClick={() => emblaApi?.scrollNext()}>
            →
          </CarouselButton>
        </div>
      </div>
    </div>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
    >
      <span aria-hidden className="text-lg">
        {children}
      </span>
    </button>
  );
}

function ProjetoCard({
  projeto,
  index,
  active,
}: {
  projeto: Projeto;
  index: number;
  active: boolean;
}) {
  const inner = (
    <>
      {/* PLACEHOLDER — trocar por imagem real do projeto.
          Quando houver foto, adicionar um scrim escuro embaixo e texto claro. */}
      <span className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
        Em breve
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {String(index + 1).padStart(2, "0")} — {projeto.year}
        </div>
        <h3 className="mt-2.5 font-display text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
          {projeto.title}
        </h3>
        <div className="mt-1.5 text-[13px] text-muted-foreground">{projeto.category}</div>
      </div>
    </>
  );

  // O card ativo domina (foco = "um cliente só"); os vizinhos recuam.
  const cls = `relative flex aspect-[4/5] w-full origin-center flex-col justify-end overflow-hidden bg-mint transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    active ? "scale-100 opacity-100" : "scale-[0.82] opacity-35"
  }`;

  return projeto.href ? (
    <a href={projeto.href} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
