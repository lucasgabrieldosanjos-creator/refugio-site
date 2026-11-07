# Fórum do site

A página Fórum do site lê `dados/forum.json` deste repositório. Quem gera o arquivo é o exportador do servidor,
lendo o canal de fórum do Discord. Enquanto o arquivo não existir, a página mostra "O fórum está chegando".

```json
{
  "atualizado": "2026-11-07T15:30:00-03:00",
  "canal": {"url": "https://discord.com/channels/ID_DO_SERVIDOR/ID_DO_CANAL"},
  "tags": [{"id": "123", "nome": "Dúvida", "emoji": "❓"}],
  "posts": [{
    "id": "456",
    "titulo": "Título do tópico",
    "autor": {"nome": "Apelido no servidor", "avatar": "https://cdn.discordapp.com/avatars/..."},
    "tags": ["123"],
    "criado": "2026-11-07T10:00:00-03:00",
    "ultima_atividade": "2026-11-07T15:00:00-03:00",
    "respostas": 12,
    "resumo": "Primeiros 280 caracteres da mensagem inicial, sem formatação",
    "imagem": "https://cdn.discordapp.com/attachments/... (primeira imagem do post, opcional)",
    "url": "https://discord.com/channels/ID_DO_SERVIDOR/ID_DO_TOPICO",
    "fixado": false
  }]
}
```

- Só links `https://discord.com/...` e imagens de `cdn.discordapp.com` / `media.discordapp.net` são aceitos pelo site.
- Até 60 tópicos. Fixados aparecem primeiro; o resto por última atividade.
