import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** E-mail com poder de administrar o site (espelha public.is_admin() no banco). */
export const ADMIN_EMAIL = "contato@mamgestao.com";

export type AdminAuthState = {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
};

/**
 * Observa a sessão do Supabase Auth no cliente.
 * `isAdmin` só é verdadeiro para o e-mail autorizado — a segurança real está
 * nas policies do banco; isto é apenas para a UI do painel.
 */
export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    session: null,
    isAdmin: false,
  });

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const session = data.session;
      setState({
        loading: false,
        session,
        isAdmin: session?.user.email === ADMIN_EMAIL,
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setState({
        loading: false,
        session,
        isAdmin: session?.user.email === ADMIN_EMAIL,
      });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
