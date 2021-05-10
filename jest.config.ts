import { Config } from '@jest/types'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import baseConfig from './jest.config.base'

const config: Config.InitialOptions = {
  ...baseConfig,
  projects: ['<rootDir>/src/server'],
}

export default config
