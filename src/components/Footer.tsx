import logo from "@/assets/logo-mam.svg";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <img src={logo} alt="MAM Branding" className="h-7 w-auto" />
          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
            Consultoria especializada em construção, evolução e
            reposicionamento de marcas.
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Navegar
          </div>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            <li><a href="#problema" className="hover:underline">Tese</a></li>
            <li><a href="#ciclo" className="hover:underline">Ciclo de Marca</a></li>
            <li><a href="#servicos" className="hover:underline">Serviços</a></li>
            <li><a href="#repertorio" className="hover:underline">Repertório</a></li>
            <li><a href="#projetos" className="hover:underline">Projetos</a></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Contato
          </div>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            <li>
              <a href="mailto:contato@mambranding.com.br" className="hover:underline">
                contato@mambranding.com.br
              </a>
            </li>
            <li className="text-muted-foreground">São Paulo · Brasil</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1400px] items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
        <span>© {year} MAM Branding</span>
        <span>Inteligência estratégica para marcas</span>
      </div>
    </footer>
  );
}
