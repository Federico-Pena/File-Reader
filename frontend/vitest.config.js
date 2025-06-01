import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    include: ['src/tests/**/*.test.ts'],
    exclude: ['src', 'node_modules'],
    environment: 'jsdom'
  }
})
