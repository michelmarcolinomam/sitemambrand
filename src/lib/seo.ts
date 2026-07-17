/* ————————————————————————————————————————————————
   SEO — fonte única de verdade de URL/marca e dados estruturados.
   Usado no sitemap, no <head> raiz (JSON-LD) e nos canonical de cada rota.
   ———————————————————————————————————————————————— */

export const SITE_URL = "https://mambrand.com.br";
export const SITE_NAME = "MAM Brand";
export const SITE_DESCRIPTION =
  "Consultoria especializada em construção, evolução e reposicionamento de marcas. Mais de 13 anos de atuação em branding estratégico.";

/** URL absoluta canônica de um caminho interno (ex.: canonical("/branding")). */
export function canonical(path: string): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Dados estruturados (JSON-LD) globais do site.
 * ProfessionalService cobre o SEO local (Maringá-PR).
 * TODO (quando o Michel passar): telefone, endereço (rua/nº/CEP) e horário
 * de atendimento fortalecem MUITO o LocalBusiness — adicionar em `professionalService`.
 */
const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/mam-logo.svg`,
  description: SITE_DESCRIPTION,
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "pt-BR",
};

const professionalService = {
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/mam-logo.svg`,
  description: SITE_DESCRIPTION,
  areaServed: { "@type": "City", name: "Maringá" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Maringá",
    addressRegion: "PR",
    addressCountry: "BR",
  },
};

/** String pronta pra injetar num <script type="application/ld+json">. */
export const structuredDataJson = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [organization, website, professionalService],
});
