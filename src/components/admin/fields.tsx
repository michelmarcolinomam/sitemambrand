import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { CaseImage } from "@/lib/case-content";

/* Campos reutilizáveis do painel admin. */

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      <Textarea id={id} value={value} rows={rows} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Sobe o arquivo pro bucket `site` e devolve a URL pública. */
export async function uploadSiteImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeBase = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const path = `${folder}/${Date.now()}-${safeBase || "imagem"}.${ext}`;

  const { error } = await supabase.storage.from("site").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("site").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Campo de imagem: preview + upload + texto alternativo.
 * `folder` define a pasta no bucket (ex.: cases/black-herva).
 */
export function ImageField({
  label,
  value,
  onChange,
  folder,
  aspect = "aspect-video",
  hint,
}: {
  label: string;
  value: CaseImage;
  onChange: (v: CaseImage) => void;
  folder: string;
  aspect?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadSiteImage(file, folder);
      onChange({ ...value, url });
      toast.success("Imagem enviada.");
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

      <div className={`relative w-full max-w-xs overflow-hidden bg-muted ${aspect}`}>
        {value.url ? (
          <img src={value.url} alt={value.alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Sem imagem
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
            <ImagePlus className="h-4 w-4" />
          )}
          {value.url ? "Trocar imagem" : "Enviar imagem"}
        </Button>
        {value.url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange({ ...value, url: "" })}
          >
            <Trash2 className="h-4 w-4" />
            Remover
          </Button>
        )}
      </div>

      <TextField
        label="Descrição da imagem (alt)"
        value={value.alt}
        onChange={(alt) => onChange({ ...value, alt })}
        hint={hint}
      />
    </div>
  );
}

/** Bloco de seção do editor, espelhando as seções da página pública. */
export function SectionCard({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-background p-6 md:p-8">
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="tabular-nums">{kicker}</span>
        <span className="h-px w-8 bg-border" aria-hidden />
        <span>{title}</span>
      </div>
      {description && (
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}
