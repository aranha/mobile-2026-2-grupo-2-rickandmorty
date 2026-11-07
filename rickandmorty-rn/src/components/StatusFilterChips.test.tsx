import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';
import type { CharacterStatus } from '../domain/character';
import { StatusFilterChips } from './StatusFilterChips';

function Providers({ children }: { children: ReactNode }) {
  // Ícone não importa aqui; evita carregar a fonte de ícones no Jest.
  return <PaperProvider settings={{ icon: () => null }}>{children}</PaperProvider>;
}

async function renderChips(value?: CharacterStatus) {
  const onChange = jest.fn();
  await render(<StatusFilterChips value={value} onChange={onChange} />, { wrapper: Providers });
  return onChange;
}

describe('StatusFilterChips', () => {
  it('mostra Todos · Vivos · Mortos · Desconhecido, com Todos marcado quando não há filtro', async () => {
    await renderChips();

    expect(screen.getByText('Todos')).toBeOnTheScreen();
    expect(screen.getByText('Vivos')).toBeOnTheScreen();
    expect(screen.getByText('Mortos')).toBeOnTheScreen();
    expect(screen.getByText('Desconhecido')).toBeOnTheScreen();
    expect(screen.getByTestId('category-chip-all')).toBeSelected();
    expect(screen.getByTestId('category-chip-dead')).not.toBeSelected();
  });

  it('marca o chip do status atual', async () => {
    await renderChips('unknown');

    expect(screen.getByTestId('category-chip-unknown')).toBeSelected();
    expect(screen.getByTestId('category-chip-all')).not.toBeSelected();
  });

  it('tocar em Mortos pede o filtro "dead"', async () => {
    const onChange = await renderChips();

    await fireEvent.press(screen.getByTestId('category-chip-dead'));

    expect(onChange).toHaveBeenCalledWith('dead');
  });

  it('tocar em Todos limpa o filtro', async () => {
    const onChange = await renderChips('alive');

    await fireEvent.press(screen.getByTestId('category-chip-all'));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('tocar no chip que já está marcado não muda nada', async () => {
    const onChange = await renderChips('dead');

    await fireEvent.press(screen.getByTestId('category-chip-dead'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
