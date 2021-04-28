module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/__tests__/.*\\.(test|spec)\\.[jt]sx?$',
  setupFilesAfterEnv: ['<rootDir>/jest/jest.setup.ts'],
  globalSetup: '<rootDir>/jest/globalSetup.ts',
  globalTeardown: '<rootDir>/jest/globalTeardown.ts',
}
