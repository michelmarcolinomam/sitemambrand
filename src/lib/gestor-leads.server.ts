import process from "node:process";

// Entrega de lead ao gestor (gestor.mambrand.com.br).
//
// Desde 2026-10-02 os leads do site — contato, diagnóstico e alinhamento —
// moram no banco do gestor, na seção Comercial, e não mais no banco do site.
// O site virou só portfólio; quem atende o lead trabalha no gestor, onde o
// lead que fecha vira cliente e contrato sem precisar de integração.
//
// A porta é a função `com_receber_lead` do gestor. Ela é chamável com a chave
// publicável (pública por natureza — é a mesma que o próprio gestor usa no
// navegador), mas exige um segredo que só este servidor conhece:
// GESTOR_LEADS_CHAVE, nas variáveis de ambiente da Vercel. Sem ele ninguém
// grava lead direto no gestor pulando a validação dos formulários.
//
// Arquivo .server.ts: o Vite não empacota para o navegador.

const GESTOR_URL = "https://zokmlfocjalehjvczwep.supabase.co";
const GESTOR_CHAVE_PUBLICAVEL = "sb_publishable_jiTPujKev4H4m-H_ABFE1w_rRvHNCVZ";

export type LeadParaGestor = {
  tipo: "contato" | "diagnostico" | "alinhamento";
  /** Opcional. O diagnóstico manda o mesmo id no parcial e na conclusão. */
  id?: string;
  nome: string;
  email: string;
  empresa?: string | null;
  whatsapp?: string | null;
  mensagem?: string | null;
  fase?: string | null;
  dimensoes?: { name: string; phase: string; score: number }[] | null;
  gclid?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
  landing_url?: string | null;
};

/** Devolve null se gravou, ou a mensagem de erro (para o log). */
export async function enviarLeadAoGestor(lead: LeadParaGestor): Promise<string | null> {
  // Lido aqui dentro, não no topo do módulo: em alguns ambientes o env só
  // existe na hora da requisição (ver config.server.ts).
  // trim: valor colado no painel da Vercel costuma vir com quebra de linha no
  // fim, e um caractere a mais já faz o gestor recusar a chave.
  const chave = process.env.GESTOR_LEADS_CHAVE?.trim();
  if (!chave) return "GESTOR_LEADS_CHAVE não configurada";

  try {
    const r = await fetch(`${GESTOR_URL}/rest/v1/rpc/com_receber_lead`, {
      method: "POST",
      headers: {
        apikey: GESTOR_CHAVE_PUBLICAVEL,
        Authorization: `Bearer ${GESTOR_CHAVE_PUBLICAVEL}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_chave: chave, p_lead: lead }),
    });
    if (!r.ok) return `gestor respondeu ${r.status}: ${(await r.text()).slice(0, 300)}`;
    return null;
  } catch (e) {
    return `falha de rede: ${e instanceof Error ? e.message : String(e)}`;
  }
}
