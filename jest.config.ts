import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  rootDir: '.',
  verbose: true,
  projects: ['web', 'native', 'shared', 'translations'],
  workerIdleMemoryLimit: process.env.CI ? '500MB' : undefined,
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
