import type { Config } from '@jest/types'

const config: Partial<Config.GlobalConfig> = {
  rootDir: '.',
  verbose: true,
  projects: ['web', 'native', 'shared', 'translations'],
  // 500 MB limit
  workerIdleMemoryLimit: process.env.CI ? 500_000_000 : undefined,
  reporters: [
    ['default', {}],
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/reports/unit-test',
      },
    ],
  ],
  coverageDirectory: '<rootDir>/reports/coverage',
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}'],
}

export default config
