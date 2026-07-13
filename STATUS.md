# Status do Site MAM Branding

> Quadro de obra do projeto. Toda sessão (chat ou Claude Code) começa lendo este arquivo.
> Ao fechar qualquer etapa, atualizar aqui. Última atualização: 2026-07-13.

## Endereços
- **Produção:** https://sitemambrand.vercel.app
- **Domínio final:** mambranding.com.br — ainda NÃO conectado (decisão: só quando o site estiver 100%)
- **Repositório local:** `~/Desktop/MAM-site-limpo` (fonte da verdade)
- **GitHub:** github.com/michelmarcolinomam/sitemambrand — push na `main` = deploy automático na Vercel
- **Painel admin:** `/admin` — login com `contato@mamgestao.com`

## Banco de dados (Supabase)
- **Projeto:** `mam-site` (ref `uelrxokvxiqgjdlwhkzw`), sa-east-1 — **separado** do banco do sistema de gestão (`gestor-mam`).
- **Tabelas:** `cases` (portfólio + página completa em `content` jsonb), `portfolio_projects` (carrossel), `contacts` (formulário).
- **Storage:** bucket público `site` (imagens dos cases). Leitura pública por URL; escrita só do admin.
- **Segurança (RLS):** público só lê o que está `published`; escrita/uploads só para `contato@mamgestao.com` (função `public.is_admin()`).
- **Env vars:** `.env` local já configurado. **Na Vercel, configurar** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (valores no `.env`). O `SUPABASE_SERVICE_ROLE_KEY` **não é mais necessário**.

## Páginas

| Página | Rota | Status |
|---|---|---|
| Home | `src/routes/index.tsx` | ✅ No ar |
| Estúdio | `src/routes/estudio.tsx` | ✅ No ar |
| Sobre | `src/routes/sobre.tsx` | ✅ No ar |
| Diário | `src/routes/diario.tsx` | ✅ No ar |
| Serviços / Branding | `src/routes/servicos.branding.tsx` | ✅ No ar — portfólio (destaques + carrossel) vem do banco |
| **Serviços / Rebranding** | `src/routes/servicos.rebranding.tsx` → `/servicos/rebranding` | ✅ No ar (2026-07-13) — reusa os componentes do branding; portfólio da **mesma base** do banco |
| **Cases (dinâmico)** | `src/routes/cases.$slug.tsx` → `/cases/[slug]` | ✅ No ar — template único alimentado pelo banco |
| **Painel admin** | `src/routes/admin/*` → `/admin` | ✅ Funcionando (2026-07-13) |

## Painel administrativo (2026-07-13)
Portfólio de branding agora é 100% administrável em `/admin`, sem mexer em código:
- **Cases** (`/admin`): lista com publicar/despublicar, reordenar, ver página, editar, excluir; botão "Novo case".
- **Editor** (`/admin/cases/$id`): edita **todas** as seções da página do case (hero, desafio, estratégia,
  identidade, aplicações, vídeos, resultado/depoimento) + card (título, slug, ano, categoria, capa, SEO).
  Upload de imagens direto pro Storage; vídeos por ID do YouTube.
- **Carrossel** (`/admin/projetos`): itens simples (nome, ano, categoria) da faixa "Mais projetos".
- **Contatos** (`/admin/contatos`): leads do formulário (bônus, mesmo banco).

Como funciona por baixo: `cases.content` (jsonb) guarda a página inteira; `src/lib/case-content.ts` define o
shape e normaliza JSON parcial; a rota `cases.$slug.tsx` renderiza esse conteúdo com os blocos de
`src/components/case/CaseBlocks.tsx`. Um case novo cadastrado ganha automaticamente uma página nos moldes da Black Herva.

**Black Herva:** conteúdo migrado pro banco. Pendências de conteúdo real agora se resolvem **pelo painel** (não mais no código):
- [ ] Trocar imagens placeholder (picsum) pelas fotos reais — via upload no editor
- [ ] Inserir IDs dos 2 vídeos do YouTube — campos "ID do vídeo" no editor
- [ ] Foto real do founder no depoimento — upload no editor
- [ ] Tiles "Logo principal" e "Paleta cromática" — upload no editor (viram imagem quando enviadas)
- [ ] Links reais das redes sociais (const `socials` em `cases.$slug.tsx`, `servicos.branding.tsx` e `servicos.rebranding.tsx` — ainda em código)

## Rebranding (2026-07-13)
Tela de serviço criada a partir de layout do chat, mesma linguagem editorial do branding. Reusa
`ServiceHero`, `ProcessTimeline`, `CaseCard`, `ProjectCarousel`, `BenefitBlock`, `ContactForm` etc.
Seção nova exclusiva: **"Quando faz sentido"** (6 sinais). Portfólio (destaques + carrossel) puxa do
mesmo Supabase do branding — as duas telas ficam em sincronia.
- [x] **Discoverability:** linkada na seção "Serviços" da home — `Services.tsx`, item "Rebranding" → "Ver serviço"
  aponta para `/servicos/rebranding` (mesmo padrão do Branding). Nav e footer seguem sem link direto (opcional).

## Padrões estabelecidos
- **Logo:** SVG oficial (símbolo ⋈ + wordmark), header 24px/28px, footer 28px, `alt="MAM Branding"` — extraído do site no ar
- **Fontes:** Fraunces (display) + Inter (texto) + JetBrains Mono (labels)
- **Cores:** fundo #fff, texto #0d0d0d, muted #737373, mint #f0f7ea
- **Animações:** ease `cubic-bezier(.16,1,.3,1)`, reveals de 1s, stagger 90ms, respeitar `prefers-reduced-motion`

## Próximos passos (ordem)
1. Configurar as env vars do Supabase na Vercel (ver seção "Banco de dados") antes do próximo deploy
2. Subir as imagens/vídeos reais da Black Herva pelo painel
3. Cadastrar os próximos cases do portfólio pelo painel (mesmo template, sem código)
4. Conectar domínio mambranding.com.br (por último)
