// Mock oficial do AsyncStorage: sem ele, stores com `persist` quebram no Jest (não há módulo nativo).
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mesmo motivo para o NetInfo, que o queryClient.ts registra no onlineManager ao ser importado.
jest.mock('@react-native-community/netinfo', () => require('@react-native-community/netinfo/jest/netinfo-mock.js'));
