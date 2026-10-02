import { createFileRoute } from "@tanstack/react-router";
// Link da bio do Instagram: o HTML aprovado em design/aprovados é servido aqui, no domínio da marca.
import linksHtml from "../../design/aprovados/links-bio.html?raw";

export const Route = createFileRoute("/links")({
  server: {
    handlers: {
      GET: () =>
        new Response(linksHtml, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=0, must-revalidate",
          },
        }),
    },
  },
});
