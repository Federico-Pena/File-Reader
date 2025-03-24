import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['backend/tests/**/*.test.ts'],
    exclude: ['frontend', 'src', 'node_modules']
  }
})
