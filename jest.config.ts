import { Config } from '@jest/types'

import baseConfig from './jest.config.base'

const config: Config.InitialOptions = {
  ...baseConfig,
  projects: ['<rootDir>/src/main', '<rootDir>/src/renderer'],
}

export default config
