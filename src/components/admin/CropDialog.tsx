import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FORMATOS,
  ORDEM_FORMATOS,
  corteNatural,
  formatoMaisProximo,
  type Formato,
  type Recorte,
} from "@/lib/mosaico";

/** O que sai do corte: o JPG no tamanho exato e como ele foi cortado. */
export type Corte = { blob: Blob; f: Formato; crop: Recorte };

/** Fonte do corte: um arquivo recém-escolhido ou o original já guardado. */
export type FonteCorte = {
  src: string;
  nome: string;
  f?: Formato;
  crop?: Recorte;
};

const QUALIDADE_JPG = 0.85;

/**
 * Corte de uma arte em um dos três formatos do mosaico. Abre no corte natural
 * (maior recorte possível, centralizado); o quadro se arrasta e aproxima.
 */
export function CropDialog({
  fonte,
  onCancel,
  onConfirm,
}: {
  fonte: FonteCorte | null;
  onCancel: () => void;
  onConfirm: (corte: Corte) => Promise<void>;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [f, setF] = useState<Formato>("d");
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState<Recorte | null>(null);
  const [escala, setEscala] = useState(1);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const arrasto = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);

  useEffect(() => {
    setNat(null);
    setCrop(null);
    setErro(null);
    setZoom(1);
  }, [fonte?.src]);

  // escala tela ↔ pixels do original
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !nat) return;
    const medir = () => setEscala(el.clientWidth / nat.w);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, [nat]);

  function aoCarregar() {
    const img = imgRef.current;
    if (!img) return;
    const n = { w: img.naturalWidth, h: img.naturalHeight };
    setNat(n);
    const formato = fonte?.f ?? formatoMaisProximo(n.w, n.h);
    setF(formato);
    if (fonte?.crop && fonte.f === formato) {
      setCrop(fonte.crop);
      setZoom(fonte.crop.w / corteNatural(n.w, n.h, formato).w);
    } else {
      setCrop(corteNatural(n.w, n.h, formato));
      setZoom(1);
    }
  }

  function limitar(c: Recorte): Recorte {
    if (!nat) return c;
    return {
      ...c,
      x: Math.max(0, Math.min(nat.w - c.w, c.x)),
      y: Math.max(0, Math.min(nat.h - c.h, c.y)),
    };
  }

  function trocarFormato(novo: Formato) {
    if (!nat) return;
    setF(novo);
    setZoom(1);
    setCrop(corteNatural(nat.w, nat.h, novo));
  }

  function aplicarZoom(z: number) {
    if (!nat || !crop) return;
    const base = corteNatural(nat.w, nat.h, f);
    const cx = crop.x + crop.w / 2;
    const cy = crop.y + crop.h / 2;
    const w = base.w * z;
    const h = base.h * z;
    setZoom(z);
    setCrop(limitar({ x: cx - w / 2, y: cy - h / 2, w, h }));
  }

  async function confirmar() {
    const img = imgRef.current;
    if (!img || !crop) return;
    const alvo = FORMATOS[f];
    const canvas = document.createElement("canvas");
    canvas.width = alvo.w;
    canvas.height = alvo.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff"; // PNG transparente vira fundo branco no JPG
    ctx.fillRect(0, 0, alvo.w, alvo.h);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, alvo.w, alvo.h);

    let blob: Blob | null = null;
    try {
      blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", QUALIDADE_JPG));
    } catch {
      blob = null;
    }
    if (!blob) {
      setErro("Não deu para gerar a imagem. Suba o arquivo de novo para recortar.");
      return;
    }

    setSalvando(true);
    try {
      await onConfirm({
        blob,
        f,
        crop: {
          x: Math.round(crop.x),
          y: Math.round(crop.y),
          w: Math.round(crop.w),
          h: Math.round(crop.h),
        },
      });
    } finally {
      setSalvando(false);
    }
  }

  const perda = nat && crop ? Math.round((1 - (crop.w * crop.h) / (nat.w * nat.h)) * 100) : 0;
  const ampliando = crop ? crop.w < FORMATOS[f].w : false;

  return (
    <Dialog open={fonte !== null} onOpenChange={(o) => !o && !salvando && onCancel()}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-[-0.02em]">
            Cortar para o mosaico
          </DialogTitle>
          <DialogDescription>
            Escolha o formato e arraste o quadro. A imagem sai em JPG no tamanho exato.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {ORDEM_FORMATOS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => trocarFormato(k)}
              disabled={!nat}
              className={`border px-4 py-2.5 text-left text-xs transition-colors ${
                f === k
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="block font-semibold uppercase tracking-[0.14em]">
                {FORMATOS[k].nome}
              </span>
              <span className="tabular-nums">
                {FORMATOS[k].w} × {FORMATOS[k].h}
              </span>
            </button>
          ))}
        </div>

        {nat && (
          <p className="border-l-2 border-foreground bg-muted px-3 py-2 text-xs text-muted-foreground">
            Arte de{" "}
            <span className="tabular-nums">
              {nat.w} × {nat.h}
            </span>
            . O formato mais próximo é{" "}
            <strong className="text-foreground">
              {FORMATOS[formatoMaisProximo(nat.w, nat.h)].nome}
            </strong>
            .{" "}
            {perda <= 1
              ? "Neste formato ela entra inteira."
              : `Neste corte fica de fora ${perda}% da arte.`}
            {ampliando && " A arte é menor que o formato e vai ser ampliada."}
          </p>
        )}

        <div
          ref={stageRef}
          className="relative w-full touch-none select-none overflow-hidden bg-muted"
        >
          {fonte && (
            <img
              ref={imgRef}
              src={fonte.src}
              alt=""
              crossOrigin="anonymous"
              onLoad={aoCarregar}
              onError={() => setErro("Não foi possível abrir a imagem.")}
              className="pointer-events-none block h-auto w-full"
            />
          )}
          {crop && (
            <div
              role="slider"
              tabIndex={0}
              aria-label="Área do corte. Arraste ou use as setas para posicionar."
              aria-valuenow={Math.round(crop.x)}
              onPointerDown={(e) => {
                arrasto.current = { x: e.clientX, y: e.clientY, cx: crop.x, cy: crop.y };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                const a = arrasto.current;
                if (!a) return;
                setCrop(
                  limitar({
                    ...crop,
                    x: a.cx + (e.clientX - a.x) / escala,
                    y: a.cy + (e.clientY - a.y) / escala,
                  }),
                );
              }}
              onPointerUp={() => (arrasto.current = null)}
              onKeyDown={(e) => {
                const p = (nat?.w ?? 1000) / 50;
                const m: Record<string, [number, number]> = {
                  ArrowLeft: [-p, 0],
                  ArrowRight: [p, 0],
                  ArrowUp: [0, -p],
                  ArrowDown: [0, p],
                };
                const d = m[e.key];
                if (!d) return;
                e.preventDefault();
                setCrop(limitar({ ...crop, x: crop.x + d[0], y: crop.y + d[1] }));
              }}
              className="absolute cursor-grab outline outline-2 outline-white active:cursor-grabbing focus-visible:outline-4"
              style={{
                left: crop.x * escala,
                top: crop.y * escala,
                width: crop.w * escala,
                height: crop.h * escala,
                boxShadow: "0 0 0 2px #111, 0 0 0 9999px rgba(255,255,255,.72)",
              }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-1/3 h-1/3 border-y border-white/60" />
              <div className="pointer-events-none absolute inset-y-0 left-1/3 w-1/3 border-x border-white/60" />
            </div>
          )}
          {!nat && !erro && (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <label htmlFor="zoom-corte">Aproximar</label>
          <input
            id="zoom-corte"
            type="range"
            min={40}
            max={100}
            value={Math.round(zoom * 100)}
            disabled={!crop}
            onChange={(e) => aplicarZoom(Number(e.target.value) / 100)}
            className="flex-1 accent-foreground"
          />
          <span className="w-10 text-right tabular-nums">{Math.round(100 / zoom)}%</span>
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={!nat || salvando}
            onClick={() => trocarFormato(f)}
          >
            Voltar ao corte natural
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" disabled={salvando} onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="button" disabled={!crop || salvando} onClick={confirmar}>
              {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
              {salvando ? "Enviando…" : `Gerar ${FORMATOS[f].rotulo} e salvar`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
