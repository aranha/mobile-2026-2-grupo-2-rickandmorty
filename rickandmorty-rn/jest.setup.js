// Mock oficial do AsyncStorage: sem ele, stores com `persist` quebram no Jest (não há módulo nativo).
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
