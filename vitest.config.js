import { defineConfig } from 'vitest/dist/config'

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**'],
    globals: true,
    passWithNoTests: true,
    setupFiles: ['tests/jest-cucumber-config.js']
  },
})
