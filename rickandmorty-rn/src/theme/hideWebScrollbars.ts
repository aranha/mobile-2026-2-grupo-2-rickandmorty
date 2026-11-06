import { Platform } from 'react-native';

// No web, o navegador desenha uma barra de rolagem grossa e fixa ao lado de cada lista. No Android e no
// iOS só aparece um indicador fino durante a rolagem; aqui o web fica igual, sem a barra (a rolagem continua
// funcionando com toque, roda do mouse e teclado). Roda uma vez, na carga do módulo.
export function hideWebScrollbars(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const id = 'hide-scrollbars';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = '* { scrollbar-width: none; } *::-webkit-scrollbar { display: none; }';
  document.head.appendChild(style);
}
