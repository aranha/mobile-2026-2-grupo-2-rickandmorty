# ADR — React Native com TanStack Query e Zustand

**Status:** aceita · **Data:** 04/11/2026 · **Grupo 2** — Projeto Final, app Rick and Morty

## Contexto

Sete pessoas, cinco dias e sete features (lista, detalhe, busca, filtro, favoritos, episódios e tema
claro/escuro) sobre a [Rick and Morty API](https://rickandmortyapi.com): pública, sem chave, paginada
(826 personagens, 20 por página) e com filtro por `status` e `name` no próprio endpoint. O app precisa
tratar carregando, vazio e erro em todas as telas e buildar no Android, que é critério eliminatório.

O que mais pesou: **sete pessoas trabalhando em paralelo sem se bloquear**, e a maior parte do estado
ser **dado do servidor** (listas e detalhes), não do usuário.

## Decisão

1. **React Native + Expo (SDK 57)**, a partir do skeleton da disciplina. O grupo inteiro já tinha feito a
   Atividade 2 em RN, então ninguém precisou aprender o framework durante o projeto.
2. **Camadas com dependência em um sentido só:** `screens → queries/stores → api → domain`. A tela nunca
   chama `fetch`; a `api/` é a única que conhece o formato cru da API (`dto.ts`) e devolve tipos de
   `domain/`; as regras puras (mapeamento, paginação, agrupamento por temporada, tema) ficam em funções
   sem React, e é nelas que estão os testes.
3. **Estado do servidor no TanStack Query.** Cache por chave (`queries/keys.ts`), paginação com
   `useInfiniteQuery`, cancelamento, retry (menos em 404, que não melhora tentando de novo) e os estados
   `isPending`/`isError` prontos. Lista, busca e filtro usam o **mesmo hook** `useCharacters(filters)`:
   busca e filtro só mudam o `filters`, e cada combinação ganha o próprio cache.
4. **Estado do cliente no Zustand com `persist` + AsyncStorage**, só para o que é do usuário: favoritos
   (com um *snapshot* de nome, foto e status, para a aba funcionar sem internet) e a preferência de tema.
5. **React Native Paper (Material 3)** como base visual, com tokens em `theme/` e temas claro e escuro
   ligados também ao React Navigation.
6. **React Navigation:** abas (Personagens, Episódios, Favoritos) com os detalhes num stack por cima, para
   abrir um personagem a partir de qualquer aba.

## Alternativas descartadas

| Alternativa | Por que não |
|---|---|
| Flutter ou KMP | Também usados na disciplina, mas exigiriam o grupo inteiro trocar de stack com cinco dias de prazo. |
| `fetch` + `useEffect` em cada tela | Sete telas repetindo loading, erro, retry e paginação à mão, cada uma de um jeito; foi o que o skeleton trazia e o que a rubrica de arquitetura penaliza. |
| Só Zustand, inclusive para os dados da API | Teríamos de reescrever cache, invalidação e paginação que o TanStack Query já resolve. |
| Context + `useReducer` | Sem biblioteca, mas verboso, e qualquer mudança no contexto re-renderiza todos os consumidores. |
| Redux Toolkit (+ RTK Query) | Resolve o mesmo problema com mais cerimônia (slices, store, provider) do que o tamanho do app pede. |
| MMKV no lugar do AsyncStorage | Mais rápido, mas exige módulo nativo; para algumas dezenas de favoritos a diferença não aparece. |
| Expo Router | Roteamento por arquivos é ótimo, mas o skeleton já vinha com React Navigation e migrar não muda nada para o usuário. |
| Atualizar para o SDK 58 | O Expo Go da loja já está no 58, mas atualizar muda React Native e bibliotecas para os sete a cinco dias do prazo. Quem testa pelo Expo Go usa o Expo Go do SDK 57. |

## Consequências

- **Bom:** cada integrante é dono de arquivos próprios (ver `.github/CODEOWNERS`) e trabalha contra
  contratos que já existiam no primeiro dia (`useCharacters`, `ApiError`, `favoritesStore`), então
  as features andaram em paralelo.
- **Bom:** loading, erro e vazio saem do mesmo lugar (o estado da query) em todas as telas; erro ao
  carregar a página seguinte não apaga a lista já carregada.
- **Bom:** a lógica testável não depende de React nem de rede — os testes chamam funções puras com o JSON
  que a API devolve.
- **Custo:** duas bibliotecas de estado para aprender e explicar. A regra que o grupo segue: *veio da API,
  é Query; é escolha do usuário, é Zustand.*
- **Custo:** busca e filtro dependem da rede (filtro na API, não na página carregada); sem internet,
  aparece só o que já está em cache e os favoritos.
