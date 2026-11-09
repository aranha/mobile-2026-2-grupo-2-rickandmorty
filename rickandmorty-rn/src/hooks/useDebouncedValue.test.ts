import { act, renderHook } from '@testing-library/react-native';
import { useDebouncedValue } from './useDebouncedValue';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

async function renderDebounced(initial: string) {
  return renderHook(({ value }: { value: string }) => useDebouncedValue(value, 400), {
    initialProps: { value: initial },
  });
}

describe('useDebouncedValue', () => {
  it('começa com o valor inicial', async () => {
    const { result } = await renderDebounced('');

    expect(result.current).toBe('');
  });

  it('só emite o novo valor depois do atraso', async () => {
    const { result, rerender } = await renderDebounced('');

    await rerender({ value: 'rick' });
    await act(() => jest.advanceTimersByTime(399));
    expect(result.current).toBe('');

    await act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe('rick');
  });

  it('digitando rápido, emite só o último valor', async () => {
    const { result, rerender } = await renderDebounced('');

    await rerender({ value: 'r' });
    await act(() => jest.advanceTimersByTime(300));
    await rerender({ value: 'ri' });
    await act(() => jest.advanceTimersByTime(300));
    await rerender({ value: 'rick' });
    await act(() => jest.advanceTimersByTime(300));
    // 900 ms depois da primeira tecla, mas nenhuma pausa de 400 ms: nada emitido ainda.
    expect(result.current).toBe('');

    await act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe('rick');
  });
});
