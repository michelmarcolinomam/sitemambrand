# Handoff — Tela de Rótulos e Embalagens (site MAM)

> Escrito em 02/10/2026 para continuar o trabalho desta tela em outra conversa.
> Repositório: `~/Desktop/_MAM_Agencia/MAM-site-limpo` · Produção: https://mambrand.com.br

---

## O que é

Portfólio de rótulos e embalagens da MAM, no ar em **`/rotulos-e-embalagens`**,
administrado em **`/admin` → aba Galeria**. Já está linkado no menu do site.

**Não é portfólio por cliente.** É uma vitrine do que a agência produziu — o projeto
narrado por cliente vive nos cases e nas páginas de marca. Decisão do Michel.

## Estado hoje

- Página e painel **no ar e funcionando** (commit `f0829d6`).
- **1 peça cadastrada** (Black Erva, uma embalagem) e ela está **despublicada** —
  esperando o Michel revisar a legenda e ligar o interruptor.
- A legenda que está lá é **rascunho escrito pelo Claude**, não é texto aprovado:
  *"Linha fit de tereré em três sabores, pensada para leitura rápida na gôndola."*

## Como funciona

**Cada peça tem uma ficha e um carrossel:**

| Campo | Papel na tela |
|---|---|
| `kind` | **Tipo do material** — é o que lidera o card, em corpo grande (Rótulo, Embalagem, Pote, Lata, Garrafa, Sacaria, Cartucho, Caixa, Display, Kit) |
| `client` | Cliente, em corpo menor abaixo do tipo |
| `caption` | Legenda curta: o que aquele projeto resolveu |
| `images` | Conjunto `[{url, alt, w, h}]`. A primeira é a capa; as outras viram carrossel |
| `size` | Peso na página: `auto` (normal), `larga` (destaque), `grande` (abertura) |
| `published`, `sort_order`, `service` | Controle |

Tabela: **`gallery_pieces`** no Supabase do projeto `mam-site` (`uelrxokvxiqgjdlwhkzw`),
com RLS igual às demais: público só lê o publicado, escrita só do admin.

**Layout — "ritmo por faixas":** peça `grande` abre uma faixa inteira, `larga` divide a
faixa 7/5 com a seguinte, e as normais entram de três em três. A função `compor()` em
`src/routes/rotulos-e-embalagens.tsx` faz isso.

## As quatro decisões que custaram caro — não desfazer sem conversar

**1. Nada de formulário.** O fechamento da página é WhatsApp direto. O Michel já mandou
tirar um `ContactCTA` que eu tinha deixado ali. Vale para audiovisual também.

**2. A ficha fica FORA da imagem e sempre visível.** Nunca em hover. Motivo dado por ele:
quase todo o tráfego é celular, onde hover não existe, e obrigar um toque para descobrir
o que a peça é cria um movimento a mais sem necessidade.

**3. A proporção vem do arquivo, nunca do layout.** Foi o erro que quebrou o primeiro
upload real: um mockup 16:9 entrou num bloco quase quadrado com `object-cover` e a arte
foi cortada (no celular sobrava 69% da largura). Hoje o painel lê largura e altura no
upload, guarda em `images[].w/h`, e o card usa isso como `aspect-ratio` com
`object-contain`. **Imagem deitada entra deitada. Nada é cortado.**

**4. Tipo é lista fechada** (array `TIPOS` em `src/routes/admin/galeria.tsx`). Com texto
livre o site acumularia "rótulo", "Rótulo" e "ROTULO" como três coisas. Para somar um
tipo novo, basta incluir no array.

## Arquivos

```
src/routes/rotulos-e-embalagens.tsx       página pública (compor() faz o ritmo das faixas)
src/routes/admin/galeria.tsx              painel (TIPOS = lista fechada)
src/components/galeria/PieceLightbox.tsx  carrossel com a ficha ao lado
src/components/admin/PieceImages.tsx      upload em lote; lê w/h antes de subir
```

## Pendências

- [ ] **Material.** Só 1 peça cadastrada. O acervo tem 53 marcas e ~1.100 pastas de rótulo
      e embalagem no servidor, mas os arquivos não estão no Mac — o Michel precisa indicar
      onde buscar. `~/Desktop/_Clientes` só tem social media.
- [ ] **Revisar a legenda da Black Erva** e publicar a peça.
- [ ] **Converter PNG → JPG no upload.** O primeiro arquivo subiu com 920 KB; em JPG daria
      uns 120 KB. Com 30 peças isso decide se a página abre rápido no 4G.
- [ ] **Autoria:** o acervo tem pelo menos um caso de trabalho de OUTRO estúdio guardado em
      pasta de cliente (Vaso in Casa, creditado à zeal design). Conferir antes de publicar
      peça que venha do servidor.

## Como o Michel trabalha (vale para qualquer mexida aqui)

- **Tela nova ou mudança visual de peso → proposta primeiro**, publicada como Artifact,
  com conteúdo real. Só vira código depois do "pode subir". Responder uma pergunta dele
  não é autorização para codar.
- **Sem material real, desenhe** (silhueta, bloco de cor) e diga que é marcador — nunca
  foto de outra coisa fingindo ser o trabalho dele.
- **Sessões paralelas:** ele roda vários Claudes na mesma pasta. Conferir `git status`
  antes, commitar só os próprios arquivos. Hoje a LP `/alinhamento` está sem commit no
  working tree — não encostar.
- **Push na `main` = deploy na Vercel.** Só com autorização explícita dele.
