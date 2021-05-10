export default {
  rootDir: 'src/',
  verbose: true,
  automock: false,
  setupFiles: ['<rootDir>/../jest.setup.ts'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageDirectory: '<rootDir>/../reports/coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/../reports/unit-test'
      }
    ]
  ]
}
