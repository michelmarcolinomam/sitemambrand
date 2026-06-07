import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactCTA } from "@/components/ContactCTA";
import { SectionKicker } from "@/components/SectionKicker";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — MAM Branding" },
      {
        name: "description",
        content:
          "Quem somos, no que acreditamos e como pensamos a construção de marca há mais de 13 anos.",
      },
      { property: "og:title", content: "Sobre — MAM Branding" },
      {
        property: "og:description",
        content: "Quem somos e como pensamos a construção de marca.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="px-6 pt-40 md:px-10 md:pt-56">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <SectionKicker number="—" label="Sobre" />
            <h1 className="mt-10 max-w-[22ch] font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[1] tracking-[-0.03em]">
              Uma página{" "}
              <span className="font-light italic text-mint-ink">em construção.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Estamos preparando este conteúdo com o mesmo cuidado que dedicamos
              às marcas que ajudamos a construir. Em breve, aqui.
            </p>
          </FadeIn>
        </div>
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}
