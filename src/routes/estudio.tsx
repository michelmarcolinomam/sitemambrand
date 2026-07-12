import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactCTA } from "@/components/ContactCTA";
import { SectionKicker } from "@/components/SectionKicker";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/estudio")({
  head: () => ({
    meta: [
      { title: "Estúdio — MAM Branding" },
      {
        name: "description",
        content: "Como o estúdio opera, processo, time e parcerias.",
      },
      { property: "og:title", content: "Estúdio — MAM Branding" },
      {
        property: "og:description",
        content: "Como o estúdio opera, processo, time e parcerias.",
      },
    ],
  }),
  component: EstudioPage,
});

function EstudioPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="px-6 pt-40 md:px-10 md:pt-56">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <SectionKicker number="—" label="Estúdio" />
            <h1 className="mt-10 max-w-[22ch] font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[1] tracking-[-0.03em]">
              Bastidores{" "}
              <span className="font-light italic text-mint-ink">em breve.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Esta página vai abrir o estúdio: processo, time e parcerias.
            </p>
          </FadeIn>
        </div>
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}
