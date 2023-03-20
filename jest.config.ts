import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  projects: ['native', 'web', 'api-client', 'translations'],
  verbose: true,
  bail: !!process.env.CI, // fail fast
  coverageDirectory: '<rootDir>/reports/coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/reports/unit-test',
      },
    ],
  ],
  maxWorkers: '50%'
}

export default config
