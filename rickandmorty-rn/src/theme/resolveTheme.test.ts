import { resolveTheme } from './resolveTheme';

describe('resolveTheme', () => {
  it.each([
    ['system', 'light', 'light'],
    ['system', 'dark', 'dark'],
    ['light', 'light', 'light'],
    ['light', 'dark', 'light'],
    ['dark', 'light', 'dark'],
    ['dark', 'dark', 'dark'],
  ] as const)('preferência %s com sistema %s → %s', (preference, system, expected) => {
    expect(resolveTheme(preference, system)).toBe(expected);
  });

  it.each([null, undefined, 'unspecified'] as const)('"sistema" sem resposta do aparelho (%s) cai no claro', (system) => {
    expect(resolveTheme('system', system)).toBe('light');
  });

  it('escolha explícita vale mesmo sem resposta do aparelho', () => {
    expect(resolveTheme('dark', null)).toBe('dark');
  });
});
