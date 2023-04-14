import { defineConfig } from 'vitest/dist/config'

export default defineConfig({
  test: {
    include: ['**/*.*-spec.js'],
    exclude: ['**/node_modules/**'],
    globals: true,
    passWithNoTests: true,
    setupFiles: ['tests/jest-cucumber-config.js']
  },
})
