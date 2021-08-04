import { Config } from '@jest/types'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import baseConfig from '../../jest.config'

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'renderer',
  rootDir: '.',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
}

export default config
