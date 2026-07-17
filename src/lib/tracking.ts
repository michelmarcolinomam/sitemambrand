/* ————————————————————————————————————————————————
   Rastreamento — GA4 (+ Google Ads quando a conta existir).
   Um único gtag.js serve as duas contas (config duplo).
   ———————————————————————————————————————————————— */

export const GA4_ID = "G-BSFQ9JTVPQ";
// Google Ads: preencher com o ID da conta (AW-XXXXXXXXX) quando ela existir.
export const ADS_ID = "";

export const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;

// Bootstrap inline do gtag — injetado no <head> (SSR). Config duplo GA4 + Ads.
export const GTAG_BOOTSTRAP = [
  "window.dataLayer=window.dataLayer||[];",
  "function gtag(){dataLayer.push(arguments);}",
  "gtag('js', new Date());",
  `gtag('config', '${GA4_ID}');`,
  ADS_ID ? `gtag('config', '${ADS_ID}');` : "",
]
  .filter(Boolean)
  .join("");

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Dispara o evento de conversão `generate_lead`.
 * Chamar SOMENTE no sucesso real do envio (nunca no clique do botão).
 * Guard de window/gtag evita erro em SSR e quando bloqueador remove o gtag.
 */
export function trackLead(label: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "generate_lead", {
    event_category: "formulario",
    event_label: label,
  });
}
