import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { SectionKicker } from "@/components/SectionKicker";
import { VideoLightbox } from "@/components/VideoLightbox";
import { VideoPiece, type VideoItem } from "@/components/audiovisual/VideoPiece";
import { supabase } from "@/integrations/supabase/client";
import { serviceJsonLd } from "@/lib/seo";

const TITLE = "Produção de Vídeo e Audiovisual para Marcas | MAM Brand";
const DESCRIPTION =
  "Direção, captação, edição e finalização — do reel de quinze segundos ao filme de marca. Portfólio de audiovisual da MAM Brand, em Maringá-PR.";

export const Route = createFileRoute("/audiovisual")({
  // As peças vêm do banco — administradas em /admin/audiovisual.
  loader: async () => {
    const { data } = await supabase
      .from("videos")
      .select(
        "id, client, objective, channel, format, duration, video_url, youtube_id, cover_url, cover_alt, preview_seconds, section",
      )
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    const all = (data ?? []) as (VideoItem & { section: "conteudo" | "filme" })[];
    return {
      conteudo: all.filter((v) => v.section === "conteudo"),
      filme: all.filter((v) => v.section === "filme"),
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
          name: "Audiovisual",
          serviceType: "Produção audiovisual e vídeo para marcas",
          path: "/audiovisual",
          description:
            "Produção de vídeo para marcas: direção, captação, edição e finalização, em formato vertical para redes e horizontal para filme institucional.",
        }),
      },
    ],
  }),
  component: AudiovisualPage,
});

function AudiovisualPage() {
  const { conteudo, filme } = Route.useLoaderData();
  const [open, setOpen] = useState<VideoItem | null>(null);

  // A esteira do topo é um resumo do que está publicado abaixo.
  const capas = [...conteudo, ...filme].filter((v) => v.cover_url);
  const temAlgo = conteudo.length > 0 || filme.length > 0;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />

      <main className="pt-32 md:pt-44">
        <div className="px-6 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            <FadeIn>
              <SectionKicker number="08" label="Audiovisual" />
              <h1 className="mt-6 max-w-[20ch] font-display text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                A marca também precisa{" "}
                <span className="font-light italic text-mint-ink">se mover.</span>
              </h1>
              <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                Estratégia não termina no papel. Aqui está o que já saiu do nosso estúdio — direção,
                captação, edição e finalização — do reel de quinze segundos ao filme de marca.
                Vertical para quem rola o feed, horizontal para quem senta e assiste.
              </p>
            </FadeIn>
          </div>
        </div>

        {capas.length > 0 && <Esteira capas={capas} />}

        <div className="px-6 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            {conteudo.length > 0 && (
              <Bloco
                numero="01"
                rotulo="Conteúdo de marca"
                titulo="O feed é onde a marca"
                destaque="aparece todo dia."
                texto="Peças verticais de ritmo curto, captadas e finalizadas para Reels e Stories — onde a decisão de parar a rolagem acontece nos três primeiros segundos."
                itens={conteudo}
                onOpen={setOpen}
              />
            )}

            {filme.length > 0 && (
              <Bloco
                numero="02"
                rotulo="Filme e campanha"
                titulo="Quando a marca precisa"
                destaque="explicar o que pensa."
                texto="Vídeos longos de argumento: apresentação de oferta, bastidor de produção e peças de mídia paga. Formato para quem já parou para assistir."
                itens={filme}
                onOpen={setOpen}
              />
            )}

            {!temAlgo && (
              <div className="border border-dashed border-border py-24 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Portfólio em publicação
                </p>
                <p className="mx-auto mt-4 max-w-[40ch] font-display text-2xl font-light italic text-muted-foreground">
                  As peças chegam aqui em breve.
                </p>
              </div>
            )}
          </div>
        </div>

        <Convite />
      </main>

      <Footer />

      <VideoLightbox
        open={open !== null}
        onClose={() => setOpen(null)}
        src={open?.video_url ?? undefined}
        youtubeId={open?.youtube_id ?? undefined}
        poster={open?.cover_url ?? undefined}
        title={open?.client}
        subtitle={[open?.channel, open?.duration].filter(Boolean).join(" · ")}
        aspect={open?.format === "vertical" ? "9 / 16" : "16 / 9"}
      />
    </div>
  );
}

/** Faixa de capas em movimento contínuo — resumo visual do que vem abaixo. */
function Esteira({ capas }: { capas: VideoItem[] }) {
  // Largura aproximada de cada capa com 150px de altura, mais o gap de 12px.
  const larguraDe = (v: VideoItem) => (v.format === "vertical" ? 84 : 267) + 12;

  // O bloco base precisa ser mais largo que a tela, senão sobra vazio na ponta
  // quando há poucas peças cadastradas. Repete o conjunto até passar de 2400px.
  const larguraDoConjunto = capas.reduce((soma, v) => soma + larguraDe(v), 0);
  const repeticoes = Math.max(1, Math.ceil(2400 / Math.max(larguraDoConjunto, 1)));
  const base = Array.from({ length: repeticoes }, () => capas).flat();

  // 4 cópias do bloco base: a animação percorre uma (-25%) e as outras três
  // cobrem qualquer largura de tela.
  const fita = [...base, ...base, ...base, ...base];

  return (
    <div className="mt-14 overflow-hidden border-y border-border py-5 md:mt-[72px] md:py-6">
      <div className="flex w-max gap-3 motion-safe:animate-[audiovisual-march_90s_linear_infinite]">
        {fita.map((v, i) => (
          <img
            key={`${v.id}-${i}`}
            src={v.cover_url ?? ""}
            alt=""
            aria-hidden
            loading="lazy"
            className="h-[150px] w-auto grayscale"
          />
        ))}
      </div>
    </div>
  );
}

function Bloco({
  numero,
  rotulo,
  titulo,
  destaque,
  texto,
  itens,
  onOpen,
}: {
  numero: string;
  rotulo: string;
  titulo: string;
  destaque: string;
  texto: string;
  itens: VideoItem[];
  onOpen: (v: VideoItem) => void;
}) {
  return (
    <section className="border-t border-border py-[72px] first:border-t-0 md:py-[104px]">
      <FadeIn>
        <SectionKicker number={numero} label={rotulo} />
        <h2 className="mt-6 max-w-[22ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          {titulo} <span className="font-light italic text-mint-ink">{destaque}</span>
        </h2>
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground md:text-lg">
          {texto}
        </p>
      </FadeIn>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 md:mt-14 md:grid-cols-3 md:gap-x-5 md:gap-y-11 lg:grid-cols-4">
        {itens.map((item, i) => (
          <FadeIn key={item.id} delay={Math.min(i, 5) * 0.06}>
            <VideoPiece item={item} onOpen={onOpen} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/** Fechamento da página: contato direto, sem formulário. */
function Convite() {
  return (
    <section className="mt-[72px] border-t border-border bg-mint px-6 py-[72px] md:mt-[104px] md:px-10 md:py-[104px]">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn>
          <SectionKicker number="03" label="Próximo projeto" />
          <h2 className="mt-6 max-w-[17ch] font-display text-[clamp(2.25rem,6vw,4.875rem)] font-semibold leading-[0.96] tracking-[-0.035em]">
            Vamos filmar a <span className="font-light italic text-mint-ink">sua marca.</span>
          </h2>
          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-foreground/70 md:text-lg">
            Sem formulário e sem proposta genérica. Manda uma mensagem contando o que você precisa
            gravar — a gente responde com o caminho, o prazo e o valor.
          </p>

          <a
            href="https://wa.me/5544988085474?text=Ol%C3%A1%2C%20vim%20pelo%20portf%C3%B3lio%20de%20audiovisual%20do%20site%20e%20quero%20falar%20sobre%20um%20projeto."
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
