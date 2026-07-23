import { useCallback, useEffect, useRef, useState } from "react";
import { Share2, Download, Check, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

/* ————————————————————————————————————————————————
   Compartilhar projeto — gera um card pronto pro Instagram
   (story 9:16 e feed 4:5) a partir dos dados do case.
   A imagem é desenhada num <canvas> (nativo, sem lib), com a
   capa do projeto + ícone ⋈ + nome/ano/tipo. Botões: Baixar
   (todo lugar) e Compartilhar (bandeja nativa no celular).
   ———————————————————————————————————————————————— */

type Format = "story" | "feed";

const SIZES: Record<Format, { w: number; h: number; label: string; ratio: string }> = {
  story: { w: 1080, h: 1920, label: "Story", ratio: "9:16" },
  feed: { w: 1080, h: 1350, label: "Feed", ratio: "4:5" },
};

// Símbolo ⋈ oficial (mesmo path do favicon/logo). bbox ~ x[21.2,169.7] y[18,132.1].
const MARK_PATH =
  "M92,61.9L46.9,18h-25.7v114.1h25.7l31.6-30.9v-26.2l6.9,6.7h0s51.6,50.3,51.6,50.3h25.7V18h-25.7l-45.1,43.9ZM40,112.6V37.4l38.5,37.6-38.5,37.6ZM144,112.6l-38.5-37.6,38.5-37.6v75.2Z";
const MARK_MINX = 21.2;
const MARK_MINY = 18;
const MARK_H = 114.1;

const INK = "#0d0d0d";
const MUTED = "#737373";
const SITE = "MAMBRAND.COM.BR";

function drawMark(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, color: string) {
  const p = new Path2D(MARK_PATH);
  const s = h / MARK_H;
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(x - MARK_MINX * s, y - MARK_MINY * s);
  ctx.scale(s, s);
  ctx.fill(p);
  ctx.restore();
}

// desenha a imagem cobrindo (object-fit: cover) o retângulo dado
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const ir = img.width / img.height;
  const rr = w / h;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;
  if (ir > rr) {
    sw = img.height * rr;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / rr;
    sy = (img.height - sh) / 2;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

// diminui o tamanho da fonte até caber na largura
function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  weightStack: string,
  maxSize: number,
  maxWidth: number,
  minSize = 24,
) {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `${weightStack.replace("__S__", String(size))}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

// quebra o texto em no máximo `maxLines` linhas que caibam em `maxWidth`
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines) break;
    } else {
      cur = test;
    }
  }
  if (lines.length < maxLines && cur) lines.push(cur);
  return lines.slice(0, maxLines);
}

type Props = {
  title: string;
  year?: string | null;
  category?: string | null;
  descriptor?: string | null;
  coverUrl?: string | null;
  slug: string;
};

export function ShareProject({ title, year, category, descriptor, coverUrl, slug }: Props) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<Format>("story");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const fileRef = useRef<File | null>(null);

  // kicker = categoria (ex.: "Esportes & Tecnologia"); o tipo (descriptor) vai na linha de baixo
  const kicker = (category || descriptor || "").toUpperCase();
  const pageUrl = `https://mambrand.com.br/cases/${slug}`;
  const fileName = `mam-${slug}-${format}.png`;

  // fontes prontas (Fraunces precisa estar carregada pro canvas)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await Promise.all([
          document.fonts.load("600 100px Fraunces"),
          document.fonts.load("400 40px Fraunces"),
        ]);
        await document.fonts.ready;
      } catch {
        /* ignora — cai no fallback serif */
      }
      if (alive) setFontsReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // capacidade de compartilhar arquivos (celular)
  useEffect(() => {
    try {
      const probe = new File([new Blob(["x"], { type: "image/png" })], "x.png", {
        type: "image/png",
      });
      setCanShareFiles(!!navigator.canShare && navigator.canShare({ files: [probe] }));
    } catch {
      setCanShareFiles(false);
    }
  }, []);

  // carrega a capa (com CORS p/ o canvas não ficar "tainted")
  useEffect(() => {
    if (!coverUrl) return;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => setImg(image);
    image.onerror = () => setImg(null);
    image.src = coverUrl;
  }, [coverUrl]);

  const render = useCallback(() => {
    const canvas = canvasEl;
    if (!canvas) return;
    const { w: W, h: H } = SIZES[format];
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // fundo
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const M = 60;
    const isStory = format === "story";
    const iconH = 52;
    const setLS = (v: string) => {
      if ("letterSpacing" in ctx)
        (ctx as unknown as { letterSpacing: string }).letterSpacing = v;
    };

    // ——— moldura editorial (as duas versões, como na 1ª ideia): ícone ⋈ + url
    //     no topo, imagem emoldurada (com margem lateral) e legenda embaixo.
    //     No story sobra uma margem no rodapé, que a interface do Instagram cobre. ———
    const topBarY = 66; // topo pra ambos (1ª versão): a imagem começa alta e domina
    drawMark(ctx, M, topBarY, iconH, INK);
    ctx.fillStyle = MUTED;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "500 24px ui-monospace, 'SF Mono', Menlo, Monaco, monospace";
    setLS("2.5px");
    ctx.fillText(SITE, W - M, topBarY + iconH / 2);
    setLS("0px");

    // imagem dominante (1ª versão aprovada): legenda compacta embaixo e margem
    // de rodapé enxuta, pra a foto ocupar o corpo do card.
    const captionH = isStory ? 320 : 250;
    const bottomSafe = isStory ? 64 : 0;
    const captionTop = H - bottomSafe - captionH;

    const imgTop = topBarY + iconH + 46;
    const imgBottom = captionTop - 40;
    if (img) {
      drawCover(ctx, img, M, imgTop, W - 2 * M, imgBottom - imgTop);
    } else {
      ctx.fillStyle = "#eef2e7";
      ctx.fillRect(M, imgTop, W - 2 * M, imgBottom - imgTop);
    }

    // ——— legenda ———
    const kickerSize = 25;
    const titleMax = isStory ? 104 : 92;
    const descSize = 30;

    // kicker (categoria)
    let y = captionTop + 4;
    if (kicker) {
      ctx.fillStyle = MUTED;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.font = "500 25px ui-monospace, 'SF Mono', Menlo, Monaco, monospace";
      setLS("2px");
      let ks = kickerSize;
      while (ks > 16 && ctx.measureText(kicker).width > W - 2 * M) {
        ks -= 1;
        ctx.font = `500 ${ks}px ui-monospace, 'SF Mono', Menlo, Monaco, monospace`;
      }
      ctx.fillText(kicker, M, y);
      setLS("0px");
      y += ks + 26;
    }

    // título (Fraunces) + ano (mono) na mesma linha de base
    ctx.textBaseline = "alphabetic";
    const yearStr = year ? String(year) : "";
    ctx.font = "500 30px ui-monospace, 'SF Mono', Menlo, Monaco, monospace";
    const yearW = yearStr ? ctx.measureText(yearStr).width + 28 : 0;

    const titleSize = fitFontSize(
      ctx,
      title,
      "600 __S__px Fraunces, 'Times New Roman', Georgia, serif",
      titleMax,
      W - 2 * M - yearW,
      40,
    );
    ctx.font = `600 ${titleSize}px Fraunces, 'Times New Roman', Georgia, serif`;
    ctx.fillStyle = INK;
    ctx.textAlign = "left";
    const baseline = y + titleSize * 0.82;
    ctx.fillText(title, M, baseline);

    if (yearStr) {
      ctx.fillStyle = MUTED;
      ctx.font = "500 30px ui-monospace, 'SF Mono', Menlo, Monaco, monospace";
      ctx.textAlign = "right";
      ctx.fillText(yearStr, W - M, baseline);
    }

    // tipo do projeto (descriptor) na linha de baixo — só no story, e só se
    // não repetir o kicker (categoria)
    if (isStory && descriptor && descriptor.toUpperCase() !== kicker) {
      ctx.fillStyle = MUTED;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.font = `400 ${descSize}px Inter, system-ui, sans-serif`;
      const descText = /[.!?]$/.test(descriptor) ? descriptor : `${descriptor}.`;
      const lines = wrapLines(ctx, descText, W - 2 * M, 2);
      let dy = baseline + 28;
      for (const ln of lines) {
        ctx.fillText(ln, M, dy);
        dy += descSize * 1.34;
      }
    }

    // prepara o arquivo pra compartilhar (pré-gerado p/ caber no gesto do usuário)
    canvas.toBlob((blob) => {
      if (blob) fileRef.current = new File([blob], fileName, { type: "image/png" });
    }, "image/png");
  }, [canvasEl, format, img, fontsReady, kicker, title, year, descriptor, fileName]);

  // redesenha quando o canvas monta / muda formato / carrega capa ou fontes.
  // (callback ref garante que render roda no instante em que o canvas existe)
  useEffect(() => {
    render();
  }, [render]);

  const handleDownload = useCallback(() => {
    const canvas = canvasEl;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2200);
    }, "image/png");
  }, [canvasEl, fileName]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  }, [pageUrl]);

  const handleShare = useCallback(async () => {
    const file = fileRef.current;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${title} — MAM Brand`,
          text: `${title}${descriptor ? ` · ${descriptor}` : ""}`,
          url: pageUrl,
        });
        return;
      } catch {
        return; // usuário cancelou
      }
    }
    handleDownload();
  }, [title, descriptor, pageUrl, handleDownload]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <Share2 className="h-4 w-4" aria-hidden />
          <span className="border-b border-foreground/40 pb-0.5 transition-colors group-hover:border-foreground">
            Compartilhar projeto
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100vw-2rem)] gap-0 p-0 sm:max-w-[440px]">
        <DialogHeader className="border-b border-border px-6 py-5 text-left">
          <DialogTitle className="font-display text-xl font-semibold tracking-[-0.02em]">
            Compartilhar projeto
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Imagem pronta pro Instagram. Baixe ou compartilhe direto do celular.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6">
          {/* seletor de formato */}
          <div
            role="tablist"
            aria-label="Formato"
            className="mb-6 inline-flex rounded-full border border-border p-1"
          >
            {(Object.keys(SIZES) as Format[]).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={format === f}
                onClick={() => setFormat(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  format === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {SIZES[f].label}{" "}
                <span className="opacity-60">{SIZES[f].ratio}</span>
              </button>
            ))}
          </div>

          {/* preview */}
          <div className="flex justify-center">
            <div
              className="overflow-hidden rounded-md border border-border shadow-sm"
              style={{ maxHeight: "52vh" }}
            >
              <canvas
                ref={setCanvasEl}
                className="block h-auto w-auto"
                style={{ maxHeight: "52vh", maxWidth: "100%" }}
                aria-label={`Prévia do card de ${title}`}
              />
            </div>
          </div>

          {/* ações */}
          <div className="mt-6 flex gap-3">
            {canShareFiles && (
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <Share2 className="h-4 w-4" aria-hidden />
                Compartilhar
              </button>
            )}
            <button
              type="button"
              onClick={handleDownload}
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted ${
                canShareFiles ? "" : "flex-1"
              }`}
            >
              {downloaded ? (
                <>
                  <Check className="h-4 w-4" aria-hidden /> Baixado
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" aria-hidden /> Baixar
                </>
              )}
            </button>
          </div>

          {/* link do projeto — pro sticker de "Link" do story */}
          <div className="mt-5 border-t border-border pt-5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" aria-hidden /> Link copiado
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" aria-hidden /> Copiar link do projeto
                </>
              )}
            </button>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              No story, cole este link no sticker de{" "}
              <span className="font-medium text-foreground">Link</span> — assim quem vê
              toca e cai direto no projeto.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
