import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/mam-logo.png.asset.json";

type AnchorItem = { label: string; hash: string };
type PageItem = { label: string; to: string };

const anchors: AnchorItem[] = [
  { label: "Tese", hash: "problema" },
  { label: "Ciclo", hash: "ciclo" },
  { label: "Serviços", hash: "servicos" },
  { label: "Repertório", hash: "repertorio" },
  { label: "Histórias", hash: "historias" },
  { label: "Projetos", hash: "projetos" },
  { label: "Contato", hash: "contato" },
];

const pages: PageItem[] = [
  { label: "Home", to: "/" },
  { label: "Sobre", to: "/sobre" },
  { label: "Estúdio", to: "/estudio" },
  { label: "Diário", to: "/diario" },
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
      // small delay so overlay-close animation doesn't fight the scroll
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
          <Link to="/" className="flex items-center" aria-label="MAM Branding — início">
            <img src={logo.url} alt="MAM Branding" className="h-10 w-auto md:h-12" />
          </Link>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="site-menu"
            className="group inline-flex items-center gap-3 text-sm font-medium text-foreground"
          >
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
              Menu
            </span>
            <span className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]">
              <span className="block h-px w-6 bg-foreground transition-transform" />
              <span className="block h-px w-6 bg-foreground transition-transform" />
            </span>
          </button>
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
                aria-label="MAM Branding — início"
              >
                <img src={logo.url} alt="MAM Branding" className="h-10 w-auto md:h-12" />
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
            <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-12 overflow-y-auto px-6 pb-16 pt-8 md:grid-cols-12 md:gap-10 md:px-10 md:pt-16">
              <nav className="md:col-span-8" aria-label="Navegação principal">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Navegar
                </div>
                <ul className="mt-6 flex flex-col gap-3 md:gap-4">
                  {pages.map((p) => (
                    <li key={p.to}>
                      <Link
                        to={p.to}
                        onClick={close}
                        className="group block font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-foreground"
                      >
                        <span className="transition-colors group-hover:text-mint-ink group-hover:italic group-hover:font-light">
                          {p.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-14 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:mt-20">
                  Nesta página
                </div>
                <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 md:gap-x-10">
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
                    href="mailto:contato@mambranding.com.br"
                    className="hover:text-mint-ink"
                  >
                    contato@mambranding.com.br
                  </a>
                </div>
                <a
                  href="mailto:contato@mambranding.com.br"
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
