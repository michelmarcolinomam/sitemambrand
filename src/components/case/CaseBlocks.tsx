import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { motion, useInView } from "motion/react";

/* Blocos visuais do template de case — extraídos da rota Black Herva
   quando o portfólio passou a ser administrado pelo painel. */

/** Imagem com unveil (zoom-out na entrada) + zoom sutil no hover.
    Sem `src`, vira o placeholder editorial (caixa muted com o `alt`). */
export function UnveilImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className ?? ""}`}>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {alt || "Imagem"}
        </span>
      </div>
    );
  }

  return (
    <motion.figure
      className={`group overflow-hidden bg-muted ${className ?? ""}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.figure>
  );
}

/** Facade de vídeo: poster + play; o iframe do YouTube só carrega no clique. */
export function VideoFacade({
  videoId,
  poster,
  tag,
  alt,
  className,
  playSize = 88,
}: {
  videoId: string;
  poster: string;
  tag: string;
  alt: string;
  className?: string;
  playSize?: number;
}) {
  const [playing, setPlaying] = useState(false);

  if (!poster && !videoId) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className ?? ""}`}>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {tag || "Vídeo"}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      className={`group relative cursor-pointer overflow-hidden bg-muted ${className ?? ""}`}
      onClick={() => videoId && setPlaying(true)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      role="button"
      aria-label={`Assistir: ${alt}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && videoId) setPlaying(true);
      }}
    >
      {poster ? (
        <img
          src={poster}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-muted" />
      )}
      {!playing && (
        <>
          <span className="pointer-events-none absolute bottom-5 left-6 font-mono text-[11px] uppercase tracking-[0.22em] text-white/90">
            {tag}
          </span>
          <span
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-foreground/30 text-white backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-foreground/55"
            style={{ height: playSize, width: playSize }}
            aria-hidden
          >
            <Play className="ml-1 h-6 w-6 fill-current" />
          </span>
        </>
      )}
      {playing && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          title={alt}
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </motion.div>
  );
}

/** Contador que sobe até o valor quando entra na tela (formato pt-BR). */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  final,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  final: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [text, setText] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(final);
      return;
    }
    const duration = 1600;
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setText(`${prefix}${Math.round(value * eased).toLocaleString("pt-BR")}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(step);
      else setText(final);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, prefix, suffix, final]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}
