import type { Config } from '@jest/types'

const config: Partial<Config.GlobalConfig> = {
  verbose: true,
  projects: ['web', 'native', 'api-client', 'translations'],
  reporters: [
    ['default', {}],
    [
      'jest-junit',
      {
        outputDirectory: 'reports/unit-test',
      },
    ],
  ],
  coverageDirectory: 'reports/coverage',
}

export default config
