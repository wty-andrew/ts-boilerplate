import pino from 'pino'

import { isDev } from './config.js'

const transport = pino.transport({
  target: isDev ? 'pino-pretty' : 'pino/file',
})

export default pino({ base: undefined }, transport)
