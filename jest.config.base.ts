import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testRegex: '/__tests__/.*\\.(test|spec)\\.[jt]sx?$',
}

export default config
