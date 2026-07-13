import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Instagram, Youtube, MessageCircle } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionKicker } from "@/components/SectionKicker";
import { ServiceHero } from "@/components/servico/ServiceHero";
import { ProcessTimeline } from "@/components/servico/ProcessTimeline";
import { DeliverableCard } from "@/components/servico/DeliverableCard";
import { CaseCard } from "@/components/servico/CaseCard";
import { ProjectCarousel } from "@/components/servico/ProjectCarousel";
import { BenefitBlock } from "@/components/servico/BenefitBlock";
import { Reveal, Rise } from "@/components/servico/Reveal";
import { ArrowLink } from "@/components/servico/ArrowLink";
import { ContactForm } from "@/components/servico/ContactForm";
import { ScrollProgress } from "@/components/servico/ScrollProgress";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/servicos/branding")({
  // Portfólio (destaques + carrossel) vem do banco — administrado em /admin.
  loader: async () => {
    const [casesRes, projetosRes] = await Promise.all([
      supabase
        .from("cases")
        .select("slug, title, year, category, descriptor, cover_url")
        .eq("published", true)
        .eq("service", "branding")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("portfolio_projects")
        .select("title, year, category")
        .eq("published", true)
        .eq("service", "branding")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    return {
      destaques: casesRes.data ?? [],
      projetos: projetosRes.data ?? [],
    };
  },
  head: () => ({
    meta: [
      { title: "Branding — MAM Branding" },
      {
        name: "description",
        content:
          "Marcas construídas para crescer sem desconto. Posicionamento, narrativa, identidade e sistema — branding estratégico que cria percepção de valor.",
      },
      { property: "og:title", content: "Branding — MAM Branding" },
      {
        property: "og:description",
        content:
          "Do diagnóstico ao sistema vivo: método de branding que transforma percepção e permite vender com margem.",
      },
    ],
  }),
  component: BrandingPage,
});

/* ————————————————————————————————————————————————
   Dados. Cases: Black Herva confirmado; os outros 3 são placeholders.
   ———————————————————————————————————————————————— */

const heroMarquee = ["Posicionamento", "Narrativa", "Identidade", "Expressão"];

const problemas = [
  {
    number: "01",
    title: "Crescem sem posicionamento",
    description:
      "Executam, vendem, mas ninguém entende por que escolher essa marca ao invés de outra. Resultado: concorrência por preço.",
  },
  {
    number: "02",
    title: "Investem sem direcionamento",
    description:
      "Marketing, propaganda, design — tudo acontece sem conexão com uma estratégia central. Gasto sem retorno claro.",
  },
  {
    number: "03",
    title: "Vendem sem margem",
    description:
      "Precisam descontar pra vender porque o mercado não entende o valor real. Estrutura cresce, mas a marca não.",
  },
  {
    number: "04",
    title: "Não conseguem escalar",
    description:
      "Dependem do dono ou do time para vender. Marca não trabalha sozinha no mercado. Não cresce sem você.",
  },
];

const principios = [
  {
    rom: "I",
    title: "Decidir antes de executar.",
    description:
      "Estratégia precede estética. Toda decisão visual nasce de uma decisão de negócio.",
  },
  {
    rom: "II",
    title: "Marca é ativo, não enfeite.",
    description:
      "Construímos marcas que sustentam preço, atraem talento e duram décadas — não trimestres.",
  },
  {
    rom: "III",
    title: "Sistema, não peças soltas.",
    description:
      "Entregamos uma lógica de expressão coerente, não um amontoado de artes desconectadas.",
  },
];

const etapas = [
  {
    number: "01",
    title: "Diagnóstico",
    duration: "2 a 3 semanas",
    description:
      "Mergulho no negócio, no mercado e na percepção atual. Respondemos: em qual fase a marca está e o que precisa ser resolvido primeiro.",
    entregas: [
      "Imersão executiva",
      "Pesquisa de percepção",
      "Mapeamento competitivo",
      "Relatório estratégico",
    ],
  },
  {
    number: "02",
    title: "Estratégia",
    duration: "3 a 4 semanas",
    description:
      "Definição do território da marca: propósito, posicionamento, público, promessa e arquitetura. Aqui o negócio ganha clareza sobre onde quer chegar.",
    entregas: [
      "Plataforma de marca",
      "Posicionamento",
      "Arquitetura de marca",
      "Personalidade",
    ],
  },
  {
    number: "03",
    title: "Narrativa",
    duration: "2 a 3 semanas",
    description:
      "Tradução da estratégia em linguagem. Construímos a voz, os territórios de conteúdo e os manifestos que dão consistência a tudo o que a marca diz.",
    entregas: ["Tom de voz", "Manifesto", "Naming (quando aplicável)", "Mensagens-chave"],
  },
  {
    number: "04",
    title: "Identidade",
    duration: "4 a 6 semanas",
    description:
      "Sistema visual que expressa a estratégia. Símbolo, tipografia, cor e composição se organizam como um vocabulário — não como um conjunto de peças soltas.",
    entregas: ["Símbolo e logotipo", "Tipografia", "Paleta cromática", "Princípios visuais"],
  },
  {
    number: "05",
    title: "Sistema",
    duration: "3 a 5 semanas",
    description:
      "Operacionalização. Manual, guidelines, templates e a estrutura para que a marca viva consistente entre times internos, parceiros e fornecedores.",
    entregas: ["Manual de marca", "Aplicações-chave", "Templates", "Handoff e treinamento"],
  },
];

const entregaveis = [
  {
    number: "01",
    title: "Manual de Marca",
    description:
      "O documento que guia todas as decisões futuras. Sem isso, sua marca vira inconsistente. Com isso, qualquer pessoa na sua equipe sabe como falar em nome da marca.",
  },
  {
    number: "02",
    title: "Identidade Visual",
    description:
      "Logo, tipografia, paleta de cores, iconografia e sistema de componentes. Tudo funciona como um vocabulário visual coeso — não como peças desconectadas.",
  },
  {
    number: "03",
    title: "Aplicações",
    description:
      "Como a marca funciona na prática: rotulagem, material impresso, templates digitais, assinatura de e-mail. Cada ponto de contato é pensado.",
  },
  {
    number: "04",
    title: "Sistema de Expressão",
    description:
      "Padrões de fotografia, ilustração, linguagem visual, tom de voz. É o que torna sua marca reconhecível — quando alguém vê, já sabe que é você.",
  },
  {
    number: "05",
    title: "Guia de Implementação",
    description:
      "Como aplicar a marca no dia a dia — desde a comunicação interna até o ponto de venda. Nada fica ao acaso. Sua equipe sabe exatamente o que fazer.",
  },
];

const resultados = [
  {
    number: "01",
    title: "Venda com margem",
    description:
      "Quando há percepção de valor, o cliente aceita pagar mais. Não precisa descontar. Margem melhora, e o crescimento não depende mais de volume.",
  },
  {
    number: "02",
    title: "Fidelidade",
    description:
      "Cliente volta porque entende por que a marca vale. Não compra uma vez — compra consistentemente. Lifetime value e recomendações crescem naturalmente.",
  },
  {
    number: "03",
    title: "Independência",
    description:
      "Marca trabalha sozinha no mercado. Não depende de você vender, de propaganda ou de desconto. Cresce por reputação, não por grito.",
  },
];

// TODO: trocar pelos links reais (LinkedIn, Instagram, WhatsApp, YouTube).
const socials = [
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "WhatsApp", href: "#", Icon: MessageCircle },
  { label: "YouTube", href: "#", Icon: Youtube },
];

function BrandingPage() {
  const { destaques, projetos } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <ScrollProgress />
      <Navbar />

      <main>
        {/* 01 — HERO */}
        <ServiceHero
          id="hero"
          number="01"
          label="Serviços / Branding"
          title={
            <>
              Marcas não nascem.{" "}
              <span className="font-light italic text-mint-ink">
                Marcas são construídas.
              </span>
            </>
          }
          lead="Construir uma marca é diferente de criar um logo ou escolher cores. É definir o lugar que a marca ocupa na mente do mercado, a narrativa que a sustenta, e como ela se expressa em cada ponto de contato. Quando bem feita, branding transforma percepção — e percepção de valor é o que permite vender com margem, sem desconto."
          ctaLabel="Descubra o momento da sua marca"
          ctaHref="#contato"
          marqueeWords={heroMarquee}
        />

        {/* 02 — O PROBLEMA (seção invertida, near-black) */}
        <section
          id="problema"
          className="scroll-mt-24 bg-foreground px-6 py-24 text-background md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <div className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.22em] text-background/60">
                <span className="tabular-nums">02</span>
                <span className="h-px w-10 bg-current opacity-40" aria-hidden />
                <span>O problema</span>
              </div>
            </Rise>

            <h2 className="mt-10 max-w-[20ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-background">
              <Reveal delay={0.06}>
                <>
                  Marcas sem branding não conseguem{" "}
                  <span className="font-light italic text-mint">
                    sair da correria.
                  </span>
                </>
              </Reveal>
            </h2>

            <div className="mt-16 grid gap-x-12 gap-y-2 md:mt-24 md:grid-cols-2">
              {problemas.map((p, i) => (
                <Rise
                  key={p.number}
                  delay={(i % 2) * 0.08}
                  className="group border-t border-background/15 py-10 md:py-12"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-background/25 transition-colors duration-500 group-hover:text-mint md:text-6xl">
                      {p.number}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-background md:text-3xl">
                        {p.title}
                      </h3>
                      <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-background/60 md:text-lg">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* 03 — NO QUE ACREDITAMOS (princípios) */}
        <section
          id="abordagem"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="03" label="No que acreditamos" />
            </Rise>
            <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Três princípios{" "}
                  <span className="font-light italic text-mint-ink">orientam</span>{" "}
                  tudo o que entregamos.
                </>
              </Reveal>
            </h2>

            <div className="mt-16 grid gap-x-12 gap-y-12 md:mt-24 md:grid-cols-3">
              {principios.map((p, i) => (
                <Rise
                  key={p.rom}
                  delay={i * 0.08}
                  className="flex flex-col gap-5 border-t border-border pt-8"
                >
                  <span className="font-display text-3xl font-semibold italic text-mint-ink">
                    {p.rom}
                  </span>
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-[1.75rem]">
                    {p.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </Rise>
              ))}
            </div>

            <Rise delay={0.1}>
              <div className="mt-14 bg-mint p-8 md:mt-20 md:p-12">
                <p className="max-w-[68ch] font-display text-xl font-medium leading-snug tracking-[-0.02em] text-foreground md:text-2xl">
                  Quando esses três princípios estão alinhados, a marca não depende
                  mais de propaganda — o mercado a escolhe porque a entende.
                </p>
              </div>
            </Rise>
          </div>
        </section>

        {/* 04 — MÉTODO (timeline rica) */}
        <section
          id="processo"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="04" label="Método" />
            </Rise>
            <h2 className="mt-10 max-w-[24ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Cinco etapas,{" "}
                  <span className="font-light italic text-mint-ink">uma lógica:</span>{" "}
                  do diagnóstico ao sistema vivo.
                </>
              </Reveal>
            </h2>
            <Rise delay={0.12}>
              <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                Cada etapa entrega artefatos concretos e abre a próxima. Nenhum
                trabalho começa pela identidade — começa pela decisão.
              </p>
            </Rise>

            <ProcessTimeline steps={etapas} />
          </div>
        </section>

        {/* 05 — ENTREGÁVEIS */}
        <section
          id="entregaveis"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="05" label="O que você leva" />
            </Rise>
            <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Branding é um{" "}
                  <span className="font-light italic text-mint-ink">
                    pacote completo.
                  </span>
                </>
              </Reveal>
            </h2>

            <div className="mt-16 grid gap-x-10 gap-y-14 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
              {entregaveis.map((d, i) => (
                <DeliverableCard
                  key={d.number}
                  number={d.number}
                  title={d.title}
                  description={d.description}
                  delay={(i % 3) * 0.05}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 06 — PORTFÓLIO */}
        <section
          id="cases"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="06" label="Portfólio" />
            </Rise>
            <div className="mt-10 grid items-end gap-6 md:grid-cols-12">
              <h2 className="max-w-[20ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em] md:col-span-8">
                <Reveal delay={0.06}>
                  <>
                    Marcas que confiaram{" "}
                    <span className="font-light italic text-mint-ink">no processo.</span>
                  </>
                </Reveal>
              </h2>
              <Rise delay={0.12} className="md:col-span-4">
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  Uma seleção dos trabalhos mais recentes. Cada projeto começou por
                  uma decisão de negócio — e terminou em um sistema de marca.
                </p>
              </Rise>
            </div>

            {/* 6 destaques — 2 por linha (cards grandes) */}
            <div className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-2 md:gap-y-24">
              {destaques.map((c, i) => (
                <CaseCard
                  key={c.slug}
                  title={c.title}
                  year={c.year}
                  category={c.category}
                  descriptor={c.descriptor}
                  href={`/cases/${c.slug}`}
                  image={c.cover_url}
                  delay={(i % 2) * 0.06}
                />
              ))}
            </div>
          </div>

          {/* Carrossel — repertório ilimitado (full-bleed) */}
          <div className="mt-28 border-t border-border pt-20 md:mt-40 md:pt-28">
            <div className="mx-auto mb-14 max-w-[1400px] md:mb-20">
              <Rise>
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span aria-hidden>—</span>
                  <span>Mais projetos</span>
                </div>
              </Rise>
              <h3 className="mt-8 max-w-[18ch] font-display text-[clamp(1.75rem,4vw,3.25rem)] font-semibold leading-[1.03] tracking-[-0.03em]">
                <Reveal delay={0.06}>
                  <>
                    Um recorte mais amplo do{" "}
                    <span className="font-light italic text-mint-ink">repertório.</span>
                  </>
                </Reveal>
              </h3>
            </div>

            <ProjectCarousel projetos={projetos} />

            <div className="mx-auto mt-20 flex max-w-[1400px] flex-col gap-6 border-t border-border pt-12 md:mt-28 md:flex-row md:items-end md:justify-between">
              <Rise>
                <p className="max-w-[46ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Quer saber se a sua marca está no momento certo para um projeto
                  de branding? Começamos pelo diagnóstico.
                </p>
              </Rise>
              <Rise delay={0.06}>
                <ArrowLink href="#contato" size="lg">
                  Agendar diagnóstico
                </ArrowLink>
              </Rise>
            </div>
          </div>
        </section>

        {/* 07 — RESULTADO */}
        <section
          id="resultado"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="07" label="Resultado" />
            </Rise>
            <h2 className="mt-10 max-w-[20ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Quando branding é construído{" "}
                  <span className="font-light italic text-mint-ink">de verdade.</span>
                </>
              </Reveal>
            </h2>

            <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
              {resultados.map((r, i) => (
                <BenefitBlock
                  key={r.number}
                  number={r.number}
                  title={r.title}
                  description={r.description}
                  delay={i * 0.05}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 08 — CONTATO */}
        <section
          id="contato"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="08" label="Próximo passo" />
            </Rise>

            <h2 className="mt-12 max-w-[24ch] font-display text-[clamp(2.25rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
              <Reveal delay={0.06}>
                <>
                  Sua marca está crescendo,{" "}
                  <span className="font-light italic text-mint-ink">
                    mas você ainda precisa descontar?
                  </span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <div className="mt-10 bg-mint p-8 md:p-10">
                <p className="max-w-[60ch] font-display text-lg font-medium leading-snug tracking-[-0.01em] text-foreground md:text-xl">
                  Se a resposta é sim, você não tem marca — tem propaganda. Vamos
                  conversar sobre o que falta.
                </p>
              </div>
            </Rise>

            <div className="mt-16 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-x-10">
              <Rise delay={0.12} className="md:col-span-5">
                <p className="max-w-[44ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                  Descubra o que sua marca precisa agora para vender com valor, sem
                  depender de promoção. Conte um pouco sobre seu momento —
                  respondemos pessoalmente.
                </p>

                <div className="mt-10">
                  <ArrowLink href="#contact-form" variant="pill" size="lg">
                    Conversar sobre a sua marca
                  </ArrowLink>
                </div>

                <div className="mt-12">
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

              <Rise delay={0.15} className="md:col-span-6 md:col-start-7">
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
