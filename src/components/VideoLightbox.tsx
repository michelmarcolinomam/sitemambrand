import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  src?: string;
  poster?: string;
  title?: string;
  subtitle?: string;
};

export function VideoLightbox({ open, onClose, src, poster, title, subtitle }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Vídeo"}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 px-4 py-10 backdrop-blur-sm animate-fade-in"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black md:right-8 md:top-8"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[1200px] flex-col gap-6"
      >
        <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "16 / 9" }}>
          {src ? (
            <video
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white/70">
              {poster && (
                <img
                  src={poster}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
              )}
              <div className="relative font-mono text-[11px] uppercase tracking-[0.28em] text-white/60">
                Vídeo em breve
              </div>
              <div className="relative max-w-md font-display text-2xl font-light italic text-white/90">
                Esta história será publicada em breve.
              </div>
            </div>
          )}
        </div>
        {(title || subtitle) && (
          <div className="text-white">
            {title && (
              <div className="font-display text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="mt-1 text-sm text-white/70 md:text-base">{subtitle}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
