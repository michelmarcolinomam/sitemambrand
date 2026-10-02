import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { SectionKicker } from "@/components/SectionKicker";
import { PieceLightbox, type Piece } from "@/components/galeria/PieceLightbox";
import { supabase } from "@/integrations/supabase/client";
import { serviceJsonLd } from "@/lib/seo";
import {
  FORMATOS,
  GAP_CELULAR,
  GAP_DESKTOP,
  LIMITE_CELULAR,
  compor,
  formatoDe,
  larguraMaxima,
  normalizarImagens,
  razao,
  type Formato,
} from "@/lib/mosaico";

const TITLE = "Design de Rótulos e Embalagens para Marcas | MAM Brand";
const DESCRIPTION =
  "Rótulos e embalagens que traduzem a estratégia da marca para o ponto de venda. Portfólio de rotulagem da MAM Brand, em Maringá-PR.";

export const Route = createFileRoute("/rotulos-e-embalagens")({
  // As peças vêm do banco — administradas em /admin/galeria.
  loader: async () => {
    const { data } = await supabase
      .from("gallery_pieces")
      .select("id, kind, client, caption, images")
      .eq("service", "rotulos")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    return {
      pecas: (data ?? [])
        .map((p) => ({ ...p, images: normalizarImagens(p.images) }))
        .filter((p) => p.images.length > 0) as Piece[],
    };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: serviceJsonLd({
          name: "Rótulos e Embalagens",
          serviceType: "Design de rótulos e embalagens",
          path: "/rotulos-e-embalagens",
          description:
            "Design de rótulos e embalagens com estratégia de marca: arte, mockup e linha completa para o ponto de venda.",
        }),
      },
    ],
  }),
  component: RotulosPage,
});

type PecaNoMosaico = Piece & { formato: Formato };

/** Largura real do mosaico. No servidor vale a largura do desktop. */
function useLargura() {
  const ref = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setLargura(el.clientWidth);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    window.addEventListener("resize", medir);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);
  return { ref, largura };
}

function RotulosPage() {
  const { pecas } = Route.useLoaderData();
  const [aberta, setAberta] = useState<Piece | null>(null);
  const { ref, largura } = useLargura();
  const W = largura ?? 1320;
  const celular = W < LIMITE_CELULAR;
  const faixas = compor<PecaNoMosaico>(
    pecas.map((p) => ({ ...p, formato: formatoDe(p.images[0]) })),
    W,
  );

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />

      <main className="px-6 pt-32 md:px-10 md:pt-44">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <SectionKicker number="—" label="Rótulos e Embalagens" />
            <h1 className="mt-6 max-w-[17ch] font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-semibold leading-[1] tracking-[-0.04em]">
              Tudo que já foi{" "}
              <span className="font-light italic text-mint-ink">para a prateleira.</span>
            </h1>
            <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              Sem separar por cliente e sem case narrado — esses moram nas páginas de marca. Aqui é
              o catado: rótulo, embalagem, pote, sacaria e linha completa, tudo junto, do jeito que
              sai do estúdio.
            </p>
          </FadeIn>

          {pecas.length > 0 ? (
            <div
              ref={ref}
              // até medir a largura real, o mosaico não aparece — evita o pulo no celular
              className={`mt-14 flex flex-col transition-opacity duration-500 md:mt-20 ${
                largura === null ? "opacity-0" : "opacity-100"
              }`}
              style={{ gap: celular ? 32 : 56 }}
            >
              {faixas.map((faixa) => (
                <div
                  key={faixa.map((p) => p.id).join("-")}
                  className="flex"
                  style={{
                    gap: celular ? GAP_CELULAR : GAP_DESKTOP,
                    maxWidth: larguraMaxima(
                      faixa.map((p) => p.formato),
                      W,
                    ),
                  }}
                >
                  {faixa.map((peca) => (
                    <div
                      key={peca.id}
                      className="min-w-0"
                      // cada peça cresce na proporção do formato: a faixa fecha com altura única
                      style={{ flex: `${razao(peca.formato)} 1 0` }}
                    >
                      <PecaCard
                        peca={peca}
                        compacto={celular || faixa.length >= 4}
                        onOpen={() => setAberta(peca)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-16 border border-dashed border-border py-24 text-center md:mt-24">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Portfólio em publicação
              </p>
              <p className="mx-auto mt-4 max-w-[40ch] font-display text-2xl font-light italic text-muted-foreground">
                As peças chegam aqui em breve.
              </p>
            </div>
          )}
        </div>
      </main>

      <Convite />
      <Footer />

      <PieceLightbox piece={aberta} onClose={() => setAberta(null)} />
    </div>
  );
}

function PecaCard({
  peca,
  compacto,
  onOpen,
}: {
  peca: PecaNoMosaico;
  compacto: boolean;
  onOpen: () => void;
}) {
  const capa = peca.images[0];
  const extras = peca.images.length - 1;
  const f = FORMATOS[peca.formato];

  return (
    <button type="button" onClick={onOpen} className="group flex w-full flex-col text-left">
      <div
        className="relative w-full max-w-full overflow-hidden bg-muted"
        style={{ aspectRatio: `${f.w} / ${f.h}` }}
      >
        <img
          src={capa.url}
          alt={capa.alt || `${peca.kind} — ${peca.client}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {extras > 0 && (
          <span className="absolute bottom-3 left-3 bg-background/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] tabular-nums">
            +{extras} {extras === 1 ? "imagem" : "imagens"}
          </span>
        )}
      </div>

      <h2
        className={`font-display font-semibold tracking-[-0.025em] ${
          compacto ? "mt-3 text-lg leading-tight" : "mt-5 text-2xl"
        }`}
      >
        {peca.kind}
      </h2>
      <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {peca.client}
      </p>
      {peca.caption && !compacto && (
        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-base">
          {peca.caption}
        </p>
      )}
    </button>
  );
}

/** Fechamento: contato direto, sem formulário. */
function Convite() {
  return (
    <section className="mt-[72px] border-t border-border bg-mint px-6 py-[72px] md:mt-[104px] md:px-10 md:py-[104px]">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn>
          <SectionKicker number="—" label="Próximo projeto" />
          <h2 className="mt-6 max-w-[17ch] font-display text-[clamp(2.25rem,6vw,4.875rem)] font-semibold leading-[0.96] tracking-[-0.035em]">
            Sua marca merece a{" "}
            <span className="font-light italic text-mint-ink">melhor prateleira.</span>
          </h2>
          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-foreground/70 md:text-lg">
            Sem formulário e sem proposta genérica. Manda uma mensagem contando qual produto precisa
            de rótulo — a gente responde com o caminho, o prazo e o valor.
          </p>

          <a
            href="https://wa.me/5544988085474?text=Ol%C3%A1%2C%20vim%20pelo%20portf%C3%B3lio%20de%20r%C3%B3tulos%20e%20embalagens%20e%20quero%20falar%20sobre%20um%20projeto."
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3.5 bg-foreground px-9 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            Falar no WhatsApp <span aria-hidden>→</span>
          </a>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/50">
            Ou escreva para{" "}
            <a
              href="mailto:negocios@mambrand.com.br"
              className="border-b border-foreground/30 text-foreground"
            >
              negocios@mambrand.com.br
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
