const config = {
  rootDir: '.',
  verbose: true,
  projects: ['web', 'native', 'api-client', 'translations'],
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
}
export default config
