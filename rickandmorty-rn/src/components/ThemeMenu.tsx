import { useState, type ComponentProps } from 'react';
import { IconButton, Menu } from 'react-native-paper';
import { useThemeStore, type ThemePreference } from '../stores/themeStore';

type IconName = ComponentProps<typeof IconButton>['icon'];

const OPTIONS: readonly { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: 'system', label: 'Sistema', icon: 'cellphone' },
  { value: 'light', label: 'Claro', icon: 'white-balance-sunny' },
  { value: 'dark', label: 'Escuro', icon: 'weather-night' },
];

/** Botão do header que abre Sistema · Claro · Escuro; a escolha fica salva (themeStore). */
export function ThemeMenu() {
  const [open, setOpen] = useState(false);
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const current = OPTIONS.find((option) => option.value === preference) ?? OPTIONS[0];

  return (
    <Menu
      visible={open}
      onDismiss={() => setOpen(false)}
      anchorPosition="bottom"
      anchor={
        <IconButton
          icon="theme-light-dark"
          onPress={() => setOpen(true)}
          accessibilityLabel={`Tema do app: ${current.label}`}
          testID="theme-menu-button"
        />
      }
    >
      {OPTIONS.map((option) => {
        const selected = option.value === preference;
        return (
          <Menu.Item
            key={option.value}
            title={option.label}
            leadingIcon={option.icon}
            trailingIcon={selected ? 'check' : undefined}
            onPress={() => {
              setPreference(option.value);
              setOpen(false);
            }}
            accessibilityState={{ selected }}
            testID={`theme-option-${option.value}`}
          />
        );
      })}
    </Menu>
  );
}
