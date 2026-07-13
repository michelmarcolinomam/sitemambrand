import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Linkedin, Instagram, Youtube, MessageCircle } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionKicker } from "@/components/SectionKicker";
import { Reveal, Rise } from "@/components/servico/Reveal";
import { ArrowLink } from "@/components/servico/ArrowLink";
import { ContactForm } from "@/components/servico/ContactForm";
import { ScrollProgress } from "@/components/servico/ScrollProgress";
import { UnveilImage, VideoFacade, CountUp } from "@/components/case/CaseBlocks";
import { supabase } from "@/integrations/supabase/client";
import { normalizeCaseContent } from "@/lib/case-content";

/* ————————————————————————————————————————————————
   Página de case do portfólio — template Black Herva.
   Conteúdo vem da tabela `cases` (administrada em /admin).
   ———————————————————————————————————————————————— */

export const Route = createFileRoute("/cases/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("cases")
      .select("slug, title, year, category, descriptor, seo_description, content")
      .eq("slug", params.slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw notFound();

    return {
      title: data.title,
      seoDescription: data.seo_description,
      content: normalizeCaseContent(data.content),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Case ${loaderData?.title ?? ""} — MAM Branding` },
      { name: "description", content: loaderData?.seoDescription ?? "" },
      {
        property: "og:title",
        content: `Case ${loaderData?.title ?? ""} — MAM Branding`,
      },
      { property: "og:description", content: loaderData?.seoDescription ?? "" },
    ],
  }),
  component: CasePage,
});

// TODO: trocar pelos links reais (mesmos da tela de branding).
const socials = [
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "WhatsApp", href: "#", Icon: MessageCircle },
  { label: "YouTube", href: "#", Icon: Youtube },
];

function CasePage() {
  const { title, content } = Route.useLoaderData();
  const { hero, challenge, strategy, identity, applications, motion, results } =
    content;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <ScrollProgress />
      <Navbar />

      <main>
        {/* HERO */}
        <section className="px-6 pb-10 pt-20 md:px-10 md:pb-16 md:pt-28">
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <nav
                aria-label="breadcrumb"
                className="mb-10 flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Link to="/servicos/branding" className="text-foreground hover:underline">
                  Serviços
                </Link>
                <span>/</span>
                <Link to="/servicos/branding" className="text-foreground hover:underline">
                  Portfólio
                </Link>
                <span>/</span>
                <span>{title}</span>
              </nav>
            </Rise>

            <Rise delay={0.04}>
              <SectionKicker number="—" label="Case Study" />
            </Rise>

            <h1 className="mt-10 max-w-[18ch] font-display text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              <Reveal delay={0.08}>{title}</Reveal>
            </h1>

            <Rise delay={0.14}>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                {hero.meta.filter(Boolean).map((tag) => (
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
                {hero.lead}
              </p>
            </Rise>
          </div>

          {/* full-bleed */}
          <UnveilImage
            src={hero.image.url}
            alt={hero.image.alt}
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
                      {challenge.title}{" "}
                      <span className="font-light italic text-mint-ink">
                        {challenge.titleItalic}
                      </span>
                    </>
                  </Reveal>
                </h2>
                <Rise delay={0.06}>
                  <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                    {challenge.lead}
                  </p>
                </Rise>
                {challenge.subtitle && (
                  <Rise delay={0.1}>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">
                      {challenge.subtitle}
                    </h3>
                  </Rise>
                )}
                {challenge.paragraphs.filter(Boolean).map((p, i) => (
                  <Rise key={i} delay={0.12 + i * 0.02}>
                    <p className="text-base leading-relaxed text-muted-foreground">{p}</p>
                  </Rise>
                ))}
              </div>

              <UnveilImage
                src={challenge.image.url}
                alt={challenge.image.alt}
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
                  {strategy.title}{" "}
                  <span className="font-light italic text-mint-ink">
                    {strategy.titleItalic}
                  </span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {strategy.lead}
              </p>
            </Rise>

            <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col gap-8">
                {strategy.columnTitle && (
                  <Rise>
                    <h3 className="font-display text-2xl font-semibold leading-tight">
                      {strategy.columnTitle}
                    </h3>
                  </Rise>
                )}
                {strategy.paragraphs.filter(Boolean).map((p, i) => (
                  <Rise key={i} delay={0.05 + i * 0.03}>
                    <p className="text-base leading-relaxed text-muted-foreground">{p}</p>
                  </Rise>
                ))}
              </div>

              <div className="grid gap-6">
                {strategy.insights
                  .filter((item) => item.title || item.description)
                  .map((item, i) => (
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
                  {identity.title}{" "}
                  <span className="font-light italic text-mint-ink">
                    {identity.titleItalic}
                  </span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {identity.lead}
              </p>
            </Rise>
          </div>

          {/* Galeria full-bleed */}
          <div className="mt-20">
            <UnveilImage
              src={identity.fullImage1.url}
              alt={identity.fullImage1.alt}
              className="aspect-video w-full"
            />

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2">
              {identity.tiles.map((tile) => (
                <Rise key={tile.label}>
                  {tile.url ? (
                    <UnveilImage src={tile.url} alt={tile.alt || tile.label} className="aspect-video" />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-muted">
                      <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        {tile.label}
                      </span>
                    </div>
                  )}
                </Rise>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              {identity.squares.map((img, i) => (
                <UnveilImage key={i} src={img.url} alt={img.alt} className="aspect-square" />
              ))}
            </div>

            <UnveilImage
              src={identity.fullImage2.url}
              alt={identity.fullImage2.alt}
              className="aspect-video w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2">
              {identity.beforeAfter.map((img, i) => (
                <UnveilImage key={i} src={img.url} alt={img.alt} className="aspect-[9/10]" />
              ))}
            </div>

            <UnveilImage
              src={identity.fullImage3.url}
              alt={identity.fullImage3.alt}
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
                  {applications.title}{" "}
                  <span className="font-light italic text-mint-ink">
                    {applications.titleItalic}
                  </span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {applications.lead}
              </p>
            </Rise>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4">
            {applications.images.map((img, i) => (
              <UnveilImage key={i} src={img.url} alt={img.alt} className="aspect-[3/4]" />
            ))}
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
                  {motion.title}{" "}
                  <span className="font-light italic text-mint-ink">
                    {motion.titleItalic}
                  </span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {motion.lead}
              </p>
            </Rise>
          </div>

          {/* Dois vídeos no mesmo box: 16/9 + vertical 9/16 (1080×1920) */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-[1.7778fr_0.5625fr]">
            {motion.videos.map((v, i) => (
              <VideoFacade
                key={i}
                videoId={v.videoId}
                poster={v.poster}
                tag={v.tag}
                alt={v.alt}
                className={v.vertical ? "aspect-[9/16]" : "aspect-video"}
                playSize={v.vertical ? 64 : 88}
              />
            ))}
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
                  {results.title}{" "}
                  <span className="font-light italic text-mint-ink">
                    {results.titleItalic}
                  </span>
                </>
              </Reveal>
            </h2>

            <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
              {results.metrics
                .filter((r) => r.kicker || r.final || r.label)
                .map((r, i) => (
                  <Rise key={`${r.kicker}-${i}`} delay={i * 0.09}>
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
                      <div className="mt-3 text-base text-muted-foreground">{r.label}</div>
                    </div>
                  </Rise>
                ))}
            </div>

            {/* Depoimento */}
            {(results.testimonial.quote || results.testimonial.author) && (
              <div className="mt-20 grid gap-10 border-t border-border pt-20 md:grid-cols-[1fr_280px] md:gap-16">
                <Rise>
                  <blockquote className="font-display text-2xl font-semibold leading-relaxed md:text-3xl">
                    &ldquo;{results.testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex flex-col gap-1">
                    <div className="font-semibold">{results.testimonial.author}</div>
                    <div className="text-[0.95rem] text-muted-foreground">
                      {results.testimonial.role}
                    </div>
                  </div>
                </Rise>
                <Rise delay={0.08}>
                  <UnveilImage
                    src={results.testimonial.photoUrl}
                    alt={results.testimonial.photoAlt || "Foto"}
                    className="aspect-square w-full"
                  />
                </Rise>
              </div>
            )}
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
