import { Play } from "lucide-react";

export type VideoItem = {
  id: string;
  client: string;
  objective: string;
  channel: string;
  format: "vertical" | "horizontal";
  duration: string;
  video_url: string | null;
  youtube_id: string | null;
  cover_url: string | null;
  cover_alt: string;
  preview_seconds: number;
};

/**
 * Card de vídeo — mesmo desenho do CaseCard: capa, e abaixo o cliente com a
 * duração na mesma linha de base, canal · formato, e o objetivo.
 */
export function VideoPiece({
  item,
  onOpen,
}: {
  item: VideoItem;
  onOpen: (item: VideoItem) => void;
}) {
  const vertical = item.format === "vertical";

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group flex w-full flex-col text-left"
    >
      <div
        className={`relative w-full overflow-hidden bg-mint ${
          vertical ? "aspect-[9/16]" : "aspect-video"
        }`}
      >
        {item.cover_url ? (
          <img
            src={item.cover_url}
            alt={item.cover_alt || `Frame do vídeo — ${item.client}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Em breve
            </span>
          </div>
        )}

        <span className="absolute bottom-3.5 left-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 transition-colors group-hover:bg-mint">
          <Play className="h-3.5 w-3.5 translate-x-[1px] fill-foreground text-foreground" />
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-semibold tracking-[-0.02em] md:text-[23px]">
          {item.client}
        </h3>
        {item.duration && (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {item.duration}
          </span>
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-muted-foreground">
        {item.channel && <span>{item.channel}</span>}
        {item.channel && <span aria-hidden>·</span>}
        <span>{vertical ? "Vertical 9:16" : "Horizontal 16:9"}</span>
      </div>

      {item.objective && (
        <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-muted-foreground">
          {item.objective}
        </p>
      )}
    </button>
  );
}
