import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadSiteImage } from "@/components/admin/fields";

/** Uma imagem do carrossel. `w`/`h` guardam a proporção real do arquivo. */
export type PieceImage = { url: string; alt: string; w: number | null; h: number | null };

/** Lê largura e altura antes de subir — é isso que faz a página respeitar a arte. */
function medir(file: File): Promise<{ w: number | null; h: number | null }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ w: null, h: null });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function proporcao(img: PieceImage): string {
  if (!img.w || !img.h) return "—";
  const r = img.w / img.h;
  if (Math.abs(r - 1) < 0.06) return "quadrada";
  return r > 1 ? `${r.toFixed(2)}:1 deitada` : `1:${(1 / r).toFixed(2)} em pé`;
}

/**
 * Conjunto de imagens da peça: a primeira é a capa que aparece na grade, as
 * demais entram no carrossel quando o visitante abre.
 */
export function PieceImages({
  value,
  onChange,
  folder,
}: {
  value: PieceImage[];
  onChange: (imagens: PieceImage[]) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState<{ feitas: number; total: number } | null>(null);

  async function subir(files: FileList | null) {
    if (!files || files.length === 0) return;
    const lista = Array.from(files);
    setEnviando({ feitas: 0, total: lista.length });

    const novas: PieceImage[] = [];
    let falhas = 0;

    for (let i = 0; i < lista.length; i++) {
      try {
        const { w, h } = await medir(lista[i]);
        const url = await uploadSiteImage(lista[i], folder);
        novas.push({ url, alt: "", w, h });
      } catch {
        falhas += 1;
      }
      setEnviando({ feitas: i + 1, total: lista.length });
    }

    setEnviando(null);
    if (inputRef.current) inputRef.current.value = "";
    if (novas.length) onChange([...value, ...novas]);
    if (falhas) toast.error(`${falhas} de ${lista.length} imagens falharam.`);
  }

  function mover(i: number, d: -1 | 1) {
    const alvo = i + d;
    if (alvo < 0 || alvo >= value.length) return;
    const copia = [...value];
    [copia[i], copia[alvo]] = [copia[alvo], copia[i]];
    onChange(copia);
  }

  return (
    <div className="flex flex-col gap-3 border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Imagens da peça
        </div>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {value.length === 0
            ? "nenhuma"
            : value.length === 1
              ? "1 imagem · sem carrossel"
              : `${value.length} imagens · carrossel`}
        </span>
      </div>

      {value.length === 0 ? (
        <div className="border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          A primeira imagem vira a capa. As seguintes entram no carrossel.
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {value.map((img, i) => (
            <li key={`${img.url}-${i}`} className="flex flex-col gap-2 border border-border p-2">
              <div className="relative w-full overflow-hidden bg-muted">
                {/* mostra a imagem inteira, na proporção dela — nada de corte */}
                <img src={img.url} alt={img.alt} className="h-28 w-full bg-muted object-contain" />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 bg-foreground px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-background">
                    Capa
                  </span>
                )}
              </div>

              <div className="text-[10px] tabular-nums text-muted-foreground">
                {img.w && img.h ? `${img.w}×${img.h} · ${proporcao(img)}` : "medida desconhecida"}
              </div>

              <Input
                value={img.alt}
                placeholder="Descrição"
                onChange={(e) =>
                  onChange(value.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))
                }
                className="h-8 text-xs"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Mover para trás"
                    disabled={i === 0}
                    onClick={() => mover(i, -1)}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Mover para frente"
                    disabled={i === value.length - 1}
                    onClick={() => mover(i, 1)}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Remover"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => subir(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={enviando !== null}
          onClick={() => inputRef.current?.click()}
        >
          {enviando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {enviando ? `Enviando ${enviando.feitas} de ${enviando.total}…` : "Adicionar imagens"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          A página usa a proporção de cada arquivo — imagem deitada entra deitada, em pé entra em
          pé. Nada é cortado.
        </p>
      </div>
    </div>
  );
}
