/* ————————————————————————————————————————————————
   Rastreamento — GA4 (+ Google Ads quando a conta existir).
   Um único gtag.js serve as duas contas (config duplo).
   ———————————————————————————————————————————————— */

export const GA4_ID = "G-BSFQ9JTVPQ";
// Google Ads: tag "MAM Publicidade" (conta 707-107-4993).
export const ADS_ID = "AW-18328861802";
// Meta Pixel (Facebook/Instagram) — conjunto de dados "MAM Brand" no Gerenciador de Eventos.
export const META_PIXEL_ID = "1545568493827284";

// Bootstrap do Meta Pixel — injetado no <head> quando há ID. Dispara PageView.
export const META_PIXEL_BOOTSTRAP = META_PIXEL_ID
  ? "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?" +
    "n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;" +
    "n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;" +
    "t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}" +
    "(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');" +
    `fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`
  : "";

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

/* ————————————————————————————————————————————————
   Origem do visitante (gclid/UTM/referrer) — guardada na
   primeira página da sessão para etiquetar qualquer lead
   que ele envie depois (formulário de contato).
   ———————————————————————————————————————————————— */

const ORIGIN_KEY = "mam_origin";

export type VisitOrigin = {
  gclid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  landing_url: string | null;
};

/** Captura a origem na chegada. Parâmetros de campanha sobrescrevem uma origem vazia. */
export function captureOrigin(): void {
  if (typeof window === "undefined") return;
  try {
    const p = new URLSearchParams(window.location.search);
    const origin: VisitOrigin = {
      gclid: p.get("gclid"),
      utm_source: p.get("utm_source"),
      utm_medium: p.get("utm_medium"),
      utm_campaign: p.get("utm_campaign"),
      utm_term: p.get("utm_term"),
      utm_content: p.get("utm_content"),
      referrer: document.referrer || null,
      landing_url: window.location.href,
    };
    const hasCampaign = !!(origin.gclid || origin.utm_source);
    if (sessionStorage.getItem(ORIGIN_KEY) && !hasCampaign) return;
    sessionStorage.setItem(ORIGIN_KEY, JSON.stringify(origin));
  } catch {
    // sessionStorage indisponível (modo privado antigo etc.) — segue sem origem
  }
}

/** Origem guardada da sessão, pra anexar ao envio de formulários. */
export function getOrigin(): Partial<VisitOrigin> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(ORIGIN_KEY) || "{}");
  } catch {
    return {};
  }
}
