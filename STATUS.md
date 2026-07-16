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
- **Tabelas:** `cases` (portfólio + página completa em `content` jsonb), `portfolio_projects` (carrossel), `contacts` (formulário). `cases` e `portfolio_projects` têm a coluna **`service`** (`branding` / `rebranding`, default `branding`) que separa o portfólio de cada tela de serviço.
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
| **Serviços / Ciclo de Marca** | `src/routes/servicos.ciclo-de-marca.tsx` → `/servicos/ciclo-de-marca` | 🟡 Criada (2026-07-13) — acessível por URL, **ainda não linkada**. Portfólio é lista editorial **estática** (não puxa do banco — por decisão) |
| **Cases (dinâmico)** | `src/routes/cases.$slug.tsx` → `/cases/[slug]` | ✅ No ar — template único alimentado pelo banco. Agora com bloco opcional "Antes/Depois" (rebranding) |
| **Case Ranken** | `/cases/ranken` | ✅ Publicado (2026-07-13) com **imagens fictícias (picsum)** — trocar pelas reais no painel |
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

## Comparativo Antes/Depois + Case Ranken (2026-07-13)
Novo bloco **exclusivo de rebranding**: comparativo "antes e depois" como **díptico full-bleed** — as duas
imagens conectadas como um único quadro dividido ao meio por uma **linha central fina** (`h-[78vh]`, padrão
Repertório/Histórias). Ambas **foscas/mate** (`brightness .94` + véu; `saturate .85` no depois) — sem brilho.
O **antes** em preto-e-branco, o **depois** em cor. Rótulos "Antes/Depois" **abaixo**, em Fraunces (display),
seguidos dos 4 tópicos de cada lado em listas com divisores finos (antes em cinza / depois em preto forte).
Fundo branco do site — a profundidade vem das imagens grandes, não de fundo colorido. Integrado ao **template compartilhado**
como seção **opcional** — não duplicou template. Como funciona:
- Shape: `identity.comparison` em `src/lib/case-content.ts` (liga/desliga via `enabled`).
- Render: componente `BeforeAfterComparison` em `src/components/case/CaseBlocks.tsx`; a rota
  `cases.$slug.tsx` mostra o comparativo quando ligado, senão o par simples de imagens (branding intacto).
- Editor: chave "Comparativo antes / depois" na seção Identidade do `/admin/cases/$id` — liga o bloco e
  edita rótulos, imagens (4:3) e tópicos de cada lado.
- **Ordem da galeria de identidade** (2026-07-13): 1 imagem grande · 2 box com dois (logo/paleta) ·
  3 imagem grande · 4 box com três · 5 imagem grande · 6 box com dois (`beforeAfter`) · 7 antes/depois
  (comparativo, só rebranding) **encerrando a seção**. Vale pro template todo; no branding (comparativo
  desligado) a seção termina no box com dois da posição 6.

**Ranken** (`/cases/ranken`) cadastrado direto no banco como case real, **publicado com placeholders picsum**.
Pendências de conteúdo (resolver pelo painel):
- [ ] Trocar todas as imagens picsum pelas reais (hero, identidade, comparativo antes/depois, aplicações, capa do card)
- [ ] Tiles "Novo logotipo" e "Paleta cromática" — subir os arquivos (hoje aparecem como placeholder)
- [ ] IDs dos 2 vídeos do YouTube (campos "ID do vídeo" no editor)
- [ ] Foto real do founder no depoimento
- [ ] Revisar se o card do Ranken deve aparecer no portfólio de branding também (as duas telas puxam a mesma base)

## Ciclo de Marca (2026-07-13)
Tela de serviço criada a partir de layout do chat, mesma linguagem editorial das outras telas de serviço.
Reusa `Navbar`, `Footer`, `SectionKicker`, `Reveal`/`Rise`, `ArrowLink`, `ContactForm`, `ScrollProgress`.
Estrutura (7 seções, numeradas 01–07): **01 Hero + gráfico do ciclo** (faixa mint full-bleed com curva SVG
+ 5 fases: Introdução · Crescimento · Platô · Declínio · Reestruturação — geometria idêntica à seção da home),
**02 O problema** (seção dark, 4 erros), **03 O que é** (+ caixa mint), **04 Entregáveis** (3 artefatos),
**05 Resultado** (3 benefícios), **06 Portfólio** (lista editorial), **07 Contato** (mesmo form do rebranding).

Decisões desta tela (definidas pelo Michel):
- **Portfólio é estático, não puxa do banco.** As telas de case do Ciclo de Marca são um formato diferente de
  branding/rebranding e serão pensadas separadamente. Lista fica no array `portfolio` da rota (só a Black Herva
  aponta pra um case real; os demais são placeholders "Cliente 0X").
- **Não linkada ainda.** A rota existe e abre por URL, mas o item 04 "Ciclo de Marca" da seção Serviços da home
  (`Services.tsx`) segue caindo em "Saber mais" → #contato. Ligar o `to: "/servicos/ciclo-de-marca"` quando aprovar.

**Hero (layout) — 2026-07-13:** o hero foi remontado no **mesmo layout da seção 3 da home** (o
`CicloDeMarca` "Metodologia proprietária"): fundo **mint**, kicker no topo, **título à esquerda**
(col-span-7) + **texto de apoio + CTA à direita** (col-start-9), e o **gráfico animado full-width embaixo**.
Conteúdo é o que o Michel codou. O navbar/logo é o `<Navbar/>` oficial (`/mam-logo.svg`) — não recriar na mão.
Navbar agora com **fundo branco sólido** (`bg-background`, era `/85` que sobre o mint puxava esverdeado) — mudança global no `Navbar.tsx`.
Valores finais da animação: pontos **pretos** (`fill-foreground`), traço **2,25px**, desenho de **6s**.
Gráfico fica num container mais largo que o texto (`max-w-[1680px]`) e a curva se espalha mais pras laterais
(nós em `cicloNodes`, x de 45 a 970).

**Animação do gráfico (hero) — 2026-07-13:** o gráfico do ciclo se CONSTRÓI ao entrar em tela: a curva se
desenha da esquerda p/ direita e cada fase (número + título + texto) aparece no instante em que o traço
alcança o ponto dela. Componente `src/components/servico/CicloAnimatedChart.tsx` (Framer Motion).

**Forma da curva (do desenho do Michel, IMG_1008):** 6 pontos, 5 rótulos. Nós em `cicloNodes` na rota
(`servicos.ciclo-de-marca.tsx`); o componente constrói a curva suave a partir deles (`buildSmoothPath`).
Estrutura: Introdução→Crescimento baixo e quase reto · subida ao Platô · Platô→Declínio alto e plano ·
queda ao vale (Reestruturação) · retomada subindo a um 6º ponto SEM rótulo = o próximo ciclo recomeçando.
A **legenda** é uma linha de 5 colunas iguais abaixo do gráfico (decisão do Michel: não colar em cada ponto).

Sincronismo medido da geometria real (`getPointAtLength`), não estimado. Desenho linear de 2,6s; cada fase
entra em ~0 · 0,49 · 0,96 · 1,76 · 2,11s (o platô cria pausa natural entre Platô e Declínio). Um único
`useInView` observa o `<div>` HTML (IO em elementos SVG é não-confiável) e dispara tudo via `animate`.
Dispara uma vez; respeita `prefers-reduced-motion` (mostra o gráfico já construído). Prévia aprovável em
Artifact (fluxo do projeto).

Pendências:
- [ ] Aprovar a **animação do gráfico** (prévia enviada em Artifact) e o visual da tela
- [ ] Aprovado o visual, linkar na home (item 04 de `Services.tsx`) + avaliar nav/footer/sitemap
- [ ] Definir como apresentar cada cliente e trocar os placeholders "Cliente 0X" do array `portfolio`
- [ ] Links reais das redes sociais (const `socials` na rota — mesma pendência das outras telas)

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
