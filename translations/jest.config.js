module.exports = {
  rootDir: 'src/',
  verbose: true,
  automock: false,
  setupFiles: [
    '<rootDir>/../jest.setup.js'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  coverageDirectory: '<rootDir>/../reports/coverage',
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '<rootDir>/../reports/unit-test'
    }]
  ]
}
