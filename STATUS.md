# Status do Site MAM Branding

> Quadro de obra do projeto. Toda sessão (chat ou Claude Code) começa lendo este arquivo.
> Ao fechar qualquer etapa, atualizar aqui. Última atualização: 2026-07-12.

## Endereços
- **Produção:** https://sitemambrand.vercel.app
- **Domínio final:** mambranding.com.br — ainda NÃO conectado (decisão: só quando o site estiver 100%)
- **Repositório local:** `~/Desktop/MAM-site-limpo` (fonte da verdade)
- **GitHub:** github.com/michelmarcolinomam/sitemambrand — push na `main` = deploy automático na Vercel

## Páginas

| Página | Rota | Status |
|---|---|---|
| Home | `src/routes/index.tsx` | ✅ No ar |
| Estúdio | `src/routes/estudio.tsx` | ✅ No ar |
| Sobre | `src/routes/sobre.tsx` | ✅ No ar |
| Diário | `src/routes/diario.tsx` | ✅ No ar |
| Serviços / Branding | `src/routes/servicos.branding.tsx` | ✅ No ar |
| **Case Black Herva** | `src/routes/cases.black-herva.tsx` → `/cases/black-herva` | ✅ No ar (2026-07-12); faltam só conteúdos reais (abaixo) |

## Em andamento — Case Black Herva
Layout V3 aprovado e **convertido em rota React** (2026-07-12), reusando os componentes do site
(Navbar, Footer, Reveal/Rise, SectionKicker, ContactForm real, ScrollProgress, ArrowLink).
O CaseCard da tela de branding já apontava para `/cases/black-herva` — link fechado.
Referência visual aprovada: `design/aprovados/case-black-herva.html`.

**Pendências de conteúdo (a rota já está pronta pra recebê-los):**
- [ ] Trocar imagens placeholder (picsum) pelas fotos reais do case
- [ ] Inserir IDs reais dos 2 vídeos do YouTube (buscar `TROQUE AQUI` na rota)
- [ ] Foto real do founder no depoimento (buscar `TODO` na rota)
- [ ] Tiles "Logo principal" e "Paleta cromática" ainda são placeholders de texto
- [ ] Links reais das redes sociais (const `socials`, igual pendência da tela de branding)

## Padrões estabelecidos
- **Logo:** SVG oficial (símbolo ⋈ + wordmark), header 24px/28px, footer 28px, `alt="MAM Branding"` — extraído do site no ar
- **Fontes:** Fraunces (display) + Inter (texto) + JetBrains Mono (labels)
- **Cores:** fundo #fff, texto #0d0d0d, muted #737373, mint #f0f7ea
- **Animações:** ease `cubic-bezier(.16,1,.3,1)`, reveals de 1s, stagger 90ms, respeitar `prefers-reduced-motion`

## Próximos passos (ordem)
1. Fechar pendências do case Black Herva e publicar
2. Próximos cases do portfólio (mesmo template)
3. Conectar domínio mambranding.com.br (por último)
