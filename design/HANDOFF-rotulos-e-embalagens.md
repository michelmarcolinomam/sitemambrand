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
| `images` | Conjunto `[{url, alt, w, h, f, original, crop}]`. A primeira é a capa e define o formato no mosaico; as outras viram carrossel |
| `size` | **Sem uso desde 02/10** — o mosaico decide sozinho |
| `published`, `sort_order`, `service` | Controle |

Tabela: **`gallery_pieces`** no Supabase do projeto `mam-site` (`uelrxokvxiqgjdlwhkzw`),
com RLS igual às demais: público só lê o publicado, escrita só do admin.

**Layout — mosaico que se recompõe (02/10/2026):** só três formatos — deitada 1920×1080,
quadrada 1080×1080, em pé 1080×1920. `compor()` em `src/lib/mosaico.ts` monta faixas de altura
igual com a combinação de formatos que deixa todas perto da altura-alvo; ordem embaralhada, encaixe
sempre fechado, nunca uma peça gigante sozinha. Cada peça nova rediagrama a página.

## As quatro decisões que custaram caro — não desfazer sem conversar

**1. Nada de formulário.** O fechamento da página é WhatsApp direto. O Michel já mandou
tirar um `ContactCTA` que eu tinha deixado ali. Vale para audiovisual também.

**2. A ficha fica FORA da imagem e sempre visível.** Nunca em hover. Motivo dado por ele:
quase todo o tráfego é celular, onde hover não existe, e obrigar um toque para descobrir
o que a peça é cria um movimento a mais sem necessidade.

**3. Três formatos, corte escolhido no upload** (substituiu em 02/10 a regra antiga "a
proporção vem do arquivo"). O painel abre o corte no maior recorte centralizado; quem sobe
ajusta e o JPG sai no tamanho exato. O original fica guardado para recortar de novo. Nunca
um corte automático escondido: quem decide o que fica de fora é quem sobe a arte.

**4. Tipo é lista fechada** (array `TIPOS` em `src/routes/admin/galeria.tsx`). Com texto
livre o site acumularia "rótulo", "Rótulo" e "ROTULO" como três coisas. Para somar um
tipo novo, basta incluir no array.

## Arquivos

```
src/routes/rotulos-e-embalagens.tsx       página pública (compor() faz o ritmo das faixas)
src/routes/admin/galeria.tsx              painel (TIPOS = lista fechada)
src/components/galeria/PieceLightbox.tsx  carrossel com a ficha ao lado
src/components/admin/PieceImages.tsx      upload em lote; cada arquivo passa pelo corte
src/components/admin/CropDialog.tsx       o corte: formato, arrasto, zoom, gera o JPG
src/lib/mosaico.ts                        formatos, corte natural e compor()
```

## Pendências

- [ ] **Material.** Só 1 peça cadastrada. O acervo tem 53 marcas e ~1.100 pastas de rótulo
      e embalagem no servidor, mas os arquivos não estão no Mac — o Michel precisa indicar
      onde buscar. `~/Desktop/_Clientes` só tem social media.
- [ ] **Revisar a legenda da Black Erva** e publicar a peça.
- [x] **Converter PNG → JPG no upload** — feito junto com o corte (02/10).
- [ ] **Recortar a Black Erva** pelo botão "Recortar" para ela virar o JPG 1920×1080 (hoje ainda é o PNG).
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
