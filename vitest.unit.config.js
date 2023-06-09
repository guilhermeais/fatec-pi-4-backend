import { defineConfig, mergeConfig } from 'vitest/dist/config'
import baseConfig from './vitest.config.js'
/**
 * Unit testing configuration for Vitest
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/*.spec.js'],
    },
  })
)
