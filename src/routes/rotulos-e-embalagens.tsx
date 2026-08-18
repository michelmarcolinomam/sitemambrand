import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { SectionKicker } from "@/components/SectionKicker";
import { PieceLightbox, type Piece } from "@/components/galeria/PieceLightbox";
import { supabase } from "@/integrations/supabase/client";
import { serviceJsonLd } from "@/lib/seo";

const TITLE = "Design de Rótulos e Embalagens para Marcas | MAM Brand";
const DESCRIPTION =
  "Rótulos e embalagens que traduzem a estratégia da marca para o ponto de venda. Portfólio de rotulagem da MAM Brand, em Maringá-PR.";

export const Route = createFileRoute("/rotulos-e-embalagens")({
  // As peças vêm do banco — administradas em /admin/galeria.
  loader: async () => {
    const { data } = await supabase
      .from("gallery_pieces")
      .select("id, image_url, alt, size")
      .eq("service", "rotulos")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    return { pecas: (data ?? []) as Piece[] };
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

/**
 * Encaixe do mosaico. Peça marcada como 'larga' ou 'grande' manda; o resto entra
 * em 'auto' e o ciclo abaixo alterna os formatos para o mosaico ter ritmo sem
 * ninguém precisar escolher tamanho foto a foto.
 */
function classesDoBloco(size: string, i: number): string {
  if (size === "grande") return "col-span-2 row-span-2";
  if (size === "larga") return "col-span-2";

  switch (i % 7) {
    case 0:
      return "col-span-2 row-span-2";
    case 3:
      return "col-span-2";
    case 5:
      return "row-span-2";
    default:
      return "";
  }
}

function RotulosPage() {
  const { pecas } = Route.useLoaderData();
  const [aberta, setAberta] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />

      <main className="pt-32 md:pt-44">
        <div className="px-6 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            <FadeIn>
              <SectionKicker number="—" label="Rótulos e Embalagens" />
              <h1 className="mt-6 max-w-[17ch] font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-semibold leading-[1] tracking-[-0.04em]">
                Tudo que já foi{" "}
                <span className="font-light italic text-mint-ink">para a prateleira.</span>
              </h1>
              <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                Sem separar por cliente e sem case narrado — esses moram nas páginas de marca. Aqui
                é o catado: rótulo, embalagem, pote, sacola e linha completa, tudo junto, do jeito
                que sai do estúdio.
              </p>
            </FadeIn>
          </div>
        </div>

        {pecas.length > 0 ? (
          <>
            {/* Full-bleed de propósito: o mosaico sangra de borda a borda da janela. */}
            <div className="mt-12 grid grid-flow-dense grid-cols-2 gap-1.5 auto-rows-[clamp(150px,26vw,240px)] md:mt-16 md:grid-cols-3 md:gap-2 md:auto-rows-[clamp(200px,23vw,340px)] xl:grid-cols-4 xl:gap-2.5 xl:auto-rows-[clamp(240px,21vw,400px)]">
              {pecas.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAberta(i)}
                  aria-label={p.alt || `Ver peça ${i + 1}`}
                  className={`group relative overflow-hidden bg-mint ${classesDoBloco(p.size, i)}`}
                >
                  <img
                    src={p.image_url}
                    alt={p.alt}
                    loading={i < 6 ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
                </button>
              ))}
            </div>

            <div className="px-6 md:px-10">
              <div className="mx-auto mt-5 flex max-w-[1400px] items-baseline justify-between gap-4 border-t border-border pt-4">
                <p className="max-w-[56ch] text-sm leading-relaxed text-muted-foreground">
                  Cada peça abre grande no clique.
                </p>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
                  {pecas.length} peças
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 md:px-10">
            <div className="mx-auto mt-16 max-w-[1400px] border border-dashed border-border py-24 text-center md:mt-24">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Portfólio em publicação
              </p>
              <p className="mx-auto mt-4 max-w-[40ch] font-display text-2xl font-light italic text-muted-foreground">
                As peças chegam aqui em breve.
              </p>
            </div>
          </div>
        )}

        <Convite />
      </main>

      <Footer />

      <PieceLightbox pieces={pecas} openIndex={aberta} onClose={() => setAberta(null)} />
    </div>
  );
}

/** Fechamento: contato direto, sem formulário — igual ao /audiovisual. */
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
            className="mt-8 inline-flex items-center gap-3.5 bg-foreground px-9 py-5 font-mono text-xs uppercase tracking-[0.2em] text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            Falar no WhatsApp <span aria-hidden>→</span>
          </a>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/50">
            Ou escreva para{" "}
            <a
              href="mailto:contato@mambrand.com.br"
              className="border-b border-foreground/30 text-foreground"
            >
              contato@mambrand.com.br
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
