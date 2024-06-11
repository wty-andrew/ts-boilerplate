import pino from 'pino'
import type { Options as OtelOptions } from 'pino-opentelemetry-transport'

import { SERVICE_NAME, SERVICE_VERSION, isDev } from './config.mjs'

const transport = pino.transport({
  targets: [
    {
      target: 'pino-opentelemetry-transport',
      options: {
        loggerName: SERVICE_NAME,
        serviceVersion: SERVICE_VERSION,
        logRecordProcessorOptions: [{ recordProcessorType: 'batch' }],
      },
    } as pino.TransportTargetOptions<OtelOptions>,
    {
      target: isDev ? 'pino-pretty' : 'pino/file',
    },
  ],
})

export default pino({ base: undefined }, transport)
