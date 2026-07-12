import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Problema } from "@/components/Problema";
import { CicloDeMarca } from "@/components/CicloDeMarca";
import { Services } from "@/components/Services";
import { Observando } from "@/components/Observando";
import { Repertorio } from "@/components/Repertorio";
import { Historias } from "@/components/Historias";
import { Projetos } from "@/components/Projetos";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAM Branding — Consultoria estratégica para marcas" },
      {
        name: "description",
        content:
          "Há mais de 13 anos ajudamos empresas a identificar seu momento, reorganizar estratégias e construir marcas preparadas para crescer.",
      },
      {
        property: "og:title",
        content: "MAM Branding — Consultoria estratégica para marcas",
      },
      {
        property: "og:description",
        content:
          "Construção, evolução e reposicionamento de marcas. Diagnóstico proprietário de Ciclo de Marca.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <Problema />
        <CicloDeMarca />
        <Services />
        <Observando />
        <Repertorio />
        <Historias />
        <Projetos />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
