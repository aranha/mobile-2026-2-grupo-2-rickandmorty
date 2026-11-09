import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useState, type ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';
import type { CharacterFilters } from '../domain/character';
import { CharacterSearchBar } from './CharacterSearchBar';

function Providers({ children }: { children: ReactNode }) {
  // Ícone não importa aqui; evita carregar a fonte de ícones no Jest.
  return <PaperProvider settings={{ icon: () => null }}>{children}</PaperProvider>;
}

// Igual à CharactersScreen: função nova a cada render, e cada busca cria um objeto de filtro novo.
function ScreenLike({ onSearch }: { onSearch: jest.Mock }) {
  const [, setFilters] = useState<CharacterFilters>({});
  return (
    <CharacterSearchBar
      onSearch={(name) => {
        onSearch(name);
        // Trava de segurança: se houver loop, o teste falha na asserção em vez de travar o Jest.
        if (onSearch.mock.calls.length < 10) setFilters((current) => ({ ...current, name }));
      }}
    />
  );
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

async function renderSearchBar() {
  const onSearch = jest.fn();
  await render(<ScreenLike onSearch={onSearch} />, { wrapper: Providers });
  await act(() => jest.advanceTimersByTime(1000));
  return onSearch;
}

describe('CharacterSearchBar', () => {
  it('não entra em loop quando a tela passa uma função nova a cada render', async () => {
    const onSearch = await renderSearchBar();

    // Só a emissão inicial do campo vazio, mesmo com o pai re-renderizando.
    expect(onSearch.mock.calls).toEqual([['']]);
  });

  it('digitando, chama onSearch uma vez com o texto final, 400 ms depois de parar', async () => {
    const onSearch = await renderSearchBar();
    onSearch.mockClear();
    const input = screen.getByTestId('search-input');

    for (const text of ['r', 'ri', 'ric', 'rick']) {
      await fireEvent.changeText(input, text);
      await act(() => jest.advanceTimersByTime(100));
    }
    expect(onSearch).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(300));
    expect(onSearch.mock.calls).toEqual([['rick']]);
  });
});
