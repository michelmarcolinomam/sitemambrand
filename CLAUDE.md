# Site MAM Branding — instruções para o Claude

## Antes de qualquer coisa
1. **Leia o `STATUS.md`** — é o quadro geral do projeto (páginas prontas, pendências, padrões).
2. Ao concluir qualquer etapa, **atualize o `STATUS.md`** no mesmo turno.

## O fluxo de trabalho deste projeto
O dono (Michel) desenvolve layouts no chat do claude.ai e traz o HTML pronto para o Claude Code integrar. O ciclo é:

> **Chat cria → Code integra/anima/simula → aprovou? → entra neste repositório → STATUS.md atualizado**

Regras do ciclo:
- Layout trazido do chat: manter a estrutura visual **exatamente** como veio; animações e ajustes técnicos são camada por cima.
- Simulações para aprovação: publicar como Artifact (self-contained: fontes e imagens em base64 — o host bloqueia recursos externos).
- Material aprovado que ainda não virou rota React fica em `design/aprovados/` (HTML standalone).
- Nada aprovado pode morar só em chat ou em pasta temporária — sempre pousa aqui no repo.

## Stack
- **TanStack Start** (file-based routing) + Vite + React + Supabase
- Rotas em `src/routes/` — ler `src/routes/README.md` antes de criar rotas (NÃO usar convenções Next.js)
- `routeTree.gen.ts` é gerado — nunca editar
- Scripts: `bun dev` / `bun run build` (lockfile é `bun.lock`)

## Deploy
- Produção: https://sitemambrand.vercel.app (Vercel)
- Domínio mambranding.com.br: **não conectar ainda** — só quando o site estiver 100% (decisão do Michel)

## Padrões visuais (não recriar de memória)
- Logo, fontes e cores: ver seção "Padrões estabelecidos" do `STATUS.md`
- Em dúvida sobre qualquer padrão visual, extrair do site no ar (view-source de sitemambrand.vercel.app) — nunca inventar
- Animações: sutis e editoriais; sempre com `prefers-reduced-motion` e fallback sem JS

## Comunicação
- Responder em português brasileiro
- Michel não é programador: explicar decisões técnicas em linguagem simples, sem jargão desnecessário
