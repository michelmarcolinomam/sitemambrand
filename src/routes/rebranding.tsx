import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Instagram, Youtube, MessageCircle } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionKicker } from "@/components/SectionKicker";
import { ServiceHero } from "@/components/servico/ServiceHero";
import { ProcessTimeline } from "@/components/servico/ProcessTimeline";
import { CaseCard } from "@/components/servico/CaseCard";
import { ProjectCarousel } from "@/components/servico/ProjectCarousel";
import { BenefitBlock } from "@/components/servico/BenefitBlock";
import { Reveal, Rise } from "@/components/servico/Reveal";
import { ArrowLink } from "@/components/servico/ArrowLink";
import { ContactForm } from "@/components/servico/ContactForm";
import { ScrollProgress } from "@/components/servico/ScrollProgress";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/rebranding")({
  // Portfólio (destaques + carrossel) vem do banco — mesma base da tela de branding, administrada em /admin.
  loader: async () => {
    const [casesRes, projetosRes] = await Promise.all([
      supabase
        .from("cases")
        .select("slug, title, year, category, descriptor, cover_url")
        .eq("published", true)
        .eq("service", "rebranding")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("portfolio_projects")
        .select("title, year, category")
        .eq("published", true)
        .eq("service", "rebranding")
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
      { title: "Rebranding — MAM Brand" },
      {
        name: "description",
        content:
          "A marca cresceu e a identidade ficou para trás. Rebranding estratégico que realinha a expressão da marca com o que o negócio se tornou — preservando o capital construído.",
      },
      { property: "og:title", content: "Rebranding — MAM Brand" },
      {
        property: "og:description",
        content:
          "Do diagnóstico ao sistema renovado: evolução de marca que preserva o que foi construído e recupera relevância.",
      },
    ],
  }),
  component: RebrandingPage,
});

/* ————————————————————————————————————————————————
   Dados. Portfólio (cases + projetos) vem do Supabase, igual à tela de branding.
   ———————————————————————————————————————————————— */

const heroMarquee = ["Reposicionamento", "Evolução", "Coerência", "Relevância"];

const problemas = [
  {
    number: "01",
    title: "A marca envergonha o dono",
    description:
      "O negócio cresceu, o time melhorou, o produto evoluiu. Mas a marca ainda parece a mesma do começo. Apresentar a empresa vira um pedido de desculpa.",
  },
  {
    number: "02",
    title: "O mercado não entende mais o que você é",
    description:
      "A empresa mudou de segmento, expandiu o portfólio ou passou a atender um público diferente — mas a marca ainda comunica o que você era antes. O mercado olha para a versão antiga.",
  },
  {
    number: "03",
    title: "Concorrentes parecem maiores do que são",
    description:
      "Não é que eles sejam melhores. É que a marca deles parece maior, mais confiável, mais profissional. E no mercado, percepção é realidade. Você perde negócios que deveria ganhar.",
  },
  {
    number: "04",
    title: "A marca não converte mais",
    description:
      "O que funcionou para crescer até aqui não está funcionando para o próximo nível. A marca perdeu relevância para o público que você agora quer atrair.",
  },
];

const principios = [
  {
    rom: "I",
    title: "Estratégia antes de estética.",
    description:
      "Rebranding não começa pelo logo. Começa pela pergunta: o que o negócio se tornou, e o que a marca precisa comunicar agora? Identidade visual é consequência — não ponto de partida.",
  },
  {
    rom: "II",
    title: "Preservar o que foi construído.",
    description:
      "Capital de marca não é descartável. Anos de relacionamento, reconhecimento e memória têm valor — e precisam ser mantidos mesmo quando a expressão muda. Evolução, não demolição.",
  },
  {
    rom: "III",
    title: "Sistema, não intervenção pontual.",
    description:
      "Trocar o logo sem ajustar posicionamento, narrativa e expressão é desperdício. Um rebranding real entrega um sistema coerente — para que a nova marca funcione em todos os pontos de contato.",
  },
];

const sinais = [
  {
    number: "01",
    title: "A empresa cresceu de segmento",
    description:
      "Começou atendendo PMEs e agora quer grandes corporações. Ou saiu do regional para o nacional. A marca precisa acompanhar essa mudança de patamar.",
  },
  {
    number: "02",
    title: "O público mudou",
    description:
      "O cliente de hoje não é o mesmo de quando a marca foi criada. Valores, estética e referências do seu público evoluíram — e a marca ficou para trás.",
  },
  {
    number: "03",
    title: "Fusão, aquisição ou expansão",
    description:
      "A estrutura do negócio mudou. Empresas foram unidas, portfólios foram expandidos, novos mercados foram abertos. A marca precisa refletir essa nova realidade.",
  },
  {
    number: "04",
    title: "A marca perdeu relevância",
    description:
      "O mercado mudou ao redor, os concorrentes evoluíram e a sua marca ficou parada no tempo. Não é crise — é momento de atualização estratégica antes que vire crise.",
  },
  {
    number: "05",
    title: "A identidade nunca foi estratégica",
    description:
      "A marca foi criada no início, com pressa, sem método. Funcionou para começar — mas o negócio cresceu além dela. Chegou a hora de fazer certo.",
  },
  {
    number: "06",
    title: "Abertura de capital ou novo ciclo de investimento",
    description:
      "Quando o negócio entra em uma nova fase de captação ou escala, a marca precisa sustentar a credibilidade que esse momento exige.",
  },
];

const etapas = [
  {
    number: "01",
    title: "Diagnóstico",
    duration: "2 a 3 semanas",
    description:
      "Aplicamos o Ciclo de Marca para entender em que fase a marca está hoje, o que gerou o desalinhamento e o que precisa ser preservado versus o que precisa mudar. É aqui que decidimos o alcance do rebranding.",
    entregas: [
      "Diagnóstico do Ciclo de Marca",
      "Auditoria de percepção",
      "Mapeamento de equity",
      "Relatório de recomendação",
    ],
  },
  {
    number: "02",
    title: "Estratégia de evolução",
    duration: "3 a 4 semanas",
    description:
      "Redefinimos o território da marca para o próximo ciclo: novo posicionamento, nova promessa, novo público ou reafirmação do que já existe. Decidimos o que muda, o que fica e o que é amplificado.",
    entregas: [
      "Plataforma de marca atualizada",
      "Novo posicionamento",
      "Estratégia de transição",
      "Arquitetura revisada",
    ],
  },
  {
    number: "03",
    title: "Narrativa renovada",
    duration: "2 a 3 semanas",
    description:
      "A nova estratégia vira linguagem. Reconstruímos a voz da marca, os territórios de conteúdo e os manifestos para que a marca diga — de forma consistente — quem ela é agora.",
    entregas: [
      "Tom de voz revisado",
      "Manifesto",
      "Mensagens-chave",
      "Naming (quando aplicável)",
    ],
  },
  {
    number: "04",
    title: "Nova identidade",
    duration: "4 a 6 semanas",
    description:
      "O sistema visual é redesenhado a partir da nova estratégia — preservando o que tem valor de reconhecimento e renovando o que estava desalinhado. O resultado é uma marca que parece nova, mas não estranha.",
    entregas: [
      "Símbolo e logotipo",
      "Tipografia e paleta",
      "Princípios visuais",
      "Aplicações principais",
    ],
  },
  {
    number: "05",
    title: "Sistema e transição",
    duration: "3 a 5 semanas",
    description:
      "A nova marca precisa entrar no mercado de forma ordenada. Manual, guidelines, plano de transição e handoff para que times internos e parceiros apliquem a marca corretamente desde o primeiro dia.",
    entregas: [
      "Manual de marca",
      "Plano de transição",
      "Templates e aplicações",
      "Handoff e treinamento",
    ],
  },
];

const resultados = [
  {
    number: "01",
    title: "Relevância recuperada",
    description:
      "A marca volta a fazer sentido para o mercado que você quer atrair. O mercado entende o que você é, por que você importa e por que escolher você.",
  },
  {
    number: "02",
    title: "Credibilidade que o negócio merece",
    description:
      "A expressão da marca finalmente representa o tamanho real do negócio. Você para de pedir desculpa pela identidade e começa a usá-la como argumento de venda.",
  },
  {
    number: "03",
    title: "Time e mercado alinhados",
    description:
      "Quando a marca é clara, todo mundo sabe como falar por ela. Time interno, parceiros e fornecedores se alinham com menos fricção. A marca trabalha a seu favor, não contra.",
  },
];

// TODO: trocar pelos links reais (mesma pendência da tela de branding).
const socials = [
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "WhatsApp", href: "#", Icon: MessageCircle },
  { label: "YouTube", href: "#", Icon: Youtube },
];

function RebrandingPage() {
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
          label="Serviços / Rebranding"
          title={
            <>
              A marca cresceu.{" "}
              <span className="font-light italic text-mint-ink">
                A identidade ficou para trás.
              </span>
            </>
          }
          lead="Rebranding não é redesenhar um logo. É realinhar a expressão da marca com o que o negócio se tornou — preservando o capital que já foi construído e abrindo espaço para o próximo ciclo de crescimento. Quando a marca não representa mais a empresa, o mercado não entende o que você é."
          ctaLabel="Conversar sobre a minha marca"
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

            <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-background">
              <Reveal delay={0.06}>
                <>
                  Quando a marca não acompanha{" "}
                  <span className="font-light italic text-mint">
                    o negócio que você construiu.
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
            <h2 className="mt-10 max-w-[24ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Três princípios que{" "}
                  <span className="font-light italic text-mint-ink">guiam</span>{" "}
                  todo processo de evolução.
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
                  Rebranding feito certo não apaga o passado — ele usa o que foi
                  construído como base para o próximo ciclo.
                </p>
              </div>
            </Rise>
          </div>
        </section>

        {/* 04 — QUANDO FAZ SENTIDO (sinais) */}
        <section
          id="quando"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="04" label="Quando faz sentido" />
            </Rise>
            <h2 className="mt-10 max-w-[26ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Os sinais de que é hora de{" "}
                  <span className="font-light italic text-mint-ink">
                    evoluir a marca.
                  </span>
                </>
              </Reveal>
            </h2>
            <Rise delay={0.12}>
              <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                Nem toda marca precisa de rebranding agora. Mas existem sinais
                claros de que chegou a hora.
              </p>
            </Rise>

            <div className="mt-16 grid gap-x-12 md:mt-24 md:grid-cols-2">
              {sinais.map((s, i) => (
                <Rise
                  key={s.number}
                  delay={(i % 2) * 0.08}
                  className="flex items-start gap-6 border-t border-border py-10 md:py-12"
                >
                  <span className="pt-1.5 font-mono text-xs tabular-nums text-muted-foreground">
                    {s.number}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                      {s.description}
                    </p>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* 05 — PROCESSO (timeline) */}
        <section
          id="processo"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="05" label="Processo" />
            </Rise>
            <h2 className="mt-10 max-w-[26ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Cinco etapas.{" "}
                  <span className="font-light italic text-mint-ink">Uma lógica:</span>{" "}
                  do diagnóstico ao sistema renovado.
                </>
              </Reveal>
            </h2>
            <Rise delay={0.12}>
              <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                Rebranding não começa pelo visual. Começa pela compreensão do que
                a marca é hoje, do que o negócio se tornou e de onde precisa
                chegar.
              </p>
            </Rise>

            <ProcessTimeline steps={etapas} />
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
                    Marcas que{" "}
                    <span className="font-light italic text-mint-ink">evoluíram</span>{" "}
                    sem perder o que tinham.
                  </>
                </Reveal>
              </h2>
              <Rise delay={0.12} className="md:col-span-4">
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  Cada projeto de rebranding começa por entender o que foi
                  construído. O que muda é a expressão — o propósito é preservado
                  e amplificado.
                </p>
              </Rise>
            </div>

            {/* Destaques — 2 por linha (cards grandes) */}
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
            {/* Carrossel só aparece quando há projetos de rebranding cadastrados. */}
            {projetos.length > 0 && (
              <>
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
              </>
            )}

            <div
              className={`mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-end md:justify-between ${
                projetos.length > 0 ? "mt-20 border-t border-border pt-12 md:mt-28" : ""
              }`}
            >
              <Rise>
                <p className="max-w-[46ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Quer entender se a sua marca chegou ao momento de um rebranding?
                  Começamos pelo diagnóstico.
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
                  Quando o rebranding é{" "}
                  <span className="font-light italic text-mint-ink">feito certo.</span>
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
                  Sua marca ainda representa{" "}
                  <span className="font-light italic text-mint-ink">
                    o que o negócio virou?
                  </span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <div className="mt-10 bg-mint p-8 md:p-10">
                <p className="max-w-[60ch] font-display text-lg font-medium leading-snug tracking-[-0.01em] text-foreground md:text-xl">
                  Se a resposta for não — ou se você não tiver certeza — é o
                  momento de entender o que mudou e o que precisa ser feito. Vamos
                  conversar sobre o seu momento.
                </p>
              </div>
            </Rise>

            <div className="mt-16 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-x-10">
              <Rise delay={0.12} className="md:col-span-5">
                <p className="max-w-[44ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                  Descubra se chegou o momento de evoluir a sua marca. Conte sobre
                  o que mudou no seu negócio — respondemos pessoalmente.
                </p>

                <div className="mt-10">
                  <ArrowLink href="#contact-form" variant="pill" size="lg">
                    Conversar sobre a minha marca
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
