# Como editar a Wiki do Refúgio

Cada guia é um arquivo `.md` nesta pasta. O site lê direto daqui: depois de salvar, a mudança aparece em até 5 minutos.

## Editar um guia
1. Abra o arquivo do guia (ex.: `mekanism.md`) e clique no lápis (Edit).
2. Escreva e clique em **Commit changes**.

No site, o link **Sugerir correção no GitHub** no fim de cada guia abre essa mesma tela.

## Criar um guia novo
1. Crie o arquivo `nome-do-guia.md` aqui (só letras minúsculas, números e hífen).
2. Adicione uma linha em `indice.json`, dentro de `"guias"`:
   `{"slug": "nome-do-guia", "titulo": "Título", "resumo": "Uma frase", "categoria": "mods", "cor": "#F2B01E", "atualizado": "2026-11-07"}`
3. Para deixar escondido enquanto escreve, acrescente `"rascunho": true`. O guia abre pelo link direto (`#wiki/nome-do-guia`), mas não aparece nas listas.

Categorias: `comeco`, `servidor`, `comandos`, `jogadores`, `mods`, `endgame`. Cores usadas: `#F2B01E` (dourado), `#18B5AF` (ciano), `#7B52E6` (roxo), `#4F4870` (cinza).

## Guia escrito por um jogador (Wiki dos jogadores)
Use a categoria `jogadores` e acrescente o nick e a data de quem escreveu:
`{"slug": "jogadores-nome-do-guia", "titulo": "Título", "resumo": "Uma frase", "categoria": "jogadores", "cor": "#18B5AF", "autor": "NickDoJogador", "data": "2026-11-08"}`

No topo da página aparece "Wiki escrita por", com a cabeça do personagem, o nick e a data. No cartão da lista aparece "por NickDoJogador".

## O que dá para usar no texto
- `## Título de seção` e `### Subtítulo` (as seções `##` viram o índice "Nesta página")
- `**negrito**`, `*itálico*`, listas com `-` ou `1.`
- `` `/comando` `` vira um botão que copia o comando; `` `texto` `` vira código
- Links: `[texto](https://...)`, `[outro guia](#wiki/mekanism)`, `[regras](#regras)`
- Imagens do repositório: `![descrição](img/arquivo.webp)` ou `![descrição](itens/arquivo.png)`
- Tabelas com `|` (a segunda linha é `|---|---|`)
- Caixas: comece a linha com `> [!DICA]`, `> [!AVISO]`, `> [!IMPORTANTE]` ou `> [!NOTA]` e continue com `> texto`
