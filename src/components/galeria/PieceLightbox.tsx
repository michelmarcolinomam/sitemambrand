import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { PieceImage } from "@/lib/mosaico";

export type { PieceImage };

export type Piece = {
  id: string;
  kind: string;
  client: string;
  caption: string;
  images: PieceImage[];
};

/**
 * Carrossel da peça: a ficha fica sempre escrita ao lado (ou acima, no celular)
 * e as imagens aparecem inteiras, no formato em que foram cortadas.
 */
export function PieceLightbox({ piece, onClose }: { piece: Piece | null; onClose: () => void }) {
  const [i, setI] = useState(0);
  const total = piece?.images.length ?? 0;

  const prev = useCallback(() => setI((n) => (n - 1 + total) % total), [total]);
  const next = useCallback(() => setI((n) => (n + 1) % total), [total]);

  useEffect(() => {
    setI(0);
  }, [piece?.id]);

  useEffect(() => {
    if (!piece) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = antes;
    };
  }, [piece, onClose, prev, next]);

  if (!piece || total === 0) return null;
  const atual = piece.images[i];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${piece.kind} — ${piece.client}`}
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-[100] overflow-y-auto bg-black/92 px-4 py-5 backdrop-blur-sm md:px-10 md:py-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black md:right-8 md:top-8"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex min-h-full max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:gap-12"
      >
        <div className="relative md:flex-1">
          <img
            src={atual.url}
            alt={atual.alt || `${piece.kind} — ${piece.client}`}
            className="max-h-[70vh] w-full bg-black/20 object-contain"
          />

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Imagem anterior"
                className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white transition-colors hover:bg-white hover:text-black"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Próxima imagem"
                className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white transition-colors hover:bg-white hover:text-black"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="pb-6 md:w-[320px] md:shrink-0 md:pb-0">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            {piece.kind}
          </h2>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            {piece.client}
          </p>
          {piece.caption && (
            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-white/80 md:text-base">
              {piece.caption}
            </p>
          )}

          {total > 1 && (
            <>
              <div className="mt-6 flex flex-wrap gap-2">
                {piece.images.map((img, n) => (
                  <button
                    key={`${img.url}-${n}`}
                    type="button"
                    onClick={() => setI(n)}
                    aria-label={`Ver imagem ${n + 1}`}
                    aria-current={n === i}
                    className={`h-14 w-14 overflow-hidden border bg-black/30 transition-opacity ${
                      n === i
                        ? "border-white opacity-100"
                        : "border-white/25 opacity-55 hover:opacity-85"
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[11px] font-semibold tabular-nums tracking-[0.2em] text-white/50">
                {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
            </>
          )}

          {atual.alt && (
            <p className="mt-5 border-t border-white/15 pt-4 text-xs leading-relaxed text-white/55">
              {atual.alt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
