# Status do Site MAM Branding

> Quadro de obra do projeto. Toda sessão (chat ou Claude Code) começa lendo este arquivo.
> Ao fechar qualquer etapa, atualizar aqui. Última atualização: 2026-07-17.

---
## 🚦 HANDOFF — onde estamos (2026-07-17)

### ⭐ PONTO DE RETOMADA (ler isto primeiro — próximo chat)
**Fase atual: Bloco 2 — Google Ads.** Estado agora:
- ✅ **Site + SEO 100%** no ar (mambrand.com.br). **GA4 medindo** (G-BSFQ9JTVPQ), `generate_lead` dispara no form. **GA4↔Ads vinculado.**
- ✅ **Conta Ads 707-107-4993** em **Modo Especialista** (nome na conta = "MAM Publicidade"). Tem **GBP**: MAM Publicidade, Av. Guaiapó 2577, Maringá.
- ✅ **4 campanhas de Pesquisa PUBLICADAS e PAUSADAS** (R$ 0/dia, nada gasta): **S_Marca_BR3** (R$6/dia, Brasil, →home) · **S_Branding_PR** (R$20, PR, →/branding) · **S_Rebranding_PR** (R$15, PR, →/rebranding) · **S_Diagnostico_PR** (R$15, PR, →/ciclo-de-marca). Padrão: Search-only, Maximizar cliques + teto CPC (marca R$3, resto R$6), IA Max off, keywords frase/exata, RSA 5 títulos+2 descrições, conversão generate_lead herdada.

**ATUALIZAÇÃO 2026-07-27 (sessão Claude+Michel): MEDIÇÃO 100% FECHADA ✅**
- ✅ **CARTÃO resolvido** — Mastercard ••••9083 é a forma de pagamento PRINCIPAL, sem erro; as 2 Visas problemáticas (0227 recusada / 2001 inutilizável) foram excluídas pelo Michel.
- ✅ **`generate_lead` = evento-chave no GA4** (trava do Google liberou; estrela marcada em Admin→Eventos).
- ✅ **Conversão importada no Ads**: "Enviar formulário de lead → MAM GESTÃO (web) generate_lead", marcada Principal. Sugestões lead_form/form_submit IGNORADAS de propósito (evitar contagem dupla).
- ✅ **`ADS_ID` preenchido**: `AW-18328861802` (tag "MAM Publicidade", + GT-KV5FFJTC) em `src/lib/tracking.ts`, no ar — gtag agora configura GA4 + AW (remarketing automático). Commit `b61f21e`.

**🔴 PENDÊNCIAS DO MICHEL (bloqueiam ATIVAR, não montar):**
1. **Crédito R$ 880** — apareceu "não disponível"; conferir em Faturamento → Promoções / suporte Google.
2. **Verificação do anunciante** (documentos) — escolher razão social (PF Michel × CNPJ MAM) e enviar docs.
- ⚠️ O Google dispara **reauth de identidade** (login/2FA) a cada ação sensível no Ads — só o Michel conclui.

**➡️ PRÓXIMO GRANDE BLOCO = LANDING PAGES (Fase 2).** As demais campanhas (logo/identidade, sites, rótulo/embalagem, consultoria de mkt, audiovisual, verticais, + SP/SC) **NÃO foram criadas** de propósito — precisam de **LPs de conversão dedicadas** antes (senão clique cai na página errada). **Começar pela LP Diagnóstico/Ciclo de Marca** (oferta-âncora). Precisa do Michel: perguntas de qualificação do form + conteúdo/cases (ou eu rascunho). Infra da LP: template de conversão + form c/ qualificação e captura de GCLID + notificação e-mail + WhatsApp tracking.

**Entregáveis (Artifacts):** doc estratégico v1.1 completo → https://claude.ai/code/artifact/a61098e6-7783-494c-952d-d4c35ea519d5 · backlog de execução → https://claude.ai/code/artifact/15203b2d-5278-455a-a05f-8fb5b6f9857a · doc Word v1.1 em `~/Desktop/Projeto_Google_Ads_MAM_Brand_v1.1.docx`. Escopo aprovado: **robusto** (portfólio completo + LPs, geo PR>SP>SC, verba inicial = crédito R$880).

---

**Marca:** é **MAM Brand** (NÃO "Branding"). Site no ar em **https://mambrand.com.br** (domínio próprio + SSL). "branding" só sobrevive como nome do *serviço* (`/branding`).

**Fase concluída → SEO on-page 100% completo e no ar.** Feito nesta sessão:
- **Domínio conectado** (DNS na HostGator/cPanel → Vercel). ⚠️ **NUNCA tocar em MX/SPF/DKIM** (e-mail Titan). Site = apex A `216.198.79.1` + `www` CNAME `cname.vercel-dns.com` (redirect 308 → apex).
- **URLs limpas** de intenção: `/branding` `/rebranding` `/ciclo-de-marca` (sem `/servicos/`, sem redirect duplicado).
- **SEO técnico:** sitemap dinâmico (`src/routes/sitemap[.]xml.ts`), robots com `Sitemap:` + `Disallow /admin`, **canonical** por rota (global via `useRouterState` no `__root`), **Open Graph completo** incl. imagem `public/og-cover.jpg` (1200×630), **JSON-LD** em `src/lib/seo.ts` (Organization + WebSite + ProfessionalService **Maringá-PR** + Service por página + BreadcrumbList nos cases). H1 auditado (ok). Títulos/descrições com keyword comercial.
- **Contato real:** e-mail `contato@mambrand.com.br`, WhatsApp `44988085474` (wa.me/5544988085474), Maringá-PR, redes (IG/LinkedIn/YouTube em `sameAs`). Módulo `src/lib/seo.ts` centraliza.
- **GA4 + conversão medindo:** conta **MAM GESTÃO**, fluxo Web, **Measurement ID `G-BSFQ9JTVPQ`** (em `src/lib/tracking.ts`). gtag no `__root`. Evento **`generate_lead`** dispara no envio real do form (home + serviço) — **CONFIRMADO no Tempo Real do GA4**.
- **Search Console:** propriedade `https://mambrand.com.br` **verificada** (auto, via tag GA4) + **sitemap enviado** (Processado, 9 páginas).
- **Limpeza do domínio:** o domínio tinha histórico de site WordPress/spam (13k+ páginas). Removi os 7 sitemaps velhos do GSC + submeti remoções de prefixo (`/vendor/`, `/wp-content/`, `/serpihan-debu/`). URLs velhas dão 404 → Google desindexa ao longo de semanas.

**Pendências pequenas (não bloqueiam):**
- [ ] Monitorar em GSC → Páginas a queda do spam ao longo das semanas.
- [ ] Ciclo de Marca ainda tem portfólio placeholder ("Cliente 0X") — o Michel edita.

**✅ CAMPANHAS MONTADAS E PAUSADAS (2026-07-17).** Conta **707-107-4993** (nome comercial na conta = "MAM Publicidade") migrada para **Modo Especialista** (Brasil · GMT-3 Brasília · BRL). Billing cadastrado, MAS há erro persistente **"Nova forma de pagamento exigida — não é possível efetuar a cobrança"** (o cartão não passa) → **RESOLVER em Faturamento antes de qualquer ativação** (as campanhas nem veiculam enquanto isso). Também: **crédito R$ 880** apareceu como "não disponível" numa tela (conferir/acionar suporte), **verificação do anunciante** pendente (documentos), e o Google dispara reauth de identidade a cada ação sensível (só o Michel conclui — login/2FA). **4 campanhas de Pesquisa publicadas e PAUSADAS** (Total conta R$ 0/dia): **S_Marca_BR3** (R$6/dia, geo Brasil, →home, defesa de marca só frase/exata p/ colisão MAM×museu) · **S_Branding_PR** (R$20/dia, Paraná, →/branding) · **S_Rebranding_PR** (R$15/dia, Paraná, →/rebranding) · **S_Diagnostico_PR** (R$15/dia, Paraná, →/ciclo-de-marca). Todas: Rede de Pesquisa apenas (Display/Parceiros off), Maximizar cliques c/ teto CPC (marca R$3, resto R$6), IA Max off, keywords frase/exata, RSA 5 títulos+2 descrições no tom "estratégia antes de estética / +13 anos / Maringá-PR", conversão generate_lead herdada da conta (meta "Enviar formulários de lead"). **Faltam (Fase 2, precisam das LPs):** campanhas de logo/identidade, sites, rótulo, consultoria-mkt, audiovisual, verticais, + SP/SC. **Pra ATIVAR:** billing OK + verificação do anunciante + generate_lead como evento-chave (trava Google) importado no Ads + "pode ativar" do Michel.

**➡️ FASE ANTERIOR (Bloco 2) — setup Google Ads.** Conta Ads: **707-107-4993** ("Conta do Google Ads", sob o login contato@mamgestao.com). Progresso desta sessão (2026-07-17):
- ✅ **GA4 ↔ Google Ads VINCULADOS** (feito no lado do GA4: Admin → Vínculos de produtos → Contas vinculadas do Google Ads → Vincular → conta 707-107-4993). Auto-tagging (codificação automática, modo recomendado), publicidade personalizada e acesso do Ads aos recursos GA = **ativos**. "VINCULAÇÃO CRIADA" — pode levar 24h p/ exibir dados.
- ⏳ **Marcar `generate_lead` como evento-chave** — **BLOQUEADO pela trava do Google**: o evento dispara (confirmado no Tempo Real) mas ainda NÃO caiu em GA4 → Admin → Exibição de dados → Eventos → aba "Eventos recentes" (só aparecem first_visit/page_view/scroll/session_start/user_engagement). Esta propriedade usa a UI antiga de Eventos (sem opção de criar evento-chave por nome) → só dá pra clicar na estrela **depois** que o evento aparecer (24-48h). É 1 clique.
- ⏳ **Importar a conversão no Ads** — depende do passo acima: o Ads importa conversões a partir dos *eventos-chave* do GA4. Assim que `generate_lead` virar evento-chave, importar no Ads e marcar como "Principal".
- ⏳ **Preencher `ADS_ID` (AW-XXXXXXXXX)** em `src/lib/tracking.ts` (const existe, vazia) — o AW- sai da configuração da tag/conversão no Ads (fazer junto do passo de importação).
- ✅ **Modelo completo da campanha PRONTO para revisão** (Artifact): https://claude.ai/code/artifact/f5d80175-2db3-450d-ad01-431122483182 — 2 campanhas (Serviços c/ 3 grupos por intenção Branding→/branding, Rebranding→/rebranding, Diagnóstico/Ciclo→/ciclo-de-marca; + Marca/defesa só frase-exata por causa da colisão "MAM"×Museu de Arte Moderna), ~30 keywords phrase/exact, negativas agrupadas (informacional/emprego/museu/off-target), RSAs por grupo (tom "estratégia antes de estética / +13 anos / Maringá-PR"), extensões (5 sitelinks p/ URLs limpas, 5 callouts, snippet Serviços, call (44)98808-5474, GBP), Search-only, AI Max off, Max cliques c/ teto CPC → tCPA depois. **Decisões pendentes do Michel:** geo (recomendo PR inteiro — branding tem volume baixo), orçamento (R$40 serviços + R$6 marca/dia), teto CPC (R$6), cupom (valor?), GBP (existe?).
- **Montar no Ads = PAUSADA**, só depois da revisão + medição fechada. **Nunca ligar spend sem "pode ativar"; não digitar cartão/billing** (é o Michel).
- Referência: playbook "lancamento-cliente" (framework Korthex: SEO + form Web3Forms + rastreamento) — reaproveitado, valores trocados p/ MAM.

**🎯 DECISÃO DE ESCOPO (2026-07-17):** vamos no **robusto** — portfólio COMPLETO de serviços (não só os 4 premium do site: inclui logo/identidade, sites, rotulagem/embalagem, produtos, planejamento, consultoria de mkt, audiovisual), **com landing pages de conversão dedicadas** (o site institucional NÃO é boa LP p/ mídia paga), geo **PR > SP > SC** (evolução do "Maringá+região"), venda high-ticket/consultiva → foco em lead qualificado + conversão offline via GCLID, não CPL isolado. Verba inicial = **crédito de R$ 880** ("gaste 880 ganhe 880", confirmar no pagamento). O Michel trouxe um **doc estratégico v1.0** robusto (em `~/Desktop/Projeto_Google_Ads_MAM_Brand.docx`) — adotado como plano-mãe, com 2 correções: (a) o diagnóstico de medição dele está DESATUALIZADO (dizia "GA4 sem fluxo / vínculo inexistente" — na real GA4 mede, generate_lead dispara e o vínculo foi feito hoje → Fase 1 dele já ~70% pronta); (b) manter `generate_lead` como conversão principal (já medindo), não recriar como envio_formulario/solicitar_diagnostico.

**📋 PLANO DE EXECUÇÃO (backlog completo, Artifact):** https://claude.ai/code/artifact/15203b2d-5278-455a-a05f-8fb5b6f9857a — fases: **0** fechar medição (evento-chave⏳trava, importar conversão, AW-→ADS_ID, modo especialista, cadastro/crédito=Michel) · **1** LANDING PAGES (template de conversão + form c/ qualificação e captura de GCLID + notificação e-mail + WhatsApp tracking + LGPD; LPs Fase 1 = Diagnóstico/Ciclo, Branding, Logo-Identidade, Sites; Fase 2 = Rebranding, Rotulagem, Consultoria-mkt, Audiovisual) · **2** campanhas PR pausadas (S_Marca/S_Branding_PR/S_Logo-IdentidadeVisual_PR/S_Sites_PR/S_Consultoria_PR + negativas + RSAs + extensões) · **3** QA ponta-a-ponta + "pode ativar" + aplicar crédito · **4** SP/SC, verticais, remarketing, PMax, conversões offline. **Modelo tático das campanhas premium (Artifact anterior):** https://claude.ai/code/artifact/f5d80175-2db3-450d-ad01-431122483182 (fatia de go-live PR). **Inputs pendentes do Michel:** confirmar 4 serviços do go-live · perguntas de qualificação do form · conteúdo/prova pras LPs (cases, segmentos, depoimentos) · Google Business Profile existe? · verba/dia. **Nota:** LPs "populares" (criar logo/fazer site) SÓ vão ao ar com a LP dedicada pronta — senão o clique cai em página errada e queima verba (dependência acoplada).

**Como trabalhar:** posso dirigir o Chrome logado do Michel (Vercel/HostGator/GA4/GSC/Ads) — mas **não digito senha nem cartão**, e **campos de DNS o classificador bloqueia** (o Michel digita). Michel não é programador: explicar simples. Sessões paralelas no repo: checkpoint antes de mexer, commitar só arquivos próprios; push=deploy só com aval.
---

## Endereços
- **Produção:** https://mambrand.com.br (domínio próprio, no ar) — também acessível por https://sitemambrand.vercel.app
- **Domínio final:** **mambrand.com.br** — ✅ CONECTADO em 2026-07-16 (apex A → Vercel `216.198.79.1`; `www` → CNAME `cname.vercel-dns.com` com redirect 308 → apex; SSL emitido pela Vercel). E-mail Titan (MX titan.email) intacto na HostGator. DNS gerenciado no cPanel da HostGator (NS ns1002/ns1003.hostgator.com.br).
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
- **Favicon (2026-07-20):** `public/favicon.svg` — só o símbolo ⋈ isolado do logo oficial, adaptável ao tema (preto em aba clara, branco em escura via `prefers-color-scheme`). Declarado no `<head>` em `src/routes/__root.tsx` (`rel=icon type=image/svg+xml`). Antes o site não servia favicon (`/favicon.ico` 404 → navegador mostrava a logo antiga em cache). No ar em mambrand.com.br. Falta opcional: `.png/.ico` de fallback p/ navegador bem antigo.
- **Fontes:** Fraunces (display) + Inter (texto) + JetBrains Mono (labels)
- **Cores:** fundo #fff, texto #0d0d0d, muted #737373, mint #f0f7ea
- **Animações:** ease `cubic-bezier(.16,1,.3,1)`, reveals de 1s, stagger 90ms, respeitar `prefers-reduced-motion`

## Próximos passos (ordem)
1. Configurar as env vars do Supabase na Vercel (ver seção "Banco de dados") antes do próximo deploy
2. Subir as imagens/vídeos reais da Black Herva pelo painel
3. Cadastrar os próximos cases do portfólio pelo painel (mesmo template, sem código)
4. ~~Conectar domínio~~ ✅ **FEITO (2026-07-16)** — mambrand.com.br no ar (ver Endereços)
