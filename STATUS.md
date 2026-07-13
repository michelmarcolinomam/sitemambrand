# Status do Site MAM Branding

> Quadro de obra do projeto. Toda sessão (chat ou Claude Code) começa lendo este arquivo.
> Ao fechar qualquer etapa, atualizar aqui. Última atualização: 2026-07-12.

## Endereços
- **Produção:** https://sitemambrand.vercel.app
- **Domínio final:** mambranding.com.br — ainda NÃO conectado (decisão: só quando o site estiver 100%)
- **Repositório local:** `~/Desktop/MAM-site-limpo` (fonte da verdade)

## Páginas

| Página | Rota | Status |
|---|---|---|
| Home | `src/routes/index.tsx` | ✅ No ar |
| Estúdio | `src/routes/estudio.tsx` | ✅ No ar |
| Sobre | `src/routes/sobre.tsx` | ✅ No ar |
| Diário | `src/routes/diario.tsx` | ✅ No ar |
| Serviços / Branding | `src/routes/servicos.branding.tsx` | ✅ No ar |
| **Case Black Herva** | — | 🟡 Aprovado em simulação; HTML em `design/aprovados/case-black-herva.html`; falta converter em rota |

## Em andamento — Case Black Herva
Layout V3 aprovado (2026-07-12) com:
- Animações: scroll-reveal, stagger, contadores nos resultados, facade de vídeo
- Seção 05 "Em movimento": vídeo 16:9 + vertical 9:16 (1080×1920) no mesmo box
- Logo oficial MAM aplicado (padrão do site)

**Pendências antes de publicar:**
- [ ] Converter o HTML aprovado em rota TanStack (ex.: `servicos.branding.black-herva.tsx`)
- [ ] Trocar imagens placeholder (picsum) pelas fotos reais do case
- [ ] Inserir IDs reais dos 2 vídeos do YouTube (marcadores `TROQUE AQUI` no HTML)
- [ ] Remover banner "PREVIEW V3"
- [ ] Ligar o formulário de contato (hoje é só visual; existe `src/routes/api/public/contact.ts`)
- [ ] Foto real do founder no depoimento

## Padrões estabelecidos
- **Logo:** SVG oficial (símbolo ⋈ + wordmark), header 24px/28px, footer 28px, `alt="MAM Branding"` — extraído do site no ar
- **Fontes:** Fraunces (display) + Inter (texto) + JetBrains Mono (labels)
- **Cores:** fundo #fff, texto #0d0d0d, muted #737373, mint #f0f7ea
- **Animações:** ease `cubic-bezier(.16,1,.3,1)`, reveals de 1s, stagger 90ms, respeitar `prefers-reduced-motion`

## Próximos passos (ordem)
1. Fechar pendências do case Black Herva e publicar
2. Próximos cases do portfólio (mesmo template)
3. Conectar domínio mambranding.com.br (por último)
