/**
 * Padrão do mosaico de Rótulos e Embalagens (aprovado pelo Michel em 02/10/2026).
 *
 * Só três formatos entram. O corte é escolhido no upload e a imagem sai no
 * tamanho exato. A página não tem ordem fixa: a cada peça que entra ou sai, o
 * site recompõe as faixas para todas ficarem perto da mesma altura — nada de
 * peça gigante sozinha numa faixa.
 */

export type Formato = "d" | "q" | "e";

export const FORMATOS: Record<Formato, { nome: string; rotulo: string; w: number; h: number }> = {
  d: { nome: "Deitada", rotulo: "16:9", w: 1920, h: 1080 },
  q: { nome: "Quadrada", rotulo: "1:1", w: 1080, h: 1080 },
  e: { nome: "Em pé", rotulo: "9:16", w: 1080, h: 1920 },
};

export const ORDEM_FORMATOS: Formato[] = ["d", "q", "e"];

export function razao(f: Formato) {
  return FORMATOS[f].w / FORMATOS[f].h;
}

/** Recorte em pixels do arquivo original. */
export type Recorte = { x: number; y: number; w: number; h: number };

/**
 * Uma imagem da peça. `url` é o JPG final no formato `f`; `original` guarda o
 * arquivo enviado para dar para refazer o corte sem subir de novo.
 */
export type PieceImage = {
  url: string;
  alt: string;
  w: number | null;
  h: number | null;
  f?: Formato;
  original?: string;
  crop?: Recorte;
};

/** Formato mais próximo de uma proporção — vale para peças antigas sem `f`. */
export function formatoMaisProximo(w: number, h: number): Formato {
  const r = w / h;
  let melhor: Formato = "d";
  let dist = Infinity;
  for (const f of ORDEM_FORMATOS) {
    const d = Math.abs(Math.log(r / razao(f)));
    if (d < dist) {
      dist = d;
      melhor = f;
    }
  }
  return melhor;
}

export function formatoDe(img: PieceImage): Formato {
  if (img.f && img.f in FORMATOS) return img.f;
  if (img.w && img.h) return formatoMaisProximo(img.w, img.h);
  return "q";
}

/** Maior recorte do formato que cabe no original, centralizado: o corte natural. */
export function corteNatural(w: number, h: number, f: Formato): Recorte {
  const r = razao(f);
  let cw = w;
  let ch = cw / r;
  if (ch > h) {
    ch = h;
    cw = ch * r;
  }
  return { x: (w - cw) / 2, y: (h - ch) / 2, w: cw, h: ch };
}

export function normalizarImagens(valor: unknown): PieceImage[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .filter((i): i is Record<string, unknown> => typeof i === "object" && i !== null)
    .map((i) => {
      const img: PieceImage = {
        url: typeof i.url === "string" ? i.url : "",
        alt: typeof i.alt === "string" ? i.alt : "",
        w: typeof i.w === "number" ? i.w : null,
        h: typeof i.h === "number" ? i.h : null,
      };
      if (i.f === "d" || i.f === "q" || i.f === "e") img.f = i.f;
      if (typeof i.original === "string") img.original = i.original;
      const c = i.crop as Record<string, unknown> | undefined;
      if (c && [c.x, c.y, c.w, c.h].every((n) => typeof n === "number")) {
        img.crop = c as Recorte;
      }
      return img;
    })
    .filter((i) => i.url);
}

/* ---------------------------------------------------------------- mosaico */

/** Medidas de cada faixa — usadas pelo compor() e pelo CSS da página. */
export const GAP_DESKTOP = 24;
export const GAP_CELULAR = 12;
export const LIMITE_CELULAR = 640;

type Receita = { d: number; q: number; e: number; n: number; soma: number };

function receitas(maxN: number): Receita[] {
  const out: Receita[] = [];
  for (let d = 0; d <= maxN; d++)
    for (let q = 0; q <= maxN - d; q++)
      for (let e = 0; e <= maxN - d - q; e++) {
        const n = d + q + e;
        if (n) out.push({ d, q, e, n, soma: d * razao("d") + q * razao("q") + e * razao("e") });
      }
  return out;
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Monta as faixas para uma largura de página. A semente sai dos ids, então o
 * mesmo conjunto de peças dá sempre o mesmo mosaico — e qualquer peça nova
 * rediagrama tudo.
 */
export function compor<T extends { id: string; formato: Formato }>(
  pecas: T[],
  largura: number,
): T[][] {
  if (pecas.length === 0) return [];
  const celular = largura < LIMITE_CELULAR;
  const gap = celular ? GAP_CELULAR : GAP_DESKTOP;
  const maxN = celular ? 2 : 4;
  const alvoSoma = celular ? 1.55 : 3.1;
  const alvo = (largura - gap * (celular ? 1 : 2)) / alvoSoma;
  const lista = receitas(maxN);
  const custo = (n: number, soma: number) => {
    const desvio = (largura - gap * (n - 1)) / soma / alvo - 1;
    // faixa alta demais pesa mais do que faixa baixa: é o que evita a peça gigante
    return desvio > 0 ? desvio * desvio * 4 : desvio * desvio;
  };

  const semente = hash(
    pecas
      .map((p) => p.id)
      .sort()
      .join("|"),
  );
  let melhor: { faixas: T[][]; total: number } | null = null;

  for (let rodada = 0; rodada < 80; rodada++) {
    const R = rng(semente + rodada * 7919);
    const pool: Record<Formato, T[]> = { d: [], q: [], e: [] };
    for (const p of pecas) pool[p.formato].push(p);
    for (const f of ORDEM_FORMATOS) pool[f].sort(() => R() - 0.5);

    const faixas: T[][] = [];
    let total = 0;
    let anterior: Receita | null = null;

    while (pool.d.length + pool.q.length + pool.e.length > 0) {
      const resto = pool.d.length + pool.q.length + pool.e.length;
      const opcoes = lista
        .filter((r) => r.d <= pool.d.length && r.q <= pool.q.length && r.e <= pool.e.length)
        .map((r) => {
          let c = custo(r.n, r.soma);
          if (anterior && anterior.d === r.d && anterior.q === r.q && anterior.e === r.e) c += 0.04;
          const sobra = resto - r.n;
          if (sobra > 0 && sobra < (celular ? 1 : 2)) c += 0.15;
          return { r, c: c + R() * 0.05 };
        })
        .sort((a, b) => a.c - b.c);
      const escolha = opcoes[Math.floor(R() * Math.min(3, opcoes.length) * R())].r;

      const faixa: T[] = [];
      for (const f of ORDEM_FORMATOS)
        for (let i = 0; i < escolha[f]; i++) faixa.push(pool[f].pop()!);
      faixa.sort(() => R() - 0.5);
      faixas.push(faixa);
      total += custo(escolha.n, escolha.soma);
      anterior = escolha;
    }

    if (!melhor || total < melhor.total) melhor = { faixas, total };
  }

  return melhor!.faixas;
}
