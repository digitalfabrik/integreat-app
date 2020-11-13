module.exports = {
  rootDir: 'src/',
  verbose: true,
  automock: false,
  setupFiles: [
    '<rootDir>/../setupTest.js'
  ],
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
  moduleFileExtensions: [
    'js'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  globals: {
    __DEV__: false
  },
  collectCoverageFrom: [
    '**/*.{js,jsx}'
  ],
  coverageDirectory: '<rootDir>/../coverage'
}
