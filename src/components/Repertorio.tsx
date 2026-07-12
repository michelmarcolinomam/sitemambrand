import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { SectionKicker } from "./SectionKicker";
import img01 from "@/assets/repertorio/01.jpg";
import img02 from "@/assets/repertorio/02.jpg";
import img03 from "@/assets/repertorio/03.jpg";
import img04 from "@/assets/repertorio/04.jpg";
import img05 from "@/assets/repertorio/05.jpg";
import img06 from "@/assets/repertorio/06.jpg";

const projects = [
  { img: img01, client: "Atelier Norte", sector: "Moda · Identidade", year: "2024" },
  { img: img02, client: "Vértice Indústria", sector: "Indústria · Reposicionamento", year: "2024" },
  { img: img03, client: "Casa Mirante", sector: "Bem-estar · Branding", year: "2023" },
  { img: img04, client: "Holding Província", sector: "B2B · Sistema de marca", year: "2023" },
  { img: img05, client: "Construtora Solar", sector: "Construção · Sinalização", year: "2022" },
  { img: img06, client: "Restaurante Mesa 9", sector: "Gastronomia · Branding", year: "2022" },
];

export function Repertorio() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    dragFree: false,
  });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const total = projects.length;
  const counter = `${String(selected + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section id="repertorio" className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 pt-28 pb-12 md:px-10 md:pt-44 md:pb-20">
        <FadeIn>
          <SectionKicker number="06" label="Repertório — Seis projetos" />
          <h2 className="mt-10 max-w-[20ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            Decisões que viraram{" "}
            <span className="font-light italic text-mint-ink">forma.</span>
          </h2>
        </FadeIn>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {projects.map((p, i) => (
              <div
                key={p.client}
                className="relative min-w-0 shrink-0 grow-0 basis-full px-2 md:basis-[90%] md:px-4"
              >
                <figure className="relative h-[70vh] w-full overflow-hidden md:h-[85vh]">
                  <img
                    src={p.img}
                    alt={`${p.client} — ${p.sector}`}
                    loading="lazy"
                    width={1920}
                    height={1080}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 via-black/25 to-transparent"
                    aria-hidden
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 px-6 py-8 text-white md:px-10 md:py-12">
                    <div className="flex items-end justify-between gap-6">
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
                          0{i + 1} — {p.year}
                        </div>
                        <div className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] md:text-4xl">
                          {p.client}
                        </div>
                        <div className="mt-1 text-sm text-white/80 md:text-base">
                          {p.sector}
                        </div>
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 pt-6 pb-2 md:px-10 md:pt-8">
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {counter}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Projeto anterior"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Próximo projeto"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
