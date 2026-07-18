import { createFileRoute } from "@tanstack/react-router";
// Fonte única: o HTML aprovado em design/aprovados é servido aqui, no domínio da marca.
import diagnosticoHtml from "../../design/aprovados/diagnostico-ciclo-de-marca.html?raw";

export const Route = createFileRoute("/diagnostico")({
  server: {
    handlers: {
      GET: () =>
        new Response(diagnosticoHtml, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=0, must-revalidate",
          },
        }),
    },
  },
});
