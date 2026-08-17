import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactCTA } from "@/components/ContactCTA";
import { SectionKicker } from "@/components/SectionKicker";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/rotulos-e-embalagens")({
  head: () => ({
    meta: [
      { title: "Rótulos e Embalagens — MAM Brand" },
      {
        name: "description",
        content:
          "Design de rótulos e embalagens com estratégia de marca — em breve.",
      },
      { property: "og:title", content: "Rótulos e Embalagens — MAM Brand" },
      {
        property: "og:description",
        content:
          "Design de rótulos e embalagens com estratégia de marca — em breve.",
      },
    ],
  }),
  component: RotulosPage,
});

function RotulosPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="px-6 pt-40 md:px-10 md:pt-56">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <SectionKicker number="—" label="Rótulos e Embalagens" />
            <h1 className="mt-10 max-w-[22ch] font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[1] tracking-[-0.03em]">
              Prateleira que vende.{" "}
              <span className="font-light italic text-mint-ink">Em breve.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Design de rótulos e embalagens que traduzem a estratégia da marca
              para o ponto de venda. Esta página está a caminho.
            </p>
          </FadeIn>
        </div>
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}
