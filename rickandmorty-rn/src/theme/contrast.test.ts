import { darkColors, lightColors } from './colors';
import { WCAG_AA_TEXT, contrastRatio, relativeLuminance } from './contrast';

describe('contrastRatio', () => {
  it('preto sobre branco é o máximo (21) e cor igual é o mínimo (1)', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#3D7A12', '#3D7A12')).toBeCloseTo(1, 5);
  });

  it('não depende da ordem das cores', () => {
    expect(contrastRatio('#FFFFFF', '#3D7A12')).toBeCloseTo(contrastRatio('#3D7A12', '#FFFFFF'), 10);
  });

  it('recusa cor fora do formato #RRGGBB', () => {
    expect(() => relativeLuminance('verde')).toThrow('Cor inválida');
  });
});

// Todo texto "on<Cor>" em cima da sua cor precisa passar no AA, nos dois temas.
const PAIRS = [
  ['onPrimary', 'primary'],
  ['onPrimaryContainer', 'primaryContainer'],
  ['onSecondary', 'secondary'],
  ['onSecondaryContainer', 'secondaryContainer'],
  ['onTertiary', 'tertiary'],
  ['onTertiaryContainer', 'tertiaryContainer'],
  ['onBackground', 'background'],
  ['onSurface', 'surface'],
  ['onSurfaceVariant', 'surfaceVariant'],
  ['primary', 'surface'],
] as const;

describe.each([
  ['claro', lightColors],
  ['escuro', darkColors],
])('tema %s', (_name, colors) => {
  it.each(PAIRS)('%s sobre %s passa no contraste AA', (foreground, background) => {
    expect(contrastRatio(colors[foreground], colors[background])).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
  });
});
