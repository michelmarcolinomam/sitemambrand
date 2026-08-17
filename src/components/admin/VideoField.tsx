import { useRef, useState } from "react";
import { FilmIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/** Acima disso o Supabase recusa o upload — melhor avisar antes de tentar. */
const MAX_MB = 50;

/** Sobe o arquivo pro bucket `site` e devolve a URL pública. */
export async function uploadSiteVideo(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const safeBase = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const path = `${folder}/${Date.now()}-${safeBase || "video"}.${ext}`;

  const { error } = await supabase.storage.from("site").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || "video/mp4",
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("site").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Campo de vídeo: preview tocável + upload + remover.
 * `format` só ajusta o tamanho da moldura do preview (vertical é alto e estreito).
 */
export function VideoField({
  label,
  value,
  onChange,
  folder,
  format = "vertical",
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  format?: "vertical" | "horizontal";
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    const mb = file.size / 1024 / 1024;
    if (mb > MAX_MB) {
      toast.error(
        `O vídeo tem ${mb.toFixed(0)} MB. O limite é ${MAX_MB} MB — comprima antes de subir.`,
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const url = await uploadSiteVideo(file, folder);
      onChange(url);
      toast.success("Vídeo enviado.");
    } catch (e) {
      toast.error(`Falha no upload: ${e instanceof Error ? e.message : "erro"}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2 border border-border p-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>

      <div
        className={`relative w-full overflow-hidden bg-muted ${
          format === "vertical" ? "aspect-[9/16] max-w-[160px]" : "aspect-video max-w-xs"
        }`}
      >
        {value ? (
          <video
            src={value}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Sem vídeo
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FilmIcon className="h-4 w-4" />
          )}
          {uploading ? "Enviando…" : value ? "Trocar vídeo" : "Enviar vídeo"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            <Trash2 className="h-4 w-4" />
            Remover
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {hint ??
          `MP4 comprimido para web, até ${MAX_MB} MB. O vídeo original da edição é pesado demais — use a versão leve.`}
      </p>
    </div>
  );
}
