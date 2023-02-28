import { Config } from '@jest/types'

import baseConfig from '../../jest.config'

const config: Config.InitialOptions = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
}

export default config
