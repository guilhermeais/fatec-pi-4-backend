import { defineConfig, mergeConfig } from 'vitest/dist/config'
import baseConfig from './vitest.config.js'
/**
 * E2E configuration for Vitest
 */
export default mergeConfig(baseConfig, defineConfig({
  test: {
    files: ['tests/**/*.e2e-spec.ts'],
  }
}))
