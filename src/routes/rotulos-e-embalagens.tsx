import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { SectionKicker } from "@/components/SectionKicker";
import { PieceLightbox, type Piece, type PieceImage } from "@/components/galeria/PieceLightbox";
import { supabase } from "@/integrations/supabase/client";
import { serviceJsonLd } from "@/lib/seo";

const TITLE = "Design de Rótulos e Embalagens para Marcas | MAM Brand";
const DESCRIPTION =
  "Rótulos e embalagens que traduzem a estratégia da marca para o ponto de venda. Portfólio de rotulagem da MAM Brand, em Maringá-PR.";

function normalizarImagens(valor: unknown): PieceImage[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .filter((i): i is Record<string, unknown> => typeof i === "object" && i !== null)
    .map((i) => ({
      url: typeof i.url === "string" ? i.url : "",
      alt: typeof i.alt === "string" ? i.alt : "",
      w: typeof i.w === "number" ? i.w : null,
      h: typeof i.h === "number" ? i.h : null,
    }))
    .filter((i) => i.url);
}

export const Route = createFileRoute("/rotulos-e-embalagens")({
  // As peças vêm do banco — administradas em /admin/galeria.
  loader: async () => {
    const { data } = await supabase
      .from("gallery_pieces")
      .select("id, kind, client, caption, images, size")
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

/** Larguras em colunas de 12. A altura é livre: quem manda nela é a imagem. */
type Faixa = { peca: Piece; cols: number }[];

/**
 * Compõe as peças em faixas de ritmo variado. É isso que dá tamanhos diferentes
 * sem encaixe forçado — cada faixa tem altura própria, então a ficha pode viver
 * fora da imagem sem desalinhar a página.
 */
function compor(pecas: Piece[]): Faixa[] {
  const faixas: Faixa[] = [];
  const fila = [...pecas];

  while (fila.length > 0) {
    const atual = fila.shift()!;

    if (atual.size === "grande") {
      faixas.push([{ peca: atual, cols: 12 }]);
      continue;
    }

    if (atual.size === "larga") {
      const acompanha = fila.shift();
      faixas.push(
        acompanha
          ? [
              { peca: atual, cols: 7 },
              { peca: acompanha, cols: 5 },
            ]
          : [{ peca: atual, cols: 12 }],
      );
      continue;
    }

    // normais: três por faixa; sobrando duas, metade cada; sobrando uma, meia faixa
    const trio = [atual, ...fila.splice(0, 2)];
    if (trio.length === 3) faixas.push(trio.map((p) => ({ peca: p, cols: 4 })));
    else if (trio.length === 2) faixas.push(trio.map((p) => ({ peca: p, cols: 6 })));
    else faixas.push([{ peca: atual, cols: 6 }]);
  }

  return faixas;
}

const COL_CLASS: Record<number, string> = {
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  12: "md:col-span-12",
};

function RotulosPage() {
  const { pecas } = Route.useLoaderData();
  const [aberta, setAberta] = useState<Piece | null>(null);
  const faixas = compor(pecas);

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
            <div className="mt-14 flex flex-col gap-10 md:mt-20 md:gap-16">
              {faixas.map((faixa, f) => (
                <div key={f} className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
                  {faixa.map(({ peca, cols }, n) => (
                    <FadeIn key={peca.id} delay={Math.min(n, 3) * 0.06} className={COL_CLASS[cols]}>
                      <PecaCard peca={peca} destaque={cols >= 7} onOpen={() => setAberta(peca)} />
                    </FadeIn>
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
  destaque,
  onOpen,
}: {
  peca: Piece;
  destaque: boolean;
  onOpen: () => void;
}) {
  const capa = peca.images[0];
  const extras = peca.images.length - 1;
  // a proporção vem do arquivo; sem medida, 4:5 como porto seguro
  const proporcao = capa.w && capa.h ? `${capa.w} / ${capa.h}` : "4 / 5";

  return (
    <button type="button" onClick={onOpen} className="group flex w-full flex-col text-left">
      <div className="relative w-full overflow-hidden bg-muted" style={{ aspectRatio: proporcao }}>
        <img
          src={capa.url}
          alt={capa.alt || `${peca.kind} — ${peca.client}`}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {extras > 0 && (
          <span className="absolute bottom-3 left-3 bg-background/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] tabular-nums">
            +{extras} {extras === 1 ? "imagem" : "imagens"}
          </span>
        )}
      </div>

      <h2
        className={`mt-5 font-display font-semibold tracking-[-0.025em] ${
          destaque ? "text-3xl md:text-[2.5rem]" : "text-2xl"
        }`}
      >
        {peca.kind}
      </h2>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {peca.client}
      </p>
      {peca.caption && (
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
