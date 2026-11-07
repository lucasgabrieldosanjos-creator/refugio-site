# Rankings do site

O site lê `dados/rankings.json` deste repositório. Basta o servidor publicar esse arquivo
(e atualizá-lo de tempos em tempos) que os rankings do site passam a mostrar os dados reais.
Enquanto o arquivo não existir, o site mostra os nomes de exemplo.

Formato (veja `exemplo-rankings.json`):

```json
{
  "atualizado": "2026-11-06T21:30:00-03:00",
  "tempo":   [{"nome": "Nick", "guilda": "Nome da guilda ou null", "valor": 182}],
  "pvp":     [{"nome": "Nick", "guilda": null, "valor": 214}],
  "mobs":    [{"nome": "Nick", "guilda": null, "valor": 16977}],
  "rankup":  [{"nome": "Nick", "guilda": null, "rank": "Mestre Arcano", "nivel": 12}],
  "guildas": [{"nome": "Ordem do Latão", "membros": 14, "nivel": 5, "cor": "#B8862B"}]
}
```

- `atualizado`: data e hora da geração (ISO 8601). O site mostra "atualizados há X min".
- `tempo.valor`: horas jogadas (número). `pvp.valor`: abates de jogadores. `mobs.valor`: mobs abatidos.
- Cada lista já vem ordenada, do 1º para baixo. O site usa os 7 primeiros.
- `rankup`: rank atual de cada jogador. `rank` é o nome que aparece no site; `nivel` é a posição do rank na escada (1 = primeiro). Ordenar por `nivel`, do maior para o menor. A aba Rank-up só aparece no site quando essa lista existe.
- `guildas.cor` é opcional (cor do ícone da guilda).
- Qualquer lista pode faltar; o site mantém o exemplo só nela.
