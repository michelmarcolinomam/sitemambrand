import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Crop, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadSiteImage } from "@/components/admin/fields";
import { CropDialog, type Corte, type FonteCorte } from "@/components/admin/CropDialog";
import { FORMATOS, formatoDe, type PieceImage } from "@/lib/mosaico";

export type { PieceImage };

/** Arquivo novo na fila ou imagem já salva sendo recortada de novo. */
type Trabalho =
  | { tipo: "novo"; file: File; fonte: FonteCorte }
  | { tipo: "recorte"; indice: number; fonte: FonteCorte };

function semExtensao(nome: string) {
  return nome.replace(/\.[^.]+$/, "") || "imagem";
}

/**
 * Conjunto de imagens da peça: a primeira é a capa que entra no mosaico, as
 * demais entram no carrossel. Toda imagem passa pelo corte em um dos três
 * formatos; o arquivo enviado fica guardado para recortar depois.
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
  const [fila, setFila] = useState<Trabalho[]>([]);
  const atual = fila[0] ?? null;

  function escolher(files: FileList | null) {
    if (!files || files.length === 0) return;
    const novos: Trabalho[] = Array.from(files).map((file) => ({
      tipo: "novo",
      file,
      fonte: { src: URL.createObjectURL(file), nome: file.name },
    }));
    setFila((f) => [...f, ...novos]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function recortar(i: number) {
    const img = value[i];
    setFila((f) => [
      ...f,
      {
        tipo: "recorte",
        indice: i,
        fonte: { src: img.original ?? img.url, nome: "recorte", f: formatoDe(img), crop: img.crop },
      },
    ]);
  }

  function proximo() {
    if (atual?.tipo === "novo") URL.revokeObjectURL(atual.fonte.src);
    setFila((f) => f.slice(1));
  }

  async function salvarCorte({ blob, f, crop }: Corte) {
    if (!atual) return;
    const base = atual.tipo === "novo" ? semExtensao(atual.file.name) : "recorte";
    const formato = FORMATOS[f];
    try {
      const jpg = new File([blob], `${base}-${formato.w}x${formato.h}.jpg`, { type: "image/jpeg" });
      const url = await uploadSiteImage(jpg, folder);

      if (atual.tipo === "novo") {
        const original = await uploadSiteImage(atual.file, `${folder}/originais`);
        onChange([...value, { url, alt: "", w: formato.w, h: formato.h, f, crop, original }]);
      } else {
        const antiga = value[atual.indice];
        onChange(
          value.map((x, j) =>
            j === atual.indice
              ? {
                  ...x,
                  url,
                  w: formato.w,
                  h: formato.h,
                  f,
                  crop,
                  original: antiga.original ?? antiga.url,
                }
              : x,
          ),
        );
      }
      toast.success("Imagem pronta. Salve a peça para publicar a mudança.");
      proximo();
    } catch (e) {
      toast.error(`Falha no upload: ${e instanceof Error ? e.message : "erro"}`);
    }
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
                <img src={img.url} alt={img.alt} className="h-28 w-full bg-muted object-contain" />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 bg-foreground px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-background">
                    Capa
                  </span>
                )}
              </div>

              <div className="text-[10px] tabular-nums text-muted-foreground">
                {img.f
                  ? `${FORMATOS[img.f].nome} · ${FORMATOS[img.f].w}×${FORMATOS[img.f].h}`
                  : `Sem corte · entra como ${FORMATOS[formatoDe(img)].nome.toLowerCase()}`}
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
                <Button variant="ghost" size="icon" title="Recortar" onClick={() => recortar(i)}>
                  <Crop className="h-3.5 w-3.5" />
                </Button>
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
          onChange={(e) => escolher(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={atual !== null}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
          {fila.length > 1 ? `Cortando · faltam ${fila.length}` : "Adicionar imagens"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Cada imagem passa pelo corte em um dos três formatos do mosaico: deitada 1920×1080,
          quadrada 1080×1080 ou em pé 1080×1920. O arquivo enviado fica guardado para recortar
          depois.
        </p>
      </div>

      <CropDialog fonte={atual?.fonte ?? null} onCancel={proximo} onConfirm={salvarCorte} />
    </div>
  );
}
