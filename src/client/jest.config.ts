import { Config } from '@jest/types'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import baseConfig from '../../jest.config'

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'client',
  rootDir: '.',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
}

export default config
