import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Instagram, Youtube, MessageCircle } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionKicker } from "@/components/SectionKicker";
import { Reveal, Rise } from "@/components/servico/Reveal";
import { CicloAnimatedChart } from "@/components/servico/CicloAnimatedChart";
import { ArrowLink } from "@/components/servico/ArrowLink";
import { ContactForm } from "@/components/servico/ContactForm";
import { ScrollProgress } from "@/components/servico/ScrollProgress";

export const Route = createFileRoute("/servicos/ciclo-de-marca")({
  head: () => ({
    meta: [
      { title: "Ciclo de Marca — MAM Branding" },
      {
        name: "description",
        content:
          "Toda marca está em alguma fase do ciclo. O Ciclo de Marca é o diagnóstico proprietário da MAM: identifica o estágio atual, mapeia prioridades e entrega o plano de ação para o próximo movimento estratégico.",
      },
      { property: "og:title", content: "Ciclo de Marca — MAM Branding" },
      {
        property: "og:description",
        content:
          "Um diagnóstico, não uma opinião. Descubra em qual fase do ciclo sua marca está e qual é o próximo movimento certo.",
      },
    ],
  }),
  component: CicloDeMarcaPage,
});

/* ————————————————————————————————————————————————
   Dados. Portfólio ainda é uma lista editorial estática — as telas de case
   do Ciclo de Marca serão pensadas separadamente (não compartilham a base de
   branding/rebranding). Trocar os placeholders "Cliente 0X" quando definido.
   ———————————————————————————————————————————————— */

// Nós do gráfico do ciclo — forma extraída do desenho do Michel (IMG_1008).
// 6 pontos, 5 rótulos: começo baixo e quase reto → subida → platô alto e plano →
// queda ao vale → retomada subindo até um ponto final SEM rótulo (o próximo ciclo).
// A curva é construída pelo componente a partir destes pontos.
const cicloNodes = [
  {
    number: "01",
    label: "Introdução",
    desc: "Construir fundação, identidade e narrativa.",
    cx: 100,
    cy: 168,
  },
  {
    number: "02",
    label: "Crescimento",
    desc: "Acelerar com consistência e posicionamento.",
    cx: 280,
    cy: 166,
  },
  {
    number: "03",
    label: "Platô",
    desc: "Reler o mercado e renovar a relevância.",
    cx: 405,
    cy: 66,
  },
  {
    number: "04",
    label: "Declínio",
    desc: "Diagnosticar causas e decidir o próximo passo.",
    cx: 700,
    cy: 60,
  },
  {
    number: "05",
    label: "Reestruturação",
    desc: "Reposicionar para o próximo ciclo.",
    cx: 800,
    cy: 128,
  },
  // ponto final sem rótulo — a linha volta a subir: o próximo ciclo recomeçando.
  { cx: 950, cy: 44 },
];

const erros = [
  {
    number: "01",
    title: "Investem na hora errada",
    description:
      "Fazem branding completo quando a marca ainda não tem mercado validado — ou esperam o declínio chegar para agir. O timing certo muda o resultado inteiro.",
  },
  {
    number: "02",
    title: "Resolvem o problema errado",
    description:
      "Trocam a identidade visual quando o problema é de posicionamento. Relançam o produto quando o problema é de distribuição. Sem diagnóstico, a solução não encaixa.",
  },
  {
    number: "03",
    title: "Desperdiçam verba em platô",
    description:
      "Jogam mais dinheiro em marketing numa marca que já parou de crescer. O platô não responde a volume — responde a reposicionamento. Mas ninguém diagnosticou isso.",
  },
  {
    number: "04",
    title: "Confundem sintoma com causa",
    description:
      "Queda de vendas, perda de relevância, dificuldade de contratar — são sintomas. A causa quase sempre é que a marca passou de fase e ninguém percebeu.",
  },
];

const entregaveis = [
  {
    number: "01",
    title: "Relatório de Fase",
    description:
      "Documento que identifica com precisão em qual fase do ciclo sua marca está e o porquê. Não é uma opinião — é uma leitura baseada em dados de mercado, percepção e comportamento do negócio.",
  },
  {
    number: "02",
    title: "Mapa de Prioridades",
    description:
      "O que precisa ser feito, na ordem certa, para que a marca avance para o próximo estágio. Elimina o ruído de ações desnecessárias e concentra energia no que realmente move o ponteiro.",
  },
  {
    number: "03",
    title: "Plano de Ação",
    description:
      "As iniciativas concretas — com escopo, sequência e critérios de sucesso. Cada item do plano foi escolhido porque é o movimento certo para a fase atual, não para a fase que você imagina estar.",
  },
];

const resultados = [
  {
    number: "01",
    title: "Decisão certa na hora certa",
    description:
      "Branding, rebranding, expansão ou reposicionamento — cada um tem um momento adequado. O Ciclo de Marca elimina a adivinhação e diz o que fazer agora.",
  },
  {
    number: "02",
    title: "Verba investida no lugar certo",
    description:
      "Saber a fase da marca evita desperdiçar recursos em soluções que não se aplicam. Cada real investido depois do diagnóstico tem contexto e direção.",
  },
  {
    number: "03",
    title: "Clareza para os próximos 12 meses",
    description:
      "O plano de ação entregue não é genérico. É o mapa específico para o estágio atual da sua marca — com o próximo passo estratégico claramente definido.",
  },
];

// Portfólio editorial — estático por ora. Só a Black Herva aponta para um case real.
const portfolio = [
  {
    name: "Black Herva",
    meta: "Erva-mate · Branding",
    year: "2011–presente",
    href: "/cases/black-herva",
  },
  { name: "Cliente 02", meta: "Categoria · Ciclo de Marca", year: "20XX", href: "#" },
  { name: "Cliente 03", meta: "Categoria · Diagnóstico", year: "20XX", href: "#" },
  { name: "Cliente 04", meta: "Categoria · Reposicionamento", year: "20XX", href: "#" },
  { name: "Cliente 05", meta: "Categoria · Ciclo de Marca", year: "20XX", href: "#" },
  { name: "Cliente 06", meta: "Categoria · Diagnóstico", year: "20XX", href: "#" },
];

// TODO: trocar pelos links reais (mesma pendência das telas de branding/rebranding).
const socials = [
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "WhatsApp", href: "#", Icon: MessageCircle },
  { label: "YouTube", href: "#", Icon: Youtube },
];

function CicloDeMarcaPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <ScrollProgress />
      <Navbar />

      <main>
        {/* 01 — HERO. Mesmo layout da seção 3 da home (Metodologia proprietária):
            kicker → título à esquerda + apoio à direita → gráfico animado embaixo,
            tudo sobre o fundo mint. Conteúdo do hero é o que o Michel codou. */}
        <section
          id="hero"
          className="scroll-mt-24 bg-mint px-6 pt-36 pb-24 md:px-10 md:pt-52 md:pb-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="—" label="Serviços / Ciclo de Marca" />
            </Rise>

            <div className="mt-12 grid gap-12 md:grid-cols-12">
              <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] md:col-span-7">
                <Reveal delay={0.06}>
                  <>
                    Toda marca está em{" "}
                    <span className="font-light italic text-foreground/55">
                      alguma fase do ciclo.
                    </span>
                  </>
                </Reveal>
              </h1>

              <Rise delay={0.15} className="md:col-span-4 md:col-start-9">
                <p className="text-base leading-relaxed text-foreground/70 md:text-lg">
                  A maioria das empresas investe em marca sem saber em qual
                  estágio está. Constrói quando deveria reposicionar. Relança
                  quando deveria consolidar. O Ciclo de Marca é o diagnóstico
                  proprietário da MAM: identifica a fase atual, mapeia as
                  prioridades e entrega o plano de ação para o próximo movimento
                  estratégico.
                </p>
                <div className="mt-8">
                  <ArrowLink href="#contato" size="lg">
                    Fazer o diagnóstico da minha marca
                  </ArrowLink>
                </div>
              </Rise>
            </div>

            {/* Gráfico animado — se constrói e cada fase entra em sincronia. */}
            <div className="mt-20 md:mt-28">
              <CicloAnimatedChart nodes={cicloNodes} />
            </div>
          </div>
        </section>

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
                  Sem diagnóstico, qualquer{" "}
                  <span className="font-light italic text-mint">
                    solução é chute.
                  </span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.12}>
              <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-background/55 md:text-lg">
                A maioria dos problemas de marca não é falta de investimento — é
                investimento no momento errado, na solução errada, para a fase
                errada.
              </p>
            </Rise>

            <div className="mt-16 grid gap-x-12 gap-y-2 md:mt-24 md:grid-cols-2">
              {erros.map((p, i) => (
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

        {/* 03 — O QUE É */}
        <section
          id="o-que-e"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="03" label="O que é" />
            </Rise>
            <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Um diagnóstico,{" "}
                  <span className="font-light italic text-mint-ink">
                    não uma opinião.
                  </span>
                </>
              </Reveal>
            </h2>

            <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-x-10">
              <div className="hidden md:col-span-6 md:block" />
              <Rise delay={0.1} className="md:col-span-5 md:col-start-8">
                <p className="text-base leading-[1.7] text-muted-foreground md:text-lg">
                  O Ciclo de Marca é a metodologia proprietária da MAM para
                  diagnosticar o estágio atual de uma marca. Baseia-se na
                  observação de que toda marca — independente do segmento ou
                  tamanho — passa pelos mesmos estágios ao longo da vida.
                </p>
                <p className="mt-6 text-base leading-[1.7] text-muted-foreground md:text-lg">
                  Identificar esse estágio com precisão muda tudo: o que
                  investir, o que não investir, qual problema resolver primeiro e
                  qual sequência de ações produz resultado real.
                </p>
              </Rise>
            </div>

            <Rise delay={0.1}>
              <div className="mt-14 bg-mint p-8 md:mt-20 md:p-12">
                <p className="max-w-[68ch] font-display text-xl font-medium leading-snug tracking-[-0.01em] text-foreground md:text-2xl">
                  O Ciclo de Marca é um serviço independente. Pode ser o ponto de
                  partida antes de qualquer projeto de branding, ou a ferramenta
                  de orientação para marcas que precisam de clareza estratégica
                  sem um projeto completo.
                </p>
              </div>
            </Rise>
          </div>
        </section>

        {/* 04 — ENTREGÁVEIS */}
        <section
          id="entregaveis"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="04" label="O que você leva" />
            </Rise>
            <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Não uma análise.{" "}
                  <span className="font-light italic text-mint-ink">
                    Um plano.
                  </span>
                </>
              </Reveal>
            </h2>
            <Rise delay={0.12}>
              <p className="mt-8 max-w-[48ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                O Ciclo de Marca entrega três artefatos concretos — feitos para
                orientar decisões, não para engordar gaveta.
              </p>
            </Rise>

            <div className="mt-16 grid gap-x-12 md:mt-20 md:grid-cols-3">
              {entregaveis.map((e, i) => (
                <Rise
                  key={e.number}
                  delay={i * 0.06}
                  className="flex flex-col gap-5 border-t border-border py-10 md:py-12"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {e.number}
                  </span>
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">
                    {e.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {e.description}
                  </p>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* 05 — RESULTADO */}
        <section
          id="resultado"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="05" label="Resultado" />
            </Rise>
            <h2 className="mt-10 max-w-[24ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Quando você sabe onde está,{" "}
                  <span className="font-light italic text-mint-ink">
                    para de errar o alvo.
                  </span>
                </>
              </Reveal>
            </h2>

            <div className="mt-16 grid gap-x-12 md:mt-20 md:grid-cols-3">
              {resultados.map((r, i) => (
                <Rise
                  key={r.number}
                  delay={i * 0.06}
                  className="flex flex-col gap-5 border-t border-border py-10 md:py-12"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {r.number}
                  </span>
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-[1.75rem]">
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {r.description}
                  </p>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* 06 — PORTFÓLIO (lista editorial estática) */}
        <section
          id="portfolio"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="06" label="Portfólio" />
            </Rise>
            <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Marcas que entenderam{" "}
                  <span className="font-light italic text-mint-ink">
                    onde estavam.
                  </span>
                </>
              </Reveal>
            </h2>
            <Rise delay={0.12}>
              <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                Projetos que começaram pelo diagnóstico — e chegaram ao movimento
                certo.
              </p>
            </Rise>

            <div className="mt-16 border-t border-border md:mt-20">
              {portfolio.map((item, i) => (
                <Rise key={item.name} delay={(i % 3) * 0.05}>
                  <a
                    href={item.href}
                    className="grid grid-cols-1 items-baseline gap-x-8 gap-y-3 border-b border-border py-7 transition-opacity hover:opacity-55 md:grid-cols-[1fr_auto_auto] md:py-8"
                  >
                    <span className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-none tracking-[-0.025em]">
                      {item.name}
                    </span>
                    <span className="self-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:ml-auto md:px-12">
                      {item.meta}
                    </span>
                    <span className="self-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:text-right">
                      {item.year}
                    </span>
                  </a>
                </Rise>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
              <Rise>
                <p className="max-w-[40ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                  Quer saber em qual fase do ciclo a sua marca está? O diagnóstico
                  leva menos tempo do que você imagina.
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

        {/* 07 — CONTATO */}
        <section
          id="contato"
          className="scroll-mt-24 border-t border-border px-6 py-24 md:px-10 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <Rise>
              <SectionKicker number="07" label="Próximo passo" />
            </Rise>

            <h2 className="mt-12 max-w-[24ch] font-display text-[clamp(2.5rem,7vw,6.25rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              <Reveal delay={0.06}>
                <>
                  Sua marca está crescendo,{" "}
                  <span className="font-light italic text-mint-ink">
                    mas você não sabe para onde?
                  </span>
                </>
              </Reveal>
            </h2>

            <Rise delay={0.1}>
              <div className="mt-10 bg-mint p-8 md:p-10">
                <p className="max-w-[60ch] font-display text-lg font-medium leading-snug tracking-[-0.01em] text-foreground md:text-xl">
                  O Ciclo de Marca responde essa pergunta com precisão. Em poucas
                  semanas você sai com o diagnóstico, o mapa de prioridades e o
                  próximo passo estratégico na mão.
                </p>
              </div>
            </Rise>

            <div className="mt-16 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-x-10">
              <Rise delay={0.12} className="md:col-span-5">
                <p className="max-w-[44ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                  Conta um pouco sobre a sua marca e o momento em que ela está.
                  Respondemos pessoalmente — sem automação, sem proposta genérica.
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
