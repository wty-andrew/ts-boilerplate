/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import { remarkCodeHike } from '@code-hike/mdx'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
  plugins: [
    react(),
    mdx({
      remarkPlugins: [[remarkCodeHike, { theme: 'one-dark-pro' }]],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
