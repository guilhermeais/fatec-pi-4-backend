import { defineConfig, mergeConfig } from 'vitest/dist/config'
import baseConfig from './vitest.config.js'
/**
 * BDD testing configuration for Vitest
 */
export default mergeConfig(baseConfig, defineConfig({
  test: {
    include: ['**/*.bdd-spec.js']
  }
}))
