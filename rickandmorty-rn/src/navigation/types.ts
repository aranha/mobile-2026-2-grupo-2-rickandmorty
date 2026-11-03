import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TabParamList = {
  Characters: undefined;
  Episodes: undefined;
  Favorites: undefined;
};

// Os detalhes ficam por cima das abas: dá para abrir um personagem a partir de qualquer aba.
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  CharacterDetail: { id: number; name?: string };
  EpisodeDetail: { id: number; code?: string };
};

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

// Deixa o useNavigation() tipado em qualquer componente.
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
