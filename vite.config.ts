import path from 'node:path'
import {
  remarkCodeHike,
  recmaCodeHike,
  type CodeHikeConfig,
} from 'codehike/mdx'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// @ts-ignore
import theme from './theme'

const config: CodeHikeConfig = {
  components: { code: 'Code' },
  syntaxHighlighting: { theme },
}

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [[remarkCodeHike, config]],
        recmaPlugins: [[recmaCodeHike, config]],
      }),
    },
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
