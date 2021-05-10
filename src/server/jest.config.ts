import { Config } from '@jest/types'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import baseConfig from '../../jest.config'

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'server',
  testEnvironment: 'node',
  rootDir: '.',
  setupFilesAfterEnv: ['jest-extended'],
  globalSetup: '<rootDir>/__tests__/config/globalSetup.ts',
  globalTeardown: '<rootDir>/__tests__/config/globalTeardown.ts',
}

export default config
