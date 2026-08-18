import { createFileRoute } from "@tanstack/react-router";
// Fonte única: o HTML aprovado em design/aprovados é servido aqui, no domínio da marca.
import mapaHtml from "../../design/aprovados/mapa-de-marca.html?raw";

export const Route = createFileRoute("/mapa")({
  server: {
    handlers: {
      GET: () =>
        new Response(mapaHtml, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=0, must-revalidate",
          },
        }),
    },
  },
});
