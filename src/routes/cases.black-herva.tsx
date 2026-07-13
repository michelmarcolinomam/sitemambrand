import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Linkedin, Instagram, Youtube, MessageCircle, Play } from "lucide-react";
import { motion, useInView } from "motion/react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionKicker } from "@/components/SectionKicker";
import { Reveal, Rise } from "@/components/servico/Reveal";
import { ArrowLink } from "@/components/servico/ArrowLink";
import { ContactForm } from "@/components/servico/ContactForm";
import { ScrollProgress } from "@/components/servico/ScrollProgress";

export const Route = createFileRoute("/cases/black-herva")({
  head: () => ({
    meta: [
      { title: "Case Black Herva — MAM Branding" },
      {
        name: "description",
        content:
          "Da visão de um empreendedor à maior marca de erva-mate da América Latina. 13 anos de branding estratégico desde a fundação.",
      },
      { property: "og:title", content: "Case Black Herva — MAM Branding" },
      {
        property: "og:description",
        content:
          "Mercado fragmentado, sem liderança: como o posicionamento transformou erva-mate em marca. +2.500% em vendas nos primeiros 5 anos.",
      },
    ],
  }),
  component: BlackHervaPage,
});

/* ————————————————————————————————————————————————
   Dados do case.
   Imagens: placeholders picsum até as fotos reais (ver STATUS.md).
   ———————————————————————————————————————————————— */

const heroMeta = ["Erva-mate", "2011 — presente", "Branding desde a fundação"];

const insights = [
  {
    number: "01",
    title: "Posicionamento",
    description: 'Qualidade + Tradição + Modernidade. "Erva que resgata ritmo".',
  },
  {
    number: "02",
    title: "Público",
    description:
      "Consumidor que já tomava erva, mas queria marca que respeitasse sua inteligência.",
  },
  {
    number: "03",
    title: "Narrativa",
    description: "Marca que fala do que a erva representa: ritual, pausa, conexão.",
  },
  {
    number: "04",
    title: "Sistema",
    description: "Um vocabulário visual coeso. Não peças soltas, mas um sistema único.",
  },
];

const resultados = [
  { kicker: "Crescimento", value: 2500, prefix: "+", suffix: "%", final: "+2.500%", label: "em vendas nos primeiros 5 anos" },
  { kicker: "Posição", value: null, final: "Nº1", label: "Maior marca da América Latina" },
  { kicker: "Margem", value: 45, prefix: "+", suffix: "%", final: "+45%", label: "Crescimento de margem" },
] as const;

// TODO: trocar pelos links reais (mesmos da tela de branding).
const socials = [
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "WhatsApp", href: "#", Icon: MessageCircle },
  { label: "YouTube", href: "#", Icon: Youtube },
];

/* ————————————————————————————————————————————————
   Blocos locais do case.
   ———————————————————————————————————————————————— */

/** Imagem com unveil (zoom-out na entrada) + zoom sutil no hover. */
function UnveilImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <motion.figure
      className={`group overflow-hidden bg-muted ${className ?? ""}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.figure>
  );
}

/**
 * Facade de vídeo: poster + play; o iframe do YouTube só carrega no clique.
 * TROQUE AQUI: passe o `videoId` real (o trecho após watch?v= ou /shorts/).
 */
function VideoFacade({
  videoId,
  poster,
  tag,
  alt,
  className,
  playSize = 88,
}: {
  videoId: string;
  poster: string;
  tag: string;
  alt: string;
  className?: string;
  playSize?: number;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      className={`group relative cursor-pointer overflow-hidden bg-muted ${className ?? ""}`}
      onClick={() => videoId && setPlaying(true)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      role="button"
      aria-label={`Assistir: ${alt}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && videoId) setPlaying(true);
      }}
    >
      <img
        src={poster}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {!playing && (
        <>
          <span className="pointer-events-none absolute bottom-5 left-6 font-mono text-[11px] uppercase tracking-[0.22em] text-white/90">
            {tag}
          </span>
          <span
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-foreground/30 text-white backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-foreground/55"
            style={{ height: playSize, width: playSize }}
            aria-hidden
          >
            <Play className="ml-1 h-6 w-6 fill-current" />
          </span>
        </>
      )}
      {playing && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          title={alt}
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </motion.div>
  );
}

/** Contador que sobe até o valor quando entra na tela (formato pt-BR). */
function CountUp({
  value,
  prefix = "",
  suffix = "",
  final,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  final: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [text, setText] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(final);
      return;
    }
    const duration = 1600;
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setText(`${prefix}${Math.round(value * eased).toLocaleString("pt-BR")}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(step);
      else setText(final);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, prefix, suffix, final]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}

/* ————————————————————————————————————————————————
   Página.
   ———————————————————————————————————————————————— */

function BlackHervaPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <ScrollProgress />
      <Navbar />

      <main>
        {/* HERO */}
        <section className="px-6 pb-10 pt-20 md:px-10 md:pb-16 md:pt-28">
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <nav aria-label="breadcrumb" className="mb-10 flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/servicos/branding" className="text-foreground hover:underline">
                  Serviços
                </Link>
                <span>/</span>
                <Link to="/servicos/branding" className="text-foreground hover:underline">
                  Portfólio
                </Link>
                <span>/</span>
                <span>Black Herva</span>
              </nav>
            </Rise>

            <Rise delay={0.04}>
              <SectionKicker number="—" label="Case Study" />
            </Rise>

            <h1 className="mt-10 max-w-[18ch] font-display text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              <Reveal delay={0.08}>Black Herva</Reveal>
            </h1>

            <Rise delay={0.14}>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                {heroMeta.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Rise>

            <Rise delay={0.18}>
              <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Da visão de um empreendedor à maior marca de erva-mate da América
                Latina. Uma história de 13 anos observando como as decisões
                estratégicas criam mercados.
              </p>
            </Rise>
          </div>

          {/* full-bleed */}
          <UnveilImage
            src="https://picsum.photos/seed/bh-hero/1600/900"
            alt="Contexto visual do projeto Black Herva"
            className="relative left-1/2 mt-16 aspect-video w-screen -translate-x-1/2"
          />
        </section>

        {/* 01 — O DESAFIO */}
        <section className="px-6 pt-28 md:px-10 md:pt-44">
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="01" label="O desafio" />
            </Rise>

            <div className="mt-16 grid items-start gap-10 md:grid-cols-[1fr_1.3fr] md:gap-20">
              <div className="flex flex-col gap-6">
                <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                  <Reveal>
                    <>
                      Mercado fragmentado,{" "}
                      <span className="font-light italic text-mint-ink">
                        sem liderança.
                      </span>
                    </>
                  </Reveal>
                </h2>
                <Rise delay={0.06}>
                  <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                    Erva-mate era commodidade. Dezenas de marcas, mas nenhuma era
                    marca de verdade. Tudo era preço, varejo, volume. Não havia
                    posicionamento.
                  </p>
                </Rise>
                <Rise delay={0.1}>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">
                    O momento era agora
                  </h3>
                </Rise>
                <Rise delay={0.12}>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    O cliente tinha visão. Queria criar uma marca que durasse
                    décadas. Mas não sabia por onde começar. Tinha produto, paixão
                    — faltava clareza estratégica.
                  </p>
                </Rise>
                <Rise delay={0.14}>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Quando chegou à MAM, a pergunta era direta: &ldquo;Como
                    transformamos erva-mate em marca?&rdquo;
                  </p>
                </Rise>
              </div>

              <UnveilImage
                src="https://picsum.photos/seed/bh-embalagem-antiga/640/800"
                alt="Embalagem anterior — sem marca"
                className="aspect-[4/5] w-full"
              />
            </div>
          </div>
        </section>

        {/* 02 — ESTRATÉGIA */}
        <section className="px-6 pt-20 md:px-10 md:pt-32">
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="02" label="Estratégia" />
            </Rise>

            <h2 className="mt-10 font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Antes da identidade,{" "}
                  <span className="font-light italic text-mint-ink">a decisão.</span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Não começamos por logo. Começamos por perguntas fundamentais sobre
                mercado, posicionamento e narrativa.
              </p>
            </Rise>

            <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col gap-8">
                <Rise>
                  <h3 className="font-display text-2xl font-semibold leading-tight">
                    O pensamento estratégico
                  </h3>
                </Rise>
                <Rise delay={0.05}>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Mergulho no negócio, no mercado, na concorrência. Entender
                    profundamente como o mercado percebia erva-mate. Quais eram os
                    vazios não preenchidos.
                  </p>
                </Rise>
                <Rise delay={0.08}>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Definir posicionamento claro: não seria &ldquo;erva
                    barata&rdquo;, seria &ldquo;erva para quem entende
                    qualidade&rdquo;. Premium, mas acessível.
                  </p>
                </Rise>
                <Rise delay={0.11}>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Construir a narrativa que sustentaria tudo. O tom. A voz. A
                    expressão visual que encarnaria a marca.
                  </p>
                </Rise>
              </div>

              <div className="grid gap-6">
                {insights.map((item, i) => (
                  <Rise key={item.number} delay={i * 0.09}>
                    <div className="flex items-start gap-6 bg-mint p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(13,13,13,0.35)]">
                      <div className="shrink-0 font-display text-5xl font-semibold leading-none opacity-15">
                        {item.number}
                      </div>
                      <div className="flex flex-col gap-3">
                        <h4 className="font-display text-lg font-semibold">
                          {item.title}
                        </h4>
                        <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Rise>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 03 — IDENTIDADE VISUAL */}
        <section className="pt-20 md:pt-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Rise>
              <SectionKicker number="03" label="Identidade visual" />
            </Rise>

            <h2 className="mt-10 font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  O conceito visual{" "}
                  <span className="font-light italic text-mint-ink">traduzido.</span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Cada elemento foi decidido antes de ser desenhado. O símbolo
                representa força — minimalista, memorável, adaptável. A cor
                sintetiza: terra, energia, tradição moderna. A tipografia é forte
                mas acessível. O sistema é coeso. Funciona em embalagem, digital,
                pontos de venda. É um vocabulário visual único.
              </p>
            </Rise>
          </div>

          {/* Galeria full-bleed */}
          <div className="mt-20">
            <UnveilImage
              src="https://picsum.photos/seed/bh-sistema/1600/900"
              alt="Sistema de marca — logo e componentes"
              className="aspect-video w-full"
            />

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2">
              {["Logo principal", "Paleta cromática"].map((label) => (
                <Rise key={label}>
                  <div className="flex aspect-video items-center justify-center bg-muted">
                    <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {label}
                    </span>
                  </div>
                </Rise>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <UnveilImage
                src="https://picsum.photos/seed/bh-tipo/800/800"
                alt="Tipografia"
                className="aspect-square"
              />
              <UnveilImage
                src="https://picsum.photos/seed/bh-comp1/800/800"
                alt="Componente 01"
                className="aspect-square"
              />
              <UnveilImage
                src="https://picsum.photos/seed/bh-comp2/800/800"
                alt="Componente 02"
                className="aspect-square"
              />
            </div>

            <UnveilImage
              src="https://picsum.photos/seed/bh-embalagem/1600/900"
              alt="Aplicação em embalagem"
              className="aspect-video w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2">
              <UnveilImage
                src="https://picsum.photos/seed/bh-antes/900/1000"
                alt="Antes — Sem marca"
                className="aspect-[9/10]"
              />
              <UnveilImage
                src="https://picsum.photos/seed/bh-depois/900/1000"
                alt="Depois — Black Herva"
                className="aspect-[9/10]"
              />
            </div>

            <UnveilImage
              src="https://picsum.photos/seed/bh-padroes/1600/900"
              alt="Sistema de padrões"
              className="aspect-video w-full"
            />
          </div>
        </section>

        {/* 04 — APLICAÇÕES */}
        <section className="pt-20 md:pt-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Rise>
              <SectionKicker number="04" label="Aplicações / Pontos de contato" />
            </Rise>

            <h2 className="mt-10 font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  A marca viva{" "}
                  <span className="font-light italic text-mint-ink">no mercado.</span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Identidade não é só visual — é como a marca se manifesta em cada
                lugar onde o cliente a encontra. Embalagem. Varejo. E-commerce.
                Comunicação. Cada um reforça a mesma mensagem estratégica. Marca
                reconhecível em qualquer contexto.
              </p>
            </Rise>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4">
            <UnveilImage
              src="https://picsum.photos/seed/bh-app1/600/800"
              alt="Embalagem — Frente"
              className="aspect-[3/4]"
            />
            <UnveilImage
              src="https://picsum.photos/seed/bh-app2/600/800"
              alt="Embalagem — Verso"
              className="aspect-[3/4]"
            />
            <UnveilImage
              src="https://picsum.photos/seed/bh-app3/600/800"
              alt="Display em varejo"
              className="aspect-[3/4]"
            />
            <UnveilImage
              src="https://picsum.photos/seed/bh-app4/600/800"
              alt="E-commerce"
              className="aspect-[3/4]"
            />
          </div>
        </section>

        {/* 05 — EM MOVIMENTO */}
        <section className="pt-20 md:pt-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Rise>
              <SectionKicker number="05" label="Em movimento" />
            </Rise>

            <h2 className="mt-10 font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  A marca que se move,{" "}
                  <span className="font-light italic text-mint-ink">convence.</span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Identidade não termina no impresso. O sistema foi desenhado para
                viver em movimento — motion do símbolo, campanha, produto em uso. É
                onde a marca ganha voz e ritmo.
              </p>
            </Rise>
          </div>

          {/* Dois vídeos no mesmo box: 16/9 + vertical 9/16 (1080×1920) */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-[1.7778fr_0.5625fr]">
            {/* TROQUE AQUI: videoId real do filme da marca */}
            <VideoFacade
              videoId=""
              poster="https://picsum.photos/seed/bh-video1/1600/900"
              tag="Filme da marca — 01:20"
              alt="Filme da marca Black Herva"
              className="aspect-video"
            />
            {/* TROQUE AQUI: videoId real do vídeo vertical (aceita ID de Shorts) */}
            <VideoFacade
              videoId=""
              poster="https://picsum.photos/seed/bh-video2/540/960"
              tag="Vertical — 00:45"
              alt="Black Herva em uso — vídeo vertical"
              className="aspect-[9/16]"
              playSize={64}
            />
          </div>
        </section>

        {/* 06 — RESULTADO */}
        <section className="px-6 pt-20 md:px-10 md:pt-32">
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="06" label="Resultado" />
            </Rise>

            <h2 className="mt-10 font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Do zero à liderança{" "}
                  <span className="font-light italic text-mint-ink">
                    da categoria.
                  </span>
                </>
              </Reveal>
            </h2>

            <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
              {resultados.map((r, i) => (
                <Rise key={r.kicker} delay={i * 0.09}>
                  <div className="border-t border-border pt-8">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {r.kicker}
                    </div>
                    <div className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-none">
                      {r.value !== null ? (
                        <CountUp
                          value={r.value}
                          prefix={r.prefix}
                          suffix={r.suffix}
                          final={r.final}
                        />
                      ) : (
                        r.final
                      )}
                    </div>
                    <div className="mt-3 text-base text-muted-foreground">
                      {r.label}
                    </div>
                  </div>
                </Rise>
              ))}
            </div>

            {/* Depoimento */}
            <div className="mt-20 grid gap-10 border-t border-border pt-20 md:grid-cols-[1fr_280px] md:gap-16">
              <Rise>
                <blockquote className="font-display text-2xl font-semibold leading-relaxed md:text-3xl">
                  &ldquo;Quando chegamos à MAM, éramos apenas um produto. A MAM nos
                  transformou em uma marca que as pessoas escolhem porque acreditam
                  nela.&rdquo;
                </blockquote>
                <div className="mt-6 flex flex-col gap-1">
                  <div className="font-semibold">Fundador, Black Herva</div>
                  <div className="text-[0.95rem] text-muted-foreground">
                    CEO &amp; Visionary
                  </div>
                </div>
              </Rise>
              {/* TODO: foto real do founder */}
              <Rise delay={0.08}>
                <div className="flex aspect-square w-full items-center justify-center bg-muted">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Foto do founder
                  </span>
                </div>
              </Rise>
            </div>
          </div>
        </section>

        {/* 07 — CONTATO */}
        <section className="mt-28 border-t border-border px-6 py-24 md:mt-44 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="07" label="Próximo passo" />
            </Rise>

            <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-20">
              <div className="flex flex-col gap-6">
                <h2 className="max-w-[22ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                  <Reveal>
                    <>
                      Sua marca está pronta para a{" "}
                      <span className="font-light italic text-mint-ink">
                        próxima fase?
                      </span>
                    </>
                  </Reveal>
                </h2>

                <Rise delay={0.08}>
                  <p className="max-w-[44ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                    Descubra onde sua empresa está hoje e quais decisões precisam
                    ser tomadas para seu próximo ciclo de crescimento. Conte um
                    pouco sobre o seu momento — respondemos pessoalmente.
                  </p>
                </Rise>

                <Rise delay={0.12}>
                  <div className="mt-6">
                    <ArrowLink href="/servicos/branding" variant="pill" size="lg">
                      Faça um diagnóstico da sua marca
                    </ArrowLink>
                  </div>
                </Rise>

                <Rise delay={0.16}>
                  <div className="mt-10">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Canais
                    </div>
                    <ul className="mt-5 flex flex-wrap items-center gap-3">
                      {socials.map(({ label, href, Icon }) => (
                        <li key={label}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={label}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                          >
                            <Icon className="h-[18px] w-[18px]" />
                          </a>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="mailto:contato@mambranding.com.br"
                      className="mt-8 inline-block text-base text-foreground hover:text-mint-ink md:text-lg"
                    >
                      contato@mambranding.com.br
                    </a>
                  </div>
                </Rise>
              </div>

              <Rise delay={0.1}>
                <ContactForm />
              </Rise>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
