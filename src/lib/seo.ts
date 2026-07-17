/* ————————————————————————————————————————————————
   SEO — fonte única de verdade de URL/marca e dados estruturados.
   Usado no sitemap, no <head> raiz (JSON-LD) e nos canonical de cada rota.
   ———————————————————————————————————————————————— */

export const SITE_URL = "https://mambrand.com.br";
export const SITE_NAME = "MAM Brand";
export const OG_IMAGE = `${SITE_URL}/og-cover.jpg`; // cartão social 1200×630
export const SITE_DESCRIPTION =
  "Consultoria especializada em construção, evolução e reposicionamento de marcas. Mais de 13 anos de atuação em branding estratégico.";

export const CONTACT_EMAIL = "contato@mambrand.com.br";
export const CONTACT_PHONE = "+5544988085474"; // WhatsApp (44) 98808-5474
export const SAME_AS = [
  "https://www.instagram.com/mambranding/",
  "https://www.linkedin.com/company/mambranding/",
  "https://www.youtube.com/@mambrand/playlists",
];

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
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  sameAs: SAME_AS,
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
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  sameAs: SAME_AS,
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

/** JSON-LD de um serviço, referenciando a Organization pelo @id. Para páginas de serviço. */
export function serviceJsonLd(input: {
  name: string;
  serviceType: string;
  path: string;
  description: string;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType,
    url: canonical(input.path),
    description: input.description,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Brasil" },
  });
}

/** JSON-LD de trilha (BreadcrumbList). itens em ordem: [{ name, path }]. */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: canonical(it.path),
    })),
  });
}
