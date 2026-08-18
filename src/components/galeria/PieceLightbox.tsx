import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type Piece = {
  id: string;
  image_url: string;
  alt: string;
  size: string;
};

/**
 * Peça em tela cheia, com navegação por todo o mosaico: setas na tela, teclado
 * e Esc para fechar. Sem miniaturas — o mosaico atrás já é o índice.
 */
export function PieceLightbox({
  pieces,
  openIndex,
  onClose,
}: {
  pieces: Piece[];
  openIndex: number | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(openIndex ?? 0);
  const total = pieces.length;
  const aberto = openIndex !== null;

  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  useEffect(() => {
    if (openIndex !== null) setIndex(openIndex);
  }, [openIndex]);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = anterior;
    };
  }, [aberto, onClose, prev, next]);

  if (!aberto || total === 0) return null;

  const atual = pieces[index];
  if (!atual) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Peça do portfólio"
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-[100] flex flex-col bg-black/92 px-4 py-5 backdrop-blur-sm md:px-10 md:py-8"
    >
      <div className="flex shrink-0 items-center justify-between gap-6">
        <span className="font-mono text-[11px] tabular-nums tracking-[0.2em] text-white/60">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex min-h-0 flex-1 items-center justify-center gap-3 py-4 md:gap-8"
      >
        {total > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Peça anterior"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <img
          src={atual.image_url}
          alt={atual.alt}
          className="max-h-full min-h-0 w-auto max-w-full object-contain"
        />

        {total > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Próxima peça"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {atual.alt && <p className="shrink-0 text-center text-sm text-white/70">{atual.alt}</p>}
    </div>
  );
}
