import type { CharacterStatus } from '../domain/character';

export interface StatusFilterChipsProps {
  /** undefined = "Todos". */
  value?: CharacterStatus;
  onChange: (status: CharacterStatus | undefined) => void;
}

// TODO(F4 · Guilherme): chips Todos · Alive · Dead · unknown (CHARACTER_STATUSES).
export function StatusFilterChips(_props: StatusFilterChipsProps) {
  return null;
}
