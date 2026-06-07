import { useState } from "react";
import { Play } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { SectionKicker } from "./SectionKicker";
import { VideoLightbox } from "./VideoLightbox";
import img01 from "@/assets/historias/01.jpg";
import img02 from "@/assets/historias/02.jpg";
import img03 from "@/assets/historias/03.jpg";
import img04 from "@/assets/historias/04.jpg";

type Historia = {
  number: string;
  brand: string;
  context: string;
  chapter: string;
  poster: string;
  videoSrc?: string;
};

const historias: Historia[] = [
  {
    number: "01",
    brand: "Atelier Norte",
    chapter: "Identidade",
    context: "Da fundação à coleção de estreia — dois anos de construção de marca.",
    poster: img01,
  },
  {
    number: "02",
    brand: "Vértice Indústria",
    chapter: "Reposicionamento",
    context: "Tradução de quatro décadas de operação em uma narrativa contemporânea.",
    poster: img02,
  },
  {
    number: "03",
    brand: "Casa Mirante",
    chapter: "Branding",
    context: "Construindo do zero uma marca de bem-estar com posicionamento próprio.",
    poster: img03,
  },
  {
    number: "04",
    brand: "Holding Província",
    chapter: "Sistema de marca",
    context: "Um sistema único para conectar múltiplas verticais de negócio.",
    poster: img04,
  },
];

export function Historias() {
  const [active, setActive] = useState<Historia | null>(null);

  return (
    <section id="historias" className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 pt-28 pb-20 md:px-10 md:pt-44 md:pb-32">
        <FadeIn>
          <SectionKicker number="07" label="Histórias" />
          <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            Marcas que fizeram parte{" "}
            <span className="font-light italic text-mint-ink">da nossa trajetória.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Nem toda história começa do zero. Algumas começam com uma ideia. Outras com uma mudança
            necessária. Ao longo dos anos, tivemos a oportunidade de participar de momentos
            importantes na construção, evolução e reposicionamento de diversas marcas. Mais do que
            projetos, são histórias que também ajudaram a construir a nossa.
          </p>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
          {historias.map((h, i) => (
            <FadeIn key={h.brand} delay={i * 0.05}>
              <button
                type="button"
                onClick={() => setActive(h)}
                aria-label={`Assistir história de ${h.brand}`}
                className="group block w-full text-left"
              >
                <div className="relative w-full overflow-hidden bg-muted" style={{ aspectRatio: "16 / 10" }}>
                  <img
                    src={h.poster}
                    alt={`${h.brand} — ${h.chapter}`}
                    loading="lazy"
                    width={1024}
                    height={640}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-background/90 text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:bg-background md:h-20 md:w-20">
                      <Play className="h-5 w-5 translate-x-[1px] fill-current md:h-6 md:w-6" />
                    </span>
                  </div>
                  <div className="absolute left-5 top-5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/85 md:left-6 md:top-6">
                    {h.number} — {h.chapter}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="font-display text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                    {h.brand}
                  </div>
                  <div className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                    {h.context}
                  </div>
                </div>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>

      <VideoLightbox
        open={active !== null}
        onClose={() => setActive(null)}
        src={active?.videoSrc}
        poster={active?.poster}
        title={active?.brand}
        subtitle={active?.context}
      />
    </section>
  );
}
