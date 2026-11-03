# Rick and Morty — app

> README provisório do scaffold. A versão final (o que o app faz, ≥ 3 screenshots, link do `ADR.md`)
> é a tarefa do Marcus — ver [`docs/plano-de-trabalho.md`](../docs/plano-de-trabalho.md).

## Como rodar

```bash
cd rickandmorty-rn
npm install
npx expo run:android   # a primeira vez compila o projeto nativo; precisa de emulador aberto
```

Antes de abrir PR:

```bash
npm run typecheck
npx expo prebuild --platform android   # se não buildar, a Funcionalidade zera
```

## Onde fica cada coisa

```
src/
  api/          HTTP + formato cru da API (dto.ts) → modelos de domain/
  domain/       tipos e funções puras — é aqui que moram os testes
  queries/      hooks do TanStack Query (estado do servidor)
  stores/       Zustand (favoritos e tema — estado do cliente)
  theme/        tokens, temas claro/escuro do Paper
  components/   peças reutilizáveis
  screens/      só UI: nenhuma tela chama fetch
  navigation/   abas + stack dos detalhes
```

## Onde está a minha parte

Cada pendência está marcada com `TODO(F<n> · <nome>)`:

```bash
grep -rn "TODO(F3" src   # troque F3 pela sua feature
```
