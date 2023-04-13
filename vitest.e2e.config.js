import { defineConfig, mergeConfig } from 'vitest/dist/config'
import baseConfig from './vitest.config.js'
/**
 * E2E configuration for Vitest
 */
export default mergeConfig(baseConfig, defineConfig({
  testMatch: ['**/*.bdd-test.js'],
}))
