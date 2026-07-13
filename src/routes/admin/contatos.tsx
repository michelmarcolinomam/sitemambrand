import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mail, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/contatos")({
  component: ContatosPage,
});

type Contact = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  whatsapp: string | null;
  message: string;
  created_at: string;
};

function ContatosPage() {
  const [rows, setRows] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar os contatos.");
      return;
    }
    setRows(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(row: Contact) {
    setBusyId(row.id);
    const { error } = await supabase.from("contacts").delete().eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast.error("Erro ao excluir.");
      return;
    }
    toast.success("Contato removido.");
    load();
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const onlyDigits = (v: string) => v.replace(/\D/g, "");

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">
        Contatos recebidos
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Mensagens enviadas pelo formulário do site, da mais recente para a mais
        antiga.
      </p>

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            Nenhum contato recebido ainda.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {rows.map((c) => (
              <li key={c.id} className="border border-border bg-background p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-semibold">{c.name}</span>
                      {c.company && (
                        <span className="text-sm text-muted-foreground">· {c.company}</span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <a
                        href={`mailto:${c.email}`}
                        className="inline-flex items-center gap-1.5 hover:text-foreground"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {c.email}
                      </a>
                      {c.whatsapp && (
                        <a
                          href={`https://wa.me/55${onlyDigits(c.whatsapp)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 hover:text-foreground"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          {c.whatsapp}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {fmt(c.created_at)}
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Excluir">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir este contato?</AlertDialogTitle>
                          <AlertDialogDescription>
                            A mensagem de {c.name} será removida permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => remove(c)}
                            disabled={busyId === c.id}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-wrap border-t border-border pt-4 text-sm leading-relaxed text-foreground">
                  {c.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
