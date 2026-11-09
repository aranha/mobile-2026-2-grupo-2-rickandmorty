# Projeto Final — Grupo 2 · Rick and Morty + React Native

Plano de trabalho e checklist por integrante. Mesmo grupo do `amp-2026-2-grupo-2`.

| | |
|---|---|
| **App** | Rick and Morty (personagens + episódios) em React Native / Expo |
| **Repo** | `aranha/mobile-2026-2-grupo-2-rickandmorty` (público) · app na pasta `rickandmorty-rn/` |
| **Prazo** | Aula 6 — **data: conferir no Canvas** · apresentação ao vivo de até 20 min |
| **Valor** | 30 pts (UI/UX 8 · Arquitetura+ADR 7 · Funcionalidade 6 · Apresentação 4 · Contribuição 3 · Qualidade 2) |

> **Grupo de 7 → 7 features, 1 por pessoa** (o enunciado exige isso para grupo maior que 4 e pede para
> avisar o professor — o aviso vai no corpo da issue de reserva).

---

## 1. Decisões já tomadas

| Tema | Decisão | Alternativa descartada (vai no ADR) |
|---|---|---|
| Framework | React Native + Expo (SDK 57, do skeleton) | Flutter / KMP — o grupo inteiro já fez a A2 em RN |
| Estado do servidor | **TanStack Query** (cache, paginação infinita, loading/erro prontos) | fetch + `useEffect` à mão — repete loading/erro em toda tela |
| Estado do cliente | **Zustand** + `persist` (favoritos e tema) | Context + useReducer — verboso, re-render difícil de controlar com 7 mexendo |
| Persistência | AsyncStorage via `createJSONStorage` | MMKV — mais rápido, mas exige módulo nativo; ganho irrelevante para poucos ids |
| UI | React Native Paper (Material 3) + `expo-image` | Componentes do zero — não dá tempo de ficar consistente |
| Navegação | React Navigation: bottom tabs + stack por aba | Expo Router — o skeleton já vem com React Navigation |

## 2. As 7 features

| # | Feature | Dono | Branch |
|---|---|---|---|
| F1 | **Lista** de personagens com scroll infinito | Paulo | `feat/lista` |
| F2 | **Detalhe** do personagem | Vinícius | `feat/detalhe` |
| F3 | **Busca** por nome (+ estados vazio/erro/offline) | Hugo | `feat/busca` |
| F4 | **Filtro** por status (Alive / Dead / unknown) | Guilherme | `feat/filtro` |
| F5 | **Favoritos** persistidos | Marcus | `feat/favoritos` |
| F6 | **Episódios** (aba + detalhe + "aparece em") | Rafael | `feat/episodios` |
| F7 | **Tema claro/escuro** + design system | Sesaque | `feat/tema` |

Além delas, transversais: **CI + testes** (Guilherme), **README** (Marcus), **ADR + roteiro** (Paulo).

## 3. Arquitetura (contrato que o scaffold já cria)

```
rickandmorty-rn/src/
  api/          client.ts · characters.ts · episodes.ts       ← só HTTP + DTO → modelo
  domain/       character.ts · episode.ts · filters.ts        ← tipos + funções puras (o que se testa)
  queries/      useCharacters · useCharacter · useEpisodes…   ← hooks TanStack Query
  hooks/        useDebouncedValue                             ← hooks de UI sem rede
  stores/       favoritesStore.ts · themeStore.ts             ← Zustand + persist
  theme/        tokens.ts · paperThemes.ts · ThemeProvider    ← cores/tipo/espaço em um lugar só
  components/   CharacterCard · StatusBadge · Skeleton · ErrorState · EmptyState · FavoriteButton
  screens/      só UI — nunca `fetch` aqui dentro
  navigation/   RootTabs · stacks
```

**Contrato que destrava o paralelismo** (vem no PR de scaffold, com stubs):

```ts
// queries/useCharacters.ts — F1, F3 e F4 usam o MESMO hook
useCharacters(filters: { name?: string; status?: 'alive' | 'dead' | 'unknown' })
// → GET /character?page=N&name=...&status=...  (a API aceita os dois juntos)
```

**Gotchas da API** (rickandmortyapi.com, sem key):
- Busca sem resultado responde **404** `{"error":"There is nothing here"}` → tem que virar **estado vazio**, não erro.
- `/character/1,2,3` devolve **array**, mas `/character/1` devolve **objeto** → normalizar no `api/`.
- Episódio vem como `"S01E01"` e o personagem traz `episode: [urls]` → extrair ids das URLs.
- O skeleton salva favoritos na chave `favorite_pokemon_ids` (copiado da PokeAPI) → renomear.

**Cada pendência está no código como `TODO(F<n> · <nome>)`** — `grep -rn "TODO(F3" rickandmorty-rn/src`.

**Arquivos têm dono** (ver `.github/CODEOWNERS`). Mexeu no arquivo de outra pessoa? Avisa no grupo e marca a pessoa como reviewer.

---

## 4. Checklist por integrante

Regra de todos: **branch própria, ≥ 1 PR seu, commits com o seu usuário do GitHub**, ≥ 1 teste da sua
lógica, ≥ 1 screenshot da sua feature para o README, e saber explicar sua parte e a arquitetura na arguição.

### 1 · Paulo Aranha *(líder)* — Fundação, F1 Lista, ADR

**Fundação (PR #1 — até o fim do dia 1, todo mundo depende dele)**
- [x] Abrir a issue de reserva no repo do professor e avisar que o grupo tem 7 ([#248](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/issues/248))
- [x] Criar o repo `aranha/mobile-2026-2-grupo-2-rickandmorty`, público
- [x] Convidar os 6 como collaborators
- [ ] Proteger a `main`: só merge por PR com 1 aprovação + CI verde
- [x] Copiar o skeleton para `rickandmorty-rn/`, renomear o app (`app.json`, `package.json` está como `gabarito`)
- [x] Instalar TanStack Query, Zustand, Paper, `expo-image`, bottom tabs
- [x] Montar a estrutura da seção 3 com **stubs** de cada dono (telas vazias, hooks e stores tipados)
- [x] `api/client.ts` com base URL, timeout e erro tipado (`NotFound` / `Network` / `Http`)
- [x] Navegação: abas Personagens · Episódios · Favoritos + stack para os detalhes
- [x] Template de PR e `CODEOWNERS` (o dono do arquivo vira reviewer automático)
- [x] Checklist compartilhado em que cada um marca o que fez ([artifact](https://claude.ai/artifact/5U739c6GiGkoC3RyMEH4ex), no lugar do GitHub Projects)

**F1 — Lista**
- [x] `useCharacters` com `useInfiniteQuery` (veio no scaffold)
- [x] `toCharacterSummary` e `toCharacterPage` em `api/characters.ts`
- [x] `FlatList` com scroll infinito, pull-to-refresh e rodapé carregando
- [x] Usar `CharacterCard` / `Skeleton` do Sesaque e `ErrorState` do Hugo
- [x] Teste: `toCharacterPage` (`info.next` "...?page=3" → `nextPage: 3`; `null` → `null`; "Alive" → "alive")

**Documentos e coordenação**
- [x] `ADR.md` (~1 página): por que RN, por que Query + Zustand, alternativas da seção 1 — [`rickandmorty-rn/ADR.md`](../rickandmorty-rn/ADR.md)
- [ ] Review e merge dos PRs; `main` sempre buildando
- [ ] Roteiro cronometrado da apresentação (seção 5) e ensaio geral
- [ ] Colar a URL do repo no Canvas

### 2 · Vinícius Eduardo — F2 Detalhe

- [x] `useCharacter(id)` + `api/characters.ts#getById`
- [x] Tela de detalhe: foto grande, nome, `StatusBadge`, espécie, gênero, origem, localização atual
- [x] Espaço reservado para a seção "Aparece em N episódios" (o Rafael preenche)
- [x] `FavoriteButton` do Marcus no header
- [x] Ao vir da lista, mostrar nome e foto já em cache enquanto o resto carrega (`initialData` / `placeholderData`)
- [x] Botão compartilhar (`Share` do RN): "Conheça Rick Sanchez — Human, Alive"
- [x] Teste: mapeamento DTO → `CharacterDetail` (campos vazios como `type: ""` viram "—")

### 3 · Guilherme Jeske — F4 Filtro + CI + Jest

**F4 — Filtro**
- [x] Chips Todos · Vivos · Mortos · Desconhecido no topo da lista (`Chip` do Paper, testID `category-chip-<status>`)
- [x] Filtro vai para `useCharacters({ status })` — filtro **na API**, não na página carregada
- [x] Funciona combinado com a busca do Hugo (`?name=rick&status=dead`) — falta só o campo de busca (F3)
- [x] Teste: `buildCharacterQuery(filters, page)` monta os parâmetros certos (vazio, só status, os dois, nome só com espaços)

**CI e testes (para o grupo inteiro)**
- [x] Configurar Jest (`jest-expo`) + `@testing-library/react-native` (v14: `render`/`fireEvent` são `await`)
- [x] GitHub Actions em todo PR: `npm ci` → `tsc --noEmit` → `npm test` → `expo prebuild` → `assembleRelease` (`.github/workflows/ci.yml`, verde no PR #6)
- [x] Gerar o APK como artefato do CI (vira o plano B da demo) — artefato `rickandmorty-apk` na aba Actions; é release assinado com a chave de debug, porque o APK debug só abre com o Metro rodando
- [x] Conferir no fim que existem **≥ 3 casos** de teste passando (meta: 7+, um por pessoa) — 82 hoje (10 suítes)

### 4 · Hugo Piani — F3 Busca + estados vazio/erro/offline

**F3 — Busca**
- [x] Campo de busca (`Searchbar` do Paper) acima da lista (testID `search-input`)
- [x] Debounce de ~400 ms antes de chamar `useCharacters({ name })` (`hooks/useDebouncedValue.ts`)
- [x] Busca sem resultado (404 da API) → `EmptyState` "Nenhum personagem com esse nome"
- [x] Teste: `api/characters` transforma 404 em lista vazia, e 500 continua sendo erro

**Estados (todas as telas usam)**
- [x] `ErrorState` com mensagem clara e botão "Tentar de novo" (`refetch`) — ícone e título pelo tipo de `ApiError` (sem internet / API com erro)
- [x] `EmptyState` com ilustração/ícone e texto por contexto
- [x] Banner de sem internet (`@react-native-community/netinfo`) + `onlineManager` do TanStack Query — no topo das abas; a consulta pausa e retoma sozinha
- [x] Teste: hook de debounce (só emite o último valor após o atraso)
- [x] Screenshots de busca, vazio, erro e sem internet em [`docs/screenshots/`](screenshots/) para o README

### 5 · Marcus Santos — F5 Favoritos + README

**F5 — Favoritos**
- [x] `favoritesStore` (Zustand + `persist` + AsyncStorage), chave nova (não `favorite_pokemon_ids`)
- [x] Guardar um **snapshot** (id, nome, foto, status) para a aba funcionar sem internet
- [x] `FavoriteButton` reutilizável (detalhe e card da lista), com feedback (Snackbar "Adicionado")
- [x] Aba Favoritos: lista, remover com desfazer, estado vazio "Toque na ★ para salvar"
- [x] Badge com a contagem de favoritos no ícone da aba
- [x] Teste: `toggleFavorite` adiciona, remove e não duplica

**README.md do app**
- [x] O que o app faz · como rodar **com o `cd rickandmorty-rn`** · como rodar os testes
- [ ] **≥ 3 screenshots** (juntar os de cada um; claro e escuro) · link para o `ADR.md`
- [ ] Testar o README do zero num clone limpo, numa máquina que não seja a sua

### 6 · Rafael Lima — F6 Episódios

- [x] `api/episodes.ts`: lista paginada (`/episode`, 51 episódios) e por ids (`/episode/1,2,3`)
- [x] Aba Episódios agrupada por temporada (`SectionList`: Temporada 1 … 5)
- [x] Detalhe do episódio: nome, código, data de exibição, grade com os personagens (toque → detalhe)
- [x] Seção "Aparece em N episódios" no detalhe do personagem (no espaço que o Vinícius deixa)
- [x] Teste: `parseEpisodeCode("S02E07")` → `{ season: 2, episode: 7 }` e `groupBySeason`
- [x] Teste: `idsFromUrls` extrai ids das URLs e normaliza objeto × array

### 7 · Sesaque Cruz — F7 Tema claro/escuro + design system

**F7 — Tema**
- [x] `theme/tokens.ts`: cores, tipografia, espaçamento, raio — **um lugar só**
- [x] Temas Paper MD3 claro e escuro com a paleta do desenho (verde portal, ciano, fundo espacial)
- [x] `themeStore` persistido: Sistema · Claro · Escuro; seletor no header das abas (`ThemeMenu`)
- [x] Teste: `resolveTheme(preferencia, esquemaDoSistema)` cobre os 3 × 2 casos (+ sistema sem resposta)
- [x] Teste: contraste WCAG AA de todos os pares de cor dos dois temas (`theme/contrast.test.ts`)

**Design system (UI/UX vale 8 pts — é a maior fatia)**
- [x] `CharacterCard` e `StatusBadge` (verde/vermelho/cinza) usados por todos
- [x] `Skeleton` com shimmer no lugar do spinner solto (`CharacterCardSkeleton` no mesmo formato do card)
- [x] Placeholder e fallback nas imagens (`expo-image` com `placeholder` + `transition`)
- [x] Fonte própria (`@expo-google-fonts`) para títulos (Fredoka)
- [x] Ícone e splash próprios (substituir os do skeleton)
- [x] Passada final: paisagem, fonte grande do sistema, `accessibilityLabel` nos botões de ícone
- [x] Screenshots claro, escuro e seletor em [`docs/screenshots/`](screenshots/) para o README

---

## 5. Cronograma (D = dia em que o repo é criado; ajustar pela data da Aula 6)

| Quando | Marco | Quem |
|---|---|---|
| **D** | Issue de reserva aberta · repo criado · todos aceitaram o convite | Paulo + todos |
| **D+1** | PR #1 (scaffold + stubs) mergeado · CI rodando | Paulo, Guilherme |
| **D+1** | Cada um com `git config user.email` = e-mail do GitHub e a branch criada | todos |
| **D+2 a D+5** | Features em paralelo, PR pequeno e cedo (rascunho vale) | todos |
| **Aula 6 − 2 dias** | **Freeze**: tudo mergeado, só correção de bug daqui em diante | todos |
| **Aula 6 − 1 dia** | Screenshots no README · build limpo · **ensaio cronometrado** · URL no Canvas | Marcus, Paulo |

**Roteiro da demo (até 20 min, com perguntas → mirar 14 min de fala):**

| Bloco | Min | Quem |
|---|---|---|
| Abertura + arquitetura (camadas, Query × Zustand, ADR) | 2 | Paulo |
| Lista com scroll infinito | 1,5 | Paulo |
| Busca + estados (modo avião ao vivo) | 1,5 | Hugo |
| Filtro, combinado com a busca | 1,5 | Guilherme |
| Detalhe + compartilhar | 1,5 | Vinícius |
| Episódios + navegação cruzada | 1,5 | Rafael |
| Favoritos (fecha o app, reabre, continua lá) | 1,5 | Marcus |
| Tema claro/escuro + design system | 1,5 | Sesaque |
| Testes + CI verde | 1 | Guilherme |
| Perguntas | ~6 | todos |

Plano B da demo: APK do CI já instalado no celular **e** no emulador, e vídeo gravado.

## 6. Pendências antes de começar

- [x] **Data da Aula 6**: seg 09/11 · limite interno do grupo: dom 08/11
- [x] **Issue de reserva** (Paulo, [#248](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/issues/248)) em `jacksonsmith/puc-iec-mobile-multiplataforma` — em 2026-11-02
      ninguém tinha reservado. Título:
      `Grupo Paulo, Vinícius, Guilherme, Hugo, Marcus, Rafael, Sesaque — Rick and Morty + React Native`
      e no corpo: "Grupo de 7 integrantes, 7 features (1 por pessoa): as 5 do enunciado + Episódios e Tema claro/escuro."
- [ ] Todos com Node LTS, Android Studio e um emulador (API 35) rodando o skeleton **antes** do D+1
- [x] Logins do GitHub para os convites: `Vicinius115`, `GuilhermeJeske1006`, `hugofpiani`,
      `marcus-santos`, `olimarafael`, `sesaquecruz`
- [ ] Vinícius: no repo anterior parte dos commits saiu com o autor `1310290` → acertar o
      `git config user.name/user.email` para a Contribuição individual contar certo
