O Mekanism é o mod de tecnologia que mais rende no começo do ATM10: com ele você multiplica cada minério que minera, de 2 até 5 lingotes por minério. Este guia mostra a ordem para montar tudo sem se perder.

> [!DICA]
> Abra o **JEI** (a lista de itens do lado direito) e aperte **R** em cima de qualquer máquina para ver a receita, ou **U** para ver onde ela é usada. As receitas podem mudar entre versões do modpack, então o JEI é sempre a fonte certa.

## Energia para começar

Todas as máquinas do Mekanism precisam de energia. As opções mais fáceis no início:

- **Wind Generator (gerador eólico):** não gasta combustível. Rende mais quanto mais alto estiver, então coloque no alto de uma torre.
- **Solar Generator (gerador solar):** também não gasta nada, mas só funciona de dia e com céu aberto.
- **Heat Generator:** queima carvão, lenha ou fica perto de lava.

Ligue os geradores às máquinas com **Universal Cable** e guarde a energia sobrando numa **Energy Cube**.

## Os materiais básicos

Quase tudo no Mekanism usa estes três itens. Monte cedo:

- **Osmium:** minério novo do Mekanism. Comum, perto do fundo do mapa.
- **Steel (aço):** feito na **Metallurgic Infuser** com ferro e carvão.
- **Circuitos:** começam no **Basic Control Circuit** (osmium + redstone na Metallurgic Infuser) e evoluem para Advanced, Elite e Ultimate.

## Processamento de minério

Cada nível acrescenta máquinas na frente do anterior. Não precisa pular direto para o 5x: monte em etapas.

| Nível | Máquina que entra | O que ela usa |
|---|---|---|
| 2x | Enrichment Chamber | só energia |
| 3x | Purification Chamber + Crusher | oxigênio |
| 4x | Chemical Injection Chamber | cloreto de hidrogênio |
| 5x | Chemical Dissolution Chamber, Washer e Crystallizer | ácido sulfúrico e água |

### 2x: Enrichment Chamber

Coloque o minério e saem **2 pós**. Leve os pós a uma fornalha e pronto: o dobro de lingotes. É a primeira máquina que vale a pena fazer.

### 3x: Purification Chamber

A **Purification Chamber** transforma minério em 3 **clumps** usando **oxigênio**. Depois:

1. **Crusher** transforma os clumps em **dirty dust**.
2. **Enrichment Chamber** limpa o dirty dust e vira pó.
3. Fornalha: pó vira lingote.

O oxigênio sai do **Electrolytic Separator**, que separa água em oxigênio e hidrogênio. Coloque uma bomba elétrica (**Electric Pump**) num lago para não faltar água.

### 4x: Chemical Injection Chamber

A **Chemical Injection Chamber** transforma minério em 4 **shards** usando **hydrogen chloride** (cloreto de hidrogênio). Os shards entram na Purification Chamber e seguem o caminho do 3x.

Para fazer o hydrogen chloride, a **Chemical Infuser** junta **hidrogênio** (do Electrolytic Separator) com **cloro**. O cloro vem da água salgada (**brine**), feita na **Thermal Evaporation Plant** e separada no Electrolytic Separator.

### 5x: Chemical Dissolution Chamber

O último nível transforma minério em **slurry** (uma pasta líquida):

1. **Chemical Dissolution Chamber** dissolve o minério com **sulfuric acid**.
2. **Chemical Washer** limpa a slurry com água.
3. **Chemical Crystallizer** transforma a slurry limpa em 5 **crystals**.
4. Os crystals entram na Chemical Injection Chamber e seguem o caminho do 4x.

O ácido sulfúrico sai da cadeia **enxofre → dióxido de enxofre → trióxido de enxofre → ácido sulfúrico**, feita entre a Chemical Oxidizer e a Chemical Infuser. Veja cada passo no JEI.

## Dicas para não travar

- Troque as máquinas soltas por **Factories** (Basic, Advanced, Elite, Ultimate): elas processam vários itens ao mesmo tempo.
- Use **Logistical Transporters** ou dutos de outros mods para levar os itens de uma máquina para a próxima.
- Coloque **Upgrades de velocidade e energia** nas máquinas que viram gargalo.

> [!AVISO]
> Máquinas demais num chunk só deixam o servidor pesado para todo mundo. Prefira poucas máquinas com Factories e upgrades a dezenas de máquinas lado a lado.
