/**
 * Modelo de conteúdo de um case do portfólio.
 *
 * A coluna `cases.content` (jsonb) guarda este objeto; o mesmo shape é usado
 * pela página pública (/cases/$slug) e pelo editor do painel (/admin).
 * `normalizeCaseContent` preenche qualquer campo ausente com o default, então
 * um JSON parcial (ou vazio, num case recém-criado) nunca quebra a renderização.
 */

export type CaseImage = { url: string; alt: string };
export type CaseTile = CaseImage & { label: string };

export type CaseInsight = { number: string; title: string; description: string };

/** Um lado (antes ou depois) do comparativo de rebranding: imagem + tópicos. */
export type CaseComparisonSide = { image: CaseImage; points: string[] };

/**
 * Comparativo "antes e depois" em fundo escuro — bloco exclusivo de cases de
 * rebranding. Quando `enabled` é false, o template usa o par simples de imagens
 * (`identity.beforeAfter`), preservando o layout dos cases de branding.
 */
export type CaseComparison = {
  enabled: boolean;
  label: string;
  beforeLabel: string;
  afterLabel: string;
  before: CaseComparisonSide;
  after: CaseComparisonSide;
};

export type CaseVideo = {
  videoId: string;
  poster: string;
  tag: string;
  alt: string;
  vertical: boolean;
};

export type CaseMetric = {
  kicker: string;
  /** Valor numérico para o contador animado; null = mostra só `final` (ex.: "Nº1"). */
  value: number | null;
  prefix: string;
  suffix: string;
  final: string;
  label: string;
};

export type CaseContent = {
  hero: {
    meta: string[];
    lead: string;
    image: CaseImage;
  };
  challenge: {
    title: string;
    titleItalic: string;
    lead: string;
    subtitle: string;
    paragraphs: string[];
    image: CaseImage;
  };
  strategy: {
    title: string;
    titleItalic: string;
    lead: string;
    columnTitle: string;
    paragraphs: string[];
    insights: CaseInsight[];
  };
  identity: {
    title: string;
    titleItalic: string;
    lead: string;
    fullImage1: CaseImage;
    tiles: CaseTile[];
    squares: CaseImage[];
    fullImage2: CaseImage;
    beforeAfter: CaseImage[];
    comparison: CaseComparison;
    fullImage3: CaseImage;
  };
  applications: {
    title: string;
    titleItalic: string;
    lead: string;
    images: CaseImage[];
  };
  motion: {
    title: string;
    titleItalic: string;
    lead: string;
    videos: CaseVideo[];
  };
  results: {
    title: string;
    titleItalic: string;
    metrics: CaseMetric[];
    testimonial: {
      quote: string;
      author: string;
      role: string;
      photoUrl: string;
      photoAlt: string;
    };
  };
};

const emptyImage = (): CaseImage => ({ url: "", alt: "" });

export function defaultCaseContent(): CaseContent {
  return {
    hero: { meta: ["", "", ""], lead: "", image: emptyImage() },
    challenge: {
      title: "",
      titleItalic: "",
      lead: "",
      subtitle: "",
      paragraphs: ["", ""],
      image: emptyImage(),
    },
    strategy: {
      title: "",
      titleItalic: "",
      lead: "",
      columnTitle: "",
      paragraphs: ["", "", ""],
      insights: [
        { number: "01", title: "", description: "" },
        { number: "02", title: "", description: "" },
        { number: "03", title: "", description: "" },
        { number: "04", title: "", description: "" },
      ],
    },
    identity: {
      title: "",
      titleItalic: "",
      lead: "",
      fullImage1: emptyImage(),
      tiles: [
        { label: "Logo principal", url: "", alt: "Logo principal" },
        { label: "Paleta cromática", url: "", alt: "Paleta cromática" },
      ],
      squares: [emptyImage(), emptyImage(), emptyImage()],
      fullImage2: emptyImage(),
      beforeAfter: [
        { url: "", alt: "Antes" },
        { url: "", alt: "Depois" },
      ],
      comparison: {
        enabled: false,
        label: "Comparativo — antes e depois do rebranding",
        beforeLabel: "Antes",
        afterLabel: "Depois",
        before: { image: { url: "", alt: "Identidade anterior" }, points: ["", "", "", ""] },
        after: { image: { url: "", alt: "Nova identidade" }, points: ["", "", "", ""] },
      },
      fullImage3: emptyImage(),
    },
    applications: {
      title: "",
      titleItalic: "",
      lead: "",
      images: [emptyImage(), emptyImage(), emptyImage(), emptyImage()],
    },
    motion: {
      title: "",
      titleItalic: "",
      lead: "",
      videos: [
        { videoId: "", poster: "", tag: "", alt: "", vertical: false },
        { videoId: "", poster: "", tag: "", alt: "", vertical: true },
      ],
    },
    results: {
      title: "",
      titleItalic: "",
      metrics: [
        { kicker: "", value: null, prefix: "", suffix: "", final: "", label: "" },
        { kicker: "", value: null, prefix: "", suffix: "", final: "", label: "" },
        { kicker: "", value: null, prefix: "", suffix: "", final: "", label: "" },
      ],
      testimonial: { quote: "", author: "", role: "", photoUrl: "", photoAlt: "" },
    },
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Merge raso e recursivo: mantém o default onde o JSON salvo não tem o campo. */
function merge<T>(base: T, saved: unknown): T {
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base;
    // Arrays de tamanho fixo do template: cada posição herda o default correspondente
    // (ou o primeiro item como molde, para arrays de tamanho livre como parágrafos).
    return saved.map((item, i) =>
      merge((base as unknown[])[i] ?? (base as unknown[])[0] ?? item, item),
    ) as T;
  }
  // Campos numéricos anuláveis (ex.: metric.value, cujo default é null).
  if (base === null || typeof base === "number") {
    return (saved === null || typeof saved === "number" ? saved : base) as T;
  }
  if (isRecord(base)) {
    if (!isRecord(saved)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(base)) {
      if (key in saved) out[key] = merge((base as Record<string, unknown>)[key], saved[key]);
    }
    return out as T;
  }
  // Demais primitivos: aceita o salvo se o tipo bater.
  return (typeof saved === typeof base ? saved : base) as T;
}

export function normalizeCaseContent(saved: unknown): CaseContent {
  return merge(defaultCaseContent(), saved);
}
