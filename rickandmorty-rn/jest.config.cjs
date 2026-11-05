/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  // android/ e ios/ são gerados pelo `expo prebuild`; não devem entrar no Jest.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/android/', '<rootDir>/ios/'],
  modulePathIgnorePatterns: ['<rootDir>/android/', '<rootDir>/ios/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  clearMocks: true,
};
