import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactCTA } from "@/components/ContactCTA";
import { SectionKicker } from "@/components/SectionKicker";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Diário — MAM Branding" },
      {
        name: "description",
        content: "Notas, ensaios e leituras sobre marca, estratégia e cultura.",
      },
      { property: "og:title", content: "Diário — MAM Branding" },
      {
        property: "og:description",
        content: "Notas, ensaios e leituras sobre marca, estratégia e cultura.",
      },
    ],
  }),
  component: DiarioPage,
});

function DiarioPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="px-6 pt-40 md:px-10 md:pt-56">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <SectionKicker number="—" label="Diário" />
            <h1 className="mt-10 max-w-[22ch] font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[1] tracking-[-0.03em]">
              Primeiras notas{" "}
              <span className="font-light italic text-mint-ink">a caminho.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Aqui vão viver ensaios curtos, leituras e bastidores de projeto.
            </p>
          </FadeIn>
        </div>
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}
