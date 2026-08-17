import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

type AnchorItem = { label: string; hash: string };
type PageItem = { label: string; to: string };

// Barra do desktop — itens à vista (decisão do Michel, 2026-08).
// "Estúdio" aponta pro audiovisual; "Rótulos e Embalagens" é página "em breve".
const primaryNav: PageItem[] = [
  { label: "Sobre", to: "/sobre" },
  { label: "Branding", to: "/branding" },
  { label: "Rebranding", to: "/rebranding" },
  { label: "Ciclo", to: "/ciclo-de-marca" },
  { label: "Estúdio", to: "/audiovisual" },
  { label: "Rótulos e Embalagens", to: "/rotulos-e-embalagens" },
];

// Menu completo (hambúrguer) — vale pro desktop ("o resto") e é a navegação do celular.
const services: PageItem[] = [
  { label: "Branding", to: "/branding" },
  { label: "Rebranding", to: "/rebranding" },
  { label: "Ciclo de Marca", to: "/ciclo-de-marca" },
  { label: "Estúdio", to: "/audiovisual" },
  { label: "Rótulos e Embalagens", to: "/rotulos-e-embalagens" },
];

const pages: PageItem[] = [
  { label: "Home", to: "/" },
  { label: "Sobre", to: "/sobre" },
  { label: "Diário", to: "/diario" },
];

const anchors: AnchorItem[] = [
  { label: "Tese", hash: "problema" },
  { label: "Ciclo", hash: "ciclo" },
  { label: "Serviços", hash: "servicos" },
  { label: "Repertório", hash: "repertorio" },
  { label: "Histórias", hash: "historias" },
  { label: "Projetos", hash: "projetos" },
  { label: "Contato", hash: "contato" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      triggerRef.current?.focus();
    };
  }, [open]);

  const handleAnchor = (hash: string) => {
    close();
    if (pathname !== "/") {
      navigate({ to: "/", hash });
    } else {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
          <Link to="/" className="flex items-center" aria-label="MAM Brand — início">
            <img src="/mam-logo.svg" alt="MAM Brand" className="h-6 w-auto md:h-7" />
          </Link>

          <div className="flex items-center gap-6 lg:gap-8">
            {/* Menu à vista — só no desktop (lg+); abaixo disso fica o hambúrguer */}
            <nav
              className="hidden items-center gap-6 lg:flex xl:gap-8"
              aria-label="Navegação principal"
            >
              {primaryNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="border-b border-transparent pb-0.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
                  activeProps={{ className: "border-foreground" }}
                  activeOptions={{ exact: true }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Hambúrguer — sempre presente; abre o menu completo (o resto) */}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="site-menu"
              className="group inline-flex items-center gap-3 text-sm font-medium text-foreground lg:border-l lg:border-border lg:pl-8"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground max-sm:sr-only lg:hidden">
                Menu
              </span>
              <span className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]">
                <span className="block h-px w-6 bg-foreground transition-transform" />
                <span className="block h-px w-6 bg-foreground transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className="fixed inset-0 z-[60] animate-in fade-in duration-200"
        >
          <div className="absolute inset-0 bg-background" />

          <div className="relative flex h-full w-full flex-col">
            {/* Top bar inside overlay */}
            <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
              <Link
                to="/"
                onClick={close}
                className="flex items-center"
                aria-label="MAM Brand — início"
              >
                <img src="/mam-logo.svg" alt="MAM Brand" className="h-6 w-auto md:h-7" />
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Fechar menu"
                className="inline-flex items-center gap-3 text-sm font-medium text-foreground"
              >
                <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
                  Fechar
                </span>
                <span className="relative flex h-10 w-10 items-center justify-center">
                  <span className="absolute block h-px w-6 rotate-45 bg-foreground" />
                  <span className="absolute block h-px w-6 -rotate-45 bg-foreground" />
                </span>
              </button>
            </div>

            {/* Content */}
            <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-12 overflow-y-auto px-6 pb-16 pt-6 md:grid-cols-12 md:gap-10 md:px-10 md:pt-10">
              <nav className="md:col-span-8" aria-label="Navegação principal">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Serviços
                </div>
                <ul className="mt-5 flex flex-col gap-1.5 md:gap-2">
                  {services.map((s) => (
                    <li key={s.to}>
                      <Link
                        to={s.to}
                        onClick={close}
                        className="group block font-display text-[clamp(1.9rem,4.4vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-foreground"
                      >
                        <span className="transition-colors group-hover:text-mint-ink group-hover:italic group-hover:font-light">
                          {s.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-12 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:mt-14">
                  Navegar
                </div>
                <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3 md:gap-x-10">
                  {pages.map((p) => (
                    <li key={p.to}>
                      <Link
                        to={p.to}
                        onClick={close}
                        className="group inline-flex items-center text-lg font-medium text-foreground md:text-xl"
                      >
                        <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-foreground">
                          {p.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-12 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:mt-14">
                  Nesta página
                </div>
                <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3 md:gap-x-10">
                  {anchors.map((a) => (
                    <li key={a.hash}>
                      <button
                        type="button"
                        onClick={() => handleAnchor(a.hash)}
                        className="group inline-flex items-center text-base font-medium text-muted-foreground transition-colors hover:text-foreground md:text-lg"
                      >
                        <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-foreground">
                          {a.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <aside className="md:col-span-4 md:border-l md:border-border md:pl-10">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Contato
                </div>
                <div className="mt-6 flex flex-col gap-4 text-base text-foreground md:text-lg">
                  <a
                    href="mailto:contato@mambrand.com.br"
                    className="hover:text-mint-ink"
                  >
                    contato@mambrand.com.br
                  </a>
                </div>
                <a
                  href="mailto:contato@mambrand.com.br"
                  onClick={close}
                  className="group mt-10 inline-flex items-center gap-3 text-base font-medium text-foreground md:text-lg"
                >
                  <span className="border-b border-foreground pb-1">
                    Agendar Diagnóstico
                  </span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
