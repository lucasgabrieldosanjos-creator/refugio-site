O **Applied Energistics 2** (AE2) guarda milhares de itens em discos digitais, organiza tudo num terminal com busca e, no fim, fabrica sozinho o que você pedir. Parece complicado por causa dos **canais**, mas com três regras você monta sem dor de cabeça.

> [!DICA]
> O ATM10 também traz o **MEGA Cells**, que adiciona discos e peças maiores para o AE2. Tudo deste guia vale para ele também.

## Antes de começar

Você vai precisar de:

- **Certus Quartz:** cresce a partir de **Budding Certus Quartz**, encontrado dentro dos meteoritos. Coloque **Growth Accelerators** em volta para crescer mais rápido.
- **Charged Certus Quartz:** Certus carregado no **Charger**.
- **Fluix Crystal:** Charged Certus + quartzo do Nether + redstone jogados na água.
- **Prensas do Inscriber:** as quatro prensas (Calculation, Engineering, Logic e Silicon) ficam nos **meteoritos**. Use a **Meteorite Compass** para achar um.

O **Inscriber** usa as prensas para fazer os **processadores**, que estão em quase todas as peças do AE2.

## As peças da rede

| Peça | Para que serve |
|---|---|
| ME Controller | O cérebro da rede. Libera os canais |
| ME Drive | Onde ficam os discos (cells) |
| Storage Cells | Os discos. De 1k até 256k, e maiores com MEGA Cells |
| ME Terminal | A tela para pegar e guardar itens |
| ME Crafting Terminal | Igual ao terminal, com uma mesa de craft |
| Energy Acceptor | Recebe energia de outros mods para a rede |

## As três regras dos canais

1. **Cada aparelho usa 1 canal.** Drive, terminal, interface, bus: todos contam.
2. **Cabo normal leva 8 canais. Cabo denso (Dense Cable) leva 32.** Use cabo denso no tronco e cabo normal nas pontas.
3. **Sem Controller, a rede aceita no máximo 8 aparelhos.** Com Controller, cada face dele libera 32 canais.

Quando falta canal, o aparelho fica apagado. Olhe com o **Network Tool** onde a rede está cheia.

> [!AVISO]
> Não encoste dois Controllers que não fazem parte do mesmo bloco: a rede inteira desliga. O Controller pode crescer em vários blocos, mas eles precisam formar um retângulo.

## Autocrafting

É aqui que o AE2 brilha: você pede 64 processadores e a rede busca os materiais e fabrica.

1. **Pattern Encoding Terminal:** grava receitas em **Blank Patterns**.
2. **Pattern Provider:** guarda as receitas gravadas e entrega os materiais.
3. **Molecular Assembler:** encostado no Pattern Provider, fabrica as receitas de mesa de craft.
4. **Crafting CPU:** um bloco formado por **Crafting Storage** (memória) e **Co-Processing Units** (velocidade). Sem CPU, nada é fabricado.

Para receitas de máquinas (fornalha, Mekanism, Inscriber), grave um **padrão de processamento** e coloque o Pattern Provider encostado na máquina. O que sair dela precisa voltar para a rede, por exemplo com um **Import Bus** ou pela própria máquina empurrando para uma interface.

## Dicas

- Use **Storage Bus** num baú comum para a rede enxergar o que está dentro dele.
- Um **Wireless Access Point** com o **Wireless Terminal** deixa você acessar a rede de qualquer lugar perto da base.
- Prefira discos de **tipos variados** para itens diferentes e discos grandes para itens repetidos, como pedra e terra.
