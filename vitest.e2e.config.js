import { defineConfig, mergeConfig } from 'vitest/dist/config'
import baseConfig from './vitest.config.js'
/**
 * E2E configuration for Vitest
 */
export default mergeConfig(baseConfig, defineConfig({
  test: {
    include: ['**/*.e2e-spec.js'],
    maxConcurrency: 1,
    maxThreads: 1,
    minThreads: 1,
  }
}))
