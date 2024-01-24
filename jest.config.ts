import type { Config } from '@jest/types'

const config: Partial<Config.GlobalConfig> = {
  rootDir: '.',
  verbose: true,
  projects: ['web', 'native', 'shared', 'translations'],
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
